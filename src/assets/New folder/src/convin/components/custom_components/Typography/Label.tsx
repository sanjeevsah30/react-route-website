import { styled, Typography, TypographyProps } from "@mui/material";
import { ElementType } from "react";

type Props = TypographyProps & {
    colorType: "999" | "666" | "333";
    component?: ElementType;
    isEllipses?: boolean;
};

export const Label = styled(
    ({ variant, className, sx, isEllipses, component, children }: Props) => (
        <Typography
            variant={variant}
            className={
                isEllipses
                    ? `text-ellipsis overflow-hidden whitespace-nowrap ${
                          className ?? ""
                      }`
                    : className
            }
            sx={{ ...sx }}
            component={component ?? "div"}
        >
            {typeof children === "string" && isEllipses
                ? children.substring(0, 80)
                : children}
        </Typography>
    )
)(({ theme, colorType }) => ({
    color:
        theme.palette.mode === "light"
            ? theme?.palette?.textColors?.[colorType]
            : "white",
}));
