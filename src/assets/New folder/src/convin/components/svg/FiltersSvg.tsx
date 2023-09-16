import { SvgIcon, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";

export default function FiltersSvg({
    sx,
}: {
    sx?: SxProps<Theme>;
}): ReactElement {
    return (
        <SvgIcon
            viewBox="0 0 24 24"
            sx={{ width: 24, height: 24, fill: "none", ...sx }}
        >
            <mask
                id="mask0_7512_41415"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="24"
                height="24"
            >
                <rect width="24" height="24" fill="#fff" />
            </mask>
            <g mask="url(#mask0_7512_41415)">
                <path
                    d="M11 21V15H13V17H21V19H13V21H11ZM3 19V17H9V19H3ZM7 15V13H3V11H7V9H9V15H7ZM11 13V11H21V13H11ZM15 9V3H17V5H21V7H17V9H15ZM3 7V5H13V7H3Z"
                    fill="#666666"
                />
            </g>
        </SvgIcon>
    );
}

FiltersSvg.defaultProps = {
    sx: {},
};
