import callsApiConfig from "./config";
import { getError } from "../common";
import { axiosInstance } from "@apis/axiosInstance";

export const getUpcomingCallsApi = (domain, payload, next) => {
    return axiosInstance
        .post(
            next?.split("ai")?.[1] || `/${callsApiConfig.UPCOMINGCALLS}/`,
            payload
        )
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const getCompletedCalls = (domain) => {
    return axiosInstance
        .get(`/${callsApiConfig.COMPLETEDCALLS}`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const addUpcomingNotes = (domain, callId, note) => {
    return axiosInstance
        .patch(`/${callsApiConfig.UPCOMINGADDNOTE}/${callId}/`, { note: note })
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const updateCompletedMeeting = (domain, callId, data) => {
    return axiosInstance
        .patch(`/${callsApiConfig.UPDATEMEETING}/${callId}/`, data)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const deleteCompletedMeeting = (domain, callId) => {
    return axiosInstance
        .delete(`/${callsApiConfig.UPDATEMEETING}/${callId}/`)
        .then((res) => res)
        .catch((error) => getError(error));
};

export const addCompletedNotes = (domain, callId, note) => {
    return updateCompletedMeeting(domain, callId, { note: note });
};

export const addUpcomingTags = (domain, callId, tags) => {
    return axiosInstance
        .patch(`/${callsApiConfig.UPCOMINGADDTAGS}/${callId}/`, tags)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const updateCompletedTags = (domain, callId, tags) => {
    return updateCompletedMeeting(domain, callId, tags);
};

export const deleteUpcomingTags = (domain, callId, tagId) => {
    return axiosInstance
        .delete(`/${callsApiConfig.UPCOMINGDELETETAGS}/${callId}/${tagId}/`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const deleteCompletedTags = (domain, callId, tagId) => {
    return axiosInstance
        .delete(`/${callsApiConfig.COMPLETEDDELETETAGS}/${callId}/${tagId}/`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const getUpcomingComments = (domain, callId) => {
    return axiosInstance
        .get(`/${callsApiConfig.UPCOMIGGETCOMMENTS}/${callId}/`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const getCompletedComments = (domain, callId) => {
    return axiosInstance
        .get(`/${callsApiConfig.COMPLETEDCOMMENTS}/${callId}/`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const addUpcomingComments = (domain, callId, comment) => {
    return axiosInstance
        .post(`/${callsApiConfig.UPCOMINGADDCOMMENTS}/${callId}/`, comment)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const addCompletedComments = (domain, callId, comment) => {
    return axiosInstance
        .post(`/${callsApiConfig.COMPLETEDCOMMENTS}/${callId}/`, comment)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const changeUpcomingCallType = (domain, callId, callTypeId) => {
    return axiosInstance
        .patch(
            `/${callsApiConfig.UPCOMINGCHANGECALLTYPE}/${callId}/${callTypeId}/`,
            {}
        )
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const changeCompletedCallType = (domain, callId, callTypeId) => {
    return updateCompletedMeeting(domain, callId, { call_types: +callTypeId });
};

export const getNextCalls = (url, type, data) => {
    url = url?.split("ai")?.[1];
    let axiosCall;
    if (type === callsApiConfig.COMPLETEDCALLTYPE) {
        axiosCall = axiosInstance.post(url, data);
    } else {
        axiosCall = axiosInstance.get(url);
    }
    return axiosCall
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const getAllCallTypes = (domain) => {
    return axiosInstance
        .get(`/${callsApiConfig.GETALLCALLTYPES}/`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const createCallType = (domain, callType) => {
    return axiosInstance
        .post(`/${callsApiConfig.CREATECALLTYPE}/`, callType)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const removeCallTag = (callTag_id) => {
    return axiosInstance
        .delete(`/${callsApiConfig.CALLTAGS}${callTag_id}/`)
        .then((res) => {
            return res;
        })
        .catch((error) => {
            return getError(error);
        });
};
export const getMeetingsForCallTag = (callTag_id) => {
    return axiosInstance
        .get(`/${callsApiConfig.CALLTAGS}${callTag_id}/`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const removeCallType = (callType_id) => {
    return axiosInstance
        .delete(`/${callsApiConfig.CALLTYPES}${callType_id}/`)
        .then((res) => {
            return res;
        })
        .catch((error) => {
            return getError(error);
        });
};
export const getMeetingsForCallType = (callType_id) => {
    return axiosInstance
        .get(`/${callsApiConfig.CALLTYPES}${callType_id}/`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const deleteCallType = (domain, callTypeId) => {
    return axiosInstance
        .delete(`/${callsApiConfig.DELETECALLTYPE}/${callTypeId}/`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const uploadCall = (domain, data, setuploadProgress) => {
    let config = {
        onUploadProgress: (progressEvent) => {
            let percentCompleted = Math.floor(
                (progressEvent.loaded * 100) / progressEvent.total
            );
            setuploadProgress(percentCompleted);
        },
        headers: {
            "Content-Type": "multipart/form-data",
        },
    };
    return axiosInstance
        .post(`/${callsApiConfig.UPLOADCALL}`, data, config)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const getClients = (domain, query, next_url) => {
    const url = next_url?.split("ai")?.[1] || `/${callsApiConfig.LISTCLIENTS}`;
    let params = encodeURIComponent(query);
    return axiosInstance
        .get(query ? url + `?query=${params} ` : url)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const createClient = (domain, data) => {
    return axiosInstance
        .post(`/${callsApiConfig.CREATECLIENT}`, data)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const createTracker = (domain, data) => {
    return axiosInstance
        .post(`/${callsApiConfig.CREATETRACKER}`, data)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const getAllTrackers = (domain, next) => {
    return axiosInstance
        .get(next || `/${callsApiConfig.GETALLTRACKERS}`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const getTrackerByIdApi = (domain, id) => {
    return axiosInstance
        .get(`/tracker/tracker/update/${id}/`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const getFilterByShareIdApi = (domain, shareId) => {
    return axiosInstance
        .get(`/share/meetings/${shareId}/`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const editTrackerDetails = (domain, data, id) => {
    return axiosInstance
        .patch(`/${callsApiConfig.EDITTRACKERS}${id}/`, data)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const deleteTracker = (domain, id) => {
    return axiosInstance
        .delete(`/${callsApiConfig.DELETETRACKER}${id}/`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const getAllTags = (domain) => {
    return axiosInstance
        .get(`/${callsApiConfig.GETALLTAGS}`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const createTag = (domain, tag) => {
    return axiosInstance
        .post(`/${callsApiConfig.CREATE_TAG}`, { tag_name: tag })
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const getCallByIdAjx = (domain, id) => {
    return axiosInstance
        .get(`/${callsApiConfig.RETRIEVE_CALL}${id}/`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};

export const deleteCommentAjx = (domain, id) => {
    return axiosInstance
        .delete(`${callsApiConfig.COMMENT_OPERATION + id}/`)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};
export const updateCommentAjx = (domain, id, data) => {
    return axiosInstance
        .patch(`${callsApiConfig.COMMENT_OPERATION + id}/`, data)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            return getError(error);
        });
};
export const getSalesTask = (domain, query, next_url) => {
    const url =
        next_url?.split("ai")?.[1] || `${callsApiConfig.SALESTASKLISTALL}`;
    let params = encodeURIComponent(query);
    return axiosInstance
        .get(query ? url + `?query=${params} ` : url)
        .then((res) => res.data)
        .catch((error) => getError(error));
};
export const getStatsCriteriaSnippets = ({ domain, criteria_id, callId }) => {
    return axiosInstance
        .get(`/criteria/criteria/${criteria_id}/snippets/?meeting_id=${callId}`)
        .then((res) => res.data)
        .catch((error) => getError(error));
};
