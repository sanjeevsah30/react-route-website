// ----------------------------------------------------------------------

export default function InputBase(theme) {
    return {
        MuiInputBase: {
            styleOverrides: {
                inputAdornedEnd: {
                    flex: 1,
                },
                root: {
                    "& .MuiChip-deleteIcon": {
                        fill: theme.palette.primary.main,
                    },
                },
            },
        },
    };
}
