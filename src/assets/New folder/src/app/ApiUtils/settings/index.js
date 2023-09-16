// API Utils for Settings.
import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "../common";
import config from "./config";
import { message } from "antd";

export const getDesignations = (domain = "") => {
    if (domain) {
        const endpoint = `/${config.GETDESIGNATIONS}/`;

        return axiosInstance
            .get(endpoint)
            .then((res) => res.data)
            .catch((error) => getError(error));
    }
};

export const changeDesignation = (domain = "", userId = 0, role = 0) => {
    if (domain) {
        const payload = { role };
        const endpoint = `/${config.PERSONS}/${config.RETRIEVEUPDATE}/${userId}`;

        return axiosInstance
            .patch(endpoint, payload)
            .then((res) => res.data)
            .catch((err) => getError(err));
    }
};

export const changeUserActiveAjx = (
    domain = "",
    userId = 0,
    newActive = true
) => {
    if (domain) {
        const endpoint = `/${config.PERSONS}/${config.RETRIEVEUPDATE}/${userId}`;
        const payload = { is_active: newActive };

        return axiosInstance
            .patch(endpoint, payload)
            .then((res) => res.data)
            .catch((err) => getError(err));
    }
};

export const changeUserManagerAjx = (
    domain = "",
    userId = 0,
    manager = null
) => {
    if (domain) {
        const endpoint = `/${config.PERSONS}/${config.RETRIEVEUPDATE}/${userId}`;
        const payload = { manager: manager };

        return axiosInstance
            .patch(endpoint, payload)
            .then((res) => res.data)
            .catch((err) => getError(err));
    }
};

export const updateTeam = (domain = "", userId = 0, newTeamId = 0) => {
    if (domain) {
        const endpoint = `/${config.PERSONS}/${config.RETRIEVEUPDATE}/${userId}`;
        const payload = { team: newTeamId };

        return axiosInstance
            .patch(endpoint, payload)
            .then((res) => res.data)
            .catch((err) => getError(err));
    }
};

export const updateUserType = (domain = "", userId = 0, user_type = 0) => {
    if (domain) {
        const endpoint = `/${config.PERSONS}/${config.RETRIEVEUPDATE}/${userId}`;
        const payload = { user_type };

        return axiosInstance
            .patch(endpoint, payload)
            .then((res) => res.data)
            .catch((err) => getError(err));
    }
};

export const updateUserApi = (domain = "", userId = 0, payload) => {
    if (domain) {
        const endpoint = `/${config.PERSONS}/${config.RETRIEVEUPDATE}/${userId}`;
        return axiosInstance
            .patch(endpoint, payload)
            .then((res) => res.data)
            .catch((err) => getError(err));
    }
};

export const getPageUsers = (domain = "", offset = 0) => {
    if (domain) {
        return axiosInstance
            .get(
                `/${config.LISTALLUSERS}/?limit=${config.LIMIT}&offset=${
                    offset * config.LIMIT
                }`
            )
            .then((res) => res.data)
            .catch((err) => getError(err));
    }
};

export const getAvailableSubscriptionsApi = (domain) => {
    if (domain) {
        return axiosInstance
            .get(`/subscription/available-subscriptions/`)
            .then((res) => res.data)
            .catch((err) => getError(err));
    }
};
export const getAvailableCrmSheetsApi = (domain) => {
    if (domain) {
        return axiosInstance
            .get(`/tpauth/list_crm_sheets/ `)
            .then((res) => res.data)
            .catch((err) => getError(err));
    }
};

export const setDefaultCrmSheetApi = (domain, payload = {}) => {
    if (domain) {
        return axiosInstance
            .patch(`/tpauth/update/crm_sheet/`, {
                ...payload,
            })
            .then((res) => res.data)
            .catch((err) => getError(err));
    }
};

export const getVoicePrintCsvApi = (domain, payload = {}) => {
    if (domain) {
        return axiosInstance
            .get(config.VOICEPRINTCSV, { responseType: "blob", ...payload })
            .then((res) => res)
            .catch((err) => getError(err));
    }
};

export const uploadVoicePrintCsvApi = (domain, payload = {}) => {
    if (domain) {
        return axiosInstance
            .post(config.VOICEPRINTCSV, payload, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => res.data)
            .catch((err) => getError(err));
    }
};

export const getVoicePrintUploadStatusApi = (domain, payload = {}) => {
    if (domain) {
        return axiosInstance
            .get(config.VOICEPRINTCSV, { ...payload })
            .then((res) => res.data)
            .catch((err) => getError(err));
    }
};

export const createSamplingRuleApi = async (domain, payload = {}) => {
    if (domain) {
        return axiosInstance
            .post(`${config.SAMPLINGRULE}/create/`, { ...payload })
            .then((res) => res.data)
            .catch((err) => getError(err));
    }
};

export const getSamplingRulesApi = (domain) => {
    if (domain) {
        return axiosInstance
            .get(`${config.SAMPLINGRULE}/list_all/`)
            .then((res) => res.data)
            .catch((err) => getError(err));
    }
};

export const getSamplingRuleApi = (domain, id) => {
    if (domain && id) {
        return axiosInstance
            .get(`${config.SAMPLINGRULE}/${id}/`)
            .then((res) => res.data)
            .catch((err) => getError(err));
    }
};

export const editSamplingRuleApi = (domain, id, payload = {}) => {
    if (domain) {
        return axiosInstance
            .put(`${config.SAMPLINGRULE}/${id}/`, { ...payload })
            .then((res) => res.data)
            .catch((err) => getError(err));
    }
};

export const deleteSamplingRuleApi = (domain, id) => {
    if (domain) {
        return axiosInstance
            .delete(`${config.SAMPLINGRULE}/${id}/`)
            .then((res) => res.data)
            .catch((err) => getError(err));
    }
};

export const getSampledCalls = (domain, id, next) => {
    if (domain) {
        return axiosInstance
            .get(next || `${config.SAMPLINGRULE}/calls/${id}/`)
            .then((res) => res.data)
            .catch((err) => getError(err));
    }
};

export const resetUserPassword = (payload) => {
    return axiosInstance
        .post(`${config.RESETUSERPASSWORD}`, payload)
        .then((res) => {
            const data = res.data;
            message.success({
                content: `Password changed successfully`,
                className: "toast-dark",
            });
            return data;
        })
        .catch((err) => {
            const error = getError(err);
            message.error({
                content: `Failed to reset password`,
                className: "toast-dark",
            });
            throw error;
        });
};
