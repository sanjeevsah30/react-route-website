import React, { FC, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Divider,
    Box,
    Typography,
} from "@mui/material";
import WarningSvg from "@convin/components/svg/WraningSvg";
import * as Yup from "yup";
import { FormProvider, RHFTextField } from "@convin/components/hook-form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { liveAssistAlisCharLimit } from "@convin/config/audit.config";
import { LoadingButton } from "@mui/lab";
import { CloseSvg } from "@convin/components/svg";
import useParameterStateContext from "../hooks/useParameterStateContext";
import { isDefined } from "@convin/utils/helper/common.helper";
import { useUpdateParameterByIdMutation } from "@convin/redux/services/settings/auditManager.service";

interface DialogProps {
    open: boolean;
    onClose: () => void;
}

const LiveAssistAliasDialog: FC<DialogProps> = ({ open, onClose }) => {
    const { state, handleUpdate } = useParameterStateContext();
    const [, { isLoading }] = useUpdateParameterByIdMutation();
    const schema = Yup.object().shape({
        alias: Yup.string()
            .required("Alias is required")
            .max(
                liveAssistAlisCharLimit,
                `Can't exceed ${liveAssistAlisCharLimit} charecters`
            ),
    });
    const [alias, setAlias] = useState<string>("");
    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: { alias: "" },
        values: { alias },
    });
    const { handleSubmit } = methods;

    const onSubmit = async ({ alias }: { alias: string }) => {
        if (isDefined(state.id) && isDefined(state.category))
            handleUpdate(
                {
                    id: state.id,
                    category: state.category,
                    is_live_assist: true,
                    live_assist_alias: alias,
                },
                () => onClose()
            );
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <FormProvider
                methods={methods}
                onSubmit={handleSubmit(onSubmit)}
                className={"h-full flex flex-col"}
            >
                <Box
                    className="flex items-center justify-between"
                    sx={{ px: 3, py: 2.5 }}
                >
                    <Typography variant="h4">Agent Assist Parameter</Typography>
                    <Box onClick={onClose}>
                        <CloseSvg />
                    </Box>
                </Box>

                <Divider />
                <DialogContent>
                    <Box
                        sx={{
                            color: "warning.main",
                        }}
                        className="flex items-center justify-center gap-3"
                    >
                        <WarningSvg />
                        <Typography
                            sx={{
                                color: "warning.main",
                            }}
                            className="leading-[18px]"
                            variant="large"
                        >
                            The Parameter exceeds the word limit set in Live
                            Assist. Please rephrase the Parameter under 60
                            Characters.
                        </Typography>
                    </Box>
                    <Box sx={{ pt: 2 }}>
                        <Typography className="font-semibold" variant="large">
                            Rephrase Parameter
                        </Typography>
                        <RHFTextField
                            name="alias"
                            label="Alias"
                            variant="filled"
                            className="w-full"
                            sx={{ my: 2 }}
                            multiline
                            rows={4}
                            value={alias}
                            onChange={(
                                e: React.ChangeEvent<
                                    HTMLTextAreaElement | HTMLInputElement
                                >
                            ) => {
                                setAlias(e.target.value);
                            }}
                        />
                    </Box>
                </DialogContent>
                <Box className="flex items-center justify-center">
                    <DialogActions
                        sx={{ mb: 2, mr: 2.5 }}
                        className="flex items-center justify-center w-[300px]"
                    >
                        <Button
                            variant="globalOutlined"
                            className="flex-1"
                            onClick={onClose}
                        >
                            CANCEL
                        </Button>
                        <LoadingButton
                            variant="global"
                            type="submit"
                            className="flex-1"
                            loading={isLoading}
                        >
                            UPDATE
                        </LoadingButton>
                    </DialogActions>
                </Box>
            </FormProvider>
        </Dialog>
    );
};

export default LiveAssistAliasDialog;
