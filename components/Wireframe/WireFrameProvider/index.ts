if (process.env.WIREFRAME) {
    module.exports = require("./Provider");
} else {
    module.exports = require("./Wrapper");
}
