import TopbarConfig from "@constants/Topbar/index";
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

    const checkToClose = (event) => {
        if (
            event.target.classList.contains("react-calendar__tile") ||
            event.target.classList.contains(
                "react-calendar__navigation__label"
            ) ||
            event.target.classList.contains(
                "react-calendar__navigation__arrow"
            ) ||
            event.target.nodeName === "ABBR"
        ) {
            return;
        }
        if (
            !showDatePicker &&
            calRef.current &&
            !calRef.current.contains(event.target)
        ) {
            hideDatePicker();
        }
    };

    useEffect(() => {
        document.addEventListener("click", checkToClose);

        return () => {
            document.removeEventListener("click", checkToClose);
        };
    }, [filterDates?.active, showDatePicker]);
    return (
        <div className={"datepicker"} ref={calRef}>
            {showDatePicker ? (
                <DatePicker
                    onChange={(value) => {
                        handleRangeChange(value);
                        hideDatePicker();
                    }}
                    className={"daterange topbar-filters-calendar"}
                    selectRange={true}
                    maxDate={new Date()}
                    minDetail={TopbarConfig.MINCALDETAIL}
                />
            ) : null}
        </div>
    );
}

export default ReportCalendar;
