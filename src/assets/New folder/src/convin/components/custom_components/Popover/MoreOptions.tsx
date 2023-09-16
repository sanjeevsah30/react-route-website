import * as React from "react";
import Popover from "@mui/material/Popover";
import { Box } from "@mui/material";

type Props = {
    children?: React.ReactNode;
    className?: string;
};

type ChildrenProps = {
    // onClose: () => void;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

export default function MoreOptions({
    children,
    className = "",
}: Props): JSX.Element {
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation();
    };

    const handleClose = (): void => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const childrenWithProps = React.Children.map(children, (child) => {
        if (React.isValidElement<ChildrenProps>(child)) {
            return React.cloneElement(child, {
                onClick: (event: React.MouseEvent<HTMLElement>) => {
                    child?.props?.onClick && child.props.onClick(event);
                    handleClose();
                },
            });
        }
        return child;
    });

    return (
        <div className={className}>
            <div
                aria-describedby={id}
                onClick={handleClick}
                className="cursor-pointer w-[10px] px-4 py-2"
            >
                <svg
                    width="5"
                    height="16"
                    viewBox="0 0 5 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="pointer-events-none"
                >
                    <path
                        d="M2.42983 8.81999C2.85168 8.81999 3.19365 8.47802 3.19365 8.05618C3.19365 7.63433 2.85168 7.29236 2.42983 7.29236C2.00799 7.29236 1.66602 7.63433 1.66602 8.05618C1.66602 8.47802 2.00799 8.81999 2.42983 8.81999Z"
                        stroke="#333333"
                        strokeWidth="2.1998"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M2.42983 3.47307C2.85168 3.47307 3.19365 3.1311 3.19365 2.70925C3.19365 2.28741 2.85168 1.94543 2.42983 1.94543C2.00799 1.94543 1.66602 2.28741 1.66602 2.70925C1.66602 3.1311 2.00799 3.47307 2.42983 3.47307Z"
                        stroke="#333333"
                        strokeWidth="2.1998"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M2.42983 14.1667C2.85168 14.1667 3.19365 13.8247 3.19365 13.4029C3.19365 12.981 2.85168 12.639 2.42983 12.639C2.00799 12.639 1.66602 12.981 1.66602 13.4029C1.66602 13.8247 2.00799 14.1667 2.42983 14.1667Z"
                        stroke="#333333"
                        strokeWidth="2.1998"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={(event) => {
                    handleClose();
                    (event as React.MouseEvent).stopPropagation();
                }}
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
                    className="cursor-pointer"
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
        </div>
    );
}
