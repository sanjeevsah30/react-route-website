import {
    getAvailableCrmSheets,
    setDefaultCrmSheet,
} from "@store/settings/actions";
import { Alert, Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CrmSheetPopup({ visible, onClose, label, onSubmit }) {
    const dispatch = useDispatch();
    const {
        settings: { crm_sheets, default_crm_sheet },
    } = useSelector((state) => state);

    useEffect(() => {
        visible && dispatch(getAvailableCrmSheets());
    }, [visible]);

    return (
        <Modal
            title={label}
            visible={visible}
            // onOk={handleSubmit}
            onCancel={onClose}
            footer={<></>}
        >
            <div className="marginB10">
                <Select
                    style={{
                        width: "100%",
                    }}
                    value={default_crm_sheet?.spreadsheet_id}
                    placeholder={"Select CRM Sheet"}
                    onChange={(value) => {
                        const find = crm_sheets.find(
                            ({ spreadsheet_id }) => spreadsheet_id === value
                        );
                        find && dispatch(setDefaultCrmSheet(find));
                    }}
                >
                    {crm_sheets.map(({ spreadsheet_name, spreadsheet_id }) => (
                        <Select.Option
                            key={spreadsheet_id}
                            value={spreadsheet_id}
                        >
                            {spreadsheet_name}
                        </Select.Option>
                    ))}
                </Select>
            </div>
        </Modal>
    );
}
