import { SvgIcon, SvgIconProps } from "@mui/material";
import { ReactElement } from "react";

export default function MoveMemberSvg({
    sx,
    ...rest
}: SvgIconProps): ReactElement {
    return (
        <SvgIcon
            viewBox="0 0 24 24"
            sx={{ width: 22, height: 22, fill: "", ...sx }}
            {...rest}
        >
            <path
                d="M17.15 10.6333H5V8.6333H17.15L15.6 7.0833L17 5.6333L21 9.6333L17 13.6333L15.6 12.1833L17.15 10.6333ZM12 6.6333V2.6333H2V16.6333H12V12.6333H14V16.6333C14 17.1833 13.8042 17.6541 13.4125 18.0458C13.0208 18.4375 12.55 18.6333 12 18.6333H2C1.45 18.6333 0.979167 18.4375 0.5875 18.0458C0.195833 17.6541 0 17.1833 0 16.6333V2.6333C0 2.0833 0.195833 1.61247 0.5875 1.2208C0.979167 0.829134 1.45 0.633301 2 0.633301H12C12.55 0.633301 13.0208 0.829134 13.4125 1.2208C13.8042 1.61247 14 2.0833 14 2.6333V6.6333H12Z"
                fill="#1C1B1F"
            />
        </SvgIcon>
    );
}

MoveMemberSvg.defaultProps = {
    sx: {},
};
