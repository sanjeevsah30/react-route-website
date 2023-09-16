import { combineReducers } from "redux";
import common from "./common/reducer";
import auth from "./auth/reducer";
import feedback from "./feedback/reducer";
import library from "./library/reducer";
import librarySlice from "./library/librarySlice";
import calls from "./calls/reducer";
import search from "./search/reducer";
import assistant from "./assistant/reducer";
import settings from "./settings/reducer";
import stats from "./stats/reducer";
import individualcall from "./individualcall/reducer";
import ci from "./ci/reducer";
import callAudit from "./call_audit/reducer";
import auditReport from "./audit_report/reducer";
import serviceWorker from "./serviceworker/reducer";
import accounts from "./accounts/reducer";
import billing from "./billing/billing";
import scheduled_reports from "./scheduledReports/scheduledReports";
import violation_manager from "./violation_manager/violation_manager";
import team_manager from "./team_manager/team_manager";
import coupon from "./coupon/coupon";
import dashboard from "./dashboard/dashboard";
import momentSettings from "./momentSettings/momentSettings";
import role_manager from "./roleManager/role_manager.store";
import coaching from "./coaching/reduser";
import createCoachingSlice from "./coaching/createCoachingSlice";
import coaching_dashboard from "./coaching/coaching.store";
import callListSlice from "./callListSlice/callListSlice";
import accountListSlice from "./accountListSlice/accountListSlice";
import internalCoachingSlice from "./internalCoachingSlice/internalCoachingSlice";
import CISlice from "./cutsomerIntelligence/CISlice";
import CIInsightsSlice from "./cutsomerIntelligence/ciInsightsSlice";
import InternalCiDashboardSlice from "./cutsomerIntelligence/internalCiDashboardSlice";
import userManagerSlice from "./userManagerSlice/userManagerSlice";
import auditSlice from "./auditSlice/auditSlice";
import gptSlice from "./gpt/gptSlice";

import liveAssistSlice from "./liveAssistSlice/liveAssistSlice";
// for askfeedback
import askfeedback from "./askfeedback/askfeedback";
import notesSettingSlice from "./notesSettingSlice/notesSettingSlice";

//Typescript with rtk query
import { violationManagerApiSlice } from "../convin/redux/services/settings/violationManager.service";
import { auditManagerApiSlice } from "../convin/redux/services/settings/auditManager.service";
import { roleManagerApiSlice } from "../convin/redux/services/settings/roleManager.service";
import { callTypeManagerApiSlice } from "../convin/redux/services/settings/callTypeManager.service";
import { callTagsManagerApiSlice } from "../convin/redux/services/settings/callTagsManager.service";
import { usersApiSlice } from "../convin/redux/services/settings/users.servise";
import { scoreSenseApiSlice } from "@convin/redux/services/settings/scoreSense.service";
import { qmsApiSlice } from "@convin/redux/services/settings/qms.service";
import { customDashboardApiSlice } from "@convin/redux/services/home/customDashboard.service";
import { accountsApiSlice } from "@convin/redux/services/account/account.service";
import { activityApiSlice } from "@convin/redux/services/settings/activity.service";
import { userManagerApiSlice } from "../convin/redux/services/settings/userManager.service";
import { teamManagerSeviceSlice } from "@convin/redux/services/settings/teamManager.service";
import { commonApiSlice } from "@convin/redux/services/common/common.service";
import { billingApiSlice } from "@convin/redux/services/settings/billing.service";

// Combine all reducers.
const appReducer = combineReducers({
    common,
    auth,
    feedback,
    library,
    librarySlice,
    calls,
    search,
    assistant,
    settings,
    stats,
    individualcall,
    ci,
    callAudit,
    serviceWorker,
    auditReport,
    accounts,
    coaching,
    billing,
    coupon,
    dashboard,
    scheduled_reports,
    violation_manager,
    momentSettings,
    askfeedback,
    team_manager,
    role_manager,
    coaching_dashboard,
    callListSlice,
    accountListSlice,
    internalCoachingSlice,
    createCoachingSlice,
    CISlice,
    CIInsightsSlice,
    userManagerSlice,
    InternalCiDashboardSlice,
    auditSlice,
    gptSlice,
    liveAssistSlice,
    notesSettingSlice,
    [auditManagerApiSlice.reducerPath]: auditManagerApiSlice.reducer,
    [roleManagerApiSlice.reducerPath]: roleManagerApiSlice.reducer,
    [violationManagerApiSlice.reducerPath]: violationManagerApiSlice.reducer,
    [callTypeManagerApiSlice.reducerPath]: callTypeManagerApiSlice.reducer,
    [callTagsManagerApiSlice.reducerPath]: callTagsManagerApiSlice.reducer,
    [usersApiSlice.reducerPath]: usersApiSlice.reducer,
    [scoreSenseApiSlice.reducerPath]: scoreSenseApiSlice.reducer,
    [qmsApiSlice.reducerPath]: qmsApiSlice.reducer,
    [customDashboardApiSlice.reducerPath]: customDashboardApiSlice.reducer,
    [accountsApiSlice.reducerPath]: accountsApiSlice.reducer,
    [activityApiSlice.reducerPath]: activityApiSlice.reducer,
    [userManagerApiSlice.reducerPath]: userManagerApiSlice.reducer,
    [teamManagerSeviceSlice.reducerPath]: teamManagerSeviceSlice.reducer,
    [qmsApiSlice.reducerPath]: qmsApiSlice.reducer,
    [customDashboardApiSlice.reducerPath]: customDashboardApiSlice.reducer,
    [accountsApiSlice.reducerPath]: accountsApiSlice.reducer,
    [commonApiSlice.reducerPath]: commonApiSlice.reducer,
    [billingApiSlice.reducerPath]: billingApiSlice.reducer,
});

export const rootReducer = (state, action) => {
    // Clear all data in redux store to initial.
    // if (action.type === 'LOGOUT') state = undefined;
    return appReducer(state, action);
};
