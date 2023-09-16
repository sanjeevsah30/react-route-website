import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="13"
        height="13"
        viewBox="0 0 13 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M1.5 9V11H3.5L11.5 3L9.5 1L1.5 9Z" stroke="currentColor" />
        <path d="M7 3L9 5" stroke="currentColor" />
        <path d="M1 12.5H12" stroke="currentColor" strokeLinecap="round" />
    </svg>
);

function EditCommentSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default EditCommentSvg;
