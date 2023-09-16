import { SvgIcon, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";

export default function ColdLeadSvg({
    sx,
}: {
    sx?: SxProps<Theme>;
}): ReactElement {
    return (
        <SvgIcon
            viewBox="0 0 16 16"
            sx={{ ...sx, width: 16, height: 16, fill: "none" }}
        >
            <mask
                id="mask0_8541_45938"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="16"
                height="16"
            >
                <rect width="16" height="16" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_8541_45938)">
                <path
                    d="M7.3335 14.6668V11.9002L5.16683 14.0335L4.2335 13.1002L7.3335 10.0002V8.66683H6.00016L2.90016 11.7668L1.96683 10.8335L4.10016 8.66683H1.3335V7.3335H4.10016L1.96683 5.16683L2.90016 4.2335L6.00016 7.3335H7.3335V6.00016L4.2335 2.90016L5.16683 1.96683L7.3335 4.10016V1.3335H8.66683V4.10016L10.8335 1.96683L11.7668 2.90016L8.66683 6.00016V7.3335H10.0002L13.1002 4.2335L14.0335 5.16683L11.9002 7.3335H14.6668V8.66683H11.9002L14.0335 10.8335L13.1002 11.7668L10.0002 8.66683H8.66683V10.0002L11.7668 13.1002L10.8335 14.0335L8.66683 11.9002V14.6668H7.3335Z"
                    fill="#73B1FF"
                />
            </g>
        </SvgIcon>
    );
}

ColdLeadSvg.defaultProps = {
    sx: {},
};
