import { SvgIcon, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";

export default function DownArrowFilledSvg({
    sx,
}: {
    sx?: SxProps<Theme>;
}): ReactElement {
    return (
        <SvgIcon
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            sx={{ width: 24, height: 24, fill: "none", ...sx }}
        >
            <path d="M17 14L12 9L7 14L17 14Z" fill="current" />
        </SvgIcon>
    );
}

DownArrowFilledSvg.defaultProps = {
    sx: {},
};
