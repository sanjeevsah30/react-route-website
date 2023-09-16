import TopbarConfig from "@constants/Topbar/index";
import { uid } from "@tools/helpers";
import { Select } from "antd";
import React from "react";
import Icon from "./Icon";
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
}) {
    return (
        <div id={date_container_id} className="flex alignCenter">
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
                className={className}
                style={{
                    width: "200px",
                }}
                suffixIcon={
                    <Icon className="fas fa-chevron-down dove_gray_cl" />
                }
                dropdownClassName={dropdownClassName}
                dropdownAlign={{ offset: [-90, 4] }}
            >
                {/* {Object.keys(filterDates?.dates || {})?.map((date, idx) => (
                    <Option value={date} key={date}>
                        {filterDates.dates[date].name}
                    </Option>
                ))} */}
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
};
export default SelectDate;
