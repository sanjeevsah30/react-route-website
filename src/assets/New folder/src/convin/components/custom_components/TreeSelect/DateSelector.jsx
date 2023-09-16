import React, { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const DateSelector = (props) => {
    const [date, setDate] = useState(dayjs("2022-04-17"));
    return (
        <DatePicker
            label="Controlled picker"
            // value={date}
            // onChange={(newValue) => setDate(newValue)}
            // {...props}
        />
    );
};
export default DateSelector;
