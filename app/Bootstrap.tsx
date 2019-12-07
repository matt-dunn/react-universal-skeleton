import React, {ReactNode, useEffect, useState} from "react";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import {Store} from "redux";
import {IntlProvider} from "react-intl";

import ErrorProvider from "components/actions/ErrorProvider";
import {FormDataProvider, FormDataState} from "components/actions/form";
import {AsyncDataContextProvider} from "components/ssr/safePromise";
import {AsyncDataContext} from "components/ssr/contexts";
import {ErrorContext} from "components/actions/contexts";

type BootstrapProps<T> = {
    languagePack?: {
        locale: string;
        messages?: any;
    };
    children: ReactNode;
    asyncData: AsyncDataContext;
    formData: FormDataState;
    error: ErrorContext;
    store: Store<T>;
    helmetContext?: any;
}

function Bootstrap<T>({languagePack, asyncData, formData, error, store, helmetContext, children}: BootstrapProps<T>) {
    const [lang, setLang] = useState(languagePack);

    useEffect(() => {
        if (!lang) {
            const {language} = navigator;

            import(`app/translations/locales/${language}.json`)
                .then(messages => {
                    setLang({
                        locale: language,
                        messages
                    });
                })
                .catch(() => {
                    setLang({
                        locale: "en"
                    });
                });
        }
    }, [lang]);

    if (lang) {
        return (
            <IntlProvider locale={lang.locale} messages={lang.messages}>
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
            </IntlProvider>
        );
    }

    return null;
}

export default Bootstrap;
