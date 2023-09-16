import TopbarConfig from "@constants/Topbar/index";
import Icon from "@presentational/reusables/Icon";
import { uid } from "@tools/helpers";
import { Select } from "antd";
import React from "react";
import ReportCalendar from "./ReportCalendar";
const { Option } = Select;
function SelectDate({
    className,
    date_container_id,
    filterDates,
    handleDurationChange,
    handleRangeChange,
    showDatePicker,
    setShowDatePicker,
    dateLabel,
    dropdownClassName,
    style,
}) {
    return (
        <div id={date_container_id}>
            <Select
                value={filterDates?.active}
                onChange={handleDurationChange}
                dropdownRender={(menu) => (
                    <div>
                        <span className={"topbar-label"}>
                            {dateLabel || TopbarConfig.DATELABEL}
                        </span>
                        {menu}
                    </div>
                )}
                style={{
                    ...style,
                }}
                className="custom__select"
                dropdownClassName={"account_select_dropdown"}
                suffixIcon={
                    <Icon className="fas fa-chevron-down dove_gray_cl" />
                }
            >
                {Object.keys(filterDates?.dates || {})?.map((date, idx) => (
                    <Option value={date} key={date}>
                        {filterDates.dates[date].name}
                    </Option>
                ))}
            </Select>
            <ReportCalendar
                handleRangeChange={handleRangeChange}
                showDatePicker={showDatePicker}
                setShowDatePicker={setShowDatePicker}
                filterDates={filterDates}
            />
        </div>
    );
}

SelectDate.defaultProps = {
    className: "",
    date_container_id: uid(),
    handleDurationChange: () => {},
    handleRangeChange: () => {},
    showDatePicker: false,
    setShowDatePicker: () => {},
    dropdownClassName: "",
    style: {},
};
export default SelectDate;
