import GoBack from "@convin/components/custom_components/Navigation/GoBack";
import MuiTeamSelector from "@convin/components/custom_components/TreeSelect/MuiTeamSelector";
import { Label } from "@convin/components/custom_components/Typography/Label";
import GenericMultipleSelect from "@convin/components/select/GenericMultipleSelect";
import GenericSelect from "@convin/components/select/GenericSelect";
import { useGetCallTagsQuery } from "@convin/redux/services/settings/callTagsManager.service";
import { useGetCallTypesQuery } from "@convin/redux/services/settings/callTypeManager.service";
import { CallTag, CallType } from "@convin/type/CallManager";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useHistory, useParams } from "react-router-dom";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useEffect, useState } from "react";
import { TemplatePayload } from "@convin/type/Audit";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, RHFTextField } from "@convin/components/hook-form";

import { LoadingButton } from "@mui/lab";
import {
    useCreateTemplateMutation,
    useGetTemplateByIdQuery,
    useUpdateTemplateMutation,
} from "@convin/redux/services/settings/auditManager.service";
import { SettingRoutes } from "@convin/config/routes.config";
import { isDefined } from "@convin/utils/helper/common.helper";
import PageLoader from "@convin/components/custom_components/PageLoader";
import { showToast } from "@convin/utils/toast";
import { CreateUpdateToastSettings } from "@convin/config/toast.config";
import { MeetingTypeConst } from "@convin/type/Common";

export default function TemplateCreateEditForm(): JSX.Element {
    const history = useHistory();
    const { template_id } = useParams<{ template_id: string }>();
    const { data: templateByIdData, isFetching } = useGetTemplateByIdQuery(
        template_id,
        {
            skip: !isDefined(template_id),
        }
    );

    const { data: callTypeList, isLoading: isCallTypesListLoading } =
        useGetCallTypesQuery();
    const { data: callTagList, isLoading: isCallTagsLoading } =
        useGetCallTagsQuery();
    console.log(callTypeList);
    const [templateData, setTemplateData] = useState<TemplatePayload>({
        name: "",
        teams: [],
        parameters: {
            call_tags: [],
            call_types: [],
            meeting_type: "call",
        },
        is_default: false,
        notify_on_audit: true,
    });
    console.log("templateDataTeams", templateData.teams);
    const [createTemplateRequest, { isLoading: isCreating }] =
        useCreateTemplateMutation();
    const [updateTemplateRequest, { isLoading: isUpdating }] =
        useUpdateTemplateMutation();

    const schema = Yup.object().shape({
        name: Yup.string().required("Template Name is required"),
    });

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: templateData,
        values: templateData,
    });

    const { handleSubmit } = methods;

    const onSubmit = async (data: TemplatePayload) => {
        if (template_id) {
            updateTemplateRequest({ id: +template_id, ...data })
                .unwrap()
                .then(() => {
                    showToast({
                        message: "Changes made successfully",
                        ...CreateUpdateToastSettings,
                    });
                });
        } else
            createTemplateRequest(data)
                .unwrap()
                .then((res) => {
                    if (res.id) {
                        history.push(
                            `/settings/${SettingRoutes.AUDIT_MANAGER.path}/${res.id}`
                        );
                    }
                    showToast({
                        message: "Template has been created",
                        ...CreateUpdateToastSettings,
                    });
                });
    };

    useEffect(() => {
        if (templateByIdData?.id) {
            const { name, teams, notify_on_audit, is_default, parameters } =
                templateByIdData;
            setTemplateData({
                ...templateData,
                name,
                teams: teams.map((e) => e.id),
                notify_on_audit,
                is_default,
                parameters,
            });
        }
    }, [templateByIdData]);

    if (isFetching) {
        return <PageLoader />;
    }

    return (
        <FormProvider
            methods={methods}
            onSubmit={handleSubmit(onSubmit)}
            className={"h-full"}
        >
            <Box sx={{ p: 3 }} className="h-full flex column">
                <Stack
                    direction="row"
                    gap={1}
                    className="items-center"
                    sx={{ mb: 3 }}
                >
                    <GoBack
                        path={
                            template_id
                                ? `/settings/${SettingRoutes.AUDIT_MANAGER.path}/${template_id}`
                                : `/settings/${SettingRoutes.AUDIT_MANAGER.path}/`
                        }
                    />
                    <Typography className="font-semibold text-[22px]">
                        {template_id
                            ? "Edit Audit Template"
                            : "Create Audit Template"}
                    </Typography>
                </Stack>

                <Box className="w-full flex-1 overflow-hidden">
                    <Stack
                        direction="row"
                        divider={<Divider orientation="vertical" flexItem />}
                        spacing={3}
                        className="h-full"
                    >
                        <div className="flex-1">
                            <RHFTextField
                                name="name"
                                label="Enter scorecard template name*"
                                variant="filled"
                                className="w-full"
                                sx={{ mb: 3 }}
                                value={templateData.name}
                                onChange={(
                                    e: React.ChangeEvent<
                                        HTMLTextAreaElement | HTMLInputElement
                                    >
                                ) =>
                                    setTemplateData({
                                        ...templateData,
                                        name: e.target.value,
                                    })
                                }
                            />
                            <ReadableInfo />
                        </div>
                        <Stack className="flex-1 overflow-scroll" gap={3}>
                            <Typography
                                className="font-semibold"
                                sx={{ mb: 2 }}
                            >
                                Applicable Filters
                            </Typography>
                            <MuiTeamSelector
                                value={templateData.teams}
                                updateValue={(val: number[]) =>
                                    setTemplateData({
                                        ...templateData,
                                        teams: val,
                                    })
                                }
                            />
                            <GenericMultipleSelect<CallType>
                                label="Call Type"
                                data={callTypeList || []}
                                loading={isCallTypesListLoading}
                                values={templateData.parameters.call_types}
                                setValues={(val: number[]) =>
                                    setTemplateData({
                                        ...templateData,
                                        parameters: {
                                            ...templateData.parameters,
                                            call_types: val,
                                        },
                                    })
                                }
                            />
                            <GenericMultipleSelect<CallTag>
                                label="Call Tag"
                                data={callTagList || []}
                                loading={isCallTagsLoading}
                                values={templateData.parameters.call_tags}
                                setValues={(val: number[]) =>
                                    setTemplateData({
                                        ...templateData,
                                        parameters: {
                                            ...templateData.parameters,
                                            call_tags: val,
                                        },
                                    })
                                }
                            />
                            <GenericSelect<MeetingTypeConst | null>
                                label="Conversation Type"
                                options={[
                                    { id: "call", value: "call" },
                                    { id: "chat", value: "chat" },
                                    { id: "email", value: "email" },
                                    { id: null, value: "none" },
                                ]}
                                value={templateData.parameters.meeting_type}
                                handleChange={(val) => {
                                    setTemplateData({
                                        ...templateData,
                                        parameters: {
                                            ...templateData.parameters,
                                            meeting_type: val || null,
                                        },
                                    });
                                }}
                            />

                            <Stack direction="row">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={
                                                templateData.notify_on_audit
                                            }
                                            onChange={(e) =>
                                                setTemplateData({
                                                    ...templateData,
                                                    notify_on_audit:
                                                        e.target.checked,
                                                })
                                            }
                                        />
                                    }
                                    label={
                                        <Typography
                                            component="span"
                                            variant="medium"
                                        >
                                            Notify on Audit
                                        </Typography>
                                    }
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={templateData.is_default}
                                            onChange={(e) =>
                                                setTemplateData({
                                                    ...templateData,
                                                    is_default:
                                                        e.target.checked,
                                                })
                                            }
                                        />
                                    }
                                    label={
                                        <Typography
                                            component="span"
                                            variant="medium"
                                        >
                                            Make Default
                                        </Typography>
                                    }
                                />
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
                <Box className="flex flex-row-reverse">
                    <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="global"
                        loading={isCreating || isUpdating}
                        className="w-[120px]"
                    >
                        {template_id ? "SAVE" : "NEXT"}
                    </LoadingButton>
                </Box>
            </Box>
        </FormProvider>
    );
}

const ReadableInfo = () => {
    return (
        <>
            <div>
                <Typography className="font-semibold" sx={{ py: 2 }}>
                    Scoring
                </Typography>
                <ul className="list-disc ml-6">
                    <li>
                        <Label variant="medium" colorType={"666"}>
                            If response to any non-critical question is “NO”,
                            deduct the marks from final scoring for the entire
                            category
                        </Label>
                    </li>
                    <li>
                        <Label variant="medium" colorType={"666"}>
                            If response to any question is “NA”, don’t count the
                            mark for final calculation
                        </Label>
                    </li>
                    <li>
                        <Label variant="medium" colorType={"666"}>
                            If a question is marked “Fatal”, the overall score
                            of the template will be zero
                        </Label>
                    </li>
                </ul>
            </div>
            <div>
                <Typography className="font-semibold" sx={{ py: 2 }}>
                    Violations
                </Typography>

                <ul className="list-disc ml-6">
                    <li>
                        <Label variant="medium" colorType={"666"}>
                            If agent has a Red Alert violation, send a
                            consolidated email to manager by end of day
                        </Label>
                    </li>
                    <li>
                        <Label variant="medium" colorType={"666"}>
                            If agent has a Zero Tolerance violation, send an
                            email to manager immediately
                        </Label>
                    </li>
                </ul>
            </div>
        </>
    );
};
