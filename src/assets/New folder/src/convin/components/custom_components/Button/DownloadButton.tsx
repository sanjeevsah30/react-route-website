import DownloadSvg from "@convin/components/svg/DownloadSvg";
import { FunctionComponent } from "react";
import { Box, Theme } from "@mui/material";
import { SystemStyleObject, alpha } from "@mui/system";

export const DownloadButton: FunctionComponent<{
    onClick: () => void;
    sx: SystemStyleObject<Theme>;
    disabled?: boolean;
}> = ({ onClick, sx, disabled = false }) => (
    <Box
        sx={[
            sx,
            (theme) => ({
                backgroundColor: alpha(theme.palette.textColors["333"], 0.1),
                borderRadius: 0.75,
                color:
                    theme.palette.mode === "light" ? "textColors.666" : "white",
            }),
        ]}
        onClick={onClick}
        className={`${
            disabled ? "cursor-none opacity-30" : "cursor-pointer"
        } flex justify-center items-center`}
    >
        <DownloadSvg />
    </Box>
);

DownloadButton.defaultProps = {
    sx: {},
};
