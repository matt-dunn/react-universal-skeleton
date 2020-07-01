import {Request, Response, NextFunction} from "express";
import { Ability } from "@casl/ability";
import jwt from "jsonwebtoken";

type UserBase = {
  id: string;
  name: string;
}

type User = {
  identified: boolean;
  authenticated: boolean;
} & UserBase;

export type AuthRequest = {
  user?: User;
  auth: AuthAPI;
} & Request

type AuthOptions = {
  publicKEY: string;
  privateKEY: string;
  identificationTokenExpirySeconds: number;
  authenticationTokenExpirySeconds: number;
}

const signToken = (privateKEY: string, expiresIn: number, payload: object) => jwt.sign(payload, privateKEY, {
  algorithm: "RS256",
  subject: "web",
  expiresIn,
});

const verifyToken = (publicKEY: string, token: string): any => {
  if (token) {
    try {
      return jwt.verify(token, publicKEY);
    } catch (e) {
      if (!(e instanceof jwt.JsonWebTokenError)) {
        throw e;
      }

      console.error("@@@JWT ERROR", e);
    }
  }
};

const IDENTITY_TOKEN_NAME = "i";
const AUTH_TOKEN_NAME = "a";

export const Auth = ({publicKEY, privateKEY, identificationTokenExpirySeconds, authenticationTokenExpirySeconds}: AuthOptions) => {
  const getIdentityToken = (req: AuthRequest) => req.cookies[IDENTITY_TOKEN_NAME];
  const getAuthenticationToken = (req: AuthRequest) => req.cookies[AUTH_TOKEN_NAME];

  const verifyUserToken = (token: string): UserBase | undefined => {
    const payload = verifyToken(publicKEY, token);

    if (payload) {
      return {
        id: payload.id,
        name: payload.name
      };
    }
  };

  const issueIdentificationToken = (res: Response, user: UserBase) => {
    if (!user?.id) {
      throw new Error("User not found");
    }

    const token = signToken(privateKEY, identificationTokenExpirySeconds, {id: user.id, name: user.name});

    res.cookie(IDENTITY_TOKEN_NAME, token, {
      maxAge: identificationTokenExpirySeconds * 1000,
      httpOnly: true,
      secure: true
    });

    return token;
  };

  const issueAuthenticationToken = (res: Response, user: UserBase) => {
    if (!user?.id) {
      throw new Error("User not found");
    }

    const token = signToken(privateKEY, authenticationTokenExpirySeconds, {id: user.id, name: user.name});

    res.cookie(AUTH_TOKEN_NAME, token, {
      maxAge: authenticationTokenExpirySeconds * 1000,
      httpOnly: true,
      secure: true
    });

    return token;
  };

  const reissueIdentificationToken = (res: Response, user?: User) => {
    if (user?.identified) {
      issueIdentificationToken(res, user);
    }
  };

  const reissueAuthenticationToken = (res: Response, user?: User) => {
    if (user?.authenticated) {
      issueAuthenticationToken(res, user);
    }
  };

  const issueTokens = (res: Response, user: UserBase) => {
    issueIdentificationToken(res, user);
    issueAuthenticationToken(res, user);
  };

  const reissueTokens = (res: Response, user?: User) => {
    reissueIdentificationToken(res, user);
    reissueAuthenticationToken(res, user);
  };

  const getUser = (req: AuthRequest): User | undefined => {
    const identifiedUser = verifyUserToken(getIdentityToken(req));
    const authorisedUser = verifyUserToken(getAuthenticationToken(req));

    return (identifiedUser && {
      id: identifiedUser.id,
      name: identifiedUser.name,
      identified: Boolean(identifiedUser),
      authenticated: (authorisedUser && identifiedUser.id === authorisedUser.id) || false
    }) || undefined;
  };

  return {
    getUser,
    issueTokens,
    reissueTokens
  };
};

type AuthAPI = ReturnType<typeof Auth>;

type DefineAbilitiesForUser = {
  (user?: User): Ability;
}

export const authMiddleware = (auth: AuthAPI) => (req: AuthRequest, res: Response, next: NextFunction) => {
  req.auth = auth;

  const user = auth.getUser(req);

  auth.reissueTokens(res, user);

  req.user = user;

  next();
};

export const abilitiesMiddleware = (defineAbilitiesForUser: DefineAbilitiesForUser) => (req: AuthRequest, res: Response, next: NextFunction) => {
  const method = req.method;
  const originalUrl = req.baseUrl + req.path;
  const user = req.user;

  const abilities = defineAbilitiesForUser(user);

  if (!abilities.can(method, originalUrl)) {
    if (user?.authenticated) {
      return res.status(403).end();
    }
    return res.status(401).end();
  }

  next();
};

