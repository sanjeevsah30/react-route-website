import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="19"
        height="22"
        viewBox="0 0 19 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M17.5218 20.4883V18.3773C17.5218 17.2575 17.0866 16.1837 16.312 15.3919C15.5374 14.6001 14.4868 14.1553 13.3913 14.1553H5.13045C4.03498 14.1553 2.98439 14.6001 2.20978 15.3919C1.43517 16.1837 1 17.2575 1 18.3773V20.4883"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M9.26082 9.93231C11.542 9.93231 13.3913 8.04205 13.3913 5.7103C13.3913 3.37854 11.542 1.48828 9.26082 1.48828C6.97964 1.48828 5.13037 3.37854 5.13037 5.7103C5.13037 8.04205 6.97964 9.93231 9.26082 9.93231Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
function UserSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default UserSvg;
