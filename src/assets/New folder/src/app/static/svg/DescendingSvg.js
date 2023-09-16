import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="7"
        height="5"
        viewBox="0 0 7 5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M3.71425 0L6.8072 4.28571H0.621303L3.71425 0Z"
            fill="currentColor"
        />
    </svg>
);

function DescendingSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default DescendingSvg;
