import { getError } from "../common";
import apiConfigs from "../common/commonApiConfig";
import domainApiConfig from "./config";
import axios from "axios";

export const getDomainAvailability = (domain) => {
    return axios
        .get(
            `${apiConfigs.APPURL}.${apiConfigs.BASEURL}/${domainApiConfig.DOMAINCHECK}${domain}`
        )
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};
export const createNewDomain = (domain, email) => {
    let data = {
        name: domain,
        email: email,
    };
    return axios
        .post(
            `${apiConfigs.APPURL}.${apiConfigs.BASEURL}/${domainApiConfig.DOMAINCREATE}`,
            data
        )
        .then((res) => {
            return res;
        })
        .catch((error) => {
            return getError(error);
        });
};
export const getDomainName = (email) => {
    return axios
        .get(
            `${apiConfigs.APPURL}.${apiConfigs.BASEURL}/${domainApiConfig.DOMAINCREATE}?email=${email}`
        )
        .then((res) => {
            return res;
        })
        .catch((error) => {
            return getError(error);
        });
};
