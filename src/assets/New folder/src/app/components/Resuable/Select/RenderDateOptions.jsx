import { Checkbox, Collapse, DatePicker } from "antd";
import CalendarSvg from "../../../static/svg/CalendarSvg";
import MinusSvg from "../../../static/svg/MinusSvg";
import PlusSvg from "../../../static/svg/PlusSvg";
import { fixBeforeAfterDateField } from "@tools/searchFactory";
import ReportCalendar from "../../Audit Report/ReportCalendar";
import TopbarConfig from "../../../constants/Topbar/index";
import { useState } from "react";

const RenderDateOptions = ({
    dateOptions: options,
    activeKey: active,
    setDateRange,
    isJoinedDatefilter,
}) => {
    const [calendarVisible, setCalendarVisible] = useState(false);
    return (
        <>
            {!calendarVisible && (
                <div>
                    <div className="placeholder flex justifySpaceBetween">
                        {isJoinedDatefilter ? (
                            <span>Select Joined date</span>
                        ) : (
                            <span>Select created date</span>
                        )}
                    </div>

                    <div className="options_container">
                        {Object.keys(options || {})?.map((date, idx) => {
                            return !options[date].is_roling_date ? (
                                <div
                                    key={idx}
                                    className="option"
                                    onClick={() => {
                                        if (date === TopbarConfig.CUSTOMLABEL) {
                                            // setPopupOpen(false);
                                            setCalendarVisible(true);
                                        } else {
                                            setDateRange(date);
                                        }
                                    }}
                                >
                                    <div
                                        className={`${
                                            active === date ? "bold600" : ""
                                        }`}
                                    >
                                        <div>{options[date]?.name}</div>

                                        <div className="font10 dusty_gray_cl">
                                            {options[date].label}
                                        </div>
                                    </div>
                                </div>
                            ) : null;
                        })}
                        <div
                            className="rolling_date_container"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Collapse
                                expandIconPosition={"right"}
                                // accordion={props.isAccordion}

                                expandIcon={({ isActive }) =>
                                    isActive ? (
                                        <MinusSvg
                                            style={{
                                                color: "#999999",
                                            }}
                                        />
                                    ) : (
                                        <PlusSvg
                                            style={{
                                                color: "#999999",
                                            }}
                                        />
                                    )
                                }
                            >
                                <Collapse.Panel header="Before" key="1">
                                    <DatePicker
                                        onChange={(date, dateString) => {
                                            if (!date) {
                                                return;
                                            }
                                            date = fixBeforeAfterDateField(
                                                date,
                                                true
                                            );
                                            setDateRange({
                                                isCustom: false,
                                                isBefore: true,
                                                date: new Date(date),
                                                dateString,
                                            });
                                        }}
                                        format="DD/MM/YY"
                                        suffixIcon={<CalendarSvg />}
                                        value={""}
                                    />
                                </Collapse.Panel>
                                <Collapse.Panel header="After" key="2">
                                    <DatePicker
                                        maxDate={new Date()}
                                        onChange={(date, dateString) => {
                                            if (!date) {
                                                return;
                                            }
                                            date = fixBeforeAfterDateField(
                                                date,
                                                false
                                            );
                                            setDateRange({
                                                isCustom: false,
                                                isBefore: false,
                                                date: new Date(date),
                                                dateString,
                                            });
                                        }}
                                        format="DD/MM/YY"
                                        suffixIcon={<CalendarSvg />}
                                        value={""}
                                    />
                                </Collapse.Panel>

                                <Collapse.Panel
                                    header="Rolling Date Range"
                                    key="4"
                                >
                                    {Object.keys(options || {})?.map(
                                        (date, idx) => {
                                            return options[date]
                                                .is_roling_date ? (
                                                <div
                                                    className="rolling_date_option"
                                                    key={idx}
                                                    onClick={() => {
                                                        setDateRange(date);
                                                    }}
                                                >
                                                    <Checkbox
                                                        className="flex alignCenter"
                                                        checked={
                                                            active === date
                                                        }
                                                    >
                                                        <div>
                                                            <div className="font12">
                                                                {
                                                                    options[
                                                                        date
                                                                    ]?.name
                                                                }
                                                            </div>
                                                            <div className="font10 dusty_gray_cl">
                                                                {
                                                                    options[
                                                                        date
                                                                    ].label
                                                                }
                                                            </div>
                                                        </div>
                                                    </Checkbox>
                                                </div>
                                            ) : null;
                                        }
                                    )}
                                </Collapse.Panel>
                            </Collapse>

                            {/* <div className="marginT10">
                        <Button
                            type="primary"
                            className="borderRadius6 capitalize width100p "
                        >
                            Apply
                        </Button>
                    </div> */}
                        </div>
                    </div>
                </div>
            )}
            <ReportCalendar
                handleRangeChange={(date) => {
                    setDateRange({ isCustom: true, date });
                }}
                showDatePicker={calendarVisible}
                setShowDatePicker={setCalendarVisible}
                filterDates={options}
            />
        </>
    );
};

export default RenderDateOptions;
