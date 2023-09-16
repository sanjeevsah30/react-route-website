import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="21"
        height="19"
        viewBox="0 0 21 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M7.31595e-06 7.50004C0.00036763 5.8809 0.524699 4.30536 1.49463 3.00888C2.46457 1.71241 3.82802 0.764639 5.3812 0.307221C6.93439 -0.150198 8.59389 -0.0926977 10.1117 0.471127C11.6295 1.03495 12.9241 2.07482 13.8019 3.43532C14.6798 4.79581 15.0938 6.40387 14.9821 8.01915C14.8704 9.63443 14.239 11.1702 13.1822 12.3969C12.1254 13.6236 10.7 14.4754 9.11903 14.8249C7.53806 15.1744 5.88644 15.0029 4.41101 14.336C3.15301 14.626 1.79801 14.876 1.17501 14.988C1.01579 15.0165 0.852046 15.0057 0.697918 14.9567C0.54379 14.9077 0.403919 14.8219 0.290395 14.7067C0.17687 14.5915 0.093107 14.4504 0.0463454 14.2955C-0.000416238 14.1407 -0.00876957 13.9768 0.0220074 13.818C0.140007 13.208 0.402007 11.9 0.703007 10.675C0.238486 9.68113 -0.00152762 8.59714 7.31595e-06 7.50004ZM6.14401 3.30704C5.70201 3.54304 5.35401 3.91004 5.09101 4.39704C5.00493 4.57102 4.98965 4.77159 5.04839 4.9566C5.10713 5.14161 5.23531 5.29663 5.40598 5.38909C5.57665 5.48155 5.77653 5.50424 5.96358 5.45239C6.15063 5.40053 6.3103 5.27818 6.40901 5.11104C6.55601 4.84104 6.70701 4.70704 6.85101 4.63104C7.00101 4.55004 7.20501 4.50104 7.50001 4.50104C7.72401 4.50104 7.98701 4.58004 8.18001 4.73904C8.35101 4.87904 8.50001 5.10304 8.50001 5.50004C8.50001 5.69504 8.42501 5.78504 7.91201 6.18804C7.46201 6.54204 6.75001 7.11604 6.75001 8.25004C6.75001 8.44895 6.82903 8.63972 6.96968 8.78037C7.11033 8.92102 7.3011 9.00004 7.50001 9.00004C7.69892 9.00004 7.88969 8.92102 8.03034 8.78037C8.17099 8.63972 8.25001 8.44895 8.25001 8.25004C8.25001 7.88004 8.41401 7.70104 8.83801 7.36704L8.92301 7.30204C9.31001 7.00404 10 6.47504 10 5.50004C10 4.65204 9.64901 4.00204 9.13201 3.57804C8.66932 3.20594 8.09375 3.00245 7.50001 3.00104C7.04501 3.00104 6.57801 3.07504 6.14401 3.30704ZM8.50001 11C8.50001 10.7348 8.39465 10.4805 8.20711 10.2929C8.01958 10.1054 7.76522 10 7.50001 10C7.23479 10 6.98044 10.1054 6.7929 10.2929C6.60536 10.4805 6.50001 10.7348 6.50001 11C6.50001 11.2653 6.60536 11.5196 6.7929 11.7071C6.98044 11.8947 7.23479 12 7.50001 12C7.76522 12 8.01958 11.8947 8.20711 11.7071C8.39465 11.5196 8.50001 11.2653 8.50001 11ZM7.40001 16C8.78561 17.2882 10.6082 18.0029 12.5 18C13.5652 18.0015 14.6185 17.7751 15.589 17.336C16.849 17.626 18.21 17.876 18.837 17.986C18.9965 18.0142 19.1604 18.003 19.3146 17.9535C19.4688 17.904 19.6086 17.8176 19.7219 17.7019C19.8352 17.5861 19.9186 17.4445 19.9647 17.2893C20.0109 17.134 20.0186 16.9699 19.987 16.811C19.7796 15.7609 19.5495 14.7153 19.297 13.675C19.7417 12.723 19.9814 11.6882 20.0006 10.6376C20.0199 9.58707 19.8183 8.54416 19.4089 7.57646C18.9995 6.60877 18.3914 5.73785 17.6239 5.02012C16.8565 4.3024 15.9469 3.75386 14.954 3.41004C15.6688 4.71202 16.03 6.17858 16.0015 7.6636C15.973 9.14862 15.5559 10.6003 14.7917 11.8739C14.0276 13.1475 12.943 14.1987 11.6461 14.9226C10.3492 15.6466 8.88519 16.018 7.40001 16Z"
            fill="#1A62F2"
        />
    </svg>
);

const QAndASvg = (props) => {
    return <Icon component={Svg} {...props} />;
};

export default QAndASvg;