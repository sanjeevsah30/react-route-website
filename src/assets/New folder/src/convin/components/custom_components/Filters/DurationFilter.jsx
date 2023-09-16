import TextField from "@mui/material/TextField";
import { useRef, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import "react-calendar/dist/Calendar.css";
import {
    Paper,
    Box,
    Popper,
    Typography,
    alpha,
    ClickAwayListener,
    InputBase,
    useTheme,
} from "@mui/material";
import { styled } from "@mui/system";

import { motion } from "framer-motion";
import moment from "moment-timezone";
import ReportCalendar from "./ReportCalendar";
import { Divider } from "antd";

const DurationInput = styled(InputBase)(({ theme }) => ({
    width: "100%",
    fontSize: "45px",

    outline: "none",
    border: "2px solid",
    borderColor: theme.palette.primary.main,
    borderRadius: "8px",
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    "& .MuiInputBase-input": {
        textAlign: "center",
    },
}));

const DurationDropDownPopper = styled(Popper)(({ theme }) =>
    theme.unstable_sx({
        border: "1px solid",
        borderColor: "primary.main",
        top: "10px !important",

        maxHeight: "334px !important",
        borderRadius: 1,
        overflow: "hidden",

        ".MuiPaper-root": {
            maxHeight: "334px !important",
        },
    })
);

const DurationOption = styled(Box, {
    shouldForwardProp: (prop) => true,
})(({ theme }) => ({
    ":hover": {
        backgroundColor: alpha(theme?.palette?.primary?.main, 0.1),
        cursor: "pointer",
    },
}));

const DurationDropDown = ({
    onClose,
    setShowDurationPicker,
    options,
    handleUpdate,
    active,
}) => {
    const handleChange = (value) => {
        if (+value === 7) {
            setShowDurationPicker(true); // Show DurationPicker.
        } else {
            handleUpdate({
                value,
                is_custom: false,
            });
        }
        onClose();
    };

    return (
        <Paper
            className="flex flex-col"
            sx={{
                maxHeight: 200,
                height: 200,
            }}
        >
            {/* <Box
                sx={{
                    px: 1,
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
                className="shrink-0"
            >
                <Typography variant="textXs666">Select Duration</Typography>
            </Box> */}
            <Box className="flex-1 overflow-y-auto">
                <Box>
                    {Object.keys(options).map((key, idx) => (
                        <DurationOption
                            sx={{
                                px: 2,
                                py: 1,
                            }}
                            key={key}
                            onClick={() => handleChange(key)}
                        >
                            <Typography
                                fontWeight={
                                    key === active
                                        ? "fontWeightMedium"
                                        : "fontFamily"
                                }
                                variant="textSm"
                            >
                                {options[key]?.name}
                            </Typography>
                        </DurationOption>
                    ))}
                </Box>
            </Box>
        </Paper>
    );
};

const CustomDurationPicker = ({ setShowDurationPicker, handleRangeChange }) => {
    const [duration, setDuration] = useState({
        min: null,
        max: null,
    });
    const theme = useTheme();
    return (
        <Box
            sx={{
                bgcolor: alpha(theme.palette?.primary?.main, 0.1),
                borderRadius: "6px",
                p: 2,
                mt: 2,
            }}
        >
            <Typography className="font-semibold" sx={{ mb: 1 }}>
                Enter Duration (in min)
            </Typography>
            <Divider sx={{ color: "common.divider" }} />
            <Box className="flex items-center justify-center">
                <Box
                    sx={{
                        width: 147,
                        px: 2,
                        py: 1,
                    }}
                >
                    <DurationInput
                        value={duration.min}
                        onChange={(e) => {
                            setDuration({
                                ...duration,
                                min: +e.target.value || null,
                            });
                        }}
                        type="number"
                    />
                    <Typography variant="small">{"Min Duration"}</Typography>
                </Box>
                <Box
                    sx={{
                        fontSize: 45,
                        pb: 3,
                    }}
                >
                    :
                </Box>
                <Box
                    sx={{
                        width: 147,
                        px: 2,
                        py: 1,
                    }}
                >
                    <DurationInput
                        value={duration.max}
                        onChange={(e) => {
                            setDuration({
                                ...duration,
                                max: +e.target.value || null,
                            });
                        }}
                        type="number"
                    />
                    <Typography variant="small">{"Max Duration"}</Typography>
                </Box>
            </Box>
            <Box className="flex justify-end gap-10">
                <Typography
                    onClick={() => {
                        setShowDurationPicker(false);
                    }}
                    className="cursor-pointer font-semibold"
                    variant="medium"
                    sx={{ color: "primary.main" }}
                >
                    Cancel
                </Typography>
                <Typography
                    onClick={() => {
                        handleRangeChange(duration);
                    }}
                    className="cursor-pointer font-semibold"
                    variant="medium"
                    sx={{ color: "primary.main" }}
                >
                    OK
                </Typography>
            </Box>
        </Box>
    );
};

export default function DurationFilter({ value, handleUpdate, options }) {
    const [openPopper, setOpenPopper] = useState(false);
    const [showDurationPicker, setShowDurationPicker] = useState(false);

    const anchorRef = useRef(null);

    const handleRangeChange = ({ min, max }) => {
        const range = [min, max];
        const active =
            min && max
                ? `Between ${min} - ${max} min`
                : min
                ? `Above ${min} min`
                : max
                ? `Below ${max} min`
                : 0;
        handleUpdate({
            value: active,
            is_custom: active ? true : false,
            range,
        });
        setShowDurationPicker(false);
    };

    const onClose = () => {
        setOpenPopper(false);
    };
    return (
        <>
            <ClickAwayListener
                mouseEvent="onMouseDown"
                onClickAway={() => {
                    setOpenPopper(false);
                }}
            >
                <Box ref={anchorRef} className="relative">
                    <Autocomplete
                        value={value}
                        disableClearable
                        options={[]}
                        open={openPopper}
                        onOpen={() => setOpenPopper(true)}
                        renderInput={(params) => (
                            <TextField {...params} label="Duration" />
                        )}
                        getOptionLabel={(option) => options?.[option]?.name}
                        PaperComponent={() => (
                            <DurationDropDown
                                {...{
                                    options,
                                    onClose,
                                    showDurationPicker,
                                    setShowDurationPicker,
                                    handleUpdate,
                                    active: value,
                                }}
                            />
                        )}
                        PopperComponent={(props) => (
                            <DurationDropDownPopper
                                placement="bottom-end"
                                {...props}
                                component={motion.div}
                            >
                                {props.children}
                            </DurationDropDownPopper>
                        )}
                    />
                    {showDurationPicker && (
                        <CustomDurationPicker
                            {...{ setShowDurationPicker, handleRangeChange }}
                        />
                    )}
                </Box>
            </ClickAwayListener>
        </>
    );
}
