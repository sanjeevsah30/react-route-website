import { SvgIcon } from "@mui/material";

export default function SortColumnSvg({
    sx,
    upperColor = "#999999",
    lowerColor = "#333333",
}) {
    return (
        <SvgIcon
            width="8"
            height="10"
            viewBox="0 0 8 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            sx={{ ...sx }}
        >
            <path
                d="M3.71431 0L6.80726 4.28571H0.621364L3.71431 0Z"
                fill={upperColor}
            />
            <path
                d="M3.57146 10L0.478507 5.71429L6.6644 5.71429L3.57146 10Z"
                fill={lowerColor}
            />
        </SvgIcon>
    );
}
