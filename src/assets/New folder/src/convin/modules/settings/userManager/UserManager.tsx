import { useCallback, useState } from "react";
import { CustomTabs } from "@convin/components/custom_components/Tabs/CustomTabs";
import PlusSvg from "@convin/components/svg/PlusSvg";
import SearchSvg from "@convin/components/svg/SearchSvg";
import {
    Box,
    Button,
    InputAdornment,
    Stack,
    TextField,
    Tooltip,
    Typography,
    alpha,
    useTheme,
} from "@mui/material";
import ManageActiveUsers from "./components/ManageActiveUsers";
import CustomPopover from "@convin/components/custom_components/Popover/CustomPopover";
import { sxPropOption } from "./utils/MuiUtils";
import ManageInvitedUsers from "./components/ManageInvitedUsers";
import CreateUserModal from "./components/features/CreateUserModal";
import UploadUsersModal from "./components/features/UploadUsersModal";
import { UserType } from "@convin/type/User";
import { isDefined } from "@convin/utils/helper/common.helper";
import DownloadSvg from "@convin/components/svg/DownloadSvg";
import { LoadingButton } from "@mui/lab";
import { useGetVersionDataQuery } from "@convin/redux/services/common/common.service";
import { useDownloadUsersExcelSheetMutation } from "@convin/redux/services/settings/userManager.service";
import { RoleProvider } from "@convin/contexts/RoleContext";

const UserManager = (): JSX.Element => {
    const { data: versionData } = useGetVersionDataQuery();
    const [downloadSheet, { isLoading: isDownloading }] =
        useDownloadUsersExcelSheetMutation();

    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const [userSearch, setUserSearch] = useState<string | null>("");
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] =
        useState<boolean>(false);
    const [isUploadUsersModalOpen, setIsUploadUsersModalOpen] = useState(false);
    const [allUsers, setAllUsers] = useState<UserType[] | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const toggleCreateUserModal = useCallback(() => {
        setIsCreateUserModalOpen((prev) => !prev);
    }, [isCreateUserModalOpen]);

    return (
        <Box className="h-full overflow-y-scroll">
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ p: 3 }}
            >
                <Typography variant="extraLarge" className="font-semibold">
                    User Manager
                </Typography>
                <Stack direction="row" spacing={1.5}>
                    <TextField
                        sx={{
                            width: "245px",
                            "& .MuiInputBase-input": {
                                padding: "8px 8px 8px 0px",
                            },
                        }}
                        placeholder="Search for Name and Email"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchSvg sx={{ color: "grey.999" }} />
                                </InputAdornment>
                            ),
                        }}
                        variant="outlined"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                    />
                    <div onClick={handleClick}>
                        <Button
                            sx={{ pr: 2.5, height: "39px" }}
                            variant="global"
                        >
                            <PlusSvg sx={{ pr: 0.5, fontSize: 0 }} />
                            USER
                        </Button>
                    </div>
                    <Tooltip title="Download User Data" placement="top" arrow>
                        <span>
                            <LoadingButton
                                onClick={() => {
                                    downloadSheet();
                                }}
                                sx={{
                                    height: (theme) => theme.spacing(5),
                                    width: (theme) => theme.spacing(5),
                                    p: 0,
                                    backgroundColor: (theme) =>
                                        `${alpha(
                                            theme.palette.textColors[999],
                                            0.2
                                        )} !important`,
                                }}
                                disabled={
                                    !isDefined(allUsers) ||
                                    !allUsers.length ||
                                    isDownloading
                                }
                                loading={isDownloading}
                                className="min-w-[40px] w-10 h-10"
                                classes={{ loadingIndicator: "text-black" }}
                            >
                                <DownloadSvg />
                            </LoadingButton>
                        </span>
                    </Tooltip>
                </Stack>
            </Stack>
            <CustomTabs
                tabs={[
                    {
                        label: "Manage Active Users",
                        content: (
                            <ManageActiveUsers
                                userSearch={userSearch}
                                setAllUsers={setAllUsers}
                            />
                        ),
                    },
                    {
                        label: "Manage Invited Users",
                        content: <ManageInvitedUsers userSearch={userSearch} />,
                    },
                ]}
            />
            <CustomPopover anchorEl={anchorEl} onClose={handleClose}>
                <Box
                    sx={sxPropOption(theme)}
                    onClick={() => {
                        setIsCreateUserModalOpen(true);
                        handleClose();
                    }}
                >
                    {versionData?.domain_type === "b2c" ? "Create" : "Invite"}{" "}
                    User
                </Box>
                <Box
                    sx={sxPropOption(theme)}
                    onClick={() => {
                        setIsUploadUsersModalOpen(true);
                        handleClose();
                    }}
                >
                    Upload User Data
                </Box>
            </CustomPopover>
            <CreateUserModal
                open={isCreateUserModalOpen}
                handleClose={toggleCreateUserModal}
            />
            <UploadUsersModal
                open={isUploadUsersModalOpen}
                handleClose={() => setIsUploadUsersModalOpen(false)}
            />
        </Box>
    );
};

export default function withProviderUserManager() {
    return (
        <RoleProvider>
            <UserManager />
        </RoleProvider>
    );
}
