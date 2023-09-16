import authApiConfig from "./config";
import { getError } from "../common/index";
import settingsConfig from "@constants/Settings/index";
import { axiosInstance } from "@apis/axiosInstance";
import apiConfigs from "@apis/common/commonApiConfig";
import axios from "axios";

export const createAdmin = (domain, data, invitation_id = false) => {
    return axios
        .post(
            `${apiConfigs.HTTPS}${domain}.${apiConfigs.BASEURL}/${
                !invitation_id
                    ? authApiConfig.CREATEADMIN
                    : authApiConfig.CREATEUSER
            }?invitation_id=${invitation_id}`,
            data
        )
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const inviteUser = (domain, data) => {
    return axios
        .post(
            `${apiConfigs.HTTPS}${domain}.${apiConfigs.BASEURL}/${authApiConfig.INVITEUSER}`,
            data
        )
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const inviteMultipleUsersApi = (domain, data, domain_type) => {
    let url = ``;

    url =
        domain_type === "b2c"
            ? `${url}/person/bulk/create/`
            : `${url}/person/bulk/invite/`;

    return axiosInstance
        .post(url, data)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const getToken = (domain, data, suffix) => {
    return axios
        .post(
            `${apiConfigs.HTTPS}${domain}.${apiConfigs.BASEURL}/${
                authApiConfig.GETTOKEN
            }${suffix || ""}`,
            data
        )
        .then((res) => {
            return res;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const getProviderLocation = (domain, provider) => {
    return axiosInstance
        .get(
            `/${
                settingsConfig.TP_ARRAY.includes(provider)
                    ? authApiConfig.TP_INIT
                    : authApiConfig.CALENDER_WEBHOOK
            }${provider}/${
                settingsConfig.TP_ARRAY.includes(provider)
                    ? ""
                    : authApiConfig.PROVIDER_LOCATION
            }`
        )
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const isCalIntegrated = (domain) => {
    return axiosInstance
        .get(`/${authApiConfig.CALENDER_WEBHOOK}`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const isTpIntegrated = (domain) => {
    return axiosInstance
        .get(`/${authApiConfig.TP_LIST}`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};
export const disconnectCalender = (domain, provider, id) => {
    let endpoint = `/${authApiConfig.CALENDER_WEBHOOK}${provider}/${id}/?delete=1`;
    if (settingsConfig.TP_ARRAY.includes(provider))
        endpoint = `/${authApiConfig.TP_MANAGE}${provider}/`;
    return axiosInstance
        .delete(endpoint)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const checkUser = (domain, token) => {
    return axiosInstance
        .get(`/${authApiConfig.GETUSER}`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

// update user settings

export const updateUser = (domain, data, id) => {
    // get token
    return axiosInstance
        .patch(`/${authApiConfig.UPDATEUSER}/${id}`, data)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

// Get All Users.

export const getUsers = (domain) => {
    let endpoint = `/person/team/list_reps/`;
    return axiosInstance
        .post(endpoint, { teams: [] })
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const retrieveMailId = (domain, invitation_id) => {
    return axios
        .get(
            `${apiConfigs.HTTPS}${domain}.${apiConfigs.BASEURL}/${authApiConfig.INVITEUSER}${invitation_id}`
        )
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const forgetPasswordAjx = (domain, data) => {
    return axios
        .post(
            `${apiConfigs.HTTPS}${domain}.${apiConfigs.BASEURL}/${authApiConfig.FORGET_PASSWORD}`,
            data
        )
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const resetPasswordAjx = (domain, data, token) => {
    return axios
        .post(
            `${apiConfigs.HTTPS}${domain}.${apiConfigs.BASEURL}/${authApiConfig.RESET_PASSWORD}?uid=${token}`,
            data
        )
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const changePasswordAjx = (domain, data) => {
    return axiosInstance
        .post(`/${authApiConfig.CHANGE_PASSWORD}`, data)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const getInvitedUsersAjx = (domain) => {
    return axiosInstance
        .get(`/${authApiConfig.INVITEUSER}`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};
export const sendInvitedReminder = (domain, invitation_id) => {
    return axiosInstance
        .post(`/${authApiConfig.INVITEUSER}${invitation_id}`, {})
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};
export const startDomainCreation = (domain, provider, suffix) => {
    return axiosInstance
        .get(`/${authApiConfig.SIGNUP_PROVIDER}${provider}/${suffix}`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};
