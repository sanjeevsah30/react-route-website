import {
    ReportObjectType,
    SingelObjectType,
} from "@convin/type/CustomDashboard";
import React, { FunctionComponent } from "react";
import useCustomDashboardModalStateContext from "../hooks/useCustomDashboardModalStateContext";
import { Box } from "@mui/material";
import MoreOptions from "@convin/components/custom_components/Popover/MoreOptions";
import moment from "moment-timezone";
import FiltersSvg from "@convin/components/svg/FiltersSvg";
import { EditSvg } from "@convin/components/svg";
import UnpinSvg from "app/static/svg/UnpinSvg";
import { isDefined } from "@convin/utils/helper/common.helper";
import { datekeys, defaultConfig } from "@convin/config/default.config";
import { useUnPinReportMutation } from "@convin/redux/services/home/customDashboard.service";
import { useParams } from "react-router-dom";

export const MoreOptionsPopover: FunctionComponent<{
    item: (SingelObjectType | ReportObjectType) & {
        data?: SingelObjectType["data"];
    };
    className?: string;
    isReport?: boolean;
    setIsFiltersModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsRenameModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
    className = "",
    item,
    setIsFiltersModalOpen,
    setIsRenameModalOpen,
}) => {
    const { updateState, state } = useCustomDashboardModalStateContext();
    const [unPinReport] = useUnPinReportMutation();
    const params = useParams<{
        id: string;
    }>();

    const { filters, id, name, type, data, card_type, layout } = item;
    const isReport = card_type === "report";
    return (
        <MoreOptions {...{ className }}>
            <Box sx={{ p: 0.6 }}>
                <Box
                    className="flex items-center cursor-pointer"
                    sx={{ py: 0.6, px: 1.5 }}
                    onClick={() => {
                        const {
                            start_date,
                            end_date,
                            min_duration,
                            max_duration,
                            date_repr,
                            audit_date_repr,
                            audit_start_date,
                            audit_end_date,
                            is_manual,
                        } = filters;
                        let activeDateKey = date_repr || datekeys.all;
                        let activeAuditDateKey =
                            audit_date_repr || datekeys.all;
                        let dateRange =
                            defaultConfig.dateConfig[activeDateKey].dateRange;
                        let auditDateRange =
                            defaultConfig.dateConfig[activeAuditDateKey]
                                .dateRange;
                        let durationKey: string | number = 0;
                        let durationRange =
                            defaultConfig.durationConfig[durationKey].value;

                        if (!isDefined(date_repr) && (start_date || end_date)) {
                            const formattedDate0 = start_date
                                ? moment(new Date(+start_date * 1000)).format(
                                      "MMM DD, YYYY"
                                  )
                                : null;
                            const formattedDate1 = end_date
                                ? moment(new Date(+end_date * 1000)).format(
                                      "MMM DD, YYYY"
                                  )
                                : null;
                            dateRange = [start_date || null, end_date || null];
                            if (start_date && end_date)
                                activeDateKey = `${formattedDate0} - ${formattedDate1}`;
                            else if (start_date)
                                activeDateKey = `After ${formattedDate0}`;
                            else if (end_date)
                                activeDateKey = `Before ${formattedDate1}`;
                        }

                        if (
                            !isDefined(audit_date_repr) &&
                            (audit_start_date || audit_end_date)
                        ) {
                            const formattedDate0 = audit_start_date
                                ? moment(
                                      new Date(+audit_start_date * 1000)
                                  ).format("MMM DD, YYYY")
                                : null;
                            const formattedDate1 = audit_end_date
                                ? moment(
                                      new Date(+audit_end_date * 1000)
                                  ).format("MMM DD, YYYY")
                                : null;
                            auditDateRange = [
                                audit_start_date || null,
                                audit_end_date || null,
                            ];
                            if (audit_start_date && audit_end_date)
                                activeAuditDateKey = `${formattedDate0} - ${formattedDate1}`;
                            else if (audit_start_date)
                                activeAuditDateKey = `After ${formattedDate0}`;
                            else if (audit_end_date)
                                activeAuditDateKey = `Before ${formattedDate1}`;
                        }

                        if (min_duration || max_duration) {
                            if (min_duration == 120 && !max_duration) {
                                durationKey = 2;
                                durationRange = [2, null];
                            }
                            if (min_duration == 300 && !max_duration) {
                                durationKey = 4;
                                durationRange = [5, null];
                            }
                            if (min_duration == 600 && !max_duration) {
                                durationKey = 5;
                                durationRange = [10, null];
                            }
                            if (min_duration == 900 && !max_duration) {
                                durationKey = 6;
                                durationRange = [15, null];
                            }
                            if (max_duration === 120 && !min_duration) {
                                durationKey = 1;
                                durationRange = [0, 2];
                            }
                            if (max_duration === 300 && !min_duration) {
                                durationKey = 3;
                                durationRange = [0, 5];
                            }

                            if (min_duration && max_duration) {
                                durationKey = `Between ${min_duration / 60} - ${
                                    max_duration / 60
                                } min`;
                                durationRange = [
                                    min_duration / 60,
                                    max_duration / 60,
                                ];
                            }

                            if (min_duration) {
                                durationKey = `Above ${min_duration / 60} min`;
                            }

                            if (max_duration) {
                                durationKey = `Below ${max_duration / 60} min`;
                            }
                        }

                        updateState({
                            idToUpdate: id,
                            teams: filters.teams_id || [],
                            reps: filters.reps_id || [],
                            tags: filters.tags_id || [],
                            call_types_id: filters.call_types_id || [],
                            stage: filters.stages_id,
                            level: filters.is_call_level ? 1 : 0,
                            auditType: filters.is_manual ? 1 : 0,
                            template: filters.template_id,
                            name: name,
                            meetingType: filters.meeting_type,
                            layout: layout,
                            reportType: type,
                            dateKey: activeDateKey,
                            ...(!isDefined(date_repr) && {
                                dateOptions: {
                                    ...state.dateOptions,
                                    [activeDateKey]: {
                                        name: activeDateKey,
                                        is_roling_date: false,
                                        label: "",
                                        dateRange: dateRange,
                                    },
                                },
                            }),

                            ...(is_manual && {
                                auditDateKey: activeAuditDateKey,
                                auditors:
                                    filters.auditors_id === null
                                        ? []
                                        : filters.auditors_id,
                                ...(!isDefined(audit_date_repr) && {
                                    auditDateOptions: {
                                        ...state.auditDateOptions,
                                        [activeAuditDateKey]: {
                                            name: activeAuditDateKey,
                                            is_roling_date: false,
                                            label: "",
                                            dateRange: auditDateRange,
                                        },
                                    },
                                }),
                            }),
                            durationKey,
                            ...(typeof durationKey === "string" && {
                                durationOptions: {
                                    ...state.durationOptions,
                                    [durationKey]: {
                                        name: durationKey,
                                        value: durationRange,
                                    },
                                },
                            }),
                            ...(isReport
                                ? {
                                      isReport,
                                  }
                                : {
                                      singleObjectData: data || {
                                          count: 0,
                                          change: 0,
                                      },
                                  }),
                        });
                        setIsFiltersModalOpen(true);
                    }}
                >
                    <FiltersSvg />
                    <Box component="span" sx={{ pl: 1.5 }}>
                        Filter
                    </Box>
                </Box>
                <Box
                    className="flex items-center cursor-pointer"
                    sx={{ py: 0.6, px: 1.5 }}
                    onClick={() => {
                        updateState({
                            name: name,
                            idToUpdate: id,
                        });
                        setIsRenameModalOpen(true);
                    }}
                >
                    <EditSvg />
                    <Box component="span" sx={{ pl: 2.19 }}>
                        Rename
                    </Box>
                </Box>
                <Box
                    className="flex items-center cursor-pointer"
                    sx={{ py: 0.6, px: 1.5 }}
                    onClick={() => {
                        if (item.id !== undefined)
                            unPinReport({
                                id: item.id,
                                dashboard_id: +params.id,
                            });
                    }}
                >
                    <UnpinSvg />
                    <Box sx={{ pl: 1.5 }} component="span">
                        Unpin
                    </Box>
                </Box>
            </Box>
        </MoreOptions>
    );
};
