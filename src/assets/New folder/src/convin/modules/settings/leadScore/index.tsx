import { Box, Divider, Typography, Button, Chip } from "@mui/material";
import { ReactElement, useCallback, useRef, useState } from "react";
import ThresholdSlider from "./components/ThresholdSlider";
import {
    useGetLeadScoreConfigQuery,
    useUpdateScoreSenseConfigMutation,
} from "@convin/redux/services/settings/scoreSense.service";
import PageLoader from "@convin/components/custom_components/PageLoader";
import { LoadingButton } from "@mui/lab";
import { isDefined } from "@convin/utils/helper/common.helper";
import ConfigureSvg from "@convin/components/svg/ConfigureSvg";
import ConfigurationModal from "./components/ConfigurationModal";
import { alpha } from "@mui/system";
import ActivitySvg from "@convin/components/svg/ActivitySvg";
import ActivityLogs from "./components/ActivityLogs";
import { showToast } from "@convin/utils/toast";
import { CreateUpdateToastSettings } from "@convin/config/toast.config";

export default function LeadScore(): ReactElement {
    const { data, isLoading, isError } = useGetLeadScoreConfigQuery();
    const [updateSenseScoreConfig, { isLoading: isUpdating }] =
        useUpdateScoreSenseConfigMutation();
    const ref = useRef<{ value: number[] }>();
    const [open, setOpen] = useState<boolean>(false);
    const [openActivity, setOpenActivity] = useState<boolean>(false);
    const handleClose = useCallback(() => {
        setOpen(false);
        setOpenActivity(false);
    }, []);

    if (isLoading) {
        return <PageLoader />;
    }

    return (
        <div className="h-full flex flex-col">
            <Box
                sx={{
                    p: 3,
                }}
                className="flex items-center justify-between"
            >
                <Typography variant="h4">Score Sense</Typography>
                <Box
                    sx={{ ml: 1 }}
                    className="cursor-pointer flex items-center gap-[8px]"
                    onClick={() => setOpenActivity(true)}
                >
                    <ActivitySvg />
                    <Typography component="span">Activity</Typography>
                </Box>
            </Box>
            <Divider />
            <Box className="flex-1">
                <Box
                    className="flex justify-between"
                    sx={{
                        p: 3,
                    }}
                >
                    <Box className="flex-1">
                        <Box
                            className="flex items-center gap-3"
                            sx={{
                                mb: 2,
                            }}
                        >
                            <Typography className="font-semibold">
                                Lead Score
                            </Typography>
                            <Chip
                                sx={(theme) => ({
                                    bgcolor: alpha(
                                        theme.palette.textColors["333"],
                                        0.1
                                    ),
                                    color: theme.palette.textColors["333"],
                                })}
                                className="text-[12px]"
                                label={"Account Level"}
                            />
                        </Box>
                        <Typography variant="medium" className="font-semibold">
                            Set your score range for Lead Scoring categories
                        </Typography>
                        <Typography
                            sx={{
                                color: "grey.666",
                            }}
                        >
                            Please note that the selected range of a certain
                            category cannot be overlapped by another category
                        </Typography>
                        {isDefined(data) ? (
                            <Typography>
                                {`(Cold 0-${data?.middle_bound - 1}, Warm ${
                                    data?.middle_bound
                                }-${data?.upper_bound - 1} & Hot ${
                                    data?.upper_bound
                                }-100).`}
                            </Typography>
                        ) : (
                            <></>
                        )}
                    </Box>
                    <Box>
                        <Button
                            variant="outlined"
                            startIcon={<ConfigureSvg />}
                            onClick={() => setOpen(true)}
                        >
                            CONFIGURE
                        </Button>
                    </Box>
                </Box>

                {isDefined(data) ? (
                    <Box
                        sx={{
                            mt: 5,
                            px: 3,
                        }}
                    >
                        <ThresholdSlider
                            hot={data?.upper_bound}
                            warm={data?.middle_bound}
                            ref={ref}
                        />
                    </Box>
                ) : (
                    <></>
                )}
            </Box>
            <Box
                className="flex items-center flex-row-reverse"
                sx={{
                    pb: 2,
                    pr: 2,
                }}
            >
                <LoadingButton
                    variant="global"
                    className="w-[118px]"
                    onClick={() => {
                        if (ref?.current?.value) {
                            const [middle_bound, upper_bound] =
                                ref?.current?.value;
                            if (isDefined(data) && data.id)
                                updateSenseScoreConfig({
                                    upper_bound,
                                    middle_bound,
                                    id: data.id,
                                })
                                    .unwrap()
                                    .then(() => {
                                        showToast({
                                            message:
                                                "Changes saved successfully",
                                            ...CreateUpdateToastSettings,
                                        });
                                    });
                        }
                    }}
                    loading={isUpdating}
                >
                    Save
                </LoadingButton>
            </Box>
            <ConfigurationModal {...{ open, handleClose, isError }} />

            <ActivityLogs
                {...{
                    openActivity,
                    handleClose,
                    isError,
                }}
            />
        </div>
    );
}
