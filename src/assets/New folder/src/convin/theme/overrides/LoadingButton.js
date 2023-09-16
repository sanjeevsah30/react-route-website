// ----------------------------------------------------------------------

import { alpha } from "@mui/material";

export default function LoadingButton(theme) {
    return {
        MuiButton: {
            variants: [
                {
                    props: { variant: "global" },
                    style: {
                        textTransform: "uppercase",
                        fontSize: "0.875rem",
                        background: `${theme?.palette?.primary?.main} !important`,
                        color: "white",
                        fontWeight: 600,
                        "&:hover": {
                            background: `${alpha(
                                theme?.palette?.primary?.main,
                                0.4
                            )} !important`,
                        },
                    },
                },
                {
                    props: { variant: "globalOutlined" },
                    style: {
                        textTransform: "uppercase",
                        fontSize: "1rem",
                        background: `${theme?.palette?.common?.white} !important`,
                        border: `1px solid ${theme.palette.grey["666"]}`,
                        color: theme.palette.grey["666"],
                        fontWeight: 600,
                        "&:hover": {
                            borderColor: theme?.palette?.primary?.main,
                            color: theme?.palette?.primary?.main,
                        },
                    },
                },
                {
                    props: { variant: "globalOutlined", color: "theme" },
                    style: {
                        textTransform: "uppercase",
                        fontSize: "1rem",
                        background: `${theme?.palette?.common?.white} !important`,
                        border: `1px solid ${theme?.palette?.primary?.main}`,
                        color: theme?.palette?.primary?.main,
                        fontWeight: 600,
                        "&:hover": {
                            background: `${alpha(
                                theme?.palette?.primary?.main,
                                0.1
                            )} !important`,
                        },
                    },
                },
            ],
        },
        // MuiButtonBase: {
        //   defaultProps: {
        //     // The props to change the default for.
        //     // No more ripple, on the whole application 💣!
        //   },
        // },
    };
}
