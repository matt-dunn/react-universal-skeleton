if (process.env.WIREFRAME) {
    module.exports = require("./withWireFrameAnnotation");
} else {
    module.exports = require("./Wrapper");
}
