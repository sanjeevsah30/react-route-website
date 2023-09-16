import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M8.625 6.57422L15.975 11.2992L8.625 16.0242V6.57422Z"
            stroke="#1A62F2"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="11" cy="11" r="9.7" stroke="#1A62F2" strokeWidth="1.4" />
    </svg>
);
function PlaySvgA(props) {
    return <Icon component={Svg} {...props} />;
}
export default PlaySvgA;
