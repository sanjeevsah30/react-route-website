import React, { useState, useEffect } from "react";
import RecordingAssistantUI from "@presentational/Settings/RecordingAssistantUI";
import settingsConfig from "@constants/Settings";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import * as assistant from "@store/assistant/actions";
import commonConfig from "@constants/common";
import { cloneDeep } from "lodash";

export default function RecordingAssistant(props) {
    const dispatch = useDispatch();

    const bot = useSelector((state) => state.assistant.bot);
    const recorder = useSelector((state) => state.assistant.recorder);
    const [assistantName, setassistantName] = useState("");
    const [announcement_text, setannouncement_text] = useState("");

    useEffect(() => {
        dispatch(assistant.getBotSettings());
        dispatch(assistant.getRecorderSettings());
    }, []);

    useEffect(() => {
        setassistantName(bot.name);
        setannouncement_text(bot.announcement_text);
    }, [bot]);

    const saveAssistantDetails = () => {
        message.success("Details saved successfully");
        props.skipStep(settingsConfig.RECORDINGMANAGER.ASSISTANT_SKIP_STEP);
    };

    const assistantHandler = {
        botLocalHandler: (field, value) => {
            if (field === "name") {
                setassistantName(value);
            } else if (field === "announcement_text") {
                setannouncement_text(value);
            }
        },
        botChangeHandler: (field, value) => {
            let updatedBotSettings = cloneDeep(bot);
            updatedBotSettings[field] = value;
            dispatch(assistant.updateBotSettings(updatedBotSettings));
        },
        recorderChangeHandler: (field1, value1, field2, value2) => {
            let updatedRecorderSettings = cloneDeep(recorder);
            updatedRecorderSettings[field1] = value1;
            if (field2) updatedRecorderSettings[field2] = value2;
            dispatch(assistant.updateRecorderSettings(updatedRecorderSettings));
        },
    };

    return (
        <RecordingAssistantUI
            {...props}
            saveAssistantDetails={saveAssistantDetails}
            bot={bot}
            recorder={recorder}
            assistantName={assistantName}
            announcement_text={announcement_text}
            {...assistantHandler}
        />
    );
}
