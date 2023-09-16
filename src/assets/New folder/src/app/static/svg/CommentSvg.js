import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="12"
        height="14"
        viewBox="0 0 12 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M3.87415 4.81055H8.12731C8.38554 4.81055 8.58301 5.00802 8.58301 5.26624C8.58301 5.52447 8.38554 5.72194 8.12731 5.72194H3.87415C3.61592 5.72194 3.41845 5.52447 3.41845 5.26624C3.41845 5.00802 3.61592 4.81055 3.87415 4.81055Z"
            fill="#333333"
        />
        <path
            d="M3.87415 6.63379H8.12731C8.38554 6.63379 8.58301 6.83126 8.58301 7.08949C8.58301 7.34771 8.38554 7.54518 8.12731 7.54518H3.87415C3.61592 7.54518 3.41845 7.34771 3.41845 7.08949C3.41845 6.83126 3.61592 6.63379 3.87415 6.63379Z"
            fill="#333333"
        />
        <path
            d="M3.87415 8.45605H8.12731C8.38554 8.45605 8.58301 8.65352 8.58301 8.91175C8.58301 9.16998 8.38554 9.36745 8.12731 9.36745H3.87415C3.61592 9.36745 3.41845 9.16998 3.41845 8.91175C3.41845 8.65352 3.61592 8.45605 3.87415 8.45605Z"
            fill="#333333"
        />
        <path
            d="M6 0.983398C9.31139 0.983398 12 3.67201 12 6.9834C12 7.7277 11.8633 8.47201 11.5899 9.17074C11.3772 9.70239 11.1038 10.2037 10.7544 10.6442L11.5747 12.5581C11.6354 12.71 11.6203 12.8923 11.5139 13.0138C11.4228 13.1201 11.3013 13.1809 11.1494 13.1809C11.119 13.1809 11.1038 13.1809 11.0734 13.1809L7.97468 12.6492C7.3519 12.8771 6.69873 12.9834 6 12.9834C2.68861 12.9834 9.53674e-07 10.2948 9.53674e-07 6.9834C9.53674e-07 3.67201 2.68861 0.983398 6 0.983398ZM6 12.072C6.62279 12.072 7.21519 11.9657 7.76203 11.753C7.83797 11.7226 7.92911 11.7226 8.00506 11.7226L10.4051 12.148L9.81266 10.7505C9.73671 10.5834 9.76709 10.4011 9.88861 10.2796C10.2532 9.86948 10.5418 9.3834 10.7544 8.85175C10.9823 8.25935 11.1038 7.63656 11.1038 6.99859C11.1038 4.18846 8.82532 1.90998 6.01519 1.90998C3.20506 1.90998 0.926582 4.18846 0.926582 6.99859C0.911393 9.79353 3.18987 12.072 6 12.072Z"
            fill="#333333"
        />
    </svg>
);
function CommentSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default CommentSvg;
