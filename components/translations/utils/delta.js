const getDelta = (defaultMessages, sourceDefaultMessages, messages, whitelist) => {
    const {ids: whitelistIds} = whitelist;

    const delta = Object.values(defaultMessages).reduce((delta, message) => {
        const {id, defaultMessage} = message;

        if (!messages[id]) {
            delta.added[id] = defaultMessage;
            delta.untranslated[id] = defaultMessage;
        } else if (sourceDefaultMessages[id] && defaultMessages[id].defaultMessage !== sourceDefaultMessages[id] && messages[id] !== defaultMessages[id].defaultMessage) {
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

const applyDelta = (sourceMessages, messages, {added, removed, updated}) => Object.assign((Object.keys(messages)
    .reduce((update, id) => {
        if (!removed[id]) {
            if (updated[id]) {
                update[id] = updated[id];
            } else if (added[id]) {
                update[id] = added[id];
            } else {
                update[id] = messages[id];
            }
        }

        return update;
    }, {})), added);

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

