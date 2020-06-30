import express, { Request, Response, NextFunction } from "express";
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

type AuthCookies = {
  i: string;
  a: string;
}

type UserRequest = {
  user: UserBase;
  cookies: AuthCookies;
  method: string;
  path: string;
  baseUrl: string;
  auth: AuthAPI;
} & Request

type AuthOptions = {
  publicKEY: string;
  privateKEY: string;
  identificationTokenExpirySeconds: number;
  authenticationTokenExpirySeconds: number;
}

const signToken = (privateKEY: string, expiresIn: number, user: UserBase) => {
  return jwt.sign({id: user.id, name: user.name}, privateKEY, {
    algorithm: "RS256",
    subject: "web",
    expiresIn,
  });
};

const verifyToken = (publicKEY: string, token: string): UserBase | undefined => {
  if (token) {
    try {
      const payload = jwt.verify(token, publicKEY) as UserBase;
      return {
        id: payload.id,
        name: payload.name
      };
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
  const getIdentityToken = (req: UserRequest) => req.cookies[IDENTITY_TOKEN_NAME];
  const getAuthenticationToken = (req: UserRequest) => req.cookies[AUTH_TOKEN_NAME];

  const issueIdentificationToken = (res: express.Response, user: UserBase) => {
    if (!user?.id) {
      throw new Error("User not found");
    }

    const token = signToken(privateKEY, identificationTokenExpirySeconds, user);

    res.cookie(IDENTITY_TOKEN_NAME, token, {
      maxAge: identificationTokenExpirySeconds * 1000,
      httpOnly: true,
      secure: true
    });

    return token;
  };

  const issueAuthenticationToken = (res: express.Response, user: UserBase) => {
    if (!user?.id) {
      throw new Error("User not found");
    }

    const token = signToken(privateKEY, authenticationTokenExpirySeconds, user);

    res.cookie(AUTH_TOKEN_NAME, token, {
      maxAge: authenticationTokenExpirySeconds * 1000,
      httpOnly: true,
      secure: true
    });
  };

  const reissueIdentificationToken = (res: Response, token: string, user: UserBase) => {
    try {
      jwt.verify(token, publicKEY);
      issueIdentificationToken(res, user);
    } catch (e) {
      if (!(e instanceof jwt.JsonWebTokenError)) {
        throw e;
      }
    }
  };

  const reissueAuthenticationToken = (res: Response, token: string, user: UserBase) => {
    try {
      jwt.verify(token, publicKEY);
      issueAuthenticationToken(res, user);
    } catch (e) {
      if (!(e instanceof jwt.JsonWebTokenError)) {
        throw e;
      }
    }
  };

  const issueTokens = (res: Response, user: UserBase) => {
    issueIdentificationToken(res, user);
    issueAuthenticationToken(res, user);
  };

  const reissueTokens = (req: UserRequest, res: Response, user: UserBase) => {
    reissueIdentificationToken(res, getIdentityToken(req), user);
    reissueAuthenticationToken(res, getAuthenticationToken(req), user);
  };

  const getUser = (req: UserRequest): User | undefined => {
    // console.error("I", verifyToken(publicKEY, getIdentityToken(req)));
    // console.error("A", verifyToken(publicKEY, getAuthenticationToken(req)));

    const identifiedUser = verifyToken(publicKEY, getIdentityToken(req));
    const authorisedUser = verifyToken(publicKEY, getAuthenticationToken(req));

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

export const AuthMiddleware = (auth: AuthAPI, defineAbilitiesForUser: DefineAbilitiesForUser) => (req: UserRequest, res: Response, next: NextFunction) => {
  req.auth = auth;

  const user = auth.getUser(req);

  const abilities = defineAbilitiesForUser(user);

  const method = req.method;
  const originalUrl = req.baseUrl + req.path;

  if (user) {
    auth.reissueTokens(req, res, user);
  }

  if (!abilities.can(method, originalUrl)) {
    if (user?.authenticated) {
      return res.status(403).end();
    }
    return res.status(401).end();
  }

  if (user) {
    req.user = {
      id: user.id,
      name: user.name
    };
  }

  next();
};

