import { useGetAllUserQuery } from "@convin/redux/services/settings/users.servise";
import useViolationCRUDStateContext from "../hooks/useViolationCRUDStateContext";
import {
    useCreateViolationMutation,
    useUpdateViolationMutation,
} from "@convin/redux/services/settings/violationManager.service";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { isDefined } from "@convin/utils/helper/common.helper";
import { showToast } from "@convin/utils/toast";
import { CreateUpdateToastSettings } from "@convin/config/toast.config";
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
} from "@mui/material";
import { FormProvider, RHFTextField } from "@convin/components/hook-form";
import GenericSelect from "@convin/components/select/GenericSelect";
import { Violation } from "@convin/type/Violation";
import GenericMultipleSelect from "@convin/components/select/GenericMultipleSelect";
import { UserType } from "@convin/type/User";
import { LoadingButton } from "@mui/lab";
import * as Yup from "yup";
import { CloseSvg } from "@convin/components/svg";

export const ViolationCreateUpdateDialog = ({
    openModal,
    handleClose,
}: {
    openModal: boolean;
    handleClose: () => void;
}): JSX.Element => {
    const { state, dispatch } = useViolationCRUDStateContext();
    const { data: userList, isFetching: isUserListFetching } =
        useGetAllUserQuery();
    const [createViolation, { isLoading: isCreating }] =
        useCreateViolationMutation();

    const [updateViolation, { isLoading: isUpdating }] =
        useUpdateViolationMutation();

    const schema = Yup.object().shape({
        name: Yup.string().required("Violation Name is required"),
    });
    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: state,
        values: state,
    });
    const { handleSubmit } = methods;

    const onSubmit = async (data: typeof state) => {
        if (isDefined(data.id)) {
            updateViolation({
                ...data,
                id: data.id,
            })
                .unwrap()
                .then(() => {
                    showToast({
                        message:
                            "Violation Updated successfully !",
                        ...CreateUpdateToastSettings,
                    });
                    handleClose();
                });
        } else {
            createViolation(data)
                .unwrap()
                .then(() => {
                    showToast({
                        ...CreateUpdateToastSettings,
                        message: "Violation created",
                    });
                    handleClose();
                });
        }
    };

    const onClose = () => {
        handleClose();
        dispatch({
            type: "RESET",
            payload: {},
        });
    };

    return (
        <Dialog
            open={openModal}
            fullWidth
            sx={{ borderRadius: "6px" }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
                className="flex items-center justify-between"
            >
                <Box>
                    <DialogTitle>
                        {`${state.id ? "Update" : "Create"}`} Violation
                    </DialogTitle>
                </Box>
                <Box onClick={onClose} sx={{ mr: 3 }}>
                    <CloseSvg />
                </Box>
            </Box>
            <Divider />
            <FormProvider
                methods={methods}
                onSubmit={handleSubmit(onSubmit)}
                className={"flex flex-col"}
            >
                <DialogContent>
                    <Stack component="div" gap={2}>
                        <RHFTextField
                            name="name"
                            label="Violation Name*"
                            variant="filled"
                            className="w-full"
                            value={state.name}
                            onChange={(
                                e: React.ChangeEvent<
                                    HTMLTextAreaElement | HTMLInputElement
                                >
                            ) =>
                                dispatch({
                                    type: "UPDATE",
                                    payload: {
                                        name: e.target.value,
                                    },
                                })
                            }
                        />
                        <GenericSelect<Violation["applicability"]>
                            className="w-full"
                            label="Applied Level"
                            options={[
                                { id: "template", value: "Template" },
                                { id: "category", value: "Category" },
                                { id: "question", value: "Question" },
                            ]}
                            value={state.applicability}
                            handleChange={(e) => {
                                dispatch({
                                    type: "UPDATE",
                                    payload: {
                                        applicability: e,
                                    },
                                });
                            }}
                            sx={{ mb: 2 }}
                        />
                        <GenericMultipleSelect<UserType>
                            className="flex-1"
                            label="Action"
                            data={userList || []}
                            loading={isUserListFetching}
                            values={state.action}
                            setValues={(val: number[]) => {
                                dispatch({
                                    type: "UPDATE",
                                    payload: {
                                        action: val,
                                    },
                                });
                            }}
                        />
                    </Stack>
                </DialogContent>

                <Box sx={{ textAlign: "center" }} className="my-3">
                    <LoadingButton
                        loading={isUpdating || isCreating}
                        sx={{ mt: 2 }}
                        variant="global"
                        type="submit"
                    >
                        SAVE
                    </LoadingButton>
                </Box>
            </FormProvider>
        </Dialog>
    );
};
