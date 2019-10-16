const charsLength = 52;

const getAlphabeticChar = code => String.fromCharCode(code + (code > 25 ? 39 : 97));

const generateAlphabeticName = code => {
    let name = '', x;

    /* get a char and divide by alphabet-length */
    for (x = code; x > charsLength; x = Math.floor(x / charsLength)) {
        name = getAlphabeticChar(x % charsLength) + name;
    }

    return getAlphabeticChar(x % charsLength) + name;
};

// Source: https://github.com/garycourt/murmurhash-js/blob/master/murmurhash2_gc.js
const murmurhash = c => {
    let a, e, b, d;
    for (e = c.length | 0, a = e | 0, d = 0, b; e >= 4;) {
        b = c.charCodeAt(d) & 255 | (c.charCodeAt(++d) & 255) << 8 | (c.charCodeAt(++d) & 255) << 16 | (c.charCodeAt(++d) & 255) << 24, b = 1540483477 * (b & 65535) + ((1540483477 * (b >>> 16) & 65535) << 16), b ^= b >>> 24, b = 1540483477 * (b & 65535) + ((1540483477 * (b >>> 16) & 65535) << 16), a = 1540483477 * (a & 65535) + ((1540483477 * (a >>> 16) & 65535) << 16) ^ b, e -= 4, ++d;
    }
    switch (e) {
        case 3:
            a ^= (c.charCodeAt(d + 2) & 255) << 16;
            break;
        case 2:
            a ^= (c.charCodeAt(d + 1) & 255) << 8;
            break;
        case 1:
            a ^= c.charCodeAt(d) & 255, a = 1540483477 * (a & 65535) + ((1540483477 * (a >>> 16) & 65535) << 16);
            break;
    }
    a ^= a >>> 13;
    a = 1540483477 * (a & 65535) + ((1540483477 * (a >>> 16) & 65535) << 16);
    return (a ^ a >>> 15) >>> 0;
};

export const createHash = s => generateAlphabeticName(murmurhash(s));


