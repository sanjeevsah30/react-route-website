import { SvgIcon } from "@mui/material";

export default function ArrowDownSvg({ sx }) {
    return (
        <SvgIcon
            viewBox="0 0 14 8"
            sx={{ width: 14, height: 8, fill: "none", ...sx }}
        >
            <path
                d="M1 1L7 7L13 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </SvgIcon>
    );
}

ArrowDownSvg.defaultProps = {
    sx: {},
};
