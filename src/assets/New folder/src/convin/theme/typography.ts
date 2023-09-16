import { pxToRem, responsiveFontSizes } from "@convin/utils/getFontValue";
import { ExtendedTypographyOptions } from "./types/theme";

// ----------------------------------------------------------------------

const primary_font = "ProximaNova,Arial, Helvetica, sans-serif";

const typography: ExtendedTypographyOptions = {
    fontFamily: primary_font,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    h1: {
        fontWeight: 600,
        lineHeight: 80 / 64,
        fontSize: pxToRem(40),
        letterSpacing: 2,
        ...responsiveFontSizes({
            xs: 38,
            sm: 38,
            md: 40,
            lg: 40,
        }),
    },
    h2: {
        fontWeight: 600,
        lineHeight: 64 / 48,
        fontSize: pxToRem(32),
        ...responsiveFontSizes({
            xs: 30,
            sm: 30,
            md: 32,
            lg: 32,
        }),
    },
    h3: {
        fontWeight: 600,
        lineHeight: 1.5,
        fontSize: pxToRem(24),
        ...responsiveFontSizes({
            xs: 22,
            sm: 22,
            md: 24,
            lg: 24,
        }),
    },
    h4: {
        fontWeight: 600,
        lineHeight: 1.5,
        fontSize: pxToRem(22),
        ...responsiveFontSizes({
            xs: 20,
            sm: 20,
            md: 22,
            lg: 22,
        }),
    },
    h5: {
        fontWeight: 600,
        lineHeight: 1.5,
        fontSize: pxToRem(20),
        ...responsiveFontSizes({
            xs: 18,
            sm: 18,
            md: 20,
            lg: 20,
        }),
    },
    h6: {
        fontWeight: 600,
        lineHeight: 28 / 18,
        fontSize: pxToRem(18),
        ...responsiveFontSizes({
            xs: 16,
            sm: 16,
            md: 18,
            lg: 18,
        }),
    },
    subtitle1: {
        fontWeight: 600,
        lineHeight: 1.5,
        fontSize: pxToRem(16),
    },
    subtitle2: {
        fontWeight: 600,
        lineHeight: 22 / 14,
        fontSize: pxToRem(14),
    },
    body1: {
        lineHeight: 1.5,
        fontSize: pxToRem(16),
    },
    body2: {
        lineHeight: 22 / 14,
        fontSize: pxToRem(14),
    },
    caption: {
        lineHeight: 1.5,
        fontSize: pxToRem(12),
    },
    overline: {
        fontWeight: 700,
        lineHeight: 1.5,
        fontSize: pxToRem(12),
        textTransform: "uppercase",
    },
    button: {
        fontWeight: 700,
        lineHeight: 24 / 14,
        fontSize: pxToRem(14),
        textTransform: "capitalize",
    },
    tabName: {
        fontWeight: 600,
        fontSize: pxToRem(20),
        textTransform: "capitalize",
        ...responsiveFontSizes({
            xs: 18,
            sm: 18,
            md: 18,
            lg: 20,
        }),
    },
    title1: {
        fontWeight: 600,
        fontSize: pxToRem(16),
        textTransform: "capitalize",
        ...responsiveFontSizes({
            xs: 14,
            sm: 14,
            md: 14,
            lg: 16,
        }),
    },

    textSm: {
        fontWeight: 400,
        fontSize: pxToRem(14),
    },
    textSmBold: {
        fontWeight: 600,
        fontSize: pxToRem(14),
    },
    textSm666: {
        fontWeight: 400,
        fontSize: pxToRem(14),
    },
    textSm999: {
        fontWeight: 400,
        fontSize: pxToRem(14),
    },
    textXs: {
        fontWeight: 400,
        fontSize: pxToRem(12),
    },
    textXsBold: {
        fontWeight: 600,
        fontSize: pxToRem(12),
    },
    textXs666: {
        fontWeight: 400,
        fontSize: pxToRem(12),
    },
    textXs999: {
        fontWeight: 400,
        fontSize: pxToRem(12),
    },
    columnHeading: {
        fontWeight: 600,
        fontSize: pxToRem(16),
    },

    hyphen: {
        width: "13px",
        height: "2px",
        borderRadius: "6px",
    },
    link: {
        fontSize: pxToRem(12),
        cursor: "pointer",
    },
    extraSmall: {
        ...responsiveFontSizes({
            xs: 10,
            sm: 10,
            md: 10,
            lg: 10,
        }),
    },
    small: {
        ...responsiveFontSizes({
            xs: 12,
            sm: 12,
            md: 12,
            lg: 12,
        }),
    },
    medium: {
        ...responsiveFontSizes({
            xs: 14,
            sm: 14,
            md: 14,
            lg: 14,
        }),
    },
    large: {
        ...responsiveFontSizes({
            xs: 18,
            sm: 18,
            md: 18,
            lg: 18,
        }),
    },
    extraLarge: {
        ...responsiveFontSizes({
            xs: 20,
            sm: 20,
            md: 20,
            lg: 20,
        }),
    },
};

export default typography;
