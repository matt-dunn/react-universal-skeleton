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
import {WireFrameProvider} from "components/Wireframe/WireFrameProvider";

const availableLocales = process.env.AVAILABLE_LOCALES || [] as string[];

type BootstrapProps<T> = {
    languagePack?: {
        locale: string;
        messagesLocale?: string;
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
            const locale = (availableLocales.indexOf(language) !== -1 && language) || "default";

            if (locale) {
                import(`app/i18n/${locale}.json`)
                    .then(messages => {
                        setLang({
                            locale: language,
                            messagesLocale: locale,
                            messages: Object.assign({}, messages, (((typeof window !== "undefined" && window) || (typeof process !== "undefined" && process) || {} as any).I18N_CHANGED || {}))
                        });
                    })
                    .catch(reason => {
                        console.error(reason);

                        setLang({
                            locale: language
                        });
                    });
            }
        }
    }, [lang]);

    if (lang) {
        return (
            <WireFrameProvider>
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
            </WireFrameProvider>
        );
    }

    return null;
}

export default Bootstrap;
