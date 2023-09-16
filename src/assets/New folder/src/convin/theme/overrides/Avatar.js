// ----------------------------------------------------------------------

export default function Avatar(theme) {
    return {
        MuiAvatarGroup: {
            styleOverrides: {
                root: {
                    borderRadius: "100px",
                    padding: "2px",
                    fontWeight: 600,
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    color: "white",
                    border: "2px solid white !important",
                },
            },
        },
    };
}
