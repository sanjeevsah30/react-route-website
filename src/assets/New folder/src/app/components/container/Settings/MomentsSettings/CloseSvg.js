import React from "react";
import Icon from "@ant-design/icons";

const CloseSvg = ({ ...rest }) => (
    <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...rest}
    >
        <path
            stroke="#666666"
            strokeWidth="1"
            strokeLinecap="round"
            d="M10 1L1 10"
        ></path>
        <path
            stroke="#666666"
            strokeWidth="1"
            strokeLinecap="round"
            d="M10 10L1 1"
        ></path>
    </svg>
);

// function CloseSvg(props) {
//     return <Icon component={Svg} {...props} />;
// }

export default CloseSvg;
