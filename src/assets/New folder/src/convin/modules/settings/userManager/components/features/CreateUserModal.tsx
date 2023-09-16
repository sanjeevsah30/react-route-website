import { useState } from "react";
import CustomModal from "@convin/components/custom_components/CustomModal";
import { Box, Button, IconButton } from "@mui/material";
import {
    useCreateBulkUserMutation,
    useGetAvailableSubscriptionsQuery,
    useInviteBulkUserMutation,
} from "@convin/redux/services/settings/userManager.service";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    FormProvider,
    SubmitHandler,
    useFieldArray,
    useForm,
} from "react-hook-form";
import { UserForm } from "./UserForm";
import { DeleteSvg } from "@convin/components/svg";
import { useGetVersionDataQuery } from "@convin/redux/services/common/common.service";
import { useGetSubscriptionsQuery } from "@convin/redux/services/settings/billing.service";
import { showToast } from "@convin/utils/toast";
import { useHistory } from "react-router-dom";
import { CreateUpdateToastSettings } from "@convin/config/toast.config";
import { isDefined } from "@convin/utils/helper/common.helper";
interface CreateUserModalProps {
    open: boolean;
    handleClose: () => void;
}

type userFormFields =
    | "email"
    | "first_name"
    | "last_name"
    | "team"
    | "user_type"
    | "subscription";

const schema = yup.object().shape({
    users: yup.array().of(
        yup.object().shape({
            first_name: yup.string().required("Name is required"),
            last_name: yup.string(),
            email: yup
                .string()
                .email("Email must be valid.")
                .required("Email is required"),
            role: yup.string().required("Role is required"),
            subscription: yup.string().when("user_type", {
                is: 1,
                then: yup.string().required("Subscription is required"),
                otherwise: yup.string(),
            }),
            user_type: yup.number().required("User type is required"),
            team: yup.string().required("Team is required"),
            primary_phone: yup.string(),
        })
    ),
});

export interface FormType {
    users: Array<{
        user_type: number;
        first_name: string;
        last_name: string;
        email: string;
        subscription: string;
        team: string;
        primary_phone: string;
        role: string;
    }>;
}

const CreateUserModal = ({
    open,
    handleClose,
}: CreateUserModalProps): JSX.Element => {
    const history = useHistory();

    const [createUsers, { isLoading: isCreatingUsers }] =
        useCreateBulkUserMutation();
    const [inviteUsers, { isLoading: isInvitingUsers }] =
        useInviteBulkUserMutation();
    const { data: versionData } = useGetVersionDataQuery();
    const { data: subscriptions } = useGetSubscriptionsQuery();
    const { data: availableSubscriptions } =
        useGetAvailableSubscriptionsQuery();

    const methods = useForm<FormType>({
        resolver: yupResolver(schema),
        defaultValues: {
            users: [
                {
                    user_type: 0,
                    first_name: "",
                    last_name: "",
                    email: "",
                    subscription: "",
                    team: "",
                    primary_phone: "",
                    role: "",
                },
            ],
        },
    });

    const { control, handleSubmit } = methods;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "users",
    });

    const [requiresPayment, setRequiresPayment] = useState(false);

    const checkSubscriptions = () => {
        const users = methods.getValues("users");
        if (
            isDefined(subscriptions) &&
            subscriptions.total_licenses -
                subscriptions.active_licenses -
                users.filter(
                    (user) =>
                        user.user_type !== 0 &&
                        user.subscription !== null &&
                        (availableSubscriptions || [])
                            .find((sub) => {
                                return (
                                    sub.subscription_id ===
                                    Number(user.subscription)
                                );
                            })
                            ?.subscription_type?.toLowerCase() !== "free"
                )?.length <
                0
        ) {
            setRequiresPayment(true);
        } else {
            setRequiresPayment(false);
        }
    };

    const onSubmit: SubmitHandler<FormType> = (data) => {
        if (versionData?.domain_type === "b2c")
            createUsers(data?.users)
                .unwrap()
                .then(() => {
                    methods.reset();
                    showToast({
                        message: "Users created successfully !",
                        ...CreateUpdateToastSettings,
                    });
                    handleClose();
                })
                .catch((errors) => {
                    if (Array.isArray(errors.data)) {
                        errors.data.forEach(
                            (
                                error: { [key: string]: Array<string> },
                                index: number
                            ) => {
                                Object.keys(error).forEach((field) =>
                                    methods.setError(
                                        `users.${index}.${
                                            field as userFormFields
                                        }`,
                                        {
                                            message: error[field]?.[0],
                                        }
                                    )
                                );
                            }
                        );
                    }
                });
        else {
            inviteUsers(data?.users)
                .unwrap()
                .then(() => {
                    methods.reset();
                    showToast({
                        message: "Users invited successfully !",
                        ...CreateUpdateToastSettings,
                    });
                    handleClose();
                })
                .catch((errors) => {
                    if (Array.isArray(errors.data)) {
                        errors.data.forEach(
                            (
                                error: { [key: string]: Array<string> },
                                index: number
                            ) => {
                                Object.keys(error).forEach((field) =>
                                    methods.setError(
                                        `users.${index}.${
                                            field as userFormFields
                                        }`,
                                        {
                                            message: error[field]?.[0],
                                        }
                                    )
                                );
                            }
                        );
                    }
                });
        }
    };

    return (
        <CustomModal
            open={open}
            handleClose={() => {
                methods.reset();
                handleClose();
            }}
            title={`${
                versionData?.domain_type === "b2c" ? "Create" : "Invite"
            } User`}
            showFooter={false}
            PaperProps={{ sx: { width: "90vw" } }}
        >
            <Box sx={{ p: 1 }}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {fields.map((field, index) => (
                            <Box
                                className="flex gap-1 items-center"
                                key={field.id}
                                sx={{ mb: 3.5 }}
                            >
                                <UserForm
                                    index={index}
                                    checkSubscriptions={checkSubscriptions}
                                    {...methods}
                                />
                                {fields.length > 1 && (
                                    <IconButton
                                        onClick={() => remove(index)}
                                        className="w-10 h-10"
                                    >
                                        <DeleteSvg />
                                    </IconButton>
                                )}
                            </Box>
                        ))}
                        <Box className="flex justify-between" sx={{ mt: 5 }}>
                            <Button
                                variant="text"
                                onClick={() =>
                                    append({
                                        user_type: 0,
                                        first_name: "",
                                        last_name: "",
                                        email: "",
                                        subscription: "",
                                        team: "",
                                        role: "",
                                        primary_phone: "",
                                    })
                                }
                            >
                                + Add User
                            </Button>
                            {!requiresPayment ? (
                                <Button
                                    variant={`${
                                        isCreatingUsers || isInvitingUsers
                                            ? "disabled"
                                            : "global"
                                    }`}
                                    type="submit"
                                    sx={{ px: 2.5, py: 1 }}
                                    disabled={
                                        isCreatingUsers || isInvitingUsers
                                    }
                                >
                                    {versionData?.domain_type === "b2c"
                                        ? "Create"
                                        : "Invite"}{" "}
                                    User
                                </Button>
                            ) : (
                                <Button
                                    variant="global"
                                    onClick={() =>
                                        history.push(
                                            "/settings/billing?manage=true"
                                        )
                                    }
                                    sx={{ px: 2.5, py: 1 }}
                                    disabled={
                                        isCreatingUsers || isInvitingUsers
                                    }
                                >
                                    Pay Now
                                </Button>
                            )}
                        </Box>
                    </form>
                </FormProvider>
            </Box>
        </CustomModal>
    );
};

export default CreateUserModal;
