import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="56" height="56" rx="6" fill="#1A62F2" fillOpacity="0.1" />
        <path
            d="M28 18.6666C28 18.6666 25.75 15.7192 20.5 15.7192C15.25 15.7192 13 18.6666 13 18.6666V39.2982C13 39.2982 15.25 37.8245 20.5 37.8245C25.75 37.8245 28 39.2982 28 39.2982M28 18.6666V39.2982M28 18.6666C28 18.6666 30.25 15.7192 35.5 15.7192C40.75 15.7192 43 18.6666 43 18.6666V39.2982C43 39.2982 40.75 37.8245 35.5 37.8245C30.25 37.8245 28 39.2982 28 39.2982"
            stroke="#1A62F2"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

function NotStartedSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default NotStartedSvg;
