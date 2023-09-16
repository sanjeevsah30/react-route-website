import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "@apis/common/index";

const config = {
    settings: "crm/settings/",
    creds: "tpauth/get_credentials/",
};

export const getCrmSettings = (domain) => {
    return axiosInstance
        .get(`/${config.settings}`)
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const editCrmSettings = (domain, status) => {
    return axiosInstance
        .patch(`/${config.settings}`, { push_new_task: status })
        .then((res) => res.data)
        .catch((err) => getError(err));
};

export const submitCreds = (domain, data, provider) => {
    return axiosInstance
        .post(`/${config.creds}${provider}/`, data)
        .then((res) => res.data)
        .catch((err) => getError(err));
};
