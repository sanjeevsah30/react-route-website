import React from "react";
import Icon from "@ant-design/icons";
const Svg = () => (
    <svg
        width="18"
        height="20"
        viewBox="0 0 18 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12.9291 5.53153V4.4601C12.9291 4.36189 12.8487 4.28153 12.7505 4.28153H4.17908C4.08087 4.28153 4.00051 4.36189 4.00051 4.4601V5.53153C4.00051 5.62974 4.08087 5.7101 4.17908 5.7101H12.7505C12.8487 5.7101 12.9291 5.62974 12.9291 5.53153ZM4.17908 7.49581C4.08087 7.49581 4.00051 7.57617 4.00051 7.67439V8.74582C4.00051 8.84403 4.08087 8.92439 4.17908 8.92439H8.28622C8.38444 8.92439 8.46479 8.84403 8.46479 8.74582V7.67439C8.46479 7.57617 8.38444 7.49581 8.28622 7.49581H4.17908ZM12.5719 10.0851C9.90899 10.0851 7.75051 12.2436 7.75051 14.9065C7.75051 17.5695 9.90899 19.728 12.5719 19.728C15.2349 19.728 17.3934 17.5695 17.3934 14.9065C17.3934 12.2436 15.2349 10.0851 12.5719 10.0851ZM14.9715 17.3061C14.3309 17.9467 13.4782 18.2994 12.5719 18.2994C11.6657 18.2994 10.813 17.9467 10.1724 17.3061C9.53176 16.6655 9.17908 15.8128 9.17908 14.9065C9.17908 14.0003 9.53176 13.1476 10.1724 12.507C10.813 11.8664 11.6657 11.5137 12.5719 11.5137C13.4782 11.5137 14.3309 11.8664 14.9715 12.507C15.6121 13.1476 15.9648 14.0003 15.9648 14.9065C15.9648 15.8128 15.6121 16.6655 14.9715 17.3061ZM14.5585 13.2101H13.5697C13.5117 13.2101 13.4581 13.2369 13.4246 13.2838L12.0072 15.2436L11.4916 14.5315C11.4751 14.5085 11.4533 14.4898 11.428 14.477C11.4028 14.4642 11.3748 14.4576 11.3465 14.4579H10.3621C10.217 14.4579 10.1322 14.623 10.217 14.7414L11.8643 17.0204C11.9358 17.1186 12.0809 17.1186 12.1523 17.0204L14.7014 13.4936C14.7885 13.3753 14.7036 13.2101 14.5585 13.2101ZM7.39337 17.5851H2.21479V1.87081H14.7148V9.54939C14.7148 9.6476 14.7952 9.72796 14.8934 9.72796H16.1434C16.2416 9.72796 16.3219 9.6476 16.3219 9.54939V0.977958C16.3219 0.582868 16.0027 0.263672 15.6077 0.263672H1.32194C0.926847 0.263672 0.607651 0.582868 0.607651 0.977958V18.478C0.607651 18.873 0.926847 19.1922 1.32194 19.1922H7.39337C7.49158 19.1922 7.57194 19.1119 7.57194 19.0137V17.7637C7.57194 17.6655 7.49158 17.5851 7.39337 17.5851Z"
            fill="currentColor"
        />
    </svg>
);

function AccountsSvg(props) {
    return <Icon component={Svg} {...props} />;
}

export default AccountsSvg;