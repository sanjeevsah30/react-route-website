import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g clipPath="url(#clip0_923_7093)">
            <path
                d="M9.99935 18.3334C14.6017 18.3334 18.3327 14.6025 18.3327 10.0001C18.3327 5.39771 14.6017 1.66675 9.99935 1.66675C5.39698 1.66675 1.66602 5.39771 1.66602 10.0001C1.66602 14.6025 5.39698 18.3334 9.99935 18.3334Z"
                stroke="#F9F9F9"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10 15C12.7614 15 15 12.7614 15 10C15 7.23858 12.7614 5 10 5C7.23858 5 5 7.23858 5 10C5 12.7614 7.23858 15 10 15Z"
                stroke="#F9F9F9"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10.0007 11.6666C10.9211 11.6666 11.6673 10.9204 11.6673 9.99992C11.6673 9.07944 10.9211 8.33325 10.0007 8.33325C9.08018 8.33325 8.33398 9.07944 8.33398 9.99992C8.33398 10.9204 9.08018 11.6666 10.0007 11.6666Z"
                stroke="#F9F9F9"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
        <defs>
            <clipPath id="clip0_923_7093">
                <rect width="20" height="20" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

function ThreeCircleSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default ThreeCircleSvg;
