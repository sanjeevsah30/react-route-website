// container for the settings section, will contain the tab bar, and all the props for the settings
import React, { useEffect } from "react";
import commonConfig from "@constants/common";
import { useDispatch } from "react-redux";
import UserSettings from "./UserSettings";
import RecordingsManager from "./RecordingsManager/index";
import IntegrationManager from "./IntegrationManager";
import * as tourSteps from "@tours";
import withErrorCollector from "hoc/withErrorCollector";
import { Redirect } from "react-router-dom";
import routes from "@constants/Routes/index";
import { Switch, Route } from "react-router-dom";
import AuditFiltersSettings from "./Audit Manager/CallFiltersV3/AuditFiltersSettings";
import FileUploadPage from "./Audit Manager/Lead Score/FileUploadPage";
import Billing from "./Billing/index";
import ScheduledReports from "./ScheduledReports/index";
import { getViolations } from "@store/violation_manager/violation_manager";
import { getThirdPartyIntegrations } from "@store/settings/actions";
import TopicManagerLatest from "./TopicManager/index";
import "./settings.scss";
import { getRoles } from "@store/roleManager/role_manager.store";
import { useContext } from "react";
import { HomeContext } from "@container/Home/Home";
import AuditCalibration from "./Audit Manager/Calibration/index";
import InternalCoaching from "./Audit Manager/Coaching/InternalCoaching";
import InternalCoachingClips from "./Audit Manager/Coaching/InternalCoachingClips";
import VoicePrintDashboard from "./RecordingsManager/VoicePrintDashboard/index";
import AuditManagerCalibration from "./Audit Manager/AuditManagerCalibration/index";
import SamplingManager from "./SamplingManager/index";
import CIFiltersSettings from "./CI/CIFiltersSettings";
import CICreateInsightFilter from "./CI/CICreateInsightFilter";
import CICreateInsight from "./CI/CICreateInsight";
import SettingsNavigation from "@convin/modules/settings/settingsNavigation";
import { SettingRoutes } from "@convin/config/routes.config";
import RoleManagerList from "@convin/modules/settings/roleManager/components/RoleManagerList";
import RoleCreateUpdate from "@convin/modules/settings/roleManager/components/RoleCreateUpdate";
import NotesSetting from "./Notes/index";
import sidebarConfig from "app/constants/Sidebar";
import { Helmet } from "react-helmet";
import CallTypeManager from "@convin/modules/settings/callTypeManager/CallTypeManager";
import QmsManager from "../../../../convin/modules/settings/qmsManager";
import CallTagsManager from "@convin/modules/settings/callTagsManager/components/CallTagsManager";
import AuditManager from "@convin/modules/settings/auditManager";
import BattleCards from "./LiveAssistSettings/BattleCard";
import TeamManager from "@convin/modules/settings/teamManager";
import LeadScore from "@convin/modules/settings/leadScore";
import UserManager from "@convin/modules/settings/userManager/UserManager";
import ViolationManager from "@convin/modules/settings/violationManager";

const Settings = (props) => {
    // Error and Success Messages.
    const dispatch = useDispatch();
    const { canAccess } = useContext(HomeContext);
    useEffect(() => {
        dispatch(getRoles());
        dispatch(getThirdPartyIntegrations());
        dispatch(getViolations());
    }, []);

    return (
        <div className="flex height100p">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{sidebarConfig.SETTINGS_TITLE}</title>
            </Helmet>
            <SettingsNavigation />
            <div className="content-container flex-1 overflowYscroll">
                <Switch>
                    <Route
                        exact
                        path={`/settings`}
                        render={() => (
                            <Redirect
                                to={`/settings/${SettingRoutes.USER_PROFILE.path}`}
                            />
                        )}
                    />

                    <Route
                        exact
                        path={`/settings/${SettingRoutes.USER_PROFILE.path}`}
                        render={() => <UserSettings />}
                    />

                    <Route
                        exact
                        path={`/settings/${SettingRoutes.RECORDING_MANAGER.path}`}
                        render={() => (
                            <div className="padding20">
                                <RecordingsManager />
                            </div>
                        )}
                    />
                    <Route
                        exact
                        path={routes.settings.voice_print_dashboard}
                        render={() => <VoicePrintDashboard />}
                    />

                    {/* CI Dashboard paths */}
                    <Route
                        exact
                        path={routes.settings.ci}
                        render={() => <CIFiltersSettings />}
                    />
                    <Route
                        exact
                        path={`${routes.settings.ci}/insight/create`}
                        render={() => <CICreateInsight />}
                    />
                    <Route
                        exact
                        path={`${routes.settings.ci}/insight/edit/:insight_id`}
                        render={() => <CICreateInsight />}
                    />
                    <Route
                        exact
                        path={`${routes.settings.ci}/filter/create/:create_insight_id`}
                        render={() => <CICreateInsightFilter />}
                    />
                    <Route
                        exact
                        path={`${routes.settings.ci}/filter/edit/:insight_id`}
                        render={() => <CICreateInsightFilter />}
                    />
                    {/* End of CI Dashboard Paths*/}
                    <Route
                        path={`/settings/${SettingRoutes.NOTES.path}`}
                        render={() => (
                            <div className="paddingL16 height100p">
                                <NotesSetting />
                            </div>
                        )}
                    />
                    <Route
                        path={`/settings/${SettingRoutes.SCORE_SENSE.path}`}
                        render={() => <LeadScore />}
                    />
                </Switch>
                {canAccess("User Manager") ? (
                    <Switch>
                        <Route
                            exact
                            path={`/settings/${SettingRoutes.USER_MANAGER.path}`}
                            render={() => <UserManager />}
                        />
                    </Switch>
                ) : (
                    <></>
                )}
                {canAccess("Topic Manager") ? (
                    <Switch>
                        <Route
                            exact
                            path={`/settings/${SettingRoutes.TOPIC_MANAGER.path}`}
                            render={() => (
                                <TopicManagerLatest
                                    tourKey={
                                        commonConfig.TOURS_KEYS.topicManager
                                    }
                                    tourSteps={tourSteps.topicManagerTour}
                                />
                            )}
                        />
                    </Switch>
                ) : (
                    <></>
                )}
                {canAccess("Team Manager") ? (
                    <Switch>
                        <Route
                            exact
                            path={`/settings/${SettingRoutes.TEAM_MANAGER.path}`}
                            render={() => (
                                <TeamManager
                                    tourKey={
                                        commonConfig.TOURS_KEYS.teamManager
                                    }
                                    tourSteps={tourSteps.teamManagerTour}
                                />
                            )}
                        />
                    </Switch>
                ) : (
                    <></>
                )}
                {canAccess("Integrations") ? (
                    <Switch>
                        <Route
                            exact
                            path={`/settings/${SettingRoutes.INTEGRATIONS.path}`}
                            render={() => (
                                <IntegrationManager
                                    tourKey={
                                        commonConfig.TOURS_KEYS.integrations
                                    }
                                    tourSteps={tourSteps.integrationsTour}
                                />
                            )}
                        />
                    </Switch>
                ) : (
                    <></>
                )}
                {canAccess("Role Manager") ? (
                    <Switch>
                        <Route
                            exact
                            path={`/settings/${SettingRoutes.ROLE_MANAGER.path}`}
                            render={() => (
                                <div className="padding20">
                                    <RoleManagerList />
                                </div>
                            )}
                        />
                        <Route
                            exact
                            path={`/settings/${SettingRoutes.ROLE_MANAGER.path}/:id`}
                            render={() => (
                                <div className="padding20">
                                    <RoleCreateUpdate />
                                </div>
                            )}
                        />
                        <Route
                            exact
                            path={`/settings/${SettingRoutes.ROLE_MANAGER.path}/clone/:id`}
                            render={() => (
                                <div className="padding20">
                                    <RoleCreateUpdate />
                                </div>
                            )}
                        />
                    </Switch>
                ) : (
                    <></>
                )}
                {canAccess("Call Type Manager") ? (
                    <Switch>
                        <Route
                            exact
                            path={`/settings/${SettingRoutes.CALL_TYPE_MANAGER.path}`}
                            render={() => (
                                <div className="padding20">
                                    <CallTypeManager />
                                </div>
                            )}
                        />
                    </Switch>
                ) : (
                    <></>
                )}
                {canAccess("Call Tags Manager") ? (
                    <Switch>
                        <Route
                            exact
                            path={`/settings/${SettingRoutes.CALL_TAGS_MANAGER.path}`}
                            render={() => (
                                <div className="padding20">
                                    <CallTagsManager />
                                </div>
                            )}
                        />
                    </Switch>
                ) : (
                    <></>
                )}
                {canAccess("Scheduled Reports") ? (
                    <Switch>
                        <Route
                            exact
                            path={`/settings/${SettingRoutes.SCHEDULED_REPORTS.path}`}
                            render={() => (
                                <div className="height100p paddingLR16">
                                    <ScheduledReports />
                                </div>
                            )}
                        />
                    </Switch>
                ) : (
                    <></>
                )}
                {canAccess("Violation Manager") ? (
                    <Switch>
                        {" "}
                        <Route
                            exact
                            path={`/settings/${SettingRoutes.VIOLATION_MANAGER.path}`}
                            render={() => (
                                <div className="padding20">
                                    <ViolationManager />
                                </div>
                            )}
                        />
                    </Switch>
                ) : (
                    <></>
                )}
                {canAccess("Billing") ? (
                    <Switch>
                        <Route
                            exact
                            path={`/settings/${SettingRoutes.BILLING.path}`}
                            render={() => (
                                <div className="padding20">
                                    <Billing />
                                </div>
                            )}
                        />
                    </Switch>
                ) : (
                    <></>
                )}
                {canAccess("Sampling Manager") ? (
                    <Switch>
                        <Route
                            exact
                            path={`/settings/${SettingRoutes.SAMPLING_MANAGER.path}`}
                            render={() => (
                                <div className="padding20">
                                    <SamplingManager />
                                </div>
                            )}
                        />
                    </Switch>
                ) : (
                    <></>
                )}
                {canAccess("Audit Manager") ? (
                    <Switch>
                        <Route
                            path={`/settings/${SettingRoutes.AUDIT_MANAGER.path}/filters/:id`}
                            exact
                            render={() => <AuditFiltersSettings />}
                        />
                        <Route
                            path={`/settings/${SettingRoutes.AUDIT_MANAGER.path}/calibration`}
                            exact
                            render={() => <AuditManagerCalibration />}
                        />
                        <Route
                            path={`/settings/${SettingRoutes.AUDIT_MANAGER.path}/lead_score/:id`}
                            exact
                            render={() => <FileUploadPage />}
                        />
                        <Route
                            path={`/settings/${SettingRoutes.AUDIT_MANAGER.path}/filters/:id/calibration/:calibrationId`}
                            exact
                            render={() => <AuditCalibration />}
                        />
                        <Route
                            path={`/settings/${SettingRoutes.AUDIT_MANAGER.path}/coaching`}
                            exact
                            render={() => <InternalCoaching />}
                        />
                        <Route
                            path={`/settings/${SettingRoutes.AUDIT_MANAGER.path}/coaching/:id`}
                            exact
                            render={() => <InternalCoachingClips />}
                        />
                        <Route
                            path={`/settings/${SettingRoutes.AGENT_ASSIST.path}`}
                            render={() => <BattleCards />}
                        />
                        <Route
                            path={`/settings/${SettingRoutes.AUDIT_MANAGER.path}`}
                            render={() => <AuditManager />}
                        />
                    </Switch>
                ) : (
                    <></>
                )}
                {canAccess("QMS") ? (
                    <Switch>
                        <Route
                            exact
                            path={`/settings/${SettingRoutes.MANUAL_QMS.path}`}
                            render={() => <QmsManager />}
                        />
                    </Switch>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};

export default withErrorCollector(Settings);
