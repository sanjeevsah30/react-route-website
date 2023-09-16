import { getError } from "../common";
import { axiosInstance } from "@apis/axiosInstance";

const config = {
    manager: "feedback/feedbackquestion/",
    update: "feedback/feedbackquestion/update/",
    feedback: "feedback/feedback/",
    feedback_update: "feedback/feedback/update/",
    feedback_categories: "feedback/feedbackcategory/",
    feedback_category_create: "/feedback/feedbackcategory/create/",
};

export const createFeedbackQuestion = (domain, data) => {
    return axiosInstance
        .post(`/${config.manager}`, data)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const editFeedbackQuestion = (domain, data, id) => {
    return axiosInstance
        .patch("/" + config.update + id + "/", data)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const deleteQuestion = (domain, id) => {
    return axiosInstance
        .delete("/" + config.update + id + "/")
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getAllQuestions = (domain, id) => {
    return axiosInstance
        .get(`/${config.manager}?feedback_category=${id}`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getFeedbacks = (domain, meeting_id, owner, question, category) => {
    let endpoint = `/${config.feedback}?meeting=${meeting_id}`;
    endpoint = owner ? `${endpoint}&owner=${owner}` : endpoint;
    endpoint = question ? `${endpoint}&question=${question}` : endpoint;
    endpoint = category
        ? `${endpoint}&feedback_category=${category}`
        : endpoint;
    return axiosInstance
        .get(endpoint)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const createFeedback = (domain, data) => {
    return axiosInstance
        .post(`/${config.feedback}`, data)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const updateFeedback = (domain, data, id) => {
    return axiosInstance
        .patch(`/${config.feedback_update}${id}/`, data)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const fetchFbCategoriesAjx = (domain, meetingId) => {
    let endpoint = `/${config.feedback_categories}`;
    if (meetingId) {
        endpoint = `${endpoint}?meeting_id=${meetingId}`;
    }
    return axiosInstance
        .get(endpoint)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const createFbCategoryAjx = (domain, data) => {
    return axiosInstance
        .post(`/${config.feedback_category_create}`, data)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const editFbCategoryAjx = (domain, data, id) => {
    return axiosInstance
        .patch(`/${config.feedback_categories}${id}/`, data)
        .then((res) => res.data)
        .catch((err) => getError(err));
};
