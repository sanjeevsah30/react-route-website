import { CloseSvg } from "@convin/components/svg";
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Typography,
    styled,
} from "@mui/material";
import useTeamManagerContext from "../hooks/useTeamManagerContext";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MuiSingleTeamSelector from "@convin/components/custom_components/Select/MuiSingleTeamSelector";
import { useEffect, useState } from "react";
import { MigrationPayloadType, SubTeam } from "@convin/type/Team";
import { showToast } from "@convin/utils/toast";
import { CreateUpdateToastSettings } from "@convin/config/toast.config";
import { useDeleteTeamMutation } from "@convin/redux/services/settings/teamManager.service";
import { LoadingButton } from "@mui/lab";

const StyledDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
        minWidth: "750px",
        maxWidth: "750px",

        borderRadius: theme.shape.borderRadius * 3,
        margin: 0,
    },
}));

export default function DeleteTeamDialog() {
    const {
        dispatch,
        state: { teamToUpdate, isDeleteTeamModalOpen },
    } = useTeamManagerContext();
    const handleClose = () => {
        dispatch({
            type: "RESET",
            payload: {},
        });
    };

    const { subteams, id } = teamToUpdate;

    const idToDelete = id as number;
    const [deleteTeamRequest, { isLoading }] = useDeleteTeamMutation();

    const [mappedState, setMappedState] = useState<
        Record<string | number, number | null>
    >({});

    useEffect(() => {
        if (subteams.length) {
            const obj: typeof mappedState = {};
            subteams.forEach((element) => {
                obj[element.id] = null;
            });
            setMappedState(obj);
        } else setMappedState({ [idToDelete]: null });
    }, [teamToUpdate]);

    const onDeleteTeamSubmit = (id: number) => {
        const data: MigrationPayloadType[] = Object.entries(mappedState)
            .filter(([_, migration_team_id]) => migration_team_id !== null)
            .map(([team_id, migration_team_id]) => ({
                team_id: parseInt(team_id),
                migration_team_id,
            }));
        deleteTeamRequest({ id, data })
            .unwrap()
            .then(() => {
                showToast({
                    ...CreateUpdateToastSettings,
                    message: "Team's have been Deleted and moved successfully",
                });
                handleClose();
            });
    };

    return (
        <>
            <StyledDialog open={isDeleteTeamModalOpen} onClose={handleClose}>
                <DialogTitle>
                    <Box className="flex justify-between">
                        <Typography variant="h4" className="flex-1">
                            Delete Team & Sub-Team
                        </Typography>
                        <IconButton onClick={handleClose} size="small">
                            <CloseSvg />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent className="overflow-hidden ">
                    <Typography className="font-semibold " variant="large">
                        Please move the members to a different team before
                        deleting the Team.
                    </Typography>
                    <Box sx={{ flexGrow: 1, pt: 2 }}>
                        <Grid container spacing={2} sx={{ fontSize: "16px" }}>
                            <Grid item xs={6} className="font-semibold">
                                <span>Move from</span>
                            </Grid>
                            <Grid item xs={6} className="font-semibold ">
                                <span>Move to</span>
                            </Grid>
                            {!!subteams.length ? (
                                <Box
                                    className="w-full overflow-y-scroll max-h-96 "
                                    sx={{ p: 2 }}
                                >
                                    {subteams?.map((item) => (
                                        <DeleteSelectBoxList
                                            selectedId={mappedState[item.id]}
                                            team={item}
                                            key={item.id}
                                            excludeTeam={[
                                                item.id as number,
                                            ]}
                                            handleChange={(value: number | null) => {
                                                setMappedState({
                                                    ...mappedState,
                                                    [item.id]: value,
                                                });
                                            }}
                                        />
                                    ))}
                                </Box>
                            ) : (
                                <>
                                    <Box sx={{ m: 2 }} className="w-full">
                                        <DeleteSelectBoxList
                                            team={teamToUpdate}
                                            selectedId={mappedState[idToDelete]}
                                            excludeTeam={[
                                                teamToUpdate?.id as number,
                                            ]}
                                            handleChange={(value: number | null) => {
                                                setMappedState({
                                                    ...mappedState,
                                                    [idToDelete]: value,
                                                });
                                            }}
                                        />
                                    </Box>
                                </>
                            )}
                        </Grid>
                        <Box
                            sx={{
                                pt: 3,
                                pb: 2,
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={handleClose}
                                className="rounded-md   "
                                sx={{
                                    color: "grey.999",
                                    borderColor: "grey.999",
                                    mr: 2,
                                }}
                            >
                                CANCEL
                            </Button>
                            <LoadingButton
                                variant="contained"
                                size="large"
                                onClick={() => {
                                    onDeleteTeamSubmit(id as number);
                                }}
                                style={{
                                    backgroundColor: "#F93739",
                                }}
                                loading={isLoading}
                                disableElevation
                            >
                                MOVE & DELETE
                            </LoadingButton>
                        </Box>
                    </Box>
                </DialogContent>
            </StyledDialog>
        </>
    );
}

interface DeleteSelectBoxListProp {
    team:
        | {
              id?: number;
              name: string;
              subteams: Array<{ id: number | string } & Omit<SubTeam, "id">>;
          }
        | ({ id: number | string } & Omit<SubTeam, "id">);
    excludeTeam?: [number];
    handleChange: (newValue: number | null) => void;
    selectedId: number | null;
}
export function DeleteSelectBoxList({
    team,
    excludeTeam,
    handleChange,
    selectedId,
}: DeleteSelectBoxListProp): JSX.Element {
    return (
        <>
            <Grid container spacing={2} sx={{ pb: 2 }}>
                <Grid
                    item
                    xs={6}
                    className="flex items-center justify-between  "
                >
                    <Typography sx={{ pl: 2 }}>{team?.name}</Typography>
                    <ArrowForwardIcon />
                </Grid>

                <Grid item xs={6}>
                    <MuiSingleTeamSelector
                        selectedId={selectedId}
                        excludeTeam={excludeTeam}
                        handleChange={handleChange}
                    />
                </Grid>
            </Grid>
        </>
    );
}
