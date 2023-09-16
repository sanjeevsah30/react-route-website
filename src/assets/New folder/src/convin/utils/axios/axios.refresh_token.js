// Intercept and refresh expired tokens for multiple requests (same implementation but with some abstractions)
//
// HOW TO USE:
// import applyAppTokenRefreshInterceptor from 'axios.refresh_token.js';
// import axios from 'axios';
// ...
// applyAppTokenRefreshInterceptor(axios); // register the interceptor with all axios instance
// ...
// - Alternatively:
// const apiClient = axios.create({baseUrl: 'example.com/api'});
// applyAppTokenRefreshInterceptor(apiClient); // register the interceptor with one specific axios instance
// ...
// - With custom options:
// applyAppTokenRefreshInterceptor(apiClient, {
//      shouldIntercept: (error) => {
//          return error.response.data.errorCode === 'EXPIRED_ACCESS_TOKEN';
//      }
// ); // register the interceptor with one specific axios instance
//

import apiConfig from "@convin/config/api.config";
import axios from "axios";
import { getDomain } from "@convin/utils/helper";

const shouldIntercept = (error) => {
    try {
        return error.response.status === 401;
    } catch (e) {
        return false;
    }
};

const setTokenData = (tokenData = {}) => {
    localStorage.setItem("authTokens", JSON.stringify(tokenData));
};

const handleTokenRefresh = () => {
    const { refresh } = JSON.parse(window.localStorage.getItem("authTokens"));
    return new Promise((resolve, reject) => {
        axios
            .post(
                `${apiConfig.HTTPS}${getDomain(window.location.host)}.${
                    apiConfig.BASEURL
                }/person/token/refresh/`,
                {
                    refresh,
                }
            )
            .then(({ data }) => {
                setTokenData(data);
                resolve(data);
            })
            .catch((err) => {
                window.localStorage.clear("authTokens");
                window.location.reload();
                reject(err);
            });
    });
};

const attachTokenToRequest = (request, token) => {
    request.headers["Authorization"] = "Bearer " + token;

    // If there is an edge case where access token is also set in request query,
    // this is also a nice place to add it
    // Example: /orders?token=xyz-old-token
    if (/\/orders/.test(request.url)) {
        request.params.token = token;
    }
};

const applyAppTokenRefreshInterceptor = (axiosClient, customOptions = {}) => {
    let isRefreshing = false;
    let failedQueue = [];

    const options = {
        attachTokenToRequest,
        handleTokenRefresh,
        setTokenData,
        shouldIntercept,
        ...customOptions,
    };
    const processQueue = (error, token = null) => {
        failedQueue.forEach((prom) => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });

        failedQueue = [];
    };

    const interceptor = (error) => {
        if (!options.shouldIntercept(error)) {
            return Promise.reject(error);
        }

        if (error.config._retry || error.config._queued) {
            return Promise.reject(error);
        }

        const originalRequest = error.config;
        if (isRefreshing) {
            return new Promise(function (resolve, reject) {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest._queued = true;
                    options.attachTokenToRequest(originalRequest, token);
                    return axiosClient.request(originalRequest);
                })
                .catch(
                    () => Promise.reject(error) // Ignore refresh token request's "err" and return actual "error" for the original request
                );
        }

        originalRequest._retry = true;
        isRefreshing = true;
        return new Promise((resolve, reject) => {
            options.handleTokenRefresh
                .call(options.handleTokenRefresh)
                .then((tokenData) => {
                    options.setTokenData(tokenData, axiosClient);
                    options.attachTokenToRequest(
                        originalRequest,
                        tokenData.access
                    );
                    processQueue(null, tokenData.access);
                    resolve(axiosClient.request(originalRequest));
                })
                .catch((err) => {
                    processQueue(err, null);
                    reject(err);
                })
                .finally(() => {
                    isRefreshing = false;
                });
        });
    };

    axiosClient.interceptors.response.use(undefined, interceptor);
};

export default applyAppTokenRefreshInterceptor;
