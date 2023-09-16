// ----------------------------------------------------------------------

export default function Checkbox(theme) {
    return {
        MuiFormControlLabel: {
            styleOverrides: {
                root: {
                    margin: 0,
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    paddingRight: theme.spacing(1),
                    paddingLeft: theme.spacing(1),
                    "&:hover": {
                        backgroundColor: "transparent !important",
                    },
                    ".MuiSvgIcon-root": {
                        fill: theme?.palette?.textColors?.["666"],
                    },
                    "&.Mui-checked": {
                        ".MuiSvgIcon-root": {
                            fill: `${theme?.palette?.primary?.main} !important`,
                        },
                    },
                },
            },
        },
    };
}
