import { SvgIcon, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";

export default function ReportSvg({
    sx,
}: {
    sx?: SxProps<Theme>;
}): ReactElement {
    return (
        <SvgIcon
            viewBox="0 0 24 23"
            sx={{ width: 24, height: 23, fill: "none", ...sx }}
        >
            <path
                d="M23.9745 1.922C23.9085 1.1495 23.2845 0.5 22.5 0.5H1.5C0.7155 0.5 0.0915 1.1495 0.0255 1.922H0V21.5C0 21.8978 0.158035 22.2794 0.43934 22.5607C0.720644 22.842 1.10218 23 1.5 23H22.5C22.8978 23 23.2794 22.842 23.5607 22.5607C23.842 22.2794 24 21.8978 24 21.5V1.922H23.9745ZM9 9.5V5H15V9.5H9ZM15 11V15.6245H9V11H15ZM7.5 5V9.5H1.5V5H7.5ZM1.5 11H7.5V15.6245H1.5V11ZM1.5 21.5V17H7.5V21.5H1.5ZM9 21.5V17H15V21.5H9ZM22.5 21.5H16.5V17H22.5V21.5ZM22.5 15.6245H16.5V11H22.5V15.6245ZM22.5 9.5H16.5V5H22.5V9.5Z"
                fill="#333333"
            />
        </SvgIcon>
    );
}

ReportSvg.defaultProps = {
    sx: {},
};
