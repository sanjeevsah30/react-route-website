import { useEffect, useRef, useState } from "react";
import { CloseSvg } from "@convin/components/svg";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Checkbox,
    Divider,
    Drawer,
    FormControlLabel,
    Radio,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import ExpandAccordianSvg from "@convin/components/svg/ExpandAccordianSvg";
import BorderedBox from "@convin/components/custom_components/BorderedBox";
import MuiTeamSelector from "@convin/components/custom_components/TreeSelect/MuiTeamSelector";
import { LoadingButton } from "@mui/lab";
import SingleObjSvg from "@convin/components/svg/SingleObjSvg";
import LockSvg from "@convin/components/svg/LockSvg";
import GlobeSvg from "@convin/components/svg/GlobeSvg";
import ShareSvg from "@convin/components/svg/ShareSvg";
import ReportSvg from "@convin/components/svg/ReportSvg";
import { useSelector } from "react-redux";
import {
    FormProvider,
    RHFMultiCheckboxLabel,
    RHFTextField,
} from "@convin/components/hook-form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { RootStore, CustomDashboardForm } from "@convin/type/CustomDashboard";
import {
    useCreateDashboardMutation,
    useGetSingleObjectsQuery,
    useUpdateDashboardMutation,
} from "@convin/redux/services/home/customDashboard.service";
import useCustomDashboardStateContext from "../hooks/useCustomDashboardStateContext";
import GenericMultipleSelect from "@convin/components/select/GenericMultipleSelect";
import { UserType } from "@convin/type/User";
import { useGetAllUserQuery } from "@convin/redux/services/settings/users.servise";
import { useHistory } from "react-router-dom";
import { useGetTemplatesQuery } from "@convin/redux/services/settings/auditManager.service";
import { alpha } from "@mui/system";

type CreateDashboardDrawer = {
    isDrawerOpen: boolean;
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsModelOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CreateDashboardDrawer({
    isDrawerOpen,
    setIsDrawerOpen,
    setIsModelOpen,
}: CreateDashboardDrawer): JSX.Element {
    const ref = useRef<HTMLDivElement>();

    const { state, prepareDashboardStateForUpdate, dispatch } =
        useCustomDashboardStateContext();
    const { data } = useGetSingleObjectsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const { data: templates } = useGetTemplatesQuery();
    const theme = useTheme();

    const history = useHistory();

    const { all_reports } = useSelector(
        (state: RootStore) => state.scheduled_reports
    );

    const { data: userList, isFetching: isUserListFetching } =
        useGetAllUserQuery();

    const [createDashboard, { isLoading: isCreating }] =
        useCreateDashboardMutation();
    const [updateDashboard, { isLoading: isUpdateing }] =
        useUpdateDashboardMutation();
    const schema = Yup.object().shape({
        dashboard_name: Yup.string().required("Dashboard Name is required"),
        description: Yup.string().required("Description is required"),
    });
    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: state,
        values: state,
        shouldFocusError: true,
    });
    const {
        handleSubmit,
        formState: { errors },
    } = methods;

    const handleClose = () => {
        setIsDrawerOpen(false);
        dispatch({
            type: "RESET",
            payload: {},
        });
    };

    const onSubmit = async (data: CustomDashboardForm) => {
        const paylaod = {
            ...data,
            single_objects: data.single_objects.map((item) => {
                return {
                    ...item,
                    filters: {
                        ...item.filters,
                        template_id: templates?.[0]?.id || null,
                    },
                };
            }),
            reports: data.reports.map((item) => {
                return {
                    ...item,
                    filters: {
                        ...item.filters,
                        template_id: templates?.[0]?.id || null,
                    },
                };
            }),
        };
        if (!!state.id) {
            updateDashboard(paylaod)
                .unwrap()
                .then(() => {
                    handleClose();
                });
        } else {
            createDashboard(paylaod)
                .unwrap()
                .then((res) => {
                    handleClose();
                    history.push(`/home/custom/${res.id}`);
                });
        }
    };

    const handleAccessLevel = (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        prepareDashboardStateForUpdate({
            access_level: event.target.value as "private" | "public" | "shared",
        });
    };

    useEffect(() => {
        if (Object.keys(errors).length) {
            if (ref.current !== null) {
                ref.current?.scrollTo(0, 0);
            }
        }
    }, [errors]);

    return (
        <Drawer open={isDrawerOpen} anchor={"right"}>
            <FormProvider
                methods={methods}
                onSubmit={handleSubmit(onSubmit)}
                className={"custom-dashboard-drawer h-full flex flex-col"}
            >
                <Box className="w-[540px] flex flex-col h-full">
                    <Box
                        sx={{ px: 2.5, py: 3 }}
                        className="flex items-center gap-[22px] flex-shrink-0"
                    >
                        <Box
                            sx={{
                                color: "grey.666",
                            }}
                            className="cursor-pointer"
                            onClick={() =>
                                setIsModelOpen
                                    ? setIsModelOpen(true)
                                    : handleClose()
                            }
                        >
                            <CloseSvg />
                        </Box>
                        <Typography>
                            {`${state.id ? "Update" : "Create"}`} Custom
                            Dashboard
                        </Typography>
                    </Box>
                    <Box className="flex-1 overflow-y-scroll" ref={ref}>
                        <Divider />
                        <Accordion disableGutters={true} defaultExpanded={true}>
                            <AccordionSummary
                                aria-controls="panel1d-content"
                                id="panel1d-header"
                                expandIcon={<ExpandAccordianSvg />}
                            >
                                <Typography
                                    className="font-semibold"
                                    sx={{ color: "grey.666" }}
                                >
                                    Basic Details
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box
                                    className="flex flex-col gap-[22px]"
                                    sx={{
                                        color: "grey.666",
                                    }}
                                >
                                    <RHFTextField
                                        name={"dashboard_name"}
                                        id="filled-basic"
                                        label="Enter Dashboard Name"
                                        variant="filled"
                                        value={state.dashboard_name}
                                        onChange={(
                                            e: React.ChangeEvent<
                                                | HTMLTextAreaElement
                                                | HTMLInputElement
                                            >
                                        ) => {
                                            prepareDashboardStateForUpdate({
                                                dashboard_name: e.target.value,
                                            });
                                        }}
                                    />
                                    <RHFTextField
                                        name={"description"}
                                        id="filled-basic"
                                        label="Description"
                                        variant="filled"
                                        value={state.description}
                                        onChange={(
                                            e: React.ChangeEvent<
                                                | HTMLTextAreaElement
                                                | HTMLInputElement
                                            >
                                        ) => {
                                            prepareDashboardStateForUpdate({
                                                description: e.target.value,
                                            });
                                        }}
                                    />
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion disableGutters={true} defaultExpanded={true}>
                            <AccordionSummary
                                aria-controls="panel1d-content"
                                id="panel1d-header"
                                expandIcon={<ExpandAccordianSvg />}
                            >
                                <Typography
                                    className="font-semibold"
                                    sx={{ color: "grey.666" }}
                                >
                                    Viewing Details
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box
                                    className="flex gap-[10px]"
                                    sx={{
                                        color: "grey.666",
                                    }}
                                >
                                    <BorderedBox
                                        sx={{
                                            borderRadius: "6px",
                                            p: 1,
                                            width: 160,
                                        }}
                                    >
                                        <Box
                                            className="header flex justify-between items-center"
                                            sx={{ mb: 1.5 }}
                                        >
                                            <Box className="flex items-center">
                                                <LockSvg />
                                                <Typography
                                                    className="title font-semibold"
                                                    sx={{ ml: 1 }}
                                                >
                                                    Private
                                                </Typography>
                                            </Box>
                                            <Radio
                                                value="private"
                                                checked={
                                                    state.access_level ===
                                                    "private"
                                                }
                                                onChange={handleAccessLevel}
                                            />
                                        </Box>
                                        <Typography
                                            className="body"
                                            variant="small"
                                        >
                                            Only you can view this dashboard
                                        </Typography>
                                    </BorderedBox>
                                    <BorderedBox
                                        sx={{
                                            borderRadius: "6px",
                                            p: 1,
                                            width: 160,
                                        }}
                                    >
                                        <Box
                                            className="header flex justify-between items-center"
                                            sx={{ mb: 1.5 }}
                                        >
                                            <Box className="flex items-center">
                                                <GlobeSvg />
                                                <Typography
                                                    className="title font-semibold"
                                                    sx={{ ml: 1 }}
                                                >
                                                    Public
                                                </Typography>
                                            </Box>
                                            <Radio
                                                value="public"
                                                checked={
                                                    state.access_level ===
                                                    "public"
                                                }
                                                onChange={handleAccessLevel}
                                            />
                                        </Box>
                                        <Typography
                                            className="body"
                                            variant="small"
                                        >
                                            All users in the organization can
                                            view this dashboard
                                        </Typography>
                                    </BorderedBox>
                                    <BorderedBox
                                        sx={{
                                            borderRadius: "6px",
                                            p: 1,
                                            width: 160,
                                        }}
                                    >
                                        <Box
                                            className="header flex justify-between items-center"
                                            sx={{ mb: 1.5 }}
                                        >
                                            <Box className="flex items-center">
                                                <ShareSvg />
                                                <Typography
                                                    variant="medium"
                                                    className="font-semibold"
                                                    sx={{ ml: 1 }}
                                                >
                                                    Shared
                                                </Typography>
                                            </Box>
                                            <Radio
                                                value="shared"
                                                onChange={handleAccessLevel}
                                                checked={
                                                    state.access_level ===
                                                    "shared"
                                                }
                                            />
                                        </Box>
                                        <Typography variant="small">
                                            Only selected users can view this
                                            dashboard
                                        </Typography>
                                    </BorderedBox>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                        {state.access_level === "shared" && (
                            <Stack sx={{ p: 1 }} gap={2}>
                                <MuiTeamSelector
                                    value={state.teams}
                                    updateValue={(e: number[]) => {
                                        prepareDashboardStateForUpdate({
                                            teams: e,
                                        });
                                    }}
                                />
                                <GenericMultipleSelect<UserType>
                                    label="Reps"
                                    data={userList || []}
                                    loading={isUserListFetching}
                                    values={state.reps}
                                    setValues={(val: number[]) => {
                                        prepareDashboardStateForUpdate({
                                            reps: val,
                                        });
                                    }}
                                />
                            </Stack>
                        )}
                        <Accordion
                            disableGutters={true}
                            defaultExpanded={true}
                            sx={{ border: "none" }}
                        >
                            <AccordionSummary
                                aria-controls="panel1d-content"
                                id="panel1d-header"
                                expandIcon={<ExpandAccordianSvg />}
                            >
                                <Typography
                                    className="font-semibold"
                                    sx={{ color: "grey.666" }}
                                >
                                    Single Object
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box
                                    className="flex flex-col gap-[22px]"
                                    sx={{
                                        color: "grey.666",
                                        background: alpha(
                                            theme.palette.primary.main,
                                            0.1
                                        ),
                                        maxHeight: "280px",
                                        overflow: "scroll",
                                        "& .MuiFormControlLabel-root": {
                                            display: "flex",
                                            justifyContent: "space-between",
                                        },
                                    }}
                                >
                                    {data?.map((option) => (
                                        <FormControlLabel
                                            key={option.name}
                                            control={
                                                <Checkbox
                                                    checked={state.single_objects
                                                        .map(
                                                            (item) => item.type
                                                        )
                                                        .includes(option.type)}
                                                    onChange={(e) => {
                                                        prepareDashboardStateForUpdate(
                                                            {
                                                                single_objects:
                                                                    e.target
                                                                        .checked
                                                                        ? [
                                                                              ...state.single_objects,
                                                                              option,
                                                                          ]
                                                                        : state.single_objects.filter(
                                                                              (
                                                                                  e
                                                                              ) =>
                                                                                  e.type !==
                                                                                  option.type
                                                                          ),
                                                            }
                                                        );
                                                    }}
                                                />
                                            }
                                            sx={{ pl: 2, pr: 3, py: 1 }}
                                            labelPlacement="start"
                                            label={
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                    }}
                                                >
                                                    <SingleObjSvg />
                                                    <Typography
                                                        sx={{
                                                            pl: 1,
                                                        }}
                                                    >
                                                        {option.name}
                                                    </Typography>
                                                </Box>
                                            }
                                            value={option}
                                        />
                                    ))}
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion disableGutters={true} defaultExpanded={true}>
                            <AccordionSummary
                                aria-controls="panel1d-content"
                                id="panel1d-header"
                                expandIcon={<ExpandAccordianSvg />}
                            >
                                <Typography
                                    className="font-semibold"
                                    sx={{
                                        color: "grey.666",
                                    }}
                                >
                                    Reports
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box
                                    className="flex flex-col gap-[22px]"
                                    sx={{
                                        color: "grey.666",
                                        background: alpha(
                                            theme.palette.primary.main,
                                            0.1
                                        ),
                                        maxHeight: "280px",
                                        overflow: "scroll",
                                        "& .MuiFormControlLabel-root": {
                                            display: "flex",
                                            justifyContent: "space-between",
                                        },
                                    }}
                                >
                                    {all_reports.data?.map((option) => (
                                        <FormControlLabel
                                            key={option.name}
                                            control={
                                                <Checkbox
                                                    checked={state.reports
                                                        .map(
                                                            (item) => item.type
                                                        )
                                                        .includes(option.type)}
                                                    onChange={(e) => {
                                                        prepareDashboardStateForUpdate(
                                                            {
                                                                reports: e
                                                                    .target
                                                                    .checked
                                                                    ? [
                                                                          ...state.reports,
                                                                          option,
                                                                      ]
                                                                    : state.reports.filter(
                                                                          (e) =>
                                                                              e.type !==
                                                                              option.type
                                                                      ),
                                                            }
                                                        );
                                                    }}
                                                />
                                            }
                                            sx={{ pl: 2, pr: 3, py: 1 }}
                                            labelPlacement="start"
                                            label={
                                                <Box className="flex">
                                                    <ReportSvg />
                                                    <Typography
                                                        sx={{
                                                            pl: 1,
                                                        }}
                                                    >
                                                        {option.name}
                                                    </Typography>
                                                </Box>
                                            }
                                            value={option}
                                        />
                                    ))}
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                    <Box sx={{ px: 2.5, py: 3 }} className="flex justify-end">
                        <LoadingButton
                            fullWidth
                            size="large"
                            type="submit"
                            variant="global"
                            loading={isCreating || isUpdateing}
                            className="w-auto"
                        >
                            {`${!!state.id ? "Update" : "Create"} Dashboard`}
                        </LoadingButton>
                    </Box>
                </Box>
            </FormProvider>
        </Drawer>
    );
}
