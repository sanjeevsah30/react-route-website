import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="16"
        height="15"
        viewBox="0 0 16 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M0 1.5C0 2.33 0.67 3 1.5 3H5.5V13.5C5.5 14.33 6.17 15 7 15C7.83 15 8.5 14.33 8.5 13.5V3H12.5C13.33 3 14 2.33 14 1.5C14 0.67 13.33 0 12.5 0H1.5C0.67 0 0 0.67 0 1.5Z"
            fill="#333333"
        />
        <path
            d="M9 8.7C9 9.08733 9.31267 9.4 9.7 9.4H11.5667V14.3C11.5667 14.6873 11.8793 15 12.2667 15C12.654 15 12.9667 14.6873 12.9667 14.3V9.4H14.8333C15.2207 9.4 15.5333 9.08733 15.5333 8.7C15.5333 8.31267 15.2207 8 14.8333 8H9.7C9.31267 8 9 8.31267 9 8.7Z"
            fill="#333333"
        />
    </svg>
);

function TitleSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default TitleSvg;
