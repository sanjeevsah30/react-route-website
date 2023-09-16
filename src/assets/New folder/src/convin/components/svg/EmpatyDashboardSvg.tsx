import { SvgIcon, SxProps, Theme } from "@mui/material";
import { ReactElement } from "react";

export default function EmptyDashboardSvg({
    sx,
}: {
    sx?: SxProps<Theme>;
}): ReactElement {
    return (
        <SvgIcon
            viewBox="0 0 204 204"
            sx={{ width: 204, height: 214, fill: "none", ...sx }}
        >
            <path
                d="M102 204C158.333 204 204 158.333 204 102C204 45.667 158.333 0 102 0C45.667 0 0 45.667 0 102C0 158.333 45.667 204 102 204Z"
                fill="url(#paint0_linear_4506_35952)"
                fillOpacity="0.5"
            />
            <g filter="url(#filter0_d_4506_35952)">
                <path
                    d="M150.333 140.523H120.042V162.52H150.333V140.523ZM114.632 140.523H84.7011V162.52H114.632V140.523ZM84.7011 135.114H150.333V114.919H84.7011V135.114ZM79.6525 162.52V114.919H49V162.52H79.6525ZM49 109.51H114.632V61.9082H49V109.51ZM120.042 109.51H150.333V61.9082H120.042V109.51Z"
                    fill="white"
                />
            </g>
            <g filter="url(#filter1_d_4506_35952)">
                <circle cx="134.816" cy="159.184" r="30.1837" fill="white" />
            </g>
            <path
                d="M151.801 175.461C147.674 179.588 140.963 179.588 136.836 175.461L116.17 154.795C113.227 151.853 113.227 147.048 116.17 144.106C119.112 141.163 123.917 141.163 126.859 144.106L147.526 164.772C149.284 166.53 149.284 169.428 147.526 171.186C145.767 172.944 142.87 172.944 141.112 171.186L121.158 151.232C121.015 151.092 120.9 150.926 120.821 150.741C120.743 150.557 120.702 150.359 120.7 150.159C120.699 149.958 120.737 149.76 120.813 149.574C120.889 149.389 121.001 149.221 121.143 149.079C121.285 148.937 121.453 148.825 121.638 148.749C121.824 148.673 122.022 148.635 122.223 148.636C122.423 148.637 122.621 148.679 122.805 148.757C122.99 148.836 123.156 148.95 123.296 149.094L143.25 169.048C143.86 169.658 144.777 169.659 145.388 169.048C145.998 168.437 145.998 167.521 145.388 166.91L124.721 146.244C122.926 144.448 120.103 144.448 118.308 146.244C116.513 148.039 116.513 150.862 118.308 152.657L138.974 173.324C141.953 176.303 146.684 176.303 149.663 173.324C152.643 170.344 152.643 165.614 149.663 162.634L129.71 142.68C129.566 142.541 129.452 142.374 129.373 142.19C129.294 142.005 129.253 141.807 129.252 141.607C129.25 141.407 129.289 141.208 129.365 141.023C129.441 140.837 129.553 140.669 129.695 140.527C129.836 140.386 130.005 140.274 130.19 140.197C130.375 140.121 130.574 140.083 130.774 140.084C130.975 140.086 131.173 140.127 131.357 140.206C131.541 140.284 131.708 140.399 131.848 140.543L151.801 160.496C155.928 164.623 155.928 171.335 151.801 175.461Z"
                fill="url(#paint1_linear_4506_35952)"
            />
            <defs>
                <filter
                    id="filter0_d_4506_35952"
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
                        result="effect1_dropShadow_4506_35952"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_4506_35952"
                        result="shape"
                    />
                </filter>
                <filter
                    id="filter1_d_4506_35952"
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
                        result="effect1_dropShadow_4506_35952"
                    />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_4506_35952"
                        result="shape"
                    />
                </filter>
                <linearGradient
                    id="paint0_linear_4506_35952"
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
                    id="paint1_linear_4506_35952"
                    x1="113.963"
                    y1="159.321"
                    x2="154.896"
                    y2="159.321"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0.046875" stopColor="#1A62F2" />
                    <stop offset="1" stopColor="#9BBCFF" />
                </linearGradient>
            </defs>
        </SvgIcon>
    );
}

EmptyDashboardSvg.defaultProps = {
    sx: {},
};
