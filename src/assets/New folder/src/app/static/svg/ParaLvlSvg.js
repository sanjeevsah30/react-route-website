import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="16"
        height="20"
        viewBox="0 0 16 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6 0C4.34315 0 3 1.34315 3 3V3.00068C1.92115 3.00539 1.32954 3.04261 0.88886 3.33706C0.670479 3.48298 0.482978 3.67048 0.337061 3.88886C0 4.39331 0 5.09554 0 6.5V16C0 17.8856 0 18.8284 0.585786 19.4142C1.17157 20 2.11438 20 4 20H12C13.8856 20 14.8284 20 15.4142 19.4142C16 18.8284 16 17.8856 16 16V6.5C16 5.09554 16 4.39331 15.6629 3.88886C15.517 3.67048 15.3295 3.48298 15.1111 3.33706C14.6705 3.04261 14.0789 3.00539 13 3.00068V3C13 1.34315 11.6569 0 10 0H6ZM6 3C6 2.44772 6.44772 2 7 2H9C9.55228 2 10 2.44772 10 3C10 3.55228 9.55228 4 9 4H7C6.44772 4 6 3.55228 6 3ZM5 9C4.44772 9 4 9.44771 4 10C4 10.5523 4.44772 11 5 11H11C11.5523 11 12 10.5523 12 10C12 9.44771 11.5523 9 11 9H5ZM5 13C4.44772 13 4 13.4477 4 14C4 14.5523 4.44772 15 5 15H9C9.55228 15 10 14.5523 10 14C10 13.4477 9.55228 13 9 13H5Z"
            fill="currentColor"
        />
    </svg>
);
function ParaLvlSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default ParaLvlSvg;
