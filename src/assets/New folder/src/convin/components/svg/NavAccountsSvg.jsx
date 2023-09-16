import { SvgIcon } from "@mui/material";

export default function NavAccountsSvg({ sx }) {
    return (
        <SvgIcon
            viewBox="0 0 20 24"
            sx={{ ...sx, width: 20, height: 24, fill: "none" }}
        >
            <rect
                x="4.29175"
                y="3.05884"
                width="11.6422"
                height="1.4"
                rx="0.7"
                fill="currentColor"
            />
            <rect
                x="5.33325"
                y="0.823486"
                width="9.31372"
                height="1.4"
                rx="0.7"
                fill="currentColor"
            />
            <rect
                x="1.125"
                y="6.29407"
                width="17.7917"
                height="15.8824"
                rx="3"
                stroke="currentColor"
                strokeWidth="2"
            />
            <path
                d="M14.9057 20.1029V18.9542C14.9057 18.3449 14.6536 17.7606 14.2048 17.3297C13.756 16.8989 13.1473 16.6569 12.5126 16.6569H7.72636C7.09167 16.6569 6.48297 16.8989 6.03418 17.3297C5.58538 17.7606 5.33325 18.3449 5.33325 18.9542V20.1029"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10.1194 14.3594C11.4411 14.3594 12.5125 13.3308 12.5125 12.062C12.5125 10.7932 11.4411 9.76465 10.1194 9.76465C8.79775 9.76465 7.72632 10.7932 7.72632 12.062C7.72632 13.3308 8.79775 14.3594 10.1194 14.3594Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </SvgIcon>
    );
}
