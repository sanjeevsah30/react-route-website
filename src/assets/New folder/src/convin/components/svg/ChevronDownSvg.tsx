import { SvgIcon, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";

export default function ChevronDownSvg({
    sx,
}: {
    sx?: SxProps<Theme>;
}): ReactElement {
    return (
        <SvgIcon
            viewBox="0 0 14 8"
            sx={{ ...sx, width: 14, height: 8, fill: "none" }}
        >
            <path
                d="M13 7L7 0.999999L1 7"
                stroke="#666666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </SvgIcon>
    );
}

ChevronDownSvg.defaultProps = {
    sx: {},
};
