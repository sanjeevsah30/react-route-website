import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "@apis/common/index";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { openNotification } from "@store/common/actions";

const initialState = {
    loading: false,
    roles: [],
    role_permissions: [],
    crud_loading: false,
};

export const getRoles = createAsyncThunk(
    "role_manager/getRoles",
    async (_, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.get(`/person/role/ `);

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const getRolePermissions = createAsyncThunk(
    "role_manager/getRolePermissions",
    async (_, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.get(
                `/person/role_perms/list_all/ `
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const createRolePermissions = createAsyncThunk(
    "role_manager/createRole",
    async (payload, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.post(`/person/role/ `, payload);

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const updateRolePermissions = createAsyncThunk(
    "role_manager/updateRole",
    async (payload, { rejectWithValue, getState }) => {
        try {
            const res = await axiosInstance.patch(
                `/person/role/${payload.id}/`,
                payload
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

export const deleteRolePermissions = createAsyncThunk(
    "role_manager/deleteRole",
    async (payload, { rejectWithValue, getState }) => {
        try {
            await axiosInstance.delete(`/person/role/${payload.id}/`);

            return payload;
        } catch (err) {
            return rejectWithValue(getError(err));
        }
    }
);

const roleManagerSlice = createSlice({
    name: "role_manager",
    initialState,
    reducers: {},
    extraReducers: {
        [getRoles.pending]: (state) => {
            state.loading = true;
        },
        [getRoles.fulfilled]: (state, { payload }) => {
            state.loading = false;
            state.roles = [...payload];
        },
        [getRoles.rejected]: (state, { payload }) => {
            state.loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [createRolePermissions.pending]: (state) => {
            state.crud_loading = true;
        },
        [createRolePermissions.fulfilled]: (state, { payload }) => {
            state.crud_loading = false;

            state.roles = [...state.roles, payload];
        },
        [createRolePermissions.rejected]: (state, { payload }) => {
            state.crud_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [updateRolePermissions.pending]: (state) => {
            state.crud_loading = true;
        },
        [updateRolePermissions.fulfilled]: (state, { payload }) => {
            state.crud_loading = false;

            state.roles = state.roles.map((e) => {
                if (e.id === payload.id) return payload;
                return e;
            });
        },
        [updateRolePermissions.rejected]: (state, { payload }) => {
            state.crud_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [deleteRolePermissions.pending]: (state) => {
            state.crud_loading = true;
        },
        [deleteRolePermissions.fulfilled]: (state, { payload }) => {
            state.crud_loading = false;

            state.roles = state.roles.filter((e) => e.id !== payload.id);
        },
        [deleteRolePermissions.rejected]: (state, { payload }) => {
            state.crud_loading = false;
            openNotification("error", "Error", payload?.message);
        },
        [getRolePermissions.pending]: (state) => {
            state.loading = true;
        },
        [getRolePermissions.fulfilled]: (state, { payload }) => {
            state.loading = false;
            state.role_permissions = [...payload];
        },
        [getRolePermissions.rejected]: (state, { payload }) => {
            state.loading = false;
            openNotification("error", "Error", payload?.message);
        },
    },
});

// export const {} = roleManagerSlice.actions;
export default roleManagerSlice.reducer;
