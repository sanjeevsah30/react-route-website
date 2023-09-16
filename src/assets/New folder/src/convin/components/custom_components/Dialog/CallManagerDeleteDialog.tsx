import PageLoader from "@convin/components/custom_components/PageLoader";
import { useTheme } from "@mui/material/styles";
import { Label } from "../Typography/Label";

import React, { FC } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

interface DeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
    title: string;
    message: string;
    children?: React.ReactNode;
}

interface CallManagerDeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
    title: string;
    message: string;
    loading: boolean;
    meetingCount?: number;
    label?: string;
}

const DeleteDialog: FC<DeleteDialogProps> = ({
    open,
    onClose,
    onDelete,
    title,
    message,
    children = null,
}) => {
    const handleDelete = () => {
        onDelete();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="delete-dialog-title"
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{message}</DialogContent>
            {children}
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleDelete}>Delete</Button>
            </DialogActions>
        </Dialog>
    );
};
const CallManagerDeleteDialog = ({
    title,
    message,
    loading,
    meetingCount,
    label = "",
    ...props
}: CallManagerDeleteDialogProps): JSX.Element => {
    const theme = useTheme();

    if (loading) {
        return <PageLoader />;
    }

    return (
        <DeleteDialog {...props} title={title} message={message}>
            <Label
                variant="h6"
                isEllipses
                sx={{
                    px: 3,
                    textAlign: "center",
                    color: theme.palette.primary.main,
                }}
                colorType="333"
            >
                {`"${label}"`}
            </Label>
            <DialogContent
                sx={{
                    textAlign: "center",
                }}
            >
                {`This tag is associated with ${meetingCount} meetings`}
            </DialogContent>
        </DeleteDialog>
    );
};

export default CallManagerDeleteDialog;
