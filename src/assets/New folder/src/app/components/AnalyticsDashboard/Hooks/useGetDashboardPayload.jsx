import auditConfig from "@constants/Audit/index";
import { HomeContext } from "@container/Home/Home";
import { getTimeZone, toEpoch } from "@tools/helpers";
import React, { useCallback, useContext } from "react";
import { useSelector } from "react-redux";

export default function useGetDashboardPayload() {
    const {
        common: { filterTeams, filterReps, filterCallDuration, filterDates },
        dashboard: {
            dashboard_filters,
            templates_data: { template_active },
        },
        callAudit: { isAccountLevel },
    } = useSelector((state) => state);

    const { meetingType } = useContext(HomeContext);

    const getDashboardPayload = useCallback(() => {
        const payload = {
            is_manual:
                dashboard_filters.audit_filter.audit_type ===
                auditConfig.MANUAL_AUDIT_TYPE,

            is_call_level: !isAccountLevel,

            min_duration:
                meetingType?.toLowerCase() === "call"
                    ? filterCallDuration.options?.[filterCallDuration.active]
                          ?.value?.[0] * 60
                    : undefined,
            max_duration:
                meetingType?.toLowerCase() === "call"
                    ? filterCallDuration.options?.[filterCallDuration.active]
                          ?.value?.[1] * 60 || null
                    : undefined,
            start_date: toEpoch(
                filterDates?.dates?.[filterDates?.active]?.dateRange[0]
            ),
            end_date: toEpoch(
                filterDates?.dates?.[filterDates?.active]?.dateRange[1]
            ),

            timezone: getTimeZone(),
            meeting_type: meetingType,
        };

        if (dashboard_filters.stage) {
            payload.stages_id = [dashboard_filters.stage];
        }
        if (dashboard_filters.audit_filter.manualAuditDateRange?.[0]) {
            payload.audit_start_date = toEpoch(
                dashboard_filters.audit_filter.manualAuditDateRange[0]
            );
        }
        if (dashboard_filters.audit_filter.manualAuditDateRange?.[1]) {
            payload.audit_end_date = toEpoch(
                dashboard_filters.audit_filter.manualAuditDateRange[1]
            );
        }

        if (
            dashboard_filters.audit_filter.audit_type ===
            auditConfig.MANUAL_AUDIT_TYPE
        ) {
            //If 0 is present it means all auditors were selected
            payload.auditors_id =
                dashboard_filters?.audit_filter.auditors.filter((e) => e !== 0)
                    ?.length
                    ? dashboard_filters?.audit_filter?.auditors
                    : null;
        }

        if (filterTeams.active?.length) payload.teams_id = filterTeams.active;
        if (!!filterReps.active.length) payload.reps_id = filterReps.active;
        if (template_active) payload.template_id = template_active;
        if (dashboard_filters?.call_tags?.length)
            payload.tags_id = dashboard_filters.call_tags;
        if (dashboard_filters?.acc_tags?.length)
            payload.account_tags_id = dashboard_filters?.acc_tags;

        return payload;
    }, [
        template_active,
        filterTeams.active,
        filterReps.active,
        filterCallDuration.active,
        filterDates.active,
        isAccountLevel,
        dashboard_filters,
        meetingType,
    ]);

    return { getDashboardPayload };
}
