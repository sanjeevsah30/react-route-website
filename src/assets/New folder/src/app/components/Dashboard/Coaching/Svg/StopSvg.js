import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="56"
        height="57"
        viewBox="0 0 56 57"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="56" height="57" rx="6" fill="#FF6365" fillOpacity="0.1" />
        <path
            d="M28 13.2322C19.72 13.2322 13 19.9522 13 28.2322C13 36.5122 19.72 43.2322 28 43.2322C36.28 43.2322 43 36.5122 43 28.2322C43 19.9522 36.28 13.2322 28 13.2322ZM28 40.2322C21.37 40.2322 16 34.8622 16 28.2322C16 25.4572 16.945 22.9072 18.535 20.8822L35.35 37.6972C33.2547 39.3445 30.6653 40.2376 28 40.2322ZM37.465 35.5822L20.65 18.7672C22.7453 17.1198 25.3347 16.2268 28 16.2322C34.63 16.2322 40 21.6022 40 28.2322C40 31.0072 39.055 33.5572 37.465 35.5822Z"
            fill="#FF4D4F"
        />
    </svg>
);

function StopSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default StopSvg;
