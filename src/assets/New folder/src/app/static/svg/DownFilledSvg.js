import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="10"
        height="7"
        viewBox="0 0 10 7"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M5 6.01562L0.669877 0.188701L9.33013 0.188702L5 6.01562Z"
            fill="currentColor"
        />
    </svg>
);

function DownFilledSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default DownFilledSvg;
