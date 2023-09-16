import React from "react";
import config from "@constants/Settings";
import { Label, NoData } from "@reusables";
import { Modal, Button, Tag, Select } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { uid } from "@tools/helpers";

const FeedbackManagerUI = (props) => {
    const active_category = useSelector(
        (state) => state.feedback.active_category_name
    );
    return (
        <div className={"user-settings feedbackmanager"}>
            <Modal
                visible={props.showAddModal}
                title={config.FEEDBACKMANAGER.addFeedbackLabel}
                className="modal"
                onOk={props.handleNewFeedbackModal}
                onCancel={props.handleNewFeedbackModal}
                footer={[
                    <Button
                        className={"cancel-add"}
                        key="back"
                        onClick={props.handleNewFeedbackModal}
                        shape={"round"}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={props.handleAddfeedback}
                        shape={"round"}
                        loading={props.isLoading}
                    >
                        {config.FEEDBACKMANAGER.create}
                    </Button>,
                ]}
            >
                <div className={"modal-contents feedbackmodal"}>
                    <Label label={config.FEEDBACKMANAGER.feedbackQuestion} />
                    <textarea
                        autoFocus
                        required
                        placeholder={config.FEEDBACKMANAGER.enterQuestion}
                        value={props.newFeedbackQuestion}
                        onChange={props.handleChange}
                        name="newFeebackQuestion"
                    />
                    <Label label={config.FEEDBACKMANAGER.responseLabel} />
                    <Select
                        value={props.newResponseType}
                        onChange={props.handleChange}
                    >
                        {props.responseTypes.map((type) => (
                            <Select.Option
                                value={+type.id}
                                key={uid() + type.id}
                            >
                                {type.name}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </Modal>

            <Modal
                visible={props.showEditFeedback}
                title={config.FEEDBACKMANAGER.editFeedbackLabel}
                className="modal"
                onOk={props.handleEditModal}
                onCancel={props.handleEditModal}
                footer={[
                    <Button
                        className={"cancel-edit"}
                        key="back"
                        onClick={props.handleEditModal}
                        shape={"round"}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={props.handleEditFeedBack}
                        shape={"round"}
                        loading={props.isLoading}
                    >
                        {config.FEEDBACKMANAGER.save}
                    </Button>,
                ]}
            >
                <div className={"modal-contents feedbackmodal"}>
                    <Label label={config.FEEDBACKMANAGER.feedbackQuestion} />
                    <textarea
                        autoFocus
                        required
                        placeholder={config.FEEDBACKMANAGER.enterQuestion}
                        value={props.activeFeedback.statement}
                        onChange={props.handleChange}
                        name="editFeedbackQuestion"
                    />
                    <Label label={config.FEEDBACKMANAGER.responseLabel} />
                    {/* <DropdownSelect
                        selectName="editResponseType"
                        selectClass={'darkinput'}
                        options={props.responseTypes}
                        withIds={true}
                        field={'name'}
                        disabled
                        selectValue={props.activeFeedback.question_type}
                        handleChange={null}
                    /> */}
                    <Select
                        value={props.newResponseType}
                        onChange={props.handleChange}
                        disabled={true}
                    >
                        {props.responseTypes.map((type) => (
                            <Select.Option
                                value={+type.id}
                                key={uid() + type.id}
                            >
                                {type.name}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </Modal>
            <div className="card user-settings-container borderRadius8">
                <div className="flex1 paddingLR12 paddingTB8 borderBottom">
                    <Button
                        onClick={() => (window.location.hash = "")}
                        type="link"
                    >
                        <ArrowLeftOutlined />
                        &nbsp;
                        <span className="capitalize">{active_category}</span>
                    </Button>
                </div>
                <div className={"user-settings-topsection"}>
                    {/* <div className={'name'}>{config.FEEDBACKMANAGER.title}</div> */}
                    <div className={"button"}>
                        <Button
                            type="primary"
                            onClick={props.handleNewFeedbackModal}
                            shape="round"
                        >
                            {config.FEEDBACKMANAGER.btnLabel}
                        </Button>
                    </div>
                </div>
                <div className={"horizontalline"} />
                <div className={"feedbacksection"}>
                    {props.feedbacks && props.feedbacks.length > 0 ? (
                        props.feedbacks.map((feedback, index) => (
                            <div className={"feedback"} key={uid() + index}>
                                <div className={"desc"}>
                                    <div className={"desc-type"}>
                                        {config.FEEDBACKMANAGER.question}
                                    </div>
                                    <div className={"desc-body"}>
                                        {feedback.statement}
                                    </div>
                                </div>
                                <div className={"restype"}>
                                    <div className={"restype-label"}>
                                        {config.FEEDBACKMANAGER.responseLabel}
                                    </div>
                                    <Tag>
                                        {
                                            props.responseTypes.filter(
                                                (type) =>
                                                    type.id ===
                                                    String(
                                                        feedback.question_type
                                                    )
                                            )[0].name
                                        }
                                    </Tag>
                                </div>
                                <div className={"actions"}>
                                    <div className={"top"}>
                                        <button
                                            className={"accessibility"}
                                            type={"button"}
                                            onClick={() =>
                                                props.handleEditModal(
                                                    feedback,
                                                    index
                                                )
                                            }
                                        >
                                            <Label
                                                labelClass={"editor"}
                                                label={
                                                    config.FEEDBACKMANAGER
                                                        .editLabel
                                                }
                                            />
                                        </button>
                                    </div>
                                    <div className={"bottom"}>
                                        <button
                                            className={"accessibility"}
                                            type={"button"}
                                            onClick={() =>
                                                props.handleRemoveFeedback(
                                                    feedback.id
                                                )
                                            }
                                        >
                                            <Label
                                                labelClass={"remover"}
                                                label={
                                                    config.FEEDBACKMANAGER
                                                        .removeLabel
                                                }
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={"no-feedbacks"}>
                            <NoData
                                description={config.FEEDBACKMANAGER.noFeedbacks}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default FeedbackManagerUI;
