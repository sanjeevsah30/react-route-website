import {
    Box,
    SxProps,
    TableCell,
    TableRow,
    Theme,
    alpha,
    styled,
    tableCellClasses,
} from "@mui/material";

export const sxPropOption = (theme: Theme): SxProps => ({
    px: 1.5,
    py: 1.2,
    "&:hover": {
        color: "primary.main",
        bgcolor: alpha(theme.palette.primary.main, 0.2),
    },
});

export const StyledTableCell = styled(TableCell, {
    shouldForwardProp: (prop) => prop !== "hasBackground",
})<{ hasBackground?: boolean }>(({ theme, hasBackground }) => ({
    [`&.${tableCellClasses.head}`]: {
        whiteSpace: "nowrap",
        background: "#e2e3e3",
        color: theme.palette.textColors[333],
        padding: 0,
        height: "40px",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding: 0,
        whiteSpace: "nowrap",
    },
    [`&.${tableCellClasses.root}`]: {
        height: "55px",
    },

    ...(hasBackground && {
        backgroundColor: "#fff",
    }),
}));

export const StyledBox = styled(Box, {
    shouldForwardProp: (prop) =>
        prop !== "hasLeftShadow" &&
        prop !== "hasRightShadow" &&
        prop !== "inEditMode",
})<{
    index?: number;
    hasRightShadow?: boolean;
    hasLeftShadow?: boolean;
    inEditMode?: boolean;
}>(({ theme, index = 1, hasRightShadow, hasLeftShadow, inEditMode }) => ({
    border: "1px solid",
    borderColor: alpha(theme.palette.textColors["999"], 0.2),
    borderTop: 0,
    borderRight: 0,
    height: "55px",
    display: "flex",
    alignItems: "center",
    overflowX: "visible",
    // "&:hover": {
    //     overflowX: "scroll",
    // },
    ...(index % 2 !== 0 && {
        backgroundColor: alpha(theme.palette.textColors["999"], 0.1),
    }),
    ...(hasRightShadow && {
        boxShadow: `4px 0px 4px ${alpha(theme.palette.textColors["333"], 0.2)}`,
    }),
    ...(hasLeftShadow && {
        boxShadow: `-4px 0px 4px ${alpha(
            theme.palette.textColors["333"],
            0.1
        )}`,
    }),
    ...(!inEditMode && {
        paddingLeft: theme.spacing(1.5),
        paddingRight: theme.spacing(1.5),
        overflowX: "scroll",
    }),
    ...(inEditMode && {
        // backgroundColor: "transparent",
        minWidth: "150px",
    }),
}));

export const StyledTableRow = styled(TableRow)(() => ({
    "td, th": {
        border: 0,
    },
}));
