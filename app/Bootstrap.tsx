import React, {ReactNode} from "react";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import {Store} from "redux";

import ErrorProvider from "components/actions/ErrorProvider";
import {FormDataProvider, FormDataState} from "components/actions/form";
import {AsyncDataContextProvider} from "components/ssr/safePromise";
import {AsyncDataContext} from "components/ssr/contexts";
import {ErrorContext} from "components/actions/contexts";

type BootstrapProps<T> = {
    children: ReactNode;
    asyncData: AsyncDataContext;
    formData: FormDataState;
    error: ErrorContext;
    store: Store<T>;
    helmetContext?: any;
}

function Bootstrap<T>({asyncData, formData, error, store, helmetContext, children}: BootstrapProps<T>) {
    return (
        <AsyncDataContextProvider value={asyncData}>
            <FormDataProvider value={formData}>
                <ErrorProvider value={error}>
                    <HelmetProvider context={helmetContext}>
                        <Provider store={store}>
                            {children}
                        </Provider>
                    </HelmetProvider>
                </ErrorProvider>
            </FormDataProvider>
        </AsyncDataContextProvider>
    );
}

export default Bootstrap;
