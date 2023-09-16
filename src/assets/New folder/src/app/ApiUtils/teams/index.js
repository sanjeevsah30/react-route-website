// APIs for The Topbar component. For fetching teams, reps and all others.

import topbarConfig from "../topbar/config";

import { getError } from "../common";
import teamsConfig from "./config";
import { axiosInstance } from "@apis/axiosInstance";

export const deleteTeam = (domain = "", teamId = "") => {
    if (domain) {
        const endpoint = `/${teamsConfig.DELETE_TEAM}/${teamId}`;

        return axiosInstance
            .delete(endpoint)
            .then((res) => res.data)
            .catch((error) => {
                return getError(error);
            });
    }
};

export const getPageReps = (domain = "", teamId = 0, offset = 0) => {
    if (teamId && domain) {
        const endpoint = `/${topbarConfig.teamsBase}/${
            topbarConfig.listreps
        }/${teamId}?limit=${teamsConfig.MAXREPSPERPAGE}&offset=${
            teamsConfig.MAXREPSPERPAGE * offset
        }`;

        return axiosInstance
            .get(endpoint)
            .then((res) => res.data)
            .catch((err) => getError(err));
    }
};
