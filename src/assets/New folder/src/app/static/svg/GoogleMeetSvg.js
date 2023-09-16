import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="30"
        height="25"
        viewBox="0 0 30 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g clipPath="url(#clip0_5342_31135)">
            <path
                d="M16.9702 12.4156L19.895 15.7772L23.8281 18.3039L24.5142 12.4377L23.8281 6.69922L19.8193 8.91899L16.9702 12.4156Z"
                fill="#188038"
            />
            <path
                d="M0 17.7584V22.7578C0 23.902 0.92041 24.8278 2.05811 24.8278H7.02881L8.05664 21.0487L7.02881 17.7584L3.61816 16.7246L0 17.7584Z"
                fill="#1967D2"
            />
            <path
                d="M7.02881 0L0 7.06939L3.61816 8.10316L7.02881 7.06939L8.03955 3.82322L7.02881 0Z"
                fill="#EA4335"
            />
            <path d="M0 17.7581H7.02881V7.06934H0V17.7581Z" fill="#4285F4" />
            <path
                d="M28.3179 2.99287L23.8281 6.69822V18.3029L28.3374 22.023C29.0137 22.5534 30 22.0697 30 21.2078V3.79336C30 2.9192 28.9893 2.44038 28.3179 2.99287ZM16.9702 12.4146V17.7603H7.02881V24.8297H21.7725C22.9102 24.8297 23.8306 23.9039 23.8306 22.7597V18.3029L16.9702 12.4146Z"
                fill="#34A853"
            />
            <path
                d="M21.7725 0H7.02881V7.06939H16.9727V12.415L23.8281 6.69861V2.06999C23.8281 0.925725 22.9077 0 21.7725 0Z"
                fill="#FBBC04"
            />
        </g>
        <defs>
            <clipPath id="clip0_5342_31135">
                <rect width="30" height="24.8276" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

function GoogleMeetSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default GoogleMeetSvg;
