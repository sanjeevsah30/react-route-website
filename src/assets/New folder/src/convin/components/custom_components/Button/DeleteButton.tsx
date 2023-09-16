import { DeleteSvg } from "@convin/components/svg";
import { useState } from "react";
import { CrudButtonWrapper } from "./CrudButtonWrapper";
import DeleteDialog from "../Dialog/DeleteDialog";
import { Box, alpha, useTheme } from "@mui/material";

type DeleteButtonProps<T> = {
    onDelete: () => Promise<T>;
    callBack?: () => void;
    title?: string;
    message: string;
    isButton?: boolean;
};

const DeleteButton = <T,>({
    onDelete,
    callBack,
    title = "Delete Item",
    message,
    isButton,
}: DeleteButtonProps<T>): JSX.Element => {
    const theme = useTheme();
    const [open, setOpen] = useState<boolean>(false);
    const handleDelete = () => {
        onDelete().then(() => {
            if (typeof callBack === "function") callBack();
            setOpen(false);
        });
    };
    return (
        <>
            {isButton ? (
                <CrudButtonWrapper onClick={() => setOpen(true)}>
                    <DeleteSvg />
                </CrudButtonWrapper>
            ) : (
                <Box
                    onClick={() => setOpen(true)}
                    sx={{
                        px: 1.5,
                        py: 1.2,
                        "&:hover": {
                            color: "primary.main",
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                        },
                    }}
                >
                    Delete
                </Box>
            )}

            <DeleteDialog
                open={open}
                setOpen={setOpen}
                onDelete={handleDelete}
                title={title}
                message={message}
            />
        </>
    );
};

export default DeleteButton;
