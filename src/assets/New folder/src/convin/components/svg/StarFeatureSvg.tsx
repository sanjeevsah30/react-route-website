import { SvgIcon, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";

export default function StarFeatureSvg({
    sx,
}: {
    sx?: SxProps<Theme>;
}): ReactElement {
    return (
        <SvgIcon
            viewBox="0 0 20 20"
            sx={{ width: 20, height: 20, fill: "none", ...sx }}
        >
            <mask
                id="mask0_8798_53479"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="20"
                height="20"
            >
                <rect width="20" height="20" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_8798_53479)">
                <path
                    d="M15.8334 7.49967L14.7917 5.20801L12.5 4.16634L14.7917 3.12467L15.8334 0.833008L16.875 3.12467L19.1667 4.16634L16.875 5.20801L15.8334 7.49967ZM15.8334 19.1663L14.7917 16.8747L12.5 15.833L14.7917 14.7913L15.8334 12.4997L16.875 14.7913L19.1667 15.833L16.875 16.8747L15.8334 19.1663ZM7.50004 16.6663L5.41671 12.083L0.833374 9.99967L5.41671 7.91634L7.50004 3.33301L9.58337 7.91634L14.1667 9.99967L9.58337 12.083L7.50004 16.6663ZM7.50004 12.6247L8.33337 10.833L10.125 9.99967L8.33337 9.16634L7.50004 7.37467L6.66671 9.16634L4.87504 9.99967L6.66671 10.833L7.50004 12.6247Z"
                    fill="#333333"
                />
                <mask
                    id="mask1_8798_53479"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                >
                    <rect width="20" height="20" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask1_8798_53479)">
                    <path
                        d="M15.8334 7.49967L14.7917 5.20801L12.5 4.16634L14.7917 3.12467L15.8334 0.833008L16.875 3.12467L19.1667 4.16634L16.875 5.20801L15.8334 7.49967ZM15.8334 19.1663L14.7917 16.8747L12.5 15.833L14.7917 14.7913L15.8334 12.4997L16.875 14.7913L19.1667 15.833L16.875 16.8747L15.8334 19.1663ZM7.50004 16.6663L5.41671 12.083L0.833374 9.99967L5.41671 7.91634L7.50004 3.33301L9.58337 7.91634L14.1667 9.99967L9.58337 12.083L7.50004 16.6663ZM7.50004 12.6247L8.33337 10.833L10.125 9.99967L8.33337 9.16634L7.50004 7.37467L6.66671 9.16634L4.87504 9.99967L6.66671 10.833L7.50004 12.6247Z"
                        fill="url(#paint0_linear_8798_53479)"
                    />
                </g>
            </g>
            <defs>
                <linearGradient
                    id="paint0_linear_8798_53479"
                    x1="4.37585"
                    y1="2.50049"
                    x2="14.3759"
                    y2="15.6255"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FF1B79" />
                    <stop offset="0.546875" stopColor="#FF4E60" />
                    <stop offset="0.994792" stopColor="#2D66E8" />
                </linearGradient>
            </defs>
        </SvgIcon>
    );
}

StarFeatureSvg.defaultProps = {
    sx: {},
};
