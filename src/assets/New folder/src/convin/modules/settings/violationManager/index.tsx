import React, { useState } from "react";
import {
    Box,
    Button,
    Divider,
    Grid,
    Stack,
    Typography,
    alpha,
    useTheme,
} from "@mui/material";

import { useGetViolationsQuery } from "@convin/redux/services/settings/violationManager.service";

import PageLoader from "@convin/components/custom_components/PageLoader";

import { showToast } from "@convin/utils/toast";
import ViolaStateProvider from "./context/ViolationCRUDStateContext";

import { ViolationCreateUpdateDialog } from "./Components/ViolationCreateUpdateDialog";
import { ViolationCard } from "./Components/ViolationCard";

export default function ViolationManager(): JSX.Element {
    const theme = useTheme();
    const { data, isLoading } = useGetViolationsQuery();
    const [openModal, setOpenModal] = useState(false);
    const toggleModal = (): void => {
        setOpenModal((prev) => !prev);
    };

    if (isLoading) {
        return <PageLoader />;
    }

    return (
        <div>
            <Box className="flex justify-between items-center" sx={{ p: 3 }}>
                <Typography variant="h5" className="font-semibold">
                    Violation Manager
                </Typography>
                <Button
                    variant="global"
                    onClick={() => {
                        if (data?.length === 5) {
                            showToast({
                                type: "warning",
                                message:
                                    "You can define a maximum of five violations",
                            });
                        } else {
                            toggleModal();
                        }
                    }}
                >
                    + Create
                </Button>
            </Box>
            <Divider />
            {/* for list items */}
            <ViolaStateProvider>
                <Box sx={{ p: 3 }}>
                    <Grid
                        container
                        sx={{
                            color: "grey.666",
                            fontSize: "10px",
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                            py: 1,
                            px: 2.5,
                            borderRadius: 1.5,
                            mb: 2,
                        }}
                        className="flex-shrink-0 uppercase"
                    >
                        <Grid item xs={5}>
                            VIOLATION NAME
                        </Grid>
                        <Grid item xs={2}>
                            APPLIED LEVEL
                        </Grid>
                        <Grid item xs={4}>
                            ACTIONS
                        </Grid>
                        <Grid item xs={1} />
                    </Grid>
                    <Stack spacing={1.5}>
                        {data?.map((e) => {
                            return (
                                <ViolationCard
                                    {...{ ...e, toggleModal }}
                                    key={e.id}
                                />
                            );
                        })}
                    </Stack>
                </Box>

                {/* for model */}
                <ViolationCreateUpdateDialog
                    {...{ openModal, handleClose: toggleModal }}
                />
            </ViolaStateProvider>
        </div>
    );
}
