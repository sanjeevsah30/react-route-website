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
        <rect
            width="56"
            height="56"
            rx="6"
            fill="currentColor"
            fillOpacity="0.1"
        />
        <path
            d="M26.8708 32.9832L26.8717 32.9824L34.8582 24.8081C34.8584 24.808 34.8585 24.8078 34.8587 24.8077C35.3472 24.3186 35.347 23.5055 34.8582 23.0167C34.3692 22.5277 33.5934 22.5277 33.1044 23.0167L33.1037 23.0174L25.9756 30.2939L22.8594 27.0678L22.8594 27.0678L22.8582 27.0666C22.3692 26.5776 21.5934 26.5776 21.1044 27.0666C20.6156 27.5554 20.6155 28.3686 21.104 28.8576C21.1041 28.8578 21.1043 28.8579 21.1044 28.8581L25.1161 32.9822L25.1171 32.9832C25.606 33.4722 26.3819 33.4722 26.8708 32.9832ZM12.9 28C12.9 36.3427 19.6573 43.1 28 43.1C36.3427 43.1 43.1 36.3427 43.1 28C43.1 19.6573 36.3427 12.9 28 12.9C19.6573 12.9 12.9 19.6573 12.9 28ZM15.35 28C15.35 21.0053 21.0052 15.35 28 15.35C34.995 15.35 40.6503 21.0052 40.65 28C40.65 34.9947 34.9948 40.65 28 40.65C21.0053 40.65 15.35 34.9948 15.35 28Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0.2"
        />
    </svg>
);

function CompletedSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default CompletedSvg;
