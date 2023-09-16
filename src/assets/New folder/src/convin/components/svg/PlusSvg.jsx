import { SvgIcon } from "@mui/material";

export default function PlusSvg({ sx }) {
    return (
        <SvgIcon
            viewBox="0 0 24 24"
            sx={{ width: 24, height: 24, fill: "currentColor", ...sx }}
        >
            <path
                d="M12 5V19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </SvgIcon>
    );
}

PlusSvg.defaultProps = {
    sx: {},
};
