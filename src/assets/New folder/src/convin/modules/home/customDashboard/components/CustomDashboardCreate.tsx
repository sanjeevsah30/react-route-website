import EmptyState from "@convin/components/custom_components/reuseable/EmptyState";
import EmptyDashboardSvg from "@convin/components/svg/EmpatyDashboardSvg";
import { Button, Divider, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import CreateDashboardDrawer from "./CreateDashboardDrawer";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 467,
    bgcolor: "#fff",
    boxShadow: 24,
    borderRadius: "12px",
};

export default function CustomDashboardCreateView(): JSX.Element {
    const [isDrawerOpen, setIsDrawerOpen] = useState(true);
    const [isModelOpen, setIsModelOpen] = useState(false);
    const history = useHistory();

    return (
        <div className="flex alignCenter justifyCenter height100p">
            <EmptyState
                text={
                    <span
                        onClick={() => setIsDrawerOpen(true)}
                        className="cursor-pointer"
                    >
                        {"Create your Dashboard"}
                    </span>
                }
                subtext={
                    "Customize your dashboard the way you want and track all the data at ease"
                }
                Component={<EmptyDashboardSvg />}
            />
            <CreateDashboardDrawer
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
                setIsModelOpen={setIsModelOpen}
            />
            <Modal open={isModelOpen}>
                <Box sx={style}>
                    <Box sx={{ p: 1 }} className="flex items-center">
                        <Typography
                            id="modal-modal-title"
                            className="font-semibold"
                            variant="large"
                        >
                            Custom Dashboard
                        </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ px: 2.5, py: 3 }}>
                        <Box
                            id="modal-modal-title"
                            className="font-semibold"
                            // variant="medium"
                            sx={{ textAlign: "center" }}
                        >
                            {
                                "Are you sure you want to cancel creating a\n new dashboard?"
                            }
                        </Box>
                    </Box>
                    <Divider />
                    <Box
                        sx={{ px: 2.5, py: 3 }}
                        className="flex justify-center"
                    >
                        <Button
                            fullWidth
                            size="large"
                            variant="outlined"
                            className="w-auto"
                            onClick={() => {
                                setIsModelOpen(false);
                                // setIsDrawerOpen(false);
                                history.push("/home/analytics");
                            }}
                        >
                            YES
                        </Button>
                        <Button
                            fullWidth
                            size="large"
                            type="submit"
                            variant="global"
                            className="w-auto"
                            onClick={() => setIsModelOpen(false)}
                            sx={{ ml: 1 }}
                        >
                            NO
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}
