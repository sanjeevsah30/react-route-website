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
        <rect width="56" height="56" rx="6" fill="#31C6FB" fill-opacity="0.1" />
        <path
            d="M27.1016 28C31.2437 28 34.6016 24.6421 34.6016 20.5C34.6016 16.3579 31.2437 13 27.1016 13C22.9594 13 19.6016 16.3579 19.6016 20.5C19.6016 24.6421 22.9594 28 27.1016 28Z"
            stroke="#31C6FB"
            strokeWidth="3"
        />
        <path
            d="M34.6017 43H17.0007C16.5752 43.0001 16.1546 42.9097 15.7668 42.7348C15.379 42.56 15.0328 42.3046 14.7512 41.9857C14.4696 41.6668 14.2591 41.2917 14.1336 40.8852C14.008 40.4787 13.9704 40.0501 14.0232 39.628L14.6082 34.942C14.7442 33.8533 15.2733 32.8519 16.0959 32.1259C16.9185 31.4 17.978 30.9996 19.0752 31H19.6017M33.1017 34L36.4767 37L42.1017 31"
            stroke="#31C6FB"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

function CompletionSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default CompletionSvg;
