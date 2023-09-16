import { Box, Button, Grid, Typography, Divider } from "@mui/material";
import { useCallback } from "react";
import { useGetRolesQuery } from "@convin/redux/services/settings/roleManager.service";
import { RoleCard } from "./RoleCard";
import { useHistory } from "react-router-dom";
import PageLoader from "@convin/components/custom_components/PageLoader";

export default function RoleManagerList(): JSX.Element {
    const { data, isLoading } = useGetRolesQuery();
    const history = useHistory();
    const handleNavigate = useCallback(
        (id: string, isClonePath?: boolean): void => {
            if (isClonePath) history.push(`clone/${id}`);
            else history.push(`${id}`);
        },
        []
    );

    const goToCreatePage = useCallback((): void => {
        history.push("create_role");
    }, []);

    if (isLoading) {
        return <PageLoader />;
    }

    return (
        <div>
            <Box className="flex justify-between" sx={{ mb: 2.5 }}>
                <Typography variant="h5" className="font-semibold">
                    Role Manager
                </Typography>
                <Button
                    variant="global"
                    className="uppercase"
                    onClick={goToCreatePage}
                >
                    Create Role
                </Button>
            </Box>
            <Divider />
            <Grid container columnSpacing={3} rowSpacing={3} sx={{ pt: 3 }}>
                {data?.map((e, idx) => (
                    <RoleCard
                        {...{ ...e, handleNavigate, idx: idx + 1 }}
                        key={e.id}
                    />
                ))}
            </Grid>
        </div>
    );
}
