import { SvgIcon, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";

export default function LeftArrowSvg({
    sx,
}: {
    sx?: SxProps<Theme>;
}): ReactElement {
    return (
        <SvgIcon
            viewBox="0 0 25 25"
            sx={{ ...sx, width: 25, height: 25, fill: "none" }}
        >
            <path
                d="M19.3496 12.3772H5.34961"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12.3496 19.3772L5.34961 12.3772L12.3496 5.3772"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </SvgIcon>
    );
}

LeftArrowSvg.defaultProps = {
    sx: {},
};
