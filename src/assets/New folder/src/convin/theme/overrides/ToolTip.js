// ----------------------------------------------------------------------

export default function ToolTip(theme) {
    return {
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    padding: 4,
                    background: theme.palette.textColors["333"],
                },
            },
        },
    };
}
