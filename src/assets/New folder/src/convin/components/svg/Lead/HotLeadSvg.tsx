import { SvgIcon, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";

export default function HotLeadSvg({
    sx,
}: {
    sx?: SxProps<Theme>;
}): ReactElement {
    return (
        <SvgIcon
            viewBox="0 0 16 16"
            sx={{ ...sx, width: 16, height: 16, fill: "none" }}
        >
            <path
                d="M11 5.33328C11 6.33328 10.6667 7.66661 9.06667 8.19995C9.53333 7.06661 9.6 5.93328 9.26667 4.86661C8.8 3.46661 7.26667 2.39995 6.2 1.79995C5.93333 1.59995 5.46667 1.86661 5.53333 2.26661C5.53333 2.99995 5.33333 4.06661 4.2 5.19995C2.73333 6.66661 2 8.19995 2 9.66661C2 11.5999 3.33333 13.9999 6 13.9999C3.33333 11.3333 5.33333 8.99995 5.33333 8.99995C5.86667 12.9333 8.66667 13.9999 10 13.9999C11.1333 13.9999 13.3333 13.1999 13.3333 9.73328C13.3333 7.66661 12.4667 6.06661 11.7333 5.13328C11.5333 4.79995 11.0667 4.99995 11 5.33328Z"
                fill="#FF8754"
            />
        </SvgIcon>
    );
}

HotLeadSvg.defaultProps = {
    sx: {},
};
