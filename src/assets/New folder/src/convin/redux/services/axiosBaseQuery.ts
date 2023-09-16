import type { BaseQueryApi, BaseQueryFn } from "@reduxjs/toolkit/query";
import type {
    AxiosRequestConfig,
    AxiosRequestHeaders,
    AxiosResponse,
} from "axios";
import Axios from "axios";
import { API } from "./api-types";
import { axiosInstance } from "app/ApiUtils/axiosInstance";

export interface AxiosBaseQueryArgs<Meta, Response = API.BaseResponse> {
    meta?: Meta;
    prepareHeaders?: (
        headers: AxiosRequestHeaders,
        api: BaseQueryApi
    ) => AxiosRequestHeaders;
    transformResponse?: (response: Response) => unknown;
}

export interface ServiceExtraOptions {
    authRequired?: boolean;
}

const getRequestConfig = (
    args: string | (AxiosRequestConfig & { body?: string })
) => {
    if (typeof args === "string") {
        return { url: args };
    }

    return args;
};

const axiosBaseQuery = <
    Args extends AxiosRequestConfig | string = AxiosRequestConfig,
    Result = unknown,
    DefinitionExtraOptions extends ServiceExtraOptions = Record<
        string,
        unknown
    >,
    Meta = Omit<AxiosResponse, "data">
>({ meta, transformResponse }: AxiosBaseQueryArgs<Meta> = {}): BaseQueryFn<
    Args,
    Result,
    unknown,
    DefinitionExtraOptions,
    Meta
> => {
    return async (args, api, extraOptions) => {
        try {
            const requestConfig = getRequestConfig(args);
            // eslint-disable-next-line no-console
            const result = await axiosInstance({
                ...requestConfig,
                data: requestConfig.body,
                signal: api.signal,
                ...extraOptions,
            });
            const { data, ...rest } = result;
            return {
                data: transformResponse ? transformResponse(data) : data,
                meta: rest as Meta,
            };
        } catch (err) {
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (!Axios.isAxiosError(err)) {
                return {
                    error: err,
                    meta,
                };
            }

            return {
                error: {
                    status: err.response?.status,
                    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                    data: err.response?.data || err.message,
                },
                meta,
            };
        }
    };
};

export default axiosBaseQuery;
