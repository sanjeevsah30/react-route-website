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
            d="M5 0.390625L9.33012 6.21755H0.669873L5 0.390625Z"
            fill="currentColor"
        />
    </svg>
);

function UpFilledSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default UpFilledSvg;
