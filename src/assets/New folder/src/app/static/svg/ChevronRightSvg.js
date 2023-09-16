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
            d="M0.692383 0.384766L5.30777 5.18477L0.692383 9.61554"
            stroke="currentColor"
        />
    </svg>
);
function ChevronRightSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default ChevronRightSvg;
