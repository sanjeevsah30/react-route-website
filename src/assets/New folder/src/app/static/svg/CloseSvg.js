import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M17 1L1 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M17 17L1 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

function CloseSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default CloseSvg;
