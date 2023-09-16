import MoreOptions from "@convin/components/custom_components/Popover/MoreOptions";
import MuiSingleTeamSelector from "@convin/components/custom_components/Select/MuiSingleTeamSelector";
import { AntSwitch } from "@convin/components/custom_components/Switch/AntSwitch";
import { toOptions } from "@convin/components/custom_components/TreeSelect/MuiTeamSelector";
import TypographyElipsis from "@convin/components/custom_components/Typography/TypographyElipsis";
import { CreateUpdateToastSettings } from "@convin/config/toast.config";
import { userType } from "@convin/config/userType.config";
import { useGetRolesQuery } from "@convin/redux/services/settings/roleManager.service";
import { useGetTeamsQuery } from "@convin/redux/services/settings/teamManager.service";
import {
    useChangePasswordByUserIdMutation,
    useGetAllUsersQuery,
    useUpdateUserByIdMutation,
} from "@convin/redux/services/settings/userManager.service";
import { UpdateUserPayload, UserType } from "@convin/type/User";
import { isDefined } from "@convin/utils/helper/common.helper";
import {
    formatDateString,
    getDateTime,
    reverseFormatDateString,
} from "@convin/utils/helper/date.helper";
import { showToast } from "@convin/utils/toast";
import { LoadingButton } from "@mui/lab";
import {
    Autocomplete,
    Box,
    MenuItem,
    TableBody,
    TextField,
    Tooltip,
    useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useCallback, useEffect, useState } from "react";
import {
    StyledBox,
    StyledTableCell,
    StyledTableRow,
    sxPropOption,
} from "../utils/MuiUtils";
import { paginator } from "../utils/helper";
import { StickyTableCell } from "./ManageActiveUsers";
import ChangePasswordModal from "./features/ChangePasswordModal";
import useRole from "@convin/hooks/useRole";

interface ActiveUsersTableProps {
    visibleUsers: UserType[];
    page: number;
}

const ActiveUsersTableData = ({
    visibleUsers,
    page,
}: ActiveUsersTableProps) => {
    const { data } = useGetAllUsersQuery();
    const { data: allRoles } = useGetRolesQuery();
    const { data: allTeams } = useGetTeamsQuery();
    const [updateUserById, { isLoading: isUpdating }] =
        useUpdateUserByIdMutation();
    const [changePassword] = useChangePasswordByUserIdMutation();

    const theme = useTheme();
    const { role } = useRole();

    const optionsList = allTeams?.flatMap((category) => toOptions(category));
    const hasEditUserPermission = role?.code_names?.find(
        (obj) => obj?.heading === "User Manager"
    )?.permissions["View Users"]?.edit?.[0]?.is_selected;

    const [updateData, setUpdateData] =
        useState<Partial<UpdateUserPayload> | null>(null);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
        useState<boolean>(false);
    const [userToBeEdited, setUserToBeEdited] = useState<number | null>(null);

    const handleSaveData = (id: number) => {
        if (isDefined(updateData)) {
            updateUserById({ id, ...updateData })
                .unwrap()
                .then(() => {
                    setUserToBeEdited(null);
                    showToast({
                        message: "Changes saved successfully !",
                        ...CreateUpdateToastSettings,
                    });
                });
        }
    };

    const handleUpdataData = (current_user: UserType) => {
        setUpdateData({
            email: current_user.email,
            first_name: current_user.first_name,
            last_name: current_user.last_name,
            date_joined: current_user.date_joined,
            org_date_joined: current_user.org_date_joined,
            primary_phone: current_user.primary_phone,
            location: current_user.location,
            manager: current_user.manager ? current_user.manager.id : null,
            role: isDefined(current_user.role) ? current_user.role.id : null,
            user_type: current_user.user_type,
            team: current_user.team?.id || null,
            is_active: current_user.is_active,
        });
    };

    const handleUpdateUserPassword = (password: string): void => {
        if (userToBeEdited) {
            changePassword({
                user_id: userToBeEdited,
                password,
            })
                .unwrap()
                .then(() => {
                    setIsChangePasswordModalOpen(false);
                    showToast({
                        message: "Password Changed successfully !",
                        ...CreateUpdateToastSettings,
                    });
                });
        }
    };

    const toggleChangePasswordModal = useCallback(() => {
        setIsChangePasswordModalOpen((prev) => !prev);
        if (userToBeEdited) setUserToBeEdited(null);
    }, [isChangePasswordModalOpen]);

    useEffect(() => {
        if (userToBeEdited) {
            const current_user = visibleUsers.find(
                (user) => user.id === userToBeEdited
            );
            if (current_user) handleUpdataData(current_user);
        } else setUpdateData(null);
    }, [userToBeEdited]);

    return (
        <>
            <TableBody>
                {paginator<UserType>(visibleUsers, page, 10).data?.map(
                    (user, index) => {
                        const {
                            id,
                            first_name,
                            last_name,
                            date_joined,
                            org_date_joined,
                            email,
                            manager,
                        } = user;

                        const inEditMode = id === userToBeEdited;
                        const boxProps = {
                            index,
                            inEditMode,
                        };
                        return (
                            <StyledTableRow key={id}>
                                <StickyTableCell hasBackground>
                                    <StyledBox hasRightShadow {...boxProps}>
                                        {inEditMode && isDefined(updateData) ? (
                                            <TextField
                                                fullWidth
                                                label="First Name"
                                                variant="filled"
                                                size="small"
                                                value={updateData.first_name}
                                                onChange={(e) => {
                                                    setUpdateData({
                                                        ...updateData,
                                                        first_name:
                                                            e.target.value,
                                                    });
                                                }}
                                            />
                                        ) : (
                                            <TypographyElipsis
                                                sx={{
                                                    fontSize: 14,
                                                }}
                                            >
                                                {first_name}
                                            </TypographyElipsis>
                                        )}
                                    </StyledBox>
                                </StickyTableCell>
                                <StyledTableCell hasBackground>
                                    <StyledBox {...boxProps}>
                                        {inEditMode && isDefined(updateData) ? (
                                            <TextField
                                                fullWidth
                                                label="Last Name"
                                                variant="filled"
                                                size="small"
                                                value={updateData.last_name}
                                                onChange={(e) => {
                                                    setUpdateData({
                                                        ...updateData,
                                                        last_name:
                                                            e.target.value,
                                                    });
                                                }}
                                            />
                                        ) : (
                                            <TypographyElipsis
                                                sx={{
                                                    fontSize: 14,
                                                }}
                                            >
                                                {last_name || "N/A"}
                                            </TypographyElipsis>
                                        )}
                                    </StyledBox>
                                </StyledTableCell>

                                <StyledTableCell>
                                    <StyledBox
                                        className="min-w-[150px]"
                                        {...boxProps}
                                    >
                                        {inEditMode && isDefined(updateData) ? (
                                            <TextField
                                                fullWidth
                                                label="Email Address"
                                                variant="filled"
                                                value={updateData.email}
                                                onChange={(e) => {
                                                    setUpdateData({
                                                        ...updateData,
                                                        email: e.target.value,
                                                    });
                                                }}
                                                size="small"
                                            />
                                        ) : (
                                            <TypographyElipsis
                                                sx={{
                                                    fontSize: 14,
                                                }}
                                            >
                                                {email}
                                            </TypographyElipsis>
                                        )}
                                    </StyledBox>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <StyledBox {...boxProps}>
                                        {inEditMode && isDefined(updateData) ? (
                                            <TextField
                                                fullWidth
                                                label="User Id"
                                                variant="filled"
                                                value={updateData.primary_phone}
                                                type="number"
                                                size="small"
                                                sx={{
                                                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                                                        {
                                                            display: "none",
                                                        },
                                                    "& input[type=number]": {
                                                        MozAppearance:
                                                            "textfield",
                                                    },
                                                }}
                                                onChange={(e) => {
                                                    setUpdateData({
                                                        ...updateData,
                                                        primary_phone:
                                                            e.target.value,
                                                    });
                                                }}
                                            />
                                        ) : (
                                            <TypographyElipsis
                                                sx={{
                                                    fontSize: 14,
                                                }}
                                            >
                                                {user.primary_phone || "N/A"}
                                            </TypographyElipsis>
                                        )}
                                    </StyledBox>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <StyledBox index={index}>
                                        {inEditMode && isDefined(updateData) ? (
                                            <div className="p-1 min-w-[150px]">
                                                <DatePicker
                                                    disableFuture
                                                    value={
                                                        isDefined(
                                                            updateData.date_joined
                                                        )
                                                            ? formatDateString(
                                                                  updateData.date_joined
                                                              )
                                                            : null
                                                    }
                                                    onChange={(newValue) => {
                                                        setUpdateData({
                                                            ...updateData,
                                                            date_joined:
                                                                reverseFormatDateString(
                                                                    newValue
                                                                ),
                                                        });
                                                    }}
                                                    renderInput={(props) => {
                                                        return (
                                                            <TextField
                                                                {...props}
                                                                size="small"
                                                            />
                                                        );
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <span>
                                                {isDefined(date_joined)
                                                    ? getDateTime({
                                                          isoDate: date_joined,
                                                          type: "date",
                                                      })
                                                    : "N/A"}
                                            </span>
                                        )}
                                    </StyledBox>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <StyledBox {...boxProps}>
                                        {inEditMode && isDefined(updateData) ? (
                                            <div className="p-1 min-w-[150px]">
                                                <DatePicker
                                                    disableFuture
                                                    value={
                                                        isDefined(
                                                            updateData.org_date_joined
                                                        )
                                                            ? formatDateString(
                                                                  updateData.org_date_joined
                                                              )
                                                            : null
                                                    }
                                                    onChange={(newValue) => {
                                                        setUpdateData({
                                                            ...updateData,
                                                            org_date_joined:
                                                                reverseFormatDateString(
                                                                    newValue
                                                                ),
                                                        });
                                                    }}
                                                    renderInput={(props) => {
                                                        return (
                                                            <TextField
                                                                {...props}
                                                                size="small"
                                                            />
                                                        );
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <span>
                                                {isDefined(org_date_joined)
                                                    ? getDateTime({
                                                          isoDate:
                                                              org_date_joined,
                                                          type: "date",
                                                      })
                                                    : "N/A"}
                                            </span>
                                        )}
                                    </StyledBox>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <StyledBox
                                        className="min-w-[150px]"
                                        {...boxProps}
                                    >
                                        {inEditMode && isDefined(updateData) ? (
                                            <div className="p-1 w-full">
                                                <Autocomplete
                                                    options={
                                                        isDefined(data)
                                                            ? data
                                                            : []
                                                    }
                                                    getOptionLabel={(option) =>
                                                        option.label
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            placeholder="Select Manager"
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                    renderOption={(
                                                        props,
                                                        option
                                                    ) => {
                                                        return (
                                                            <li
                                                                {...props}
                                                                key={option.id}
                                                            >
                                                                <span className="text-sm">
                                                                    {option.first_name +
                                                                        " " +
                                                                        option?.last_name}
                                                                </span>
                                                            </li>
                                                        );
                                                    }}
                                                    value={
                                                        updateData.manager
                                                            ? data?.filter(
                                                                  (user) =>
                                                                      user.id ===
                                                                      updateData.manager
                                                              )[0]
                                                            : null
                                                    }
                                                    onChange={(e, value) => {
                                                        setUpdateData({
                                                            ...updateData,
                                                            manager: value
                                                                ? value.id
                                                                : null,
                                                        });
                                                    }}
                                                />
                                            </div>
                                        ) : manager != null ? (
                                            <TypographyElipsis
                                                sx={{
                                                    fontSize: 14,
                                                }}
                                            >
                                                {manager.first_name +
                                                    " " +
                                                    manager?.last_name}
                                            </TypographyElipsis>
                                        ) : (
                                            "N/A"
                                        )}
                                    </StyledBox>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <StyledBox {...boxProps}>
                                        {inEditMode && isDefined(updateData) ? (
                                            <div className="p-1 w-full">
                                                <TextField
                                                    select
                                                    fullWidth
                                                    value={updateData.role}
                                                    size="small"
                                                    onChange={(e) => {
                                                        setUpdateData({
                                                            ...updateData,
                                                            role: Number(
                                                                e.target.value
                                                            ),
                                                        });
                                                    }}
                                                >
                                                    {isDefined(allRoles) ? (
                                                        allRoles.map(
                                                            (designation) => (
                                                                <MenuItem
                                                                    key={
                                                                        designation.id
                                                                    }
                                                                    value={
                                                                        designation.id
                                                                    }
                                                                >
                                                                    {designation.name.replace(
                                                                        /\_/g,
                                                                        " "
                                                                    )}
                                                                </MenuItem>
                                                            )
                                                        )
                                                    ) : (
                                                        <>Loading...</>
                                                    )}
                                                </TextField>
                                            </div>
                                        ) : (
                                            user.role?.name || "N/A"
                                        )}
                                    </StyledBox>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <StyledBox {...boxProps}>
                                        {inEditMode &&
                                        isDefined(updateData) &&
                                        isDefined(optionsList) ? (
                                            <div className="p-1 w-full">
                                                <MuiSingleTeamSelector
                                                    selectedId={
                                                        isDefined(
                                                            updateData.team
                                                        )
                                                            ? updateData.team
                                                            : null
                                                    }
                                                    handleChange={(
                                                        newValue
                                                    ) => {
                                                        setUpdateData({
                                                            ...updateData,
                                                            team: newValue
                                                                ? newValue
                                                                : null,
                                                        });
                                                    }}
                                                    size="small"
                                                />
                                            </div>
                                        ) : (
                                            <TypographyElipsis
                                                sx={{
                                                    fontSize: 14,
                                                }}
                                            >
                                                {user.team?.name || "N/A"}
                                            </TypographyElipsis>
                                        )}
                                    </StyledBox>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <StyledBox {...boxProps}>
                                        {inEditMode && isDefined(updateData) ? (
                                            <div className="p-1 w-full">
                                                <TextField
                                                    select
                                                    fullWidth
                                                    value={updateData.user_type}
                                                    onChange={(e) => {
                                                        setUpdateData({
                                                            ...updateData,
                                                            user_type: Number(
                                                                e.target.value
                                                            ),
                                                        });
                                                    }}
                                                    size="small"
                                                >
                                                    {Object.entries(
                                                        userType
                                                    ).map((type) => (
                                                        <MenuItem
                                                            key={type[1]}
                                                            value={Number(
                                                                type[0]
                                                            )}
                                                        >
                                                            {type[1]}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </div>
                                        ) : (
                                            userType[user.user_type]
                                        )}
                                    </StyledBox>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <StyledBox {...boxProps}>
                                        {inEditMode && isDefined(updateData) ? (
                                            <TextField
                                                label="Location"
                                                variant="filled"
                                                value={updateData.location}
                                                size="small"
                                                fullWidth
                                                onChange={(e) => {
                                                    setUpdateData({
                                                        ...updateData,
                                                        location:
                                                            e.target.value,
                                                    });
                                                }}
                                            />
                                        ) : (
                                            user.location || "N/A"
                                        )}
                                    </StyledBox>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <StyledBox
                                        sx={{
                                            color: "primary.main",
                                        }}
                                        index={index}
                                        className="justify-center px-0 font-bold cursor"
                                    >
                                        {isDefined(user.integrations) ? (
                                            <Tooltip
                                                title={user.integrations.join(
                                                    ", "
                                                )}
                                                placement="top"
                                            >
                                                <span>
                                                    {user.integrations.length}
                                                </span>
                                            </Tooltip>
                                        ) : (
                                            0
                                        )}
                                    </StyledBox>
                                </StyledTableCell>
                                <StickyTableCell
                                    hasBackground
                                    sx={{ display: "flex" }}
                                >
                                    <StyledBox
                                        className="flex justify-center items-center w-full"
                                        index={index}
                                        hasLeftShadow
                                        component="div"
                                        title={
                                            user?.is_active
                                                ? "Active"
                                                : "Inactive"
                                        }
                                    >
                                        {inEditMode && isDefined(updateData) ? (
                                            <AntSwitch
                                                checked={updateData?.is_active}
                                                onChange={(e) => {
                                                    setUpdateData({
                                                        ...updateData,
                                                        is_active:
                                                            e.target.checked,
                                                    });
                                                }}
                                            />
                                        ) : (
                                            <AntSwitch
                                                checked={user?.is_active}
                                                disabled={!inEditMode}
                                            />
                                        )}
                                    </StyledBox>
                                    <StyledBox
                                        className="flex justify-center items-center overflow-x-visible"
                                        index={index}
                                        sx={{ width: 72 }}
                                    >
                                        {inEditMode ? (
                                            <LoadingButton
                                                loading={isUpdating}
                                                onClick={() => {
                                                    handleSaveData(id);
                                                }}
                                            >
                                                Save
                                            </LoadingButton>
                                        ) : (
                                            <MoreOptions className="w-16">
                                                <Box
                                                    sx={sxPropOption(theme)}
                                                    onClick={() => {
                                                        hasEditUserPermission
                                                            ? setUserToBeEdited(
                                                                  id
                                                              )
                                                            : showToast({
                                                                  ...CreateUpdateToastSettings,
                                                                  message:
                                                                      "You do not have the permissions to edit users!",
                                                                  type: "error",
                                                              });
                                                    }}
                                                >
                                                    Edit
                                                </Box>
                                                <Box
                                                    sx={sxPropOption(theme)}
                                                    onClick={() => {
                                                        if (
                                                            hasEditUserPermission
                                                        ) {
                                                            setUserToBeEdited(
                                                                id
                                                            );
                                                            toggleChangePasswordModal();
                                                        } else {
                                                            showToast({
                                                                ...CreateUpdateToastSettings,
                                                                message:
                                                                    "You do not have the permissions to edit users !",
                                                                type: "error",
                                                            });
                                                        }
                                                    }}
                                                >
                                                    Change Password
                                                </Box>
                                            </MoreOptions>
                                        )}
                                    </StyledBox>
                                </StickyTableCell>
                            </StyledTableRow>
                        );
                    }
                )}
            </TableBody>
            <ChangePasswordModal
                open={isChangePasswordModalOpen}
                onClose={toggleChangePasswordModal}
                {...{ handleUpdateUserPassword }}
            />
        </>
    );
};

export default ActiveUsersTableData;
