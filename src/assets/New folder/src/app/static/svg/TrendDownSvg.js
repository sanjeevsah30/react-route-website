import React from "react";

export function TrendDownSvg({ x = 0, y = 0 }) {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            x={x}
            y={y}
        >
            <path
                d="M11.375 9.625L7.59659 5.46875L5.60795 7.65625L2.625 4.375"
                stroke="#FD586B"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8.75 9.625L11.375 9.625L11.375 7"
                stroke="#FD586B"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
