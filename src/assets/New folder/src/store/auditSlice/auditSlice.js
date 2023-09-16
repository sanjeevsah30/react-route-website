import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "@apis/common/index";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openNotification } from "@store/common/actions";
import { uid } from "@tools/helpers";

import {
    calculated_score_from_score_given,
    getScoreData,
    get_violation_from_repr,
} from "./calculateScore.helper";

const initialState = {
    loading: false,
    ai_score: {
        data: [],
        loading: false,
    },
    manual_score: {
        data: [],
        loading: false,
    },
    score_objects: {
        data: [],
        loading: false,
    },
    audit_template: {},
    meeting_id: null,
    meeting_templates: {
        data: [],
        loading: false,
    },
    saving_state: {
        savingNote: false,
        question_id: null,
        savingResponse: false,
        savingMedia: false,
    },
    is_audit_incomplete: false,
    violations: {
        loading: false,
        data: [],
        template_question_with_violation: [],
        category_question_with_violation: [],
    },
    deduction_score_objects: [],
};

export const listMeetingScores = createAsyncThunk(
    "auditSlice/listAllScores",
    async ({ id, template_id }, { getState, rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(
                `audit/score/list_all/${id}/?template_id=${template_id}`
            );
            return res.data.map((e, idx) => ({ ...e, idx }));
        } catch (err) {
            console.log(err);
            return rejectWithValue(getError(err));
        }
    }
);

export const createMeetingScoreObjects = createAsyncThunk(
    "auditSlice/createMeetingScoreObjects",
    async ({ id, template_id }, { getState, rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(
                `/audit/score/create_list/${id}/?template_id=${template_id}`
            );
            let deductionList = [];
            const scoreObjects = res.data.map((e, idx) => ({ ...e, idx }));
            for (let score_obj of scoreObjects) {
                if (score_obj?.question_data?.settings?.is_deduction) {
                    deductionList.push(score_obj);
                }
            }
            return scoreObjects.map((e) => {
                return {
                    ...e,
                    calculated_score: calculated_score_from_score_given({
                        score_value: e.score_given,
                        question: e.question_data,
                        deduction_score_objects: deductionList,
                    }),
                };
            });
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getMeetingTemplates = createAsyncThunk(
    "auditSlice/getMeetingTemplates",
    async (id, { getState, rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`audit/templates/${id}/`);
            return res.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(getError(err));
        }
    }
);

export const getMeetingAiScoreStatus = createAsyncThunk(
    "auditSlice/getMeetingAiScoreStatus",
    async ({ id, payload }, { getState, rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`audit/score/status/${id}/`, {
                status_for: "ai",
                ...payload,
            });
            return res.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(getError(err));
        }
    }
);

export const getMeetingManualScoreStatus = createAsyncThunk(
    "auditSlice/getMeetingManualScoreStatus",
    async ({ id, payload }, { getState, rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(`audit/score/status/${id}/`, {
                status_for: "manual",
                ...payload,
            });
            return res.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(getError(err));
        }
    }
);

export const createScoreObject = createAsyncThunk(
    "auditSlice/createScoreObject",
    async (
        { type, payload, deduction_score_list },
        { getState, rejectWithValue, dispatch }
    ) => {
        const currentList = [...getState().auditSlice?.score_objects?.data];
        try {
            // dispatch(setMeetingScoreObjects(updatedList));
            dispatch(
                setSavingResponse({
                    ...(type === "note" && { savingNote: true }),
                    question_id: payload?.question,
                    savingResponse: true,
                    savingMedia: false,
                })
            );
            const res = await axiosInstance.post(
                "audit/score/create/",
                payload
            );
            return {
                id_to_update: res?.data?.id,
                score_list: [
                    ...currentList,
                    {
                        ...res?.data,
                        calculated_score: calculated_score_from_score_given({
                            score_value: res?.data?.score_given,
                            question: res?.data?.question_data,
                            deduction_score_objects: deduction_score_list,
                        }),
                    },
                ],
            };
        } catch (err) {
            return rejectWithValue({
                ...getError(err),
                revertData: currentList,
            });
        }
    }
);

export const updateScoreObject = createAsyncThunk(
    "auditSlice/updateScoreObject",
    async (
        { id, type, payload, deduction_score_list },
        { getState, rejectWithValue, dispatch }
    ) => {
        const violation_ids = get_violation_from_repr({
            score_obj: payload,
        });
        const list_of_applicable_violation =
            getState()?.auditSlice?.violations?.data?.filter(({ id }) =>
                violation_ids?.includes(id)
            );
        let current_violations_state = {
            ...getState().auditSlice.violations,
        };

        let new_violations_state = Object.assign({}, current_violations_state);
        const is_template_violation = list_of_applicable_violation?.filter(
            ({ applicability }) => applicability === "template"
        ).length;
        const is_category_violation = list_of_applicable_violation?.filter(
            ({ applicability }) => applicability === "category"
        ).length;

        if (is_template_violation) {
            new_violations_state = {
                ...new_violations_state,
                template_question_with_violation: [
                    ...new_violations_state.template_question_with_violation.filter(
                        (e) => e.id !== payload?.question_data?.id
                    ),
                    payload.question_data,
                ],
                category_question_with_violation: [
                    ...new_violations_state.category_question_with_violation.filter(
                        (e) => e.id !== payload?.question_data?.id
                    ),
                ],
            };
        } else if (is_category_violation) {
            new_violations_state = {
                ...new_violations_state,
                category_question_with_violation: [
                    ...new_violations_state.category_question_with_violation.filter(
                        (e) => e.id !== payload?.question_data?.id
                    ),
                    payload?.question_data,
                ],
            };
        } else {
            new_violations_state = {
                ...new_violations_state,
                category_question_with_violation: [
                    ...new_violations_state.category_question_with_violation.filter(
                        (e) => e.id !== payload?.question_data?.id
                    ),
                ],
                template_question_with_violation: [
                    ...new_violations_state.template_question_with_violation.filter(
                        (e) => e.id !== payload?.question_data?.id
                    ),
                ],
            };
        }

        let currentList = [...getState().auditSlice?.score_objects?.data];
        let updatedList = currentList.map((obj) => {
            if (+id === +obj.id)
                return {
                    ...payload,
                    idx: obj.idx,
                    calculated_score: list_of_applicable_violation?.length
                        ? 0
                        : calculated_score_from_score_given({
                              score_value: payload.score_given,
                              question: obj.question_data,
                              deduction_score_objects: deduction_score_list,
                          }),
                    error: false,
                };
            return {
                ...obj,
                calculated_score: calculated_score_from_score_given({
                    score_value: obj.score_given,
                    question: obj?.question_data,
                    deduction_score_objects: deduction_score_list,
                }),
            };
        });

        const currentScore = getState().auditSlice.manual_score.data;

        try {
            dispatch(setMeetingScoreObjects(updatedList));
            dispatch(setActiveViolationState(new_violations_state));
            dispatch(
                setSavingResponse({
                    ...(type === "note" && { savingNote: true }),
                    question_id: payload?.question,
                    savingResponse: true,
                    savingMedia: false,
                })
            );
            dispatch(
                setMeetingManualScore({
                    ...currentScore,
                    scores: getScoreData({
                        scoreQs: updatedList?.filter((e) => !e?.is_ai_rated),
                        ...new_violations_state,
                    }),
                })
            );
            const res = await axiosInstance.patch(
                `audit/score/update/${id}/`,
                payload
            );
            return {
                id_to_update: id,
                score_list: [
                    ...updatedList?.map((e) =>
                        res.data?.id !== e?.id ? e : { idx: e.idx, ...res.data }
                    ),
                ],
                violations: getState()?.auditSlice?.violations?.data,
            };
        } catch (err) {
            // dispatch(setMeetingScoreObjects(currentList));
            return rejectWithValue({
                ...getError(err),
                revertData: currentList,
                revertViolations: current_violations_state,
                revert_score: currentScore,
            });
        }
    }
);

export const updateMeetingScoreNotesMedia = createAsyncThunk(
    "auditSlice/updateMeetingScoreNotesMedia",
    async (
        { id, question_id, media },
        { getState, rejectWithValue, dispatch }
    ) => {
        try {
            dispatch(
                setSavingResponse({
                    savingNote: false,
                    question_id: question_id,
                    savingResponse: true,
                    savingMedia: true,
                })
            );
            const res = await axiosInstance.patch(
                `audit/score/media/${id}/`,
                media,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const deleteMeetingScoreNotesMedia = createAsyncThunk(
    "auditSlice/deleteMeetingScoreNotesMedia",
    async ({ id }, { getState, rejectWithValue, dispatch }) => {
        try {
            const res = await axiosInstance.delete(`audit/score/media/${id}/`);
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getMeetingAuditViolations = createAsyncThunk(
    "auditSlice/getMeetingAuditViolations",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/audit/violation/list_all/`);
            return res?.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const completeMeetingAudit = createAsyncThunk(
    "auditSlice/completeMeetingAudit",
    async (
        { id, payload, submit },
        { getState, rejectWithValue, dispatch }
    ) => {
        try {
            const res = await axiosInstance.post(`/audit/score/status/${id}/`, {
                ...payload,
                ...(submit && { submit: 1 }),
            });
            submit &&
                res.data?.status &&
                getState().auditSlice?.is_audit_incomplete &&
                dispatch(setAuditIsComplete(false));
            submit && !res.status && dispatch(setAuditIsComplete(true));

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const createManualQmsCallRequest = createAsyncThunk(
    "auditSlice/calendar/qms/",
    async (payload, { getState, rejectWithValue, dispatch }) => {
        try {
            const res = await axiosInstance.post(`/calendar/qms/`, payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const createUserQms = createAsyncThunk(
    "auditSlice/person/person/qms/",
    async (payload, { getState, rejectWithValue, dispatch }) => {
        try {
            const res = await axiosInstance.post(`/person/qms/`, payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

const auditSlice = createSlice({
    name: "auditSlice",
    initialState,
    reducers: {
        setMeetingAuditTemplate(state, action) {
            state.audit_template = action.payload;
        },
        setMeetingAiScore(state, action) {
            state.ai_score.data = action.payload;
        },
        setMeetingManualScore(state, action) {
            state.manual_score.data = action.payload;
        },
        setMeetingScoreObjects(state, action) {
            state.score_objects.data = action.payload;
        },
        setSavingResponse(state, action) {
            state.saving_state = action.payload;
        },
        setAuditIsComplete(state, action) {
            state.is_audit_incomplete = action.payload;
        },
        setActiveViolationState(state, action) {
            state.violations = {
                ...state.violations,
                ...action.payload,
            };
        },
        setDedctionScoreObject(state, action) {
            state.deduction_score_objects = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(listMeetingScores.pending, (state, action) => {
            state.loading = true;
            state.score_objects.data = [];
            state.violations.template_question_with_violation = [];
            state.violations.category_question_with_violation = [];
        });
        builder.addCase(listMeetingScores.fulfilled, (state, action) => {
            state.score_objects.data = [...action.payload];
            state.loading = false;
        });
        builder.addCase(listMeetingScores.rejected, (state, { payload }) => {
            state.loading = false;
            openNotification("error", "Error", payload?.message);
        });
        builder.addCase(getMeetingTemplates.pending, (state, action) => {
            state.meeting_templates.loading = true;
        });
        builder.addCase(getMeetingTemplates.fulfilled, (state, action) => {
            state.meeting_templates.data = [...action.payload];
            state.meeting_templates.loading = false;
        });
        builder.addCase(getMeetingTemplates.rejected, (state, { payload }) => {
            state.meeting_templates.loading = false;
            openNotification("error", "Error", payload?.message);
        });
        builder.addCase(getMeetingAiScoreStatus.pending, (state, action) => {
            state.ai_score.loading = true;
        });
        builder.addCase(getMeetingAiScoreStatus.fulfilled, (state, action) => {
            state.ai_score.data = action.payload;
            state.ai_score.loading = false;
        });
        builder.addCase(
            getMeetingAiScoreStatus.rejected,
            (state, { payload }) => {
                state.ai_score.loading = false;
                openNotification("error", "Error", payload?.message);
            }
        );
        builder.addCase(
            getMeetingManualScoreStatus.pending,
            (state, action) => {
                state.manual_score.loading = true;
            }
        );
        builder.addCase(
            getMeetingManualScoreStatus.fulfilled,
            (state, action) => {
                state.manual_score.data = action.payload;
                state.manual_score.loading = false;
            }
        );
        builder.addCase(
            getMeetingManualScoreStatus.rejected,
            (state, { payload }) => {
                state.manual_score.loading = false;
                openNotification("error", "Error", payload?.message);
            }
        );
        builder.addCase(createMeetingScoreObjects.pending, (state, action) => {
            state.score_objects.loading = true;
            state.score_objects.data = [];
            state.violations.template_question_with_violation = [];
            state.violations.category_question_with_violation = [];
        });
        builder.addCase(
            createMeetingScoreObjects.fulfilled,
            (state, action) => {
                state.score_objects.data = action.payload;
                state.score_objects.loading = false;
            }
        );
        builder.addCase(
            createMeetingScoreObjects.rejected,
            (state, { payload }) => {
                state.score_objects_loading = false;
                openNotification("error", "Error", payload?.message);
            }
        );
        builder.addCase(createScoreObject.pending, (state, action) => {});
        builder.addCase(createScoreObject.fulfilled, (state, action) => {
            state.saving_state = {
                ...initialState.saving_state,
            };
            state.score_objects.data = [...action.payload.score_list];
        });
        builder.addCase(createScoreObject.rejected, (state, { payload }) => {
            state.saving_state = {
                ...initialState.saving_state,
            };
            state.score_objects.data = payload.revertData;
            openNotification("error", "Error", payload?.message);
        });
        builder.addCase(updateScoreObject.pending, (state, action) => {});
        builder.addCase(updateScoreObject.fulfilled, (state, action) => {
            state.saving_state = {
                ...initialState.saving_state,
            };

            // const score_obj = action.payload.score_list.find(
            //     (e) => e.id === action.payload.id_to_update
            // );
            // state.score_objects.data = [...action.payload.score_list];
        });
        builder.addCase(updateScoreObject.rejected, (state, { payload }) => {
            state.saving_state = {
                ...initialState.saving_state,
            };
            state.score_objects.data = payload.revertData;
            state.violations = payload.revertViolations;
            state.manual_score.data = payload.revert_score;
            openNotification("error", "Error", payload?.message);
        });
        builder.addCase(
            updateMeetingScoreNotesMedia.pending,
            (state, action) => {}
        );
        builder.addCase(
            updateMeetingScoreNotesMedia.fulfilled,
            (state, action) => {
                state.saving_state = {
                    ...initialState.saving_state,
                };
                state.score_objects.data = state.score_objects.data.map((e) =>
                    e.id === action.payload.id ? { ...e, ...action.payload } : e
                );
            }
        );
        builder.addCase(
            updateMeetingScoreNotesMedia.rejected,
            (state, { payload }) => {
                state.saving_state = {
                    ...initialState.saving_state,
                };
                openNotification("error", "Error", payload?.message);
            }
        );
        builder.addCase(
            deleteMeetingScoreNotesMedia.pending,
            (state, action) => {}
        );
        builder.addCase(
            deleteMeetingScoreNotesMedia.fulfilled,
            (state, action) => {
                state.saving_state = {
                    ...initialState.saving_state,
                };

                state.score_objects.data = state.score_objects.data.map((e) =>
                    e.id === action.payload.id
                        ? { ...e, media: null, media_type: null }
                        : e
                );
            }
        );
        builder.addCase(
            deleteMeetingScoreNotesMedia.rejected,
            (state, { payload }) => {
                state.saving_state = {
                    ...initialState.saving_state,
                };
                openNotification("error", "Error", payload?.message);
            }
        );
        builder.addCase(completeMeetingAudit.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(completeMeetingAudit.fulfilled, (state, action) => {
            state.loading = false;
            state.manual_score.data = action.payload;
        });
        builder.addCase(completeMeetingAudit.rejected, (state, { payload }) => {
            state.loading = false;
            openNotification("error", "Error", payload?.message);
        });
        builder.addCase(getMeetingAuditViolations.pending, (state, action) => {
            state.violations.loading = true;
        });
        builder.addCase(
            getMeetingAuditViolations.fulfilled,
            (state, action) => {
                state.violations.loading = false;
                state.violations.data = action.payload;
            }
        );
        builder.addCase(
            getMeetingAuditViolations.rejected,
            (state, { payload }) => {
                state.violations.loading = false;
                openNotification("error", "Error", payload?.message);
            }
        );
        builder.addCase(createManualQmsCallRequest.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(
            createManualQmsCallRequest.fulfilled,
            (state, action) => {
                state.loading = false;
                // state.data = action.payload;
            }
        );
        builder.addCase(
            createManualQmsCallRequest.rejected,
            (state, { payload }) => {
                state.loading = false;
                openNotification("error", "Error", payload?.message);
            }
        );
        builder.addCase(createUserQms.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(createUserQms.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(createUserQms.rejected, (state, { payload }) => {
            state.loading = false;
            openNotification("error", "Error", payload?.message);
        });
    },
});

export const {
    setMeetingAuditTemplate,
    setMeetingAiScore,
    setMeetingManualScore,
    setSavingResponse,
    setMeetingScoreObjects,
    setAuditIsComplete,
    setActiveViolationState,
    setDedctionScoreObject,
} = auditSlice.actions;

export default auditSlice.reducer;
