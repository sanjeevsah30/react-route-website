import React, { useCallback, useContext, useEffect, useState } from "react";
import config from "@constants/Search/index";
import { HomeContext, MeetingTypeConst } from "@container/Home/Home";
import TopbarConfig from "@constants/Topbar/index";
import { flattenTeams, getLocaleDate, uid } from "@tools/helpers";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
    changeActiveTeam,
    clearFilters,
    setActiveCallDuration,
    setActiveFilterDate,
    setActiveRep,
    setGSText,
} from "@store/common/actions";
import auditConfig from "@constants/Audit/index";
import {
    setActiveDashboardFiltres,
    setActiveTemplate,
    setDashboardFilters,
} from "@store/dashboard/dashboard";
import { useLocation } from "react-router";
import { dashboardRoutes } from "../Constants/dashboard.constants";
import { setIsAccountLevel } from "@store/call_audit/actions";

export default function useGetActiveDashboardFilters() {
    const {
        meetingType,
        setMeetingType,
        setCallTags,
        setAccTags,
        callTags,
        accTags,
    } = useContext(HomeContext);

    const [activeFilters, setActiveFilters] = useState([]);
    const dispatch = useDispatch();
    const location = useLocation();
    const {
        common: {
            filterDates,
            filterCallDuration,
            filterReps,
            filterTeams,
            users,
            filterAuditTemplates,
            versionData,
            tags,
        },
        accounts: { filters },
        dashboard: {
            templates_data: { template_active },
            dashboard_filters,
        },
    } = useSelector((state) => state);

    const { isAccountLevel } = useSelector((state) => state.callAudit);

    const getDashboardFilters = useCallback(() => {
        const data = [];
        const { FILTER_CONSTANTS: CONSTANTS } = config;
        if (meetingType === MeetingTypeConst.chat) {
            data.push({
                id: uid(),
                type: "Meeting Type",
                name: meetingType,
            });
        }

        if (isAccountLevel) {
            data.push({
                id: uid(),
                type: "Meeting Level",
                name: "Account",
            });
        }

        if (filterDates.active !== TopbarConfig.defaultDate) {
            if (location.pathname === dashboardRoutes.audit) {
                data.push({
                    id: uid(),
                    type: "Audit Date Range",
                    name:
                        filterDates.active === "all"
                            ? "All"
                            : getLocaleDate(
                                  filterDates?.dates?.[filterDates?.active]
                                      ?.dateRange?.[0]
                              ) +
                              " - " +
                              getLocaleDate(
                                  filterDates?.dates?.[filterDates?.active]
                                      ?.dateRange?.[1]
                              ),
                });
            } else {
                data.push({
                    id: uid(),
                    type: "Start Date",
                    name:
                        filterDates.active === "all"
                            ? "All"
                            : getLocaleDate(
                                  filterDates?.dates?.[filterDates?.active]
                                      ?.dateRange?.[0]
                              ) +
                              " - " +
                              getLocaleDate(
                                  filterDates?.dates?.[filterDates?.active]
                                      ?.dateRange?.[1]
                              ),
                });
            }
        }
        if (
            dashboard_filters.audit_filter?.manualAuditDateRange[0] &&
            dashboard_filters.audit_filter.manualAuditDateRange?.[1]
        ) {
            if (location.pathname === dashboardRoutes.audit) {
                data.push({
                    id: uid(),
                    type: "Start Date",
                    name:
                        getLocaleDate(
                            dashboard_filters.audit_filter
                                ?.manualAuditDateRange?.[0]
                        ) +
                        " - " +
                        getLocaleDate(
                            dashboard_filters.audit_filter
                                ?.manualAuditDateRange?.[1]
                        ),
                });
            } else {
                data.push({
                    id: uid(),
                    type: "Audit Date Range",
                    name:
                        getLocaleDate(
                            dashboard_filters.audit_filter
                                ?.manualAuditDateRange?.[0]
                        ) +
                        " - " +
                        getLocaleDate(
                            dashboard_filters.audit_filter
                                ?.manualAuditDateRange?.[1]
                        ),
                });
            }
        }

        if (filterTeams.active.length) {
            const teams = flattenTeams(filterTeams.teams);
            filterTeams.active.forEach((id) =>
                data.push({
                    id: `team.${id}`,
                    type: "Team",
                    name: teams?.find((team) => team?.id === id)?.name,
                })
            );
        }

        // if (template_active) {
        //     data.push({
        //         id: `template.${filterAuditTemplates.active}`,
        //         type: 'Template',
        //         name: templates?.find(
        //             (template) => template?.id === template_active
        //         )?.name,
        //     });
        // }
        if (!!filterReps.active.length) {
            filterReps.active.forEach((id) => {
                data.push({
                    id: `rep.${id}`,
                    type: "Owner",
                    name: filterReps?.reps?.find((rep) => rep?.id === id)?.name,
                });
            });
        }
        if (dashboard_filters.stage) {
            data.push({
                id: uid(),
                type: "Stage",
                name: filters.stage.find(
                    ({ id }) => dashboard_filters.stage === id
                )?.stage,
            });
        }

        if (
            +filterCallDuration.active !== Number(TopbarConfig.defaultDuration)
        ) {
            data.push({
                id: uid(),
                type: "Duration",
                name: filterCallDuration?.options?.[filterCallDuration.active]
                    ?.text,
            });
        }
        if (
            dashboard_filters?.audit_filter?.audit_type !== null &&
            dashboard_filters?.audit_filter?.audit_type !==
                auditConfig.AI_AUDIT_TYPE
        ) {
            data.push({
                id: uid(),
                type: "Audit Type",
                name: dashboard_filters.audit_filter.audit_type,
            });
        }

        if (dashboard_filters.audit_filter.auditors.length) {
            for (let id of dashboard_filters.audit_filter.auditors) {
                data.push({
                    id: `auditor.${id}`,
                    type: CONSTANTS.AUDITOR,
                    name:
                        id === 0
                            ? "All"
                            : id === -1
                            ? "None"
                            : users?.find((user) => user.id === id)?.first_name,
                });
            }
        }

        if (dashboard_filters?.call_tags?.length) {
            dashboard_filters?.call_tags.forEach((id) => {
                data.push({
                    id: `calltag.${id}`,
                    type: "Call_Tags",
                    name: tags.find((tag) => tag?.id === id)?.tag_name,
                });
            });
        }
        if (dashboard_filters?.acc_tags?.length) {
            dashboard_filters?.acc_tags.forEach((id) => {
                data.push({
                    id: `calltag.${id}`,
                    type: "Account_Tags",
                    name: filters.accountTags.find((tag) => tag?.id === id)
                        ?.tag,
                });
            });
        }
        return data;
    }, [
        template_active,
        filterDates.active,
        filterTeams.active,
        filterReps,
        filterCallDuration.active,
        filterAuditTemplates,
        dashboard_filters,
        meetingType,
        isAccountLevel,
    ]);

    const clearSearch = () => {
        dispatch(setGSText(""));
        dispatch(clearFilters());
        dispatch(setActiveRep([]));
        dispatch(setActiveDashboardFiltres([]));
        if (versionData?.filters?.template) {
            dispatch(setActiveTemplate(versionData?.filters?.template));
        }
        dispatch(
            setDashboardFilters({
                audit_filter: {
                    audit_type: auditConfig.AI_AUDIT_TYPE,
                    auditors: [],
                    manualAuditDateRange: [null, null],
                },
                stage: null,
                call_tags: [],
                acc_tags: [],
            })
        );
        setMeetingType(MeetingTypeConst.calls);
        setCallTags([]);
        setAccTags([]);
    };

    const handleRemove = ({ type, id }) => {
        const { FILTER_CONSTANTS: CONSTANTS } = config;
        switch (type) {
            case CONSTANTS.TEAM:
                const toRemove = Number(id.split(".")?.[1]);
                return dispatch(
                    changeActiveTeam(
                        filterTeams.active?.filter(
                            (team_id) => team_id !== toRemove
                        )
                    )
                );

            case CONSTANTS.AUDIT_TYPE:
                auditConfig.AI_AUDIT_TYPE !==
                    dashboard_filters.audit_filter.audit_type &&
                    dispatch(
                        setDashboardFilters({
                            ...dashboard_filters,
                            audit_filter: {
                                audit_type: null,
                                auditors: [],
                                manualAuditDateRange: [null, null],
                            },
                        })
                    );

                break;

            case CONSTANTS.OWNER:
                const repToRemove = Number(id.split(".")?.[1]);
                return dispatch(
                    setActiveRep(
                        filterReps.active?.filter(
                            (rep_id) => rep_id !== repToRemove
                        )
                    )
                );
            // dispatch(setActiveRep([]));
            // break;

            case CONSTANTS.DATE:
                dispatch(setActiveFilterDate("last30days"));
                break;
            case CONSTANTS.DURATION:
                dispatch(setActiveCallDuration("2"));
                break;
            case CONSTANTS.AUDITOR:
                {
                    const toRemove = Number(id.split(".")?.[1]);

                    dispatch(
                        setDashboardFilters({
                            ...dashboard_filters,
                            audit_filter: {
                                ...dashboard_filters.audit_filter,
                                auditors:
                                    dashboard_filters?.audit_filter?.auditors?.filter?.(
                                        (id) => id !== toRemove
                                    ),
                            },
                        })
                    );
                }
                break;
            case "Audit Date Range":
                dispatch(
                    setDashboardFilters({
                        ...dashboard_filters,
                        audit_filter: {
                            ...dashboard_filters.audit_filter,
                            manualAuditDateRange: [null, null],
                        },
                    })
                );

                break;
            case "Stage":
                dispatch(
                    setDashboardFilters({
                        ...dashboard_filters,
                        stage: null,
                    })
                );
                break;
            case "Meeting Type":
                setMeetingType(MeetingTypeConst.calls);
                break;
            case "Call_Tags":
                const tagToRemove = Number(id.split(".")?.[1]);
                setCallTags(callTags.filter((item) => item !== tagToRemove));
                return dispatch(
                    setDashboardFilters({
                        ...dashboard_filters,
                        call_tags: dashboard_filters.call_tags.filter(
                            (tag_id) => tag_id !== tagToRemove
                        ),
                    })
                );
            case "Account_Tags":
                const AcctagToRemove = Number(id.split(".")?.[1]);
                setAccTags(accTags.filter((item) => item !== AcctagToRemove));
                return dispatch(
                    setDashboardFilters({
                        ...dashboard_filters,
                        acc_tags: dashboard_filters.acc_tags.filter(
                            (tag_id) => tag_id !== AcctagToRemove
                        ),
                    })
                );
            case "Meeting Level":
                return dispatch(setIsAccountLevel(false));
            default:
        }
    };

    useEffect(() => {
        getDashboardFilters().length &&
            dispatch(setActiveDashboardFiltres([...getDashboardFilters()]));
    }, [getDashboardFilters]);

    useEffect(() => {
        setActiveFilters(getDashboardFilters());
    }, [getDashboardFilters]);

    return { getDashboardFilters, activeFilters, handleRemove, clearSearch };
}
