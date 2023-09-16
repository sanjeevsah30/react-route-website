import { useTheme } from "@emotion/react";
import { SvgIcon } from "@mui/material";

export default function PlusThemeSvg({ sx }) {
    const theme = useTheme();
    return (
        <SvgIcon
            viewBox="0 0 18 18"
            sx={{ ...sx, width: 18, height: 18, fill: "none" }}
        >
            <path
                d="M9 17V9M9 9V1M9 9H17M9 9H1"
                stroke={theme?.palette?.primary?.main}
                strokeWidth="2"
                strokeLinecap="round"
            />
        </SvgIcon>
    );
}
