import React from "react";
import { Breadcrumb } from "antd";

export default function LibraryBreadcrumbs(props) {
    return (
        <Breadcrumb separator=">">
            {props.breadcrumbs.map((breadcrumb) => (
                <Breadcrumb.Item href={breadcrumb.href} key={breadcrumb.href}>
                    {breadcrumb.label}
                </Breadcrumb.Item>
            ))}
        </Breadcrumb>
    );
}
