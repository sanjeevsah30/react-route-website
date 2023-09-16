import PolygonDown from "@convin/components/svg/PolygonDown";
import { Box, Button, ClickAwayListener, Theme, useTheme } from "@mui/material";
import { ReactElement } from "react";
import { Label } from "../Typography/Label";

interface PopConfirmProps {
    children: ReactElement;
    onConfirm: () => void;
    text: string;
    open: boolean;
    setOpen: (val: boolean) => void;
}

export default function PopConfirm({
    children,
    onConfirm,
    text,
    open,
    setOpen,
}: PopConfirmProps): ReactElement {
    const theme: Theme = useTheme();
    const handleConfirm = () => {
        onConfirm();
        setOpen(false);
    };
    return (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Box sx={{ width: "max-context", display: "inline", zIndex: "0" }}>
                {children}

                {open && (
                    <Box
                        sx={{
                            position: "absolute",
                            width: "max-content",
                            background: theme.palette.common.white,
                            zIndex: "4",
                            right: 0,
                            padding: 2,
                            boxShadow: theme.shadows[3],
                            top: 40,
                            borderRadius: `${theme.shape.borderRadius}px`,
                        }}
                    >
                        <PolygonDown
                            sx={{
                                height: 12,
                                width: 16,
                                transform: "rotateZ(60deg)",
                                position: "absolute",
                                top: -9,
                                right: 8,
                                strokeOpacity: "0.1",
                                color: theme.palette.common.white,
                            }}
                        />
                        <Label
                            colorType="666"
                            variant="textXs"
                            sx={{ mb: 1.5 }}
                        >
                            {text}
                        </Label>
                        <Box className="flex items-center justify-end">
                            <Button
                                variant="globalOutlined"
                                sx={{
                                    mr: 1.5,
                                    minWidth: "40px !important",
                                    p: 0,
                                    py: 0.5,
                                    fontSize: "12px",
                                }}
                                onClick={() => setOpen(false)}
                            >
                                No
                            </Button>
                            <Button
                                variant="global"
                                sx={{
                                    minWidth: "40px !important",
                                    p: 0,
                                    py: 0.5,
                                    fontSize: "12px",
                                }}
                                onClick={handleConfirm}
                            >
                                Yes
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </ClickAwayListener>
    );
}
