import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="8" cy="8" r="7.5" stroke="#666666" />
    </svg>
);

function RadioSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default RadioSvg;
