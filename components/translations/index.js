import {apply} from "./apply";
import {manage} from "./manage";

export const translations = ({messagesPath, translationsPath, reportsPath, languages}) => {
    return {
        apply: apply({messagesPath, translationsPath}),
        manage: manage({messagesPath, translationsPath, reportsPath, languages})
    };
};
