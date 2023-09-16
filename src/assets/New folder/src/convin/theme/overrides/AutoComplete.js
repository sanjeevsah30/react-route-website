import { alpha } from "@mui/material";

// ----------------------------------------------------------------------

export default function AutoComplete(theme) {
    return {
        MuiAutocomplete: {
            styleOverrides: {
                paper: {
                    border: `1px solid ${theme?.palette?.primary?.main}`,
                    borderRadius: theme.shape.borderRadius,
                    minWidth: "196px",
                    padding: 0,
                    marginTop: "8px",
                },
                root: {
                    ".MuiChip-filled": {
                        background: alpha(theme.palette.primary.main, 0.2),
                        color: theme.palette.primary.main,
                    },
                },
                listbox: {
                    padding: 0,
                },
            },
        },
    };
}
