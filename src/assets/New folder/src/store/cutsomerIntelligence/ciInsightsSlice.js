import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "@apis/common/index";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openNotification } from "@store/common/actions";

const initialState = {
    reasons: {
        loading: true,
        data: [],
        total_calls: 0,
        analysed_calls: 0,
        insights: 0,
    },
    objection: {
        loading: true,
        data: [],
        total_calls: 0,
        analysed_calls: 0,
        insights: 0,
    },
    question: {
        loading: true,
        data: [],
        total_calls: 0,
        analysed_calls: 0,
        insights: 0,
    },
    feature: {
        loading: true,
        data: [],
        total_calls: 0,
        analysed_calls: 0,
        insights: 0,
    },
    competition: {
        loading: true,
        data: [],
        total_calls: 0,
        analysed_calls: 0,
        insights: 0,
    },
    geo: {
        loading: true,
        data: [],
        total_calls: 0,
        analysed_calls: 0,
        insights: 0,
        map_data: [],
    },
    sentiment: {
        loading: true,
        data: [],
        total_calls: 0,
        analysed_calls: 0,
        insights: 0,
        map_data: [],
    },
    details: {
        loading: true,
        data: [],
        total_calls: 0,
        analysed_calls: 0,
        insights: 0,
        map_data: [],
    },
    insightStats: {
        loading: true,
        data: {},
    },
    insightTopics: {
        loading: true,
        data: {},
    },
    snippetsInitialLoad: false,
    snippets: [],
    nextSnippetsUrl: null,
};

export const getCIInsightReasons = createAsyncThunk(
    "CI/getCIInsightReasons",
    async (payload = {}, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `/customer_intelligence/insight/reason/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getCIInsightObjection = createAsyncThunk(
    "CI/getCIInsightObjection",
    async (payload = {}, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `/customer_intelligence/insight/objection/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getCIInsightQuestion = createAsyncThunk(
    "CI/getCIInsightQuestion",
    async (payload = {}, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `/customer_intelligence/insight/question/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getCIInsightFeature = createAsyncThunk(
    "CI/getCIInsightFeature",
    async (payload = {}, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `/customer_intelligence/insight/feature/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getCIInsightCompetition = createAsyncThunk(
    "CI/getCIInsightCompetition",
    async (payload = {}, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `/customer_intelligence/insight_detail_view/competition/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getCIInsightSentiment = createAsyncThunk(
    "CI/getCIInsightSentiment",
    async (payload = {}, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `/customer_intelligence/insight/sentiment/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getCIInsightGeo = createAsyncThunk(
    "CI/getCIInsightGeo",
    async (map = "india", { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `/customer_intelligence/geoinsight/${map}/`
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getCIInsightInDetail = createAsyncThunk(
    "CI/getCIInsightInDetail",
    async ({ type, payload }, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `/customer_intelligence/insight_detail_view/${type}/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getCIInsightStats = createAsyncThunk(
    "CI/getCIInsightStats",
    async ({ id, payload }, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `/customer_intelligence/insight_stats/${id}/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);
export const getCIInsightTopic = createAsyncThunk(
    "CI/getCIInsightTopic",
    async ({ id, payload }, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                `/customer_intelligence/topics/${id}/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getCIInsightSnippets = createAsyncThunk(
    "CIInsights/getCIInsightSnippets",
    async ({ id, next, payload }, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(
                next || `customer_intelligence/insight_snippets/${id}/`,
                payload
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getCIInsightTypeSnippets = createAsyncThunk(
    "CIInsights/getCIInsightSnippets",
    async (
        { id, title, type, payload, next },
        { rejectWithValue, getState }
    ) => {
        const noneCheck = type?.toString()?.toLowerCase() === "none" ? 0 : type;
        try {
            const res = await axiosInstance.post(
                next ||
                    `/customer_intelligence/stats_snippets/insight/${id}/${title}/${noneCheck}/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getCIInsightTopicSnippets = createAsyncThunk(
    "CIInsights/getCIInsightTopicSnippets",
    async (
        { insight_id, topic_id, next, payload },
        { rejectWithValue, getState }
    ) => {
        try {
            const res = await axiosInstance.post(
                next ||
                    `customer_intelligence/topic_snippets/${insight_id}/${topic_id}/`,
                payload
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

const CIInsightsSlice = createSlice({
    name: "CIInsightsSlice",
    initialState,
    reducers: {
        clearCISnippets(state, action) {
            state.snippets = [];
            state.nextSnippetsUrl = action.next;
        },
        setSnippetsInitialLoad(state, action) {
            state.snippetsInitialLoad = action;
        },
    },
    extraReducers: {
        [getCIInsightReasons.pending]: (state, { payload }) => {
            state.reasons.loading = true;
        },
        [getCIInsightReasons.fulfilled]: (state, { payload }) => {
            state.reasons.loading = false;
            state.reasons = { ...state.reasons, ...payload };
        },
        [getCIInsightReasons.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.reasons = {
                loading: false,
                data: [],
                total_calls: 0,
                analysed_calls: 0,
                insights: 0,
            };
            openNotification("error", "Error", payload?.message);
        },
        [getCIInsightObjection.pending]: (state, { payload }) => {
            state.objection.loading = true;
        },
        [getCIInsightObjection.fulfilled]: (state, { payload }) => {
            state.objection.loading = false;
            state.objection = { ...state.objection, ...payload };
        },
        [getCIInsightObjection.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.objection = {
                loading: false,
                data: [],
                total_calls: 0,
                analysed_calls: 0,
                insights: 0,
            };

            openNotification("error", "Error", payload?.message);
        },
        [getCIInsightQuestion.pending]: (state, { payload }) => {
            state.question.loading = true;
        },
        [getCIInsightQuestion.fulfilled]: (state, { payload }) => {
            state.question.loading = false;
            state.question = { ...state.question, ...payload };
        },
        [getCIInsightQuestion.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.question = {
                loading: false,
                data: [],
                total_calls: 0,
                analysed_calls: 0,
                insights: 0,
            };

            openNotification("error", "Error", payload?.message);
        },
        [getCIInsightFeature.pending]: (state, { payload }) => {
            state.feature.loading = true;
        },
        [getCIInsightFeature.fulfilled]: (state, { payload }) => {
            state.feature.loading = false;
            state.feature = { ...state.feature, ...payload };
        },
        [getCIInsightFeature.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.feature = {
                loading: false,
                data: [],
                total_calls: 0,
                analysed_calls: 0,
                insights: 0,
            };
            if (!payload) {
                return;
            }
            openNotification("error", "Error", payload?.message);
        },
        [getCIInsightCompetition.pending]: (state, { payload }) => {
            state.competition.loading = true;
        },
        [getCIInsightCompetition.fulfilled]: (state, { payload }) => {
            state.competition.loading = false;
            state.competition = { ...state.competition, ...payload };
        },
        [getCIInsightCompetition.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.competition = {
                loading: false,
                data: [],
                total_calls: 0,
                analysed_calls: 0,
                insights: 0,
            };

            state.competition.loading = false;

            openNotification("error", "Error", payload?.message);
        },
        [getCIInsightSentiment.pending]: (state, { payload }) => {
            state.sentiment.loading = true;
        },
        [getCIInsightSentiment.fulfilled]: (state, { payload }) => {
            state.sentiment.loading = false;
            state.sentiment = { ...state.sentiment, ...payload };
        },
        [getCIInsightSentiment.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.sentiment = {
                loading: false,
                data: [],
                total_calls: 0,
                analysed_calls: 0,
                insights: 0,
            };

            openNotification("error", "Error", payload?.message);
        },
        [getCIInsightGeo.pending]: (state, { payload }) => {
            state.geo.loading = true;
        },
        [getCIInsightGeo.fulfilled]: (state, { payload }) => {
            state.geo.loading = false;
            state.geo = { ...state.geo, ...payload };
        },
        [getCIInsightGeo.rejected]: (state, { payload }) => {
            state.geo.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getCIInsightInDetail.pending]: (state, { payload }) => {
            state.details.loading = true;
        },
        [getCIInsightInDetail.fulfilled]: (state, { payload }) => {
            state.details.loading = false;
            state.details = { ...payload };
        },
        [getCIInsightInDetail.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.details = {
                loading: false,
                data: [],
                total_calls: 0,
                analysed_calls: 0,
                insights: 0,
                map_data: [],
            };

            openNotification("error", "Error", payload?.message);
        },
        [getCIInsightStats.pending]: (state, { payload }) => {
            state.insightStats.loading = true;
        },
        [getCIInsightStats.fulfilled]: (state, { payload }) => {
            state.insightStats.loading = false;
            state.insightStats.data = payload;
        },
        [getCIInsightStats.rejected]: (state, { payload }) => {
            state.insightStats.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getCIInsightTopic.pending]: (state, { payload }) => {
            state.insightTopics.loading = true;
        },
        [getCIInsightTopic.fulfilled]: (state, { payload }) => {
            state.insightTopics.loading = false;
            state.insightTopics.data = payload;
        },
        [getCIInsightTopic.rejected]: (state, { payload }) => {
            state.insightTopics.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getCIInsightSnippets.pending]: (state, { payload }) => {
            // state.insightTopics.loading = true;
        },
        [getCIInsightSnippets.fulfilled]: (state, { payload }) => {
            state.snippetsInitialLoad = false;
            state.snippets = [...state.snippets, ...payload.results];
            state.nextSnippetsUrl = payload.next;
        },
        [getCIInsightSnippets.rejected]: (state, { payload }) => {
            state.snippetsInitialLoad = false;
            openNotification("error", "Error", payload?.message);
        },
        [getCIInsightTypeSnippets.pending]: (state, { payload }) => {
            // state.insightTopics.loading = true;
        },
        [getCIInsightTypeSnippets.fulfilled]: (state, { payload }) => {
            state.snippetsInitialLoad = false;
            state.snippets = [...state.snippets, ...payload.results];
            state.nextSnippetsUrl = payload.next;
        },
        [getCIInsightTypeSnippets.rejected]: (state, { payload }) => {
            state.snippetsInitialLoad = false;
            openNotification("error", "Error", payload?.message);
        },
        [getCIInsightTopicSnippets.pending]: (state, { payload }) => {
            // state.insightTopics.loading = true;
        },
        [getCIInsightTopicSnippets.fulfilled]: (state, { payload }) => {
            state.snippetsInitialLoad = false;
            state.snippets = [...state.snippets, ...payload.results];
            state.nextSnippetsUrl = payload.next;
        },
        [getCIInsightTopicSnippets.rejected]: (state, { payload }) => {
            state.snippetsInitialLoad = false;
            openNotification("error", "Error", payload?.message);
        },
    },
});
export const { clearCISnippets, setSnippetsInitialLoad } =
    CIInsightsSlice.actions;
export default CIInsightsSlice.reducer;
