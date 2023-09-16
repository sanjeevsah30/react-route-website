import { isRejectedWithValue } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const rtkQueryErrorLogger = (api) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!

    if (isRejectedWithValue(action)) {
        console.log(action);
        const errRes =
            action?.payload?.data?.detail ||
            action?.payload?.data?.message ||
            action?.payload?.message;

        const status = action?.payload?.status;

        if (typeof status === "string") {
            return next(action);
        }

        if (
            action?.meta?.arg?.endpointName === "createBulkUser" ||
            action?.meta?.arg?.endpointName === "inviteBulkUser"
        ) {
            return next(action);
        }

        const message =
            status === 404
                ? "The resource doesn't exist or You don't have access to it"
                : Array.isArray(errRes) && errRes?.length
                ? typeof errRes?.[0] === "string"
                    ? errRes?.[0]
                    : errRes?.[0]?.detail ||
                      Object.values(
                          errRes.response.data?.[0] || {
                              detail: "Something went wrong",
                          }
                      )?.[0]
                : errRes ||
                  action?.payload?.data?.error ||
                  action?.payload?.data?.[
                      Object.keys(action?.payload?.data)
                  ]?.[0] ||
                  "Something went wrong";
        // console.warn('We got a rejected action!', status, JSON.stringify(action?.payload?.data || {}));
        // console.warn(action);
        if (status !== 401)
            toast.error(message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
    }

    return next(action);
};
