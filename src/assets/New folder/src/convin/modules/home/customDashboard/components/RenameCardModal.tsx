import { CloseSvg } from "@convin/components/svg";
import {
    Box,
    Button,
    Divider,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import { FunctionComponent } from "react";
import useCustomDashboardModalStateContext from "../hooks/useCustomDashboardModalStateContext";
import { useRenameDashboardReportMutation } from "@convin/redux/services/home/customDashboard.service";
import { LoadingButton } from "@mui/lab";
import { isDefined } from "@convin/utils/helper/common.helper";
import { useParams } from "react-router-dom";

const styleRenameModel = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 624,
    bgcolor: "#fff",
    boxShadow: 24,
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
};

export const RenameCardModal: FunctionComponent<{
    isRenameModalOpen: boolean;
    setIsRenameModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isRenameModalOpen, setIsRenameModalOpen }) => {
    const { updateState, state, dispatch } =
        useCustomDashboardModalStateContext();
    const [updateName, { isLoading: isUpdateing }] =
        useRenameDashboardReportMutation();
    const handleClose = () => {
        setIsRenameModalOpen(false);
        dispatch({ type: "RESET", payload: {} });
    };
    const params = useParams<{
        id: string;
    }>();
    return (
        <Modal open={isRenameModalOpen}>
            <Box sx={styleRenameModel}>
                <Box
                    sx={{ p: 2 }}
                    className="flex items-center justify-between"
                >
                    <Typography
                        id="modal-modal-title"
                        className="font-semibold"
                        variant="large"
                    >
                        Rename Card
                    </Typography>
                    <Box onClick={() => setIsRenameModalOpen(false)}>
                        <CloseSvg />
                    </Box>
                </Box>
                <Divider />
                <Box sx={{ px: 2.5, pt: 3, mb: 3 }}>
                    <Box
                        id="modal-modal-title"
                        className="font-semibold"
                        // variant="medium"
                        sx={{ textAlign: "center" }}
                    >
                        <TextField
                            id="filled-basic"
                            label="Card Name"
                            variant="filled"
                            sx={{ mb: 4, width: "100%" }}
                            value={state.name}
                            onChange={(e) => {
                                updateState({
                                    name: e.target.value,
                                });
                            }}
                        />
                    </Box>
                </Box>
                <Box sx={{ px: 2.5, pb: 3 }} className="flex justify-center">
                    <Button
                        fullWidth
                        size="large"
                        variant="outlined"
                        className="w-auto"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        size="large"
                        type="submit"
                        variant="global"
                        className="w-auto"
                        loading={isUpdateing}
                        onClick={() => {
                            if (isDefined(state.idToUpdate))
                                updateName({
                                    id: state.idToUpdate,
                                    name: state.name,
                                    custom_dashboard: +params.id,
                                })
                                    .unwrap()
                                    .then(() => {
                                        handleClose();
                                    });
                        }}
                        sx={{ ml: 1 }}
                    >
                        Save
                    </LoadingButton>
                </Box>
                <Divider />
            </Box>
        </Modal>
    );
};
