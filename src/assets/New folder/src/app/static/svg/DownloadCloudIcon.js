import React from "react";
import Icon from "@ant-design/icons";

function DownloadCloudIcon(props) {
    return <Icon component={Svg} {...props} />;
}

const Svg = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g clipPath="url(#clip0_5684_24306)">
            <path
                d="M8 17L12 21L16 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12 12V21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M20.88 18.0899C21.7494 17.4786 22.4014 16.6061 22.7413 15.5991C23.0812 14.5921 23.0914 13.503 22.7704 12.4898C22.4494 11.4766 21.8139 10.592 20.9561 9.96449C20.0983 9.33697 19.0628 8.9991 18 8.99993H16.74C16.4392 7.82781 15.8765 6.73918 15.0941 5.81601C14.3117 4.89285 13.3301 4.15919 12.2232 3.67029C11.1163 3.18138 9.91284 2.94996 8.70352 2.99345C7.4942 3.03694 6.31051 3.3542 5.24155 3.92136C4.17259 4.48851 3.24622 5.29078 2.53218 6.26776C1.81814 7.24474 1.33505 8.37098 1.11925 9.56168C0.903464 10.7524 0.960604 11.9765 1.28637 13.142C1.61214 14.3074 2.19805 15.3837 2.99999 16.2899"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
        <defs>
            <clipPath id="clip0_5684_24306">
                <rect width="24" height="24" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

export default DownloadCloudIcon;
