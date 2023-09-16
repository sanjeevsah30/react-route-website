import React from "react";
import Icon from "@ant-design/icons";
function Svg() {
    return (
        <svg
            width="10"
            height="13"
            viewBox="0 0 8 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M3.71431 0L6.80726 4.28571H0.621364L3.71431 0Z"
                fill="#999999"
            />
            <path
                d="M3.57146 10L0.478507 5.71429L6.6644 5.71429L3.57146 10Z"
                fill="#999999"
            />
        </svg>
    );
}

function SvgAscending() {
    return (
        <svg
            width="10"
            height="13"
            viewBox="0 0 8 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M3.71431 0L6.80726 4.28571H0.621364L3.71431 0Z"
                fill="#1A62F2"
            />
            <path
                d="M3.57146 10L0.478507 5.71429L6.6644 5.71429L3.57146 10Z"
                fill="#999999"
            />
        </svg>
    );
}

function SvgDescending() {
    return (
        <svg
            width="10"
            height="13"
            viewBox="0 0 8 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M3.71431 0L6.80726 4.28571H0.621364L3.71431 0Z"
                fill="#999999"
            />
            <path
                d="M3.57146 10L0.478507 5.71429L6.6644 5.71429L3.57146 10Z"
                fill="#1A62F2"
            />
        </svg>
    );
}

export function SortColumnSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export function SortColumnAscendingSvg(props) {
    return <Icon component={SvgAscending} {...props} />;
}

export function SortColumnDescendingSvg(props) {
    return <Icon component={SvgDescending} {...props} />;
}

export default SortColumnSvg;
