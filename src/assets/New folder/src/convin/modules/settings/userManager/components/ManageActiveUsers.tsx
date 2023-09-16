import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import {
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    alpha,
    Pagination,
    Stack,
} from "@mui/material";
import { useGetAllUsersQuery } from "@convin/redux/services/settings/userManager.service";
import PageLoader from "@convin/components/custom_components/PageLoader";
import { getDateTime } from "@convin/utils/helper/date.helper";
import { userType } from "@convin/config/userType.config";
import { UserType } from "@convin/type/User";
import { getUserName, isDefined } from "@convin/utils/helper/common.helper";
import { useGetRolesQuery } from "@convin/redux/services/settings/roleManager.service";
import { useGetTeamsQuery } from "@convin/redux/services/settings/teamManager.service";
import { StyledBox, StyledTableCell } from "../utils/MuiUtils";
import { FilterSvg } from "@convin/components/svg/FilterSvg";
import FilterTableColumn from "./FilterTableColumn";
import { FilterData } from "@convin/type/UserManager";
import { flattenTeams } from "@convin/utils/helper";
import { paginator } from "../utils/helper";
import TypographyElipsis from "@convin/components/custom_components/Typography/TypographyElipsis";
import EmptyState from "@convin/components/custom_components/reuseable/EmptyState";
import EmptyDataSvg from "@convin/components/svg/EmptyDataSvg";
import ActiveUsersTableData from "./ActiveUsersTableData";

export const StickyTableCell = styled(StyledTableCell)(({ theme }) => ({
    ".MuiTableCell-root": {
        height: "55px",
        ".MuiBox-root": {
            height: "55px",
        },
    },
    padding: 0,
    "&:first-of-type": {
        position: "sticky",
        left: 0,
        zIndex: 100,
        ".MuiTableCell-root": {
            padding: 0,
            border: 0,

            ".MuiBox-root": {
                width: "150px",
            },
        },
    },
    "&:last-child": {
        position: "sticky",
        right: 0,
        zIndex: 100,
        ".MuiTableCell-root": {
            padding: 0,
            border: 0,

            ".MuiBox-root": {
                width: "70px",
                // height: "100%"
            },
        },
    },
}));

interface ManageActiveUsersProps {
    userSearch: string | null;
    setAllUsers: Dispatch<SetStateAction<UserType[] | null>>;
}

const ManageActiveUsers = ({
    userSearch,
    setAllUsers,
}: ManageActiveUsersProps): JSX.Element => {
    const { data, isLoading } = useGetAllUsersQuery();

    const [users, setUsers] = useState<UserType[]>([]);
    const [visibleUsers, setVisibleUsers] = useState<UserType[]>([]);
    const [page, setPage] = useState(1);

    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const [filterDataToBePassed, setFilterDataToBePassed] = useState<
        FilterData[] | null
    >(null);
    const [columnName, setColumnName] = useState<string>("");

    const [columnFilters, setColumnFilters] = useState<{
        [key: string]: FilterData[];
    }>({
        first_name: [],
        last_name: [],
        email: [],
        primary_phone: [],
        date_joined: [],
        org_date_joined: [],
        manager: [],
        role: [],
        team: [],
        user_type: [],
        location: [],
        integrations: [],
        status: [],
    });

    const { data: allRoles } = useGetRolesQuery();
    const { data: allTeams } = useGetTeamsQuery();

    useEffect(() => {
        if (isDefined(data)) setAllUsers(data);
        else setAllUsers(null);
    }, [data]);

    useEffect(() => {
        if (isDefined(data)) {
            if (userSearch) {
                const filteredUsers = data.filter((user) => {
                    const name = getUserName(user);
                    return (
                        name.toLowerCase().includes(userSearch.toLowerCase()) ||
                        user.email
                            .toLowerCase()
                            .includes(userSearch.toLowerCase())
                    );
                });
                setUsers(filteredUsers);
                setPage(1);
            } else setUsers(data);
        }
    }, [userSearch, data]);

    useEffect(() => {
        if (isDefined(users)) {
            setVisibleUsers(
                users.filter((user) => {
                    const emailFilters = columnFilters.email;
                    const firstNameFilters = columnFilters.first_name;
                    const lastNameFilters = columnFilters.last_name;
                    const userIdFilters = columnFilters.primary_phone;
                    const dateJoinedFilters = columnFilters.date_joined;
                    const orgDateJoinedFilters = columnFilters.org_date_joined;
                    const managerFilters = columnFilters.manager;
                    const roleFilters = columnFilters.role;
                    const teamFilters = columnFilters.team;
                    const userTypeFilters = columnFilters.user_type;
                    const integrationFilters = columnFilters.integrations;
                    const statusFilters = columnFilters.status;
                    const locationFilters = columnFilters.location;

                    // Apply filters for each column
                    const passesEmailFilters =
                        emailFilters.length === 0 ||
                        emailFilters.some(
                            (filter) => filter.value === user.email
                        );
                    const passesFirstNameFilters =
                        firstNameFilters.length === 0 ||
                        firstNameFilters.some(
                            (filter) => filter.value === user.first_name
                        );
                    const passesLastNameFilters =
                        lastNameFilters.length === 0 ||
                        lastNameFilters.some(
                            (filter) => filter.value === user.last_name
                        );
                    const passesUserIdFilters =
                        userIdFilters.length === 0 ||
                        userIdFilters.some(
                            (filter) => filter.value === user.primary_phone
                        );

                    const passesDateJoinedFilters =
                        dateJoinedFilters.length === 0 ||
                        dateJoinedFilters.some(
                            (filter) =>
                                filter.value ===
                                getDateTime({
                                    isoDate: user.date_joined,
                                    type: "date",
                                })
                        );
                    const passesOrgDateJoinedFilters =
                        orgDateJoinedFilters.length === 0 ||
                        orgDateJoinedFilters.some(
                            (filter) =>
                                (user.org_date_joined &&
                                    filter.value ===
                                        getDateTime({
                                            isoDate: user.org_date_joined,
                                            type: "date",
                                        })) ||
                                filter.value === user.org_date_joined
                        );
                    const passesManagerFilters =
                        managerFilters.length === 0 ||
                        managerFilters.some(
                            (filter) =>
                                filter.value === user.manager?.first_name ||
                                (filter.value === "" && user.manager === null)
                        );
                    const passesRoleFilters =
                        roleFilters.length === 0 ||
                        roleFilters.some(
                            (filter) =>
                                filter.value === user.role?.id ||
                                (filter.value === "" && user.role === null)
                        );
                    const passesTeamFilters =
                        teamFilters.length === 0 ||
                        teamFilters.some(
                            (filter) =>
                                filter.value === user.team?.id ||
                                (filter.value === "" && user.team?.name === "")
                        );
                    const passesUserTypeFilters =
                        userTypeFilters.length === 0 ||
                        userTypeFilters.some(
                            (filter) => filter.value === user.user_type
                        );
                    const passesLocationFilters =
                        locationFilters.length === 0 ||
                        locationFilters.some(
                            (filter) => filter.value === user.location
                        );
                    const passesIntegrationFilters =
                        integrationFilters.length === 0 ||
                        integrationFilters.some(
                            (filter) =>
                                Number(filter.value) ===
                                user.integrations.length
                        );
                    const passesStatusFilters =
                        statusFilters.length === 0 ||
                        statusFilters.some(
                            (filter) => filter.value === user.is_active
                        );

                    // Return true if the item passes filters for all columns
                    return (
                        passesEmailFilters &&
                        passesFirstNameFilters &&
                        passesLastNameFilters &&
                        passesUserIdFilters &&
                        passesDateJoinedFilters &&
                        passesOrgDateJoinedFilters &&
                        passesManagerFilters &&
                        passesRoleFilters &&
                        passesTeamFilters &&
                        passesUserTypeFilters &&
                        passesLocationFilters &&
                        passesIntegrationFilters &&
                        passesStatusFilters
                    );
                })
            );
        }
    }, [columnFilters, users]);

    useEffect(() => {
        setPage(1);
    }, [columnFilters]);

    const setAnchorPosition = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation();
    };

    const removeAnchorPosition = () => {
        setAnchorEl(null);
        setFilterDataToBePassed(null);
    };

    const handleChangePage = (event: unknown, value: number) => {
        if (isDefined(visibleUsers))
            setPage(paginator<UserType>(visibleUsers, value, 3).page);
    };

    const handleColumnFilterSelection = (
        column: string,
        filters: FilterData[]
    ) => {
        setColumnFilters((prevFilters) => ({
            ...prevFilters,
            [column]: filters,
        }));
    };

    const handleFilterDataUpdate = (type: string) => {
        if (isDefined(users) && isDefined(allRoles) && type !== "")
            switch (type) {
                case "first_name":
                    {
                        setFilterDataToBePassed(
                            Array?.from(
                                new Set(users.map((e) => e?.first_name))
                            )
                                .filter((e) => Boolean(e))
                                .map((e) => {
                                    return {
                                        label: e,
                                        value: e,
                                    };
                                })
                        );
                        setColumnName("first_name");
                    }
                    break;

                case "last_name":
                    {
                        setFilterDataToBePassed([
                            { label: "", value: "" },
                            ...Array?.from(
                                new Set(users.map((e) => e?.last_name))
                            )
                                .filter((e) => Boolean(e))
                                .map((e) => {
                                    return {
                                        label: e,
                                        value: e,
                                    };
                                }),
                        ]);
                        setColumnName("last_name");
                    }
                    break;

                case "email":
                    {
                        setFilterDataToBePassed(
                            Array?.from(new Set(users.map((e) => e?.email)))
                                .filter((e) => Boolean(e))
                                .map((e) => {
                                    return {
                                        label: e,
                                        value: e,
                                    };
                                })
                        );
                        setColumnName("email");
                    }
                    break;

                case "primary_phone":
                    {
                        setFilterDataToBePassed([
                            { label: "", value: "" },
                            ...Array?.from(
                                new Set(users.map((e) => e?.primary_phone))
                            )
                                .filter((e) => Boolean(e))
                                .map((e) => {
                                    return {
                                        label: e ? e : "",
                                        value: e ? e : "",
                                    };
                                }),
                        ]);
                        setColumnName("primary_phone");
                    }
                    break;

                case "date_joined":
                    {
                        setFilterDataToBePassed(
                            Array?.from(
                                new Set(
                                    users.map((e) =>
                                        getDateTime({
                                            isoDate: e?.date_joined,
                                            type: "date",
                                        })
                                    )
                                )
                            )
                                .filter((e) => Boolean(e))
                                .map((e) => {
                                    return {
                                        label: e,
                                        value: e,
                                    };
                                })
                        );
                        setColumnName("date_joined");
                    }
                    break;

                case "org_date_joined":
                    {
                        setFilterDataToBePassed([
                            { label: "", value: null },
                            ...Array?.from(
                                new Set(
                                    users.map((e) => {
                                        if (isDefined(e?.org_date_joined))
                                            return getDateTime({
                                                isoDate: e?.org_date_joined,
                                                type: "date",
                                            });
                                        else return "";
                                    })
                                )
                            )
                                .filter((e) => Boolean(e))
                                .map((e) => {
                                    return {
                                        label: e,
                                        value: e,
                                    };
                                }),
                        ]);
                        setColumnName("org_date_joined");
                    }
                    break;

                case "manager":
                    {
                        setFilterDataToBePassed([
                            { label: "", value: "" },
                            ...Array.from(
                                new Set(
                                    users.map((user) => {
                                        if (
                                            user?.role?.name === "Manager" ||
                                            user?.role?.name === "Team Lead" ||
                                            user?.role?.name === "Auditor" ||
                                            user?.role?.name === "Admin"
                                        )
                                            return user?.first_name;
                                        else return "";
                                    })
                                )
                            )
                                .filter((e) => Boolean(e))
                                .map((e) => {
                                    return {
                                        label: e,
                                        value: e,
                                    };
                                }),
                        ]);
                        setColumnName("manager");
                    }
                    break;

                case "role":
                    {
                        setFilterDataToBePassed([
                            { label: "", value: "" },
                            ...allRoles.map((e) => {
                                return {
                                    label: e?.name?.replace(/\_/g, " "),
                                    value: e?.id,
                                };
                            }),
                        ]);
                        setColumnName("role");
                    }
                    break;

                case "team":
                    {
                        setFilterDataToBePassed([
                            {
                                label: "",
                                value: "",
                            },
                            ...flattenTeams(allTeams)?.map((e) => {
                                return {
                                    label: e?.name,
                                    value: e?.id,
                                };
                            }),
                        ]);
                        setColumnName("team");
                    }
                    break;

                case "user_type":
                    {
                        setFilterDataToBePassed(
                            Object.keys(userType).map((e) => {
                                return {
                                    label: userType[e],
                                    value: Number(e),
                                };
                            })
                        );
                        setColumnName("user_type");
                    }
                    break;

                case "location":
                    {
                        setFilterDataToBePassed([
                            {
                                label: "",
                                value: "",
                            },
                            ...Array.from(
                                new Set(users.map((e) => e?.location))
                            )
                                .filter((e) => Boolean(e))
                                .map((e) => {
                                    return {
                                        label: e,
                                        value: e,
                                    };
                                }),
                        ]);
                        setColumnName("location");
                    }
                    break;

                case "integrations": {
                    setFilterDataToBePassed(
                        Array.from(
                            new Set(
                                users.map((e) => {
                                    return e?.integrations.length;
                                })
                            )
                        ).map((e) => {
                            return {
                                label: String(e),
                                value: e,
                            };
                        })
                    );
                    setColumnName("integrations");
                    break;
                }
                case "status":
                    setFilterDataToBePassed([
                        { label: "Active", value: true },
                        { label: "Inactive", value: false },
                    ]);
                    setColumnName("status");
            }
    };

    // const handleTeamChange = (e: React.SyntheticEvent, newValue , reason: string)=>{
    //     console.log("newTeamValue",newValue);
    // }

    if (isLoading) return <PageLoader />;

    return (
        <>
            <TableContainer
                component={Paper}
                sx={{ bgcolor: "transparent", borderRadius: 1.5 }}
            >
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StickyTableCell>
                                <StyledBox>
                                    First Name
                                    <div
                                        className="ml-auto cursor-pointer"
                                        onClick={(e) => {
                                            setAnchorPosition(e);
                                            handleFilterDataUpdate(
                                                "first_name"
                                            );
                                        }}
                                    >
                                        <FilterSvg
                                            sx={{
                                                color: columnFilters[
                                                    "first_name"
                                                ].length
                                                    ? "primary.main"
                                                    : "grey.999",
                                            }}
                                        />
                                    </div>
                                </StyledBox>
                            </StickyTableCell>
                            <StyledTableCell>
                                <StyledBox>
                                    Last Name
                                    <div
                                        className="ml-auto cursor-pointer"
                                        onClick={(e) => {
                                            setAnchorPosition(e);
                                            handleFilterDataUpdate("last_name");
                                        }}
                                    >
                                        <FilterSvg
                                            sx={{
                                                color: columnFilters[
                                                    "last_name"
                                                ].length
                                                    ? "primary.main"
                                                    : "grey.999",
                                            }}
                                        />
                                    </div>
                                </StyledBox>
                            </StyledTableCell>
                            <StyledTableCell>
                                <StyledBox>
                                    Email
                                    <div
                                        className="ml-auto cursor-pointer"
                                        onClick={(e) => {
                                            setAnchorPosition(e);
                                            handleFilterDataUpdate("email");
                                        }}
                                    >
                                        <FilterSvg
                                            sx={{
                                                color: columnFilters["email"]
                                                    .length
                                                    ? "primary.main"
                                                    : "grey.999",
                                            }}
                                        />
                                    </div>
                                </StyledBox>
                            </StyledTableCell>
                            <StyledTableCell>
                                <StyledBox>
                                    User Id
                                    <div
                                        className="ml-auto cursor-pointer"
                                        onClick={(e) => {
                                            setAnchorPosition(e);
                                            handleFilterDataUpdate(
                                                "primary_phone"
                                            );
                                        }}
                                    >
                                        <FilterSvg
                                            sx={{
                                                color: columnFilters[
                                                    "primary_phone"
                                                ].length
                                                    ? "primary.main"
                                                    : "grey.999",
                                            }}
                                        />
                                    </div>
                                </StyledBox>
                            </StyledTableCell>
                            <StyledTableCell>
                                <StyledBox>
                                    Joined On
                                    <div
                                        className="ml-auto cursor-pointer"
                                        onClick={(e) => {
                                            setAnchorPosition(e);
                                            handleFilterDataUpdate(
                                                "date_joined"
                                            );
                                        }}
                                    >
                                        <FilterSvg
                                            sx={{
                                                color: columnFilters[
                                                    "date_joined"
                                                ].length
                                                    ? "primary.main"
                                                    : "grey.999",
                                            }}
                                        />
                                    </div>
                                </StyledBox>
                            </StyledTableCell>
                            <StyledTableCell>
                                <StyledBox className="w-32">
                                    <TypographyElipsis className="font-semibold text-sm">
                                        Organisation Joining Date
                                    </TypographyElipsis>
                                    <div
                                        className="ml-auto cursor-pointer"
                                        onClick={(e) => {
                                            setAnchorPosition(e);
                                            handleFilterDataUpdate(
                                                "org_date_joined"
                                            );
                                        }}
                                    >
                                        <FilterSvg
                                            sx={{
                                                color: columnFilters[
                                                    "org_date_joined"
                                                ].length
                                                    ? "primary.main"
                                                    : "grey.999",
                                            }}
                                        />
                                    </div>
                                </StyledBox>
                            </StyledTableCell>
                            <StyledTableCell>
                                <StyledBox>
                                    Manager
                                    <div
                                        className="ml-auto cursor-pointer"
                                        onClick={(e) => {
                                            setAnchorPosition(e);
                                            handleFilterDataUpdate("manager");
                                        }}
                                    >
                                        <FilterSvg
                                            sx={{
                                                color: columnFilters["manager"]
                                                    .length
                                                    ? "primary.main"
                                                    : "grey.999",
                                            }}
                                        />
                                    </div>
                                </StyledBox>
                            </StyledTableCell>
                            <StyledTableCell>
                                <StyledBox>
                                    Role
                                    <div
                                        className="ml-auto cursor-pointer"
                                        onClick={(e) => {
                                            setAnchorPosition(e);
                                            handleFilterDataUpdate("role");
                                        }}
                                    >
                                        <FilterSvg
                                            sx={{
                                                color: columnFilters["role"]
                                                    .length
                                                    ? "primary.main"
                                                    : "grey.999",
                                            }}
                                        />
                                    </div>
                                </StyledBox>
                            </StyledTableCell>
                            <StyledTableCell>
                                <StyledBox>
                                    Team
                                    <div
                                        className="ml-auto cursor-pointer"
                                        onClick={(e) => {
                                            setAnchorPosition(e);
                                            handleFilterDataUpdate("team");
                                        }}
                                    >
                                        <FilterSvg
                                            sx={{
                                                color: columnFilters["team"]
                                                    .length
                                                    ? "primary.main"
                                                    : "grey.999",
                                            }}
                                        />
                                    </div>
                                </StyledBox>
                            </StyledTableCell>
                            <StyledTableCell>
                                <StyledBox>
                                    User Type
                                    <div
                                        className="ml-auto cursor-pointer"
                                        onClick={(e) => {
                                            setAnchorPosition(e);
                                            handleFilterDataUpdate("user_type");
                                        }}
                                    >
                                        <FilterSvg
                                            sx={{
                                                color: columnFilters[
                                                    "user_type"
                                                ].length
                                                    ? "primary.main"
                                                    : "grey.999",
                                            }}
                                        />
                                    </div>
                                </StyledBox>
                            </StyledTableCell>
                            <StyledTableCell>
                                <StyledBox>
                                    Location
                                    <div
                                        className="ml-auto cursor-pointer"
                                        onClick={(e) => {
                                            setAnchorPosition(e);
                                            handleFilterDataUpdate("location");
                                        }}
                                    >
                                        <FilterSvg
                                            sx={{
                                                color: columnFilters["location"]
                                                    .length
                                                    ? "primary.main"
                                                    : "grey.999",
                                            }}
                                        />
                                    </div>
                                </StyledBox>
                            </StyledTableCell>
                            <StyledTableCell>
                                <StyledBox>
                                    Integrations
                                    <div
                                        className="ml-auto cursor-pointer"
                                        onClick={(e) => {
                                            setAnchorPosition(e);
                                            handleFilterDataUpdate(
                                                "integrations"
                                            );
                                        }}
                                    >
                                        <FilterSvg
                                            sx={{
                                                color: columnFilters[
                                                    "integrations"
                                                ].length
                                                    ? "primary.main"
                                                    : "grey.999",
                                            }}
                                        />
                                    </div>
                                </StyledBox>
                            </StyledTableCell>
                            <StickyTableCell sx={{ display: "flex" }}>
                                <StyledBox sx={{ pr: 0 }}>
                                    Status
                                    <div
                                        className="ml-auto cursor-pointer"
                                        onClick={(e) => {
                                            setAnchorPosition(e);
                                            handleFilterDataUpdate("status");
                                        }}
                                    >
                                        <FilterSvg
                                            sx={{
                                                color: columnFilters["status"]
                                                    .length
                                                    ? "primary.main"
                                                    : "grey.999",
                                            }}
                                        />
                                    </div>
                                </StyledBox>
                                <StyledBox sx={{ width: 72 }}>Action</StyledBox>
                            </StickyTableCell>
                        </TableRow>
                    </TableHead>
                    {visibleUsers.length ? (
                        <ActiveUsersTableData
                            visibleUsers={visibleUsers}
                            page={page}
                        />
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
                                {data?.length ? (
                                    <></>
                                ) : (
                                    <td colSpan={12}>
                                        <EmptyState
                                            text={"No Data Found"}
                                            Component={<EmptyDataSvg />}
                                        />
                                    </td>
                                )}
                            </tr>
                        </TableBody>
                    )}
                </Table>
            </TableContainer>
            {isDefined(users) && users.length > 10 ? (
                <Stack direction="row" justifyContent="center" sx={{ py: 2 }}>
                    <Pagination
                        count={Math.ceil(visibleUsers.length / 10)}
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
            {isDefined(filterDataToBePassed) && (
                <FilterTableColumn<FilterData>
                    anchorEl={anchorEl}
                    onClose={removeAnchorPosition}
                    onSelected={(filters) =>
                        handleColumnFilterSelection(columnName, filters)
                    }
                    filters={filterDataToBePassed}
                    selectedFilters={columnFilters[columnName]}
                />
            )}
            {}
        </>
    );
};

export default ManageActiveUsers;
