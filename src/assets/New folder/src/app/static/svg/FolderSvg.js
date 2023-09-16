import React from "react";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="22" cy="22" r="22" fill="#1A62F2" fillOpacity="0.1" />
        <g clipPath="url(#clip0_15777_65664)">
            <path
                d="M10.8097 15.805L10.7497 14.5C10.7497 13.7043 11.0658 12.9413 11.6284 12.3787C12.191 11.8161 12.9541 11.5 13.7497 11.5H19.2577C20.0533 11.5002 20.8163 11.8163 21.3787 12.379L22.6207 13.621C23.1832 14.1836 23.9462 14.4998 24.7417 14.5H30.7147C31.1316 14.4999 31.5439 14.5868 31.9254 14.755C32.3068 14.9232 32.649 15.169 32.9302 15.4768C33.2113 15.7846 33.4252 16.1477 33.5582 16.5427C33.6912 16.9378 33.7405 17.3563 33.7027 17.7715L32.7472 28.2715C32.6795 29.0169 32.3356 29.71 31.783 30.2148C31.2305 30.7196 30.5092 30.9997 29.7607 31H14.2387C13.4903 30.9997 12.769 30.7196 12.2164 30.2148C11.6639 29.71 11.32 29.0169 11.2522 28.2715L10.2967 17.7715C10.2328 17.0767 10.4143 16.3814 10.8097 15.8065V15.805ZM13.2847 16C13.0764 16 12.8703 16.0434 12.6796 16.1274C12.4889 16.2115 12.3179 16.3343 12.1773 16.4881C12.0368 16.642 11.9298 16.8234 11.8632 17.0208C11.7967 17.2183 11.772 17.4275 11.7907 17.635L12.7462 28.135C12.7799 28.5077 12.9517 28.8543 13.2278 29.1069C13.504 29.3594 13.8645 29.4996 14.2387 29.5H29.7607C30.1349 29.4996 30.4955 29.3594 30.7716 29.1069C31.0478 28.8543 31.2196 28.5077 31.2532 28.135L32.2087 17.635C32.2275 17.4275 32.2028 17.2183 32.1362 17.0208C32.0697 16.8234 31.9627 16.642 31.8222 16.4881C31.6816 16.3343 31.5105 16.2115 31.3199 16.1274C31.1292 16.0434 30.9231 16 30.7147 16H13.2847ZM20.3197 13.4395C20.1803 13.3 20.0147 13.1894 19.8325 13.114C19.6503 13.0386 19.455 12.9998 19.2577 13H13.7497C13.3568 12.9999 12.9795 13.154 12.699 13.4292C12.4185 13.7044 12.2572 14.0786 12.2497 14.4715L12.2587 14.68C12.5797 14.563 12.9247 14.5 13.2847 14.5H21.3787L20.3182 13.4395H20.3197Z"
                fill="#1A62F2"
                stroke="#1A62F2"
                strokeWidth="0.6"
            />
        </g>
        <defs>
            <clipPath id="clip0_15777_65664">
                <rect
                    width="24"
                    height="24"
                    fill="white"
                    transform="translate(10 9.99998)"
                />
            </clipPath>
        </defs>
    </svg>
);

function FolderSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default FolderSvg;