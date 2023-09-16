import { useEffect, useState, useCallback } from "react";
import { Box, Divider, Stack, TextField, Typography } from "@mui/material";
import PermissionCard from "./PermissionCard";

import { useHistory, useLocation, useParams } from "react-router-dom";
import { Label } from "@convin/components/custom_components/Typography/Label";
import {
    useCreateRoleMutation,
    useGetDefaultRoleCodeNamesQuery,
    useGetRoleByIdQuery,
    useUpdateRoleMutation,
} from "@convin/redux/services/settings/roleManager.service";
import { LoadingButton } from "@mui/lab";
import { CodeNames } from "@convin/type/Role";
import { skipToken } from "@reduxjs/toolkit/query";
import { showToast } from "@convin/utils/toast";
import { SettingRoutes } from "@convin/config/routes.config";
import PageLoader from "@convin/components/custom_components/PageLoader";
import MuiTeamSelector from "@convin/components/custom_components/TreeSelect/MuiTeamSelector";
import { CreateUpdateToastSettings } from "@convin/config/toast.config";
import LeftArrowSvg from "@convin/components/svg/LeftArrowSvg";

export default function RoleCreateUpdate(): JSX.Element {
    const { id } = useParams<{ id?: string }>();
    const location = useLocation();
    const isClonePath = location.pathname.includes("clone");
    const isCreateRolePage: boolean = id === "create_role";
    // eslint-disable-next-line max-len
    const { data: defaultCodeNames, isLoading: isDefaultCodeNamesLoading } =
        useGetDefaultRoleCodeNamesQuery();
    const { data: roleToUpdate, isLoading: isRoleToUpdateLoading } =
        useGetRoleByIdQuery(id ?? skipToken, {
            skip: isCreateRolePage,
        });

    const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
    const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();

    const [roleName, setRoleName] = useState<string>("");
    const [roleDesc, setRoleDesc] = useState<string>("");
    const [codeNames, setCodeNames] = useState<CodeNames[]>([]);
    const [teamIds, setTeamIds] = useState<number[]>([]);

    const history = useHistory();

    const getDefaultPermissionsForCreateRole = (
        temp: CodeNames[]
    ): CodeNames[] => {
        const arr = [];

        for (let i = 0; i < temp.length; i += 1) {
            let role = { ...temp[i] };
            const { permissions } = role;
            const permissions_clone = { ...permissions };

            Object.keys(permissions_clone)?.forEach((key) => {
                let view = permissions_clone[key]?.view;
                let edit =
                    permissions_clone[key]?.view !== undefined
                        ? permissions_clone?.[key]?.edit
                        : [];
                let del =
                    permissions_clone[key]?.delete !== undefined
                        ? permissions_clone[key]?.delete
                        : [];

                view = view?.is_default
                    ? { ...view, is_selected: true }
                    : { ...view };
                edit = view.is_default
                    ? edit.map((e) =>
                          e.is_default ? { ...e, is_selected: true } : e
                      )
                    : edit;
                del = view.is_default
                    ? del.map((e) =>
                          e.is_default ? { ...e, is_selected: true } : e
                      )
                    : del;

                permissions_clone[key] = {
                    view,
                    edit,
                    delete: del,
                };
            });
            role = { ...role, permissions: permissions_clone };

            arr.push(role);
        }

        return arr;
    };

    useEffect(() => {
        if (isCreateRolePage && defaultCodeNames !== undefined) {
            setCodeNames(getDefaultPermissionsForCreateRole(defaultCodeNames));
        }
    }, [defaultCodeNames]);

    useEffect(() => {
        if (roleToUpdate !== undefined) {
            setRoleName(roleToUpdate.name);
            setCodeNames(roleToUpdate.code_names);
            setRoleDesc(roleToUpdate.description);
            setTeamIds(roleToUpdate.allowed_teams);
        }
    }, [roleToUpdate]);

    const handleUpdate = (): void => {
        if (roleToUpdate !== undefined) {
            updateRole({
                ...roleToUpdate,
                name: roleName,
                code_names: codeNames,
                description: roleDesc,
                allowed_teams: teamIds,
            })
                .unwrap()
                .then(() => {
                    showToast({
                        message: "Role has been updated",
                        ...CreateUpdateToastSettings,
                    });
                })
                .catch();
        }
    };
    const handleCreate = (): void => {
        if (roleName) {
            createRole({
                name: roleName,
                code_names: codeNames,
                description: roleDesc,
                allowed_teams: teamIds,
            })
                .unwrap()
                .then(() => {
                    showToast({
                        message: "Role has been created",
                        ...CreateUpdateToastSettings,
                    });
                    history.push(`/settings/${SettingRoutes.ROLE_MANAGER.to}/`);
                })
                .catch();
        } else {
            showToast({ type: "error", message: "Role name is required" });
        }
    };

    const setDefaultPermissionsOnVisibilityChange = useCallback(
        ({
            isVisible,
            temp,
        }: {
            isVisible: boolean;
            temp: CodeNames["permissions"];
        }): CodeNames["permissions"] => {
            const permissions = { ...temp };
            const isViewAccessOnly: boolean =
                Object.keys(permissions)?.length === 1;

            Object.keys(permissions)?.forEach((key) => {
                let view = permissions[key]?.view;
                let edit =
                    permissions[key]?.view !== undefined
                        ? permissions[key]?.edit
                        : [];
                let del =
                    permissions[key]?.delete !== undefined
                        ? permissions[key]?.delete
                        : [];

                view = isVisible
                    ? isViewAccessOnly ||
                      (view?.is_default && !isViewAccessOnly)
                        ? { ...view, is_selected: true }
                        : { ...view, is_selected: false }
                    : { ...view, is_selected: false };
                edit = isVisible
                    ? isViewAccessOnly ||
                      (view?.is_default && !isViewAccessOnly)
                        ? edit?.map((e) =>
                              e.is_default
                                  ? { ...e, is_selected: true }
                                  : { ...e, is_selected: false }
                          )
                        : edit
                    : edit?.map((e) => ({ ...e, is_selected: false }));
                del = isVisible
                    ? isViewAccessOnly ||
                      (view?.is_default && !isViewAccessOnly)
                        ? del?.map((e) =>
                              e.is_default
                                  ? { ...e, is_selected: true }
                                  : { ...e, is_selected: false }
                          )
                        : del
                    : del?.map((e) => ({ ...e, is_selected: false }));

                permissions[key] = {
                    view,
                    edit,
                    delete: del,
                };
            });
            return permissions;
        },
        []
    );

    // Switch toggle in the permission card
    const handleVisibilityChange = useCallback(
        ({ heading, isVisible }: { heading: string; isVisible: boolean }) => {
            setCodeNames(
                codeNames.map((e) => {
                    if (e.heading === heading) {
                        return {
                            ...e,
                            permissions:
                                setDefaultPermissionsOnVisibilityChange({
                                    isVisible,
                                    temp: e.permissions,
                                }),
                            is_visible: isVisible,
                        };
                    }
                    return e;
                })
            );
        },
        [codeNames]
    );

    const constructCodeNames = useCallback(
        ({
            heading,
            prevSelectedKey,
            currSelectedKey,
        }: {
            heading: string;
            currSelectedKey: string;
            prevSelectedKey: string | undefined;
        }): void => {
            const defaultValues = defaultCodeNames?.find(
                (e) => e.heading === heading
            );
            if (defaultValues !== undefined) {
                const { permissions } = defaultValues;
                setCodeNames(
                    codeNames.map((e) => {
                        if (e.heading === heading) {
                            return {
                                ...e,
                                permissions: prevSelectedKey
                                    ? {
                                          ...permissions,
                                          [prevSelectedKey]: {
                                              ...permissions[prevSelectedKey],
                                              view: {
                                                  ...permissions[
                                                      prevSelectedKey
                                                  ].view,
                                                  is_selected: false,
                                              },
                                          },
                                          [currSelectedKey]: {
                                              ...permissions[currSelectedKey],
                                              view: {
                                                  ...permissions[
                                                      currSelectedKey
                                                  ].view,
                                                  is_selected: true,
                                              },
                                          },
                                      }
                                    : {
                                          ...permissions,

                                          [currSelectedKey]: {
                                              ...permissions[currSelectedKey],
                                              view: {
                                                  ...permissions[
                                                      currSelectedKey
                                                  ].view,
                                                  is_selected: true,
                                              },
                                          },
                                      },
                            };
                        }
                        return e;
                    })
                );
            }
        },
        [codeNames]
    );

    const constructCodeNamesEdit = useCallback(
        ({
            heading,
            display_name,
            currSelectedKey,
            checked,
            type,
        }: {
            heading: string;
            display_name: string;
            currSelectedKey: string;
            checked: boolean;
            type: "edit" | "delete";
        }): void => {
            setCodeNames(
                codeNames.map((e) => {
                    if (e.heading === heading) {
                        return {
                            ...e,
                            permissions: {
                                ...e.permissions,
                                [currSelectedKey]: {
                                    ...e.permissions[currSelectedKey],
                                    [type]: e.permissions[currSelectedKey]?.[
                                        type
                                    ]?.map((a) => {
                                        if (a.display_name === display_name) {
                                            return {
                                                ...a,
                                                is_selected: checked,
                                            };
                                        }
                                        return a;
                                    }),
                                },
                            },
                        };
                    }
                    return e;
                })
            );
        },
        [codeNames]
    );

    const handleChangeRoleName = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setRoleName(e.target.value);
    };
    const handleChangeRoleDesc = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setRoleDesc(e.target.value);
    };

    const handleGoBack = useCallback(() => {
        history.goBack();
    }, []);

    if (Boolean(isRoleToUpdateLoading) || Boolean(isDefaultCodeNamesLoading)) {
        return <PageLoader />;
    }

    // if (
    //   error !== undefined && error !== null
    //   && (("originalStatus" in error && error?.originalStatus === 404)
    //     || ("status" in error && error.status === 404))
    // ) {
    //   return <div>404</div>;
    // }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-scroll">
                <Stack
                    direction="row"
                    spacing={2.5}
                    alignItems="center"
                    sx={{
                        mb: 2.5,
                    }}
                >
                    <div className="cursor-pointer" onClick={handleGoBack}>
                        <LeftArrowSvg />
                    </div>
                    <Typography
                        variant="extraLarge"
                        className="font-semibold"
                        sx={{ ml: 2.5 }}
                    >
                        Roles and Permissions
                    </Typography>
                </Stack>
                <Box className="flex gap-8" sx={{ mb: 2 }}>
                    <div className="flex-1">
                        <TextField
                            value={roleName}
                            onChange={handleChangeRoleName}
                            variant="filled"
                            label="Role Name*"
                            className="w-full"
                        />
                    </div>
                    <div className="flex-1">
                        <TextField
                            variant="filled"
                            label="Description"
                            value={roleDesc}
                            onChange={handleChangeRoleDesc}
                            className="w-full"
                        />
                    </div>
                </Box>
                <Divider sx={{ my: 2.5 }} />
                <Box>
                    <Typography className="font-semibold">
                        Select Teams/ Sub-teams
                    </Typography>
                    <Label
                        variant="medium"
                        colorType="999"
                        sx={{ mb: 2.75 }}
                        component="div"
                    >
                        The role and permissions will be set to the selected
                        teams
                    </Label>
                    <Box sx={{ mb: 2.5 }} className="w-[50%]">
                        <MuiTeamSelector
                            value={teamIds}
                            updateValue={setTeamIds}
                        />
                    </Box>
                </Box>
                <Box>
                    <Typography className="font-semibold">
                        Permissions
                    </Typography>
                    <Label variant="medium" colorType="999" sx={{ mb: 2.75 }}>
                        {" "}
                        These permissions will be applied to each teammate with
                        this role.
                    </Label>
                </Box>
                <Box>
                    {codeNames?.map((e) => (
                        <PermissionCard
                            {...{
                                ...e,
                                constructCodeNames,
                                constructCodeNamesEdit,
                                handleVisibilityChange,
                            }}
                            key={e.heading}
                        />
                    ))}
                </Box>
            </div>
            <div className="shrink-0 flex flex-row-reverse">
                <LoadingButton
                    loading={Boolean(isUpdating) || isCreating}
                    sx={{ mt: 2 }}
                    variant="global"
                    onClick={
                        isCreateRolePage || isClonePath
                            ? handleCreate
                            : handleUpdate
                    }
                    disabled={!isCreateRolePage && !roleToUpdate?.can_be_edited}
                >
                    {isCreateRolePage || isClonePath
                        ? "CREATE ROLE"
                        : "UPDATE ROLE"}
                </LoadingButton>
            </div>
        </div>
    );
}
