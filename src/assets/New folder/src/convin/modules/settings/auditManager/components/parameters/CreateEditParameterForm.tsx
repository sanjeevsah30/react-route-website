import { CloseSvg } from "@convin/components/svg";
import {
    Box,
    Typography,
    Divider,
    Stack,
    FormControlLabel,
    Checkbox,
    Drawer,
} from "@mui/material";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, RHFTextField } from "@convin/components/hook-form";
import { Question, QuestionPayload } from "@convin/type/Audit";
import { LoadingButton } from "@mui/lab";
import {
    useCreateParameterMutation,
    useGetParameterByCategoryIdQuery,
    useUpdateParameterByIdMutation,
} from "@convin/redux/services/settings/auditManager.service";
import { useParams } from "react-router-dom";
import { showToast } from "@convin/utils/toast";
import GenericSelect from "@convin/components/select/GenericSelect";
import BooleanPrameterSettings from "./BooleanPrameterSettings";
import useParameterStateContext from "../hooks/useParameterStateContext";
import RatingParameterSettings from "./RatingParameterSettings";
import { isDefined } from "@convin/utils/helper/common.helper";
import CustomParameterSettings from "./CustomParameterSettings";
import { CreateUpdateToastSettings } from "@convin/config/toast.config";
import { liveAssistAlisCharLimit } from "@convin/config/audit.config";
import { useEffect, useRef } from "react";

type Props = {
    handleClose: () => void;
    isOpen: boolean;
};

export default function CreateEditParameterForm({
    handleClose,
    isOpen,
}: Props): JSX.Element {
    const { category_id } = useParams<{ category_id: string }>();
    const ref = useRef<HTMLDivElement>();
    const { data: parameterList } = useGetParameterByCategoryIdQuery(
        +category_id,
        {
            skip: !isDefined(category_id),
        }
    );

    const [createParameter, { isLoading: isCreateing }] =
        useCreateParameterMutation();
    const [updateParameter, { isLoading: isUpdateing }] =
        useUpdateParameterByIdMutation();

    const { state, dispatch } = useParameterStateContext();
    const schema = Yup.object().shape({
        question_text: Yup.string().required("Parameter Name is required"),
        live_assist_alias: Yup.string()
            .max(
                liveAssistAlisCharLimit,
                `Can't exceed ${liveAssistAlisCharLimit} charecters`
            )
            .nullable(),
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

    const onSubmit = async (data: typeof state) => {
        if (isDefined(category_id)) {
            const {
                question_text,
                question_type,
                question_desc,
                is_mandatory,
                intent,
                live_assist_alias,
                settings,
                is_live_assist,
            } = data;
            let payload: Partial<QuestionPayload> = {};

            payload = {
                ...payload,
                question_text,
                question_type,
                question_desc,
                is_mandatory,
                intent,
                category: +category_id,
                live_assist_alias,
                is_live_assist,
            };

            const settingsPayload = {
                default: settings.default,
                mandate_notes_on: settings.mandate_notes_on,
            };
            if (question_type === "yes_no") {
                const yes_reasons = settings?.boolean_reasons?.yes_reasons.map(
                    (e) => ({
                        ...(typeof e.id === "number" && { id: e.id }),
                        reason_text: e.reason_text,
                        option_id: e.option_id,
                    })
                );
                const no_reasons = settings?.boolean_reasons?.no_reasons.map(
                    (e) => ({
                        ...(typeof e.id === "number" && { id: e.id }),
                        reason_text: e.reason_text,
                        option_id: e.option_id,
                    })
                );

                payload = {
                    ...payload,
                    reasons: [...yes_reasons, ...no_reasons],
                    applicable_violation: Array.from(
                        new Set(
                            Object.values(settings.boolean_violations).flat()
                        )
                    ),
                    settings: {
                        ...settingsPayload,
                        no_weight: +settings.no_weight,
                        yes_weight: +settings.yes_weight,
                        violation: {
                            yes_weight: settings.boolean_violations.yes_weight,
                            no_weight: settings.boolean_violations.no_weight,
                        },
                    },
                };
            } else if (question_type === "rating") {
                const reasons = Object.values(settings.rating_reasons)
                    .flat()
                    .map((e) => ({
                        ...(typeof e.id === "number" && { id: e.id }),
                        reason_text: e.reason_text,
                    }));
                payload = {
                    ...payload,
                    applicable_violation: Array.from(
                        new Set(
                            Object.values(settings.rating_violations).flat()
                        )
                    ),
                    reasons,
                    settings: {
                        ...settingsPayload,
                        weight: +state.settings.weight,
                        violation: settings.rating_violations,
                    },
                };
            } else if (question_type === "custom") {
                const violation: Record<string, number[]> = {};
                state.settings.custom.forEach(
                    (e) => (violation[e.name] = e.violation)
                );
                const findNaName = state.settings.custom.find(
                    (e) => e.name.toLowerCase() === "na" && e.id !== -1
                );
                if (findNaName) {
                    return showToast({
                        type: "error",
                        message: "You can't use Na as a response name",
                    });
                }
                payload = {
                    ...payload,
                    applicable_violation: Array.from(
                        new Set(
                            Object.values(violation)
                                .flat()
                                .filter((e) => e)
                        )
                    ),
                    settings: {
                        ...settingsPayload,
                        is_deduction: state.settings.is_deduction,
                        is_template_level: state.settings.is_template_level,
                        custom: state.settings.custom.map(
                            //Don't include violations in the payload so have destructured it
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            ({ id, reasons, violation, weight, ...rest }) => ({
                                ...(typeof id === "number" && { id }),
                                reasons: reasons.map(({ id, ...rest }) => ({
                                    ...(typeof id === "number" && { id }),
                                    ...rest,
                                })),
                                weight: +weight || 0,
                                ...rest,
                            })
                        ),
                        violation,
                    },
                };
            } else if (question_type === "none") {
                payload = {
                    ...payload,
                    settings: {
                        ...settingsPayload,
                    },
                };
            }
            if (state.id) {
                updateParameter({
                    ...payload,
                    id: state.id,
                })
                    .unwrap()
                    .then(() => {
                        dispatch({
                            type: "RESET",
                            payload: {},
                        });
                        handleClose();
                    });
            } else
                createParameter({
                    ...payload,
                    seq_no: parameterList?.length || 0,
                })
                    .unwrap()
                    .then(() => {
                        showToast({
                            ...CreateUpdateToastSettings,
                            message: "Parameter has been created",
                        });
                        dispatch({
                            type: "RESET",
                            payload: {},
                        });
                        handleClose();
                    })
                    .catch(() => {
                        return;
                    });
        }
    };

    useEffect(() => {
        if (Object.keys(errors).length) {
            if (ref.current !== null) {
                ref.current?.scrollTo(0, 0);
            }
        }
    }, [errors]);

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={() => {
                if (isDefined(state.id)) {
                    dispatch({
                        type: "RESET",
                        payload: {},
                    });
                }
                handleClose();
            }}
        >
            <Box className="w-[540px] flex flex-col h-full">
                <FormProvider
                    methods={methods}
                    onSubmit={handleSubmit(onSubmit)}
                    className={"h-full flex flex-col"}
                >
                    <Box
                        sx={{ px: 2.5, py: 3 }}
                        className="flex items-center gap-[22px] flex-shrink-0"
                    >
                        <Box
                            sx={{
                                color: "grey.666",
                            }}
                            className="cursor-pointer"
                            onClick={handleClose}
                        >
                            <CloseSvg />
                        </Box>
                        <Typography
                            variant="extraLarge"
                            className="font-semibold"
                        >
                            {isDefined(state.id) ? "Update" : "Create"}{" "}
                            Parameter
                        </Typography>
                    </Box>
                    <Divider />
                    <Box className="flex-1 overflow-y-scroll" ref={ref}>
                        <Box sx={{ p: 2.5 }} className="flex-1">
                            <RHFTextField
                                name="question_text"
                                label="Parameter Name*"
                                variant="filled"
                                className="w-full"
                                sx={{ mb: 2 }}
                                value={state.question_text}
                                onChange={(
                                    e: React.ChangeEvent<
                                        HTMLTextAreaElement | HTMLInputElement
                                    >
                                ) =>
                                    dispatch({
                                        type: "UPDATE",
                                        payload: {
                                            question_text: e.target.value,
                                        },
                                    })
                                }
                            />
                            <RHFTextField
                                name="live_assist_alias"
                                label="Agent Assist Parameter Name"
                                variant="filled"
                                className="w-full"
                                value={state.live_assist_alias}
                                onChange={(
                                    e: React.ChangeEvent<
                                        HTMLTextAreaElement | HTMLInputElement
                                    >
                                ) =>
                                    dispatch({
                                        type: "UPDATE",
                                        payload: {
                                            live_assist_alias: e.target.value,
                                            is_live_assist: e.target.value
                                                .length
                                                ? true
                                                : false,
                                        },
                                    })
                                }
                            />
                            <Box
                                className="flex flex-row-reverse"
                                sx={{ mb: 3 }}
                            >
                                <Typography sx={{ color: "grey.666" }}>
                                    Character Limit 60
                                </Typography>
                            </Box>
                            <RHFTextField
                                name="question_desc"
                                label="Description"
                                variant="filled"
                                className="w-full"
                                sx={{ mb: 3 }}
                                multiline
                                rows={4}
                                value={state.question_desc}
                                onChange={(
                                    e: React.ChangeEvent<
                                        HTMLTextAreaElement | HTMLInputElement
                                    >
                                ) =>
                                    dispatch({
                                        type: "UPDATE",
                                        payload: {
                                            question_desc: e.target.value,
                                        },
                                    })
                                }
                            />
                            <Stack direction="row" gap={2}>
                                <GenericSelect<Question["question_type"]>
                                    className="flex-1"
                                    label="Response Type"
                                    options={[
                                        { id: "yes_no", value: "Yes/No" },
                                        { id: "rating", value: "Scale 1-10" },
                                        { id: "custom", value: "Custom" },
                                        { id: "none", value: "None" },
                                    ]}
                                    value={state.question_type}
                                    handleChange={(e) => {
                                        dispatch({
                                            type: "UPDATE",
                                            payload: {
                                                question_type: e,
                                            },
                                        });
                                    }}
                                />
                                <GenericSelect<number | string>
                                    className="flex-1"
                                    label="Default Response"
                                    options={
                                        state.question_type === "yes_no"
                                            ? [
                                                  { id: 1, value: "Yes" },
                                                  { id: 0, value: "No" },
                                                  { id: -1, value: "Na" },
                                              ]
                                            : state.question_type === "rating"
                                            ? [
                                                  ...new Array(11)
                                                      .fill(0)
                                                      .map((_, idx) => ({
                                                          id: idx,
                                                          value: idx.toString(),
                                                      })),
                                                  { id: -1, value: "Na" },
                                              ]
                                            : [
                                                  ...state.settings.custom
                                                      .filter(
                                                          (e) => e.id !== -1
                                                      )
                                                      .map((e) => ({
                                                          id: e.id,
                                                          value: e.name,
                                                      })),
                                                  { id: -1, value: "Na" },
                                              ]
                                    }
                                    value={state.settings.default}
                                    handleChange={(e) => {
                                        dispatch({
                                            type: "UPDATE",
                                            payload: {
                                                settings: {
                                                    ...state.settings,
                                                    default: e,
                                                },
                                            },
                                        });
                                    }}
                                />
                                <GenericSelect<Question["intent"]>
                                    className="flex-1"
                                    label="Intent"
                                    options={[
                                        { id: "positive", value: "Positive" },
                                        { id: "negative", value: "Negative" },
                                        { id: "neutral", value: "Neutral" },
                                    ]}
                                    value={state.intent}
                                    handleChange={(e) => {
                                        dispatch({
                                            type: "UPDATE",
                                            payload: {
                                                intent: e,
                                            },
                                        });
                                    }}
                                />
                            </Stack>
                            <FormControlLabel
                                sx={{ mt: 3 }}
                                control={
                                    <Checkbox
                                        checked={state.is_mandatory}
                                        onChange={(e) => {
                                            dispatch({
                                                type: "UPDATE",
                                                payload: {
                                                    is_mandatory:
                                                        e.target.checked,
                                                },
                                            });
                                        }}
                                    />
                                }
                                label={
                                    <Typography
                                        component="span"
                                        variant="medium"
                                    >
                                        {state.question_type === "none"
                                            ? "Note Must"
                                            : "Make the response Mandatory for this Parameter."}
                                    </Typography>
                                }
                            />
                            {state.question_type === "yes_no" ? (
                                <BooleanPrameterSettings />
                            ) : state.question_type === "rating" ? (
                                <RatingParameterSettings />
                            ) : state.question_type === "custom" ? (
                                <CustomParameterSettings />
                            ) : (
                                <></>
                            )}
                        </Box>
                    </Box>
                    <Divider />

                    <Box
                        sx={{ px: 2.5, py: 3 }}
                        className="flex justify-center"
                    >
                        <LoadingButton
                            fullWidth
                            size="large"
                            type="submit"
                            variant="global"
                            loading={isCreateing || isUpdateing}
                            className="w-[186px]"
                        >
                            {isDefined(state.id) ? "UPDATE" : "CREATE"}{" "}
                            PARAMETER
                        </LoadingButton>
                    </Box>
                </FormProvider>
            </Box>
        </Drawer>
    );
}
