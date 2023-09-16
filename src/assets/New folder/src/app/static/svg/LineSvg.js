import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="16"
        height="9"
        viewBox="0 0 16 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M1 8C1.71493 5.43918 3.6748 -2.28182 6.44444 2.56607C12.4545 13.086 14.0101 3.82414 15 1.38825"
            stroke="currentColor"
            strokeLinecap="round"
        />
    </svg>
);

function LineSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default LineSvg;
