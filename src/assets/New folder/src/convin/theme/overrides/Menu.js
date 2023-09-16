// ----------------------------------------------------------------------

export default function Menu(theme) {
    return {
        MuiMenu: {
            styleOverrides: {
                list: {
                    padding: 0,
                    maxHeight: "200px",
                },
                paper: {
                    marginTop: "10px",
                    border: `1px solid ${theme?.palette?.primary?.main}`,
                    borderRadius: theme.shape.borderRadius,
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    padding: theme.spacing(1),
                    display: "block",
                },
            },
        },
    };
}
