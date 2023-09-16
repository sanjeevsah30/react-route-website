import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="8"
        height="14"
        viewBox="0 0 8 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M6.65685 0.999396L1 6.65625L6.65685 12.3131"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

function PrevSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default PrevSvg;
