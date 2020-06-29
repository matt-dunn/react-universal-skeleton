import {Auth} from "./Auth";

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

const auth = Auth({
  publicKEY,
  privateKEY,
  issuer: "rpi",
  audience: "https://rpi.com",
  identificationTokenExpirySeconds: 100,
  authenticationTokenExpirySeconds: 10
});

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

      auth.issueTokens(res, user);

      res.send(user).end();
    })
    // .get("/api/list", auth.requireAuthenticatedUser, auth.reissueAuthenticationToken, auth.reissueIdentificationToken, (req, res) => {
    // .get("/api/list", auth.withIdentifiedUserId, auth.reissueIdentificationToken, (req, res) => {
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
