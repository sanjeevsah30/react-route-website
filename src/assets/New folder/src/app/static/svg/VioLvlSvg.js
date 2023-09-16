import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="24"
        height="21"
        viewBox="0 0 24 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M10.2908 2.8602L1.82075 17.0002C1.64612 17.3026 1.55372 17.6455 1.55274 17.9947C1.55176 18.3439 1.64224 18.6873 1.81518 18.9907C1.98812 19.2941 2.23748 19.547 2.53846 19.7241C2.83944 19.9012 3.18155 19.9964 3.53075 20.0002H20.4708C20.82 19.9964 21.1621 19.9012 21.463 19.7241C21.764 19.547 22.0134 19.2941 22.1863 18.9907C22.3593 18.6873 22.4497 18.3439 22.4488 17.9947C22.4478 17.6455 22.3554 17.3026 22.1808 17.0002L13.7108 2.8602C13.5325 2.56631 13.2815 2.32332 12.9819 2.15469C12.6824 1.98605 12.3445 1.89746 12.0008 1.89746C11.657 1.89746 11.3191 1.98605 11.0196 2.15469C10.72 2.32332 10.469 2.56631 10.2908 2.8602Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M12 8V12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M12 16H12.01"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
function VioLvlSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default VioLvlSvg;
