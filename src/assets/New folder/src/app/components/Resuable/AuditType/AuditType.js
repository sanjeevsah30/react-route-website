import auditConfig from "@constants/Audit/index";
import { Radio, Space } from "antd";
import React from "react";

export default function AuditType({ value, onChange }) {
    return (
        <div className=" flex alignCenter justifySpaceBetween marginTB16">
            <label className="bold600">Audit Type</label>
            <Space className="radioBtn-container font14 bold600 ">
                <Radio.Group value={value} onChange={onChange}>
                    <Radio value={auditConfig.AI_AUDIT_TYPE}>AI</Radio>
                    <Radio value={auditConfig.MANUAL_AUDIT_TYPE}>Manual</Radio>
                </Radio.Group>
            </Space>
        </div>
    );
}
