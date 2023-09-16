import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M3.66683 3.66699H18.3335C19.3418 3.66699 20.1668 4.49199 20.1668 5.50033V16.5003C20.1668 17.5087 19.3418 18.3337 18.3335 18.3337H3.66683C2.6585 18.3337 1.8335 17.5087 1.8335 16.5003V5.50033C1.8335 4.49199 2.6585 3.66699 3.66683 3.66699Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M20.1668 5.5L11.0002 11.9167L1.8335 5.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

function EmailSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default EmailSvg;
