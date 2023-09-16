// ----------------------------------------------------------------------

import { alpha, Theme } from "@mui/material";

export default function Typography(theme: Theme): Record<string, unknown> {
    const isLight = theme?.palette?.mode === "light";

    return {
        MuiTypography: {
            styleOverrides: {
                paragraph: {
                    marginBottom: theme.spacing(2),
                },
                primary: {
                    color: theme?.palette?.primary?.main,
                },
                textSm: {
                    color: isLight
                        ? theme?.palette?.textColors?.["333"]
                        : theme?.palette?.common?.white,
                },
                textXs666: {
                    color: isLight
                        ? theme?.palette?.textColors?.["666"]
                        : theme?.palette?.common?.white,
                },
                columnHeading: {
                    color: isLight
                        ? theme?.palette?.textColors?.["666"]
                        : theme?.palette?.common?.white,
                },
                dateDivider: {
                    color: isLight
                        ? alpha(theme?.palette?.textColors?.["666"], 0.8)
                        : theme?.palette?.common?.white,
                },
                hyphen: {
                    backgroundColor: isLight
                        ? theme?.palette?.textColors?.["333"]
                        : theme?.palette?.common?.white,
                },
                gutterBottom: {
                    marginBottom: theme.spacing(1),
                },
                link: {
                    color: theme.palette.primary.main,
                },
                extraSmall: {
                    color: isLight
                        ? theme?.palette?.textColors?.["999"]
                        : theme?.palette?.common?.white,
                },
                small: {
                    color: isLight
                        ? theme?.palette?.textColors?.["666"]
                        : theme?.palette?.common?.white,
                },
                medium: {
                    color: isLight
                        ? theme?.palette?.textColors?.["333"]
                        : theme?.palette?.common?.white,
                },
                large: {
                    color: isLight
                        ? theme?.palette?.textColors?.["333"]
                        : theme?.palette?.common?.white,
                },
                extraLarge: {
                    color: isLight
                        ? theme?.palette?.textColors?.["333"]
                        : theme?.palette?.common?.white,
                },
            },
            defaultProps: {
                variantMapping: {
                    tabName: "div",
                    title1: "div",
                    dateDivider: "span",
                    hyphen: "p",
                    link: "span",
                },
            },
        },
    };
}
