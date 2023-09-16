import { getError } from "../common";
import { prepareCIData } from "@store/ci/utils";
import { axiosInstance } from "@apis/axiosInstance";
import { openNotification } from "@store/common/actions";

export const getTabs = (domain, topBarFilter, filters) => {
    return axiosInstance
        .post(
            `/customer_intelligence/customer_intelligence/tabs/`,
            prepareCIData({
                saidByFilter: {
                    saidByOwner: true,
                    saidByClient: true,
                },
                topBarFilter,
                filters,
            })
        )
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getSingleTab = ({
    domain,
    saidByFilter,
    id,
    topBarFilter,
    exclude,
    filters,
}) => {
    return axiosInstance
        .post(`/customer_intelligence/customer_intelligence/tabs/${id}/`, {
            ...prepareCIData({ saidByFilter, topBarFilter, filters }),
            exclude: exclude,
        })
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const createTab = ({ domain, title }) => {
    return axiosInstance
        .post(`/customer_intelligence/customer_intelligence/tabs/create/`, {
            title,
            contains_graph: true,
        })
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const removeTab = ({ domain, id }) => {
    return axiosInstance
        .delete(`/customer_intelligence/customer_intelligence/tabs/${id}/`)
        .then((res) => id)
        .catch((err) => getError(err));
};

export const createKeyWord = ({
    domain,
    id,
    newKeyword,
    saidByFilter,
    topBarFilter,
    filters,
}) => {
    return axiosInstance
        .post(`/customer_intelligence/search_phrase/v2/`, {
            ...prepareCIData({ saidByFilter, topBarFilter, filters }),
            phrase: newKeyword,
            tab: id,
        })
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const removeKeyWord = ({ domain, id }) => {
    return axiosInstance
        .delete(`/customer_intelligence/search_phrase/${id}/`)
        .then((res) => res)
        .catch((err) => getError(err));
};

export const fetchSnippets = ({
    domain,
    id,
    nextSnippetsUrl,
    saidByFilter,
    topBarFilter,
    is_processed,
    filters,
}) => {
    return axiosInstance
        .post(
            nextSnippetsUrl
                ? nextSnippetsUrl?.split("ai")?.[1]
                : `/customer_intelligence/search_phrase/${id}/snippets/`,
            prepareCIData({ saidByFilter, topBarFilter, filters })
        )
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const fetchGraphs = ({
    domain,
    id,
    saidByFilter,
    topBarFilter,
    exclude,
    filters,
}) => {
    return axiosInstance
        .post(
            `/customer_intelligence/customer_intelligence/tabs/${id}/graph/`,
            {
                ...prepareCIData({ saidByFilter, topBarFilter, filters }),
                exclude: exclude,
            }
        )
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const getWorldCloud = ({
    domain,
    id,
    nextSnippetsUrl,
    saidByFilter,
    topBarFilter,
    is_processed,
    filters,
}) => {
    return axiosInstance
        .post(
            `/customer_intelligence/search_phrase/${id}/word_cloud/`,
            prepareCIData({ saidByFilter, topBarFilter, filters })
        )
        .then((res) => {
            if (res.status === 200)
                openNotification(
                    "success",
                    "Successfully downloaded",
                    "Sending the word cloud on mail shortly"
                );
        })
        .catch((err) => getError(err));
};
