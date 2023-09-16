import CustomModal from "@convin/components/custom_components/CustomModal";
import { StepContent, Steps } from "@convin/components/custom_components/Steps";
import { CloseSvg, UploadSvg } from "@convin/components/svg";
import MicrosoftExcelSvg from "@convin/components/svg/MicrosoftExcelSvg";
import axiosInstance from "@convin/utils/axios/axiosInstance";
import { Box, Button, Divider, Typography, alpha } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { showToast } from "@convin/utils/toast";
import { CreateUpdateToastSettings } from "@convin/config/toast.config";
import { LoadingButton } from "@mui/lab";
import { useDownloadUsersExcelSheetMutation } from "@convin/redux/services/settings/userManager.service";

interface UploadUsersModalProps {
    open: boolean;
    handleClose: () => void;
}

const UploadUsersModal = ({ open, handleClose }: UploadUsersModalProps) => {
    const [downloadSheet, { isLoading: isDownloading }] =
        useDownloadUsersExcelSheetMutation();

    const [currentStep, setCurrentStep] = useState(0);
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0] !== undefined) {
            const maxAllowedSize = 10 * 1024 * 1024;
            if (event.target.files?.[0].size > maxAllowedSize) {
                event.target.value = "";
                return showToast({
                    type: "error",
                    message: "Upload a file whose size is less than 10 mb",
                });
            }
            setFile(event.target.files?.[0]);
        } else {
            setFile(null);
        }
    };

    const handleUploadUsers = () => {
        if (file) {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_type", "USER_LIST");
            setIsLoading(true);
            axiosInstance
                .post("/feedback/bulk_upload/", data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then(() => {
                    showToast({
                        message:
                            "Uploaded Successfully. Users will be created after sometime",
                        ...CreateUpdateToastSettings,
                    });
                    setIsLoading(false);
                    handleClose();
                    setFile(null);
                })
                .catch(() => {
                    showToast({
                        ...CreateUpdateToastSettings,
                        type: "error",
                        message: "Upload Failed. Please try again.",
                    });
                    setIsLoading(false);
                });
        }
    };
    return (
        <CustomModal
            open={open}
            handleClose={() => {
                handleClose();
                setFile(null);
            }}
            title="Upload User Data"
            footer={
                <Button
                    variant="global"
                    sx={{
                        px: 5,
                        py: 1,
                        cursor:
                            currentStep === 1 && !file
                                ? "not-allowed"
                                : "pointer",
                    }}
                    onClick={() => {
                        if (currentStep === 0) {
                            setCurrentStep((prev) => prev + 1);
                        } else {
                            if (file) handleUploadUsers();
                        }
                    }}
                >
                    {currentStep === 0 ? "Next" : "Upload"}
                </Button>
            }
            dialogContentSx={{ height: "480px", overflow: "hidden" }}
            PaperProps={{ sx: { width: "50rem", borderRadius: "12px" } }}
        >
            <Box className="flex overflow-hidden h-full">
                <Steps
                    items={["Add/Edit Users", "Upload File"]}
                    current={currentStep}
                    setCurrent={setCurrentStep}
                ></Steps>
                {currentStep === 0 ? (
                    <StepContent
                        title="Add or Edit Users"
                        description="To upload new users or edit existing users, please follow the steps below."
                        content={
                            <Box className="flex column">
                                <Box className="flex column">
                                    <Box
                                        className="h-14 bg-[#9999991A] flex items-center justify-between px-3 py-2 rounded-md"
                                        sx={{
                                            height: 14,
                                            bgcolor: (theme) =>
                                                alpha(
                                                    theme.palette
                                                        .textColors[999],
                                                    0.1
                                                ),
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                color: (theme) =>
                                                    theme.palette
                                                        .textColors[666],
                                            }}
                                        >
                                            <span className="text-[#333] font-semibold">
                                                Step 1:
                                            </span>{" "}
                                            Download the existing user data
                                        </Box>
                                        <LoadingButton
                                            variant="outlined"
                                            startIcon={
                                                <MicrosoftExcelSvg sx={{}} />
                                            }
                                            sx={{
                                                border: "1px solid",
                                                borderColor: (theme) =>
                                                    theme.palette
                                                        .textColors[999],
                                                backgroundColor: (theme) =>
                                                    `${theme.palette.common.white} !important`,
                                                fontWeight: "600",
                                            }}
                                            onClick={() => downloadSheet()}
                                            loading={isDownloading}
                                        >
                                            Download
                                        </LoadingButton>
                                    </Box>
                                    <Box className="h-14 flex items-center justify-between px-3 py-2 my-3">
                                        <Box
                                            className="flex"
                                            sx={{
                                                color: (theme) =>
                                                    theme.palette
                                                        .textColors[666],
                                            }}
                                        >
                                            <Box
                                                className="font-semibold whitespace-nowrap mr-1"
                                                sx={{
                                                    color: (theme) =>
                                                        theme.palette
                                                            .textColors[333],
                                                }}
                                            >
                                                Step 2:
                                            </Box>
                                            <Box>
                                                Add new users or edit existing
                                                users in the file which you have
                                                downloaded from previous step.
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Divider />
                                    <Box
                                        className="ml-4 mt-6"
                                        sx={{
                                            color: (theme) =>
                                                theme.palette.textColors[333],
                                        }}
                                    >
                                        <span>Detailed Instructions</span>
                                        <ol className="list-decimal ml-5">
                                            <li className="font-semibold text-base mt-4">
                                                Create/Edit Users
                                                <ul className="list-disc -ml-0.5 mb-5 mt-1">
                                                    <Typography
                                                        component="li"
                                                        className="text-sm font-normal"
                                                        sx={{
                                                            color: (theme) =>
                                                                theme.palette
                                                                    .textColors[666],
                                                        }}
                                                    >
                                                        To create a new user,
                                                        fill all the details in
                                                        a new excel row and
                                                        upload.
                                                    </Typography>
                                                    <Typography
                                                        component="li"
                                                        className="text-sm font-normal"
                                                        sx={{
                                                            color: (theme) =>
                                                                theme.palette
                                                                    .textColors[666],
                                                        }}
                                                    >
                                                        To modify details for
                                                        existing user, make
                                                        changes in the
                                                        respective fields and
                                                        upload.
                                                    </Typography>
                                                </ul>
                                            </li>
                                            <li className="font-semibold text-base">
                                                Activate/Deactivate Users
                                                <ul className="list-disc -ml-0.5 mb-5 mt-1">
                                                    <Typography
                                                        component="li"
                                                        className="text-sm font-normal"
                                                        sx={{
                                                            color: (theme) =>
                                                                theme.palette
                                                                    .textColors[666],
                                                        }}
                                                    >
                                                        If user enters ‘Active’
                                                        in the Active/Inactive
                                                        field or leaves it
                                                        empty, those users will
                                                        be marked as active.
                                                    </Typography>
                                                    <Typography
                                                        className="text-sm font-normal"
                                                        sx={{
                                                            color: (theme) =>
                                                                theme.palette
                                                                    .textColors[666],
                                                        }}
                                                    >
                                                        If a user enters
                                                        ‘Inactive’ in the
                                                        Active/Inactive field,
                                                        those users will get
                                                        deactivated.
                                                    </Typography>
                                                    <Typography
                                                        className="text-sm font-normal"
                                                        sx={{
                                                            color: (theme) =>
                                                                theme.palette
                                                                    .textColors[666],
                                                        }}
                                                    >
                                                        If a user deletes an
                                                        entry in the file, those
                                                        users will get
                                                        deactivated.
                                                    </Typography>
                                                </ul>
                                            </li>
                                            <li className="font-semibold text-base">
                                                Email ID cannot be changed from
                                                data upload method
                                                <ul className="list-disc -ml-0.5 mb-5 mt-1">
                                                    <Typography
                                                        className="text-sm font-normal"
                                                        sx={{
                                                            color: (theme) =>
                                                                theme.palette
                                                                    .textColors[666],
                                                        }}
                                                    >
                                                        It can be changed from
                                                        the user manager.
                                                    </Typography>
                                                </ul>
                                            </li>
                                        </ol>
                                    </Box>
                                </Box>
                            </Box>
                        }
                    />
                ) : (
                    <StepContent
                        title="Upload file"
                        description="Upload the updated user data to complete the changes."
                        content={
                            <Box className="flex column">
                                <Box
                                    className="rounded-md border-2 border-dashed flex column justify-center items-center"
                                    sx={{
                                        width: 480,
                                        height: 224,
                                        borderColor: (theme) =>
                                            theme.palette.primary.main,
                                    }}
                                >
                                    <Typography
                                        component="label"
                                        htmlFor="user-file"
                                        className="flex items-center column gap-2 text-lg font-semibold cursor-pointer my-2"
                                        sx={{
                                            color: (theme) =>
                                                theme.palette.primary.main,
                                        }}
                                    >
                                        <UploadSvg />
                                        Browse Excel file
                                    </Typography>
                                    <input
                                        id="user-file"
                                        type="file"
                                        accept=".xlsx"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        disabled={isLoading}
                                        onClick={(e) => {
                                            (
                                                e.target as HTMLInputElement
                                            ).value = "";
                                        }}
                                    />

                                    <Typography
                                        component="span"
                                        className="text-xs"
                                        sx={{
                                            color: (theme) =>
                                                theme.palette.textColors[999],
                                        }}
                                    >
                                        Max. File Size: 10mb
                                    </Typography>
                                </Box>
                                {file ? (
                                    <Box
                                        className="w-[30rem] flex justify-between mt-5 p-5 rounded-md"
                                        sx={{
                                            bgcolor: (theme) =>
                                                alpha(
                                                    theme.palette
                                                        .textColors[999],
                                                    0.1
                                                ),
                                        }}
                                    >
                                        <Box>
                                            <span>{file.name} </span>
                                            <span>
                                                {`(${(
                                                    file.size / 1000000
                                                ).toFixed(2)}mb)`}
                                            </span>
                                        </Box>
                                        <Box
                                            onClick={() => {
                                                setFile(null);
                                            }}
                                            className="cursor-pointer"
                                        >
                                            <CloseSvg />
                                        </Box>
                                    </Box>
                                ) : null}
                            </Box>
                        }
                    />
                )}
            </Box>
        </CustomModal>
    );
};

export default UploadUsersModal;
