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
            d="M1 15L15 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M1 1H15V15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

function ArrowAnchorSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default ArrowAnchorSvg;
