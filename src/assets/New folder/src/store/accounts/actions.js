import {
    createAccountCommentsApi,
    fetcAccountsListApi,
    fetchAccoountDetailsApi,
    fetchAccountCallsAndEmailsApi,
    fetchAccountCommentsApi,
    fetchAccountGraphApi,
    updateAccountCommentsApi,
    fetchAccountCommentReplyApi,
    deleteAccountCommentApi,
    fetchAccountAuditApi,
    fetchAuditTemplateQuestionsAccountsApi,
    fetchAccountsStageApi,
    fetchLeadScoreAuditApi,
    getAccountLeadScoreObjectsApi,
    createMediaAccountCommentsApi,
    fetchAccountTagsApi,
} from "@apis/accounts/index";
import apiErrors from "@apis/common/errors";
import { getTeamReps } from "@apis/topbar/index";
import { showError } from "@store/common/actions";
import * as types from "./types";
import { checkArray, uid } from "@tools/helpers";
import { getAuditTemplates } from "@apis/call_audit/index";
import { GRAPH_DIVISION } from "@constants/Account/index";

export const setAccountsLoader = (data) => {
    return {
        type: types.SET_ACCOUNTS_LOADER,
        data,
    };
};

const setAccountsList = (data) => {
    return {
        type: types.SET_ACCOUNTS_LIST,
        data,
    };
};

export const setAccountsTeams = (data) => {
    return {
        type: types.SET_ACCOUNTS_TEAMS,
        data,
    };
};

export const setActiveTeamAccounts = (value) => {
    return {
        type: types.SET_ACTIVE_TEAM_FOR_ACCOUNTS,
        value,
    };
};

export const setActiveRepAccounts = (value) => {
    return {
        type: types.SET_ACTIVE_REP_FOR_ACCOUNTS,
        value,
    };
};

export const setAccountsRep = (data) => {
    return {
        type: types.SET_ACCOUNTS_REPS,
        data,
    };
};

export function setAccountFilterDates(value) {
    return {
        type: types.SET_ACCOUNT_FILTER_DATES,
        value,
    };
}

export function setAccountActiveFilterDate(value) {
    return {
        type: types.SET_ACCOUNT_ACTIVE_FILTER_DATES,
        value,
    };
}

export function setAccountDetails(data) {
    return {
        type: types.SET_ACCOUNT_DETAILS,
        data,
    };
}

export function setAccountCalls(data) {
    return {
        type: types.SET_ACCOUNT_CALLS,
        data,
    };
}

export function setAccountGraph(data) {
    return {
        type: types.SET_ACCOUNT_GRAPH,
        data,
    };
}

export function setAccountComments(data) {
    return {
        type: types.SET_ACCOUNT_COMMENTS,
        data,
    };
}

export function setAccountCommentToReply(data) {
    return {
        type: types.SET_ACCOUNT_COMMENT_TO_REPLY,
        data,
    };
}

export function setAccountSearchFilter(data) {
    return {
        type: types.SET_ACCOUNT_SEARCH_FILTER,
        data,
    };
}

export function setAccountAiData(data) {
    return {
        type: types.SET_ACCOUNT_AI_DATA,
        data,
    };
}

export function setAccountLeadScoreData(data) {
    return {
        type: types.SET_LEAD_SCORE_FOR_ACCOUNTS,
        data,
    };
}

export const fetchAccountsList = (payload, next) => (dispatch, getState) => {
    next ||
        dispatch(
            setAccountsLoader({
                mainLoader: true,
            })
        );
    fetcAccountsListApi(getState().common.domain, payload, next).then((res) => {
        dispatch(
            setAccountsLoader({
                mainLoader: false,
            })
        );
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            return showError(res);
        }

        dispatch(
            setAccountsList(
                next
                    ? {
                          ...res,
                          results: [
                              ...getState().accounts.accountsList.results,
                              ...res.results,
                          ],
                      }
                    : res
            )
        );
    });
};

/*
    mainLoader: false,
    graphLoader: false,
    callsLoader: false,
    commentsLoader: false,
    transcriptsLoader: false,

*/

export const fetchAccountDetails = (id) => (dispatch, getState) => {
    dispatch(
        setAccountsLoader({
            mainLoader: true,
        })
    );
    fetchAccoountDetailsApi(getState().common.domain, id).then((res) => {
        dispatch(
            setAccountsLoader({
                mainLoader: false,
            })
        );
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            return showError(res);
        }
        const data = { ...res };
        if (data?.owner?.id) {
            data.owner = {
                ...data?.owner,
                type: "owner",
            };
        }

        dispatch(
            setAccountDetails({
                ...data,
                client: checkArray(data.client)?.map((per) => ({
                    ...per,
                    type: "client",
                })),
                reps: checkArray(data.reps)?.map((per) => ({
                    ...per,
                    type: "reps",
                })),
            })
        );
    });
};

export const fetchAccountCallsAndEmails =
    ({ id, next, payload }) =>
    (dispatch, getState) => {
        next ||
            dispatch(
                setAccountsLoader({
                    callsLoader: true,
                })
            );
        fetchAccountCallsAndEmailsApi(
            getState().common.domain,
            id,
            next,
            payload
        ).then((res) => {
            dispatch(
                setAccountsLoader({
                    callsLoader: false,
                })
            );
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                return showError(res);
            }
            dispatch(
                setAccountCalls(
                    next
                        ? {
                              ...res,
                              results: [
                                  ...getState().accounts.accountCalls.results,
                                  ...res.results,
                              ],
                          }
                        : res
                )
            );
        });
    };

export const fetchAccountGraph = (id) => (dispatch, getState) => {
    dispatch(
        setAccountsLoader({
            graphLoader: true,
        })
    );
    fetchAccountGraphApi(getState().common.domain, id).then((res) => {
        dispatch(
            setAccountsLoader({
                graphLoader: false,
            })
        );
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            return showError(res);
        }
        if (res.length) {
            const rem = res.length % GRAPH_DIVISION;
            let arr = [];
            // This is for populating the the graph data such that each carousel will have equal no of days which is the GRAPH_DIVISION constant
            if (rem) {
                let total = GRAPH_DIVISION - rem;
                arr[total - 1] = {
                    epoch: res[0].epoch - 24 * 60 * 60,
                    meetings: 0,
                };
                for (let i = total - 2; i >= 0; i--) {
                    arr[i] = {
                        epoch: arr[i + 1].epoch - 24 * 60 * 60,
                        meetings: 0,
                    };
                }
            }
            return dispatch(setAccountGraph([...arr, ...res]));
        }

        dispatch(setAccountGraph(res));
    });
};

export const fetchAccountComments = (id, next) => (dispatch, getState) => {
    next ||
        dispatch(
            setAccountsLoader({
                commentsLoader: true,
            })
        );
    fetchAccountCommentsApi(getState().common.domain, id, next).then((res) => {
        dispatch(
            setAccountsLoader({
                commentsLoader: false,
            })
        );
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            return showError(res);
        }
        dispatch(
            setAccountComments(
                next
                    ? {
                          ...res,
                          results: [
                              ...getState().accounts.comments.results,
                              ...res.results,
                          ],
                      }
                    : res
            )
        );
    });
};

export const createAccountComments = (id, payload) => (dispatch, getState) => {
    dispatch(
        setAccountsLoader({
            commentsLoader: true,
        })
    );
    createAccountCommentsApi(getState().common.domain, id, payload).then(
        (res) => {
            dispatch(
                setAccountsLoader({
                    commentsLoader: false,
                })
            );
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                return showError(res);
            }
            if (payload.parent) {
                return dispatch(
                    setAccountCommentToReply({
                        replies: {
                            count: res.comments.length,
                            next: null,
                            prev: null,
                            results: [...res.comments],
                        },
                    })
                );
            }
            dispatch(
                setAccountComments({
                    count: res.comments.length,
                    next: null,
                    prev: null,
                    results: [...res.comments],
                })
            );
        }
    );
};

export const createMediaAccountComments =
    (id, payload) => (dispatch, getState) => {
        dispatch(
            setAccountsLoader({
                commentsLoader: true,
            })
        );
        createMediaAccountCommentsApi(
            getState().common.domain,
            id,
            payload
        ).then((res) => {
            dispatch(
                setAccountsLoader({
                    commentsLoader: false,
                })
            );
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                return showError(res);
            }
            if (payload.parent) {
                return dispatch(
                    setAccountCommentToReply({
                        replies: {
                            count: res.comments.length,
                            next: null,
                            prev: null,
                            results: [...res.comments],
                        },
                    })
                );
            }
            dispatch(
                setAccountComments({
                    count: res.comments.length,
                    next: null,
                    prev: null,
                    results: [...res.comments],
                })
            );
        });
    };

export const updateAccountComments = (id, payload) => (dispatch, getState) => {
    dispatch(
        setAccountsLoader({
            commentsLoader: true,
        })
    );
    updateAccountCommentsApi(getState().common.domain, id, payload).then(
        (res) => {
            dispatch(
                setAccountsLoader({
                    commentsLoader: false,
                })
            );
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                return showError(res);
            }
            if (res.parent) {
                const { replies } = getState().accounts.activeComment;
                const results = replies?.results.map((reply) => {
                    if (reply.id === res.id) return res;
                    return reply;
                });
                return dispatch(
                    setAccountCommentToReply({
                        replies: {
                            ...replies,
                            results,
                        },
                    })
                );
            }
            const { comments } = getState().accounts;
            const results = comments.results.map((comment) => {
                if (comment.id === res.id) return res;
                return comment;
            });
            dispatch(
                setAccountComments({
                    ...comments,
                    results,
                })
            );
        }
    );
};
export const deleteAccountComment = (id, payload) => (dispatch, getState) => {
    dispatch(
        setAccountsLoader({
            commentsLoader: true,
        })
    );
    deleteAccountCommentApi(getState().common.domain, id, payload).then(
        (res) => {
            dispatch(
                setAccountsLoader({
                    commentsLoader: false,
                })
            );
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                return showError(res);
            }

            if (payload.parent) {
                const { replies } = getState().accounts.activeComment;
                const results = replies?.results?.filter(
                    (reply) => +reply.id !== +id
                );
                return dispatch(
                    setAccountCommentToReply({
                        replies: {
                            ...replies,
                            count:
                                getState().accounts.activeComment.replies
                                    .count - 1,
                            results,
                        },
                    })
                );
            }
            const { comments } = getState().accounts;
            const results = res
                ? comments?.results?.map((comment) =>
                      +comment.id === +id ? res : comment
                  )
                : comments?.results?.filter((comment) => +comment.id !== +id);
            dispatch(
                setAccountComments({
                    ...comments,
                    count: res ? comments.count : comments.count - 1,
                    results,
                })
            );
        }
    );
};

export const fetchAccountCommentReply = (id, next) => (dispatch, getState) => {
    next ||
        dispatch(
            setAccountsLoader({
                commentsLoader: true,
            })
        );
    fetchAccountCommentReplyApi(getState().common.domain, id).then((res) => {
        dispatch(
            setAccountsLoader({
                commentsLoader: false,
            })
        );
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            return showError(res);
        }
        dispatch(
            setAccountCommentToReply({
                replies: res,
            })
        );
    });
};

export const fetchAccountAudit = (id) => (dispatch, getState) => {
    dispatch(
        setAccountsLoader({
            aiDataLoader: true,
        })
    );
    fetchAccountAuditApi(getState().common.domain, id).then((res) => {
        dispatch(
            setAccountsLoader({
                aiDataLoader: false,
            })
        );
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            return showError(res);
        }
        dispatch(setAccountAiData(res));
    });
};

export const fetchAccountLeadScore = (id) => (dispatch, getState) => {
    dispatch(
        setAccountsLoader({
            leadScoreLoader: true,
        })
    );
    fetchLeadScoreAuditApi(getState().common.domain, id).then((res) => {
        dispatch(
            setAccountsLoader({
                leadScoreLoader: false,
            })
        );
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            return showError(res);
        }
        dispatch(setAccountLeadScoreData(res));
    });
};

export const getRepByTeamForAccounts = (teamId) => (dispatch, getState) => {
    return getTeamReps(getState().common.domain, teamId)?.then((res) => {
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            showError(res);
        } else {
            let mappedReps = res.results.map((rep, index) => {
                return {
                    name: rep.first_name
                        ? rep.first_name
                        : rep.email
                        ? rep.email
                        : `Rep ${index + 1}`,
                    id: rep.id,
                };
            });
            const updatedReps = [{ name: "All", id: 0 }, ...mappedReps];
            dispatch(setAccountsRep(updatedReps));
        }
    });
};

export const setAccountCallDuration = (active) => {
    return {
        type: types.SET_ACCOUNT_CALL_DURATION,
        active,
    };
};

export const setAccountFilterCallDuration = (values) => {
    return {
        type: types.SET_ACCOUNT_FILTER_CALL_DURATION,
        values,
    };
};

export const setAccountListSearchText = (values) => {
    return {
        type: types.SET_ACCOUNT_LIST_SEARCH_TEXT,
        values,
    };
};

export const setSortKeyAccounts = (values) => {
    return {
        type: types.SET_SORT_KEY_ACCOUNTS,
        values,
    };
};

export const setAccountAuditTemplates = (data) => {
    return {
        type: types.SET_AUDIT_TEMPLATES,
        data,
    };
};

export const setActiveAccountAuditTemplate = (data) => {
    return {
        type: types.SET_ACTIVE_AUDIT_TEMPLATE,
        data,
    };
};

export const setActiveAccountLeadScoreTemplate = (data) => {
    return {
        type: types.SET_ACTIVE_LEAD_SCORE_TEMPLATE,
        data,
    };
};

export const setAuditTemplatesQuestions = (data) => {
    return {
        type: types.SET_AUDIT_TEMPLATE_QUESTIONS,
        data,
    };
};

export const setAccountTags = (data) => {
    return {
        type: types.SET_ACCOUNT_TAGS,
        data,
    };
};

export const setActiveStage = (data) => {
    return {
        type: types.SET_ACTIVE_STAGE,
        data,
    };
};

export const setActiveInteractions = (data) => {
    return {
        type: types.SET_ACTIVE_INTERACTIONS,
        data,
    };
};
export const setActiveDealSize = (data) => {
    return {
        type: types.SET_ACTIVE_DEAL_SIZE,
        data,
    };
};
export const setActiveCloseDate = (data) => {
    return {
        type: types.SET_ACTIVE_CLOSE_DATE,
        data,
    };
};
export const setActiveLastContact = (data) => {
    return {
        type: types.SET_ACTIVE_LAST_CONTACT,
        data,
    };
};

export const setActiveFilters = (data) => {
    return {
        type: types.SET_ACTIVE_FILTERS,
        data,
    };
};

export const setStage = (data) => {
    return {
        type: types.SET_STAGE,
        data,
    };
};

export const setActiveFilterQuestions = (data) => {
    return {
        type: types.SET_ACTIVE_FILTER_QUESTIONS,
        data,
    };
};

export const resetAccountFilters = () => {
    return {
        type: types.RESET_ACCOUNT_LIST_FILTERS,
    };
};
export const setFilterDatesForAccounts = (data) => {
    return {
        type: types.SET_FILTER_DATES_FOR_ACCOUNTS,
        data,
    };
};

export const setLeadScoreObjects = (data) => {
    return {
        type: types.SET_LEAD_SCORE_OBJECTS,
        data,
    };
};

export const setActiveFilterLeadScoreQuestions = (data) => {
    return {
        type: types.SET_ACTIVE_LEAD_SCORE_QUESTIONS,
        data,
    };
};

export const setActiveLeadScorePercent = (data) => {
    return {
        type: types.SET_ACTIVE_LEAD_SCORE_PERCENT,
        data,
    };
};

export const setActiveAuditType = (data) => {
    return {
        type: types.SET_ACTIVE_AUDIT_TYPE,
        data,
    };
};

export const getAuditTemplatesForAccounts =
    (setFirstValue = true) =>
    (dispatch, getState) => {
        getAuditTemplates(getState().common.domain).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                return showError(res);
            }

            dispatch(setAccountAuditTemplates(res));
            setFirstValue &&
                res.length &&
                dispatch(setActiveAccountAuditTemplate(res[0].id));
        });
    };

export const fetchAuditTemplateQuestionsAccounts =
    (id) => (dispatch, getState) => {
        dispatch(
            setAccountsLoader({
                aiDataLoader: true,
            })
        );
        fetchAuditTemplateQuestionsAccountsApi(
            getState().common.domain,
            id
        ).then((res) => {
            dispatch(
                setAccountsLoader({
                    aiDataLoader: false,
                })
            );
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                return showError(res);
            }

            dispatch(setAuditTemplatesQuestions(res));
        });
    };

export const fetchAccountsStage = () => (dispatch, getState) => {
    fetchAccountsStageApi(getState().common.domain).then((res) => {
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            return showError(res);
        }

        dispatch(setStage(res));
    });
};

export const getAccountLeadScoreObjects = () => (dispatch, getState) => {
    getAccountLeadScoreObjectsApi(getState().common.domain).then((res) => {
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            return showError(res);
        }
        if (res?.length) {
            dispatch(setActiveAccountLeadScoreTemplate(res[0]?.template?.id));
            dispatch(setLeadScoreObjects(res));
        }
    });
};

export const getAccountTags = () => (dispatch, getState) => {
    fetchAccountTagsApi(getState().common.domain).then((res) => {
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            return showError(res);
        }
        if (res?.length) {
            dispatch(setAccountTags(res));
        }
    });
};

export const setActiveAccountTags = (data) => {
    return {
        type: types.SET_ACTIVE_ACCOUNT_TAGS,
        data,
    };
};
