import { SvgIcon, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";

export default function NoDataSvg({
    sx,
}: {
    sx?: SxProps<Theme>;
}): ReactElement {
    return (
        <SvgIcon
            viewBox="0 0 204 204"
            sx={{ width: 102, height: 102, fill: "none", ...sx }}
        >
            <path
                d="M102 204C158.333 204 204 158.333 204 102C204 45.667 158.333 0 102 0C45.667 0 0 45.667 0 102C0 158.333 45.667 204 102 204Z"
                fill="url(#paint0_linear_3498:6190)"
                fillOpacity="0.5"
            />
            <g filter="url(#filter0_d_3498:6190)">
                <path
                    d="M84.8621 132.722C88.709 132.722 91.8382 135.14 91.8382 138.112C91.8382 142.462 96.4174 146 102.047 146C107.676 146 112.256 142.47 112.256 138.13C112.256 135.14 115.385 132.722 119.232 132.722H155.53C155.691 132.722 155.842 132.75 156 132.758L139.183 86.3116C138.904 85.539 137.997 85 136.951 85H66.3526C65.2829 85 64.3759 85.557 64.0969 86.3476L48 132.766C48.189 132.754 48.3704 132.722 48.5635 132.722H84.8621Z"
                    fill="white"
                />
            </g>
            <g filter="url(#filter1_d_3498:6190)">
                <path
                    d="M155.588 137.41H119.218C117.937 137.41 116.888 138.459 116.888 139.74C116.888 139.74 116.888 139.74 116.888 139.763C116.888 147.965 110.201 154.628 102 154.628C93.7988 154.628 87.1118 147.941 87.1118 139.74C87.1118 138.459 86.0635 137.41 84.7819 137.41H48.4119C47.1305 137.41 46.082 138.459 46.082 139.74V174.665C46.082 175.947 47.1305 176.995 48.4119 176.995H155.588C156.869 176.995 157.918 175.947 157.918 174.665V139.74C157.918 138.459 156.869 137.41 155.588 137.41Z"
                    fill="white"
                />
            </g>
            <path
                opacity="0.8"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M91.7715 138.924C91.7715 135.515 88.6361 132.741 84.7817 132.741H59.9902L71.7587 95.0008H100.498L100.5 95L100.502 95.0008H131.1L135.491 107.908L135.665 107.973L144.196 132.741H119.218C115.364 132.741 112.229 135.515 112.229 138.945C112.229 143.923 107.641 147.972 102 147.972C96.3596 147.972 91.7715 143.914 91.7715 138.924Z"
                fill="url(#paint1_linear_3498:6190)"
            />
            <path
                d="M102 66V78"
                stroke="url(#paint2_linear_3498:6190)"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M133.5 65.0823L126 78.6541"
                stroke="url(#paint3_linear_3498:6190)"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M70 65L77.9836 78.3371"
                stroke="url(#paint4_linear_3498:6190)"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <defs>
                <filter
                    id="filter0_d_3498:6190"
                    x="28"
                    y="69"
                    width="148"
                    height="101"
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
                        values="0 0 0 0 0.101961 0 0 0 0 0.384314 0 0 0 0 0.94902 0 0 0 0.15 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_3498:6190"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_3498:6190"
                        result="shape"
                    />
                </filter>
                <filter
                    id="filter1_d_3498:6190"
                    x="26.082"
                    y="121.41"
                    width="151.836"
                    height="79.5859"
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
                        values="0 0 0 0 0.101961 0 0 0 0 0.384314 0 0 0 0 0.94902 0 0 0 0.15 0"
                    />
                    <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_3498:6190"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_3498:6190"
                        result="shape"
                    />
                </filter>
                <linearGradient
                    id="paint0_linear_3498:6190"
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
                    id="paint1_linear_3498:6190"
                    x1="102.093"
                    y1="95"
                    x2="102.093"
                    y2="147.972"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#1A62F2" />
                    <stop offset="1" stopColor="#9BBCFF" />
                </linearGradient>
                <linearGradient
                    id="paint2_linear_3498:6190"
                    x1="102.5"
                    y1="66"
                    x2="102.5"
                    y2="78"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#1A62F2" />
                    <stop offset="1" stopColor="#9BBCFF" />
                </linearGradient>
                <linearGradient
                    id="paint3_linear_3498:6190"
                    x1="129.992"
                    y1="65.0412"
                    x2="129.832"
                    y2="78.699"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#1A62F2" />
                    <stop offset="1" stopColor="#9BBCFF" />
                </linearGradient>
                <linearGradient
                    id="paint4_linear_3498:6190"
                    x1="74.2267"
                    y1="65.0496"
                    x2="74.0714"
                    y2="78.2912"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#1A62F2" />
                    <stop offset="1" stopColor="#9BBCFF" />
                </linearGradient>
            </defs>
        </SvgIcon>
    );
}

NoDataSvg.defaultProps = {
    sx: {},
};
