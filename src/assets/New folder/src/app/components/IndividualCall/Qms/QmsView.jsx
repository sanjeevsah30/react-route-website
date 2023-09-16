import routes from "@constants/Routes/index";
import React, { createContext, useCallback, useState, useContext } from "react";
import { Link, Route, Switch, useHistory, useParams } from "react-router-dom";
import CreateQmsCall from "./CreateQmsCall";
import LeftArrowSvg from "app/static/svg/LeftArrowSvg";
import useHandleActiveCall from "../Hooks/useHandleActiveCall";
import { Button, Drawer, message } from "antd";
import QmsAuditSection from "./QmsAuditSection";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import config from "@constants/IndividualCall";

import {
    completeMeetingAudit,
    createMeetingScoreObjects,
} from "@store/auditSlice/auditSlice";
import apiErrors from "@apis/common/errors";
import { formatFloat } from "@tools/helpers";
import "../activeCallView.scss";
import { CommentOutlined, ShareAltOutlined } from "@ant-design/icons";
import QmsShare from "./QmsShare";
import QmsComment from "./QmsComment";
import SettingsSvg from "app/static/svg/SettingsSvg";
import { HomeContext } from "app/components/container/Home/Home";

export const QMSActiveCallContext = createContext();

export default function QmsView(props) {
    const tabClass = "individualcall-tabbar";
    const [id, setId] = useState(null);
    const { activeCall, setCall, isLoadingCall } = useHandleActiveCall({
        id,
    });
    const { canAccess } = useContext(HomeContext);

    const handleActiveQmsCallId = useCallback((id) => setId(id), [id]);
    const history = useHistory();
    const [open, setOpen] = useState(false);
    const [isCommentsVisible, setCommentsVisible] = useState(false);
    const [isShareVisible, setShareVisible] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [showUpdateShareModal, setShowUpdateShareModal] = useState(false);

    const [visible, setVisible] = useState(false);
    const handleClick = () => {
        setOpen(true);
        setCommentsVisible(true);
        setVisible(true);
    };
    const handleShareClick = () => {
        setShareVisible(true);
        setShowShare(true);
        setShowUpdateShareModal(true);
    };
    const onClose = () => {
        setVisible(false);
    };

    const {
        auditSlice: { manual_score, score_objects, audit_template },
    } = useSelector((state) => state);

    const [submitVisible, setSubmitModalVisible] = useState(false);
    const [auditStartTime, setAuditStartTime] = useState(null);

    const dispatch = useDispatch();

    const handleSubmit = useCallback(
        (payload) => {
            const { callId } = activeCall;
            setSubmitModalVisible(false);
            dispatch(
                completeMeetingAudit({
                    id: callId,
                    payload: {
                        ...payload,
                        template_id: audit_template?.id,
                        ...((manual_score?.data?.audit_time === null ||
                            manual_score?.data?.audit_time === undefined) &&
                            !!auditStartTime && {
                                audit_time:
                                    formatFloat(
                                        (new Date().getTime() -
                                            auditStartTime) /
                                            1000
                                    ) || 0,
                            }),
                    },
                    submit: true,
                })
            ).then(({ payload }) => {
                if (payload?.status !== apiErrors.AXIOSERRORSTATUS) {
                    // toggleAudit(false);
                    dispatch(
                        createMeetingScoreObjects({
                            id: activeCall.callId,
                            template_id: audit_template?.id,
                        })
                    );
                    message.success({
                        content: "Audit submitted successfully",
                        className: "toast-success",
                    });
                }
            });
        },
        [auditStartTime, manual_score?.data, activeCall]
    );
    return (
        <div className="flex column height100p">
            <div className="topbar flex alignCenter justifySpaceBetween flexShrink0">
                <div className="flex alignCenter font18 bold600 curPoint">
                    <span onClick={() => history.push(routes.CALLS)}>
                        <LeftArrowSvg />
                    </span>
                    <span className="marginL18">
                        {activeCall?.callName
                            ? activeCall?.callName
                            : id
                            ? ""
                            : "New Conversation"}
                    </span>
                </div>

                <div className="topbar_right_section flex">
                    {canAccess("QMS") ? (
                        <Link to={routes.settings.qms}>
                            <span className="marginR35">
                                <SettingsSvg
                                    style={{ transform: "scale(0.7)" }}
                                />
                            </span>
                        </Link>
                    ) : null}
                    <CommentOutlined
                        className="marginR35"
                        onClick={handleClick}
                    />
                    {/* <ShareAltOutlined
                        className="marginR35"
                        onClick={handleShareClick}
                    /> */}
                    <Button
                        onClick={() => {
                            const scoreObj = score_objects?.data.filter(
                                (s) => s.question_data.is_mandatory
                            );
                            if (
                                scoreObj.filter((s) =>
                                    s?.question_data.question_type === "none"
                                        ? s.notes?.length || s.media?.length
                                            ? false
                                            : true
                                        : false
                                ).length
                            )
                                return message.error({
                                    content:
                                        "Note is mandatory for this response",
                                    className: "audit-message",
                                });
                            if (
                                scoreObj.filter(
                                    (s) =>
                                        s?.question_data.question_type !==
                                            "none" && s.score_given === null
                                ).length
                            ) {
                                return message.error({
                                    content:
                                        "Please fill the Mandatory Questions!",
                                    className: "audit-message",
                                });
                            }
                            if (manual_score?.data?.status)
                                return handleSubmit();
                            const filter_objects = score_objects.data
                                .filter(
                                    (e) =>
                                        e?.question_data?.question_type !==
                                        "none"
                                )
                                .filter((e) => e?.score_given === null);
                            if (filter_objects.length)
                                setSubmitModalVisible(true);
                            else handleSubmit();
                        }}
                        className="submit_button"
                        style={{ borderRadius: 6 }}
                        type="primary"
                        // loading={loading}
                        disabled={!activeCall?.callId}
                    >
                        Submit Audit
                    </Button>
                </div>
            </div>
            <div
                className="flex1 flex column overflowYscroll paddingLR24 paddingTB20"
                style={{
                    gap: "24px",
                }}
                id="qms_call"
            >
                <QMSActiveCallContext.Provider
                    value={{ activeCall, setCall, isLoadingCall }}
                >
                    <CreateQmsCall />
                    <Switch>
                        <Route
                            path={[
                                `${routes.CALL}/qms/:id`,
                                `${routes.CHAT}/qms/:id`,
                            ]}
                            exact
                            render={() => (
                                <>
                                    <QmsAuditSection
                                        {...{
                                            handleActiveQmsCallId,
                                            handleSubmit,
                                            setAuditStartTime,
                                            auditStartTime,
                                            submitVisible,
                                            setSubmitModalVisible,
                                        }}
                                    />

                                    <Drawer
                                        visible={visible}
                                        closable={false}
                                        onClose={onClose}
                                        title={null}
                                        width={400}
                                        placement="right"
                                        style={{ padding: "0px" }}
                                    >
                                        <QmsComment
                                            isCommentsVisible={
                                                isCommentsVisible
                                            }
                                            onClose={onClose}
                                        />
                                    </Drawer>

                                    <QmsShare
                                        isShareVisible={isShareVisible}
                                        showShare={showShare}
                                        setShowShare={setShowShare}
                                        setShowUpdateShareModal={
                                            setShowUpdateShareModal
                                        }
                                        showUpdateShareModal={
                                            showUpdateShareModal
                                        }
                                    />
                                </>
                            )}
                        />
                    </Switch>
                </QMSActiveCallContext.Provider>
            </div>
        </div>
    );
}
