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
            id="mask0_2295_15673"
            maskUnits="userSpaceOnUse"
            x="1"
            y="5"
            width="28"
            height="20"
        >
            <path
                d="M21.25 6.25L26.25 11.25M26.25 6.25L21.25 11.25M27.5 18.75L23.125 23.75L20.625 21.25"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16.25 6.25H2.5V11.25H16.25V6.25ZM16.25 18.75H2.5V23.75H16.25V18.75Z"
                fill="white"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </mask>
        <g mask="url(#mask0_2295_15673)">
            <path d="M0 0H30V30H0V0Z" fill="white" />
        </g>
    </svg>
);
function CheckPointSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default CheckPointSvg;
