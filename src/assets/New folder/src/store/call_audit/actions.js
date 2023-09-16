import * as types from "./types";
import * as caApi from "@apis/call_audit";
import {
    setLoader,
    openNotification,
    successSnackBar,
    setFilterAuditTemplates,
    setActiveTemplateForFilters,
    ErrorSnackBar,
} from "../common/actions";
import apiErrors from "@apis/common/errors";

import { setSearchFilters } from "@store/search/actions";
import { uid } from "@tools/helpers";
import { getError } from "@apis/common/index";
import { axiosInstance } from "@apis/axiosInstance";
import auditConfig from "@constants/Audit/index";
import {
    getAccLevelStage,
    getAccountAuditTopbarFilters,
    getCallLevelStage,
    getTopbarFilters,
} from "@tools/searchFactory";

const storeTemplates = (templates) => {
    return {
        type: types.STORE_TEMPLATES_FOR_AUDIT,
        templates,
    };
};

export const storeCategories = (categories) => {
    return {
        type: types.STORE_CATEGORIES,
        categories,
    };
};

export const storeQuestions = (questions) => {
    return {
        type: types.STORE_QUESTIONS,
        questions,
    };
};

export function setAiLoader(status) {
    return {
        type: types.SET_AI_LOADING,
        status,
    };
}

export const storeAuditTemplate = (template) => {
    return {
        type: types.STORE_AUDIT_TEMPLATE,
        template,
    };
};

export const storeScoreDetails = (scoreDetails) => {
    return {
        type: types.STORE_SCORE_DETAILS,
        scoreDetails,
    };
};

const setAvailableTeams = (teams) => {
    return {
        type: types.STORE_AVAILABLE_TEAMS_FOR_AUDIT,
        teams,
    };
};

const setNonAvailableTeams = (teams) => {
    return {
        type: types.STORE_NON_AVAILABLE_TEAMS_FOR_AUDIT,
        teams,
    };
};

const setDisableLoading = (loading) => {
    return {
        type: types.DISABLE_LOADING,
        loading,
    };
};

const setSaving = (saving) => {
    return {
        type: types.SAVING_NOTE,
        saving,
    };
};

export const setAuditDone = (status) => {
    return {
        type: types.AUDIT_DONE,
        status,
    };
};

export const setShowAuditIncomplete = (flag) => {
    return {
        type: types.SHOW_AUDIT_INCOMPLETE,
        flag,
    };
};

export const resetCallAudit = () => {
    return {
        type: types.RESET_CALL_AUDIT,
    };
};

export const setCallAuditOverallDetails = (data) => {
    return {
        type: types.CALL_AUDIT_OVERALL_DETAILS,
        data,
    };
};

export const setAccountAuditOverallDetails = (data) => {
    return {
        type: types.ACCOUNT_AUDIT_OVERALL_DETAILS,
        data,
    };
};

export const setSubFilters = (data) => {
    return {
        type: types.STORE_FILTER,
        data,
    };
};

export const setDeletedFilters = (data) => {
    return {
        type: types.STORE_DELETED_FILTER,
        data,
    };
};

//Questions maped to category id
export const storeQuestionsObj = (data) => {
    return {
        type: types.STORE_CATEGORY_QUESTION_OBJ,
        data,
    };
};

const storeGlobalExpressions = (data) => {
    return {
        type: types.STORE_GLOBAL_EXPRESSIONS,
        data,
    };
};

const setAuditLoader = (flag) => {
    return {
        type: types.LOADING,
        flag,
    };
};

export const storeAiAuditScore = (data) => {
    return {
        type: types.STORE_AI_AUDIT_SCORE,
        data,
    };
};

export const storeSearchAuditTemplate = (data) => {
    return {
        type: types.SET_SEARCH_AUDIT_TEMPLATE,
        data,
    };
};

const setLeadScoreForTemplate = (data) => {
    return {
        type: types.SET_LEAD_SCORE_FOR_TEMPLATE,
        data,
    };
};

const setParametersLoading = (flag) => {
    return {
        type: types.SET_PARAMETERS_LOADING,
        flag,
    };
};

const storeAllTemplates = (allTemplates) => {
    return {
        type: types.STORE_ALL_AUDIT_TEMPLATE,
        allTemplates,
    };
};

export const getAllMeetingAuditTemplatesRequest =
    (callId) => (dispatch, getState) => {
        dispatch(setAiLoader(true));
        caApi
            .getAllMeetingAuditTemplates(getState().common.domain, callId)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                    dispatch(setAiLoader(false));
                } else {
                    // dispatch(storeAllTemplates(res));
                    dispatch(setAiLoader(false));
                }
            });
    };

export const getAuditTemplatesRequest = () => (dispatch, getState) => {
    dispatch(setLoader(true));
    caApi.getAuditTemplates(getState().common.domain).then((res) => {
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            openNotification("error", "Error", res.message);
            dispatch(setLoader(false));
        } else {
            dispatch(storeTemplates(res));
            dispatch(setLoader(false));
        }
    });
};

export const createAuditTemplateRequest =
    (template) => (dispatch, getState) => {
        dispatch(setLoader(true));
        caApi
            .createAuditTemplate(getState().common.domain, template)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                    dispatch(setLoader(false));
                } else {
                    let templates = [...getState().callAudit.templates, res];
                    dispatch(storeTemplates(templates));

                    dispatch(setLoader(false));
                    successSnackBar("Template successfully created");
                }
            });
    };

export const updateAuditTemplateRequest =
    (id, template) => (dispatch, getState) => {
        dispatch(setLoader(true));
        caApi
            .updateAuditTemplate(getState().common.domain, id, template)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                    dispatch(setLoader(false));
                } else {
                    let templates = [...getState().callAudit.templates];

                    let newTemplates = templates.map((template) => {
                        if (template.id === id) return res;
                        else return template;
                    });

                    dispatch(storeTemplates(newTemplates));
                    dispatch(setLoader(false));
                }
            });
    };

export const fetchSingleAuditTemplateRequest = (id) => (dispatch, getState) => {
    dispatch(setLoader(true));
    caApi.fetchSingleAuditTemplate(getState().common.domain, id).then((res) => {
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            openNotification("error", "Error", res.message);
            dispatch(setLoader(false));
        } else {
            let templates = [...getState().callAudit.templates];
            let newTemplates = [];
            if (templates.length) {
                newTemplates = templates.map((template) => {
                    if (template.id === id) return res;
                    else return template;
                });
            } else {
                newTemplates.push(res);
            }

            dispatch(storeTemplates(newTemplates));
            dispatch(setLoader(false));
        }
    });
};
export const deleteAuditTemplateRequest = (id) => (dispatch, getState) => {
    dispatch(setLoader(true));
    caApi.deleteAuditTemplate(getState().common.domain, id).then((res) => {
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            openNotification("error", "Error", res.message);
            dispatch(setLoader(false));
        } else {
            let templates = getState().callAudit.templates.filter(
                (template) => template.id !== Number(id)
            );
            dispatch(storeTemplates(templates));
            dispatch(setLoader(false));
        }
    });
};

export const fetchTemplateCategoriesRequest = (id) => (dispatch, getState) => {
    dispatch(setLoader(true));
    caApi.fetchTemplateCategories(getState().common.domain, id).then((res) => {
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            openNotification("error", "Error", res.message);
            dispatch(setLoader(false));
        } else {
            dispatch(storeCategories(res));
            dispatch(setLoader(false));
        }
    });
};

export const createTemplateCategoryRequest =
    (category) => (dispatch, getState) => {
        dispatch(setLoader(true));
        caApi
            .createTemplateCategory(getState().common.domain, category)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                    dispatch(setLoader(false));
                } else {
                    dispatch(
                        storeCategories([
                            ...getState().callAudit.categories,
                            res,
                        ])
                    );
                    dispatch(setLoader(false));
                    successSnackBar("Audit category successfully created");
                }
            });
    };

export const updateTemplateCategotyRequest =
    (id, category, enableLoader = true) =>
    (dispatch, getState) => {
        enableLoader && dispatch(setLoader(true));
        enableLoader || dispatch(setDisableLoading(true));
        caApi
            .updateTemplateCategory(getState().common.domain, id, category)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                    dispatch(setLoader(false));
                } else {
                    let categories = [...getState().callAudit.categories];

                    let newCategories = categories.map((category) => {
                        if (+category.id === +id) return res;
                        else return category;
                    });

                    dispatch(storeCategories(newCategories));
                    enableLoader && dispatch(setLoader(false));
                    enableLoader || dispatch(setDisableLoading(false));
                }
            });
    };

export const fetchCategoryQuestionsRequest = (id) => (dispatch, getState) => {
    dispatch(setLoader(true));
    caApi.fetchCategoryQuestion(getState().common.domain, id).then((res) => {
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            openNotification("error", "Error", res.message);
            dispatch(setLoader(false));
        } else {
            dispatch(storeQuestions(res));
            dispatch(setLoader(false));
        }
    });
};

export const fetchCategoryQuestionsForSettingsRequest =
    (id) => (dispatch, getState) => {
        dispatch(setLoader(true));
        caApi
            .fetchCategoryQuestion(getState().common.domain, id)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                    dispatch(setLoader(false));
                } else {
                    const questionList = {
                        ...getState().callAudit.questionList,
                    };
                    questionList[id] = res;
                    dispatch(storeQuestionsObj(questionList));
                    dispatch(setLoader(false));
                }
            });
    };

export const createCategoryQuestionRequest =
    (question) => (dispatch, getState) => {
        dispatch(setLoader(true));
        caApi
            .createCategoryQuestion(getState().common.domain, question)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                    dispatch(setLoader(false));
                } else {
                    dispatch(
                        storeQuestions([...getState().callAudit.questions, res])
                    );
                    dispatch(setLoader(false));
                    successSnackBar("Question created successfully");
                }
            });
    };

export const updateCategotyQuestionRequest =
    (id, question, enableLoader = true) =>
    (dispatch, getState) => {
        enableLoader && dispatch(setLoader(true));
        enableLoader || dispatch(setDisableLoading(true));
        caApi
            .updateCategoryQuestion(getState().common.domain, id, question)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                    enableLoader && dispatch(setLoader(false));
                    enableLoader || dispatch(setDisableLoading(false));
                } else {
                    let questions = [...getState().callAudit.questions];

                    let newQuestions = questions.map((question) => {
                        if (+question.id === +id) return res;
                        else return question;
                    });

                    dispatch(storeQuestions(newQuestions));
                    enableLoader && dispatch(setLoader(false));
                    enableLoader || dispatch(setDisableLoading(false));
                }
            });
    };

export const setScoreDetailsLoading = (payload) => {
    return {
        type: types.SET_SCORE_DETAILS_LOADING,
        payload,
    };
};

export const fetchAuditScoreDetailsRequest =
    (id, showLoader) => (dispatch, getState) => {
        showLoader && dispatch(setScoreDetailsLoading(true));

        caApi
            .fetchAuditScoreDetails(getState().common.domain, id)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                    dispatch(setScoreDetailsLoading(false));
                } else {
                    dispatch(storeScoreDetails(res));
                    dispatch(setScoreDetailsLoading(false));
                }
            });
    };

export const fetchAuditScoreDetailsWithCreateRequest =
    ({ id, showLoader, template_id }) =>
    (dispatch, getState) => {
        showLoader && dispatch(setScoreDetailsLoading(true));
        return caApi
            .fetchAuditScoreDetailsWithCreateApi(
                getState().common.domain,
                id,
                template_id
            )
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                    dispatch(setScoreDetailsLoading(false));
                } else {
                    dispatch(storeScoreDetails(res));
                    dispatch(setScoreDetailsLoading(false));
                }
            });
    };

export const createCallAuditScoreRequest =
    (score, savingNote = false, callId) =>
    (dispatch, getState) => {
        let temp = { ...score, id: uid() };
        const currentScoreDetails = [...getState().callAudit.scoreDetails];
        dispatch(
            storeScoreDetails([...getState().callAudit.scoreDetails, temp])
        );
        if (savingNote) {
            dispatch(
                setSaving({
                    savingNote: true,
                    question_id: score?.question,
                    savingResponse: true,
                })
            );
        } else
            dispatch(
                setSaving({
                    question_id: score?.question,
                    savingResponse: true,
                })
            );

        caApi
            .createCallAuditScore(getState().common.domain, score)
            .then((res) => {
                if (savingNote) {
                    dispatch(
                        setSaving({
                            savingNote: false,
                            question_id: null,
                            savingResponse: false,
                        })
                    );
                } else {
                    dispatch(
                        setSaving({
                            question_id: score?.question,
                            savingResponse: false,
                        })
                    );
                    dispatch(getCallAuditSatusRequest(callId));
                }
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                    dispatch(storeScoreDetails([...currentScoreDetails]));
                } else {
                    dispatch(storeScoreDetails([...res]));
                }
            });
    };

export const updateCallAuditScoreRequest =
    (id, score, savingNote = false, callId) =>
    (dispatch, getState) => {
        const currentScoreDetails = [...getState().callAudit.scoreDetails];
        const newScoreDetails = currentScoreDetails.map((obj) => {
            if (+id === +obj.id) return { ...score, error: false };
            return obj;
        });

        dispatch(storeScoreDetails(newScoreDetails));

        if (savingNote) {
            dispatch(
                setSaving({
                    savingNote: true,
                    question_id: score?.question,
                    savingResponse: true,
                })
            );
        } else {
            dispatch(
                setSaving({
                    question_id: score?.question,
                    savingResponse: true,
                })
            );
        }
        caApi
            .updateCallAuditScore(getState().common.domain, id, score)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    // console.log(id);
                    // console.log(newScoreDetails);
                    // console.log(
                    //     newScoreDetails.find((obj) => {
                    //         return +id === +obj.id;
                    //     })
                    // );

                    dispatch(
                        storeScoreDetails(
                            newScoreDetails.map((obj) => {
                                if (+id === +obj.id)
                                    return { ...obj, ...score, error: true };
                                return obj;
                            })
                        )
                    );
                    if (savingNote) {
                        dispatch(
                            setSaving({
                                savingNote: false,
                                question_id: null,
                                savingResponse: false,
                            })
                        );
                    } else {
                        dispatch(
                            setSaving({
                                question_id: score?.question,
                                savingResponse: false,
                            })
                        );
                    }
                    openNotification("error", "Error", res.message);
                    return;
                } else {
                    const ids = res?.map(({ id }) => id);
                    if (!savingNote)
                        dispatch(fetchAuditScoreDetailsRequest(callId));
                    dispatch(
                        storeScoreDetails([
                            ...newScoreDetails.filter(
                                ({ id }) => !ids?.includes?.(id)
                            ),
                            ...res,
                        ])
                    );
                }
                if (savingNote) {
                    dispatch(
                        setSaving({
                            savingNote: false,
                            question_id: null,
                            savingResponse: false,
                        })
                    );
                } else {
                    const { template_id } = score;
                    dispatch(
                        getCallAuditSatusRequest(callId, false, {
                            template_id: template_id,
                        })
                    );
                    dispatch(
                        setSaving({
                            question_id: score?.question,
                            savingResponse: false,
                        })
                    );
                }
            })
            .catch((err) => {
                if (savingNote) {
                    dispatch(
                        setSaving({
                            savingNote: false,
                            question_id: null,
                            savingResponse: false,
                        })
                    );
                } else {
                    dispatch(
                        setSaving({
                            question_id: score?.question,
                            savingResponse: false,
                        })
                    );
                }
                dispatch(
                    storeScoreDetails(
                        newScoreDetails.map((obj) => {
                            if (+id === +obj.id)
                                return { ...score, error: true };
                            return obj;
                        })
                    )
                );
            });
    };

export const updateCallAuditNotesMedia =
    (id, media, question_id) => (dispatch, getState) => {
        dispatch(
            setSaving({
                savingMedia: true,
                question_id,
                savingResponse: true,
            })
        );
        caApi
            .updateCallAuditNotesMediaApi(getState().common.domain, id, media)
            .then((res) => {
                dispatch(
                    setSaving({
                        savingMedia: false,
                        question_id,
                        savingResponse: false,
                    })
                );
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    return openNotification("error", "Error", res.message);
                }
                const currentScoreDetails = getState().callAudit.scoreDetails;

                dispatch(
                    storeScoreDetails(
                        currentScoreDetails.map((e) =>
                            e.id === id ? { ...e, ...res } : e
                        )
                    )
                );
            });
    };

export const deleteCallAuditNotesMedia = (id) => (dispatch, getState) => {
    caApi
        .deleteCallAuditNotesMediaApi(getState().common.domain, id)
        .then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                return openNotification("error", "Error", res.message);
            }
            const currentScoreDetails = getState().callAudit.scoreDetails;

            dispatch(
                storeScoreDetails(
                    currentScoreDetails.map((e) =>
                        e.id === id
                            ? { ...e, media: null, media_type: null }
                            : e
                    )
                )
            );
        });
};
export const getCallAuditSatusRequest =
    (id, submit = false, payload, toggleAudit = () => {}, callApi) =>
    (dispatch, getState) => {
        submit && dispatch(setLoader(true));
        // dispatch(setAuditLoader(true));
        return caApi
            .getCallAuditSatus(getState().common.domain, id, submit, payload)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    dispatch(setAuditDone(res));
                    if (callApi)
                        if (!res.status) {
                            dispatch(
                                fetchAuditScoreDetailsWithCreateRequest({
                                    id: id,
                                    template_id: payload.template_id,
                                })
                            );
                        } else dispatch(fetchAuditScoreDetailsRequest(id));
                    submit &&
                        res.status &&
                        getState().callAudit.showAuditIncomplete &&
                        dispatch(setShowAuditIncomplete(false));
                    submit &&
                        !res.status &&
                        dispatch(setShowAuditIncomplete(true));

                    toggleAudit();
                }
                submit && dispatch(setLoader(false));
                // dispatch(setAuditLoader(false));
            });
    };
export const getCallAuditSatusRequestThenScoreObjects =
    (id, submit = false, payload) =>
    (dispatch, getState) => {
        dispatch(setLoader(true));

        caApi
            .getCallAuditSatus(getState().common.domain, id, submit, payload)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                    dispatch(setScoreDetailsLoading(false));
                } else {
                    dispatch(setAuditDone(res));
                    dispatch(fetchAuditScoreDetailsRequest(id, true));
                }
                dispatch(setLoader(false));
            });
    };

export const createQuestionSubFiltersRequest =
    (payload, goBack) => (dispatch, getState) => {
        dispatch(setLoader(true));
        caApi
            .createQuestionSubFilters(getState().common.domain, payload)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    dispatch(setSubFilters(res));
                    goBack();
                    successSnackBar("Filter created successfully");
                }
                dispatch(setLoader(false));
            });
    };

export const getCallAuditOverallDetailsRequest =
    (search_data, template_id, filters) => (dispatch, getState) => {
        dispatch(setParametersLoading(true));
        caApi
            .getCallAuditOverallDetails(
                getState().common.domain,
                [
                    ...getTopbarFilters(search_data),
                    ...getCallLevelStage(filters),
                ],
                template_id,
                filters.audit_filter.audit_type ===
                    auditConfig.MANUAL_AUDIT_TYPE
                    ? "manual"
                    : "ai",
                filters.audit_filter?.auditors.filter((e) => +e !== 0)?.length
                    ? filters.audit_filter?.auditors
                    : null
            )
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    dispatch(setCallAuditOverallDetails(res));
                }
                dispatch(setParametersLoading(false));
            });
    };

export const getAccountAuditOverallDetailsRequest =
    (search_data, template_id, filters) => (dispatch, getState) => {
        dispatch(setParametersLoading(true));
        caApi
            .getAccountAuditOverallDetails(
                getState().common.domain,
                [
                    ...getAccountAuditTopbarFilters(search_data),
                    ...getAccLevelStage(filters),
                ],
                template_id,
                filters.audit_filter.audit_type ===
                    auditConfig.MANUAL_AUDIT_TYPE
                    ? "manual"
                    : "ai"
            )
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    dispatch(setAccountAuditOverallDetails(res));
                }
                dispatch(setParametersLoading(false));
            });
    };

export const editQuestionSubFiltersRequest =
    (payload, id) => (dispatch, getState) => {
        dispatch(setLoader(true));
        caApi
            .editQuestionSubFilters(getState().common.domain, payload, id)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    dispatch(setSubFilters(res));
                }
                dispatch(setLoader(false));
            });
    };

export const getQuestionSubFiltersRequest =
    (id, cb) => (dispatch, getState) => {
        dispatch(setLoader(true));
        caApi
            .getQuestionSubFilters(getState().common.domain, id)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    dispatch(setSubFilters(res));
                    if (cb) cb(res.id);
                }
                dispatch(setLoader(false));
            });
    };

export const getDeletedSubFiltersRequest = (id) => (dispatch, getState) => {
    dispatch(setLoader(true));
    caApi.getDeletedSubFilters(getState().common.domain, id).then((res) => {
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            openNotification("error", "Error", res.message);
        } else {
            dispatch(setDeletedFilters(res));
        }
        dispatch(setLoader(false));
    });
};

export const restoreSubFilterRequest = (id) => (dispatch, getState) => {
    dispatch(setLoader(true));
    caApi.restoreSubFilter(getState().common.domain, id).then((res) => {
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            openNotification("error", "Error", res.message);
        } else {
            const newDeletedFilters =
                getState().callAudit.deletedFilters.filter(
                    (filter) => filter.id !== id
                );
            dispatch(setDeletedFilters(newDeletedFilters));
            successSnackBar("Subfilter restored successfully");
        }
        dispatch(setLoader(false));
    });
};

export const createGlobalExpressionRequest =
    (payload) => (dispatch, getState) => {
        dispatch(setLoader(true));
        caApi
            .createGlobalExpression(getState().common.domain, payload)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    successSnackBar("Expression created successfully");
                    dispatch(
                        storeGlobalExpressions({
                            ...getState().callAudit.globalExpressions,
                            results: [
                                ...getState().callAudit.globalExpressions
                                    .results,
                                res,
                            ],
                        })
                    );
                }
                dispatch(setLoader(false));
            });
    };

export const getGlobalExpressionRequest =
    (id, nextUrl) => (dispatch, getState) => {
        dispatch(setAuditLoader(true));
        caApi
            .getGlobalExpression(getState().common.domain, id, nextUrl)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    if (nextUrl)
                        dispatch(
                            storeGlobalExpressions({
                                ...res,
                                results: [
                                    ...getState().callAudit.globalExpressions
                                        .results,
                                    ...res.results,
                                ],
                            })
                        );
                    else {
                        dispatch(storeGlobalExpressions(res));
                    }
                }
                dispatch(setAuditLoader(false));
            });
    };

export const updateGlobalExpressionRequest =
    (id, payload) => (dispatch, getState) => {
        dispatch(setAuditLoader(true));
        caApi
            .updateGlobalExpression(getState().common.domain, id, payload)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    dispatch(
                        storeGlobalExpressions({
                            ...getState().callAudit.globalExpressions,
                            results: [
                                ...getState().callAudit.globalExpressions.results.map(
                                    (exp) => {
                                        if (exp.id === id) {
                                            return res;
                                        }
                                        return exp;
                                    }
                                ),
                            ],
                        })
                    );
                }
                dispatch(setAuditLoader(false));
            });
    };

export const deleteQuestionFiltersRequest = (id) => (dispatch, getState) => {
    caApi.deleteQuestionFilters(getState().common.domain, id).then((res) => {
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            openNotification("error", "error", res.message);
        } else {
            openNotification(
                "success",
                "success",
                "Filter deleted successfully"
            );
        }
    });
};

export const deleteGlobalExpressionRequest =
    (id, payload) => (dispatch, getState) => {
        dispatch(setAuditLoader(true));
        caApi
            .deleteGlobalExpression(getState().common.domain, id, payload)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    dispatch(
                        storeGlobalExpressions({
                            ...getState().callAudit.globalExpressions,
                            results: [
                                ...getState().callAudit.globalExpressions.results.filter(
                                    (exp) => exp.id !== id
                                ),
                            ],
                        })
                    );
                }
                dispatch(setAuditLoader(false));
            });
    };
export const getMeetingAuditTemplateRequest = (id) => (dispatch, getState) => {
    dispatch(setLoader(true));
    dispatch(fetchAuditScoreDetailsRequest(id, true));
    caApi.getMeetingAuditTemplate(getState().common.domain, id).then((res) => {
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            openNotification("error", "Error", res.message);
        } else {
            if (!res.template) {
            }
            if (res.status) {
                dispatch(storeAuditTemplate(res.template));
                dispatch(storeCategories(res.categories || []));
            }
        }
        dispatch(setAuditLoader(false));
    });
};

export const getSearchAuditTemplateRequest = (id) => (dispatch, getState) => {
    if (!id) {
        // return setSearchFilters({
        //     template: null,
        //     auditQuestions: [],
        //     activeTemplate: null,
        // });
    }
    caApi.getSearchAuditTemplate(getState().common.domain, id).then((res) => {
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            openNotification("error", "Error", res.message);
        } else {
            if (res.template && res.categories) {
                let questions = [];
                const { categories } = res;
                for (let i = 0; i < categories.length; i++) {
                    for (let j = 0; j < categories[i].questions.length; j++) {
                        questions.push(categories[i].questions[j]);
                    }
                }

                const filters = [
                    {
                        question_text: "Call Score",
                        id: 0,
                        question_type: "yes_no",
                    },
                    ...questions.map((question) => ({
                        ...question,
                    })),
                ];

                dispatch(
                    setSearchFilters({
                        template: res.template,
                        auditQuestions: filters,
                        activeTemplate: res.template.id,
                    })
                );
            } else {
                dispatch(storeSearchAuditTemplate(res));
            }
        }
    });
};

export const storeFilterSettingsAuditTemplate = (data) => {
    return {
        type: types.STORE_FILTER_SEETINGS_TEMPLATE,
        data,
    };
};

export const getAuditTemplateRequestForFilterSettings =
    (id) => (dispatch, getState) => {
        dispatch(setLoader(true));
        caApi
            .getSearchAuditTemplate(getState().common.domain, id, true)
            .then((res) => {
                dispatch(setLoader(false));
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    if (res.template && res.categories) {
                        dispatch(
                            storeFilterSettingsAuditTemplate({
                                template: res.template,
                                categories: res.categories,
                            })
                        );
                    }
                }
            });
    };

export const getCalibrationDetails = (cid, qid) => (dispatch, getState) => {
    dispatch(setLoader(true));
    caApi.fetchCalibration(getState().common.domain, cid, qid).then((res) => {
        dispatch(setLoader(false));
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            openNotification("error", "Error", res.message);
        } else {
            return res;
        }
    });
};

export const getAiAuditScoreRequest = (id, payload) => (dispatch, getState) => {
    dispatch(setLoader(true));
    caApi.getAiAuditScore(getState().common.domain, id, payload).then((res) => {
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            openNotification("error", "Error", res.message);
        } else {
            // dispatch(getCallAuditSatusRequestThenScoreObjects(id));

            dispatch(storeAiAuditScore(res));
        }
        dispatch(setLoader(false));
    });
};

/* When you open call filters page for the first time you get all the templates and then get the first template data for that particular team*/
export const getTemplatesForFilter =
    (team_id, showLoader = true) =>
    (dispatch, getState) => {
        showLoader && dispatch(setLoader(true));
        caApi
            .getAuditTemplates(getState().common.domain, team_id)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                    dispatch(setLoader(false));
                } else {
                    if (res.length) {
                        // dispatch(setActiveTemplateForFilters(res[0].id));
                        // dispatch(setLoader(false));
                        return dispatch(setFilterAuditTemplates(res));
                    } else {
                        dispatch(
                            setCallAuditOverallDetails({
                                result: [],
                            })
                        );
                        dispatch(
                            setAccountAuditOverallDetails({
                                result: [],
                            })
                        );
                        dispatch(setActiveTemplateForFilters(0));
                        dispatch(setLoader(false));
                        dispatch(setFilterAuditTemplates([]));
                    }

                    showLoader && dispatch(setLoader(false));
                }
            });
    };

export const createLeadScore = (formData) => (dispatch, getState) => {
    dispatch(setLoader(true));
    return caApi
        .createLeadScoreApi(getState().common.domain, formData)
        .then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
                return dispatch(setLoader(false));
            }
            dispatch(setLeadScoreForTemplate(res));
            successSnackBar("Lead Score successfully created");
            dispatch(setLoader(false));
        });
};

export const updateLeadScore = (formData, id) => (dispatch, getState) => {
    dispatch(setLoader(true));
    return caApi
        .updateLeadScoreApi(getState().common.domain, formData, id)
        .then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
                return dispatch(setLoader(false));
            }
            dispatch(setLeadScoreForTemplate(res));
            successSnackBar("Lead Score successfully updated");
            dispatch(setLoader(false));
        });
};

export const getLeadScore = (id) => (dispatch, getState) => {
    dispatch(setLoader(true));
    return caApi.getLeadScoreApi(getState().common.domain, id).then((res) => {
        if (res.status === apiErrors.AXIOSERRORSTATUS) {
            openNotification("error", "Error", res.message);
            return dispatch(setLoader(false));
        }
        dispatch(setLeadScoreForTemplate(res));
        dispatch(setLoader(false));
    });
};

export const deleteLeadScore = (id) => (dispatch, getState) => {
    dispatch(setLoader(true));
    return caApi
        .deleteLeadScoreApi(getState().common.domain, id)
        .then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
                return dispatch(setLoader(false));
            }
            dispatch(setLeadScoreForTemplate(null));
            dispatch(setLoader(false));
        });
};

export const setIsAccountLevel = (flag) => {
    return {
        type: types.SET_IS_ACCOUNT_LEVEL,
        flag,
    };
};

export const setIsManualLevel = (data) => {
    return {
        type: types.SET_IS_MANUAL_LEVEL,
        data,
    };
};

export const setRunCommandLoading = (flag) => {
    return {
        type: types.SET_RUN_COMMAND_LOADING,
        flag,
    };
};

export const isCallObjCreated = (id) => {
    return {
        type: types.NEW_CALL_CREATED,
        id,
    };
};

export const runCommand = (url, cb) => (dispatch, getState) => {
    if (url.includes("report")) {
        window.open(url, "_blank");
        return;
    }
    dispatch(setRunCommandLoading(true));
    return axiosInstance
        .get(url)
        .then((res) => {
            dispatch(setRunCommandLoading(false));
            if (res?.request?.responseURL) {
                openNotification(
                    "success",
                    "Success",
                    "Messages are queued in priority worker, please check queue"
                );
                if (typeof cb === "function") return cb();
                const url = res?.request?.responseURL.split("?").join("/?");
                window.open(url, "_blank");
            }
        })
        .catch((err) => {
            dispatch(setRunCommandLoading(false));
            openNotification("error", "Error", getError(err)?.message);
        });
};

export const getWordCloudForInternalDashboard =
    (url) => (dispatch, getState) => {
        dispatch(setRunCommandLoading(true));
        return axiosInstance
            .get(url)
            .then((res) => {
                dispatch(setRunCommandLoading(false));

                if (res.data.status === "failed") {
                    dispatch({
                        type: types.STORE_WORD_CLOUD,
                        data: [],
                    });
                    return openNotification(
                        "error",
                        "Error",
                        res.data?.message
                    );
                }
                dispatch({
                    type: types.STORE_WORD_CLOUD,
                    data: res.data.report,
                });
            })
            .catch((err) => {
                dispatch(setRunCommandLoading(false));
                openNotification("error", "Error", getError(err)?.message);
            });
    };

export const runErrorCommand = (url) => (dispatch, getState) => {
    console.log(url);
    dispatch(setRunCommandLoading(true));
    axiosInstance
        .get(url)
        .then((res) => {
            dispatch(setRunCommandLoading(false));
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                return ErrorSnackBar(res?.message, 100);
                // return openNotification('error', 'Error', res?.message);
            }
        })
        .catch((err) => {
            dispatch(setRunCommandLoading(false));
            return ErrorSnackBar(getError(err)?.message, 100);
            // openNotification('error', 'Error', getError(err)?.message);
        });
};

export const createMcaApianualCallRequest = (payload) => {
    return (dispatch, getState) => {
        caApi.createManualCall(payload).then((res) => {
            if (res.status !== 200) {
                openNotification("error", res.message);
                return;
            }
            dispatch(isCallObjCreated(res.data.id));
            // console.log(res);
        });
    };
};
