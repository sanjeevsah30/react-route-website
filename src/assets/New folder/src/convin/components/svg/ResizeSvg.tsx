import { SvgIcon, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";

export default function ResizeSvg({
    sx,
}: {
    sx?: SxProps<Theme>;
}): ReactElement {
    return (
        <SvgIcon
            viewBox="0 0 18 18"
            sx={{ width: 18, height: 18, fill: "none", ...sx }}
        >
            <path
                d="M3.45055 16.9284L1 14.4779L3.45055 12.0273"
                stroke="#999999"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M14.478 1V13.2527C14.478 13.5777 14.3489 13.8893 14.1191 14.1191C13.8893 14.3489 13.5777 14.478 13.2527 14.478H1"
                stroke="#999999"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12.0273 3.45055L14.4779 1L16.9284 3.45055"
                stroke="#999999"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </SvgIcon>
    );
}

ResizeSvg.defaultProps = {
    sx: {},
};
