import React from "react";
import Icon from "@ant-design/icons";

function AuditCategories(props) {
    return <Icon component={Svg} {...props} />;
}

const Svg = () => (
    <svg
        width="74"
        height="74"
        viewBox="0 0 74 74"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="37" cy="37" r="37" fill="white" />
        <path
            d="M52 46.8004C52 47.543 51.705 48.2552 51.1799 48.7803C50.6548 49.3054 49.9426 49.6004 49.2 49.6004H26.8C26.0574 49.6004 25.3452 49.3054 24.8201 48.7803C24.295 48.2552 24 47.543 24 46.8004V27.2004C24 26.4578 24.295 25.7456 24.8201 25.2205C25.3452 24.6954 26.0574 24.4004 26.8 24.4004H33.8L36.6 28.6004H49.2C49.9426 28.6004 50.6548 28.8954 51.1799 29.4205C51.705 29.9456 52 30.6578 52 31.4004V46.8004Z"
            stroke="black"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default AuditCategories;
