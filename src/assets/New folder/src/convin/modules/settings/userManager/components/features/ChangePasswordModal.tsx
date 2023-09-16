import {
    DialogContent,
    Divider,
    Box,
    InputAdornment,
    IconButton,
} from "@mui/material";
import {
    BootstrapDialogTitle,
    BootstrapDialog,
} from "@convin/components/custom_components/CustomModal";
import { styled } from "@mui/material/styles";
import { useChangePasswordByUserIdMutation } from "@convin/redux/services/settings/userManager.service";
import { FormProvider, RHFTextField } from "@convin/components/hook-form";
import { LoadingButton } from "@mui/lab";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import * as Yup from "yup";
import { useState } from "react";

const CustomBootstrapDialog = styled(BootstrapDialog)(() => ({
    "& .MuiDialog-paper": {
        maxWidth: "666px",
        width: "666px",
        minWidth: "0px",
        boxShadow: "none",
    },
}));

interface ChangePasswordProps {
    open: boolean;
    onClose: () => void;
    handleUpdateUserPassword: (passowrd: string) => void;
}

const ChangePasswordModal = ({
    open,
    onClose,
    handleUpdateUserPassword,
}: ChangePasswordProps) => {
    //states
    //rtk query
    const [_, { isLoading }] = useChangePasswordByUserIdMutation();

    const [showPassword, setShowPassword] = useState(false);

    //event handlers

    const schema = Yup.object({
        password: Yup.string()
            .required("Password is required")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*[\]{}()?"\\,><':;|_~`=+-])[a-zA-Z\d!@#$%^&*[\]{}()?"\\,><':;|_~`=+-]{8,99}$/,
                "Must contain at least 8 Characters, 1 Uppercase, 1 Lowercase, 1 Special Character, and 1 Number"
            ),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Password is required"),
    });

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });
    const { handleSubmit, reset } = methods;

    const onSubmit = async (data: {
        password: string;
        confirmPassword: string;
    }) => {
        reset();
        handleUpdateUserPassword(data.password);
    };

    return (
        <CustomBootstrapDialog
            onClose={() => {
                reset();
                onClose();
            }}
            open={open}
        >
            <BootstrapDialogTitle
                id="customized-dialog-title"
                onClose={onClose}
            >
                Change Password
            </BootstrapDialogTitle>
            <Divider />
            <FormProvider
                methods={methods}
                onSubmit={handleSubmit(onSubmit)}
                className={"h-full flex flex-col w-full"}
            >
                <DialogContent className="flex flex-col items-center">
                    <Box sx={{ p: 2.5 }} className="w-full">
                        <RHFTextField
                            name="password"
                            label="New Password*"
                            variant="filled"
                            className="w-full"
                            sx={{ mb: 3 }}
                            type={showPassword ? "text" : "password"}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() =>
                                                setShowPassword((prev) => !prev)
                                            }
                                            edge="start"
                                        >
                                            {showPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <RHFTextField
                            name="confirmPassword"
                            label="Confirm New Password"
                            variant="filled"
                            className="w-full"
                            sx={{ mb: 3 }}
                            type="password"
                        />
                    </Box>
                </DialogContent>
                <Divider />
                <Box sx={{ px: 2.5, py: 3 }} className="flex justify-center">
                    <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="global"
                        loading={isLoading}
                        className="w-auto"
                    >
                        CHANGE PASSWORD
                    </LoadingButton>
                </Box>
            </FormProvider>
        </CustomBootstrapDialog>
    );
};

export default ChangePasswordModal;
