// ----------------------------------------------------------------------

import { alpha } from "@mui/material";

export default function TextField(theme) {
    return {
        MuiTextField: {
            styleOverrides: {
                root: {
                    "&.settings__input": {
                        width: "100%",
                        ".MuiInputBase-root": {
                            border: "none !important",
                            outline: "none !important",
                        },
                        ".MuiInputBase-input": {
                            backgroundColor: alpha(
                                theme?.palette?.textColors?.["999"],
                                0.1
                            ),
                            border: "1px solid",
                            borderColor: alpha(
                                theme?.palette?.textColors?.["999"],
                                0.1
                            ),
                            borderRadius: "6px",
                            height: "46px",
                            padding: "0px 16px",
                        },
                    },
                    ".MuiFormLabel-root": {
                        ".MuiFormLabel-asterisk": {
                            color: "red",
                        },
                    },
                },
            },
        },
    };
}
