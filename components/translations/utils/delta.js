const {hashMessages} = require("./utils");

const getDelta = (defaultMessages, sourceDefaultMessages, messages, whitelist) => {
    const {ids: whitelistIds} = whitelist;

    const delta = Object.values(defaultMessages).reduce((delta, message) => {
        const {id, defaultMessage} = message;

        if (!messages[id]) {
            delta.added[id] = defaultMessage;
            delta.untranslated[id] = defaultMessage;
        } else if (sourceDefaultMessages[id] && defaultMessages[id].defaultMessage !== sourceDefaultMessages[id].defaultMessage) {
            delta.updated[id] = defaultMessage;
            delta.untranslated[id] = defaultMessage;
        } else if (messages[id] && !defaultMessages[id]) {
            delta.removed[id] = defaultMessage;
        }

        return delta;
    }, {
        added: {},
        removed: {},
        updated: {},
        untranslated: {}
    });

    Object.keys(messages).reduce((delta, id) => {
        if (!defaultMessages[id]) {
            delta.removed[id] = messages[id];
        } else if (messages[id] === defaultMessages[id].defaultMessage && whitelistIds.indexOf(id) === -1) {
            delta.untranslated[id] = messages[id];
        }

        return delta;
    }, delta);

    return delta;
};

const applyDelta = (sourceMessages, messages, {added, removed, updated}) => {
    return hashMessages(Object.keys(messages)
        .map(id => {
            if (removed[id]) {
                return undefined;
            } else if (updated[id]) {
                return updated[id];
            }

            return messages[id];
        })
        .filter(message => message)
        .concat(Object.keys(added).map(key => added[key])));
};

const applyWhitelistDelta = (whitelist, {removed, updated}) => ({
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

module.exports.getDelta = getDelta;
module.exports.applyDelta = applyDelta;
module.exports.applyWhitelistDelta = applyWhitelistDelta;

