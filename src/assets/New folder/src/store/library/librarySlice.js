import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "@apis/common/index";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openNotification } from "@store/common/actions";
import { Form } from "antd";
import {
    LibCategories,
    LibMeetings,
} from "app/components/Library/__mock__/mockData";
// import initialState from '../initialState';
const initialState = {
    loader: false,
    categories: [],
    subcategories: [],
    selectedFolder: 0,
    activeSubCategory: 0,
    error: {
        status: false,
        message: "",
    },
    create_success: false,
    meetings: {
        loader: true,
        snippets: [],
        error: "",
    },
    uploads: {
        loader: true,
        media: [],
        error: "",
    },
    sample: false,

    filesToUpload: {},
    filesLoader: {},
    fileStatus: {},
    assessment: {
        loader: false,
        assessmentsList: [],
        formData: {},
        error: "",
    },
};

// export const STORE_CATEGORIES = 'storeCategories';
export const SET_SELECTEDCATEGORY = "SetSelectedCategory";
export const STORE_SUBCATEGORIES = "StoreSubCategories";
export const SET_ACTIVE_SUBFOLDER = "SETACTIVESUBFOLDER";
export const SELECT_FOLDER = "SELECTFOLDER";
export const SET_MEETINGS = "SET_MEETINGS";
export const SET_IS_SAMPLE = "SET_IS_SAMPLE";

const config = {
    category: "library/category/list/?all_library=true",
    meeting: "library/meeting/",
    category_update: "library/category/update/",
    meeting_update: "library/meeting/update/",
    delete_folder: "library/category/destroy/",
    shareFolder: "library/category/share/",
    createCategory: "library/category/create/",
    upload_media: "library/file_upload/",
    delete_upload: "library/file_upload_delete/",
    createForm: "coachings/forms/create/",
    updateForm: "coachings/forms/update/",
    assessementList: "coachings/assessments/",
};

export const createGoogleForm = createAsyncThunk(
    "/coachings/forms/create/",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.post(`/${config.createForm}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getGoogleForm = createAsyncThunk(
    "/coachings/forms/create/",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.get(
                `/${config.assessementList}${payload.assessment_id}/`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const deleteAssessment = createAsyncThunk(
    "/coachings/assessments/delete",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.delete(
                `/${config.assessementList}${payload}/`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const deleteQuestion = createAsyncThunk(
    "/coachings/forms/deleteQuestion/",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.post(
                `/coachings/forms/${payload.assessment_id}/update/`,
                payload.data
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const createUpdateQuestion = createAsyncThunk(
    "​/coachings/forms/assessment_id/update/",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.post(
                `/coachings/forms/${payload.assessment_id}/update/`,
                payload.data
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

// export const updateForm= createAsyncThunk(
//     '​/coachings/forms/assessment_id/update/',
//     async (payload, { rejectWithValue, getState, dispatch }) => {
//         try {
//             const res = await axiosInstance.post(`​/coachings/forms/${payload.assessment_id}/update/`, payload.data);
//             // console.log(res.data)
//             return res.data;
//         } catch (err) {
//             return rejectWithValue(getError(err));
//         }
//     }
// );

export const updateGoogleForm = createAsyncThunk(
    "/coachings/forms/update/",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.get(`/${config.updateForm}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getAssessmentList = createAsyncThunk(
    "/coachings/assessments/",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.get(`/${config.assessementList}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getCategories = createAsyncThunk(
    "library/category/list/?all_library=true",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.get(`/${config.category}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);
export const createCategory = createAsyncThunk(
    "library/category/create/",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.post(`/${config.createCategory}`, {
                name: payload,
            });
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);
export const getMeetings = createAsyncThunk(
    "library/meeting/?category/snippets",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.get(
                `/${config.meeting}?category=${payload}&media_type=SN`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);
export const getUploads = createAsyncThunk(
    "library/meeting/category/uploads",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.get(
                `/${config.meeting}?category=${payload}&media_type=UP`
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);
export const updateFolderName = createAsyncThunk(
    "library/category/update/folder_name",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.patch(
                `/${config.category_update}${payload.id}/`,
                { name: payload.category }
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);
export const deleteFolder = createAsyncThunk(
    "library/meeting/destroy",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.delete(
                `/${config.delete_folder}${payload}/`
            );
            return payload;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);
export const deleteSnippet = createAsyncThunk(
    "library/meeting/delete/",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.delete(
                `/${config.meeting_update}${payload}/`
            );
            return payload;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);
export const deleteUploads = createAsyncThunk(
    "library/file_upload_delete/",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const res = await axiosInstance.delete(
                `/${config.delete_upload}${payload}/`
            );
            let data = res.data;
            return { data: data, up_id: payload };
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);
export const uploadMedia = createAsyncThunk(
    "library/meeting/uploads/",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            // console.log(payload.data.get('media').name)
            dispatch(setFileLoader(payload.data.get("media").name));
            dispatch(
                setStatus({
                    [payload.data.get("media").name]: {
                        success: false,
                        error: false,
                        progress: 0,
                    },
                })
            );
            let configuration = {
                onUploadProgress: (progressEvent) => {
                    let percentCompleted = Math.floor(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    // payload.updateCallProgress(percentCompleted);
                    dispatch(
                        setStatus({
                            [payload.data.get("media").name]: {
                                success: false,
                                error: false,
                                progress: percentCompleted,
                            },
                        })
                    );
                    // if (percentCompleted === 100)
                    //     setTimeout(() => {
                    //         payload.updateCallProgress(0);
                    //     }, 3000);
                },
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };
            // let configuration = {
            //     onDownloadProgress: (progressEvent) => {
            //         let percentCompleted = Math.floor(
            //             (progressEvent.loaded * 100) / progressEvent.total
            //         );
            //         payload.updateCallProgress(percentCompleted);
            //     }
            // }
            const res = await axiosInstance.post(
                `/${config.upload_media}`,
                payload.data,
                configuration
            );
            dispatch(removeFileLoader(payload.data.get("media").name));
            dispatch(
                setStatus({
                    [payload.data.get("media").name]: {
                        success: true,
                        error: false,
                        progress: 0,
                    },
                })
            );
            return res.data;
        } catch (err) {
            dispatch(removeFileLoader(payload.data.get("media").name));
            dispatch(
                setStatus({
                    [payload.data.get("media").name]: {
                        success: false,
                        error: true,
                        progress: 0,
                    },
                })
            );
            return rejectWithValue(getError(err));
        }
    }
);

const librarySlice = createSlice({
    name: "library",
    initialState,
    reducers: {
        setInitialState(state, action) {
            state.assessment.formData = action.payload;
        },
        setSelectedFolder(state, action) {
            state.selectedFolder = action.payload;
        },
        storeMeetings(state, action) {
            state.meetings.snippets = action.payload;
        },
        setFileLoader(state, { payload }) {
            state.filesLoader = {
                ...state.filesLoader,
                [payload]: true,
            };
        },
        removeFileLoader(state, { payload }) {
            state.filesLoader = {
                ...state.filesLoader,
                [payload]: false,
            };
        },
        setStatus(state, { payload }) {
            state.fileStatus = {
                ...state.fileStatus,
                ...payload,
            };
        },
        setFilesToUpload(state, { payload }) {
            state.filesToUpload = payload;
        },
    },
    extraReducers: {
        [getCategories.pending]: (state) => {
            state.loader = true;
        },
        [getCategories.fulfilled]: (state, { payload }) => {
            state.loader = false;
            if (payload?.results.length) state.categories = payload?.results;
            if (window.location.pathname.includes("resources")) {
                let temp = window.location.pathname.split("/")[3];
                if (temp) state.selectedFolder = temp;
            }
        },
        [getCategories.rejected]: (state, { payload }) => {
            state.loader = false;
            openNotification("error", "Error", payload?.message);
        },
        [createCategory.pending]: (state) => {
            state.loader = false;
        },
        [createCategory.fulfilled]: (state, { payload }) => {
            state.loader = false;
            openNotification(
                "success",
                "Success",
                "Folder created successfully!"
            );

            if (state.categories?.length)
                state.categories = [...state.categories, payload];
            else {
                state.categories = [payload];
            }
            state.selectedFolder = payload.id;
            state.sample = false;
        },
        [createCategory.rejected]: (state, { payload }) => {
            state.loader = false;
            openNotification("error", "Error", payload?.message);
        },
        [getMeetings.pending]: (state) => {
            state.meetings.loader = true;
        },
        [getMeetings.fulfilled]: (state, { payload }) => {
            state.meetings.loader = false;
            state.meetings.snippets = payload.results;
        },
        [getMeetings.rejected]: (state, { payload }) => {
            state.meetings.loader = false;
            state.meetings.error = payload?.message;
            openNotification("error", "Error", payload?.message);
        },
        [getUploads.pending]: (state) => {
            state.uploads.loader = true;
        },
        [getUploads.fulfilled]: (state, { payload }) => {
            state.uploads.loader = false;
            state.uploads.media = payload.results;
        },
        [getUploads.rejected]: (state, { payload }) => {
            state.uploads.loader = false;
            state.uploads.error = payload?.message;
            openNotification("error", "Error", payload?.message);
        },
        [deleteSnippet.pending]: (state) => {
            state.meetings.loader = false;
        },
        [deleteSnippet.fulfilled]: (state, { payload }) => {
            state.meetings.loader = false;
            state.meetings.snippets = state.meetings.snippets.filter(
                (snippet) => snippet.id !== payload
            );
            openNotification(
                "success",
                "Success",
                "Meeting deleted successfully"
            );
        },
        [deleteSnippet.rejected]: (state, { payload }) => {
            state.meetings.loader = false;
            state.meetings.error = payload?.message;
            openNotification("error", "Error", payload?.message);
        },
        [deleteFolder.pending]: (state) => {
            state.loader = false;
        },
        [deleteFolder.fulfilled]: (state, { payload }) => {
            state.loader = false;
            state.categories = state.categories.filter(
                (category) => category.id !== payload
            );
            openNotification(
                "success",
                "Success",
                "Folder deleted successfully"
            );
        },
        [deleteFolder.rejected]: (state, { payload }) => {
            state.loader = false;
            state.error.message = payload?.message;
            openNotification("error", "Error", payload?.message);
        },
        [deleteUploads.pending]: (state) => {
            state.uploads.loader = false;
        },
        [deleteUploads.fulfilled]: (state, { payload }) => {
            state.uploads.loader = false;
            state.uploads.media = state.uploads.media.filter(
                (item) => item.id !== payload.up_id
            );
            openNotification(
                "success",
                "Success",
                "Media deleted successfully"
            );
        },
        [deleteUploads.rejected]: (state, { payload }) => {
            state.uploads.loader = false;
            state.uploads.error = payload?.message;
            openNotification("error", "Error", payload?.message);
        },
        [updateFolderName.pending]: (state) => {
            state.loader = false;
        },
        [updateFolderName.fulfilled]: (state, { payload }) => {
            state.loader = false;
            let currentIdx = state.categories.findIndex((category) => {
                if (category.id === payload?.id) category.name = payload?.name;
            });
            openNotification("success", "Success", "Name changed successfully");
        },
        [updateFolderName.rejected]: (state, { payload }) => {
            state.meetings.loader = false;
            state.meetings.error = payload?.message;
            openNotification("error", "Error", payload?.message);
        },
        [uploadMedia.pending]: (state) => {
            // state.meetings.loader = true;
        },
        [uploadMedia.fulfilled]: (state, { payload }) => {
            state.uploads.loader = false;
            state.uploads.media = [...state.uploads.media, payload];
            // state.uploads.media = payload.results;
        },
        [uploadMedia.rejected]: (state, { payload }) => {
            state.uploads.loader = false;
            state.meetings.error = payload?.message;
            openNotification("error", "Error", payload?.message);
        },
        [createGoogleForm.pending]: (state) => {
            state.assessment.loader = true;
        },
        [createGoogleForm.fulfilled]: (state, { payload }) => {
            state.assessment.loader = false;
            state.assessment.formData = payload;
        },
        [createGoogleForm.rejected]: (state, { payload }) => {
            state.assessment.loader = false;
            state.assessment.error = payload?.message;
            openNotification("error", "Error", payload?.message);
        },
        [getGoogleForm.pending]: (state) => {
            state.assessment.loader = true;
        },
        [getGoogleForm.fulfilled]: (state, { payload }) => {
            state.assessment.loader = false;
            state.assessment.formData = payload;
        },
        [getGoogleForm.rejected]: (state, { payload }) => {
            state.assessment.loader = false;
            state.assessment.error = payload?.message;
            openNotification("error", "Error", payload?.message);
        },
        [updateGoogleForm.pending]: (state) => {
            state.assessment.loader = true;
        },
        [updateGoogleForm.fulfilled]: (state, { payload }) => {
            state.assessment.loader = false;
            state.assessment.formData = payload;
        },
        [updateGoogleForm.rejected]: (state, { payload }) => {
            state.assessment.loader = false;
            state.assessment.error = payload?.message;
            openNotification("error", "Error", payload?.message);
        },
        [createUpdateQuestion.pending]: (state) => {
            state.assessment.loader = true;
        },
        [createUpdateQuestion.fulfilled]: (state, { payload }) => {
            state.assessment.loader = false;
            state.assessment.formData = {
                ...state.assessment.formData,
                form_data: payload.form,
            };
            openNotification("success", "Success", "Form updated successfully");
        },
        [createUpdateQuestion.rejected]: (state, { payload }) => {
            state.assessment.loader = false;
            state.assessment.error = payload?.message;
            openNotification("error", "Error", payload?.message);
        },
        [deleteQuestion.pending]: (state) => {
            state.assessment.loader = true;
        },
        [deleteQuestion.fulfilled]: (state, { payload }) => {
            state.assessment.loader = false;
            state.assessment.formData = {
                ...state.assessment.formData,
                form_data: payload.form,
            };
            openNotification("success", "Success", "Item Removed successfully");
        },
        [deleteQuestion.rejected]: (state, { payload }) => {
            state.assessment.loader = false;
            state.assessment.error = payload?.message;
            openNotification("error", "Error", payload?.message);
        },
        [deleteAssessment.pending]: (state) => {
            state.assessment.loader = true;
        },
        [deleteAssessment.fulfilled]: (state, { payload }) => {
            state.assessment.loader = false;
            state.assessment.assessmentsList =
                state.assessment.assessmentsList.filter(
                    (item) => item.id !== payload.id
                );
            openNotification("success", "Success", "Form deleted successfully");
        },
        [deleteAssessment.rejected]: (state, { payload }) => {
            state.assessment.loader = false;
            state.assessment.error = payload?.message;
            openNotification("error", "Error", payload?.message);
        },
        [getAssessmentList.pending]: (state) => {
            state.assessment.loader = true;
        },
        [getAssessmentList.fulfilled]: (state, { payload }) => {
            state.assessment.loader = false;
            state.assessment.assessmentsList = payload;
        },
        [getAssessmentList.rejected]: (state, { payload }) => {
            state.assessment.loader = false;
            state.assessment.error = payload?.message;
            openNotification("error", "Error", payload?.message);
        },
    },
});

export const {
    setSelectedFolder,
    storeMeetings,
    setFileLoader,
    removeFileLoader,
    setStatus,
    setFilesToUpload,
    setInitialState,
} = librarySlice.actions;
export default librarySlice.reducer;
