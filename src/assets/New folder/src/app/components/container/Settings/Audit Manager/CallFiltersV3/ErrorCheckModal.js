import Icon from "@presentational/reusables/Icon";
import { runErrorCommand } from "@store/call_audit/actions";
import { Button, InputNumber, Modal, Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FilterSettingsContext } from "./AuditFiltersSettings";

function ErrorCheckModal() {
    const { errorCmdVisible, setErrorCmdVisible, template_id } = useContext(
        FilterSettingsContext
    );

    const [checkType, setCheckType] = useState("template");
    const [idToCheck, setIdToCheck] = useState(Number(template_id));
    const [meetingIdToCheck, setMeetingIdToCheck] = useState(null);
    const dispatch = useDispatch();

    const {
        common: { domain },
        callAudit: { runCommandLoading },
    } = useSelector((state) => state);

    const [errorApi, setErrorApi] = useState(
        `/audit/subfilter/check/${idToCheck}/?check_type=${checkType}`
    );

    useEffect(() => {
        const newApi = `/audit/subfilter/check/${idToCheck}/?check_type=${checkType}`;

        checkType === "template" && meetingIdToCheck
            ? setErrorApi(`${newApi}&meeting_id=${meetingIdToCheck}`)
            : setErrorApi(newApi);
    }, [idToCheck, checkType, meetingIdToCheck]);

    return (
        <Modal
            title="Error Check"
            visible={errorCmdVisible}
            onCancel={() => setErrorCmdVisible(false)}
            width={1000}
            className="commands_modal"
            footer={[
                <Button
                    onClick={() => {
                        setIdToCheck(template_id);
                        setCheckType("template");
                    }}
                    key={"reset_btn"}
                >
                    Reset
                </Button>,
                <Button
                    type="primary"
                    onClick={() => {
                        !runCommandLoading &&
                            dispatch(runErrorCommand(errorApi));
                    }}
                    loading={runCommandLoading}
                    key={"run_btn"}
                >
                    {runCommandLoading ? "...Running" : "Run"}
                </Button>,
            ]}
        >
            <div className="paddingLR16">
                <div className="font16 bold600">
                    {`https://${domain}.api.convin.ai`}
                    {errorApi}
                </div>
                <div className="options_container ">
                    <Select
                        className="custom__select"
                        onChange={(val) => {
                            setCheckType(val);
                        }}
                        value={checkType}
                        dropdownRender={(menu) => (
                            <div>
                                <span className={"topbar-label"}>
                                    Check Type
                                </span>
                                {menu}
                            </div>
                        )}
                        placeholder={"Group by"}
                        suffixIcon={
                            <Icon className="fas fa-chevron-down dove_gray_cl" />
                        }
                        style={{
                            height: "36px",
                        }}
                        dropdownClassName={"account_select_dropdown"}
                    >
                        <Select.Option value={"subfilter"}>
                            Subfilter
                        </Select.Option>
                        <Select.Option value={"filter"}>Filter</Select.Option>
                        <Select.Option value={"template"}>
                            Template
                        </Select.Option>
                    </Select>
                    <InputNumber
                        onChange={(e) => {
                            setIdToCheck(e);
                        }}
                        value={idToCheck}
                        min={1}
                        placeholder="Enter Id"
                    />
                    {checkType === "template" && (
                        <InputNumber
                            onChange={(e) => {
                                setMeetingIdToCheck(e);
                            }}
                            value={meetingIdToCheck}
                            min={1}
                            placeholder="Enter Meeting Id"
                            style={{
                                width: "500px",
                            }}
                        />
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default ErrorCheckModal;
