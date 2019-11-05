import {ValidationError} from "yup";

export type MyFormResponse = {
    chosenFlavour: string;
    yourEmail: string;
}

export const validateEmailApi = (function() {
    let t: number;

    return (email: string): Promise<boolean | ValidationError> => {
        console.log("#####VALIDATE EMAIL")
        clearTimeout(t);
        return new Promise((resolve, reject) => {
            if (email === "matt.j.dunn@gmail.com") {
                throw new Error("Email validation failed")
            }

            t = setTimeout(() => {
                // reject(new Error("Email validation failed"))
                resolve(!email.startsWith("demo@"))
            }, 0)
        })
    }
})();

export const dummyApiCall = (flavour: string, email: string): Promise<MyFormResponse> => {
    console.log("#####CALL API")
    return new Promise((resolve, reject) => {
        if (flavour === "vanilla") {
            // throw new APIError("Authentication Failed", "auth", 403)
            throw new Error("Don't like VANILLA!!!")
        }

        setTimeout(() => {
            resolve({chosenFlavour: `FLAVOUR: ${flavour}`, yourEmail: `EMAIL: ${email}`})
        }, 2000);
    })
};
