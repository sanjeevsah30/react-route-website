import { SvgIcon, useTheme } from "@mui/material";

export default function MinusThemeSvg({ sx }) {
    const theme = useTheme();
    return (
        <SvgIcon
            viewBox="0 0 15 3"
            sx={{ ...sx, width: 15, height: 3, fill: "none", ...sx }}
        >
            <rect
                x="0.9"
                y="0.9"
                width="15"
                height="1.2"
                rx="0.6"
                stroke={theme?.palette?.primary?.main}
                fill={theme?.palette?.primary?.main}
                strokeWidth="0.6"
            />
        </SvgIcon>
    );
}
