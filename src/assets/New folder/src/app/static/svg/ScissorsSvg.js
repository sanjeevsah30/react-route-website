// ScissorsSvg
import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M3.47057 5.66667C4.83503 5.66667 5.94114 4.622 5.94114 3.33333C5.94114 2.04467 4.83503 1 3.47057 1C2.10611 1 1 2.04467 1 3.33333C1 4.622 2.10611 5.66667 3.47057 5.66667Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M3.47057 14.9997C4.83503 14.9997 5.94114 13.955 5.94114 12.6663C5.94114 11.3777 4.83503 10.333 3.47057 10.333C2.10611 10.333 1 11.3777 1 12.6663C1 13.955 2.10611 14.9997 3.47057 14.9997Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M15.0003 1.77734L5.2168 11.0173"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M10.4453 9.92871L14.9994 14.222"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M5.2168 4.98242L8.41207 8.0002"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

function ScissorsSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default ScissorsSvg;
