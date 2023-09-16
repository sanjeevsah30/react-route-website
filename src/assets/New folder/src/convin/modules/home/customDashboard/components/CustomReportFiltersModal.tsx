import DateFilter from "@convin/components/custom_components/Filters/DateFilter";
import GenericMultipleSelect from "@convin/components/select/GenericMultipleSelect";
import GenericSelect from "@convin/components/select/GenericSelect";
import { CloseSvg } from "@convin/components/svg";
import { useGetStagesQuery } from "@convin/redux/services/account/account.service";
import { useGetTemplatesQuery } from "@convin/redux/services/settings/auditManager.service";
import { useGetCallTypesQuery } from "@convin/redux/services/settings/callTypeManager.service";
import {
    useGetAllAuditorsQuery,
    useGetAllUserQuery,
} from "@convin/redux/services/settings/users.servise";
import { CallTag, CallType } from "@convin/type/CallManager";
import { UserType } from "@convin/type/User";
import {
    Box,
    Divider,
    Modal,
    Radio,
    Stack,
    TextField,
    Typography,
    alpha,
    useTheme,
} from "@mui/material";
import React, { Dispatch, FunctionComponent } from "react";
import ReportDashboard from "app/components/AnalyticsDashboard/Components/ReportDashboard";
import MuiTeamSelector from "@convin/components/custom_components/TreeSelect/MuiTeamSelector";
import { AuditCard } from "./AuditCard";
import useCustomDashboardModalStateContext from "../hooks/useCustomDashboardModalStateContext";
import DurationFilter from "@convin/components/custom_components/Filters/DurationFilter";
import { LoadingButton } from "@mui/lab";
import {
    useCreateCustomDahboardReportMutation,
    useUpdateCustomDahboardReportMutation,
} from "@convin/redux/services/home/customDashboard.service";
import { Filters } from "@convin/type/CustomDashboard";
import { isDefined } from "@convin/utils/helper/common.helper";
import { useParams } from "react-router-dom";
import { getReport } from "@store/dashboard/dashboard";
import { useDispatch } from "react-redux";
import { useGetCallTagsQuery } from "@convin/redux/services/settings/callTagsManager.service";
import { RHFRadioGroup } from "@convin/components/hook-form";
import GenericRadioGroup from "@convin/components/select/GenericRadioGroup";
import { datekeys } from "@convin/config/default.config";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1178,
    bgcolor: "common.white",
    boxShadow: 24,
    borderRadius: "12px",
    height: 653,
};

export const CustomReportFiltersModal: FunctionComponent<{
    isFiltersModalOpen: boolean;
    setIsFiltersModalOpen: Dispatch<React.SetStateAction<boolean>>;
}> = ({ isFiltersModalOpen, setIsFiltersModalOpen }) => {
    const {
        state: filtersState,
        updateState: updateFiltersState,
        prepareFilters,
        dispatch,
    } = useCustomDashboardModalStateContext();
    const { data: callTypeList, isLoading: isCallTypesListLoading } =
        useGetCallTypesQuery();
    const { data: callTagList, isLoading: isCallTagsLoading } =
        useGetCallTagsQuery();
    const { data: stages } = useGetStagesQuery();
    const { data: templates } = useGetTemplatesQuery();
    const { data: userList, isFetching: isUserListFetching } =
        useGetAllUserQuery();
    const { data: auditorList, isFetching: isAuditorListFetching } =
        useGetAllAuditorsQuery();

    const [create, { isLoading: isCreateing }] =
        useCreateCustomDahboardReportMutation();

    const [update, { isLoading: isUpdateing }] =
        useUpdateCustomDahboardReportMutation();

    const reduxDispatch = useDispatch();

    const { id } = useParams<{ id: string }>();

    const theme = useTheme();

    const handleUpdate = () => {
        if (isDefined(filtersState.idToUpdate)) {
            const filters = prepareFilters();
            update({
                name: filtersState.name,
                id: filtersState.idToUpdate,
                filters,
            })
                .unwrap()
                .then((res) => {
                    if (res.card_type === "report") {
                        reduxDispatch(
                            getReport({
                                ...filters,
                                type: res.type,
                                id: res.id,
                            })
                        );
                    }

                    dispatch({
                        type: "RESET",
                        payload: {},
                    });
                    setIsFiltersModalOpen(false);
                });
        }

        return;
    };

    const handleCreate = () => {
        if (isDefined(filtersState.idToUpdate))
            create({
                name: filtersState.name,
                custom_dashboard: +id,
                card_type: filtersState.isReport ? "report" : "single_object",
                filters: prepareFilters() as Filters,
                type: filtersState.reportType,
                layout: filtersState.layout,
            })
                .unwrap()
                .then(() => {
                    dispatch({
                        type: "RESET",
                        payload: {},
                    });
                    setIsFiltersModalOpen(false);
                });

        return;
    };

    return (
        <Modal open={isFiltersModalOpen}>
            <Box sx={style}>
                <Box>
                    <Box
                        sx={{ p: 3.5 }}
                        className="flex items-center justify-between"
                    >
                        <Typography
                            id="modal-modal-title"
                            className="font-semibold"
                            variant="large"
                        >
                            View & Filter Card
                        </Typography>
                        <Box onClick={() => setIsFiltersModalOpen(false)}>
                            <CloseSvg />
                        </Box>
                    </Box>
                    <Divider />
                </Box>
                <Box sx={{ px: 3.5, py: 3 }}>
                    <Box id="modal-modal-body" className="flex align-center">
                        <Box sx={{ flex: 1.5 }}>
                            {filtersState.reportType ? (
                                <Typography
                                    className="font-semibold"
                                    sx={{ mb: 1 }}
                                >
                                    {filtersState.name}
                                </Typography>
                            ) : (
                                <></>
                            )}

                            <Box
                                className="flex items-center justify-center"
                                sx={{
                                    width: 645,
                                    height: 402,
                                }}
                            >
                                {filtersState.isReport ? (
                                    <ReportDashboard
                                        inView={true}
                                        activeReportType={
                                            filtersState.reportType
                                        }
                                        isSingleReportDashboard={false}
                                        isPined={true}
                                        pinReportId={0}
                                        isCustomDashboard={true}
                                        renderOptions={() => <span />}
                                        filters={prepareFilters()}
                                        report_name={""}
                                    />
                                ) : (
                                    <Box
                                        className="flex flex-col items-center justify-center cursor-pointer"
                                        sx={{
                                            p: 1,
                                            background: "#fff",
                                            borderRadius: "12px",
                                            boxShadow:
                                                "0px 4px 20px rgba(51, 51, 51, 0.1)",
                                            width: 499,
                                            height: 244,
                                        }}
                                    >
                                        <AuditCard
                                            title={filtersState.name}
                                            name={filtersState.name}
                                            active={true}
                                            {...filtersState.singleObjectData}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Box>
                        <Box sx={{ flex: 1, height: 400 }}>
                            <Typography
                                sx={{ mb: 1.5, color: "common.black" }}
                                className="font-semibold"
                            >
                                Filters
                            </Typography>
                            <Box
                                sx={{ height: "100%", pr: 3 }}
                                className="overflow-y-scroll"
                            >
                                <Stack gap={3}>
                                    <TextField
                                        id="filled-basic"
                                        label="Custom Card Name"
                                        variant="filled"
                                        value={filtersState.name}
                                        onChange={(e) => {
                                            updateFiltersState({
                                                name: e.target.value,
                                            });
                                        }}
                                    />
                                    <MuiTeamSelector
                                        value={filtersState.teams}
                                        updateValue={(val: number[]) =>
                                            updateFiltersState({
                                                teams: val,
                                            })
                                        }
                                    />
                                    <GenericMultipleSelect<UserType>
                                        label="Reps"
                                        data={userList || []}
                                        loading={isUserListFetching}
                                        values={filtersState.reps}
                                        setValues={(val: number[]) => {
                                            updateFiltersState({
                                                reps: val,
                                            });
                                        }}
                                    />
                                    <GenericSelect<number | null>
                                        className="w-full"
                                        label="Template"
                                        options={
                                            templates?.map((e) => ({
                                                ...e,
                                                value: e.name,
                                            })) || []
                                        }
                                        value={filtersState.template}
                                        handleChange={(e) => {
                                            updateFiltersState({
                                                template: e,
                                            });
                                        }}
                                    />
                                    <DurationFilter
                                        value={filtersState.durationKey}
                                        handleUpdate={(e: {
                                            is_custom: boolean;
                                            value: string;
                                            range: [
                                                number | null,
                                                number | null
                                            ];
                                        }) => {
                                            if (!Boolean(e.is_custom)) {
                                                updateFiltersState({
                                                    durationKey: e.value,
                                                });
                                            } else {
                                                updateFiltersState({
                                                    durationKey: e.value,
                                                    durationOptions: {
                                                        ...filtersState.durationOptions,
                                                        [e.value]: {
                                                            name: e.value,
                                                            value: e.range,
                                                        },
                                                    },
                                                });
                                            }
                                        }}
                                        options={filtersState.durationOptions}
                                    />
                                    <DateFilter
                                        label={"Meeting Date"}
                                        value={filtersState.dateKey}
                                        options={filtersState.dateOptions}
                                        handleUpdate={(e: {
                                            is_custom: boolean;
                                            value: string;
                                            dateRange: [
                                                string | null,
                                                string | null
                                            ];
                                        }) => {
                                            if (!Boolean(e.is_custom)) {
                                                updateFiltersState({
                                                    dateKey: e.value,
                                                });
                                            } else {
                                                updateFiltersState({
                                                    dateKey: e.value,
                                                    dateOptions: {
                                                        ...filtersState.dateOptions,
                                                        [e.value]: {
                                                            name: e.value,
                                                            is_roling_date:
                                                                false,
                                                            label: "",
                                                            dateRange:
                                                                e.dateRange,
                                                        },
                                                    },
                                                });
                                            }
                                        }}
                                    />

                                    <GenericMultipleSelect<CallType>
                                        label="Type"
                                        data={callTypeList || []}
                                        loading={isCallTypesListLoading}
                                        values={filtersState.call_types_id}
                                        setValues={(val: number[]) =>
                                            updateFiltersState({
                                                call_types_id: val,
                                            })
                                        }
                                    />
                                    <GenericMultipleSelect<CallTag>
                                        label="Tags"
                                        data={callTagList || []}
                                        loading={isCallTagsLoading}
                                        values={filtersState.tags}
                                        setValues={(val: number[]) =>
                                            updateFiltersState({
                                                tags: val,
                                            })
                                        }
                                    />
                                    <GenericSelect<0 | 1>
                                        className="w-full"
                                        label="Level"
                                        options={[
                                            { id: 1, value: "Call" },
                                            { id: 0, value: "Account" },
                                        ]}
                                        value={filtersState.level}
                                        handleChange={(e) => {
                                            updateFiltersState({
                                                level: e,
                                            });
                                        }}
                                    />

                                    <GenericSelect<0 | 1>
                                        className="w-full"
                                        label="Audit Type"
                                        options={[
                                            { id: 0, value: "AI" },
                                            { id: 1, value: "Manual" },
                                        ]}
                                        value={filtersState.auditType}
                                        handleChange={(e) => {
                                            updateFiltersState({
                                                auditType: e,
                                                ...(e === 0
                                                    ? {
                                                          auditDateKey: null,
                                                          auditors: [],
                                                      }
                                                    : {
                                                          auditDateKey:
                                                              datekeys.all,
                                                      }),
                                            });
                                        }}
                                    />
                                    {filtersState.auditType ? (
                                        <Box
                                            sx={{
                                                bgcolor: alpha(
                                                    theme.palette?.primary
                                                        ?.main,
                                                    0.1
                                                ),
                                                borderRadius: "6px",
                                                p: 2,
                                            }}
                                        >
                                            {/* <Box className="flex items-center justify-between gap-[40px]">
                                            <Typography
                                                variant="medium"
                                                className="font-semibold"
                                            >
                                                Choose Audit Level
                                            </Typography>
                                            <Box className="flex flex-1 items-center gap-[45px]">
                                                <GenericRadioGroup<0 | 1>
                                                    name="is_manual"
                                                    options={[
                                                        { id: 0, label: "AI" },
                                                        {
                                                            id: 1,
                                                            label: "Manual",
                                                        },
                                                    ]}
                                                    className="gap-12"
                                                    value={
                                                        filtersState.auditType
                                                    }
                                                    handleChange={(value) => {
                                                        updateFiltersState({
                                                            auditType: value,
                                                            ...(value === 0 && {
                                                                auditDateKey:
                                                                    null,
                                                                auditors: [],
                                                            }),
                                                        });
                                                    }}
                                                />
                                            </Box>
                                        </Box> */}

                                            <Stack
                                                gap={3}
                                                sx={{
                                                    mt: 2,
                                                }}
                                            >
                                                <DateFilter
                                                    label="Audited Date"
                                                    value={
                                                        filtersState.auditDateKey
                                                    }
                                                    options={
                                                        filtersState.auditDateOptions
                                                    }
                                                    handleUpdate={(e: {
                                                        is_custom: boolean;
                                                        value: string;
                                                        dateRange: [
                                                            string | null,
                                                            string | null
                                                        ];
                                                    }) => {
                                                        if (
                                                            !Boolean(
                                                                e.is_custom
                                                            )
                                                        ) {
                                                            updateFiltersState({
                                                                auditDateKey:
                                                                    e.value,
                                                            });
                                                        } else {
                                                            updateFiltersState({
                                                                auditDateKey:
                                                                    e.value,
                                                                auditDateOptions:
                                                                    {
                                                                        ...filtersState.auditDateOptions,
                                                                        [e.value]:
                                                                            {
                                                                                name: e.value,
                                                                                is_roling_date:
                                                                                    false,
                                                                                label: "",
                                                                                dateRange:
                                                                                    e.dateRange,
                                                                            },
                                                                    },
                                                            });
                                                        }
                                                    }}
                                                />
                                                <GenericMultipleSelect<UserType>
                                                    label="Auditors"
                                                    data={auditorList || []}
                                                    loading={
                                                        isAuditorListFetching
                                                    }
                                                    values={
                                                        filtersState.auditors
                                                    }
                                                    setValues={(
                                                        val: number[]
                                                    ) => {
                                                        updateFiltersState({
                                                            auditors: val,
                                                        });
                                                    }}
                                                />
                                            </Stack>
                                        </Box>
                                    ) : (
                                        <></>
                                    )}

                                    <GenericSelect<number | null>
                                        className="w-full"
                                        label="Status/Stage"
                                        options={
                                            stages?.map((e) => ({
                                                ...e,
                                                value: e.stage,
                                            })) || []
                                        }
                                        value={filtersState.stage}
                                        handleChange={(e) => {
                                            updateFiltersState({
                                                stage: e,
                                            });
                                        }}
                                    />
                                    <GenericSelect<"email" | "call" | "chat">
                                        label="Conversation Type"
                                        options={[
                                            { id: "call", value: "call" },
                                            { id: "chat", value: "chat" },
                                            { id: "email", value: "email" },
                                        ]}
                                        value={filtersState.meetingType}
                                        handleChange={(val) => {
                                            updateFiltersState({
                                                meetingType: val,
                                            });
                                        }}
                                    />
                                </Stack>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box>
                    <Divider sx={{ mx: 3.5 }} />
                    <Box sx={{ px: 3.5, py: 3 }} className="flex justify-end">
                        <LoadingButton
                            fullWidth
                            size="large"
                            variant="outlined"
                            className="w-auto"
                            onClick={handleUpdate}
                            loading={isUpdateing}
                        >
                            UPDATE REPORT
                        </LoadingButton>
                        <LoadingButton
                            fullWidth
                            size="large"
                            type="submit"
                            variant="global"
                            className="w-auto"
                            onClick={handleCreate}
                            loading={isCreateing}
                            sx={{ ml: 1 }}
                        >
                            CREATE NEW
                        </LoadingButton>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};
