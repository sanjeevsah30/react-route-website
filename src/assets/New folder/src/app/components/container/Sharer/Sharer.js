import React, { useState, useRef, useEffect } from "react";
import {
    Modal,
    Button,
    Input,
    Select,
    Switch,
    Typography,
    notification,
    Alert,
    InputNumber,
    Checkbox,
} from "antd";
import { shareMeeting } from "@apis/sharer/index";
import { useDispatch, useSelector } from "react-redux";
import apiErrors from "@apis/common/errors";
import { getAllUsers, openNotification } from "@store/common/actions";
import ShakaPlayer from "../../ShakaPlayer/ShakaPlayer";
import { getCallMedia } from "@apis/individual/index";
import SpeakerHeatMaps from "../../AddToLibrary/SpeakerHeatmaps";
import SettingsSvg from "app/static/svg/SettingsSvg";
import EmailSvg from "app/static/svg/EmailSvg";
import InfoSvg from "app/static/svg/InfoSvg";
import LinkSvg from "app/static/svg/LinkSvg";
import CloseSvg from "app/static/svg/CloseSvg";
import { TickSvg } from "app/static/svg/TickSvg";
import { getDuration } from "@tools/helpers";
import Spinner from "@presentational/reusables/Spinner";
import {
    fetchCallSnippets,
    setSnippetToUpdate,
    updateShareSnippet,
} from "@store/individualcall/actions";

const { TextArea } = Input;
const { Text } = Typography;

export default function Sharer(props) {
    const dispatch = useDispatch();
    const domain = useSelector((state) => state.common.domain);
    const users = useSelector((state) => state.common.users);
    const sharerRef = useRef(null);
    const [mailError, setmailError] = useState(false);
    const [isSharing, setisSharing] = useState(false);
    const [commentError, setcommentError] = useState(false);
    const [mediaUri, setMediaUri] = useState("");
    const [duration, setDuration] = useState([0, props.totalLength]);
    const [expireAfter, setExpireAfter] = useState(365);
    const [shareWithTranscript, setShareWithTranscript] = useState(true);
    const { id } = useSelector(({ auth }) => auth);
    const { setShowUpdateShareModal } = props;

    const { snippetToUpdate } = useSelector(
        ({ individualcall }) => individualcall
    );
    const { showLoader } = useSelector(({ common }) => common);

    useEffect(() => {
        if (props.config?.shareDuration) {
            setDuration(props.config?.shareDuration);
        }
    }, [props.config?.shareDuration]);

    useEffect(() => {
        if (snippetToUpdate) {
            setDuration([snippetToUpdate.start_time, snippetToUpdate.end_time]);

            setform({
                comment: snippetToUpdate.comment,
                email: "",
                isPublic: "true",
                publicUrl: snippetToUpdate.url,
            });

            navigator.clipboard.writeText(snippetToUpdate.url, 100);

            setShareWithTranscript(snippetToUpdate.share_with_transcript);

            setExpireAfter(
                getDuration(
                    new Date().toISOString(),
                    snippetToUpdate.valid_till
                ).split("d")?.[0] || 0
            );
        }
    }, [snippetToUpdate]);

    useEffect(() => {
        getCallMedia(domain, props.config.id).then((res) => {
            if (res.status !== apiErrors.AXIOSERRORSTATUS) {
                setMediaUri(res.location);
            }
        });
    }, [props.config.id]);

    useEffect(() => {
        if (!users?.length) {
            dispatch(getAllUsers());
        }
    }, []);

    const [form, setform] = useState({
        comment: "",
        emails: [],
        isPublic: false,
        publicUrl: "",
    });

    const onToggle = (checked) => {
        if (checked) {
            submitForm(true);
        } else {
            setform({
                ...form,
                isPublic: false,
                publicUrl: "",
            });
        }
    };

    const handleEmails = (email) => {
        if (validateEmail(email)) {
            setform({
                ...form,
                emails: [...form.emails, email],
            });
        } else {
            setmailError(true);
            setTimeout(() => {
                setmailError(false);
            }, 2000);
        }
    };

    const removeEmails = (email) => {
        let updatedMails = [...form.emails];
        let mailToRemove = updatedMails.findIndex((mail) => mail === email);
        updatedMails.splice(mailToRemove, 1);
        setform({
            ...form,
            emails: updatedMails,
        });
    };

    const validateEmail = (email) => {
        var re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const submitForm = (getPublic) => {
        let data = {
            meeting: props.config.id,
            comment: form.comment,
            emails: form.emails,
            start_time: duration[0] || 0,
            end_time: duration[1] || props.totalLength,
            expires_in: expireAfter,
            public: getPublic || form.isPublic,
            share_with_transcript: shareWithTranscript,
        };
        if (!getPublic) {
            // if (!form.comment) {
            //     setcommentError(true);
            //     setTimeout(() => {
            //         setcommentError(false);
            //     }, 2000);
            //     return;
            // } else
            if (!form.emails.length) {
                setmailError(true);
                setTimeout(() => {
                    setmailError(false);
                }, 2000);
                return;
            }
        } else {
            setisSharing(true);
        }
        shareMeeting(domain, data).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(fetchCallSnippets(props.config.id));
                if (getPublic) {
                    navigator.clipboard.writeText(res.url, 100);
                    dispatch(setSnippetToUpdate(res));
                    setform({
                        ...form,
                        publicUrl: res.url,
                        isPublic: getPublic,
                    });
                } else {
                    props.sharerHandler(0, false);
                    notification.success({
                        message: "Shared Successfully",
                    });
                }
            }
            setisSharing(false);
        });
    };

    const updateSnippet = () => {
        let data = {
            meeting: props.config.id,
            comment: form.comment,

            start_time: duration[0] || 0,
            end_time: duration[1] || props.totalLength,
            expires_in: expireAfter,

            share_with_transcript: shareWithTranscript,
        };
        dispatch(updateShareSnippet(snippetToUpdate.id, data));
    };

    const seekPlayerTo = (time) => {
        sharerRef.current.currentTime = time;
        sharerRef.current.play();
        const controlsContainerEl = document.querySelector(
            ".sharer_player .shaka-controls-container"
        );
        controlsContainerEl &&
            !controlsContainerEl.hasAttribute("shown") &&
            controlsContainerEl.setAttribute("shown", true);
    };

    return (
        <>
            {!props.isQms ? (
                <>
                    <Modal
                        id="sharer"
                        className={"sharer"}
                        width={1170}
                        title="Share Conversation"
                        style={{ top: "20px" }}
                        visible={props.config.visible}
                        onCancel={() => {
                            setShowUpdateShareModal(false);
                            dispatch(setSnippetToUpdate(null));
                            props.sharerHandler(0, false);
                        }}
                        footer={
                            snippetToUpdate ? (
                                <Button
                                    type="primary"
                                    className="borderRadius5"
                                    shape="default"
                                    onClick={updateSnippet}
                                >
                                    Update
                                </Button>
                            ) : null
                        }
                        closeIcon={
                            <CloseSvg
                                style={{
                                    color: "#666666",
                                }}
                            />
                        }
                    >
                        <Spinner loading={showLoader}>
                            <div className="player">
                                <div className="player-video">
                                    {props.callName && (
                                        <p className="call_title lineHightN">
                                            {props.callName}
                                        </p>
                                    )}
                                    <ShakaPlayer
                                        videoRef={sharerRef}
                                        uri={mediaUri}
                                        callId={props.config.id}
                                        customClass="sharer_player"
                                    />
                                    {props.totalLength && (
                                        <SpeakerHeatMaps
                                            classname="widthp100 maxWidthp100imp"
                                            monologues={props.monologues || {}}
                                            totalLength={props.totalLength}
                                            handleChange={(val) => {
                                                setDuration(val);
                                            }}
                                            snippetToUpdate={snippetToUpdate}
                                            seekPlayerTo={seekPlayerTo}
                                            duration={duration}
                                            config={props.config}
                                        />
                                    )}
                                </div>
                                <div className="details">
                                    <p className="details--heading">
                                        <SettingsSvg />
                                        <span className="font16">
                                            Share Settings
                                        </span>
                                    </p>
                                    <div className="marginB14 sharer__wrapper share__settings">
                                        <div className="flex alignCenter">
                                            <Checkbox
                                                checked={shareWithTranscript}
                                                onChange={(e) =>
                                                    setShareWithTranscript(
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                            <span className="marginL8 font14 bold600">
                                                Share with transcript&nbsp;
                                            </span>
                                        </div>
                                        <div className="flex alignCenter">
                                            <span className="font14 bold600">
                                                Expire link after&nbsp;
                                            </span>
                                            <InputNumber
                                                min={5}
                                                // max={10}
                                                value={expireAfter}
                                                className="sharer__expireAfter"
                                                onChange={(val) =>
                                                    setExpireAfter(val)
                                                }
                                            />
                                            <span className="marginL8 font14 bold600">
                                                days
                                            </span>
                                        </div>
                                    </div>
                                    <div className="sharer__withEmail">
                                        <p className="details--heading">
                                            <EmailSvg />
                                            <span className="font16">
                                                Share call with Email
                                            </span>
                                        </p>
                                        <div className="marginB26 sharer__wrapper">
                                            <p className="details--heading font16">
                                                Add Comment
                                            </p>
                                            <TextArea
                                                rows={2}
                                                placeholder={
                                                    "Write a comment..."
                                                }
                                                onBlur={({
                                                    target: { value },
                                                }) =>
                                                    setform({
                                                        ...form,
                                                        comment: value,
                                                    })
                                                }
                                                value={form.comment}
                                                onChange={({
                                                    target: { value },
                                                }) =>
                                                    setform({
                                                        ...form,
                                                        comment: value,
                                                    })
                                                }
                                                className="padding16"
                                            />
                                            {commentError && (
                                                <Alert
                                                    message="Comment field cannot be empty"
                                                    type="error"
                                                    showIcon
                                                />
                                            )}
                                            <div className="sharer__inputWrapper marginT20">
                                                <Select
                                                    mode="tags"
                                                    placeholder="Enter email and press enter"
                                                    // dropdownStyle={{ display: 'none' }}
                                                    onSelect={handleEmails}
                                                    onDeselect={removeEmails}
                                                    value={form.emails}
                                                    getPopupContainer={() =>
                                                        document.querySelector(
                                                            ".sharer .ant-select"
                                                        )
                                                    }
                                                >
                                                    {users.map((user) => (
                                                        <Select.Option
                                                            key={user.email}
                                                        >
                                                            {user?.first_name ||
                                                                user?.email}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                                <Button
                                                    key="submit"
                                                    className={"sharer__submit"}
                                                    type="primary"
                                                    onClick={() => {
                                                        submitForm(false);
                                                    }}
                                                    shape={"default"}
                                                >
                                                    Share Email
                                                </Button>
                                            </div>
                                            {mailError && (
                                                <Alert
                                                    message="Please enter a valid email id"
                                                    type="error"
                                                    showIcon
                                                    closable
                                                />
                                            )}
                                            <p className="stats-activity-help-text">
                                                <InfoSvg
                                                    style={{
                                                        color: "#666666",
                                                        marginTop: "2px",
                                                    }}
                                                />
                                                <span className="marginL10 dove_gray_cl lineHightN font14">
                                                    A public link will be shared
                                                    in an email with people
                                                    mentioned below.
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="sharer__withPublic">
                                        <p className="details--heading">
                                            <LinkSvg />
                                            <span className="font16 marginL12">
                                                Get a Shareable link
                                            </span>
                                        </p>
                                        <div className="sharer__wrapper">
                                            {form.isPublic && !isSharing ? (
                                                <>
                                                    <div className="flex alignCenter sharer__inputWrapper">
                                                        <Input
                                                            value={
                                                                form.publicUrl
                                                            }
                                                            className="flex1"
                                                        />
                                                        <Button
                                                            key="submit"
                                                            className={
                                                                "sharer__copy"
                                                            }
                                                            type="primary"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(
                                                                    form.publicUrl,
                                                                    100
                                                                );
                                                            }}
                                                            shape={"default"}
                                                        >
                                                            Copy Link
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="link-sharing">
                                                    <Text className="paddingL8">
                                                        Generate public link
                                                    </Text>
                                                    <Switch
                                                        onChange={onToggle}
                                                        loading={isSharing}
                                                    />
                                                </div>
                                            )}
                                            <p className="stats-activity-help-text">
                                                <InfoSvg
                                                    style={{
                                                        color: "#666666",
                                                        marginTop: "2px",
                                                    }}
                                                />
                                                <span className="marginL10 dove_gray_cl lineHightN font14">
                                                    Please note that public and
                                                    external links shared will
                                                    only be the part you select
                                                    here instead of full call.
                                                </span>
                                            </p>
                                        </div>
                                        {form.isPublic && !isSharing ? (
                                            <Alert
                                                message={
                                                    <div className="flex alignCenter justifyCenter">
                                                        <TickSvg
                                                            style={{
                                                                color: "#52C41A",
                                                                marginRight:
                                                                    "8px",
                                                            }}
                                                        />
                                                        <div>
                                                            Link has been copied
                                                            to clipboard
                                                        </div>
                                                    </div>
                                                }
                                                type="success"
                                                className="share_message_close"
                                            />
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Spinner>
                    </Modal>
                </>
            ) : (
                <>
                    {" "}
                    <Modal
                        id="sharer"
                        className="sharerQms "
                        centered
                        width={558}
                        title={!props.isQms ? "Share Conversation" : "Share"}
                        style={{ top: "20px" }}
                        visible={props.config.visible}
                        onCancel={() => {
                            setShowUpdateShareModal(false);
                            dispatch(setSnippetToUpdate(null));
                            props.sharerHandler(0, false);
                        }}
                        footer={
                            <Button
                                key="submit"
                                className={"sharer__submit"}
                                type="primary"
                                onClick={() => {
                                    submitForm(false);
                                }}
                                shape={"default"}
                            >
                                Share
                            </Button>
                        }
                        closeIcon={
                            <CloseSvg
                                style={{
                                    color: "#666666",
                                }}
                            />
                        }
                    >
                        <div>
                            <p className="font16 bold600 ">
                                Share link via Email
                            </p>
                            <div className="qms-share-box padding24">
                                <div className="sharer__inputWrapper ">
                                    <Select
                                        mode="tags"
                                        placeholder="Enter email and press enter"
                                        // dropdownStyle={{ display: 'none' }}
                                        onSelect={handleEmails}
                                        onDeselect={removeEmails}
                                        value={form.emails}
                                        getPopupContainer={() =>
                                            document.querySelector(
                                                ".sharer .ant-select"
                                            )
                                        }
                                    >
                                        {users.map((user) => (
                                            <Select.Option key={user.email}>
                                                {user?.first_name ||
                                                    user?.email}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </div>
                                {mailError && (
                                    <Alert
                                        message="Start typing name or Email Addresses"
                                        type="error"
                                        showIcon
                                        closable
                                    />
                                )}
                                <p className="">
                                    <InfoSvg
                                        style={{
                                            color: "#666666",
                                            marginTop: "2px",
                                            transform: "scale(0.8)",
                                        }}
                                    />
                                    <span className="marginL5 dove_gray_cl font14 bold400">
                                        A sharable link will be shared in an
                                        email with selected recipients
                                    </span>
                                </p>
                                <p className="font16 bold600 marginT30">
                                    Additional Comment
                                </p>

                                <TextArea
                                    rows={2}
                                    placeholder={"Write a comment..."}
                                    onBlur={({ target: { value } }) =>
                                        setform({
                                            ...form,
                                            comment: value,
                                        })
                                    }
                                    value={form.comment}
                                    onChange={({ target: { value } }) =>
                                        setform({
                                            ...form,
                                            comment: value,
                                        })
                                    }
                                    className="padding16"
                                />
                                {commentError && (
                                    <Alert
                                        message="Comment field cannot be empty"
                                        type="error"
                                        showIcon
                                    />
                                )}
                            </div>
                        </div>
                    </Modal>
                </>
            )}
        </>
    );
}
