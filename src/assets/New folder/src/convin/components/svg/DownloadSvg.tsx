import { SvgIcon, SvgIconProps } from "@mui/material";
import { ReactElement } from "react";

export default function DownloadSvg({
    sx,
    ...rest
}: SvgIconProps): ReactElement {
    return (
        <SvgIcon
            viewBox="0 0 22 20"
            sx={{ width: 22, height: 20, fill: "none", ...sx }}
            {...rest}
        >
            <path
                d="M18.8002 12.3125V15.3792C18.8002 15.7858 18.6176 16.1758 18.2925 16.4634C17.9674 16.7509 17.5266 16.9125 17.0669 16.9125H4.93353C4.47382 16.9125 4.03294 16.7509 3.70788 16.4634C3.38281 16.1758 3.2002 15.7858 3.2002 15.3792V12.3125"
                stroke="#666666"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M6.66699 8.47925L11.0003 12.3126L15.3337 8.47925"
                stroke="#666666"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M11 12.3125V3.11255"
                stroke="#666666"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </SvgIcon>
    );
}

DownloadSvg.defaultProps = {
    sx: {},
};
