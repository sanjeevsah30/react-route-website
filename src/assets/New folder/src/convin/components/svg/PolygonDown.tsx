import { SvgIcon, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";

<svg
    width="8"
    height="7"
    viewBox="0 0 8 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
/>;

export default function PolygonDown({
    sx,
}: {
    sx?: SxProps<Theme>;
}): ReactElement {
    return (
        <SvgIcon
            viewBox="0 0 8 7"
            sx={{ width: 8, height: 7, fill: "none", ...sx }}
        >
            <path
                d="M4.31836 6.24561L7.78246 0.245605L0.854258 0.245605L4.31836 6.24561Z"
                fill="currentColor"
            />
        </SvgIcon>
    );
}

PolygonDown.defaultProps = {
    sx: {},
};
