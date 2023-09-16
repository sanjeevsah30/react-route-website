import { SvgIcon } from "@mui/material";

export default function RecordLineLower({ sx }) {
    return (
        <SvgIcon
            sx={{ width: 500, height: 11, ...sx }}
            viewBox="0 0 500 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M421.883 2.70163C439.019 3.60187 466.606 5.7498 499.5 6.5C463.546 7.06265 433.817 7.87799 432.593 8.32811C369.865 11.7067 312.491 9.4534 284.187 8.32811C255.883 7.20281 222.224 9.4534 219.929 9.4534C176.325 12.8293 -26.8341 8.32811 3 8.32811C32.8341 8.32811 67.6983 2.70163 76.878 2.70163C86.0578 2.70163 92.1776 2.70163 136.546 1.01369C180.915 -0.674252 244.408 2.70163 283.422 1.01369C322.436 -0.674252 400.464 1.57634 421.883 2.70163Z"
                fill="url(#paint0_linear_13379_60947)"
                fillOpacity="0.1"
            />
            <defs>
                <linearGradient
                    id="paint0_linear_13379_60947"
                    x1="543.515"
                    y1="3.81418"
                    x2="542.898"
                    y2="23.4556"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#FF4D4F" />
                    <stop offset="0.395833" stopColor="#ED9184" />
                    <stop offset="0.71875" stopColor="#DE513E" />
                    <stop offset="1" stopColor="#C9311D" />
                </linearGradient>
            </defs>
        </SvgIcon>
    );
}
