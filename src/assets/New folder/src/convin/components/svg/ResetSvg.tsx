import { SvgIcon, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";

export default function ResetSvg({
    sx,
}: {
    sx?: SxProps<Theme>;
}): ReactElement {
    return (
        <SvgIcon
            viewBox="0 0 16 16"
            sx={{ width: 16, height: 16, fill: "none", ...sx }}
        >
            <path
                d="M2.22533 5.00523C3.31616 3.03745 5.60477 1.58301 8.00033 1.58301C11.5509 1.58301 14.417 4.44912 14.417 7.99967C14.417 11.5502 11.5509 14.4163 8.00032 14.4163C4.53532 14.4163 1.71199 11.6572 1.58366 8.23495"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
            />
            <path
                d="M5.64746 5.00523L2.22524 5.00523L2.22524 1.58301"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </SvgIcon>
    );
}

ResetSvg.defaultProps = {
    sx: {},
};
