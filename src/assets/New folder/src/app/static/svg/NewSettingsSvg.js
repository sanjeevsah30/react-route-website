import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M5.41029 16.9076C4.82789 15.8606 4.53668 15.3372 4.53668 14.7656C4.53668 14.1941 4.82789 13.6706 5.41029 12.6236L6.89658 9.9518L8.46731 7.32872C9.08281 6.30085 9.39056 5.78692 9.88553 5.50115C10.3805 5.21538 10.9794 5.20583 12.1774 5.18673L15.2344 5.13797L18.2914 5.18673C19.4893 5.20583 20.0883 5.21538 20.5832 5.50115C21.0782 5.78692 21.3859 6.30085 22.0014 7.32872L23.5722 9.9518L25.0585 12.6236C25.6409 13.6706 25.9321 14.1941 25.9321 14.7656C25.9321 15.3372 25.6409 15.8606 25.0585 16.9076L23.5722 19.5795L22.0014 22.2025C21.3859 23.2304 21.0782 23.7443 20.5832 24.0301C20.0883 24.3159 19.4893 24.3254 18.2914 24.3445L15.2344 24.3933L12.1774 24.3445C10.9794 24.3254 10.3805 24.3159 9.88553 24.0301C9.39056 23.7443 9.08281 23.2304 8.46731 22.2025L6.89658 19.5795L5.41029 16.9076Z"
            stroke="#333333"
            strokeWidth="1.875"
        />
        <circle
            cx="15.2339"
            cy="14.7657"
            r="3.30469"
            stroke="#333333"
            strokeWidth="1.65234"
        />
    </svg>
);

const activeSvg = () => (
    <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M5.41029 16.9076C4.82789 15.8606 4.53668 15.3372 4.53668 14.7656C4.53668 14.1941 4.82789 13.6706 5.41029 12.6236L6.89658 9.9518L8.46731 7.32872C9.08281 6.30085 9.39056 5.78692 9.88553 5.50115C10.3805 5.21539 10.9794 5.20583 12.1774 5.18673L15.2344 5.13797L18.2914 5.18673C19.4893 5.20583 20.0883 5.21538 20.5832 5.50115C21.0782 5.78692 21.3859 6.30085 22.0014 7.32872L23.5722 9.9518L25.0585 12.6236C25.6409 13.6706 25.9321 14.1941 25.9321 14.7656C25.9321 15.3372 25.6409 15.8606 25.0585 16.9076L23.5722 19.5795L22.0014 22.2025C21.3859 23.2304 21.0782 23.7443 20.5832 24.0301C20.0883 24.3159 19.4893 24.3254 18.2914 24.3445L15.2344 24.3933L12.1774 24.3445C10.9794 24.3254 10.3805 24.3159 9.88553 24.0301C9.39056 23.7443 9.08281 23.2304 8.46732 22.2025L6.89658 19.5795L5.41029 16.9076Z"
            fill="#1A62F2"
            stroke="#1A62F2"
            strokeWidth="1.65234"
        />
        <circle
            cx="15.2341"
            cy="14.7655"
            r="3.30469"
            stroke="white"
            strokeWidth="1.65234"
        />
    </svg>
);

function NewSettingsSvg(props) {
    return <Icon component={props.isActive ? activeSvg : Svg} {...props} />;
}

export default NewSettingsSvg;
