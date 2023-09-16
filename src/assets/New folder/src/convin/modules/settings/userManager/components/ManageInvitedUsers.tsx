import { useEffect, useState } from "react";
import {
    useGetAvailableSubscriptionsQuery,
    useGetInvitedUsersQuery,
    useInviteUserMutation,
} from "@convin/redux/services/settings/userManager.service";
import {
    Pagination,
    Paper,
    Stack,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    alpha,
} from "@mui/material";
import { StyledBox, StyledTableCell, StyledTableRow } from "../utils/MuiUtils";
import PageLoader from "@convin/components/custom_components/PageLoader";
import { InviteUser, InviteUserType } from "@convin/type/UserManager";
import { isDefined } from "@convin/utils/helper/common.helper";
import { paginator } from "../utils/helper";
import { useGetRolesQuery } from "@convin/redux/services/settings/roleManager.service";
import { useGetTeamsQuery } from "@convin/redux/services/settings/teamManager.service";
import { userType } from "@convin/config/userType.config";
import { LoadingButton } from "@mui/lab";
import { AntSendOutlinedSvg } from "@convin/components/svg/AntSendOutlinedSvg";
import EmptyState from "@convin/components/custom_components/reuseable/EmptyState";
import EmptyDataSvg from "@convin/components/svg/EmptyDataSvg";

interface ManageInvitedUsersProps {
    userSearch: string | null;
}

const ManageInvitedUsers = ({ userSearch }: ManageInvitedUsersProps) => {
    const { data, isLoading } = useGetInvitedUsersQuery();
    const { data: allRoles, isLoading: isRolesLoading } = useGetRolesQuery();
    const { data: allTeams, isLoading: isTeamsLoading } = useGetTeamsQuery();
    const { data: availableSubscriptions, isLoading: isSubscriptionsLoading } =
        useGetAvailableSubscriptionsQuery();
    const [inviteUser, { isLoading: isInvitingUser }] = useInviteUserMutation();

    const [page, setPage] = useState<number>(1);
    const [users, setUsers] = useState<InviteUserType[]>();
    const [invitingUserId, setInvitingUserId] = useState<string>("");

    useEffect(() => {
        if (isDefined(data)) {
            if (userSearch) {
                const filteredUsers = data.results.filter((user) => {
                    return user.email
                        .toLowerCase()
                        .includes(userSearch.toLowerCase());
                });
                setUsers(filteredUsers);
            } else setUsers(data.results);
            setPage(1);
        }
    }, [data, users, userSearch]);

    const handleChangePage = (event: unknown, value: number) => {
        if (isDefined(users))
            setPage(paginator<InviteUserType>(users, value, 3).page);
    };

    if (isLoading || isRolesLoading || isTeamsLoading) {
        return <PageLoader />;
    }
    return (
        <>
            <TableContainer component={Paper} sx={{ bgcolor: "transparent" }}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell className="w-[20%]">
                                <StyledBox>Email Address</StyledBox>
                            </StyledTableCell>
                            <StyledTableCell className="w-[15%]">
                                <StyledBox>Role</StyledBox>
                            </StyledTableCell>
                            <StyledTableCell className="w-[15%]">
                                <StyledBox>Team</StyledBox>
                            </StyledTableCell>
                            <StyledTableCell className="w-[15%]">
                                <StyledBox>User Type</StyledBox>
                            </StyledTableCell>
                            <StyledTableCell className="w-[15%]">
                                <StyledBox>License</StyledBox>
                            </StyledTableCell>
                            <StyledTableCell className="w-[20%]">
                                <StyledBox>Reminder</StyledBox>
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    {users?.length ? (
                        <TableBody>
                            {paginator<InviteUserType>(
                                users,
                                page,
                                10
                            ).data?.map((user, index) => {
                                const {
                                    id,
                                    email,
                                    role,
                                    team,
                                    license,
                                    invitation_id,
                                } = user;
                                return (
                                    <StyledTableRow key={id}>
                                        <StyledTableCell>
                                            <StyledBox index={index}>
                                                {email}
                                            </StyledBox>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <StyledBox index={index}>
                                                {isDefined(allRoles)
                                                    ? allRoles.find(
                                                          ({ id }) =>
                                                              id === role
                                                      )?.name
                                                    : "N/A"}
                                            </StyledBox>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <StyledBox index={index}>
                                                {isDefined(allTeams)
                                                    ? allTeams.find(
                                                          ({ id }) =>
                                                              id === team
                                                      )?.name
                                                    : "N/A"}
                                            </StyledBox>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <StyledBox index={index}>
                                                {userType[user.user_type]}
                                            </StyledBox>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <StyledBox index={index}>
                                                {(isDefined(
                                                    availableSubscriptions
                                                ) &&
                                                    availableSubscriptions.find(
                                                        ({ subscription_id }) =>
                                                            subscription_id ===
                                                            license
                                                    )?.subscription_type) ||
                                                    "Free"}
                                            </StyledBox>
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <StyledBox index={index}>
                                                <LoadingButton
                                                    loading={
                                                        isInvitingUser &&
                                                        invitation_id ===
                                                            invitingUserId
                                                    }
                                                    loadingPosition="start"
                                                    startIcon={
                                                        <AntSendOutlinedSvg />
                                                    }
                                                    onClick={() => {
                                                        setInvitingUserId(
                                                            invitation_id
                                                        );
                                                        inviteUser(
                                                            invitation_id
                                                        );
                                                    }}
                                                >
                                                    Send Reminder
                                                </LoadingButton>
                                            </StyledBox>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    ) : (
                        <TableBody
                            className="h-64 border-[0.5px] border-solid"
                            sx={{
                                boxShadow: (theme) =>
                                    `0px 4px 20px 0px ${alpha(
                                        theme.palette.textColors[999],
                                        0.1
                                    )}`,
                            }}
                        >
                            <tr>
                                <td colSpan={6}>
                                    <EmptyState
                                        text={"No Data Found"}
                                        Component={<EmptyDataSvg />}
                                    />
                                </td>
                            </tr>
                        </TableBody>
                    )}
                </Table>
            </TableContainer>
            {isDefined(users) && users.length > 10 ? (
                <Stack direction="row" justifyContent="center" sx={{ py: 2 }}>
                    <Pagination
                        count={Math.ceil(users.length / 10)}
                        page={page}
                        onChange={handleChangePage}
                        sx={(theme) => ({
                            "& .MuiPaginationItem-root": {
                                borderRadius: "4px",
                            },
                            "& .Mui-selected": {
                                border: "1px solid #1A62F2",
                                borderRadius: "4px",
                                backgroundColor: `${alpha(
                                    theme.palette.primary.main,
                                    0.1
                                )} !important`,
                            },
                        })}
                    />
                </Stack>
            ) : (
                <></>
            )}
        </>
    );
};

export default ManageInvitedUsers;
