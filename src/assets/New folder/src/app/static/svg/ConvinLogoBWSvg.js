import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="17"
        height="11"
        viewBox="0 0 17 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M6.61421 8.46319C6.32342 8.55139 6.0149 8.59882 5.6953 8.59882C3.94935 8.59882 2.53397 7.18344 2.53397 5.43749C2.53397 3.69153 3.94935 2.27616 5.6953 2.27616C6.0149 2.27616 6.32342 2.32358 6.61421 2.41178C7.07684 1.72225 7.69313 1.14447 8.41404 0.727439C7.61426 0.26479 6.6857 0 5.6953 0C2.69226 0 0.257812 2.43445 0.257812 5.43749C0.257812 8.44053 2.69226 10.875 5.6953 10.875C6.6857 10.875 7.61426 10.6102 8.41404 10.1475C7.69313 9.73051 7.07684 9.15272 6.61421 8.46319Z"
            fill="#666666"
        />
        <path
            d="M15.2425 5.43749C15.2425 7.70723 13.4025 9.54722 11.1328 9.54722C8.86306 9.54722 7.02307 7.70723 7.02307 5.43749C7.02307 3.16775 8.86306 1.32776 11.1328 1.32776C13.4025 1.32776 15.2425 3.16775 15.2425 5.43749Z"
            stroke="#999999"
            strokeWidth="2.65552"
        />
    </svg>
);

function ConvinLogoBWSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default ConvinLogoBWSvg;
