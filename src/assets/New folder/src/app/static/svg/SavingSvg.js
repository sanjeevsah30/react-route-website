import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M23 4V10H17"
            stroke="#666666"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M1 20V14H7"
            stroke="#666666"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M3.51 8.99959C4.01717 7.56637 4.87913 6.28499 6.01547 5.27501C7.1518 4.26502 8.52547 3.55935 10.0083 3.22385C11.4911 2.88834 13.0348 2.93393 14.4952 3.35636C15.9556 3.77879 17.2853 4.5643 18.36 5.63959L23 9.99959M1 13.9996L5.64 18.3596C6.71475 19.4349 8.04437 20.2204 9.50481 20.6428C10.9652 21.0652 12.5089 21.1108 13.9917 20.7753C15.4745 20.4398 16.8482 19.7342 17.9845 18.7242C19.1209 17.7142 19.9828 16.4328 20.49 14.9996"
            stroke="#666666"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
function SavingSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default SavingSvg;
