import { TypographyOptions } from "@mui/material/styles/createTypography";
import React from "react";

declare module "@mui/material/styles" {
    interface Palette {
        auditColors: {
            good: string;
            average: string;
            bad: string;
        };
        leadColors: {
            hot: string;
            warm: string;
            cold: string;
        };
        textColors: {
            333: string;
            666: string;
            999: string;
        };

        grey: {
            333: string;
            666: string;
            999: string;
        };
    }

    interface PaletteColor {
        auditColors: {
            good: string;
            average: string;
            bad: string;
        };
        leadColors: {
            hot: string;
            warm: string;
            cold: string;
        };
        textColors: {
            333: string;
            666: string;
            999: string;
        };
    }
}

declare module "@mui/material/Button" {
    interface ButtonPropsVariantOverrides {
        global: true;
        globalOutlined: true;
        disabled: true;
    }
    interface ButtonPropsColorOverrides {
        theme: true;
    }
}

declare module "@mui/material/Typography" {
    interface TypographyPropsVariantOverrides {
        columnHeading: true;
        textXs: true;
        textSm: true;
        textXsBold: true;
        textSmBold: true;
        title1: true;
        hyphen: true;
        tabName: true;
        textXs666: true;
        textXs999: true;
        textSm666: true;
        textSm999: true;
        link: true;
        extraSmall: true;
        small: true;
        medium: true;
        large: true;
        extraLarge: true;
    }
}

export interface ExtendedTypographyOptions extends TypographyOptions {
    columnHeading: React.CSSProperties;
    textXs: React.CSSProperties;
    textXsBold: React.CSSProperties;
    textSmBold: React.CSSProperties;
    textSm: React.CSSProperties;
    title1: React.CSSProperties;
    hyphen: React.CSSProperties;
    tabName: React.CSSProperties;
    textXs666: React.CSSProperties;
    textXs999: React.CSSProperties;
    textSm666: React.CSSProperties;
    textSm999: React.CSSProperties;
    link: React.CSSProperties;
    extraSmall: React.CSSProperties;
    small: React.CSSProperties;
    medium: React.CSSProperties;
    large: React.CSSProperties;
    extraLarge: React.CSSProperties;
}
