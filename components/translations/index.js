import {apply} from "./apply";
import {manage} from "./manage";

export const translations = ({messagesPath, translationsPath, reportsPath, languages, version}) => {
    return {
        apply: apply({messagesPath, translationsPath, languages}),
        manage: manage({messagesPath, translationsPath, reportsPath, languages, version})
    };
};
