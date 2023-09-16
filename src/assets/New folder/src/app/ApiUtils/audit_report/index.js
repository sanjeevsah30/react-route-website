import { getError } from "../common";
import { axiosInstance } from "@apis/axiosInstance";

export const getAuditorPerformance = (payload) => {
    return axiosInstance
        .post(`/stats/audit/overall/`, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getAuditorList = (payload, params) => {
    let endPoint = `/stats/auditor/list/`;
    return axiosInstance
        .post(endPoint, payload, { params })
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getTeamPerformanceDetails = (payload, id = 0) => {
    let endPoint = "/stats/audit/team/overall/";
    if (id) {
        endPoint = `/stats/audit/team/${id}/overall/`;
    }
    return axiosInstance
        .post(`${endPoint}`, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getTeamList = (payload) => {
    return axiosInstance
        .post(`/stats/audit/team/list/`, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getTopInsights = (payload, id) => {
    return axiosInstance
        .post(`/stats/audit/team/insight/${id}/`, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getCategoryInsights = (payload, id) => {
    return axiosInstance
        .post(`/stats/audit/team/category_insight/${id}/`, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getAgentWiseList = (payload, id, page = 1) => {
    let endPoint = `/stats/audit/team/${id}/agent/performance/`;
    if (page > 1) {
        endPoint = `${endPoint}?page=${page}`;
    }

    return axiosInstance
        .post(endPoint, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getAgentPerformanceDetails = (payload, id) => {
    return axiosInstance
        .post(`/stats/audit/team/agent/${id}/performance/`, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getCallWiseList = (payload, id, page = 1) => {
    let endPoint = `/stats/audit/team/agent/${id}/call_wise_details/`;
    if (page > 1) {
        endPoint = `${endPoint}?page=${page}`;
    }
    return axiosInstance
        .post(endPoint, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getAudiorGraph = (payload, id) => {
    return axiosInstance
        .post(`/stats/auditor/${id}/graph/`, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getAudiorCallWiseListApi = (payload, id, page) => {
    let endPoint = `/stats/auditor/${id}/call_wise_details/`;
    if (page > 1) {
        endPoint = `${endPoint}?page=${page}`;
    }
    return axiosInstance
        .post(endPoint, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const handleShareRequest = (url, payload) => {
    return axiosInstance
        .post(`${url}`, {
            ...payload,
        })
        .then((res) => res);
};

export const handleDownloadRequest = (url, payload) => {
    return axiosInstance
        .post(
            `${url}`,
            {
                ...payload,
            },
            Object.assign({ responseType: "arraybuffer" })
        )
        .then((res) => res);
};

export const handleDownloadGetRequest = (url, payload) => {
    return axiosInstance
        .get(`${url}`, Object.assign({ responseType: "arraybuffer" }))
        .then((res) => res);
};
