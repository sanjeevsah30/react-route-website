import { SvgIcon, SvgIconProps, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";

export default function EditSvg({ sx, ...rest }: SvgIconProps): ReactElement {
    return (
        <SvgIcon
            viewBox="0 0 16 16"
            sx={{ width: 16, height: 16, fill: "none", ...sx }}
            {...rest}
        >
            <path
                d="M2.16667 13.8333H3.33333L10.5208 6.64579L9.35417 5.47913L2.16667 12.6666V13.8333ZM14.0833 5.43746L10.5417 1.93746L11.7083 0.770793C12.0278 0.451348 12.4201 0.291626 12.8854 0.291626C13.3507 0.291626 13.7431 0.451348 14.0625 0.770793L15.2292 1.93746C15.5486 2.2569 15.7153 2.64232 15.7292 3.09371C15.7431 3.5451 15.5903 3.93051 15.2708 4.24996L14.0833 5.43746ZM12.875 6.66663L4.04167 15.5H0.5V11.9583L9.33333 3.12496L12.875 6.66663Z"
                fill="#333333"
            />
        </SvgIcon>
    );
}

EditSvg.defaultProps = {
    sx: {},
};
