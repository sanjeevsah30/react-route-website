import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="14"
        height="8"
        viewBox="0 0 14 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M13 7L7 0.999999L1 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
function ChevronUpSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default ChevronUpSvg;
