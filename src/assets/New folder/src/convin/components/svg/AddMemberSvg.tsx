import { SvgIcon, SvgIconProps } from "@mui/material";
import { ReactElement } from "react";

export default function AddMemberSvg({
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
                d="M12.875 8.5C12.875 6.56625 11.3088 5 9.375 5C7.44125 5 5.875 6.56625 5.875 8.5C5.875 10.4338 7.44125 12 9.375 12C11.3088 12 12.875 10.4338 12.875 8.5ZM11.125 8.5C11.125 9.4625 10.3375 10.25 9.375 10.25C8.4125 10.25 7.625 9.4625 7.625 8.5C7.625 7.5375 8.4125 6.75 9.375 6.75C10.3375 6.75 11.125 7.5375 11.125 8.5ZM2.375 17.25V19H16.375V17.25C16.375 14.9225 11.7113 13.75 9.375 13.75C7.03875 13.75 2.375 14.9225 2.375 17.25ZM4.125 17.25C4.3 16.6287 7.0125 15.5 9.375 15.5C11.7288 15.5 14.4325 16.62 14.625 17.25H4.125ZM19 14.625V12H21.625V10.25H19V7.625H17.25V10.25H14.625V12H17.25V14.625H19Z"
                fill="#333333"
            />
        </SvgIcon>
    );
}

AddMemberSvg.defaultProps = {
    sx: {},
};
