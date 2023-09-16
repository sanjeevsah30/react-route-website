import { Theme, styled } from "@mui/material";

const CustomTab = styled("div", {
    shouldForwardProp: (prop) => prop !== "active",
})(
    ({
        theme,
        active,
    }: {
        active: boolean;
        theme: Theme;
        [key: string]: unknown;
    }) => ({
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
        position: "relative",

        color: active ? theme.palette.primary.main : theme.palette.grey["900"],
        cursor: "pointer",
        minWidth: "0px",
        maxWidth: "150px",
        display: "flex",
        alignItems: "center",
        "& .MuiTypography-root": { fontWeight: active ? 600 : 400 },
        "&:after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "4px",
            backgroundColor: active
                ? theme.palette.primary.main
                : "transparent",
            borderRadius: "4px 4px 0 0",
        },
    })
);

export default CustomTab;
