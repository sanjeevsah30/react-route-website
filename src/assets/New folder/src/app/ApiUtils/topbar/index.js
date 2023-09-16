// APIs for The Topbar component. For fetching teams, reps and all others.

import apiConfigs from "../common/commonApiConfig";
import topbarConfig from "./config";
import { getError } from "../common";
import { axiosInstance } from "@apis/axiosInstance";

export const getTeams = (domain = "") => {
    // Function to get the team s from the API.

    if (domain) {
        const endpoint = `/${topbarConfig.teamsBase}/${topbarConfig.listteams}/`;

        return axiosInstance
            .get(endpoint)
            .then((res) => res.data)
            .catch((error) => {
                return getError(error);
            });
    }
};

export const getTeamReps = (domain = "", teams = []) => {
    // Function to get the team reps pertaining to a specific team ID.

    if (domain) {
        let endpoint = `/person/team/list_reps/`;

        return axiosInstance
            .post(endpoint, { teams })
            .then((res) => {
                return {
                    results: res.data,
                };
            })
            .catch((error) => {
                return getError(error);
            });
    }
};

export const joinCall = (domain = "", uri, title, clients = []) => {
    if (domain) {
        const endpoint = `/${topbarConfig.joinuri}`;

        return axiosInstance
            .post(endpoint, { uri, title, clients })
            .then((res) => res.data)
            .catch((error) => {
                return getError(error);
            });
    }
};
export const checkBot = (domain = "", link) => {
    if (domain) {
        const endpoint = `/${topbarConfig.botActive}`;

        return axiosInstance
            .post(endpoint, { link })
            .then((res) => res.data)
            .catch((error) => {
                return getError(error);
            });
    }
};
