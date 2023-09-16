import { CloseSvg } from "@convin/components/svg";
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";

import useTeamManagerContext from "../hooks/useTeamManagerContext";
import TeamDetails from "./TeamDetails";

const CreateEditTeamDrawer = ({ handleClose }: { handleClose: () => void }) => {
    const {
        state: {
            teamToUpdate: { name, id },
            isCRUDTeamDrawerOpen,
        },
    } = useTeamManagerContext();

    return (
        <Drawer
            anchor="right"
            open={isCRUDTeamDrawerOpen}
            onClose={() => null}
            classes={{
                paper: "border-[1px] border-solid  h-full overflow-hidden",
            }}
        >
            <Box className="flex flex-col w-[540px] h-full">
                <Toolbar className="justify-between items-center flex-shrink-0">
                    <Typography variant="h4">
                        {id ? `Edit ${name} Team` : "Create Team"}
                    </Typography>
                    <IconButton aria-label="Close Drawer" onClick={handleClose}>
                        <CloseSvg sx={{ transform: "scale(1.2)" }} />
                    </IconButton>
                </Toolbar>
                <Divider />
                <TeamDetails />
            </Box>
        </Drawer>
    );
};

export default CreateEditTeamDrawer;
