import React, { Dispatch, FC } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

interface DeleteDialogProps {
    open: boolean;
    setOpen: Dispatch<boolean>;
    onDelete: () => void;
    title: string;
    message: string;
    children?: React.ReactNode;
}

const DeleteDialog: FC<DeleteDialogProps> = ({
    open,
    setOpen,
    onDelete,
    title,
    message,
    children = null,
}) => {
    const handleDelete = () => {
        onDelete();
    };

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="delete-dialog-title"
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{message}</DialogContent>
            {children}
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleDelete}>Delete</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;
