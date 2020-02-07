import {APIError} from "components/api";

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

// Auth mocking
export const isAuthenticated = () => {
    return (typeof window !== "undefined") && ((window as any).authenticated === true) || (typeof process !== "undefined") && ((process as any).authenticated);
};

export const AuthApi: AuthApi = {
    login:(username, password) => new Promise<User>((resolve, reject) => {
        console.log("API CALL: login", username, password);
        // throw new Error("Error in login")
        // throw new APIError("Authentication Failed", "auth", 401)
        setTimeout(() => {
            if (password.length < 2) {
                reject(new APIError("Invalid username or password", 123, 401));
            } else {
                console.log("API CALL COMPLETE: login");
                const user = {
                    id: "123",
                    name: "Clem Fandango",
                    email: username
                };

                // Auth mocking
                (typeof window !== "undefined") && ((window as any).authenticated = true);
                (typeof process !== "undefined") && ((process as any).authenticated = user);

                resolve(user);
            }
        }, 1500);
    })
};
