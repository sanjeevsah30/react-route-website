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
        <mask
            id="mask0_2295_15719"
            maskUnits="userSpaceOnUse"
            x="2"
            y="1"
            width="26"
            height="27"
        >
            <path
                d="M15 2.5V25.625"
                stroke="white"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M15 5H24.7156L26.25 7.5L24.7156 10H15V5ZM15 13.75H5.28437L3.75 16.25L5.28437 18.75H15V13.75Z"
                fill="white"
                stroke="white"
                strokeWidth="2.6"
                strokeLinejoin="round"
            />
            <path
                d="M10 26.25H20"
                stroke="white"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </mask>
        <g mask="url(#mask0_2295_15719)">
            <path d="M0 0H30V30H0V0Z" fill="white" />
        </g>
    </svg>
);
function StepsSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default StepsSvg;
