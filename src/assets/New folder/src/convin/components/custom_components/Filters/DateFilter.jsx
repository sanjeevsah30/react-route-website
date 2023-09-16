import TextField from "@mui/material/TextField";
import { useEffect, useRef, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import "react-calendar/dist/Calendar.css";
import {
    Paper,
    Box,
    Popper,
    Typography,
    alpha,
    AccordionSummary,
    AccordionDetails,
    FormGroup,
    FormControlLabel,
    Checkbox,
    ClickAwayListener,
} from "@mui/material";
import { styled } from "@mui/system";
import MuiAccordion from "@mui/material/Accordion";

import { motion } from "framer-motion";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import moment from "moment-timezone";
import ReportCalendar from "./ReportCalendar";
import { ChevronDownSvg } from "@convin/components/svg";
import { pxToRem } from "@convin/utils/getFontValue";
import { useSelector } from "react-redux";
import { datekeys } from "@convin/config/default.config";

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    "&.MuiAccordion-root": {
        minHeight: "36px ",
        display: "flex",
        flexDirection: "column",
    },
    ".MuiAccordionSummary-root": {
        minHeight: "36px ",
    },
    ".MuiAccordionSummary-content": {
        margin: 0,
        overflow: "hidden",
        ".MuiTypography-root": {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            paddingRight: 1.25,
            fontSize: pxToRem(14),
        },
    },
    ".MuiAccordionDetails-root": {
        padding: " 8px 10px",
    },

    ".MuiFormControlLabel-root": {
        margin: 0,
    },
}));

const DateDropDownPopper = styled(Popper)(({ theme }) =>
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

const DateOption = styled(Box, {
    shouldForwardProp: (prop) => true,
})(({ theme }) => ({
    ":hover": {
        backgroundColor: alpha(theme?.palette?.primary?.main, 0.1),
        cursor: "pointer",
    },
}));

function SingleDatePicker({ label, handleUpdate }) {
    const [open, setOpen] = useState(false);

    const handleDateChange = (value) => {
        const formattedDate = moment(value).format("MMM DD, YYYY");
        let dateRange = [null, null];
        if (label === "Before") dateRange[1] = `${value}`;
        else if (label === "After") dateRange[0] = `${value}`;
        const active_date = `${label} ${formattedDate}`;
        handleUpdate({
            value: active_date,
            is_custom: true,
            dateRange,
        });
    };

    return (
        <DesktopDatePicker
            label={label}
            minDate={new Date("2017-01-01")}
            onChange={handleDateChange}
            renderInput={(params) => (
                <TextField
                    onClick={() => {
                        setOpen(true);
                    }}
                    size="small"
                    {...params}
                />
            )}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
        />
    );
}

const DateDropDown = ({
    onClose,
    setShowDatePicker,
    options,
    handleUpdate,
    active,
}) => {
    const excludeLabels = [datekeys.before, datekeys.after];

    const handleChange = (value) => {
        if (value === datekeys.custom) {
            setShowDatePicker(true); // Show datepicker.
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
            <Box className="flex-1 overflow-y-auto">
                <Box>
                    {Object.keys(options).map((key, idx) =>
                        !options[key]?.is_roling_date &&
                        !excludeLabels.includes(key) ? (
                            <DateOption
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
                            </DateOption>
                        ) : null
                    )}
                </Box>

                <Accordion>
                    <AccordionSummary expandIcon={<ChevronDownSvg />}>
                        <Typography>Before</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <SingleDatePicker
                            label="Before"
                            {...{ onClose, handleUpdate }}
                        />
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ChevronDownSvg />}>
                        <Typography>After</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <SingleDatePicker
                            label="After"
                            {...{ onClose, handleUpdate }}
                        />
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary expandIcon={<ChevronDownSvg />}>
                        <Typography>Rolling Date Range</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormGroup>
                            {Object.keys(datekeys).map((key, idx) =>
                                options[key]?.is_roling_date ? (
                                    <FormControlLabel
                                        key={idx}
                                        control={
                                            <Checkbox
                                                checked={active === key}
                                                onClick={() =>
                                                    handleUpdate({
                                                        value: key,
                                                    })
                                                }
                                                inputProps={{
                                                    "aria-label": "controlled",
                                                }}
                                                disableRipple
                                            />
                                        }
                                        label={
                                            <Typography variant="textXs">
                                                {options[key]?.name}
                                            </Typography>
                                        }
                                    />
                                ) : null
                            )}
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Paper>
    );
};

export default function DateFilter({ value, handleUpdate, options, label }) {
    const [openPopper, setOpenPopper] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const anchorRef = useRef(null);

    const handleRangeChange = (newRange) => {
        const formattedDate0 = moment(newRange[0]).format("MMM DD, YYYY");
        const formattedDate1 = moment(newRange[1]).format("MMM DD, YYYY");
        const dateRange = [`${newRange[0]}`, `${newRange[1]}`];
        const active_date = `${formattedDate0} - ${formattedDate1}`;
        handleUpdate({
            value: active_date,
            is_custom: true,
            dateRange,
        });
        setShowDatePicker(false);
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
                        // onChange={handleChange}
                        disableClearable
                        options={[]}
                        open={openPopper}
                        onOpen={() => setOpenPopper(true)}
                        renderInput={(params) => (
                            <TextField {...params} label={label || "Date"} />
                        )}
                        getOptionLabel={(option) => options?.[option]?.name}
                        PaperComponent={() => (
                            <DateDropDown
                                {...{
                                    options,
                                    onClose,
                                    showDatePicker,
                                    setShowDatePicker,
                                    handleUpdate,
                                    active: value,
                                }}
                            />
                        )}
                        PopperComponent={(props) => (
                            <DateDropDownPopper
                                placement="bottom-end"
                                {...props}
                                component={motion.div}
                            >
                                {props.children}
                            </DateDropDownPopper>
                        )}
                    />
                    {showDatePicker && (
                        <ReportCalendar
                            handleRangeChange={handleRangeChange}
                            showDatePicker={showDatePicker}
                            setShowDatePicker={setShowDatePicker}
                        />
                    )}
                </Box>
            </ClickAwayListener>
        </>
    );
}
