import { ReactElement, ReactNode } from "react";
import { styled } from "@mui/material/styles";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { CloseSvg } from "@convin/components/svg";
import { Divider, IconButton, PaperProps } from "@mui/material";
import useResponsive from "@convin/hooks/useResponsive";

export const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
    "& .MuiDialog-paper": {
        maxWidth: "90vw",
        minWidth: "0px",
        boxShadow: "none",
    },
}));

interface BootstrapDialogTitleProps {
    children: ReactNode;
    onClose?: () => void;
    [key: string]: unknown;
}

export function BootstrapDialogTitle({
    children,
    onClose,
    ...other
}: BootstrapDialogTitleProps): ReactElement {
    return (
        <DialogTitle sx={{ m: 0, p: 3 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 16,
                        top: 16,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseSvg />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}
BootstrapDialogTitle.defaultProps = {
    onClose: undefined,
};

interface CustomModalProps extends DialogProps {
    open: boolean;
    // setOpen?: () => void;
    // handleClickOpen?: () => void;
    handleClose?: () => void;
    title?: string;
    children: ReactElement;
    dialogContentSx?: any;
    footer?: ReactNode;
    showFooter?: boolean;
}

export default function CustomModal({
    open = false,
    // setOpen = () => {},
    // handleClickOpen = () => {},
    handleClose = () => {
        return;
    },
    title,
    children,
    dialogContentSx,
    footer,
    showFooter = true,
    ...rest
}: CustomModalProps): ReactElement {
    const fullScreen = useResponsive("down", "md") as boolean | undefined;
    return (
        <BootstrapDialog
            onClose={(event, reason) => {
                if (reason !== "backdropClick") handleClose();
            }}
            fullScreen={fullScreen}
            aria-labelledby="customized-dialog-title"
            open={open}
            {...rest}
        >
            <BootstrapDialogTitle
                id="customized-dialog-title"
                onClose={handleClose}
            >
                {title}
            </BootstrapDialogTitle>
            <Divider />
            <DialogContent sx={dialogContentSx}>{children}</DialogContent>
            <Divider sx={{ mx: 4 }} />
            {showFooter && (
                <DialogActions sx={{ mx: 4, py: "16px !important" }}>
                    {footer}
                </DialogActions>
            )}
        </BootstrapDialog>
    );
}

CustomModal.defaultProps = {
    open: false,
    // setOpen: () => {},
    // handleClickOpen: () => {},
    handleClose: () => {
        return;
    },
    title: "Modal",
    dialogContentSx: {},
    footer: null,
    showFooter: true,
    width: "60vw",
};
