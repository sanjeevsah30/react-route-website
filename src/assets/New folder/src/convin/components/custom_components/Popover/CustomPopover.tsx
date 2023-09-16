import * as React from "react";
import Popover from "@mui/material/Popover";
import { Box } from "@mui/material";

type Props = {
    children?: React.ReactNode;
    anchorEl: HTMLDivElement | null;
    onClose: () => void;
};

type ChildrenProps = {
    onClose: () => void;
};

export default function CustomPopover({
    children,
    anchorEl,
    onClose,
}: Props): JSX.Element {
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const childrenWithProps = React.Children.map(children, (child) => {
        if (React.isValidElement<ChildrenProps>(child)) {
            return React.cloneElement(child, { onClose });
        }
        return child;
    });

    return (
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            sx={{
                fontSize: "14px",
                "& .MuiPopover-paper": {
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1) !important",
                },
            }}
        >
            <Box
                className="min-w-[100px] cursor-pointer"
                sx={{
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    overflow: "hidden",
                }}
            >
                {childrenWithProps}
            </Box>
        </Popover>
    );
}
