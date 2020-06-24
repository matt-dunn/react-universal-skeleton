import jwt from "jsonwebtoken";

const jwtKey = "my_secret_key"
const jwtExpirySecondsIdent = 100
const jwtExpirySecondsAuth = 20

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

      const tokenIdent = jwt.sign({ id: user.id }, jwtKey, {
        algorithm: "HS256",
        expiresIn: jwtExpirySecondsIdent,
      })

      res.cookie("i", tokenIdent, {
        maxAge: jwtExpirySecondsIdent * 1000,
        httpOnly: true,
        secure: true
      });

      const tokenAuth = jwt.sign({ id: user.id }, jwtKey, {
        algorithm: "HS256",
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
          const payload = jwt.verify(token, jwtKey)
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

      const user = {
        id: "12345",
      }

      const tokenIdent = jwt.sign({ id: user.id }, jwtKey, {
        algorithm: "HS256",
        expiresIn: jwtExpirySecondsIdent,
      })

      res.cookie("i", tokenIdent, {
        maxAge: jwtExpirySecondsIdent * 1000,
        httpOnly: true,
        secure: true
      });

      const tokenAuth = jwt.sign({ id: user.id }, jwtKey, {
        algorithm: "HS256",
        expiresIn: jwtExpirySecondsAuth,
      })

      res.cookie("a", tokenAuth, {
        maxAge: jwtExpirySecondsAuth * 1000,
        httpOnly: true,
        secure: true
      });

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
