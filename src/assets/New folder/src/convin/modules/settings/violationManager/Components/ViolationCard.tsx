import { useDeleteViolationMutation } from "@convin/redux/services/settings/violationManager.service";
import useViolationCRUDStateContext from "../hooks/useViolationCRUDStateContext";
import BorderedBox from "@convin/components/custom_components/BorderedBox";
import { Box, Chip, Grid, Stack, Tooltip, Typography } from "@mui/material";
import { getUserName } from "@convin/utils/helper/common.helper";
import { EditButton } from "@convin/components/custom_components/Button/EditButton";
import DeleteButton from "@convin/components/custom_components/Button/DeleteButton";
import { Violation } from "@convin/type/Violation";

type PropType = Violation & {
    toggleModal: () => void;
};
export const ViolationCard = ({
    toggleModal,
    ...violation
}: Pick<PropType, "toggleModal"> & PropType): JSX.Element => {
    const { id, name, applicability, action } = violation;
    const { prepareViolationStateForUpdate, dispatch } =
        useViolationCRUDStateContext();
    const [deleteViolation] = useDeleteViolationMutation();

    return (
        <BorderedBox key={id} sx={{ px: 2.5, py: 3 }}>
            <Grid container>
                <Grid item xs={5} className="flex items-center">
                    <Typography>{name}</Typography>
                </Grid>
                <Grid item xs={2} className="flex items-center">
                    <Typography variant="medium" className="capitalize">
                        {applicability}
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Stack spacing={2} direction={"row"}>
                        <Box
                            display="flex"
                            alignItems="center"
                            className="gap-3"
                        >
                            {action?.length > 2 ? (
                                <>
                                    {action?.slice(0, 2)?.map((e, idx) => {
                                        return (
                                            <Chip
                                                key={idx}
                                                label={getUserName(e)}
                                            />
                                        );
                                    })}
                                    <Tooltip title={action.slice(2).map(e=>getUserName(e)).join(",")}>
                                        <Chip label={`+${action?.length - 2}`} />
                                    </Tooltip>
                                </>
                            ) : (
                                action?.map((e, idx) => {
                                    return (
                                        <Chip
                                            key={idx}
                                            label={getUserName(e)}
                                        />
                                    );
                                })
                            )}
                        </Box>
                    </Stack>
                </Grid>
                <Grid item xs={1}>
                    <Box display="flex" className="gap-3">
                        <div>
                            <EditButton
                                onClick={() => {
                                    prepareViolationStateForUpdate(violation);
                                    toggleModal();
                                }}
                            />
                        </div>
                        <div>
                            <DeleteButton
                                onDelete={() => deleteViolation(id)}
                                message="Are you sure you want to delete this violation?"
                                callBack={() => {
                                    dispatch({
                                        type: "RESET",
                                        payload: {},
                                    });
                                }}
                                isButton
                            />
                        </div>
                    </Box>
                </Grid>
            </Grid>
        </BorderedBox>
    );
};
