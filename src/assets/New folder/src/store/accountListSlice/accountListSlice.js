import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "@apis/common/index";
import searchConfig from "@apis/search/config";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openNotification } from "@store/common/actions";
import { prepareSearchData } from "@store/search/utils";

const initialState = {
    loading: false,
    results: [],
    count: 0,
    next: "",
};
// export const fetchAccountsList = (payload, next) => (dispatch, getState) => {
//     next ||
//         dispatch(
//             setAccountsLoader({
//                 mainLoader: true,
//             })
//         );
//     fetcAccountsListApi(getState().common.domain, payload, next).then((res) => {
//         dispatch(
//             setAccountsLoader({
//                 mainLoader: false,
//             })
//         );
//         if (res.status === apiErrors.AXIOSERRORSTATUS) {
//             return showError(res);
//         }

//         dispatch(
//             setAccountsList(
//                 next
//                     ? {
//                           ...res,
//                           results: [
//                               ...getState().accounts.accountsList.results,
//                               ...res.results,
//                           ],
//                       }
//                     : res
//             )
//         );
//     });
// };

export const getAccountList = createAsyncThunk(
    "accountList/getAcc",
    async (payload, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(`/account/list_all/`, payload);
            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);
export const getNextAccountList = createAsyncThunk(
    "accountList/getNextAcc",
    async ({ next, payload }, { rejectWithValue, getState }) => {
        try {
            let url = next?.split(".ai")?.[1];
            const res = await axiosInstance.post(url, payload);
            return res.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(getError(err));
        }
    }
);

const accountListSlice = createSlice({
    name: "accountListSlice",
    initialState,
    reducers: {
        setFetching(state, action) {
            state.loading = action.payload;
        },
    },
    extraReducers: {
        [getAccountList.pending]: (state) => {
            state.loading = true;
        },
        [getAccountList.fulfilled]: (state, { payload }) => {
            state.loading = false;
            //Need to set colors for violations in order to use them in the dashboard section
            state.results = [...payload?.results];
            state.next = payload.next;
            state.count = payload.count;
        },
        [getNextAccountList.fulfilled]: (state, { payload }) => {
            state.loading = false;
            //Need to set colors for violations in order to use them in the dashboard section
            state.results = [...state.results, ...payload?.results];
            state.next = payload.next;
            state.count = payload.count;
        },
        [getAccountList.rejected]: (state, { payload }) => {
            if (!payload) {
                return;
            }
            state.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getNextAccountList.rejected]: (state, { payload }) => {
            state.loading = false;
            openNotification("error", "Error", payload?.message);
        },
    },
});

export default accountListSlice.reducer;
