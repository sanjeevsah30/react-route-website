import { SvgIcon } from "@mui/material";

export default function NavStatisticsSvg({ sx }) {
    return (
        <SvgIcon
            fill="none"
            viewBox="0 0 20 20"
            sx={{ ...sx, width: 20, height: 20 }}
        >
            <path
                d="M10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C19.9939 15.5203 15.5203 19.9939 10 20ZM9 2.062C4.89401 2.57928 1.86031 6.14271 2.00483 10.2786C2.14935 14.4145 5.42437 17.7575 9.55645 17.987C13.6885 18.2164 17.3135 15.2565 17.915 11.162V11.146V11.117V11.087V11.058V11.042V11.031V11.017V11H9V2.062ZM11 2.062V9H17.938C17.4815 5.37411 14.6259 2.51851 11 2.062Z"
                fill="currentColor"
            />
        </SvgIcon>
    );
}