import {hashMessages} from "./index";

export const getDelta = (sourceDefaultMessages, defaultLangMessages, messages, whitelist) => {
    const {ids: whitelistIds} = whitelist;
    const messagesHash = hashMessages(messages);
    const defaultLangMessagesHash = hashMessages(defaultLangMessages);
    const defaultMessagesHash = hashMessages(sourceDefaultMessages);

    const delta = sourceDefaultMessages.reduce((delta, message) => {
        const {id} = message;

        if (!messagesHash[id]) {
            delta.added[id] = message;
            delta.untranslated[id] = message;
        } else if (defaultLangMessagesHash[id] && defaultMessagesHash[id].defaultMessage !== defaultLangMessagesHash[id].defaultMessage) {
            delta.updated[id] = message;
            delta.untranslated[id] = message;
        } else if (messagesHash[id] && !defaultMessagesHash[id]) {
            delta.removed[id] = message;
        }

        return delta;
    }, {
        added: {},
        removed: {},
        updated: {},
        untranslated: {}
    });

    Object.keys(messagesHash).reduce((delta, id) => {
        if (!defaultMessagesHash[id]) {
            delta.removed[id] = messagesHash[id];
        } else if (messagesHash[id].defaultMessage === defaultMessagesHash[id].defaultMessage && whitelistIds.indexOf(id) === -1) {
            delta.untranslated[id] = messagesHash[id];
        }

        return delta;
    }, delta);

    return delta;
};

export const applyDelta = (sourceMessages, messages, {added, removed, updated}) => {
    const defaultMessagesHash = hashMessages(sourceMessages);

    return messages
        .map(message => {
            const {id} = message;

            if (removed[id]) {
                return undefined;
            } else if (updated[id]) {
                return {
                    ...defaultMessagesHash[id],
                    defaultMessage: updated[id].defaultMessage
                };
            }

            return {
                ...defaultMessagesHash[id],
                defaultMessage: message.defaultMessage
            };
        })
        .filter(message => message)
        .concat(Object.keys(added).map(key => added[key]));
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

