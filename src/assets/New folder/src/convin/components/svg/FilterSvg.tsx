// <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">

// </svg>

import { SvgIcon, SvgIconProps, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";

export function FilterSvg({ sx, ...rest }: SvgIconProps): ReactElement {
    return (
        <SvgIcon
            viewBox="0 0 16 16"
            sx={{
                width: 16,
                height: 16,
                fill: "none",
                color: "current",
                ...sx,
            }}
            {...rest}
        >
            <mask
                id="mask0_5779_34561"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="16"
                height="16"
            >
                <rect width="16" height="16" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_5779_34561)">
                <path
                    d="M7.33335 13.3333C7.14446 13.3333 6.98612 13.2694 6.85835 13.1416C6.73057 13.0138 6.66668 12.8555 6.66668 12.6666V8.66663L2.80001 3.73329C2.63335 3.51107 2.60835 3.27774 2.72501 3.03329C2.84168 2.78885 3.04446 2.66663 3.33335 2.66663H12.6667C12.9556 2.66663 13.1583 2.78885 13.275 3.03329C13.3917 3.27774 13.3667 3.51107 13.2 3.73329L9.33335 8.66663V12.6666C9.33335 12.8555 9.26946 13.0138 9.14168 13.1416C9.0139 13.2694 8.85557 13.3333 8.66668 13.3333H7.33335Z"
                    fill="currentColor"
                />
            </g>
        </SvgIcon>
    );
}

FilterSvg.defaultProps = {
    sx: {},
};
