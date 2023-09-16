import { defaultConfig } from "@convin/config/default.config";
import { Box, ClickAwayListener } from "@mui/material";
import React, { useEffect, useRef } from "react";
import DatePicker from "react-calendar";

function ReportCalendar({
    handleRangeChange,
    showDatePicker,
    setShowDatePicker,
    filterDates,
}) {
    const calRef = useRef(null);

    const hideDatePicker = () => setShowDatePicker(false);

    return (
        <ClickAwayListener
            mouseEvent="onMouseDown"
            onClickAway={() => {
                hideDatePicker();
            }}
        >
            <Box sx={{ mt: 2 }} ref={calRef}>
                <DatePicker
                    onChange={handleRangeChange}
                    className={"daterange topbar-filters-calendar"}
                    selectRange={true}
                    maxDate={new Date()}
                    minDetail="year"
                />
            </Box>
        </ClickAwayListener>
    );
}

export default React.memo(
    ReportCalendar,
    (prevProps, nextProps) =>
        prevProps.showDatePicker !== nextProps.showDatePicker
);
