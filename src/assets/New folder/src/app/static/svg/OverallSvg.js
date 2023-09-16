import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="19"
        height="19"
        viewBox="0 0 19 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M0 5.5V2.5C0 1.95 0.195667 1.479 0.587 1.087C0.979 0.695667 1.45 0.5 2 0.5H17C17.55 0.5 18.021 0.695667 18.413 1.087C18.8043 1.479 19 1.95 19 2.5V5.5H0ZM5 7.5V18.5H2C1.45 18.5 0.979 18.3043 0.587 17.913C0.195667 17.521 0 17.05 0 16.5V7.5H5ZM14 7.5H19V16.5C19 17.05 18.8043 17.521 18.413 17.913C18.021 18.3043 17.55 18.5 17 18.5H14V7.5ZM12 7.5V18.5H7V7.5H12Z"
            fill="currentColor"
        />
    </svg>
);
function OverallSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default OverallSvg;
