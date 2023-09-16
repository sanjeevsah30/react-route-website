import { getError } from "../common";
import { axiosInstance } from "@apis/axiosInstance";

const config = {
    share: "share/share_meeting/",
    shareCall: "share/meetings/",
    shareAnalytics: "share/meetings/",
    getMeeting: "share/preview_meeting/",
    getMeetingMedia: "share/stream_media/",
};

export const shareMeeting = (domain, data) => {
    return axiosInstance
        .post(`/${config.share}`, data)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const shareCall = (domain, payload) => {
    return axiosInstance.post(`/${config.shareCall}`, payload);
};
export const shareAnalytics = (domain, payload) => {
    return axiosInstance.post(`/${config.shareAnalytics}`, payload);
};

export const getSharedMeeting = (domain, id) => {
    return axiosInstance
        .get(`/${config.getMeeting}?share_id=${id}`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getSharedMeetingMedia = (domain, id) => {
    const endpoint = `/${config.getMeetingMedia}?share_id=${id}`;
    return axiosInstance
        .get(endpoint)
        .then((res) => res.data)
        .catch((err) => getError(err));
};
