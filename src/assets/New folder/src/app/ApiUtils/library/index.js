import { getError } from "../common";
import { axiosInstance } from "@apis/axiosInstance";

const config = {
    category: "library/category/list/?all_library=true",
    meeting: "library/meeting/",
    meeting_update: "library/meeting/update/",
    shareFolder: "library/category/share/",
    createCategory: "library/category/create/",
    getFormResponses: "/coachings/assessment/",
};

export const getCategoriesAjx = (domain) => {
    return axiosInstance
        .get(`/${config.category}`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const createCategoryAjx = (domain, data) => {
    return axiosInstance
        .post(`/${config.createCategory}`, data)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const addNewMeetingAjx = (domain, data) => {
    return axiosInstance
        .post(`/${config.meeting}?category=${data.category}`, data)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getMeetingsAjx = (domain, category) => {
    return axiosInstance
        .get(`/${config.meeting}?category=${category}`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const updateMeetingAjx = (domain, data, id) => {
    return axiosInstance
        .patch(`/${config.meeting_update + id}/`, data)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const deleteMeetingAjx = (domain, id) => {
    return axiosInstance
        .delete(`/${config.meeting_update + id}/`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const shareFolderAjx = (domain, data) => {
    return axiosInstance
        .post(`/${config.shareFolder}`, data)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getFormResponses = (id) => {
    return axiosInstance
        .post(`/${config.getFormResponses}${id}/graph/`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};
