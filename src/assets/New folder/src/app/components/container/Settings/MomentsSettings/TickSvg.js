import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="13"
        height="9"
        viewBox="0 0 13 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M9 0C4.032 0 0 4.032 0 9C0 13.968 4.032 18 9 18C13.968 18 18 13.968 18 9C18 4.032 13.968 0 9 0ZM7.2 13.5L3.92041 10.4584C3.54393 10.1092 3.53279 9.51721 3.89587 9.15413C4.23505 8.81495 4.77989 8.7991 5.13821 9.11801L7.2 10.953L12.41 6.00748C12.7658 5.66979 13.3261 5.67807 13.6717 6.02613C14.0273 6.38426 14.0201 6.96441 13.6557 7.31359L7.2 13.5Z"
            fill="currentColor"
        />
    </svg>
);

function TickSvg(props) {
    return <Icon component={Svg} {...props} />;
}
export default TickSvg;
