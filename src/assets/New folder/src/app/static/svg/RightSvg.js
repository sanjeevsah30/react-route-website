import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12.1108 17.0007L12.1116 16.9999L18.5007 10.4607C18.5009 10.4605 18.501 10.4603 18.5012 10.4601C18.8997 10.0611 18.8995 9.398 18.5007 8.99918C18.1017 8.60019 17.4684 8.60019 17.0694 8.99918L17.0687 8.99992L11.3806 14.8065L8.90192 12.2404L8.90194 12.2404L8.90071 12.2391C8.50171 11.8401 7.86839 11.8401 7.4694 12.2391C7.07058 12.638 7.07041 13.3011 7.46889 13.7001C7.46906 13.7003 7.46923 13.7004 7.4694 13.7006L10.6785 16.9997L10.6785 16.9997L10.6795 17.0007C11.0785 17.3997 11.7118 17.3997 12.1108 17.0007ZM0.9 13C0.9 19.6852 6.31477 25.1 13 25.1C19.6852 25.1 25.1 19.6852 25.1 13C25.1 6.31477 19.6852 0.9 13 0.9C6.31477 0.9 0.9 6.31477 0.9 13ZM2.9 13C2.9 7.41528 7.41523 2.9 13 2.9C18.5849 2.9 23.1002 7.41523 23.1 13C23.1 18.5847 18.5848 23.1 13 23.1C7.41528 23.1 2.9 18.5848 2.9 13Z"
            fill="#52C41A"
            stroke="#52C41A"
            strokeWidth="0.2"
        />
    </svg>
);
function RightSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default RightSvg;
