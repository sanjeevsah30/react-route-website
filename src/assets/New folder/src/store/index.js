import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { auditManagerApiSlice } from "@convin/redux/services/settings/auditManager.service";
import { roleManagerApiSlice } from "@convin/redux/services/settings/roleManager.service";
import { violationManagerApiSlice } from "@convin/redux/services/settings/violationManager.service";
import { rtkQueryErrorLogger } from "@convin/redux/middleware/errorhandler";
import { callTypeManagerApiSlice } from "@convin/redux/services/settings/callTypeManager.service";
import { callTagsManagerApiSlice } from "@convin/redux/services/settings/callTagsManager.service";
import { usersApiSlice } from "@convin/redux/services/settings/users.servise";
import { scoreSenseApiSlice } from "@convin/redux/services/settings/scoreSense.service";
import { qmsApiSlice } from "@convin/redux/services/settings/qms.service";
import { customDashboardApiSlice } from "@convin/redux/services/home/customDashboard.service";
import { accountsApiSlice } from "@convin/redux/services/account/account.service";
import { activityApiSlice } from "@convin/redux/services/settings/activity.service";
import { userManagerApiSlice } from "@convin/redux/services/settings/userManager.service";
import { teamManagerSeviceSlice } from "@convin/redux/services/settings/teamManager.service";
import { commonApiSlice } from "@convin/redux/services/common/common.service";
import { billingApiSlice } from "@convin/redux/services/settings/billing.service";

export const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        }).concat(
            auditManagerApiSlice.middleware,
            roleManagerApiSlice.middleware,
            violationManagerApiSlice.middleware,
            callTypeManagerApiSlice.middleware,
            callTagsManagerApiSlice.middleware,
            usersApiSlice.middleware,
            scoreSenseApiSlice.middleware,
            qmsApiSlice.middleware,
            customDashboardApiSlice.middleware,
            accountsApiSlice.middleware,
            activityApiSlice.middleware,
            userManagerApiSlice.middleware,
            teamManagerSeviceSlice.middleware,
            qmsApiSlice.middleware,
            customDashboardApiSlice.middleware,
            accountsApiSlice.middleware,
            commonApiSlice.middleware,
            billingApiSlice.middleware,
            rtkQueryErrorLogger
        ),
});
