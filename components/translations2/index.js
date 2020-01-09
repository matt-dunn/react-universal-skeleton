const {getOptions} = require("./config");

const translations = () => {
    const options = getOptions();

    console.log(options);
};





const t = translations();
console.log(t);
