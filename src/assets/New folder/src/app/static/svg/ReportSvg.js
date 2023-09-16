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
        <rect
            x="4"
            y="4"
            width="22"
            height="22"
            rx="2.36296"
            stroke="currentColor"
            strokeWidth="1.83333"
        />
        <path
            d="M21.4165 9.86667L17.5098 15.7267C16.9633 16.5465 15.7349 16.4701 15.2942 15.5887L14.7055 14.4113C14.2648 13.5299 13.0364 13.4535 12.4898 14.2733L8.58317 20.1333"
            stroke="currentColor"
            strokeWidth="1.83333"
            strokeLinecap="round"
            strokeLinejoin="round"
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
        <rect
            x="4"
            y="4"
            width="22"
            height="22"
            rx="2.36296"
            fill="#1A62F2"
            stroke="#1A62F2"
            strokeWidth="1.83333"
        />
        <path
            d="M21.4167 9.86667L17.5101 15.7267C16.9635 16.5465 15.7351 16.4701 15.2944 15.5887L14.7057 14.4113C14.2651 13.5299 13.0367 13.4535 12.4901 14.2733L8.58342 20.1333"
            stroke="white"
            strokeWidth="1.83333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

function ReportSvg({ isActive, ...rest }) {
    return <Icon component={isActive ? activeSvg : Svg} {...rest} />;
}

export default ReportSvg;
