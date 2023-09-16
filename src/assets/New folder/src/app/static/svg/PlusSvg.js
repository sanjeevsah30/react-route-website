import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="13"
        height="14"
        viewBox="0 0 13 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect
            x="0.385352"
            y="6.4"
            width="12.2"
            height="1.2"
            rx="0.6"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0.2"
        />
        <rect
            x="7.08535"
            y="0.9"
            width="12.2"
            height="1.2"
            rx="0.6"
            transform="rotate(90 7.08535 0.9)"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0.2"
        />
    </svg>
);

function PlusSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default PlusSvg;
