import React, { useState } from "react";
import { Input, NoData } from "@reusables";
import { Tooltip, Modal, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import settingsConfig from "@constants/Settings";
import { Tag } from "antd";
import { uid } from "@tools/helpers";
import { getMeetingsForCallType } from "@apis/calls/index";
import { useSelector } from "react-redux";

const CallTypeManager = () => {
    const { callTypes } = useSelector((state) => state.common.filterCallTypes);
    const [newCallType, setnewCallType] = useState("");
    const [isCallTypeEditable, setisCallTypeEditable] = useState(false);
    const [isDeletingCallType, setisDeletingCallType] = useState({
        value: false,
        error: false,
        msg: "",
    });

    const settingsHandlers = {
        handleNewCallType: (event) => {
            setnewCallType(event.target.value);
            if (event.key === "Enter") {
                createCallType(domain, { type: newCallType }).then((res) => {
                    if (res.status === apiErrors.AXIOSERRORSTATUS) {
                        setisDeletingCallType({
                            value: false,
                            error: true,
                            msg: res.message,
                        });
                    } else {
                        dispatch(getAllCallTypes());
                        setisDeletingCallType({
                            error: false,
                            msg: "",
                            value: false,
                        });
                    }
                });
                setnewCallType("");
            }
        },
        toggleEdit: () => {
            setisCallTypeEditable((isEditable) => !isEditable);
        },
        handleRemoveCallType: (id) => {
            setisDeletingCallType({
                ...isDeletingCallType,
                value: true,
            });
            deleteCallType(domain, id).then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    setisDeletingCallType({
                        value: false,
                        error: true,
                        msg: res.message,
                    });
                } else {
                    dispatch(getAllCallTypes());
                    setisDeletingCallType({
                        value: false,
                        error: false,
                        msg: "",
                    });
                }
            });
        },
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [associatedMeetings, setAssociatedMeetings] = useState(null);
    const [CurrentTypeid, SetCurrentTypeid] = useState(null);

    const showModal = (id) => {
        setIsModalOpen(true);
        getMeetingsForCallType(id).then((res) => {
            setAssociatedMeetings(res?.meeting);
            SetCurrentTypeid(id);
        });
    };
    const handleOk = () => {
        settingsHandlers.handleRemoveCallType(CurrentTypeid);
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <div className="callType-container card">
            <div className="callType-container-actions">
                <Input
                    inputClass="callType-input"
                    handleChange={settingsHandlers.handleNewCallType}
                    name="newType"
                    title={settingsConfig.ADD_CALL_TYPE}
                    type="text"
                    inputPlaceholder={settingsConfig.NEW_CALL_TYPE_PLACEHOLDER}
                    inputValue={newCallType}
                    handleKeyUp={settingsHandlers.handleNewCallType}
                />
            </div>
            {callTypes.length > 0 ? (
                <div className="callType-container-types">
                    {callTypes.map(({ id, name }, idx) => {
                        return id ? (
                            <Tag
                                key={id}
                                closable
                                color="geekblue"
                                onClose={(e) => {
                                    showModal(id);
                                    e.preventDefault();
                                }}
                                closeIcon={
                                    <CloseOutlined className="curPoint" />
                                }
                            >
                                {name.slice(0, 30)}
                            </Tag>
                        ) : null;
                    })}
                    {isDeletingCallType.error && (
                        <span className="error-span">
                            {isDeletingCallType.msg}
                        </span>
                    )}
                </div>
            ) : (
                <div className="callType-container-notypes">
                    <NoData description={"No call types found"} />
                </div>
            )}

            <Modal
                title=""
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                className="tagAlert text-center"
                okText="yes"
                cancelText="No"
                footer={[
                    <div className="flex justifyCenter">
                        <Button
                            onClick={handleCancel}
                            key={""}
                            className=" marginAuto borderRadius4 capitalize ant-btn justifyCenter"
                        >
                            No
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleOk}
                            key={""}
                            className="marginAuto borderRadius4 capitalize ant-btn justifyCenter"
                        >
                            Yes
                        </Button>
                    </div>,
                ]}
            >
                <div className="font16 bold600">
                    <NoData description={"Do you wish to delete Call type?"} />
                    <p className="font18 primaryText ">“Pipeline Review”</p>
                    <p className="font14 dove_gray_cl bold400">
                        {`This tag is associated with ${
                            associatedMeetings || 0
                        }  meetings`}
                    </p>
                </div>
            </Modal>
        </div>
    );
};
export default CallTypeManager;
