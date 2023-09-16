import MuiTeamSelector from "@convin/components/custom_components/TreeSelect/MuiTeamSelector";
import GenericMultipleSelect from "@convin/components/select/GenericMultipleSelect";
import GenericSelect from "@convin/components/select/GenericSelect";
import { CloseSvg } from "@convin/components/svg";
import { useGetCallTagsQuery } from "@convin/redux/services/settings/callTagsManager.service";
import { useGetCallTypesQuery } from "@convin/redux/services/settings/callTypeManager.service";
import {
    useGetLeadScoreConfigQuery,
    useUpdateScoreSenseConfigMutation,
} from "@convin/redux/services/settings/scoreSense.service";
import { CallTag, CallType } from "@convin/type/CallManager";
import { MeetingTypeConst } from "@convin/type/Common";
import { isDefined } from "@convin/utils/helper/common.helper";
import { showToast } from "@convin/utils/toast";
import { LoadingButton } from "@mui/lab";
import { CreateUpdateToastSettings } from "@convin/config/toast.config";

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    styled,
    Divider,
    Box,
    Stack,
} from "@mui/material";
import { useEffect, useState } from "react";

const StyledDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
        height: "590px",
        width: "650px",
        borderRadius: theme.shape.borderRadius * 3,
    },
    "& .MuiFormControlLabel-root": {
        ".MuiRadio-root:first-of-type, .MuiCheckbox-root:first-of-type": {
            marginLeft: theme.spacing(-1.25),
        },

        ".MuiFormControlLabel-label": {
            marginRight: theme.spacing(3),
        },
    },
}));

export default function ConfigurationModal({
    open,
    handleClose,
    isError,
}: {
    open: boolean;
    handleClose: () => void;
    isError: boolean;
}): JSX.Element {
    const { data } = useGetLeadScoreConfigQuery(undefined, {
        skip: isError,
    });
    const [updateSenseScoreConfig, { isLoading: isUpdating }] =
        useUpdateScoreSenseConfigMutation();

    const [state, setState] = useState<{
        teams: number[];
        tags: number[];
        type: number[];
        meeting_type: MeetingTypeConst;
    }>({
        teams: [],
        tags: [],
        type: [],
        meeting_type: "call",
    });
    const { data: callTypeList, isLoading: isCallTypesListLoading } =
        useGetCallTypesQuery();
    const { data: callTagList, isLoading: isCallTagsLoading } =
        useGetCallTagsQuery();

    useEffect(() => {
        if (isDefined(data)) {
            const { call_type, tags, teams, meeting_type } = data;
            setState({
                tags,
                teams,
                type: call_type,
                meeting_type: meeting_type || "call",
            });
        }
    }, [data]);

    return (
        <StyledDialog open={open} maxWidth="md" sx={{ borderRadius: "12px" }}>
            <DialogTitle className="flex items-center justify-between">
                <Typography className="text-[22px] font-semibold">
                    Configure Lead Score
                </Typography>
                <Box className="cursor-pointer" onClick={handleClose}>
                    <CloseSvg />
                </Box>
            </DialogTitle>
            <Divider />
            <DialogContent className="flex column">
                <Typography variant="large" className="font-semibold">
                    Applicable Filters
                </Typography>
                <Typography
                    variant="medium"
                    sx={{
                        color: "grey.666",
                        mb: 3,
                    }}
                >
                    Choose the applicable filters for Lead score from below.
                </Typography>
                <Stack gap={3}>
                    <MuiTeamSelector
                        value={state.teams}
                        updateValue={(val: number[]) =>
                            setState({
                                ...state,
                                teams: val,
                            })
                        }
                    />
                    <GenericMultipleSelect<CallType>
                        label="Type"
                        data={callTypeList || []}
                        loading={isCallTypesListLoading}
                        values={state.type}
                        setValues={(val: number[]) =>
                            setState({
                                ...state,
                                type: val,
                            })
                        }
                    />
                    <GenericMultipleSelect<CallTag>
                        label="Tag"
                        data={callTagList || []}
                        loading={isCallTagsLoading}
                        values={state.tags}
                        setValues={(val: number[]) =>
                            setState({
                                ...state,
                                tags: val,
                            })
                        }
                    />
                    <GenericSelect<MeetingTypeConst>
                        label="Conversation Type"
                        options={[
                            { id: "call", value: "call" },
                            { id: "chat", value: "chat" },
                            { id: "email", value: "email" },
                        ]}
                        value={state.meeting_type}
                        handleChange={(val) => {
                            setState({
                                ...state,
                                meeting_type: val,
                            });
                        }}
                    />
                </Stack>
            </DialogContent>
            <Divider />
            <DialogActions
                sx={{ p: 2 }}
                className="flex items-center justify-center"
            >
                <LoadingButton
                    variant="global"
                    loading={isUpdating}
                    onClick={() => {
                        if (isDefined(data) && data.id) {
                            const { type, ...rest } = state;
                            updateSenseScoreConfig({
                                id: data.id,
                                call_type: type,
                                ...rest,
                            })
                                .unwrap()
                                .then(() => {
                                    handleClose();
                                    showToast({
                                        ...CreateUpdateToastSettings,
                                        message: "Changes saved successfully",
                                    });
                                });
                        }
                    }}
                >
                    CONFIGURE
                </LoadingButton>
            </DialogActions>
        </StyledDialog>
    );
}
