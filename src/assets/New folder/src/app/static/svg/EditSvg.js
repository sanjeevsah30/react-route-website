import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M7.76305 2.59375H2.5029C2.10431 2.59375 1.72204 2.75209 1.44019 3.03394C1.15834 3.31579 1 3.69806 1 4.09665V14.617C1 15.0155 1.15834 15.3978 1.44019 15.6797C1.72204 15.9615 2.10431 16.1199 2.5029 16.1199H13.0232C13.4218 16.1199 13.8041 15.9615 14.0859 15.6797C14.3678 15.3978 14.5261 15.0155 14.5261 14.617V9.3568"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M13.399 1.46689C13.698 1.16795 14.1034 1 14.5262 1C14.949 1 15.3544 1.16795 15.6534 1.46689C15.9523 1.76584 16.1203 2.17129 16.1203 2.59407C16.1203 3.01684 15.9523 3.4223 15.6534 3.72124L8.51459 10.86L5.50879 11.6115L6.26024 8.60567L13.399 1.46689Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
function EditSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default EditSvg;
