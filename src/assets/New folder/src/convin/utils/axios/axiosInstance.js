import apiConfig from "@convin/config/api.config";
import axios from "axios";

import { getDomain } from "../helper";
import applyAppTokenRefreshInterceptor from "./axios.refresh_token";

const axiosInstance = axios.create({
    baseURL: `${apiConfig.HTTPS}${getDomain(window.location.host)}.${
        apiConfig.BASEURL
    }`,
});

axiosInstance.interceptors.request.use(
    async (config) => {
        let authTokens = localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null;
        config.headers = {
            Authorization: `Bearer ${authTokens?.access}`,
            Accept: "application/json",
            "Content-Type": "application/json",
            ...config.headers,
        };
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

applyAppTokenRefreshInterceptor(axiosInstance);

export default axiosInstance;
