import {Workbox} from "workbox-window";

export default () => {
    if (process.env.NODE_ENV === "production") {
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", () => {
                const wb = new Workbox((process.env.PUBLIC_PATH || "/") + "service-worker.js");

                wb.addEventListener("waiting", () => {
                    // TODO: replace with toast notification
                    if (confirm("A new version is available.")) {
                        wb.messageSW({type: "SKIP_WAITING"});
                    }
                });

                // Reload all clients....
                let refreshing = false;
                navigator.serviceWorker.addEventListener("controllerchange", () => {
                    if (!refreshing) {
                        refreshing = true;
                        window.location.reload();
                    }
                });

                wb.register();
            });
        }
    }
};
