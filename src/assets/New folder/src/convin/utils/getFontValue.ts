// @mui
import { useTheme } from "@mui/material/styles";
// hooks
import useResponsive from "../hooks/useResponsive";

export function useWidth(): string {
    const theme = useTheme();
    const keys: string[] = [...theme.breakpoints.keys].reverse();
    return (
        keys.reduce((output: string, key: string) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const matches = useResponsive("up", key);
            return !output && matches ? key : output;
        }, "") || "xs"
    );
}

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export function remToPx(value: string): number {
    return Math.round(parseFloat(value) * 16);
}

export function pxToRem(value: number): string {
    return `${value / 16}rem`;
}

export function responsiveFontSizes({
    xs,
    sm,
    md,
    lg,
}: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
}): Record<string, unknown> {
    return {
        "@media (max-width:600px)": {
            fontSize: pxToRem(xs),
        },
        "@media (min-width:600px)": {
            fontSize: pxToRem(sm),
        },
        "@media (min-width:900px)": {
            fontSize: pxToRem(md),
        },
        "@media (min-width:1200px)": {
            fontSize: pxToRem(lg),
        },
    };
}

// ----------------------------------------------------------------------

export default function GetFontValue(variant: string): Record<string, unknown> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const theme: any = useTheme();
    const breakpoints = useWidth();

    const key = theme.breakpoints.up(breakpoints === "xl" ? "lg" : breakpoints);

    const hasResponsive =
        variant === "h1" ||
        variant === "h2" ||
        variant === "h3" ||
        variant === "h4" ||
        variant === "h5" ||
        variant === "h6";

    const getFont: { fontSize: string } =
        hasResponsive && Boolean(theme.typography[variant][key])
            ? theme.typography[variant][key]
            : theme.typography[variant];

    const fontSize = remToPx(getFont.fontSize);
    const lineHeight = Number(theme.typography[variant].lineHeight) * fontSize;
    const { fontWeight } = theme.typography[variant];
    const { letterSpacing } = theme.typography[variant];

    return {
        fontSize,
        lineHeight,
        fontWeight,
        letterSpacing,
    };
}
