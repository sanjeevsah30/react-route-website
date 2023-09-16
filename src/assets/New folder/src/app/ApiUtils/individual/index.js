// APIs for the Individual Calls

import config from "./config";
import { getError } from "../common";
import apiErrors from "@apis/common/errors";
import { openNotification } from "@store/common/actions";
import { saveAs } from "file-saver";
import { axiosInstance } from "@apis/axiosInstance";

export const getCallTranscript = (domain, callId) => {
    if (domain && callId) {
        return axiosInstance
            .get(`/${config.MEETINGS}/${config.TRANSCRIPT}/${callId}/`)
            .then((res) => res.data)
            .catch((err) => getError(err));
    }
};

export const getCallMedia = (domain, callId) => {
    if (domain && callId) {
        return axiosInstance
            .get(`/${config.MEETINGS}/${config.MEDIA}/${callId}/`)
            .then((res) => res.data)
            .catch((err) => getError(err));
    }
};

export const updateTranscript = (domain, callId, data) => {
    return axiosInstance
        .patch(
            `/${config.MEETINGS}/${config.TRANSCRIPT}/update/${callId}/`,
            data
        )
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export function handleDownloadTranscript(domain, callId) {
    axiosInstance
        .get(`/meeting/meeting/streaming-transcript/${callId}/`)
        .then((response) => {
            var blob = new Blob([response.data], {
                type: "text/plain;charset=utf-8",
            });

            saveAs(
                blob,
                `${
                    response.headers?.["content-disposition"]
                        .split("filename=")[1]
                        .split(";")[0]
                        .split('"')[1]
                }`
            );
        })
        .catch((err) => {
            const { status, message } = getError(err);
            if (status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", message);
            }
        });
}

export const getLeadScoreInsightsApi = (domain, callid) => {
    return axiosInstance
        .get(`/audit/lead_score/detail/${callid}/`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const fetchAccountAuditApi = (domain, id, next) => {
    return axiosInstance
        .post(`/account/ai_score/${id}/`, {})
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const fetchCallCommentsApi = (domain, id, next) => {
    const url = next || `/meeting/meeting/edit/comment/${id}/`;
    return axiosInstance
        .get(url)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const createCallCommentsApi = (domain, id, payload) => {
    return axiosInstance
        .post(`/meeting/meeting/edit/comment/${id}/`, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const createCallMediaCommentsApi = (domain, id, payload) => {
    return axiosInstance
        .post(`/meeting/meeting/edit/comment/${id}/`, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const updateCallCommentsApi = (domain, id, payload) => {
    return axiosInstance
        .patch(`/calendar/comment/${id}/`, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const fetchCallCommentReplyApi = (domain, id, next) => {
    const url = next || `/account/comment/${id}/replies/`;
    return axiosInstance
        .get(url)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const deleteCallCommentApi = (domain, id) => {
    return axiosInstance
        .delete(`/calendar/comment/${id}/`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const handleDownloadVideo = (src) => {
    axiosInstance
        .get(src)
        .then((response) => {
            var blob = new Blob([response.data], {
                type: "binary/octet-stream",
            });

            saveAs(blob, "name.mp4");
        })
        .catch((err) => {
            const { status, message } = getError(err);
            if (status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", message);
            }
        });
};

export const fetchCallSnippetsApi = (domain, id, next) => {
    const url = next || `/share/snippet/list/?meeting_id=${id}`;
    return axiosInstance
        .get(url)
        .then((res) => res.data)
        .catch((err) => getError(err));
};
export const getSnippetToUpdateApi = (domain, id) => {
    const url = `/share/snippet/${id}/`;
    return axiosInstance
        .get(url)
        .then((res) => res.data)
        .catch((err) => getError(err));
};
export const deleteCallSnippetsApi = (domain, id) => {
    const url = `/share/snippet/${id}/`;
    return axiosInstance
        .delete(url)
        .then((res) => res.data)
        .catch((err) => getError(err));
};
export const updateShareSnippetApi = (domain, id, payload) => {
    const url = `/share/snippet/${id}/`;
    return axiosInstance
        .patch(url, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getTagedTranscripts = (domain, id) => {
    const url = `/audit/tag_snippets/${id}/`;
    return axiosInstance
        .get(url)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const createTagedTranscripts = (domain, payload) => {
    const url = `/audit/tag_snippets/create/`;
    return axiosInstance
        .post(url, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const updateTagedTranscripts = (domain, id, payload) => {
    const url = `/audit/tag_snippets/${id}/`;
    return axiosInstance
        .patch(url, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const acknowledgeRaiseDisputeApi = (domain, id, payload) => {
    const url = `/audit/${id}/status/`;
    return axiosInstance
        .post(url, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};
