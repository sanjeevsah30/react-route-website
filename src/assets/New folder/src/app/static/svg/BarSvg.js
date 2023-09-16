import React from "react";
import Icon from "@ant-design/icons";

function BarSvg(props) {
    return <Icon component={Svg} {...props} />;
}

const Svg = () => (
    <svg
        width="11"
        height="10"
        viewBox="0 0 11 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M1.3335 6.58325L8.3335 6.58325"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M1.3335 9.47217L10.3335 9.47217"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M1.3335 3.69434L10.3335 3.69434"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M1.3335 1.16675L8.3335 1.16675"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default BarSvg;
