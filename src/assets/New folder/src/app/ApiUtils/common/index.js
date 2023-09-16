import apiErrors from "./errors";
import commonConfig from "@constants/common";
import {
    getCookie,
    getDomain,
    getRedirectDomainMappingName,
    getSubDomainMappingName,
} from "@tools/helpers";
import axios from "axios";
import apiConfigs from "./commonApiConfig";

export const getActiveUrl = (domain) => {
    const whiteLabelDomain = getRedirectDomainMappingName(
        getDomain(domain) || window.location.host
    );
    const whiteLabelSubDomain = getSubDomainMappingName(domain);
    return process.env.NODE_ENV !== "production"
        ? `http://${whiteLabelDomain}.localhost:3000`
        : `https://${whiteLabelDomain}.${whiteLabelSubDomain}`;
};

export const getError = (error, type) => {
    if (
        error.hasOwnProperty("response") &&
        error.response &&
        (error.response.status === 400 ||
            error.response.status === 401 ||
            error.response.status === 403 ||
            error.response.status === 422 ||
            error.response.status === 404)
    ) {
        let message =
            error.response.status === 404
                ? "The resource doesn't exist or You don't have access to it"
                : Array.isArray(error?.response?.data) &&
                  error?.response?.data?.length
                ? typeof error?.response?.data?.[0] === "string"
                    ? error?.response?.data?.[0]
                    : error.response.data?.[0]?.detail ||
                      Object.values(
                          error.response.data?.[0] || {
                              detail: "Something went wrong",
                          }
                      )?.[0]
                : error.response.data.detail ||
                  error.response.data.message ||
                  error.response.data.error ||
                  error.response.data[Object.keys(error.response.data)[0]] ||
                  "Something went wrong";
        return {
            status: apiErrors.AXIOSERRORSTATUS,
            message: message,
        };
    } else if (
        error.hasOwnProperty("response") &&
        error.response &&
        error.response.status === 500
    ) {
        return {
            status: apiErrors.AXIOSERRORSTATUS,
            message: error.response.data.detail || apiErrors.AXIOSCOMMONERROR,
        };
    } else if (error.message === apiErrors.AXIOSNETWORKERROR) {
        return {
            status: apiErrors.AXIOSERRORSTATUS,
            message: apiErrors.AXIOSNETWORKERRORMSG,
        };
    } else if (
        error.response &&
        error.response.status === 302 &&
        error?.response?.data?.redirect_url
    ) {
        return {
            status: apiErrors.AXIOSERRORSTATUS,
            message: error.response.data.detail,
            is_redirect: true,
            redirect_url: error.response.data.redirect_url,
        };
    }
    return {
        status: apiErrors.AXIOSERRORSTATUS,
        message: error.message,
        error_status: error?.response?.status,
    };
};

export const getServiceApiError = ({ code, message }) => {
    if (code === 400 || code === 401 || code === 403 || code === 422) {
        return {
            status: apiErrors.AXIOSERRORSTATUS,
            message: message.text || "Something went wrong",
        };
    } else if (code === 500) {
        return {
            status: apiErrors.AXIOSERRORSTATUS,
            message: message.getServiceApiError || apiErrors.AXIOSCOMMONERROR,
        };
    } else if (message.text === apiErrors.AXIOSNETWORKERROR) {
        return {
            status: apiErrors.AXIOSERRORSTATUS,
            message: apiErrors.AXIOSNETWORKERRORMSG,
        };
    }
    return {
        status: apiErrors.AXIOSERRORSTATUS,
        message: message.text,
        error_status: code,
    };
};

export const getAuthHeader = () => {
    const token = getCookie(commonConfig.ACCESS_TOKEN);
    return {
        headers: {
            authorization: token ? `JWT ${token}` : "",
        },
    };
};

export const getAppVersion = (domain) => {
    return axios
        .get(
            `${apiConfigs.HTTPS}${domain}.${apiConfigs.BASEURL}/app/api/version/`
        )
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};
