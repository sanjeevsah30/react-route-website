import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="7"
        height="5"
        viewBox="0 0 7 5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M3.57139 5L0.478446 0.714285L6.66434 0.714286L3.57139 5Z"
            fill="currentColor"
        />
    </svg>
);

function AscendingSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default AscendingSvg;
