import { SvgIcon, SxProps, Theme } from "@mui/material";

export default function CalendarSvg({ sx }: { sx?: SxProps<Theme> }) {
    return (
        <SvgIcon
            viewBox="0 0 24 24"
            sx={{ width: 24, height: 24, fill: "none", ...sx }}
        >
            <mask
                id="mask0_8798_51258"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="24"
                height="24"
            >
                <rect width="24" height="24" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_8798_51258)">
                <path
                    d="M5 22C4.45 22 3.97917 21.8042 3.5875 21.4125C3.19583 21.0208 3 20.55 3 20V6C3 5.45 3.19583 4.97917 3.5875 4.5875C3.97917 4.19583 4.45 4 5 4H6V2H8V4H16V2H18V4H19C19.55 4 20.0208 4.19583 20.4125 4.5875C20.8042 4.97917 21 5.45 21 6V20C21 20.55 20.8042 21.0208 20.4125 21.4125C20.0208 21.8042 19.55 22 19 22H5ZM5 20H19V10H5V20ZM5 8H19V6H5V8ZM7 14V12H17V14H7ZM7 18V16H14V18H7Z"
                    fill="#333333"
                />
            </g>
        </SvgIcon>
    );
}
