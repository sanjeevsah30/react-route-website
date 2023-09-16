import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M1.16602 7H12.8327"
            stroke="#1A62F2"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M7 1.1665L12.8333 6.99984L7 12.8332"
            stroke="#1A62F2"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
);
function RightArrowSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default RightArrowSvg;
