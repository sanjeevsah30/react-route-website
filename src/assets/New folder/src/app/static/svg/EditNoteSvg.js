import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M6.41602 2.33325H2.33268C2.02326 2.33325 1.72652 2.45617 1.50772 2.67496C1.28893 2.89375 1.16602 3.1905 1.16602 3.49992V11.6666C1.16602 11.976 1.28893 12.2728 1.50772 12.4915C1.72652 12.7103 2.02326 12.8333 2.33268 12.8333H10.4993C10.8088 12.8333 11.1055 12.7103 11.3243 12.4915C11.5431 12.2728 11.666 11.976 11.666 11.6666V7.58325"
            stroke="#1A62F2"
            stroke-width="1.16667"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M10.791 1.45838C11.0231 1.22632 11.3378 1.09595 11.666 1.09595C11.9942 1.09595 12.309 1.22632 12.541 1.45838C12.7731 1.69045 12.9035 2.0052 12.9035 2.33338C12.9035 2.66157 12.7731 2.97632 12.541 3.20838L6.99935 8.75005L4.66602 9.33338L5.24935 7.00005L10.791 1.45838Z"
            stroke="#1A62F2"
            stroke-width="1.16667"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
);
function EditNoteSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default EditNoteSvg;
