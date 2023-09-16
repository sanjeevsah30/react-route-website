import { useState, FunctionComponent, useEffect } from "react";
import {
    Box,
    Divider,
    Modal,
    TextField,
    Typography,
    alpha,
    useTheme,
} from "@mui/material";
import { CloseSvg } from "@convin/components/svg";
import InfoCircleSvg from "app/static/svg/InfoCircleSvg";
import { useGetAllUserQuery } from "@convin/redux/services/settings/users.servise";
import GenericMultipleSelect from "@convin/components/select/GenericMultipleSelect";
import { UserType } from "@convin/type/User";
import { downloadImage } from "@convin/utils/helper/common.helper";
import { useParams } from "react-router-dom";
import { useShareCustomDahboardReportMutation } from "@convin/redux/services/home/customDashboard.service";
import { LoadingButton } from "@mui/lab";
import { toPng } from "html-to-image";
import { showToast } from "@convin/utils/toast";
import { CreateUpdateToastSettings } from "@convin/config/toast.config";
import { showError } from "@store/common/actions";

const styleRenameModel = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 605,
    bgcolor: "#fff",
    boxShadow: 24,
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
};
interface RouteParams {
    id: string;
}
const ShareDownloadModal: FunctionComponent<{
    isShareModelOpen: boolean;
    setIsShareModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
    dashboardRef: React.RefObject<HTMLDivElement>;
}> = ({ isShareModelOpen, setIsShareModelOpen, dashboardRef }) => {
    const { data: userList, isLoading: isUserListFetching } =
        useGetAllUserQuery();
    const [shareReportApi, { isLoading: isShareing }] =
        useShareCustomDahboardReportMutation();
    const [userIds, setUserIds] = useState<number[]>([]);
    const [comment, setComment] = useState<string>("");
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [openTosat, setOpenTosat] = useState<boolean>(false);
    const params = useParams<RouteParams>();
    const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
    const theme = useTheme();
    const [showError, setShowError] = useState(false);

    const shareHandler = (): void => {
        if (userIds.length !== 0) {
            setIsGeneratingImage(true);
            const ele = dashboardRef.current;
            if (ele === null) return;
            try {
                setTimeout(async () => {
                    const url = await toPng(ele, {
                        backgroundColor: "#fff",
                    });
                    fetch(url)
                        .then((response) => response.blob())
                        .then((blob) => {
                            const data = new FormData();
                            data.append("emails", JSON.stringify(userIds));
                            data.append("custom_dashboard", params.id);
                            data.append("comment", comment);
                            data.append("dashboard_screenshot", blob);
                            shareReportApi(data)
                                .then(() => {
                                    setIsShareModelOpen(false);
                                    setIsGeneratingImage(false);
                                    showToast({
                                        message:
                                            "Report has been shared successfully !",
                                        ...CreateUpdateToastSettings,
                                    });
                                    setUserIds([]);
                                })
                                .catch(() => setIsGeneratingImage(false));
                        });
                }, 0);
            } catch (e) {
                setIsGeneratingImage(false);
            }
        } else {
            setShowError(true);
        }
    };

    return (
        <>
            <Modal open={isShareModelOpen}>
                <Box sx={styleRenameModel}>
                    <Box
                        sx={{ p: 2 }}
                        className="flex items-center justify-between"
                    >
                        <Typography
                            id="modal-modal-title"
                            className="font-semibold"
                            variant="large"
                        >
                            Share
                        </Typography>
                        <Box
                            onClick={() => {
                                setUserIds([]);
                                setComment("");
                                setIsShareModelOpen((prev) => !prev);
                            }}
                        >
                            <CloseSvg />
                        </Box>
                    </Box>
                    <Divider />
                    <Box sx={{ px: 2.5, my: 3 }}>
                        <GenericMultipleSelect<UserType>
                            label="Share to"
                            data={userList || []}
                            loading={isUserListFetching}
                            values={userIds}
                            setValues={(val: number[]) => {
                                setUserIds(val);
                                showError && setShowError(false);
                            }}
                        />
                        {showError ? (
                            <Typography
                                sx={{ color: "error.main", pl: 1 }}
                                variant="medium"
                            >
                                *Select users to share!
                            </Typography>
                        ) : (
                            <></>
                        )}
                    </Box>
                    <Box sx={{ px: 2.5, mb: 3 }}>
                        <TextField
                            id="filled-basic"
                            label="Add Comment"
                            variant="filled"
                            sx={{ width: "100%" }}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Box
                            className="flex items-center justify-between"
                            sx={{ mt: 1.5, mb: 2.5 }}
                        >
                            <Box className="flex items-center">
                                <InfoCircleSvg style={{ color: "#1a62f2" }} />
                                <Typography
                                    component="span"
                                    variant="small"
                                    sx={{ ml: 1, color: "primary.main" }}
                                >
                                    {
                                        "An image will be shared with the listed calls to the above mentioned email."
                                    }
                                </Typography>
                            </Box>
                            <LoadingButton
                                sx={{
                                    background: `${alpha(
                                        theme.palette.primary.main,
                                        0.2
                                    )} !important`,
                                    py: 1,
                                    px: 3,
                                }}
                                onClick={shareHandler}
                            >
                                {isGeneratingImage || isShareing
                                    ? "SHAREING..."
                                    : "SHARE"}
                            </LoadingButton>
                        </Box>
                        <Divider />
                        <Box
                            sx={{ px: 2.5, pt: 2.5 }}
                            className="flex justify-center"
                        >
                            <LoadingButton
                                fullWidth
                                size="large"
                                className="w-auto"
                                onClick={() => {
                                    setIsDownloading(true);
                                    const ele = dashboardRef.current;
                                    if (ele !== null) {
                                        try {
                                            setTimeout(async () => {
                                                const url = await toPng(ele, {
                                                    backgroundColor: "#fff",
                                                });
                                                downloadImage(
                                                    url,
                                                    "Reports Dashboard"
                                                );
                                                setIsDownloading(false);
                                            }, 0);
                                        } catch (e) {
                                            setIsDownloading(false);
                                        }
                                    }
                                }}
                                sx={{
                                    color: "common.primary",
                                    background: `${alpha(
                                        theme.palette.primary.main,
                                        0.2
                                    )} !important`,
                                }}
                            >
                                {isDownloading
                                    ? "Downloading..."
                                    : "Download as JPG"}
                            </LoadingButton>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default ShareDownloadModal;
