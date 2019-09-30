import {APIError, APPError} from "../index";

export interface AuthUserResponse {
    id: string;
    name: string;
    email: string
}

export interface Login {
    (username: string, password: string): Promise<AuthUserResponse>;
}

export interface AuthApi {
    login: Login;
}

const exampleApi: AuthApi = {
    login:(username, password) => new Promise<AuthUserResponse>(resolve => {
        console.log("API CALL: login", username, password)
        // throw new Error("Error in login")
        // throw new APIError("Authentication Failed", "auth", 401)
        setTimeout(() => {
            console.log("API CALL COMPLETE: login")
            resolve({
                id: "123",
                name: `Clem Fandango`,
                email: username
            })
        }, 1500)
    })
}

export default exampleApi;
