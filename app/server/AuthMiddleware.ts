import { AbilityBuilder, Ability } from "@casl/ability";
import {PureAbility} from "@casl/ability/dist/types/PureAbility";
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type User = {
  id: string;
  identified: boolean;
  authenticated: boolean;
}

function defineAbilitiesFor(user?: User) {
  const { can, cannot, rules } = new AbilityBuilder<PureAbility<any, any>>();

  can("POST", "/api/login/");

  if (user?.authenticated) {
    can("GET", "/api/list/");
  }

  // can("read", "BlogPost");
  // can manage (i.e., do anything) own posts
  // can('manage', 'BlogPost', { author: user.id });
  // // cannot delete a post if it was created more than a day ago
  // cannot('delete', 'BlogPost', {
  //     createdAt: { $lt: Date.now() - 24 * 60 * 60 * 1000 }
  // });

  return new Ability(rules);
}

type UserToken = {
  id: string;
}

const verifyToken = (publicKEY: string, token: string) => {
  if (token) {
    try {
      const payload = jwt.verify(token, publicKEY) as UserToken;
      return payload.id;
    } catch (e) {
      console.error("@@@JWT ERROR", e);
      if (!(e instanceof jwt.JsonWebTokenError)) {
        throw e;
      }
    }
  }
}

type UserBase = {
  id: string;
}

type AuthCookies = {
  i: string;
  a: string;
}

type UserRequest = {
  user: UserBase;
  cookies: AuthCookies;
} & Request

const privateKEY = "-----BEGIN RSA PRIVATE KEY-----\n" +
  "MIIBOwIBAAJBAKfn49olVVaLDRd0dPpi50Wpz99QBiJ3yiIRJTFH06kBhU6qVTS0\n" +
  "uiTZapd/e3KVsIlv3Tm1xkaPryD+DohpIaECAwEAAQJBAJ8VuO7hXH/I87h7YLIz\n" +
  "r0hz4j6FRaq2sM+iSwjsMwD2pOsdGIMHXESkn022jdPQ327/8Y/LMlk8qCbNhicd\n" +
  "MxkCIQDULuS4AgJmOfv2VWxFC2Qs+QYjuHDzop5aN+1ZW/j7awIhAMqUQ+NeBPFo\n" +
  "XfpatIOc72M5vPpO093DCnM/gT09PsYjAiEAvlROH+zVgCN1K1MW6pw8QMckRbh1\n" +
  "wWXWy7CtPGHu5n8CIGK0/aNCw4vRO8FqAv0CMc6aao9Ya3lpuKTRM6rgNb8bAiAC\n" +
  "N934USE6rkXup41F7Oo0OCRIAf73yXMED1FR9vkBoQ==\n" +
  "-----END RSA PRIVATE KEY-----";
const publicKEY = "-----BEGIN RSA PUBLIC KEY-----\n" +
  "MEgCQQCn5+PaJVVWiw0XdHT6YudFqc/fUAYid8oiESUxR9OpAYVOqlU0tLok2WqX\n" +
  "f3tylbCJb905tcZGj68g/g6IaSGhAgMBAAE=\n" +
  "-----END RSA PUBLIC KEY-----\n";

const getIdentityToken = (req: UserRequest) => req.cookies.i;
const getAuthenticationToken = (req: UserRequest) => req.cookies.a;

const identificationTokenExpirySeconds = 1000;
const authenticationTokenExpirySeconds = 100;
const issuer = "rpi";
const audience = "https://rpi.com";

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

const reissueIdentificationToken = (res: Response, token: string, user: UserBase) => {
  try {
    jwt.verify(token, publicKEY);
    issueIdentificationToken(res, user);
  } catch (e) {
    if (!(e instanceof jwt.JsonWebTokenError)) {
      throw e;
    }
  }
}

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
export const AuthMiddleware = (req: UserRequest, res: Response, next: NextFunction) => {

  console.error("I", verifyToken(publicKEY, req.cookies.i));
  console.error("A", verifyToken(publicKEY, req.cookies.a));

  const userId = verifyToken(publicKEY, req.cookies.i);
  const authorisedUserId = verifyToken(publicKEY, req.cookies.a);

  const user = (userId && {
    id: userId,
    identified: Boolean(userId),
    authenticated: (authorisedUserId && userId === authorisedUserId) || false
  }) || undefined;

  const ability = defineAbilitiesFor(user);

  const method = req.method;
  const originalUrl = req.baseUrl + req.path;
  console.error("!!!",method, originalUrl, ability.can(method, originalUrl), user)

  if (user) {
    reissueIdentificationToken(res, req.cookies.i, user);
    reissueAuthenticationToken(res, req.cookies.a, user);
  }

  if (!ability.can(method, originalUrl)) {
    if (authorisedUserId) {
      return res.status(403).end();
    }
    return res.status(401).end();
  }

  if (userId) {
    req.user = {
      id: userId
    };
  }

  next()
};

