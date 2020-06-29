import jwt from "jsonwebtoken";

type AuthOptions = {
  publicKEY: string;
  privateKEY: string;
  identificationTokenExpirySeconds: number;
  authenticationTokenExpirySeconds: number;
  issuer: string;
  audience: string;
};

type UserBase = {
  id: string;
}

import express from "express";

type AuthCookies = {
  i: string;
  a: string;
}

type UserRequest = {
  user: UserBase;
  cookies: AuthCookies;
} & express.Request

export const Auth = ({ publicKEY, privateKEY, identificationTokenExpirySeconds, authenticationTokenExpirySeconds, issuer, audience }: AuthOptions) => {
  // TODO: validate constructor values

  const getIdentityToken = (req: UserRequest) => req.cookies.i;
  const getAuthenticationToken = (req: UserRequest) => req.cookies.a;

  const withIdentifiedUserId = (req: UserRequest, res: express.Response, next: express.NextFunction) => {
    const token = getIdentityToken(req);
    console.error("@@@@TOKEN", token);
    let payload;

    if (token) {
      try {
        payload = jwt.verify(token, publicKEY) as UserBase;
      } catch (e) {
        console.error("@@@JWT ERROR", e);
        if (!(e instanceof jwt.JsonWebTokenError)) {
          return res.status(400).end();
        }
      }
    }

    if (payload?.id) {
      req.user = {
        id: payload.id
      };
    }

    next && next();
  };

  const requireAuthenticatedUser = (req: UserRequest, res: express.Response, next: express.NextFunction) => {
    const token = getAuthenticationToken(req);

    let payload;

    if (token) {
      try {
        payload = jwt.verify(token, publicKEY) as UserBase;
      } catch (e) {
        console.error("@@@JWT ERROR", e);
        if (e instanceof jwt.JsonWebTokenError) {
          return res.status(401).end();
        }

        return res.status(400).end();
      }
    } else {
      return res.status(401).end();
    }

    if (payload?.id) {
      req.user = {
        id: payload.id
      };
    }

    next && next();
  };

  const issueIdentificationToken = (res: express.Response, user: UserBase) => {
    if (!user?.id) {
      throw new Error("User not found");
    }

    const tokenIdent = jwt.sign({ id: user.id }, privateKEY, {
      algorithm: "RS256",
      issuer,
      subject: user.id,
      audience,
      expiresIn: identificationTokenExpirySeconds,
    });

    res.cookie("i", tokenIdent, {
      maxAge: identificationTokenExpirySeconds * 1000,
      httpOnly: true,
      secure: true
    });
  };

  const issueAuthenticationToken = (res: express.Response, user: UserBase) => {
    if (!user?.id) {
      throw new Error("User not found");
    }

    const tokenAuth = jwt.sign({ id: user.id }, privateKEY, {
      algorithm: "RS256",
      issuer,
      subject: user.id,
      audience,
      expiresIn: authenticationTokenExpirySeconds,
    });

    res.cookie("a", tokenAuth, {
      maxAge: authenticationTokenExpirySeconds * 1000,
      httpOnly: true,
      secure: true
    });
  };

  const issueTokens = (res: express.Response, user: UserBase) => {
    issueIdentificationToken(res, user);
    issueAuthenticationToken(res, user);
  };

  const reissueIdentificationToken = (req: UserRequest, res: express.Response, next: express.NextFunction) => {
    try {
      jwt.verify(getIdentityToken(req), publicKEY);
      issueIdentificationToken(res, req.user);
    } catch (e) {
      if (!(e instanceof jwt.JsonWebTokenError)) {
        throw e;
      }
    }

    next && next();
  }

  const reissueAuthenticationToken = (req: UserRequest, res: express.Response, next: express.NextFunction) => {
    try {
      jwt.verify(getAuthenticationToken(req), publicKEY);
      issueAuthenticationToken(res, req.user);
    } catch (e) {
      if (!(e instanceof jwt.JsonWebTokenError)) {
        throw e;
      }
    }

    next && next();
  };

  return {
    withIdentifiedUserId,
    requireAuthenticatedUser,
    issueTokens,
    reissueIdentificationToken,
    reissueAuthenticationToken
  };
};
