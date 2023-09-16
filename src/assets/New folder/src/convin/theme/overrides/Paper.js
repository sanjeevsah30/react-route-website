// ----------------------------------------------------------------------

export default function Paper() {
    return {
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: "none",
                },
            },
        },

        MuiDrawer: {
            styleOverrides: {
                paper: {
                    overflow: "hidden",
                },
            },
        },
    };
}
