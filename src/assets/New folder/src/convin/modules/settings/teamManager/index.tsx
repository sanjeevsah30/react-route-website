import TeamSvg from "@convin/components/svg/TeamSvg";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { CreateEditTeamDrawer, TeamCard } from "./components";
import TeamManagerProvider from "./context/TeamManagerStateProvider";
import { useGetTeamsQuery } from "@convin/redux/services/settings/teamManager.service";
import PageLoader from "@convin/components/custom_components/PageLoader";
import useTeamManagerContext from "./hooks/useTeamManagerContext";
import ManageMembersDrawer from "./components/ManageMembersDrawer";
import DeleteTeamDialog from "./components/DeleteTeamDialog";

const TeamManagerTable = () => {
    const { dispatch } = useTeamManagerContext();

    const { data, isFetching } = useGetTeamsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    if (isFetching) {
        return <PageLoader />;
    }
    return (
        <>
            <div className="overflow-hidden h-full flex flex-col">
                <Box
                    className="flex justify-between items-center flex-shrink-0"
                    sx={{
                        mb: 2.5,
                        px: 2.5,
                        pt: 2.5,
                    }}
                >
                    <Typography variant="h4" className="font-semibold">
                        Team Manager
                    </Typography>
                    <Button
                        variant="global"
                        onClick={() => {
                            dispatch({
                                type: "UPDATE",
                                payload: { isCRUDTeamDrawerOpen: true },
                            });
                        }}
                        sx={{ py: 1, px: 3 }}
                        startIcon={<TeamSvg />}
                    >
                        Create Team
                    </Button>
                </Box>
                <Divider />
                <Stack
                    className="overflow-y-scroll flex-1"
                    sx={{ p: 2 }}
                    gap={2}
                >
                    {data?.map((teamData) => (
                        <TeamCard key={teamData.id} data={teamData} />
                    ))}
                </Stack>

                <CreateEditTeamDrawer
                    handleClose={() => {
                        dispatch({
                            type: "RESET",
                            payload: {},
                        });
                    }}
                />
                <DeleteTeamDialog />
                <ManageMembersDrawer />
            </div>
        </>
    );
};

const TeamManager = () => {
    return (
        <TeamManagerProvider>
            <TeamManagerTable />
        </TeamManagerProvider>
    );
};

export default TeamManager;
