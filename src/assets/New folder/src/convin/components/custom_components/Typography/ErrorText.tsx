import { styled } from "@mui/material";

export const ErrorText = styled("span")(({ theme }) => ({
    color: theme.palette.error.main,
    display: "block",
}));
