import { SvgIcon, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";
export default function CloseSvg({
    sx,
}: {
    sx?: SxProps<Theme>;
}): ReactElement {
    return (
        <SvgIcon
            fill="none"
            viewBox="0 0 14 15"
            sx={{ width: 14, height: 14, ...sx }}
            className="cursor-pointer"
        >
            <path
                d="M1.4 14.5L0 13.1L5.6 7.5L0 1.9L1.4 0.5L7 6.1L12.6 0.5L14 1.9L8.4 7.5L14 13.1L12.6 14.5L7 8.9L1.4 14.5Z"
                fill="#666666"
            />
        </SvgIcon>
    );
}

CloseSvg.defaultProps = {
    sx: {},
};
