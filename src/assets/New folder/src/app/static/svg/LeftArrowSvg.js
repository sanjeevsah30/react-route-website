import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M17 9H1"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M9 17L1 9L9 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

function LeftArrowSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default LeftArrowSvg;
