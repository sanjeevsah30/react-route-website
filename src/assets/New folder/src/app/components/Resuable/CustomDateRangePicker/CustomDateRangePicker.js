import { getLocaleDate } from "@tools/helpers";
import React, { useState } from "react";
import CalendarSvg from "app/static/svg/CalendarSvg";
import DatePicker from "react-calendar";
import TopbarConfig from "@constants/Topbar/index";
import PrevSvg from "app/static/svg/PrevSvg";
import NextSvg from "app/static/svg/NextSvg";
import "./style.scss";
import CloseSvg from "app/static/svg/CloseSvg";

function CustomDateRangePicker({ range, setRange, hideDatePicker }) {
    const [hide, setHide] = useState(hideDatePicker);
    return (
        <div>
            <div className="flex">
                <div
                    className="flex1 marginR18 curPoint"
                    onClick={() => hideDatePicker && setHide(false)}
                >
                    <div className="bold600 mine_shaft_cl">From Date</div>
                    <div className="date__container">
                        <CalendarSvg
                            style={{
                                color: "#999999",
                            }}
                            className="marginR14"
                        />

                        {range?.[0] ? (
                            <span className="bold600 dove_gray_cl">
                                {getLocaleDate(range[0])}
                            </span>
                        ) : (
                            <span className="placeholder">Select Date</span>
                        )}
                    </div>
                </div>
                <div
                    className="flex1 bold600 curPoint"
                    onClick={() => hideDatePicker && setHide(false)}
                >
                    <div className="bold600 mine_shaft_cl">To Date</div>
                    <div className="date__container">
                        <CalendarSvg
                            style={{
                                color: "#999999",
                            }}
                            className="marginR14"
                        />
                        {range?.[1] ? (
                            <span className="bold600 dove_gray_cl">
                                {getLocaleDate(range[1])}
                            </span>
                        ) : (
                            <span className="placeholder">Select Date</span>
                        )}
                    </div>
                </div>
            </div>
            <div
                className="flex alignCenter justifyCenter"
                style={
                    !hideDatePicker
                        ? {}
                        : {
                              position: "absolute",
                              zIndex: "1",
                              display: hide ? "none" : "flex",
                          }
                }
            >
                <DatePicker
                    onChange={(range) => setRange(range)}
                    className={"filter__calendar"}
                    selectRange={true}
                    maxDate={new Date()}
                    minDetail={TopbarConfig.MINCALDETAIL}
                    prevLabel={<PrevSvg />}
                    nextLabel={<NextSvg />}
                    value={range}
                />
            </div>
        </div>
    );
}

export default CustomDateRangePicker;
