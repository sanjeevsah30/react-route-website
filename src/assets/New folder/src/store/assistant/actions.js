import * as types from "./types";
import apiErrors from "@apis/common/errors";
import { setLoader, openNotification } from "../common/actions";
import * as botApis from "@apis/recorder/index";

function storeBotSettings(bot) {
    return {
        type: types.STORE_BOT_SETTINGS,
        bot,
    };
}

function storeRecorderSettings(recorder) {
    return {
        type: types.STORE_RECORDER_SETTINGS,
        recorder,
    };
}

export function getBotSettings() {
    return (dispatch, getState) => {
        dispatch(setLoader(true));
        botApis.getBotSettingsAjx(getState().common.domain).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(storeBotSettings(res));
            }
            dispatch(setLoader(false));
        });
    };
}

export function updateBotSettings(data) {
    return (dispatch, getState) => {
        dispatch(setLoader(true));
        botApis
            .updateBotSettingsAjx(getState().common.domain, data)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    dispatch(storeBotSettings(res));
                }
                dispatch(setLoader(false));
            });
    };
}

export function getRecorderSettings() {
    return (dispatch, getState) => {
        dispatch(setLoader(true));
        botApis.getRecorderSettingsAjx(getState().common.domain).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(storeRecorderSettings(res));
            }
            dispatch(setLoader(false));
        });
    };
}

export function updateRecorderSettings(data) {
    return (dispatch, getState) => {
        dispatch(setLoader(true));
        botApis
            .updateRecorderSettingsAjx(getState().common.domain, data)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    dispatch(storeRecorderSettings(res));
                }
                dispatch(setLoader(false));
            });
    };
}
