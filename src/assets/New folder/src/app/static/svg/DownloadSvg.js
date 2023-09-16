import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="26"
        height="23"
        viewBox="0 0 22 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M18.8002 11.5V14.5667C18.8002 14.9733 18.6176 15.3633 18.2925 15.6509C17.9674 15.9384 17.5266 16.1 17.0669 16.1H4.93353C4.47382 16.1 4.03294 15.9384 3.70788 15.6509C3.38281 15.3633 3.2002 14.9733 3.2002 14.5667V11.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M6.66699 7.66675L11.0003 11.5001L15.3337 7.66675"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M11 11.5V2.30005"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

function DownloadSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default DownloadSvg;
