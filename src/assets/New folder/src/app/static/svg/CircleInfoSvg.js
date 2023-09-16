import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M8.16663 9.83268C8.16663 9.61167 8.25442 9.39971 8.4107 9.24343C8.56698 9.08715 8.77894 8.99935 8.99996 8.99935C9.22097 8.99935 9.43293 9.08715 9.58921 9.24343C9.74549 9.39971 9.83329 9.61167 9.83329 9.83268V12.3327C9.83329 12.5537 9.74549 12.7657 9.58921 12.9219C9.43293 13.0782 9.22097 13.166 8.99996 13.166C8.77894 13.166 8.56698 13.0782 8.4107 12.9219C8.25442 12.7657 8.16663 12.5537 8.16663 12.3327V9.83268ZM8.99996 5.24935C8.66844 5.24935 8.3505 5.38104 8.11608 5.61547C7.88166 5.84989 7.74996 6.16783 7.74996 6.49935C7.74996 6.83087 7.88166 7.14881 8.11608 7.38323C8.3505 7.61765 8.66844 7.74935 8.99996 7.74935C9.33148 7.74935 9.64942 7.61765 9.88384 7.38323C10.1183 7.14881 10.25 6.83087 10.25 6.49935C10.25 6.16783 10.1183 5.84989 9.88384 5.61547C9.64942 5.38104 9.33148 5.24935 8.99996 5.24935ZM0.666626 8.99935C0.666626 6.78921 1.5446 4.6696 3.1074 3.10679C4.67021 1.54399 6.78982 0.666016 8.99996 0.666016C11.2101 0.666016 13.3297 1.54399 14.8925 3.10679C16.4553 4.6696 17.3333 6.78921 17.3333 8.99935C17.3333 11.2095 16.4553 13.3291 14.8925 14.8919C13.3297 16.4547 11.2101 17.3327 8.99996 17.3327C6.78982 17.3327 4.67021 16.4547 3.1074 14.8919C1.5446 13.3291 0.666626 11.2095 0.666626 8.99935ZM8.99996 2.33268C7.23185 2.33268 5.53616 3.03506 4.28591 4.2853C3.03567 5.53555 2.33329 7.23124 2.33329 8.99935C2.33329 10.7675 3.03567 12.4632 4.28591 13.7134C5.53616 14.9636 7.23185 15.666 8.99996 15.666C10.7681 15.666 12.4638 14.9636 13.714 13.7134C14.9642 12.4632 15.6666 10.7675 15.6666 8.99935C15.6666 7.23124 14.9642 5.53555 13.714 4.2853C12.4638 3.03506 10.7681 2.33268 8.99996 2.33268Z"
            fill="#666666"
        />
    </svg>
);
function CircleInfoSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default CircleInfoSvg;
