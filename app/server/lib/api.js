export default app =>
  app
    .post("/api/login", (req, res) => {
      console.error("LOGIN...", req.body);

      const { username, password } = req.body;

      if (password !== "password") {
        return res.status(401).end();
      }

      const user = {
        id: "12345",
        name: "Clem Fandango",
        email: username
      };

      req.auth.issueTokens(res, user);

      res.send(user).end();
    })
    .get("/api/list", (req, res) => {
      console.error("ID", req.user);

      const page = parseInt(req.query.page, 10);
      const count = parseInt(req.query.count, 10);

      const items = Array.from(Array(count).keys()).map(index => {
        const i = index + (page * count);
        return {
          id: `item-${i + 1}`,
          name: `Item ${i + 1} - ${req.user?.id || ""}`
        };
      });

      res.send(items).end();
    });
