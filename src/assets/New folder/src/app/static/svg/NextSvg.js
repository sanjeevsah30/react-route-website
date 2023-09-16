import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="9"
        height="14"
        viewBox="0 0 9 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M1.97059 0.999396L7.62744 6.65625L1.97059 12.3131"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

function NextSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default NextSvg;
