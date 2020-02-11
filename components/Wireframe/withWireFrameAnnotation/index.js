module.exports =
    process.env.WIREFRAME
        ? require("./withWireFrameAnnotation")
        : require("./Wrapper");
