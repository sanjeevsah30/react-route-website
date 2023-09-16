import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="56" height="56" rx="6" fill="#FF6365" fillOpacity="0.1" />
        <path
            d="M28 13C19.72 13 13 19.72 13 28C13 36.28 19.72 43 28 43C36.28 43 43 36.28 43 28C43 19.72 36.28 13 28 13ZM28 40C21.37 40 16 34.63 16 28C16 25.225 16.945 22.675 18.535 20.65L35.35 37.465C33.2547 39.1123 30.6653 40.0054 28 40ZM37.465 35.35L20.65 18.535C22.7453 16.8877 25.3347 15.9946 28 16C34.63 16 40 21.37 40 28C40 30.775 39.055 33.325 37.465 35.35Z"
            fill="#FF4D4F"
        />
    </svg>
);

function NotStartedSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default NotStartedSvg;
