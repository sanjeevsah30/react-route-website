import React from "react";
import Icon from "@ant-design/icons";

const PlaySvg = ({
    outline = "#1A62F2",
    width = "22",
    height = "22",
    strokeWidth = "1.4",
    ...rest
}) => (
    <svg
        width={width}
        height={height}
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...rest}
    >
        <path
            d="M8.625 6.57422L15.975 11.2992L8.625 16.0242V6.57422Z"
            stroke={outline}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle
            cx="11"
            cy="11"
            r="9.7"
            stroke={outline}
            strokeWidth={strokeWidth}
        />
    </svg>
);
// function PlaySvg(props) {
//     return <Icon component={Svg} {...props} />;
// }

export default PlaySvg;
