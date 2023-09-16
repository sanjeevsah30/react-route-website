// ----------------------------------------------------------------------

import { pxToRem } from "@convin/utils/getFontValue";

export default function Tabs(theme) {
    const isLight = theme?.palette?.mode === "light";
    return {
        MuiTab: {
            styleOverrides: {
                root: {
                    fontSize: pxToRem(16),
                    "&.Mui-selected": {
                        fontWeight: "600",
                    },
                },
                textColorPrimary: {
                    fontWeight: "400",
                    color: isLight
                        ? theme?.palette?.grey?.["666"]
                        : theme?.palette?.common?.white,
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    height: "4px",
                    borderRadius: "40px 40px 0px 0px",
                },
            },
        },
    };
}
