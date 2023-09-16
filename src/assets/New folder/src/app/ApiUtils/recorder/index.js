import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "../common";

const config = {
    bot: "bot/bot/configure/",
    recorder: "bot/bot/recordsettings/",
};

export const getBotSettingsAjx = (domain) => {
    return axiosInstance
        .get(`/${config.bot}`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const updateBotSettingsAjx = (domain, botData) => {
    return axiosInstance
        .patch(`/${config.bot}`, botData)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getRecorderSettingsAjx = (domain) => {
    return axiosInstance
        .get(`/${config.recorder}`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const updateRecorderSettingsAjx = (domain, recorderData) => {
    return axiosInstance
        .patch(`/${config.recorder}`, recorderData)
        .then((res) => res.data)
        .catch((err) => getError(err));
};
