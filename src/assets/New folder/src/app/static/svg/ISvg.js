import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="8"
        height="15"
        viewBox="0 0 8 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M5.39819 2.17C5.60907 2.2265 5.83196 2.21921 6.03868 2.14903C6.24541 2.07886 6.42669 1.94896 6.55959 1.77576C6.69249 1.60256 6.77104 1.39385 6.78532 1.176C6.7996 0.958156 6.74896 0.74097 6.63981 0.551906C6.53065 0.362842 6.36788 0.210392 6.17208 0.113834C5.97629 0.0172767 5.75625 -0.0190513 5.53981 0.00944382C5.32336 0.0379389 5.12023 0.129977 4.95609 0.273921C4.79196 0.417864 4.67419 0.607246 4.61769 0.818119C4.54192 1.10089 4.58159 1.40218 4.72796 1.6557C4.87434 1.90923 5.11542 2.09422 5.39819 2.17Z"
            fill="currentColor"
        />
        <path
            d="M4.00564 11.6318L5.77202 5.0396C6.09325 3.84072 4.70574 3.05472 2.87678 3.98035C1.75342 4.62965 0.774494 5.50152 0 6.54252C0 6.54252 3.63709 4.4777 3.0308 6.74039L1.26443 13.3326C0.943193 14.5315 2.33068 15.3175 4.15965 14.3919C5.28301 13.7426 6.26194 12.8707 7.03644 11.8297C7.03644 11.8297 3.39935 13.8945 4.00564 11.6318Z"
            fill="currentColor"
        />
    </svg>
);

function ISvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default ISvg;