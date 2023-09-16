import SkeletonLoader from "@convin/components/custom_components/Loader/SkeletonLoader";
import { CloseSvg } from "@convin/components/svg";
import { useGetLeadScoreConfigQuery } from "@convin/redux/services/settings/scoreSense.service";
import { getUserName, isDefined } from "@convin/utils/helper/common.helper";
import { Box, Divider, alpha, Typography, Drawer } from "@mui/material";
import React from "react";
import { useGetActivityLogsPaginateQuery } from "../hooks/useGetActivityLogsPaginateQuery";
import VirtualList from "@convin/components/custom_components/VirtualList/VirtualList";
import { ActivityLog, ScoreSenseChange } from "@convin/type/Activity";
import { getDateTime } from "@convin/utils/helper/date.helper";
import NoDataSnippetsSvg from "@convin/components/svg/NoDataSnippetsSvg";
import EmptyState from "@convin/components/custom_components/reuseable/EmptyState";

export default function ActivityLogs({
    openActivity,
    handleClose,
    isError,
}: {
    openActivity: boolean;
    handleClose: () => void;
    isError: boolean;
}): JSX.Element {
    const { data: leadConfig } = useGetLeadScoreConfigQuery(undefined, {
        skip: isError,
    });
    const { data, isLoading, isFetching, hasNext, fetchNext } =
        useGetActivityLogsPaginateQuery(
            {
                model: "gpt.models.ScoreSense",
                object_id: leadConfig?.id as number,
            },
            false,
            {
                skip: !openActivity,
                refetchOnMountOrArgChange: true,
            }
        );
    return (
        <Drawer anchor="right" open={openActivity} onClose={handleClose}>
            <Box className="w-[480px] flex column overflow-hidden h-full">
                <Box
                    sx={{
                        p: 2,
                    }}
                    className="flex justify-between items-center flex-shrink-0"
                >
                    <Typography variant="h4">Activity</Typography>
                    <Box onClick={handleClose} className="cursor-pointer">
                        <CloseSvg />
                    </Box>
                </Box>
                <Divider />
                <Box className="flex-1 overflow-hidden">
                    {isLoading ? (
                        <SkeletonLoader />
                    ) : data?.results.length ? (
                        <VirtualList<ActivityLog<ScoreSenseChange>>
                            Component={ActivityLogBox}
                            data={data?.results?.filter((e) =>
                                isDefined(e.person)
                            )}
                            hasNext={hasNext}
                            fetchNext={fetchNext}
                            isLoading={isLoading}
                            isFetching={isFetching}
                        />
                    ) : (
                        <Box className="flex items-center justify-center flex-col h-full gap-3">
                            <EmptyState
                                text={" No activity found!"}
                                Component={<NoDataSnippetsSvg />}
                            />
                        </Box>
                    )}
                </Box>
            </Box>
        </Drawer>
    );
}

const ActivityLogBox: React.FC<{
    data: ActivityLog<ScoreSenseChange>;
}> = ({ data }) => {
    const { person, changes, updated_at } = data;
    const name = getUserName(person);
    const time = getDateTime({
        isoDate: updated_at,
        format: "dd MM, T",
    });
    let hot_limit = "",
        warm_limit = "",
        cold_limit = "";
    hot_limit = `${changes?.after?.upper_bound}-100`;
    warm_limit = `${changes?.after?.middle_bound}-${
        changes?.after?.upper_bound - 1
    }`;
    cold_limit = `0-${changes?.after?.middle_bound - 1}`;

    return (
        <Box
            sx={(theme) => ({
                bgcolor: alpha(theme.palette.textColors["333"], 0.1),
                py: 1,
                px: 2,
                borderRadius: 2,
                mb: 2,
            })}
        >
            <Typography variant="medium">
                {name}{" "}
                <Typography
                    variant="medium"
                    sx={{
                        color: "grey.666",
                    }}
                    component="span"
                >
                    updated the lead score values on
                </Typography>{" "}
                {time}
            </Typography>
            <Box className="font-semibold flex items-center gap-[8px]">
                <Typography
                    sx={{
                        color: "primary.main",
                    }}
                    variant="medium"
                >
                    {`Cold (${cold_limit})`}
                </Typography>

                <Typography
                    sx={{
                        color: "primary.main",
                    }}
                    variant="medium"
                >
                    {`Warm (${warm_limit})`}
                </Typography>
                <Typography
                    sx={{
                        color: "primary.main",
                    }}
                    variant="medium"
                >
                    {`Hot (${hot_limit})`}
                </Typography>
            </Box>
        </Box>
    );
};
