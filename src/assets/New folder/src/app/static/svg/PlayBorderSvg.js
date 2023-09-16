import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M3.375 1.71777L11.0072 6.6242L3.375 11.5306V1.71777Z"
            stroke="currentColor"
            strokeWidth="1.09032"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const PlayBorderSvg = (props) => {
    return <Icon component={Svg} {...props} />;
};

export default PlayBorderSvg;
