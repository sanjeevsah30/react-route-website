import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="18"
        height="22"
        viewBox="0 0 18 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M1.5 21.5H0V0.5H18L13.65 7.25L18 14H1.5V21.5ZM1.5 12.5H15.2475L11.85 7.25L15.2475 2H1.5V12.5Z"
            fill="#666666"
        />
    </svg>
);

function FlagSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default FlagSvg;
