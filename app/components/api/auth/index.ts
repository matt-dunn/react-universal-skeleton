import axios from "axios";
import {APIError, WrapWithAbortSignal} from "components/api";

export type User = {
    id: string;
    name: string;
    email: string;
}

export type Login = WrapWithAbortSignal<{
    (username: string, password: string): Promise<User>;
}>

type AuthApiOptions = {
}

export type AuthApi = {
    (options: AuthApiOptions): {
        login: Login;
    };
}

// Auth mocking
export const isAuthenticated = () => {
    return (typeof window !== "undefined") && ((window as any).authenticated === true) || (typeof process !== "undefined") && ((process as any).authenticated);
};

export const AuthApi: AuthApi = () => ({
    login: (username, password) => async signal => {
        try {
            const url = new URL("/api/login", ((typeof location !== "undefined") && location.origin) || "https://127.0.0.1:12345");

            const response = await axios.post(url.toString(), {
                username,
                password
            });

            console.error(response);

            (typeof window !== "undefined") && ((window as any).authenticated = true);
            (typeof process !== "undefined") && ((process as any).authenticated = response.data);

            console.error("!!!!!", response.data);

            return response.data;
        } catch (e) {
            if (e?.response?.status === 401) {
                throw new APIError("Invalid username or password", 123, 401);
            }

            throw e;
        }
    }
    // login:(username, password) => signal => new Promise<User>((resolve, reject) => {
    //     console.log("API CALL: login", username, password);
    //
    //     axios.post("api/login", {
    //         username,
    //         password
    //     });
    //
    //     // throw new Error("Error in login")
    //     // throw new APIError("Authentication Failed", "auth", 401)
    //     setTimeout(() => {
    //         if (password.length < 2) {
    //             reject(new APIError("Invalid username or password", 123, 401));
    //         } else {
    //             console.log("API CALL COMPLETE: login");
    //             const user = {
    //                 id: "123",
    //                 name: "Clem Fandango",
    //                 email: username
    //             };
    //
    //             // Auth mocking
    //             (typeof window !== "undefined") && ((window as any).authenticated = true);
    //             (typeof process !== "undefined") && ((process as any).authenticated = user);
    //
    //             resolve(user);
    //         }
    //     }, 1500);
    // })
});
