import React from "react";
// import Icon from '@ant-design/icons';
const ThumbsUpAltSvg = ({ stroke = "#999", ...props }) => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <g clipPath="url(#clip0_1718_10190)">
            <path
                d="M5.83366 9.16675L9.16699 1.66675C9.83003 1.66675 10.4659 1.93014 10.9348 2.39898C11.4036 2.86782 11.667 3.50371 11.667 4.16675V7.50008H16.3837C16.6252 7.49735 16.8645 7.54717 17.085 7.6461C17.3054 7.74502 17.5017 7.89069 17.6602 8.07301C17.8187 8.25533 17.9357 8.46993 18.0031 8.70196C18.0705 8.93398 18.0866 9.17788 18.0503 9.41675L16.9003 16.9167C16.8401 17.3142 16.6382 17.6764 16.3319 17.9368C16.0256 18.1971 15.6356 18.338 15.2337 18.3334H5.83366M5.83366 9.16675V18.3334M5.83366 9.16675H3.33366C2.89163 9.16675 2.46771 9.34234 2.15515 9.6549C1.84259 9.96746 1.66699 10.3914 1.66699 10.8334V16.6667C1.66699 17.1088 1.84259 17.5327 2.15515 17.8453C2.46771 18.1578 2.89163 18.3334 3.33366 18.3334H5.83366"
                stroke={stroke}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
        <defs>
            <clipPath id="clip0_1718_10190">
                <rect width="20" height="20" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

// function ThumbsUpAltSvg(props) {
//     return <Icon component={Svg} {...props} />;
// }

export default ThumbsUpAltSvg;
