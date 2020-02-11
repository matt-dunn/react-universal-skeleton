module.exports =
    process.env.WIREFRAME
        ? require("./Provider")
        : require("./Wrapper");
