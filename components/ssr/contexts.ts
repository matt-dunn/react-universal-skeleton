import React from "react";

export const AsyncContext = React.createContext<Promise<any>[] | undefined>(undefined);
