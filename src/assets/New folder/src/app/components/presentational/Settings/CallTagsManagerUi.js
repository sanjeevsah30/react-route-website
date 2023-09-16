import React, { useState } from "react";
import { Input, Tag, Tooltip, Modal, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { NoData } from "@reusables";
import { uid } from "@tools/helpers";
import { getMeetingsForCallTag, removeCallTag } from "@apis/calls/index";
import { useDispatch } from "react-redux";
import { storeTags } from "@store/common/actions";

const CallTagsManagerUI = (props) => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [removeTag, setRemoveTag] = useState(false);
    const [associatedMeetings, setAssociatedMeetings] = useState(null);

    const showModal = (id) => {
        getMeetingsForCallTag(id).then((res) => {
            setAssociatedMeetings(res?.meeting);
        });
        setRemoveTag(id);
        setIsModalOpen(true);
    };
    const handleOk = () => {
        removeCallTag(removeTag).then((res) => {
            if (res.status === 204) {
                const temp = props.tags.filter(
                    (item) => item?.id !== removeTag
                );
                dispatch(storeTags(temp));
            }
        });
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <div className="callTags-container card">
            <div className="callTags-container-actions">
                <Input
                    value={props.newTag}
                    onChange={props.handleChange}
                    placeholder="Enter tag and press enter"
                    allowClear
                    size={"large"}
                    onPressEnter={props.addTag}
                />
            </div>
            <div className="callTags-container-tags">
                {props.tags.length ? (
                    props.tags.map((tag) => (
                        <Tooltip title={tag.tag_name}>
                            <Tag
                                key={uid() + tag.id}
                                color="purple"
                                onClose={(e) => {
                                    showModal(tag?.id);
                                    e.preventDefault();
                                }}
                                closeIcon={
                                    <CloseOutlined className="curPoint" />
                                }
                                closable
                            >
                                {tag.tag_name.slice(0, 30)}
                            </Tag>
                        </Tooltip>
                    ))
                ) : (
                    <NoData description={"No tags found"} />
                )}
            </div>
            <Modal
                title=""
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                className="tagAlert text-center"
                // okText="yes"
                // cancelText="No"
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
                    <NoData description={"Do you wish to delete Call Tag?"} />
                    <p className="font18 primaryText ">“Feedback Received”</p>
                    <p className="font14 dove_gray_cl bold400">
                        {`This tag is associated with ${
                            associatedMeetings || 0
                        } meetings`}
                    </p>
                </div>
            </Modal>
        </div>
    );
};
export default CallTagsManagerUI;
