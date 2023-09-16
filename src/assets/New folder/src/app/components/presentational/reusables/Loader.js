import React from "react";
import { Skeleton, Spin } from "antd";
import "./loader.scss";

export default function Loader({
    loading,
    tip,
    children,
    showImg,
    alt,
    row_count,
}) {
    return loading ? (
        <div
            style={{
                width: "100%",
            }}
            className="padding20"
        >
            <Skeleton active paragraph={{ rows: row_count }} title={false} />
        </div>
    ) : (
        <>{children}</>
    );
}

Loader.defaultProps = {
    showImg: true,
    row_count: 5,
};
