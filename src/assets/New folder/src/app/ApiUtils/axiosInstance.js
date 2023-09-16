import axios from "axios";
import apiConfigs from "./common/commonApiConfig";
import { getDomain, getDomainMappingName } from "@tools/helpers";
import applyAppTokenRefreshInterceptor from "./axios.refresh_token";

const axiosInstance = axios.create({
    baseURL: `${apiConfigs.HTTPS}${getDomainMappingName(
        getDomain(window.location.host)
    )}.${apiConfigs.BASEURL}`,
});

const baseUrl = `${apiConfigs.HTTPS}${getDomainMappingName(
    getDomain(window.location.host)
)}.${apiConfigs.BASEURL}`;

export const gptServiceBaseApi = `https://gpt.convin.ai/${getDomainMappingName(
    getDomain(window.location.host)
)}/api/v1`;

const addHeader = async (config) => {
    let authTokens = localStorage.getItem("authTokens")
        ? JSON.parse(localStorage.getItem("authTokens"))
        : null;
    let authHeader = {};
    if (authTokens?.access) {
        authHeader = { Authorization: `Bearer ${authTokens?.access}` };
    }

    config.headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...config.headers,
        ...authHeader,
    };

    return config;
};

axiosInstance.interceptors.request.use(addHeader, (error) => {
    Promise.reject(error);
});

applyAppTokenRefreshInterceptor(axiosInstance);

const baseQuery = async (args, apiOptions, extraOptions) => {
    if (
        args.method === "POST" ||
        args.method === "PUT" ||
        args.method === "PATCH"
    ) {
        args.data = JSON.stringify(args.body);
    }
    const axiosResponse = await axiosInstance.request(args);

    const { headers, status, statusText } = axiosResponse;
    const data = axiosResponse.data;

    const response = new Response(JSON.stringify(data), {
        headers,
        status,
        statusText,
    });

    return response;
};

export { axiosInstance, baseQuery, baseUrl };
