import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M9.36133 7.42065L17.528 12.6707L9.36133 17.9207V7.42065Z"
            stroke="currentColor"
            strokewidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle
            cx="12"
            cy="12.3374"
            r="10.7"
            stroke="currentColor"
            strokeWidth="1.4"
        />
    </svg>
);

function SnippetPlaySvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default SnippetPlaySvg;
