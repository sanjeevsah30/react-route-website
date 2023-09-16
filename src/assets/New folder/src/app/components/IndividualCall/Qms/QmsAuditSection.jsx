import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import CustomTabs from "../../Resuable/Tabs/CustomTabs";
import ManualCallAudit from "../../MyMeetings/ManualCallAudit";
import Spinner from "@presentational/reusables/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { QMSActiveCallContext } from "./QmsView";
import { useParams } from "react-router-dom";
import useHandleAuditCalculation from "../Hooks/useHandleAuditCalculation";
import {
    createMeetingScoreObjects,
    getMeetingAuditViolations,
    getMeetingManualScoreStatus,
    getMeetingTemplates,
    setMeetingAuditTemplate,
    setMeetingManualScore,
} from "@store/auditSlice/auditSlice";
import apiErrors from "@apis/common/errors";
import { acknowledgeRaiseDisputeApi } from "@apis/individual/index";
import { openNotification } from "@store/common/actions";
import { Button, Modal, message, Input } from "antd";
import { getError } from "@apis/common/index";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { formatFloat, getPercentage } from "@tools/helpers";

export const QmsCallAuditContext = createContext();

export default function QmsAuditSection({
    handleActiveQmsCallId,
    handleSubmit,
    auditStartTime,
    setAuditStartTime,
    showAcknowledgeBtn,
    submitVisible,
    setSubmitModalVisible,
}) {
    useHandleAuditCalculation();

    const {
        score_objects,
        loading,
        meeting_templates,
        audit_template,
        manual_score,
    } = useSelector((state) => state.auditSlice);
    const { stats_threshold } = useSelector(
        (state) => state.common.versionData
    );
    const user = useSelector((state) => state.auth);
    const { activeCall } = useContext(QMSActiveCallContext);
    const { id } = useParams();
    const dispatch = useDispatch();
    const [activeCategories, setActiveCategories] = useState([]);
    const [showDisputeModal, setShowDisputeModal] = useState(false);
    const [acknowledging, setAcknowledging] = useState(false);
    const domain = useSelector((state) => state.common.domain);
    const [disputeDescription, setDisputeDescription] = useState(false);

    useEffect(() => {
        id && handleActiveQmsCallId(id);
    }, [id]);

    useEffect(() => {
        const { callId } = activeCall;
        if (callId) {
            dispatch(getMeetingTemplates(callId)).then(({ payload }) => {
                if (payload.status !== apiErrors.AXIOSERRORSTATUS)
                    if (payload.length) {
                        if (audit_template.id) {
                            setActiveCategories(
                                payload.find(
                                    ({ template }) =>
                                        template.id === audit_template.id
                                )?.categories || []
                            );

                            return;
                        }
                        dispatch(setMeetingAuditTemplate(payload[0]?.template));
                        setActiveCategories(payload[0]?.categories);
                    }
            });
            dispatch(getMeetingAuditViolations());
        }
    }, [activeCall.callId]);

    const trackAuditedTime = useCallback(() => {
        if (auditStartTime) {
            return;
        }

        if (
            (manual_score?.data?.audit_time === null ||
                manual_score?.data?.audit_time === undefined) &&
            auditStartTime === null
        ) {
            setAuditStartTime(new Date().getTime());
        }
    }, [manual_score.data, auditStartTime]);

    const manualPercentage = getPercentage(
        manual_score?.data?.scores?.template_score,
        manual_score?.data?.scores?.template_marks_audited
    );

    const manualCallScoreColor =
        manualPercentage >= stats_threshold?.good
            ? "#52C41A"
            : manualPercentage >= stats_threshold?.average
            ? "#ECA51D"
            : "#FF6365";

    const handleAcknowledge = (payload, msg) => {
        setAcknowledging(true);
        acknowledgeRaiseDisputeApi(domain, activeCall.callId, payload)
            .then((res) => {
                setAcknowledging(false);
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    return openNotification("error", "Error", res.message);
                }
                dispatch(
                    setMeetingManualScore({
                        ...manual_score?.data,
                        acknowledged: res.acknowledged,
                    })
                );
                if (payload.status === "acknowledge") {
                    message.success({
                        content: "Acknowledged successfully",
                        className: "toast-dark",
                    });
                    return;
                } else {
                    setShowDisputeModal(false);
                }
                message.success({
                    content: "Details have been saved successfully",
                    className: "toast-dark",
                });
            })
            .catch((err) => {
                setAcknowledging(false);
                openNotification("error", "Error", getError(err));
            });
    };

    useEffect(() => {
        const { callId } = activeCall;
        if (callId) {
            dispatch(getMeetingTemplates(callId)).then(({ payload }) => {
                if (payload.status !== apiErrors.AXIOSERRORSTATUS)
                    if (payload.length) {
                        if (audit_template.id) {
                            return;
                        }
                        dispatch(setMeetingAuditTemplate(payload[0]?.template));
                        setActiveCategories(payload[0]?.categories);
                    }
            });
            dispatch(getMeetingAuditViolations());
        }
    }, [activeCall.callId]);

    useEffect(() => {
        const url = new URLSearchParams(document.location.search);
        const ack_template_id = +url.get("ack_template_id");
        if (activeCall?.callDetails?.owner?.id === user.id && ack_template_id) {
            handleAcknowledge(
                {
                    status: "acknowledge",
                    template_id: ack_template_id,
                },
                "Thank you for Acknowledging"
            );
        }
    }, [activeCall?.callDetails]);

    useEffect(() => {
        if (meeting_templates.data.length)
            setActiveCategories(
                meeting_templates.data.find(
                    ({ template }) => template.id === audit_template.id
                )?.categories || []
            );
    }, [meeting_templates, audit_template]);

    useEffect(() => {
        const url = new URLSearchParams(document.location.search);
        const ack_template_id = +url.get("ack_template_id");
        if (ack_template_id) {
            return;
        }
        if (activeCall.callId && audit_template.id) {
            const params = {
                id: activeCall.callId,
                payload: { template_id: audit_template?.id },
            };
            dispatch(getMeetingManualScoreStatus(params)).then((res) => {
                dispatch(
                    createMeetingScoreObjects({
                        id: activeCall.callId,
                        template_id: audit_template?.id,
                    })
                );
            });
        }
    }, [audit_template?.id]);

    useEffect(() => {
        const url = new URLSearchParams(document.location.search);
        const ack_template_id = +url.get("ack_template_id");
        if (meeting_templates?.data?.length && ack_template_id) {
            const temp = meeting_templates?.data?.find(
                ({ template: { id } }) => ack_template_id === id
            );
            dispatch(setMeetingAuditTemplate(temp?.template));
            const params = {
                id: activeCall.callId,
                payload: { template_id: ack_template_id },
            };

            dispatch(getMeetingManualScoreStatus(params)).then((res) => {
                dispatch(
                    createMeetingScoreObjects({
                        id: activeCall.callId,
                        template_id: ack_template_id,
                    })
                );
            });
        }
    }, [meeting_templates?.data?.length]);

    return (
        <>
            <QmsCallAuditContext.Provider
                value={{
                    activeCategories,
                    showDisputeModal,
                    acknowledging,
                    setActiveCategories,
                    trackAuditedTime,
                    setAuditStartTime,
                    setShowDisputeModal,
                    handleAcknowledge,
                    setAcknowledging,
                }}
            >
                {activeCall.id && (
                    <div className="call_audit_section flex1 flex column">
                        <div
                            className="paddingLR32 flexShrink0 flex justifySpaceBetween"
                            style={{
                                borderBottom:
                                    "1px solid rgba(153, 153, 153, 0.2)",
                            }}
                        >
                            <ul
                                className="custom__tabs"
                                style={{ position: "relative" }}
                            >
                                <li
                                    className="active marginL10"
                                    style={{
                                        background: "none",
                                        position: "absolute",
                                        bottom: 0,
                                    }}
                                >
                                    {"Audit"}
                                </li>
                            </ul>
                            {/* {manual_score?.data?.auditor && (
                                <div className="left_score_section flex alignCenter">
                                    <div className="marginR28">
                                        <span className="bold600 font16">
                                            Call Score
                                        </span>
                                        <span>
                                            <span className="font12 dusty_gray_cl marginL5">
                                                Scored by
                                            </span>
                                            <span className="font12 marginL5 primary_cl">
                                                {
                                                    manual_score?.data?.auditor
                                                        ?.first_name
                                                }
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex alignCenter column justifyCenter paddingTB12">
                                        <div
                                            className="flex alignCenter curPoint white_cl"
                                            style={{
                                                borderRadius: '4px',
                                                backgroundColor: `${manualCallScoreColor}`,
                                                width: '100%',
                                            }}
                                        >
                                            <div
                                                className="font24 bold600 paddingTB10 paddingL16"
                                                style={{
                                                    textAlign: 'center',
                                                    lineHeight: '24px',
                                                }}
                                            >
                                                {`${manualPercentage}% |`}
                                            </div>
                                            <div
                                                className="font20 bold400 paddingTB10 marginL13 paddingR17"
                                                style={{
                                                    textAlign: 'center',
                                                    lineHeight: '24px',
                                                }}
                                            >
                                                {`${
                                                    formatFloat(
                                                        manual_score?.data
                                                            ?.scores
                                                            ?.template_score,
                                                        2
                                                    ) || 0
                                                } / ${
                                                    formatFloat(
                                                        manual_score?.data
                                                            ?.scores
                                                            ?.template_marks_audited,
                                                        2
                                                    ) || 0
                                                }`}
                                            </div>
                                        </div>
                                        {!!manual_score?.data?.scores
                                            ?.non_fatal_template_score &&
                                        manual_score?.data?.scores
                                            ?.non_fatal_template_score !==
                                            manual_score?.data?.scores
                                                ?.template_score ? (
                                            <div className="text-center font12">
                                                <span className="dusty_gray_cl">
                                                    Non Violation Score
                                                </span>
                                                <span className="dusty_gray_cl">
                                                    {' | '}
                                                </span>
                                                {
                                                    <span className="primary">{`${getPercentage(
                                                        manual_score?.data
                                                            ?.scores
                                                            ?.non_fatal_template_score,
                                                        manual_score?.data
                                                            ?.scores
                                                            ?.template_marks_audited
                                                    )}%`}</span>
                                                }
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                            )} */}
                        </div>
                        {score_objects?.loading ||
                        loading ||
                        manual_score.loading ||
                        meeting_templates?.loading ? (
                            <Spinner loading={true}>
                                <ManualCallAudit activeCall={activeCall} />
                            </Spinner>
                        ) : (
                            <ManualCallAudit activeCall={activeCall} />
                        )}
                    </div>
                )}
            </QmsCallAuditContext.Provider>

            <Modal
                title="SUBMIT AUDIT"
                visible={submitVisible}
                footer={[
                    <Button
                        key="na_no"
                        onClick={() => setSubmitModalVisible(false)}
                    >
                        Continue Auditing
                    </Button>,
                    <Button
                        key="na_yes"
                        type="primary"
                        onClick={() => {
                            handleSubmit({
                                mark_na: true,
                            });
                        }}
                    >
                        Submit
                    </Button>,
                ]}
                onCancel={() => setSubmitModalVisible(false)}
                maskClosable={true}
                keyboard={true}
            >
                <div className="bold paddingL16 font16">
                    <ExclamationCircleOutlined /> Do you want to mark all the
                    unmarked questions with the default response
                </div>
            </Modal>

            <Modal
                title="Raise Dispute"
                visible={showDisputeModal}
                footer={[
                    <Button
                        key="raise_dispute_submit_btn"
                        onClick={() => {
                            handleAcknowledge(
                                {
                                    status: "dispute",
                                    note: disputeDescription,
                                    template_id: audit_template?.id,
                                },
                                "Dispute raised successfully"
                            );
                        }}
                        type="primary"
                        loading={acknowledging}
                    >
                        Submit
                    </Button>,
                ]}
                onCancel={() => setShowDisputeModal(false)}
                maskClosable={true}
                keyboard={true}
                width={600}
            >
                <div className="bold paddingL16 font16">
                    <div>
                        Please comment the issue to rasie dispute against the
                        audit by{" "}
                        <span className="primary_cl">
                            {activeCall?.callDetails?.stats?.auditor
                                ?.first_name +
                                activeCall?.callDetails?.stats?.auditor
                                    ?.last_name}
                        </span>
                        .
                    </div>
                    <Input.TextArea
                        placeholder="Write a brief description"
                        className="marginT16 dispute_note"
                        autoSize={{
                            minRows: 6,
                            maxRows: 8,
                        }}
                        value={disputeDescription}
                        onChange={(e) => {
                            setDisputeDescription(e.target.value);
                        }}
                    />
                </div>
            </Modal>
            {manual_score?.data?.auditor &&
                activeCall?.callDetails?.owner?.id === user.id && (
                    <>
                        {activeCall?.callDetails?.acknowledged ||
                        manual_score?.data?.acknowledged ? (
                            <div
                                className="submit_button_container"
                                style={{
                                    position: "absolute",
                                    bottom: "10px",
                                    right: "45%",
                                }}
                            >
                                <Button
                                    className="submit_button capitalize borderRadius6"
                                    type="primary"
                                    disabled={true}
                                    style={{ height: "50px" }}
                                >
                                    Acknowledged
                                </Button>
                            </div>
                        ) : (
                            <div
                                className="submit_button_container font18"
                                style={{
                                    position: "absolute",
                                    bottom: "10px",
                                    right: "45%",
                                }}
                            >
                                <Button
                                    onClick={() => {
                                        handleAcknowledge(
                                            {
                                                status: "acknowledge",
                                                template_id: audit_template?.id,
                                            },
                                            "Thank you for Acknowledging"
                                        );
                                    }}
                                    className="submit_button capitalize font18 borderRadius6"
                                    type="primary"
                                    style={{ height: "50px" }}
                                    loading={acknowledging}
                                >
                                    I Acknowledge
                                </Button>
                            </div>
                        )}
                    </>
                )}
        </>
    );
}
