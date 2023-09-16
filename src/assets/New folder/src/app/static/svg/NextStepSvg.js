import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="17"
        height="18"
        viewBox="0 0 17 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M10.85 10.3666L14.2666 6.94998L10.85 3.53333"
            stroke="#1A62F2"
            stroke-width="1.36666"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M3.33325 13.1001V9.18643C3.33325 8.59331 3.58523 8.02449 4.03375 7.60509C4.48228 7.18569 5.0906 6.95007 5.72491 6.95007H12.8999"
            stroke="#1A62F2"
            stroke-width="1.36666"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
);

function NextStepSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default NextStepSvg;
