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
            d="M8.18518 4.88887H4.03704C3.4643 4.88887 3 5.32302 3 5.85857V25.2525C3 25.788 3.4643 26.2222 4.03704 26.2222H8.18518C8.75792 26.2222 9.22221 25.788 9.22221 25.2525V5.85857C9.22221 5.32302 8.75792 4.88887 8.18518 4.88887Z"
            stroke="#999999"
            strokeWidth="1.83333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M3 9.33333H9.22221"
            stroke="#999999"
            strokeWidth="1.83333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M14.4073 4.88887H10.2592C9.68646 4.88887 9.22217 5.32302 9.22217 5.85857V25.2525C9.22217 25.788 9.68646 26.2222 10.2592 26.2222H14.4073C14.9801 26.2222 15.4444 25.788 15.4444 25.2525V5.85857C15.4444 5.32302 14.9801 4.88887 14.4073 4.88887Z"
            stroke="#999999"
            strokeWidth="1.83333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M20.2058 4.25128L16.2654 5.25646C15.7213 5.39524 15.3985 5.9275 15.5443 6.44528L20.8253 25.1958C20.9711 25.7135 21.5304 26.0208 22.0744 25.882L26.0148 24.8768C26.5589 24.738 26.8817 24.2058 26.7359 23.688L21.4549 4.9375C21.3091 4.41972 20.7498 4.11249 20.2058 4.25128Z"
            stroke="#999999"
            strokeWidth="1.83333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M19.8889 21.7778L25.2222 20"
            stroke="#999999"
            strokeWidth="1.83333"
            strokeLinecap="round"
            strokeLinejoin="round"
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
            d="M8.18518 4.88889H4.03704C3.4643 4.88889 3 5.32303 3 5.85858V25.2525C3 25.788 3.4643 26.2222 4.03704 26.2222H8.18518C8.75792 26.2222 9.22221 25.788 9.22221 25.2525V5.85858C9.22221 5.32303 8.75792 4.88889 8.18518 4.88889Z"
            fill="#1A62F2"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M3 9.33333H9.22221"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M14.4073 4.88889H10.2592C9.68646 4.88889 9.22217 5.32303 9.22217 5.85858V25.2525C9.22217 25.788 9.68646 26.2222 10.2592 26.2222H14.4073C14.9801 26.2222 15.4444 25.788 15.4444 25.2525V5.85858C15.4444 5.32303 14.9801 4.88889 14.4073 4.88889Z"
            fill="#1A62F2"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M9.22217 20.8889H15.4444"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M20.2058 4.25129L16.2654 5.25647C15.7213 5.39526 15.3985 5.92751 15.5443 6.44529L20.8253 25.1958C20.9711 25.7136 21.5304 26.0208 22.0744 25.882L26.0148 24.8768C26.5589 24.738 26.8817 24.2058 26.7359 23.688L21.4549 4.93752C21.3091 4.41974 20.7498 4.1125 20.2058 4.25129Z"
            fill="#1A62F2"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M19.8889 21.7778L25.2222 20"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M16.3333 10.2222L21.6666 8.44444"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

function LibrarySvg({ isActive, ...rest }) {
    return <Icon component={isActive ? activeSvg : Svg} {...rest} />;
}

export default LibrarySvg;
