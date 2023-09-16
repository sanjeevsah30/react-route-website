import { getError } from "../common";
import voiceApiConfigs from "./config";
import { axiosInstance } from "@apis/axiosInstance";
export const hasVoicePrint = (domain = "") => {
    if (domain) {
        const endpoint = `/${voiceApiConfigs.ENDPOINT}`;
        return axiosInstance
            .get(endpoint)
            .then((res) => res.data)
            .catch((error) => getError(error));
    }
};

export const sendRecording = (domain = "", data) => {
    if (domain) {
        const endpoint = `/${voiceApiConfigs.ENDPOINT}`;
        return axiosInstance
            .post(endpoint, data)
            .then((res) => res.data)
            .catch((error) => getError(error));
    }
};
