import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="14"
        height="3"
        viewBox="0 0 14 3"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect
            x="0.9"
            y="0.9"
            width="12.2"
            height="1.2"
            rx="0.6"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0.2"
        />
    </svg>
);

function MinusSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default MinusSvg;
