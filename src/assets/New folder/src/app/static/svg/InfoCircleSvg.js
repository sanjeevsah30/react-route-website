import React from "react";
import Icon from "@ant-design/icons";

function InfoCircleSvg(props) {
    return <Icon component={Svg} {...props} />;
}

const Svg = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M10 1.25C5.16797 1.25 1.25 5.16797 1.25 10C1.25 14.832 5.16797 18.75 10 18.75C14.832 18.75 18.75 14.832 18.75 10C18.75 5.16797 14.832 1.25 10 1.25ZM10 17.2656C5.98828 17.2656 2.73438 14.0117 2.73438 10C2.73438 5.98828 5.98828 2.73438 10 2.73438C14.0117 2.73438 17.2656 5.98828 17.2656 10C17.2656 14.0117 14.0117 17.2656 10 17.2656Z"
            fill="currentColor"
            fillOpacity="0.85"
        />
        <path
            d="M9.0622 6.5625C9.0622 6.81114 9.16097 7.0496 9.33678 7.22541C9.5126 7.40123 9.75105 7.5 9.99969 7.5C10.2483 7.5 10.4868 7.40123 10.6626 7.22541C10.8384 7.0496 10.9372 6.81114 10.9372 6.5625C10.9372 6.31386 10.8384 6.0754 10.6626 5.89959C10.4868 5.72377 10.2483 5.625 9.99969 5.625C9.75105 5.625 9.5126 5.72377 9.33678 5.89959C9.16097 6.0754 9.0622 6.31386 9.0622 6.5625ZM10.4684 8.75H9.53094C9.44501 8.75 9.37469 8.82031 9.37469 8.90625V14.2188C9.37469 14.3047 9.44501 14.375 9.53094 14.375H10.4684C10.5544 14.375 10.6247 14.3047 10.6247 14.2188V8.90625C10.6247 8.82031 10.5544 8.75 10.4684 8.75Z"
            fill="currentColor"
            fillOpacity="0.85"
        />
    </svg>
);

export default InfoCircleSvg;
