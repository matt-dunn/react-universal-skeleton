import jwt from "jsonwebtoken";

const jwtExpirySecondsIdent = 1000
const jwtExpirySecondsAuth = 2000

const issuer = "rpi";
const audience = "https://rpi.com"

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

export default app =>
  app
    .post("/api/login", (req, res) => {
      console.error("LOGIN...", req.body)

      const { username, password } = req.body;

      if (password !== "password") {
        return res.status(401).end();
      }

      const user = {
        id: "12345",
        name: "Clem Fandango",
        email: username
      }

      const tokenIdent = jwt.sign({ id: user.id }, privateKEY, {
        algorithm: "RS256",
        issuer,
        subject: user.name,
        audience,
        expiresIn: jwtExpirySecondsIdent,
      })

      res.cookie("i", tokenIdent, {
        maxAge: jwtExpirySecondsIdent * 1000,
        httpOnly: true,
        secure: true
      });

      const tokenAuth = jwt.sign({ id: user.id }, privateKEY, {
        algorithm: "RS256",
        issuer,
        subject: user.name,
        audience,
        expiresIn: jwtExpirySecondsAuth,
      })

      res.cookie("a", tokenAuth, {
        maxAge: jwtExpirySecondsAuth * 1000,
        httpOnly: true,
        secure: true
      });

      res.send(user).end();
    })
    .get("/api/list", (req, res) => {
      const token = req.cookies.a
      console.error("@@@@TOKEN", token)
      if (token) {
        try {
          const payload = jwt.verify(token, publicKEY)
          console.log("GOT PAYLOAD", payload)
          if (!payload) {
            return res.status(401).end();
          }
        } catch (e) {
          if (e instanceof jwt.JsonWebTokenError) {
            // if the error thrown is because the JWT is unauthorized, return a 401 error
            return res.status(401).end()
          }
          // otherwise, return a bad request error
          return res.status(400).end()
        }
      } else {
        return res.status(401).end();
      }

      const page = parseInt(req.query.page, 10);
      const count = parseInt(req.query.count, 10);

      const items = Array.from(Array(count).keys()).map(index => {
        const i = index + (page * count);
        return {
          id: `item-${i + 1}`,
          name: `Item ${i + 1}`
        };
      });

      res.send(items).end();
    });
