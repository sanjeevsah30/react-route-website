import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="20"
        height="18"
        viewBox="0 0 20 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.87868 0.87868C0 1.75736 0 3.17157 0 6V12C0 14.8284 0 16.2426 0.87868 17.1213C1.75736 18 3.17157 18 6 18H14C16.8284 18 18.2426 18 19.1213 17.1213C20 16.2426 20 14.8284 20 12V6C20 3.17157 20 1.75736 19.1213 0.87868C18.2426 0 16.8284 0 14 0H6C3.17157 0 1.75736 0 0.87868 0.87868ZM14 5C14.5523 5 15 5.44772 15 6V14C15 14.5523 14.5523 15 14 15C13.4477 15 13 14.5523 13 14V6C13 5.44772 13.4477 5 14 5ZM7 8C7 7.44772 6.55228 7 6 7C5.44772 7 5 7.44772 5 8V14C5 14.5523 5.44772 15 6 15C6.55229 15 7 14.5523 7 14V8ZM11 10C11 9.44772 10.5523 9 10 9C9.44772 9 9 9.44772 9 10V14C9 14.5523 9.44772 15 10 15C10.5523 15 11 14.5523 11 14V10Z"
            fill="currentColor"
        />
    </svg>
);
function AllReportSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default AllReportSvg;
