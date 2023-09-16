import React from "react";
import config from "@constants/Settings";
import Label from "@presentational/reusables/Label";
import { Input, Switch, Divider, Button, Radio, Space } from "antd";
import {
    CloseOutlined,
    CheckOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { Spinner } from "@reusables";

export default function RecordingAssistantUI(props) {
    const { TextArea } = Input;
    const loading = useSelector((state) => state.common.showLoader);
    const { IS_INTERNAL, IS_EXTERNAL, IS_HOST, IS_NOT_HOST, IS_BOTH, IS_NONE } =
        config.RECORDINGMANAGER;

    const getMeetingType = () => {
        if (props.recorder.is_internal && props.recorder.is_external)
            return IS_BOTH;
        if (props.recorder.is_internal) return IS_INTERNAL;
        if (props.recorder.is_external) return IS_EXTERNAL;
        return IS_NONE;
    };

    const getHostType = () => {
        if (props.recorder.is_host && props.recorder.is_not_host)
            return IS_BOTH;
        if (props.recorder.is_host) return IS_HOST;
        if (props.recorder.is_not_host) return IS_NOT_HOST;
        return IS_NONE;
    };

    const handleMettingTypeChange = (event) => {
        if (event.target.value === IS_BOTH) {
            props.recorderChangeHandler(
                "is_internal",
                true,
                "is_external",
                true
            );
        }
        if (event.target.value === IS_INTERNAL) {
            props.recorderChangeHandler(
                "is_internal",
                true,
                "is_external",
                false
            );
        }
        if (event.target.value === IS_EXTERNAL) {
            props.recorderChangeHandler(
                "is_external",
                true,
                "is_internal",
                false
            );
        }
        if (event.target.value === IS_NONE) {
            props.recorderChangeHandler(
                "is_external",
                false,
                "is_internal",
                false
            );
        }
    };

    const handleHostChange = (event) => {
        if (event.target.value === IS_BOTH) {
            props.recorderChangeHandler("is_host", true, "is_not_host", true);
        }
        if (event.target.value === IS_HOST) {
            props.recorderChangeHandler("is_host", true, "is_not_host", false);
        }
        if (event.target.value === IS_NOT_HOST) {
            props.recorderChangeHandler("is_not_host", true, "is_host", false);
        }
        if (event.target.value === IS_NONE) {
            props.recorderChangeHandler("is_not_host", false, "is_host", false);
        }
    };

    const handleAutoAdmit = (value) => {
        props.recorderChangeHandler("auto_admit", value);
    };

    const handleEmailMandatory = (value) => {
        props.botChangeHandler("client_email_mandatory", value);
    };

    const { role } = useSelector((state) => state.auth);

    const hasAccessToEdit = role?.code_names
        ?.find((e) => e.heading === "Recording Manager")
        ?.permissions?.["View Bot Settings"]?.edit.find(
            (e) => e.code_name === "bot.restrict_edit_bot_settings"
        )?.is_selected;

    return (
        <div
            className={
                "card user-settings-container recording-container settings"
            }
        >
            <Spinner loading={loading}>
                <div className={"recording-container-topsection"}>
                    <span className={"recording-container-topsection-heading"}>
                        {config.RECORDINGMANAGER.settingLabel}
                    </span>
                </div>
                <div className={"recording-container-bottomsection"}>
                    <div className="recording-container-bottomsection-selector settings">
                        <h4>{config.RECORDINGMANAGER.assistantLabel}</h4>
                        <div className="assistant-name">
                            <Label
                                label={config.RECORDINGMANAGER.assistantName}
                            />
                            <Input
                                disabled={!hasAccessToEdit}
                                size="default"
                                placeholder={"Enter assistant name"}
                                value={props.assistantName}
                                onChange={(e) =>
                                    props.botLocalHandler(
                                        "name",
                                        e.target.value
                                    )
                                }
                                onBlur={(e) => {
                                    props.botChangeHandler(
                                        "name",
                                        e.target.value
                                    );
                                }}
                            />
                        </div>
                        <div className="recording-announcement">
                            <span>Play recording announcement</span>{" "}
                            <Switch
                                disabled={!hasAccessToEdit}
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                checked={props.bot.play_announcement}
                                onChange={(val) =>
                                    props.botChangeHandler(
                                        "play_announcement",
                                        val
                                    )
                                }
                            />
                            <p>
                                <i>
                                    if enabled, the assistant will join and
                                    announce to participants that meetings are
                                    being recorded
                                </i>
                            </p>
                        </div>
                        {props.bot.play_announcement && (
                            <div className="assistant-name">
                                <Label
                                    label={
                                        config.RECORDINGMANAGER.announcementMsg
                                    }
                                />
                                <TextArea
                                    autoSize
                                    disabled={!hasAccessToEdit}
                                    placeholder={"Enter Announcement message"}
                                    value={props.announcement_text}
                                    onChange={(e) =>
                                        props.botLocalHandler(
                                            "announcement_text",
                                            e.target.value
                                        )
                                    }
                                    onBlur={(e) => {
                                        props.botChangeHandler(
                                            "announcement_text",
                                            e.target.value
                                        );
                                    }}
                                />
                            </div>
                        )}
                        <div className="recording-announcement">
                            <span>Auto admit Convin assistant</span>{" "}
                            <Switch
                                // disabled={!props.isAdmin}
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                checked={props.recorder?.auto_admit}
                                onChange={(val) => handleAutoAdmit(val)}
                            />
                            <p>
                                <i>
                                    if enabled,{" "}
                                    <a
                                        href="https://chrome.google.com/webstore/detail/convin-video-record-googl/ofbnlahcaoadmanmkmpjjclpjnmbonpa"
                                        target="__blank"
                                        className="primaryText"
                                    >
                                        convin extension
                                    </a>{" "}
                                    will auto admit Convin Assistant to the
                                    meeting.
                                </i>
                            </p>
                        </div>
                        <div className="recording-announcement">
                            <span>Client email mandatory</span>{" "}
                            <Switch
                                // disabled={!props.isAdmin}
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                checked={props.bot?.client_email_mandatory}
                                onChange={(val) => handleEmailMandatory(val)}
                            />
                            <p>
                                <i>
                                    if enabled, will auto fill the client email
                                    while adding bot
                                </i>
                            </p>
                        </div>
                    </div>
                    <div className="recording-container-bottomsection-selector settings">
                        <h4>{config.RECORDINGMANAGER.automaticLabel}</h4>
                        <div className="marginT5 marginB5">Which are</div>
                        <Radio.Group
                            onChange={handleMettingTypeChange}
                            value={getMeetingType()}
                        >
                            <Space direction="vertical">
                                <Radio value={IS_INTERNAL}>
                                    <span>Internal</span>
                                    <i> ( only include org employees )</i>
                                </Radio>
                                <Radio value={IS_EXTERNAL}>
                                    <span>External</span>
                                    <i>
                                        ( includes atleast 1 person outside org
                                        )
                                    </i>
                                </Radio>
                                <Radio value={IS_BOTH}>
                                    <span>Both</span>
                                </Radio>
                                {/* <Radio value={IS_NONE}>
                                    <span>None of the above</span>
                                </Radio> */}
                            </Space>
                        </Radio.Group>
                        <div className="marginT10 marginB5">Where I'm</div>
                        <Radio.Group
                            onChange={handleHostChange}
                            value={getHostType()}
                        >
                            <Space direction="vertical">
                                <Radio value={IS_HOST}>
                                    <span>Host</span>
                                </Radio>
                                <Radio value={IS_NOT_HOST}>
                                    <span>Not host</span>
                                </Radio>
                                <Radio value={IS_BOTH}>
                                    <span>Both</span>
                                </Radio>
                                {/* <Radio value={IS_NONE}>
                                    <span>None of the above</span>
                                </Radio> */}
                            </Space>
                        </Radio.Group>
                    </div>
                </div>
                {props.isOnSetup && (
                    <>
                        <Divider />
                        <section className={"recording-assistant-bottom"}>
                            <Button
                                icon={<ArrowRightOutlined />}
                                className="calendar-skip-button"
                                type={"link"}
                                onClick={() =>
                                    props.skipStep(
                                        config.RECORDINGMANAGER
                                            .ASSISTANT_SKIP_STEP
                                    )
                                }
                            >
                                Skip
                            </Button>
                            <Button
                                type={"primary"}
                                shape={"round"}
                                onClick={props.saveAssistantDetails}
                            >
                                Next
                            </Button>
                        </section>
                    </>
                )}
            </Spinner>
        </div>
    );
}
