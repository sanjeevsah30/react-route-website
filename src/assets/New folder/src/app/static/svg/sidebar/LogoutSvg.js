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
            d="M11.0137 23.6432C12.5325 24.5201 14.2554 24.9817 16.0092 24.9817C17.7629 24.9817 19.4858 24.5201 21.0046 23.6432C22.5234 22.7663 23.7846 21.5051 24.6615 19.9863C25.5384 18.4675 26 16.7446 26 14.9908C26 13.2371 25.5384 11.5142 24.6615 9.99542C23.7846 8.47662 22.5234 7.2154 21.0046 6.33852C19.4858 5.46164 17.7629 5 16.0092 5C14.2554 5 12.5325 5.46164 11.0137 6.33852"
            stroke="current"
            strokeWidth="1.83333"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M8.44037 9.54129L4 14.9908M4 14.9908L8.44037 20.4404M4 14.9908H13.9908"
            stroke="current"
            strokeWidth="1.83333"
            strokeLinecap="round"
        />
    </svg>
);

function LogoutSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default LogoutSvg;
