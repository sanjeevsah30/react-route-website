import { SvgIcon, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";

export default function DragSvg({ sx }: { sx?: SxProps<Theme> }): ReactElement {
    return (
        <SvgIcon
            viewBox="0 0 25 24"
            sx={{ ...sx, width: 25, height: 24, fill: "none" }}
        >
            <path
                d="M7.55166 13C8.11306 13 8.56816 12.5523 8.56816 12C8.56816 11.4477 8.11306 11 7.55166 11C6.99026 11 6.53516 11.4477 6.53516 12C6.53516 12.5523 6.99026 13 7.55166 13Z"
                stroke="#999999"
                strokeOpacity="0.4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M15.6845 13C16.2459 13 16.701 12.5523 16.701 12C16.701 11.4477 16.2459 11 15.6845 11C15.1231 11 14.668 11.4477 14.668 12C14.668 12.5523 15.1231 13 15.6845 13Z"
                stroke="#999999"
                strokeOpacity="0.4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M7.55166 6C8.11306 6 8.56816 5.55228 8.56816 5C8.56816 4.44772 8.11306 4 7.55166 4C6.99026 4 6.53516 4.44772 6.53516 5C6.53516 5.55228 6.99026 6 7.55166 6Z"
                stroke="#999999"
                strokeOpacity="0.4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M15.6845 6C16.2459 6 16.701 5.55228 16.701 5C16.701 4.44772 16.2459 4 15.6845 4C15.1231 4 14.668 4.44772 14.668 5C14.668 5.55228 15.1231 6 15.6845 6Z"
                stroke="#999999"
                strokeOpacity="0.4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M7.55166 20C8.11306 20 8.56816 19.5523 8.56816 19C8.56816 18.4477 8.11306 18 7.55166 18C6.99026 18 6.53516 18.4477 6.53516 19C6.53516 19.5523 6.99026 20 7.55166 20Z"
                stroke="#999999"
                strokeOpacity="0.4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M15.6845 20C16.2459 20 16.701 19.5523 16.701 19C16.701 18.4477 16.2459 18 15.6845 18C15.1231 18 14.668 18.4477 14.668 19C14.668 19.5523 15.1231 20 15.6845 20Z"
                stroke="#999999"
                strokeOpacity="0.4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </SvgIcon>
    );
}

DragSvg.defaultProps = {
    sx: {},
};
