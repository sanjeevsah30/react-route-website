import React from "react";
import { Spin } from "antd";
import { useSelector } from "react-redux";
import "./spinner.style.scss";

export default function Spinner({
    loading,
    tip,
    children,
    showImg,
    alt,
    className = "",
}) {
    const {
        common: { versionData },
    } = useSelector((state) => state);
    const loader = showImg ? (
        versionData?.logo ? (
            <div className="loader">...Loading</div>
        ) : (
            <img
                src={require("../../../static/images/loader.gif").default}
                alt={alt || "loader"}
            />
        )
    ) : (
        <></>
    );
    return (
        <Spin
            spinning={loading}
            tip={tip}
            indicator={loader}
            className={className}
        >
            {children}
        </Spin>
    );
}
Spinner.defaultProps = {
    showImg: true,
};
