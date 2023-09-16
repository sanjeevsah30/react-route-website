import axios from "axios";
import apiConfigs from "../common/commonApiConfig";
import { getAuthHeader, getError } from "../common";
import { axiosInstance } from "@apis/axiosInstance";

export const getCoachingSessions = (domain) => {
    return axiosInstance
        .get(`/coachings/coaching/`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const getOneSession = (domain, payload) => {
    return axiosInstance
        .get(`/coachings/coaching/${payload}/`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const getModule = (domain, payload) => {
    return axiosInstance
        .post(`/coachings/coaching/module/${payload.module_id}/`, {
            reps_id: payload.reps_id,
        })
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const getClip = (domain, payload) => {
    return axios
        .get(`/coachings/clip/${payload}/`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const setClipStatus = (domain, payload, id) => {
    return axiosInstance
        .patch(`/coachings/clip/${id}/`, payload)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};
