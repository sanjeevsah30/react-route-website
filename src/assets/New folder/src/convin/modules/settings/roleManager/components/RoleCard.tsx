import BorderedBox from "@convin/components/custom_components/BorderedBox";
import {
    Grid,
    Typography,
    Paper,
    Box,
    alpha,
    Divider,
    useTheme,
    Theme,
    SxProps,
    List,
    ListItem,
} from "@mui/material";
import { FunctionComponent, ReactElement, useMemo } from "react";
import { Role } from "@convin/type/Role";
import { Label } from "@convin/components/custom_components/Typography/Label";
import { useDeleteRoleMutation } from "@convin/redux/services/settings/roleManager.service";
import DeleteButton from "@convin/components/custom_components/Button/DeleteButton";
import MoreOptions from "@convin/components/custom_components/Popover/MoreOptions";
import MultipleAvatar from "@convin/components/custom_components/MultipleAvatar/MultipleAvatar";

const sxPropOption = (theme: Theme): SxProps => ({
    px: 1.5,
    py: 1.2,
    "&:hover": {
        color: "primary.main",
        bgcolor: alpha(theme?.palette?.primary?.main, 0.2),
    },
});

export const RoleCard: FunctionComponent<
    Role & {
        handleNavigate: (id: string, isClonePath?: boolean) => void;
        idx: number;
    }
> = ({
    id,
    name,
    description,
    users,
    permissions_count,
    can_be_edited,
    is_default,
    handleNavigate,
    idx,
}): JSX.Element => {
    const [deleteRole] = useDeleteRoleMutation();
    const theme = useTheme();

    const TooltipContent = useMemo(
        (): ReactElement => (
            <List sx={{ maxHeight: "200px" }} className="overflow-y-scroll">
                {users.slice(3).map((userName, idx) => (
                    <ListItem sx={{ py: 0.2 }} key={idx}>
                        {userName}
                    </ListItem>
                ))}
            </List>
        ),
        [users]
    );

    return (
        <Grid
            item
            lg={4}
            md={4}
            sm={12}
            xs={12}
            data-testid={`role-card-${idx}`}
        >
            <BorderedBox
                Component={Paper}
                sx={{
                    p: 2.5,
                    borderRadius: 3,
                    boxShadow: "0px 4px 10px rgba(51, 51, 51, 0.1) !important",
                }}
                className="h-[200px]"
            >
                <Box className="flex items-center justify-between">
                    <Label colorType="333" variant="h5">
                        {name}
                    </Label>
                    {can_be_edited ? (
                        <MoreOptions>
                            <Box
                                sx={sxPropOption(theme)}
                                onClick={() => handleNavigate(id?.toString())}
                            >
                                Edit
                            </Box>

                            {is_default ? null : (
                                <>
                                    <div>
                                        <DeleteButton
                                            onDelete={() =>
                                                deleteRole(id.toString())
                                            }
                                            message="Are you sure you want to delete this role?"
                                        />
                                    </div>
                                </>
                            )}

                            <Box
                                onClick={() =>
                                    handleNavigate(id?.toString(), true)
                                }
                                sx={sxPropOption(theme)}
                            >
                                Clone
                            </Box>
                        </MoreOptions>
                    ) : (
                        <></>
                    )}
                </Box>

                <div className="flex items-center gap-[16px]">
                    <div>
                        <Label
                            component="span"
                            variant="small"
                            className="mr-[6px]"
                            colorType="666"
                        >
                            Permissions
                        </Label>
                        <Typography variant="medium" className="font-semibold">
                            {permissions_count}
                        </Typography>
                    </div>
                    <Divider orientation="vertical" className="h-[16px]" />
                    <div>
                        <Label
                            component="span"
                            variant="small"
                            className="mr-[6px]"
                            colorType="666"
                        >
                            Total Users
                        </Label>
                        <Typography variant="medium" className="font-semibold">
                            {users?.length ?? 0}
                        </Typography>
                    </div>
                </div>
                <Box
                    sx={() => ({
                        px: 0.75,
                        borderRadius: 1,
                        my: 1,
                    })}
                >
                    <Label
                        variant="small"
                        colorType="999"
                        isEllipses
                        sx={{
                            py: 0.75,
                        }}
                    >
                        {description || "No Description"}
                    </Label>
                </Box>
                <Divider sx={{ my: 2 }} />
                <div className="flex justify-between">
                    {!!users?.length && <MultipleAvatar users={users} />}
                </div>
            </BorderedBox>
        </Grid>
    );
};
