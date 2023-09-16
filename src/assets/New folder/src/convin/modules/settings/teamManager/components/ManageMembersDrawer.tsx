import {
    Avatar,
    Box,
    Divider,
    Drawer,
    IconButton,
    Stack,
    Toolbar,
    alpha,
    styled,
} from "@mui/material";
import useTeamManagerContext from "../hooks/useTeamManagerContext";
import { CloseSvg, MoveMemberSvg } from "@convin/components/svg";
import GenericMultipleSelect from "@convin/components/select/GenericMultipleSelect";
import { useState } from "react";
import { useGetAllUserQuery } from "@convin/redux/services/settings/users.servise";
import {
    teamManagerSeviceSlice,
    useGetTeamsQuery,
    useUpdateTeamMutation,
    useUpdateUserTeamByIdMutation,
} from "@convin/redux/services/settings/teamManager.service";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import { CreateUpdateToastSettings } from "@convin/config/toast.config";

import { showToast } from "@convin/utils/toast";
import { getUserName, isDefined } from "@convin/utils/helper/common.helper";
import MuiSingleTeamSelector from "@convin/components/custom_components/Select/MuiSingleTeamSelector";
import { TeamManagerStateType } from "../context/TeamManagerStateProvider";
import { UserType } from "@convin/type/User";
import { useDispatch } from "react-redux";
import { SubTeam } from "@convin/type/Team";
import MembersAction from "./MembersAction";

const StyledAccordionDetail = styled(AccordionDetails)(({ theme }) => ({
    borderTop: `1px solid ${theme.palette.divider}`,
}));

const StyledAvatar = styled(Avatar)`
    ${({ theme }) => `
    cursor: pointer;
    transition: ${theme.transitions.create(["transform"], {
        duration: 100,
    })};
    &:hover {
        transform: translateY(-1px);
    }
`}
`;

const ManageMembersDrawer = () => {
    const {
        state: {
            isManageUsersDrawerOpen,
            teamToUpdate: { name, id },
        },
        dispatch,
    } = useTeamManagerContext();

    const { data: teamList } = useGetTeamsQuery();
    const selectedTeam = teamList?.find((e) => e.id === id);
    return (
        <>
            <Drawer
                anchor="right"
                open={isManageUsersDrawerOpen}
                onClose={() => null}
                classes={{
                    paper: "border-[1px] border-solid border-[#99999933]  w-[34rem] h-full  overflow-hidden ",
                }}
            >
                <>
                    <Box className="flex flex-col">
                        <Toolbar className="flex justify-between items-center ">
                            <Typography className=" font-semibold" variant="h4">
                                {name} - Manage Members
                            </Typography>
                            <IconButton
                                aria-label="Close Drawer"
                                onClick={() => {
                                    dispatch({
                                        type: "RESET",
                                        payload: {},
                                    });
                                }}
                            >
                                <CloseSvg sx={{ transform: "scale(1.2)" }} />
                            </IconButton>
                        </Toolbar>
                        <Divider />
                        {isDefined(selectedTeam) ? (
                            <Box className="overflow-hidden h-[92vh] flex flex-col mt-2">
                                {!!selectedTeam.subteams.length ? (
                                    <Box className="flex-grow overflow-scroll">
                                        {selectedTeam?.subteams.map((team) => (
                                            <ManageTeamMembersAccordian
                                                {...{ team }}
                                                key={team.id}
                                            />
                                        ))}
                                    </Box>
                                ) : (
                                    <ManageTeamMembersAccordian
                                        {...{ team: selectedTeam }}
                                    />
                                )}
                            </Box>
                        ) : (
                            <></>
                        )}
                    </Box>
                </>
            </Drawer>
        </>
    );
};

const ManageTeamMembersAccordian: React.FC<{
    team: TeamManagerStateType["teamToUpdate"]["subteams"][0];
}> = ({ team }) => {
    const { id, name, members } = team;
    const exisitingMemberIds = members.map((e) => e.id);
    const [showAddMemberSelect, setShowAddMemberSelect] =
        useState<boolean>(false);

    const [membersToAdd, setMemebersToAdd] = useState<number[]>([]);

    const { data: userList, isLoading: isUserListLoading } =
        useGetAllUserQuery();
    const [addMemeberRequest, { isLoading }] = useUpdateTeamMutation();
    const handleAddMembers = () => {
        addMemeberRequest({
            id: id as number,
            members: [...members, ...membersToAdd.map((e) => ({ id: e }))],
            name: name,
        })
            .unwrap()
            .then(() => {
                showToast({
                    ...CreateUpdateToastSettings,
                    message: `${membersToAdd?.length} members added to team`,
                    position: "bottom-right",
                });

                setShowAddMemberSelect(false);
                setMemebersToAdd([]);
            });
    };
    return (
        <Accordion
            key={id}
            disableGutters
            elevation={0}
            sx={(theme) => ({
                my: 2,
                mx: 1,

                bgcolor: alpha(theme?.palette?.textColors[999], 0.1),

                "&:before": {
                    display: "none",
                },
            })}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className="rounded-xl"
                sx={{ py: 0.5 }}
            >
                <Typography className="font-semibold">{name}</Typography>
            </AccordionSummary>
            <StyledAccordionDetail className="rounded-b-xl">
                <Box className="flex justify-between items-center">
                    <Typography variant="medium">
                        Team Members & Roles
                    </Typography>
                    <Typography>{members?.length} Members</Typography>
                </Box>
                <Box
                    className="cursor-pointer "
                    sx={{
                        color: "primary.main",
                    }}
                >
                    {!showAddMemberSelect ? (
                        <Box
                            onClick={() => {
                                setShowAddMemberSelect(true);
                            }}
                            className=" flex font-semibold  items-center"
                            sx={{ m: 2 }}
                        >
                            <AddIcon className="scale-90" />
                            <span>Add Member</span>
                        </Box>
                    ) : (
                        <Stack
                            direction={"row"}
                            gap={2}
                            sx={{ my: 2 }}
                            className="flex items-center"
                        >
                            <GenericMultipleSelect<UserType>
                                label="Select Member"
                                className="w-full flex-1"
                                data={
                                    userList?.filter(
                                        (e) =>
                                            !exisitingMemberIds.includes(e.id)
                                    ) || []
                                }
                                loading={isUserListLoading}
                                values={membersToAdd}
                                setValues={(val) => {
                                    setMemebersToAdd(val);
                                }}
                            />

                            <MembersAction
                                isLoading={isLoading}
                                handleDoneChange={() => {
                                    if (membersToAdd.length) {
                                        handleAddMembers();
                                    }
                                }}
                                handleCancelChange={() => {
                                    setMemebersToAdd([]);
                                    setShowAddMemberSelect(false);
                                }}
                            />
                        </Stack>
                    )}
                </Box>

                <Box className=" overflow-y-scroll max-h-96">
                    {members?.map((user) => {
                        return (
                            <MemberCard
                                key={user.id}
                                {...user}
                                team={team as SubTeam}
                            />
                        );
                    })}
                </Box>
            </StyledAccordionDetail>
        </Accordion>
    );
};

const MemberCard: React.FC<UserType> = (user) => {
    const [showMoveMemberSelect, setShowMoveMemberSelect] =
        useState<boolean>(false);
    const displayName = getUserName(user);
    const { id } = user;
    const [teamId, setTeamId] = useState<number | null>(null);
    const [updateUserById, { isLoading }] = useUpdateUserTeamByIdMutation();
    const reduxStoreDispatch = useDispatch();
    const handleChangeTeam = () => {
        if (isDefined(teamId)) {
            updateUserById({ id, team: teamId })
                .unwrap()
                .then((res) => {
                    showToast({
                        message: "Member moved Successfully !",
                        ...CreateUpdateToastSettings,
                    });
                    setShowMoveMemberSelect(false);
                    const prevTeam = user.team;
                    const currentTeam = res.team;
                    reduxStoreDispatch(
                        teamManagerSeviceSlice.util.updateQueryData(
                            "getTeams",
                            undefined,
                            (draft) => {
                                let temp = draft;
                                const IsPrevTeamASubTeam = isDefined(
                                    prevTeam.group
                                );
                                let teamToUpdate = IsPrevTeamASubTeam
                                    ? draft.find((e) => e.id === prevTeam.group)
                                    : draft.find((e) => e.id === prevTeam.id);
                                if (isDefined(teamToUpdate)) {
                                    if (IsPrevTeamASubTeam) {
                                        teamToUpdate = {
                                            ...teamToUpdate,
                                            subteams: teamToUpdate.subteams.map(
                                                (e) =>
                                                    e.id === prevTeam.id
                                                        ? {
                                                              ...prevTeam,
                                                              members:
                                                                  prevTeam.members.filter(
                                                                      (
                                                                          person
                                                                      ) =>
                                                                          person.id !==
                                                                          id
                                                                  ),
                                                          }
                                                        : e
                                            ),
                                        };
                                    } else {
                                        teamToUpdate = {
                                            ...teamToUpdate,
                                            members:
                                                teamToUpdate.members.filter(
                                                    (person) => person.id !== id
                                                ),
                                        };
                                    }

                                    temp = draft.map((e) =>
                                        e.id === teamToUpdate?.id
                                            ? teamToUpdate
                                            : e
                                    );
                                }
                                const IsCurrentTeamASubTeam = isDefined(
                                    res.team.group
                                );
                                teamToUpdate = IsPrevTeamASubTeam
                                    ? draft.find((e) => e.id === res.team.group)
                                    : draft.find((e) => e.id === res.team.id);

                                if (isDefined(teamToUpdate)) {
                                    if (IsCurrentTeamASubTeam) {
                                        teamToUpdate = {
                                            ...teamToUpdate,
                                            subteams: teamToUpdate.subteams.map(
                                                (e) =>
                                                    e.id === currentTeam.id
                                                        ? {
                                                              ...currentTeam,
                                                              members: [
                                                                  ...e.members,
                                                                  {
                                                                      ...res,
                                                                      role_name:
                                                                          res
                                                                              .role
                                                                              ?.name ||
                                                                          "",
                                                                  },
                                                              ],
                                                          }
                                                        : e
                                            ),
                                        };
                                    } else {
                                        teamToUpdate = {
                                            ...teamToUpdate,
                                            members: [
                                                ...teamToUpdate.members,
                                                {
                                                    ...res,
                                                    role_name:
                                                        res.role?.name || "",
                                                },
                                            ],
                                        };
                                    }
                                    return temp.map((e) =>
                                        e.id === teamToUpdate?.id
                                            ? teamToUpdate
                                            : e
                                    );
                                }

                                return draft;
                            }
                        )
                    );
                });
        }
    };
    return (
        <>
            <Box
                sx={{
                    p: 1,
                    bgcolor: "common.white",
                }}
                key={id}
            >
                <Box className="flex justify-between items-center">
                    <Box className="flex items-center">
                        <Box sx={{ mr: 1.5 }}>
                            <StyledAvatar
                                className="border-none font-semibold"
                                sx={{
                                    bgcolor: "primary.main",
                                    fontSize: "16px",
                                }}
                            >
                                {displayName
                                    .split(" ")
                                    .map((e) => e[0])
                                    .join("")
                                    .toUpperCase()}
                            </StyledAvatar>
                        </Box>
                        <Box>{displayName}</Box>
                    </Box>
                    <Box className="flex items-center">
                        <Typography sx={{ mr: 1.2 }}>
                            {user?.role_name}
                        </Typography>
                        <MoveMemberSvg
                            className=" cursor-pointer "
                            onClick={() => {
                                setShowMoveMemberSelect(true);
                            }}
                        />
                    </Box>
                </Box>

                {showMoveMemberSelect ? (
                    <>
                        <Stack
                            direction={"row"}
                            gap={2}
                            sx={{ my: 2 }}
                            className="flex items-center"
                        >
                            <MuiSingleTeamSelector
                                selectedId={teamId}
                                handleChange={(val) => {
                                    setTeamId(val);
                                }}
                                className="flex-1"
                                excludeTeam={[user.team.id]}
                            />

                            <MembersAction
                                isLoading={isLoading}
                                handleDoneChange={handleChangeTeam}
                                handleCancelChange={() => {
                                    setTeamId(null);
                                    setShowMoveMemberSelect(false);
                                }}
                            />
                        </Stack>
                    </>
                ) : null}
            </Box>
            <Divider />
        </>
    );
};

export default ManageMembersDrawer;
