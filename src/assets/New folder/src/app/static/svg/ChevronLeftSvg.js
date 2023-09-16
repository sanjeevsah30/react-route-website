import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="7"
        height="10"
        viewBox="0 0 7 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M6.30762 9.61523L1.69223 4.81523L6.30762 0.384465"
            stroke="currentColor"
        />
    </svg>
);
function ChevronLeftSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default ChevronLeftSvg;
