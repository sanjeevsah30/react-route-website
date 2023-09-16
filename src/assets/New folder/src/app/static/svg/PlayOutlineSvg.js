import Icon from "@ant-design/icons";

const Svg = () => (
    <svg
        width="13"
        height="14"
        viewBox="0 0 13 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12 6.13397C12.6667 6.51888 12.6667 7.48112 12 7.86602L2.25 13.4952C1.58333 13.8801 0.749999 13.399 0.749999 12.6292L0.75 1.37083C0.75 0.601033 1.58333 0.119909 2.25 0.504809L12 6.13397Z"
            fill="currentColor"
        />
    </svg>
);

const PlayOutlineSvg = (props) => {
    return <Icon component={Svg} {...props} />;
};

export default PlayOutlineSvg;
