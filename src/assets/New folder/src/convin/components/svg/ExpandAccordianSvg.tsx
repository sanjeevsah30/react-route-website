import { SvgIcon, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";

<svg
    width="17"
    height="19"
    viewBox="0 0 17 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
></svg>;

export default function ExpandAccordianSvg({
    sx,
}: {
    sx?: SxProps<Theme>;
}): ReactElement {
    return (
        <SvgIcon
            viewBox="0 0 8 5"
            sx={{ width: 8, height: 5, fill: "none", ...sx }}
        >
            <path d="M0.25 0.5L4 4.25L7.75 0.5H0.25Z" fill="#1D1B20" />
        </SvgIcon>
    );
}

ExpandAccordianSvg.defaultProps = {
    sx: {},
};
