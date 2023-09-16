import { useTheme } from "@emotion/react";
import { SvgIcon } from "@mui/material";

export default function PopperPlayIconSvg({ sx }) {
    const theme = useTheme();
    return (
        <SvgIcon
            viewBox="0 0 20 20"
            sx={{ ...sx, width: 20, height: 20, fill: "none" }}
        >
            <g clipPath="url(#clip0_13352_56658)">
                <path
                    d="M7.88885 6.06665L14.4222 10.2667L7.88885 14.4666V6.06665Z"
                    stroke={theme?.palette?.primary?.main}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <circle
                cx="10"
                cy="10"
                r="8.7"
                stroke={theme?.palette?.primary?.main}
                strokeWidth="1.4"
            />
            <defs>
                <clipPath id="clip0_13352_56658">
                    <rect
                        width="11.2"
                        height="11.2"
                        fill="white"
                        transform="translate(5.55554 4.66675)"
                    />
                </clipPath>
            </defs>
        </SvgIcon>
    );
}
