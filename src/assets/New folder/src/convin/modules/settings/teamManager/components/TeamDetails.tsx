import {
    Button,
    Typography,
    Box,
    Divider,
} from "@mui/material";
import useTeamManagerContext from "../hooks/useTeamManagerContext";
import { CloseSvg } from "@convin/components/svg";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    UseFieldArrayRemove,
    useFieldArray,
    useForm,
    useFormContext,
} from "react-hook-form";
import { FormProvider, RHFTextField } from "@convin/components/hook-form";
import { nanoid } from "@reduxjs/toolkit";
import { LoadingButton } from "@mui/lab";
import { isDefined } from "@convin/utils/helper/common.helper";
import {
    useCreateTeamsMutation,
    useUpdateTeamMutation,
} from "@convin/redux/services/settings/teamManager.service";
import { showToast } from "@convin/utils/toast";
import { CreateUpdateToastSettings } from "@convin/config/toast.config";

type FormType = {
    name: string;
    subteams: Array<{
        id: string | number;
        name: string;
        group: number | null;
    }>;
};

const TeamDetails = () => {
    const {
        state: {
            teamToUpdate: { name, subteams, id },
        },
        dispatch,
    } = useTeamManagerContext();

    const [createTeamRequest, { isLoading: isCreating }] =
        useCreateTeamsMutation();
    const [upateTeamRequest, { isLoading: isUpdating }] =
        useUpdateTeamMutation();
    const schema = yup.object().shape({
        name: yup.string().required("Name is reuired"),
        subteams: yup.array().of(
            yup.object().shape({
                id: yup.mixed(),
                name: yup.string().required("Name is required"),
            })
        ),
    });

    const methods = useForm<FormType>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: name,
            subteams: subteams,
        },
    });

    const { control, handleSubmit } = methods;
    const { fields, append, remove } = useFieldArray<FormType>({
        control,
        name: "subteams",
    });

    const onSubmit = (data: FormType): void => {
        const payload = {
            ...data,
            subteams: data.subteams.map((e) => ({
                name: e.name,
                ...(typeof e.id === "number" && {
                    id: e.id,
                }),
                group: e.group || null,
            })),
        };
        if (isDefined(id)) {
            upateTeamRequest({ ...payload, id })
                .unwrap()
                .then(() => {
                    showToast({
                        ...CreateUpdateToastSettings,
                        message: "Team has been updated successfully ",
                    });
                    dispatch({
                        type: "RESET",
                        payload: {},
                    });
                });
        } else {
            createTeamRequest(payload)
                .unwrap()
                .then(() => {
                    showToast({
                        ...CreateUpdateToastSettings,
                        message: "Team has been created successfully",
                    });
                    dispatch({
                        type: "RESET",
                        payload: {},
                    });
                });
        }
        return;
    };
    return (
        <>
            <FormProvider
                {...{
                    methods,
                    onSubmit: handleSubmit(onSubmit),
                    className: "flex-1 overflow-y-scroll flex flex-col",
                }}
            >
                <Box
                    sx={{
                        px: 2.25,
                        py: 2.25,
                    }}
                    className="overflow-y-scroll flex-1 justify-center"
                >
                    <Typography
                        className="font-semibold"
                        component="div"
                        sx={{ mb: 1.5 }}
                    >
                        {id ? "Edit" : " Add"} Team Details
                    </Typography>
                    <RHFTextField
                        name="name"
                        label="Team Name*"
                        variant="filled"
                        className="w-full"
                        sx={{
                            mb: 3,
                        }}
                    />
                    <Typography
                        className="font-semibold"
                        component="div"
                        sx={{ mb: 2 }}
                    >
                        Add Sub - Team Details
                    </Typography>
                    {fields.map((field, index) => {
                        return (
                            <SubTeamField
                                key={field.id}
                                {...{ field, remove, index }}
                            />
                        );
                    })}

                    <Button
                        onClick={() => {
                            append({
                                name: "",
                                id: nanoid(),
                                group: id || null,
                            });
                        }}
                        variant="text"
                    >
                        + Add Sub-Team
                    </Button>
                </Box>
                <Divider />

                <Box
                    className="flex-shrink-0 flex items-center justify-center"
                    sx={{
                        p: 2,
                    }}
                >
                    <LoadingButton
                        loading={isCreating || isUpdating}
                        variant="global"
                        type="submit"
                    >
                        {!id ? "CREATE TEAM" : "SAVE"}
                    </LoadingButton>
                </Box>
            </FormProvider>
        </>
    );
};

const SubTeamField = ({
    field,
    index,
    remove,
}: {
    index: number;
    field: FormType["subteams"][0];
    remove: UseFieldArrayRemove;
}) => {
    const { getValues } = useFormContext();
    const id = getValues(`subteams.${index}.id`);
    return (
        <Box
            sx={{
                mb: 1.25,
            }}
            key={field.id}
            className="flex items-center"
        >
            <RHFTextField
                name={`subteams.${index}.name`}
                label="Sub Team Name*"
                variant="filled"
                className="flex-1"
                key={field.id}
            />
            {typeof id === "string" ? (
                <Box
                    sx={{
                        p: 2,
                    }}
                    className="cursor-pointer"
                    onClick={() => remove(index)}
                >
                    <CloseSvg />
                </Box>
            ) : (
                <></>
            )}
        </Box>
    );
};

export default TeamDetails;
