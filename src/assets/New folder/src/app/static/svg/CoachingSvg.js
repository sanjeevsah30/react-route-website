import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="20"
        height="22"
        viewBox="0 0 20 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M2 20.5C1.45 20.5 0.979 20.3043 0.587 19.913C0.195667 19.521 0 19.05 0 18.5V2.5C0 1.95 0.195667 1.479 0.587 1.087C0.979 0.695667 1.45 0.5 2 0.5H14C14.55 0.5 15.021 0.695667 15.413 1.087C15.8043 1.479 16 1.95 16 2.5V9.575C15.8333 9.54167 15.654 9.52067 15.462 9.512C15.2707 9.504 15.1167 9.5 15 9.5C13.0833 9.5 11.4373 10.179 10.062 11.537C8.68733 12.8957 8 14.55 8 16.5C8 17.2167 8.10833 17.9167 8.325 18.6C8.54167 19.2833 8.85833 19.9167 9.275 20.5H2ZM15 21.5C13.6167 21.5 12.4377 21.0127 11.463 20.038C10.4877 19.0627 10 17.8833 10 16.5C10 15.1167 10.4877 13.9373 11.463 12.962C12.4377 11.9873 13.6167 11.5 15 11.5C16.3833 11.5 17.5627 11.9873 18.538 12.962C19.5127 13.9373 20 15.1167 20 16.5C20 17.8833 19.5127 19.0627 18.538 20.038C17.5627 21.0127 16.3833 21.5 15 21.5ZM14.525 18.525L17.075 16.925C17.225 16.825 17.3 16.6833 17.3 16.5C17.3 16.3167 17.225 16.175 17.075 16.075L14.525 14.475C14.3417 14.375 14.1667 14.371 14 14.463C13.8333 14.5543 13.75 14.7 13.75 14.9V18.1C13.75 18.3 13.8333 18.446 14 18.538C14.1667 18.6293 14.3417 18.625 14.525 18.525ZM4.75 9.05L6.5 8L8.25 9.05C8.41667 9.15 8.58333 9.15 8.75 9.05C8.91667 8.95 9 8.80833 9 8.625V2.5H4V8.625C4 8.80833 4.08333 8.95 4.25 9.05C4.41667 9.15 4.58333 9.15 4.75 9.05Z"
            fill="currentColor"
        />
    </svg>
);
function CoachingSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default CoachingSvg;