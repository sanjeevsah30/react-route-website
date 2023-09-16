import { getError } from "../common";
import config from "./config";
import { axiosInstance } from "@apis/axiosInstance";

export const getAllTopics = (domain = "") => {
    if (domain) {
        const endpoint = `/${config.GETTOPICS}`;
        return axiosInstance
            .get(endpoint)
            .then((res) => res.data)
            .catch((error) => getError(error));
    }
};

// endpoint to get topic categories
export const getTopicCategories = (domain = "") => {
    if (domain) {
        const endpoint = `/${config.TOPIC_CATEGORY}`;
        return axiosInstance
            .get(endpoint)
            .then((res) => res.data)
            .catch((error) => getError(error));
    }
};

export const createNewTopic = (domain = "", data) => {
    if (domain) {
        const endpoint = `/${config.CREATETOPIC}`;
        return axiosInstance
            .post(endpoint, data)
            .then((res) => res.data)
            .catch((error) => getError(error));
    }
};

export const deleteTopic = (domain = "", id) => {
    if (domain) {
        const endpoint = `/${config.REMOVETOPIC}${id}/`;
        return axiosInstance
            .delete(endpoint)
            .then((res) => res.data)
            .catch((error) => getError(error));
    }
};

export const updateTopic = (domain = "", data, id) => {
    if (domain) {
        const endpoint = `/${config.EDITTOPIC}${id}/`;

        return axiosInstance
            .patch(endpoint, data)
            .then((res) => res.data)
            .catch((error) => getError(error));
    }
};
