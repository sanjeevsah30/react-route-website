import { axiosInstance } from "@apis/axiosInstance";
import apiConfigs from "@apis/common/commonApiConfig";
import { getError } from "@apis/common/index";

export const fetcAccountsListApi = (domain, payload, next) => {
    const url = next?.split(".ai")?.[1] || `/account/list_all/`;
    return axiosInstance
        .post(url, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const fetchAccoountDetailsApi = (domain, id) => {
    return axiosInstance
        .get(`/account/detail/${id}/`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const fetchAccountCallsAndEmailsApi = (domain, id, next, payload) => {
    const url = next?.split(".ai")?.[1] || `/account/meeting/list/`;
    return axiosInstance
        .post(url, { search_data: payload })
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const fetchAccountGraphApi = (domain, id, next) => {
    return axiosInstance
        .post(`/account/${id}/graph/`, {
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const fetchAccountAuditApi = (domain, id, next) => {
    return axiosInstance
        .post(`/account/ai_score/${id}/`, {})
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const fetchAccountCommentsApi = (domain, id, next) => {
    const url = next?.split(".ai")?.[1] || `/account/edit/comment/${id}/`;
    return axiosInstance
        .get(url)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const createAccountCommentsApi = (domain, id, payload) => {
    return axiosInstance
        .post(`/account/edit/comment/${id}/`, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const createMediaAccountCommentsApi = (domain, id, payload) => {
    return axiosInstance
        .post(`/account/edit/comment/${id}`, payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const updateAccountCommentsApi = (domain, id, payload) => {
    return axiosInstance
        .patch(`/calendar/comment/${id}/`, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const fetchAccountCommentReplyApi = (domain, id, next) => {
    const url = next?.split(".ai")?.[1] || `/account/comment/${id}/replies/`;
    return axiosInstance
        .get(url)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const deleteAccountCommentApi = (domain, id) => {
    return axiosInstance
        .delete(`/calendar/comment/${id}/`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const fetchAuditTemplateQuestionsAccountsApi = (domain, id) => {
    return axiosInstance
        .get(`/audit/template/${id}/questions/`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const fetchAccountTagsApi = (domain, id) => {
    return axiosInstance
        .get("/meeting/account_tags/list_all/")
        .then((res) => {
            return res.data;
        })
        .catch((err) => getError(err));
};

export const fetchAccountsStageApi = (domain) => {
    return axiosInstance
        .get(`/account/stage/`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};
export const fetchLeadScoreAuditApi = (domain, id) => {
    return axiosInstance
        .post(`/account/lead_score/${id}/`, {})
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getAccountLeadScoreObjectsApi = (domain) => {
    return axiosInstance
        .get(`/audit/lead_score/`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};
