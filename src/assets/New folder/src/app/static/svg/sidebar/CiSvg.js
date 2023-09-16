import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle
            cx="7.15385"
            cy="10.8462"
            r="4.15385"
            stroke="#999999"
            strokeWidth="2"
        />
        <circle cx="21" cy="9" r="6" stroke="#999999" strokeWidth="2" />
        <circle
            cx="13.6155"
            cy="21.9231"
            r="5.07692"
            stroke="#999999"
            strokeWidth="2"
        />
    </svg>
);

const activeSvg = () => (
    <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle
            cx="7.15385"
            cy="10.8462"
            r="4.15385"
            fill="#1A62F2"
            stroke="#1A62F2"
            strokeWidth="2"
        />
        <circle
            cx="21"
            cy="9"
            r="6"
            fill="#1A62F2"
            stroke="#1A62F2"
            strokeWidth="2"
        />
        <circle
            cx="13.6155"
            cy="21.9231"
            r="5.07692"
            fill="#1A62F2"
            stroke="#1A62F2"
            strokeWidth="2"
        />
    </svg>
);

function CiSvg({ isActive, ...rest }) {
    return <Icon component={isActive ? activeSvg : Svg} {...rest} />;
}

export default CiSvg;
