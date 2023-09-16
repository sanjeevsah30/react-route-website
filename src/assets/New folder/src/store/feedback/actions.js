import * as types from "./types";
import apiErrors from "@apis/common/errors";
import { setLoader, openNotification } from "../common/actions";
import * as feedbackapi from "@apis/feedback/index";

function storeQuestions(questions) {
    return {
        type: types.STOREQUESTION,
        questions,
    };
}

function storeAllFeedbacks(feedbacks) {
    return {
        type: types.STOREALLFEEDBACKS,
        feedbacks,
    };
}

function storeUserFeedbacks(feedbacks) {
    return {
        type: types.STOREUSERFEEDBACKS,
        feedbacks,
    };
}

function storeAllNotes(feedbacks) {
    return {
        type: types.STOREALLNOTES,
        feedbacks,
    };
}

function storeAllCategories(categories) {
    return {
        type: types.STORE_ALL_FB_CATEGORIES,
        categories,
    };
}

export function setActiveCategory(active) {
    return {
        type: types.SET_ACTIVE_FB_CATEGORY,
        active,
    };
}
export function setFbLoading(loading) {
    return {
        type: types.SET_FB_LOADING,
        loading,
    };
}
export function setFetchNotes(loading) {
    return {
        type: types.SET_NOTES_LOADING,
        loading,
    };
}

export function createQuestion(questionType, questionStatement) {
    return (dispatch, getState) => {
        dispatch(setLoader(true));
        const data = {
            statement: questionStatement,
            question_type: questionType,
            owner: getState().auth.id,
            feedback_category: getState().feedback.active_category,
        };
        feedbackapi
            .createFeedbackQuestion(getState().common.domain, data)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    const existingQuestions = getState().feedback.questions;
                    const questions = existingQuestions.length
                        ? [...existingQuestions, res]
                        : [res];
                    dispatch(storeQuestions(questions));
                }
                dispatch(setLoader(false));
            });
    };
}

export function getQuestions() {
    return (dispatch, getState) => {
        dispatch(setFbLoading(true));
        dispatch(storeQuestions([]));
        feedbackapi
            .getAllQuestions(
                getState().common.domain,
                getState().feedback.active_category
            )
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    dispatch(storeQuestions(res.results));
                }
                dispatch(setFbLoading(false));
            });
    };
}

export function editQuestion(feedback) {
    return (dispatch, getState) => {
        dispatch(setLoader(true));
        const data = {
            statement: feedback.statement,
            question_type: feedback.question_type,
        };
        feedbackapi
            .editFeedbackQuestion(getState().common.domain, data, feedback.id)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    const existingQuestions = [
                        ...getState().feedback.questions,
                    ];
                    existingQuestions[feedback.idx] = res;
                    dispatch(storeQuestions(existingQuestions));
                }
                dispatch(setLoader(false));
            });
    };
}

export function deleteFeedback(id) {
    return (dispatch, getState) => {
        feedbackapi.deleteQuestion(getState().common.domain, id).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                const existingQuestions = [...getState().feedback.questions];
                dispatch(
                    storeQuestions(
                        existingQuestions.filter((ques) => ques.id !== id)
                    )
                );
            }
        });
    };
}

export function getUserFeedbacks(meeting_id, owner, question) {
    return (dispatch, getState) => {
        // debugger;
        //don't set loader to true if the admin clicks show notes which is indicated by the value of question
        question || dispatch(setFbLoading(true));
        question && dispatch(setFetchNotes(true));
        feedbackapi
            .getFeedbacks(
                getState().common.domain,
                meeting_id,
                owner,
                question,
                getState().feedback.active_category
            )
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    dispatch(setFbLoading(false));
                    dispatch(setFetchNotes(true));
                    openNotification("error", "Error", res.message);
                } else {
                    if (owner) {
                        let existingFeedbacks =
                            getState().feedback.user_feedbacks;
                        let feedbacks = existingFeedbacks
                            ? { ...existingFeedbacks, [owner]: res.results }
                            : { [owner]: res.results };
                        dispatch(storeUserFeedbacks(feedbacks));
                        dispatch(setFbLoading(false));
                    } else if (question) {
                        let existingNotes = getState().feedback.all_notes;
                        let feedbacks = existingNotes
                            ? { ...existingNotes, [question]: res.results }
                            : { [question]: res.results };
                        dispatch(storeAllNotes(feedbacks));
                        dispatch(setFbLoading(false));
                        dispatch(setFetchNotes(false));
                    } else {
                        dispatch(storeAllFeedbacks(res.results));
                        dispatch(setFbLoading(false));
                    }
                }
            });
    };
}

export function addFeedback(meeting_id, feedback, idx, rating, note) {
    return (dispatch, getState) => {
        dispatch(setLoader(true));
        const domain = getState().common.domain;
        if (feedback.response) {
            let data = {
                ...feedback.response,
                response: rating !== null ? rating : feedback.response.response,
                note: note ? note : feedback.response.note,
            };
            feedbackapi
                .updateFeedback(domain, data, feedback.response.id)
                .then((res) => {
                    if (res.status === apiErrors.AXIOSERRORSTATUS) {
                        openNotification("error", "Error", res.message);
                    } else {
                        let existingFeedbacks = JSON.parse(
                            JSON.stringify(getState().feedback.user_feedbacks)
                        );
                        existingFeedbacks[feedback.response.owner][
                            idx
                        ].response = res;
                        dispatch(storeUserFeedbacks(existingFeedbacks));
                    }
                    dispatch(setLoader(false));
                });
        } else {
            let data = {
                response: rating,
                note: note || "",
                meeting: meeting_id,
                owner: getState().auth.id,
                question: feedback.question.id,
            };
            feedbackapi.createFeedback(domain, data).then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    let existingFeedbacks = JSON.parse(
                        JSON.stringify(getState().feedback.user_feedbacks)
                    );
                    existingFeedbacks[data.owner][idx].response = res;
                    dispatch(storeUserFeedbacks(existingFeedbacks));
                }
            });
        }
    };
}

export function fetchFbCategories(meetingId) {
    return (dispatch, getState) => {
        dispatch(setFbLoading(true));
        feedbackapi
            .fetchFbCategoriesAjx(getState().common.domain, meetingId)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    dispatch(storeAllCategories(res.results));
                }
                dispatch(setFbLoading(false));
            });
    };
}

export function createFbCategory(title, desc) {
    return (dispatch, getState) => {
        dispatch(setFbLoading(true));
        const data = new FormData();
        data.append("name", title);
        data.append("description", desc);
        feedbackapi
            .createFbCategoryAjx(getState().common.domain, data)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    const existingCategories = [
                        ...getState().feedback.all_categories,
                    ];
                    dispatch(storeAllCategories([...existingCategories, res]));
                }
                dispatch(setFbLoading(false));
            });
    };
}

export function editFbCategory(title, desc, id, cb) {
    return (dispatch, getState) => {
        dispatch(setFbLoading(true));
        const data = new FormData();
        data.append("name", title);
        data.append("description", desc);
        feedbackapi
            .editFbCategoryAjx(getState().common.domain, data, id)
            .then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    openNotification("error", "Error", res.message);
                } else {
                    const existingCategories = [
                        ...getState().feedback.all_categories,
                    ];
                    const idxToUpdate = existingCategories.findIndex(
                        (cat) => cat.id === id
                    );
                    existingCategories[idxToUpdate] = res;
                    dispatch(storeAllCategories(existingCategories));
                    openNotification(
                        "success",
                        "Success",
                        "Changes successfully saved."
                    );
                    cb();
                }
                dispatch(setFbLoading(false));
            });
    };
}
