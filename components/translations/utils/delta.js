import {hashMessages} from "./index";

export const getDelta = (sourceDefaultMessages, defaultLangMessages, messages, whitelist) => {
    const {ids: whitelistIds} = whitelist;

    const delta = Object.values(sourceDefaultMessages).reduce((delta, message) => {
        const {id} = message;

        if (!messages[id]) {
            delta.added[id] = message;
            delta.untranslated[id] = message;
        } else if (defaultLangMessages[id] && sourceDefaultMessages[id].defaultMessage !== defaultLangMessages[id].defaultMessage) {
            delta.updated[id] = message;
            delta.untranslated[id] = message;
        } else if (messages[id] && !sourceDefaultMessages[id]) {
            delta.removed[id] = message;
        }

        return delta;
    }, {
        added: {},
        removed: {},
        updated: {},
        untranslated: {}
    });

    Object.keys(messages).reduce((delta, id) => {
        if (!sourceDefaultMessages[id]) {
            delta.removed[id] = messages[id];
        } else if (messages[id].defaultMessage === sourceDefaultMessages[id].defaultMessage && whitelistIds.indexOf(id) === -1) {
            delta.untranslated[id] = messages[id];
        }

        return delta;
    }, delta);

    return delta;
};

export const applyDelta = (sourceMessages, messages, {added, removed, updated}) => {
    return hashMessages(Object.values(messages)
        .map(message => {
            const {id} = message;

            if (removed[id]) {
                return undefined;
            } else if (updated[id]) {
                return {
                    ...sourceMessages[id],
                    defaultMessage: updated[id].defaultMessage
                };
            }

            return {
                ...sourceMessages[id],
                defaultMessage: message.defaultMessage
            };
        })
        .filter(message => message)
        .concat(Object.keys(added).map(key => added[key])));
};

export const applyWhitelistDelta = (whitelist, {removed, updated}) => ({
    ...whitelist,
    ids: whitelist.ids
        .map(id => {
            if (removed[id] || updated[id]) {
                return undefined;
            }

            return id;
        })
        .filter(message => message)
});

