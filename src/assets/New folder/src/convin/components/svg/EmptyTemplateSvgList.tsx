import { SvgIcon, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";

export default function EmptyTemplateListSvg({
    sx,
}: {
    sx?: SxProps<Theme>;
}): ReactElement {
    return (
        <SvgIcon
            viewBox="0 0 204 214"
            sx={{ width: 204, height: 214, fill: "none", ...sx }}
        >
            <path
                d="M102 204C158.333 204 204 158.333 204 102C204 45.667 158.333 0 102 0C45.667 0 0 45.667 0 102C0 158.333 45.667 204 102 204Z"
                fill="url(#paint0_linear_2915_16676)"
                fillOpacity="0.5"
            />
            <g filter="url(#filter0_d_2915_16676)">
                <path
                    d="M150.333 140.523H120.042V162.52H150.333V140.523ZM114.632 140.523H84.7011V162.52H114.632V140.523ZM84.7011 135.114H150.333V114.919H84.7011V135.114ZM79.6525 162.52V114.919H49V162.52H79.6525ZM49 109.51H114.632V61.9082H49V109.51ZM120.042 109.51H150.333V61.9082H120.042V109.51Z"
                    fill="white"
                />
            </g>
            <g filter="url(#filter1_d_2915_16676)">
                <circle cx="134.816" cy="159.184" r="30.1837" fill="white" />
            </g>
            <path
                d="M135 175C143.284 175 150 168.284 150 160C150 151.716 143.284 145 135 145C126.716 145 120 151.716 120 160C120 168.284 126.716 175 135 175Z"
                stroke="url(#paint1_linear_2915_16676)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M124.395 149.395L145.605 170.605"
                stroke="url(#paint2_linear_2915_16676)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <defs>
                <filter
                    id="filter0_d_2915_16676"
                    x="29"
                    y="45.9082"
                    width="141.334"
                    height="140.612"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="10" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.101961 0 0 0 0 0.384314 0 0 0 0 0.94902 0 0 0 0.2 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_2915_16676"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_2915_16676"
                        result="shape"
                    />
                </filter>
                <filter
                    id="filter1_d_2915_16676"
                    x="84.6328"
                    y="113"
                    width="100.367"
                    height="100.367"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                    />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="10" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.101961 0 0 0 0 0.384314 0 0 0 0 0.94902 0 0 0 0.2 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_2915_16676"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_2915_16676"
                        result="shape"
                    />
                </filter>
                <linearGradient
                    id="paint0_linear_2915_16676"
                    x1="102"
                    y1="-2.99487e-08"
                    x2="101.498"
                    y2="148.227"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#1A62F2" stopOpacity="0.5" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_2915_16676"
                    x1="135"
                    y1="145"
                    x2="135"
                    y2="175"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#1A62F2" />
                    <stop offset="1" stopColor="#9BBCFF" />
                </linearGradient>
                <linearGradient
                    id="paint2_linear_2915_16676"
                    x1="135"
                    y1="149.395"
                    x2="135"
                    y2="170.605"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#1A62F2" />
                    <stop offset="1" stopColor="#9BBCFF" />
                </linearGradient>
            </defs>
        </SvgIcon>
    );
}

EmptyTemplateListSvg.defaultProps = {
    sx: {},
};
