import { Alert, Button, Input, Modal, Select, Tooltip } from "antd";
import React, { useState, useEffect } from "react";

import CircularProgress from "./CircularProgress";
// import { AudioOutlined } from '@ant-design/icons';
import callsConfig from "@constants/MyCalls/index";
import { botJoinCall, checkBotActive } from "@store/calls/actions";
import { useDispatch, useSelector } from "react-redux";

import "./joinCall.scss";
import TopbarConfig from "@constants/Topbar/index";

// icons imports
import RecordSvg from "app/static/svg/RecordSvg";
import CloseSvg from "app/static/svg/CloseSvg";
import ConvinLogoSvg from "app/static/svg/ConvinLogoSvg";
import GoogleMeetSvg from "app/static/svg/GoogleMeetSvg";
import ZoomSvg from "app/static/svg/ZoomSvg";
import MSTeamsSvg from "app/static/svg/MSTeamsSvg";

import { openNotification } from "../../../store/common/actions";
import { uid } from "@tools/helpers";
import * as assistant from "@store/assistant/actions";

export default function JoinCall(props) {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [clientList, setClientList] = useState([]);

    const [callLink, setCallLink] = useState("");
    const [callName, setCallName] = useState("");

    const [error, setError] = useState("");
    const [botJoin, setBotJoin] = useState(false);

    const [timeUp, setTimeUp] = useState(false);
    const [timer, setTimer] = useState(null);

    const {
        assistant: { bot },
    } = useSelector((state) => state);

    useEffect(() => {
        dispatch(assistant.getBotSettings());
    }, []);

    const handlers = {
        validateUrl: (value) => {
            return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
                value.trim()
            );
        },
        closePopup: () => {
            setShowModal(false);
            !botJoin && setCallLink("");
            !botJoin && setCallName("");
            setError("");
            setIconType("");

            if (botJoin && timeUp) {
                setTimeUp(false);
            }
            setBotJoin(false);
            setCallLink("");
            setCallName("");
            setClientList([]);
        },
    };

    // states for time handling

    const handleBotJoin = () => {
        if (handlers.validateUrl(callLink)) {
            const clientListArr = clientList.map((client) => client.label);
            dispatch(botJoinCall(callLink, callName, clientListArr)).then(
                (res) => {
                    if (
                        res &&
                        res.message === "Conferencing tool not supported"
                    ) {
                        handlers.closePopup();
                        return;
                    }
                    if (res) {
                        openNotification(
                            "success",
                            "Success",
                            "Bot successfully joined the call"
                        );
                        handlers.closePopup();
                        setTimer(300);
                    } else {
                        dispatch(checkBotActive(callLink)).then((res) => {
                            if (res) {
                                setCallLink(res?.link?.length ? res.link : "");
                                setCallName(
                                    res?.title?.length ? res.title : ""
                                );

                                let currTime = new Date().getTime() / 1000;
                                let createdAt =
                                    new Date(res.created).getTime() / 1000;
                                let remainingTime = Math.floor(
                                    createdAt + 300 - currTime
                                );

                                setTimer(
                                    remainingTime >= 0 ? remainingTime : 0
                                );
                                setBotJoin(true);
                            }
                        });
                    }
                }
            );
        } else {
            setError("Please enter a valid URL.");
        }
    };

    // check for emptiness
    const onAlertClose = () => {
        setError("");
        setCallLink("");
        setCallName("");
        setIconType("");
        setClientList([]);
    };

    //set dyanmic icons
    const [iconType, setIconType] = useState("");

    const callLinkHandler = (e) => {
        let callLink = e.target.value?.trim();
        if (callLink) {
            if (callLink.includes("zoom.us")) {
                setIconType("zoom");
            } else if (callLink.includes("meet.google.com")) {
                setIconType("gmeet");
            } else if (callLink.includes("teams.microsoft.com")) {
                setIconType("teams");
            } else {
                setIconType("");
            }
        }

        setCallLink(callLink);
    };

    const validateEmail = (email) => {
        var re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const handleEmails = (email) => {
        const temp = email
            .replace(/[,()':;]/g, " ")
            .replace(/\s+/g, " ")
            .split(" ");
        if (temp[0].length <= 1) return;
        if (clientList.findIndex((client) => client.label == temp[0]) == -1)
            setClientList([...clientList, { label: temp[0], value: uid() }]);
        else {
            setError(`${temp[0]} already present`);
        }
    };

    const planetsparkHandleEmail = (email) => {
        const temp = email
            .replace(/[,()':;]/g, " ")
            .replace(/\s+/g, " ")
            .split(" ");
        if (email === "") setClientList([]);
        else setClientList(temp);
    };

    const removeEmails = (email) => {
        let updatedMails = [...clientList];
        let mailToRemove = updatedMails.findIndex(
            (mail) => mail.value === email
        );
        updatedMails.splice(mailToRemove, 1);
        setClientList(updatedMails);
    };

    useEffect(() => {
        if (callLink) {
            if (callLink.includes("zoom.us")) {
                setIconType("zoom");
            } else if (callLink.includes("meet.google.com")) {
                setIconType("gmeet");
            } else if (callLink.includes("teams.microsoft.com")) {
                setIconType("teams");
            } else {
                setIconType("");
            }
        }
    }, [showModal]);

    const { domain, versionData } = useSelector((state) => state.common);

    return (
        <>
            <Modal
                visible={showModal}
                title={
                    <div className="modal-header">
                        {versionData.logo ? <></> : <ConvinLogoSvg />}

                        <p>Record Call</p>
                    </div>
                }
                onOk={handlers.closePopup}
                onCancel={handlers.closePopup}
                width={560}
                footer={
                    <div className="modal-footer">
                        {!botJoin ? (
                            <Button
                                key="submit"
                                className={"joinCall-upload borderRadius5"}
                                type="primary"
                                onClick={handleBotJoin}
                                disabled={
                                    bot.client_email_mandatory
                                        ? callLink.length === 0 ||
                                          clientList?.length === 0
                                        : callLink.length === 0
                                }
                            >
                                {callsConfig.JOIN_CALL.uploadCtaLabel}
                            </Button>
                        ) : !timeUp ? (
                            <CircularProgress
                                setTimeUp={setTimeUp}
                                timer={timer}
                                setTimer={setTimer}
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                }
                className="homepage_modal"
                closeIcon={<CloseSvg />}
            >
                {!botJoin ? (
                    <form
                        className="joincall-form"
                        onSubmit={props.handleBotJoin}
                    >
                        <div className={"joinCall-container"}>
                            <div className={"joinCall-container-link"}>
                                <div
                                    className={
                                        "joinCall-link joinCall-modal-section"
                                    }
                                >
                                    <div className={`call_link_container`}>
                                        <div className="call_link">
                                            <p>Call Link*</p>
                                            <Input
                                                value={callLink}
                                                onChange={callLinkHandler}
                                                placeholder="Paste Call Link Here..."
                                            />
                                        </div>
                                        <p
                                            style={{
                                                fontSize: "20px",
                                                color: "#999999",
                                            }}
                                        >
                                            |
                                        </p>
                                        <div className="link_type">
                                            {iconType === "gmeet" && (
                                                <GoogleMeetSvg />
                                            )}
                                            {iconType === "zoom" && <ZoomSvg />}
                                            {iconType === "teams" && (
                                                <MSTeamsSvg />
                                            )}
                                        </div>
                                    </div>

                                    <div className={`call_link_container`}>
                                        <div className="call_link">
                                            <p>Call Name</p>
                                            <Input
                                                value={callName}
                                                onChange={(evt) => {
                                                    setCallName(
                                                        evt.target.value
                                                    );
                                                }}
                                                placeholder="Call Name"
                                            />
                                        </div>
                                    </div>
                                    {domain?.toLowerCase() === "planetspark" ? (
                                        <div className="call_link_container marginT15">
                                            <div className="call_link">
                                                <p>
                                                    Client emails or phone
                                                    numbers*
                                                </p>
                                                <Input
                                                    value={clientList}
                                                    onChange={(e) => {
                                                        // setClientEmailValue(e.target.value)
                                                        planetsparkHandleEmail(
                                                            e.target.value
                                                        );
                                                    }}
                                                    placeholder="Enter email and press enter"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="clients_email_container marginT15">
                                            <p>
                                                Client emails or phone numbers
                                            </p>
                                            <Select
                                                mode="tags"
                                                placeholder="Enter email and press enter"
                                                onSelect={handleEmails}
                                                onKeyPress={(event) => {
                                                    if (
                                                        event.code === "Space"
                                                    ) {
                                                        event.preventDefault();
                                                        return false;
                                                    }
                                                }}
                                                onDeselect={removeEmails}
                                                value={clientList}
                                                className="email width100p"
                                                dropdownStyle={{
                                                    display: "none",
                                                }}
                                                size="large"
                                            ></Select>
                                        </div>
                                    )}
                                    {error && (
                                        <Alert
                                            message={error}
                                            type="error"
                                            onClose={onAlertClose}
                                            closable
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="bot_joined_modal flexCC">
                        {timeUp ? (
                            <p>
                                <strong>Bot</strong> has joined the meeting.
                            </p>
                        ) : (
                            <p>
                                <strong>Bot</strong> inititated. Please wait...
                            </p>
                        )}
                        <div className={`bot_joined_link`}>
                            <a href={callLink} target="_blank">
                                {callLink}
                            </a>
                            <div className="meet_type">
                                <p>|</p>
                                {iconType === "gmeet" && <GoogleMeetSvg />}
                                {iconType === "zoom" && <ZoomSvg />}
                                {iconType === "teams" && <MSTeamsSvg />}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
            <Tooltip title={TopbarConfig.SCHEDULETEXT} placement="bottomRight">
                <Button
                    className="record-call"
                    shape="round"
                    icon={<RecordSvg />}
                    type="link"
                    onClick={() => setShowModal(true)}
                />
            </Tooltip>
        </>
    );
}
