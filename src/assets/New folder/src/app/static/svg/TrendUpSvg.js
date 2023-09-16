import React from "react";

export function TrendUpSvg({ x, y }) {
    return (
        <svg
            width="11"
            height="8"
            viewBox="0 0 11 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            y={y || 12}
            x={x || -22}
        >
            <path
                d="M9.67166 1.36572L5.92708 6.11572L3.95625 3.61572L1 7.36572"
                stroke="#52C41A"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M7 1.36572H10V4.36572"
                stroke="#52C41A"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
