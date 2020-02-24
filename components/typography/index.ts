export const typography = (base = 1) => {
    const fontSizeBase = base;

    const fontSizeLarge = (fontSizeBase * 1.25);
    const fontSizeSmall = (fontSizeBase * 0.85);

    const fontSize_h1 = (fontSizeBase * 1.85);
    const fontSize_h2 = (fontSizeBase * 1.7);
    const fontSize_h3 = (fontSizeBase * 1.26);
    const fontSize_h4 = fontSizeBase;
    const fontSize_h5 = (fontSizeBase * 0.85);
    const fontSize_h6 = (fontSizeBase * 0.85);

    const lineHeightBase = 1.428571429;
    const lineHeightComputed = fontSizeBase * lineHeightBase;

    return {
        fontSizeBase,
        fontSizeBase_unit: `${fontSizeBase}rem`,
        fontSizeLarge,
        fontSizeLarge_unit: `${fontSizeLarge}rem`,
        fontSizeSmall,
        fontSizeSmall_unit: `${fontSizeSmall}rem`,
        fontSize_h1,
        fontSize_h1_unit: `${fontSize_h1}rem`,
        fontSize_h2,
        fontSize_h2_unit: `${fontSize_h2}rem`,
        fontSize_h3,
        fontSize_h3_unit: `${fontSize_h3}rem`,
        fontSize_h4,
        fontSize_h4_unit: `${fontSize_h4}rem`,
        fontSize_h5,
        fontSize_h5_unit: `${fontSize_h5}rem`,
        fontSize_h6,
        fontSize_h6_unit: `${fontSize_h6}rem`,
        lineHeightBase,
        lineHeightBase_unit: lineHeightBase,
        lineHeightComputed,
        lineHeightComputed_unit: lineHeightComputed
    };
};

