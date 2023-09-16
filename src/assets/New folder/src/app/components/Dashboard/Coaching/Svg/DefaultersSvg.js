import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="56"
        height="57"
        viewBox="0 0 56 57"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="56" height="57" rx="6" fill="#AC72DA" fill-opacity="0.1" />
        <path
            d="M27.1127 27.9999C31.2583 27.9999 34.6189 24.6421 34.6189 20.4999C34.6189 16.3578 31.2583 12.9999 27.1127 12.9999C22.9671 12.9999 19.6064 16.3578 19.6064 20.4999C19.6064 24.6421 22.9671 27.9999 27.1127 27.9999Z"
            stroke="#AC72DA"
            strokeWidth="3"
        />
        <path
            d="M34.6188 42.9999H17.0031C16.5774 43 16.1564 42.9096 15.7683 42.7347C15.3801 42.5598 15.0337 42.3045 14.7518 41.9856C14.47 41.6667 14.2593 41.2915 14.1337 40.885C14.008 40.4786 13.9704 40.05 14.0232 39.6279L14.6087 34.9419C14.7448 33.8532 15.2743 32.8517 16.0976 32.1258C16.921 31.3999 17.9813 30.9995 19.0794 30.9999H19.6063"
            stroke="#AC72DA"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M42.1249 38.4999L34.6187 30.9999M42.1249 30.9999L34.6187 38.4999"
            stroke="#AC72DA"
            strokeWidth="3"
            strokeLinecap="round"
        />
    </svg>
);

function DefaultersSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default DefaultersSvg;
