import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="33"
        height="22"
        viewBox="0 0 33 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle
            cx="11"
            cy="11"
            r="8.25"
            fill="white"
            stroke="#6699FF"
            strokeWidth="5.5"
        />
        <circle
            cx="22"
            cy="11"
            r="8.25"
            fill="white"
            stroke="#5FE6EB"
            strokeWidth="5.5"
        />
    </svg>
);

function ConvinLogoSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default ConvinLogoSvg;
