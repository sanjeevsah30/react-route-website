import Icon from "@ant-design/icons";

const Svg = () => {
    return (
        <svg
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <mask
                id="mask0_24592_75276"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="24"
                height="25"
            >
                <rect y="0.25" width="24" height="24" fill="#fff" />
            </mask>
            <g mask="url(#mask0_24592_75276)">
                <path
                    d="M6.6 9.4H9.3C9.555 9.4 9.7689 9.3136 9.9417 9.1408C10.1139 8.9686 10.2 8.755 10.2 8.5C10.2 8.245 10.1139 8.0311 9.9417 7.8583C9.7689 7.6861 9.555 7.6 9.3 7.6H6.6C6.345 7.6 6.1311 7.6861 5.9583 7.8583C5.7861 8.0311 5.7 8.245 5.7 8.5C5.7 8.755 5.7861 8.9686 5.9583 9.1408C6.1311 9.3136 6.345 9.4 6.6 9.4ZM6.6 13H9.3C9.555 13 9.7689 12.9136 9.9417 12.7408C10.1139 12.5686 10.2 12.355 10.2 12.1C10.2 11.845 10.1139 11.6311 9.9417 11.4583C9.7689 11.2861 9.555 11.2 9.3 11.2H6.6C6.345 11.2 6.1311 11.2861 5.9583 11.4583C5.7861 11.6311 5.7 11.845 5.7 12.1C5.7 12.355 5.7861 12.5686 5.9583 12.7408C6.1311 12.9136 6.345 13 6.6 13ZM6.6 16.6H9.3C9.555 16.6 9.7689 16.5136 9.9417 16.3408C10.1139 16.1686 10.2 15.955 10.2 15.7C10.2 15.445 10.1139 15.2311 9.9417 15.0583C9.7689 14.8861 9.555 14.8 9.3 14.8H6.6C6.345 14.8 6.1311 14.8861 5.9583 15.0583C5.7861 15.2311 5.7 15.445 5.7 15.7C5.7 15.955 5.7861 16.1686 5.9583 16.3408C6.1311 16.5136 6.345 16.6 6.6 16.6ZM14.295 14.4175C14.415 14.4175 14.5275 14.3986 14.6325 14.3608C14.7375 14.3236 14.835 14.26 14.925 14.17L18.12 10.975C18.315 10.78 18.4089 10.5661 18.4017 10.3333C18.3939 10.1011 18.3 9.895 18.12 9.715C17.94 9.535 17.7261 9.445 17.4783 9.445C17.2311 9.445 17.0175 9.535 16.8375 9.715L14.295 12.2575L13.6425 11.605C13.4625 11.425 13.2525 11.3386 13.0125 11.3458C12.7725 11.3536 12.5625 11.4475 12.3825 11.6275C12.2175 11.8075 12.1311 12.0175 12.1233 12.2575C12.1161 12.4975 12.2025 12.7075 12.3825 12.8875L13.665 14.17C13.755 14.26 13.8525 14.3236 13.9575 14.3608C14.0625 14.3986 14.175 14.4175 14.295 14.4175ZM4.8 20.2C4.305 20.2 3.8814 20.0239 3.5292 19.6717C3.1764 19.3189 3 18.895 3 18.4V5.8C3 5.305 3.1764 4.8811 3.5292 4.5283C3.8814 4.1761 4.305 4 4.8 4H19.2C19.695 4 20.1189 4.1761 20.4717 4.5283C20.8239 4.8811 21 5.305 21 5.8V18.4C21 18.895 20.8239 19.3189 20.4717 19.6717C20.1189 20.0239 19.695 20.2 19.2 20.2H4.8Z"
                    fill="currentColor"
                />
            </g>
        </svg>
    );
};

const AuditDashboardSvg = (props) => {
    return <Icon component={Svg} {...props} />;
};

export default AuditDashboardSvg;
