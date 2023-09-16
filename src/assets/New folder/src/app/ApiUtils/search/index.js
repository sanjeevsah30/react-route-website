import searchConfig from "./config";

import { getError } from "../common";
import { axiosInstance } from "@apis/axiosInstance";

export const searchCalls = (domain, searchFilters, team, rep) => {
    if (domain && searchFilters) {
        const endpoint = `${searchConfig.SEARCH}/${team}/${rep}/`;
        return axiosInstance
            .post(endpoint, searchFilters)
            .then((res) => res.data)
            .catch((err) => getError(err));
    }
};

export const getNextSearchCalls = (url, searchFilters) => {
    if (url && searchFilters) {
        return axiosInstance
            .post(url?.split(".ai")?.[1], searchFilters)
            .then((res) => {
                return res.data;
            })
            .catch((error) => {
                return getError(error);
            });
    }
};

export const getFields = (domain) => {
    return axiosInstance
        .get(`${searchConfig.GETFIELDS}`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getConfToolsAjx = (domain) => {
    return axiosInstance
        .get(`${searchConfig.CONF_TOOLS}`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getSearchResults = ({ domain, data, next, sortKey }) => {
    let url = next?.split(".ai")?.[1] || `${searchConfig.GETRESULTS}`;

    url = sortKey ? url + `?&order_by=${sortKey}` : url;
    return axiosInstance
        .post(url, data)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getSearchViewsApi = (domain) => {
    return axiosInstance
        .get(`meeting/meeting-filter/list/`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const createSearchViewApi = (domain, payload) => {
    return axiosInstance
        .post(`meeting/meeting-filter/create/`, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const updateSearchViewApi = (domain, id, payload) => {
    return axiosInstance
        .patch(`meeting/meeting-filter/${id}/`, payload)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const deleteSearchViewApi = (domain, id) => {
    return axiosInstance
        .delete(`meeting/meeting-filter/${id}/`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getDeafultSearchViewApi = (domain) => {
    return axiosInstance
        .get(`meeting/meeting-filter/default/`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};
