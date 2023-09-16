import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="17"
        height="15"
        viewBox="0 0 17 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M13.4494 3.5575C13.4493 3.2629 13.1723 3.02413 12.8305 3.02413L6.6882 3.02413C6.68818 3.02413 6.68816 3.02413 6.68813 3.02413C6.34649 3.02398 6.06906 3.26312 6.06924 3.55762L13.4494 3.5575Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0.2"
        />
        <path
            d="M12.3184 3.55869C12.3182 3.31518 12.5476 3.11738 12.8301 3.11754L12.8301 3.0252C12.8302 3.0252 12.8302 3.0252 12.8302 3.0252C13.172 3.02524 13.449 3.26405 13.449 3.55869L13.449 8.85342C13.449 9.00051 13.3798 9.13418 13.2678 9.2307C13.1559 9.32713 13.0011 9.38708 12.8301 9.38691L12.2112 3.55869L12.3184 3.55869ZM12.3184 3.55869L12.2112 3.55875M12.3184 3.55869L12.3184 8.85342C12.3184 9.09708 12.5475 9.29457 12.8301 9.29457L12.2112 3.55875M12.2112 3.55875L12.2112 8.85342C12.2112 9.14804 12.4882 9.38684 12.83 9.38691L12.2112 3.55875Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0.2"
        />
        <path
            d="M4.58171 11.4222L13.2681 3.93451C13.5098 3.72623 13.5098 3.38823 13.2681 3.17995C13.0265 2.97168 12.6344 2.97168 12.3928 3.17995L3.70636 10.6676C3.46474 10.8759 3.46474 11.2139 3.70636 11.4222C3.94798 11.6305 4.34009 11.6305 4.58171 11.4222Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0.2"
        />
    </svg>
);
function UpRightArrowSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default UpRightArrowSvg;
