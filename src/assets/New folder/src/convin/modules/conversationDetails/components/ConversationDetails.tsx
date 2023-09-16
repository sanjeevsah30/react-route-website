import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { ReactElement, useState } from "react";
import InfoSvg from "@convin/components/svg/InfoSvg";
import { Box, Divider, Stack } from "@mui/material";
import { Label } from "@convin/components/custom_components/Typography/Label";
import MultipleAvatar from "@convin/components/custom_components/MultipleAvatar/MultipleAvatar";
import { getDuration } from "@convin/utils/helper/common.helper";
import { getDateTime } from "@convin/utils/helper/date.helper";
import { ClockSvg, CloseSvg } from "@convin/components/svg";
import CalendarSvg from "@convin/components/svg/CalendarSvg";

export default function ConversationDetails({
    participants,
    agenda,
    title,
    start_time,
    end_time,
}: {
    participants: string[];
    agenda?: string;
    title: string;
    start_time: string;
    end_time: string;
}): ReactElement {
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
        <>
            <Box
                className="cursor-pointer"
                sx={{ color: "primary.main", transform: "scale(1.5)" }}
                onClick={handleClick}
            >
                <InfoSvg />
            </Box>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "center",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "center",
                    horizontal: "center",
                }}
                sx={{
                    background: "transparent",
                    mt: 8,
                }}
            >
                <Box
                    sx={{
                        boxShadow: "0px 2px 20px 0px rgb(51, 51, 51, 0.08)",
                        bgcolor: "common.white",
                    }}
                    className="w-[620px]"
                >
                    <Box
                        sx={{
                            p: 2,
                        }}
                        className="flex items-center justify-between"
                    >
                        <Typography className="font-semibold text-[22px]">
                            Call Information
                        </Typography>
                        <Box className="cursor-pointer" onClick={handleClose}>
                            <CloseSvg />
                        </Box>
                    </Box>

                    <Divider />
                    <Box
                        sx={{
                            p: 2,
                        }}
                    >
                        <Stack direction="row" gap={2}>
                            <Box className="w-[50%]">
                                <Label
                                    className="font-semibold"
                                    isEllipses
                                    colorType="333"
                                >
                                    {title}
                                </Label>
                                <Box className="flex">
                                    <MultipleAvatar users={participants} />
                                </Box>
                            </Box>
                            <Box className="w-[50%]">
                                <Box
                                    sx={{ mb: 1 }}
                                    className="flex gap-[8px] ml-[2px] items-center"
                                >
                                    <ClockSvg />
                                    <Typography variant="medium">
                                        {getDuration(start_time, end_time)}
                                    </Typography>
                                </Box>
                                <Box className="flex gap-[8px] items-center">
                                    <CalendarSvg />
                                    <Typography variant="medium">
                                        {getDateTime({ isoDate: start_time })}
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Box>
                    <Divider />
                    <Box
                        sx={{
                            p: 2,
                        }}
                    >
                        <Typography className="font-semibold">
                            Call Agenda
                        </Typography>
                        <Typography
                            variant="medium"
                            component="p"
                            dangerouslySetInnerHTML={{
                                __html: agenda
                                    ? agenda.replace(/\n/g, "<br />")
                                    : title,
                            }}
                        />
                    </Box>
                </Box>
            </Popover>
        </>
    );
}
