import {Request, Response, NextFunction} from "express";
import { Ability } from "@casl/ability";
import jwt from "jsonwebtoken";

type UserBase = {
  email: string;
  roles?: string[];
}

type User = {
  identified: boolean;
  authenticated: boolean;
} & UserBase;

export type AuthRequest = {
  user?: User;
  auth: AuthAPI;
} & Request

type AuthOptions<User extends {}> = {
  publicKEY: string;
  privateKEY: string;
  identificationTokenExpirySeconds: number;
  authenticationTokenExpirySeconds: number;
  toUser: (user: UserBase) => User;
  fromUser: (user: User) => UserBase;
}

const signToken = (privateKEY: string, expiresIn: number, payload: object) => jwt.sign(payload, privateKEY, {
  algorithm: "RS256",
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

type AuthAPI = {
  getUser: (req: AuthRequest) => User | undefined;
  issueTokens: (res: Response, user: UserBase) => void;
  reissueTokens: (res: Response, user: User) => void;
}

export const Auth = <U extends {}>({publicKEY, privateKEY, identificationTokenExpirySeconds, authenticationTokenExpirySeconds, toUser, fromUser}: AuthOptions<U>) => {
  const getIdentityToken = (req: AuthRequest) => req.cookies[IDENTITY_TOKEN_NAME];
  const getAuthenticationToken = (req: AuthRequest) => req.cookies[AUTH_TOKEN_NAME];

  const verifyUserToken = (token: string): UserBase | undefined => {
    const payload = verifyToken(publicKEY, token);

    if (payload) {
      return fromUser(payload);
    }
  };

  const signUserToken = (user: UserBase): string => {
    return signToken(privateKEY, identificationTokenExpirySeconds, toUser(user));
  };

  const issueIdentificationToken = (res: Response, user: UserBase) => {
    if (!user?.email) {
      throw new Error("User not found");
    }

    const token = signUserToken(user);

    res.cookie(IDENTITY_TOKEN_NAME, token, {
      maxAge: identificationTokenExpirySeconds * 1000,
      httpOnly: true,
      secure: true
    });

    return token;
  };

  const issueAuthenticationToken = (res: Response, user: UserBase) => {
    if (!user?.email) {
      throw new Error("User not found");
    }

    const token = signUserToken(user);

    res.cookie(AUTH_TOKEN_NAME, token, {
      maxAge: authenticationTokenExpirySeconds * 1000,
      httpOnly: true,
      secure: true
    });

    return token;
  };

  const reissueIdentificationToken = (res: Response, user: User) => {
    if (user?.identified) {
      issueIdentificationToken(res, user);
    }
  };

  const reissueAuthenticationToken = (res: Response, user: User) => {
    if (user?.authenticated) {
      issueAuthenticationToken(res, user);
    }
  };

  const issueTokens = (res: Response, user: UserBase) => {
    issueIdentificationToken(res, user);
    issueAuthenticationToken(res, user);
  };

  const reissueTokens = (res: Response, user: User) => {
    reissueIdentificationToken(res, user);
    reissueAuthenticationToken(res, user);
  };

  const getUser = (req: AuthRequest): User | undefined => {
    const identifiedUser = verifyUserToken(getIdentityToken(req));
    const authorisedUser = verifyUserToken(getAuthenticationToken(req));

    return (identifiedUser && {
      email: identifiedUser.email,
      roles: identifiedUser.roles,
      identified: Boolean(identifiedUser),
      authenticated: (authorisedUser && identifiedUser.email === authorisedUser.email) || false
    }) || undefined;
  };

  return {
    getUser,
    issueTokens,
    reissueTokens
  };
};

type DefineAbilitiesForUser = {
  (user?: User): Ability;
}

export const createAuthMiddleware = (auth: AuthAPI) => (req: Request, res: Response, next: NextFunction) => {
  (req as AuthRequest).auth = auth;

  const user = auth.getUser(req as AuthRequest);

  if (user) {
    auth.reissueTokens(res, user);
  }

  (req as AuthRequest).user = user;

  next();
};

export const createAbilitiesMiddleware = (defineAbilitiesForUser: DefineAbilitiesForUser) => (req: Request, res: Response, next: NextFunction) => {
  const method = req.method;
  const originalUrl = req.baseUrl + req.path;
  const user = (req as AuthRequest).user;

  const abilities = defineAbilitiesForUser(user);

  if (!abilities.can(method, originalUrl)) {
    if (user?.authenticated) {
      return res.status(403).end();
    }
    return res.status(401).end();
  }

  next();
};

