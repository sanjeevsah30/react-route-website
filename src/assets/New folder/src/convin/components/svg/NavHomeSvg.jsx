import { SvgIcon } from "@mui/material";

export default function NavHomeSvg({ sx }) {
    return (
        <SvgIcon
            fill="none"
            viewBox="0 0 20 22"
            sx={{ ...sx, fill: "none", width: 20, height: 22 }}
        >
            <path
                d="M1 8L10 1L19 8V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M7 20V11H13V20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </SvgIcon>
    );
}
