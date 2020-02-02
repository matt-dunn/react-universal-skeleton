// import {APIError, APPError} from "components/api";

export type User = {
    id: string;
    name: string;
    email: string;
}

export type Login = {
    (username: string, password: string): Promise<User>;
}

export type AuthApi = {
    login: Login;
}

// Debug:
(typeof window !== "undefined") && ((window as any).authenticated = true);

export const AuthApi: AuthApi = {
    login:(username, password) => new Promise<User>(resolve => {
        console.log("API CALL: login", username, password);
        // throw new Error("Error in login")
        // throw new APIError("Authentication Failed", "auth", 401)
        setTimeout(() => {
            console.log("API CALL COMPLETE: login");
            (typeof window === "undefined") && ((window as any).authenticated = true);
            resolve({
                id: "123",
                name: "Clem Fandango",
                email: username
            });
        }, 1500);
    })
};
