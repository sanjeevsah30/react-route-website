import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
    >
        <path
            d="M22 2L11 13"
            stroke="#999999"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M22 2L15 22L11 13L2 9L22 2Z"
            stroke="#999999"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
function SendCommentOutlinedSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default SendCommentOutlinedSvg;
