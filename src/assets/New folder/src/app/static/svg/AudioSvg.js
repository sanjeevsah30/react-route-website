import React from "react";

function AudioSvg({ height = 40, width = 40 }) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                width="40"
                height="40"
                rx="6"
                fill="#5E82E3"
                fill-opacity="0.2"
            />
            <path
                d="M20 11V21.55C19.41 21.21 18.73 21 18 21C15.79 21 14 22.79 14 25C14 27.21 15.79 29 18 29C20.21 29 22 27.21 22 25V15H26V11H20Z"
                fill="#5E83E1"
            />
        </svg>
    );
}

export default AudioSvg;
