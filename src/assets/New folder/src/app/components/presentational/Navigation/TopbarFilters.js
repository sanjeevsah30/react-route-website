import React, { useRef, useEffect, useState } from "react";
import DatePicker from "react-calendar";
import TopbarConfig from "@constants/Topbar/index";
import { Button, InputNumber, Popover, Select, Slider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { DownOutlined } from "@ant-design/icons";
import {
    changeActiveTeam,
    setActiveCallDuration,
    setActiveFilterDate,
    setActiveRep,
    setFilterDates,
    setCustomFilterDuration,
} from "@store/common/actions";
import { getLocaleDate, uid } from "@tools/helpers";
import sidebarConfig from "@constants/Sidebar/index";

const { Option } = Select;
export default function TopbarFilters(props) {
    const calRef = useRef(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const filterTeams = useSelector((state) => state.common.filterTeams);
    const filterReps = useSelector((state) => state.common.filterReps);

    const filterCallDuration = useSelector(
        (state) => state.common.filterCallDuration
    );
    const filterDates = useSelector((state) => state.common.filterDates);
    const { isAccountLevel } = useSelector(({ callAudit }) => callAudit);

    const { team } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [durationSlider, setDurationSlider] = useState(
        filterCallDuration.active !== "0" && filterCallDuration.active !== "1"
            ? filterCallDuration?.options?.[filterCallDuration.active]?.value[0]
            : null
    );

    useEffect(() => {
        setDurationSlider(
            filterCallDuration.active !== "0" &&
                filterCallDuration.active !== "1"
                ? filterCallDuration?.options?.[filterCallDuration.active]
                      ?.value[0]
                : null
        );
    }, [filterCallDuration.active]);

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
            calRef.current &&
            !calRef.current.contains(event.target) &&
            showDatePicker
        )
            hideDatePicker();
    };

    const hideDatePicker = () => setShowDatePicker(false);

    useEffect(() => {
        document.addEventListener("click", checkToClose);
        return () => {
            document.removeEventListener("click", checkToClose);
        };
    }, [showDatePicker]);

    const handleDurationChange = (value) => {
        if (value === TopbarConfig.CUSTOMLABEL) {
            setShowDatePicker(true); // Show datepicker.
        } else {
            dispatch(setActiveFilterDate(value));
            props.handleDrawer(false);
        }
    };

    const handleRangeChange = (newRange) => {
        // Now adding the new values to the options for the dropdown menu for later use.
        let newOption =
            getLocaleDate(newRange[0]) + " - " + getLocaleDate(newRange[1]);

        dispatch(
            setFilterDates({
                [newOption]: {
                    name: newOption,
                    dateRange: newRange,
                },
                ...filterDates.dates,
            })
        );

        dispatch(setActiveFilterDate(newOption));

        // Now that the use of the date picker is over. It's okay to hide it.
        setShowDatePicker(false);
        props.handleDrawer(false);
    };

    /*This is to set the team of the loged in user as soon as this component is moutes
        .This runs only once as the reference to the teams depencdency will not change*/
    useEffect(() => {
        if (
            props.activePageConfig.title ===
            sidebarConfig.AI_AUDIT_DASHBOARD_TITLE
        ) {
            return;
        }
        // const findIndex = filterTeams?.teams
        //     .map((team) => Object.keys(team)[0])
        //     .findIndex((key) => +key === team);
        // if (findIndex !== -1) {
        //     dispatch(changeActiveTeam(findIndex, true));
        // }
    }, [filterTeams?.teams]);

    const renderDurationPopup = () => {
        return (
            <>
                <div
                    className="filter__duration--tagContainer"
                    style={{
                        width: "400px",
                    }}
                >
                    {Object.keys(filterCallDuration.options).map((key) => (
                        <span
                            className={`filter__duration--tag ${
                                key === filterCallDuration.active ||
                                +key === +filterCallDuration.active
                                    ? "active"
                                    : ""
                            }`}
                            key={key}
                            onClick={() => {
                                setDurationSlider(
                                    filterCallDuration?.options?.[key]?.value
                                );
                                dispatch(setActiveCallDuration(key));
                            }}
                        >
                            {filterCallDuration?.options?.[key]?.text}
                        </span>
                    ))}
                </div>
                <p className="text-center font12  paddingT10">
                    {isAccountLevel &&
                    props.activePageConfig.title ===
                        sidebarConfig.AI_AUDIT_DASHBOARD_TITLE
                        ? "   OR ENTER MINIMUM ACCOUNT LEVEL TALK TIME"
                        : "OR SELECT MINIMUM CALL LEVEL DURATION"}
                </p>
                <div className="flex justifyCenter">
                    <InputNumber
                        style={{
                            width: "40%",
                            fontWeight: "600",
                        }}
                        className="borderRadius6 marginR5"
                        onPressEnter={(e) => {
                            setDurationSlider(e.target.value || 5);

                            dispatch(
                                setCustomFilterDuration([
                                    e.target.value || 5,
                                    null,
                                ])
                            );
                        }}
                        onChange={(value) => {
                            setDurationSlider(value);
                        }}
                        min={0}
                        value={durationSlider}
                    />
                    <Button
                        type="primary"
                        className="footer_button"
                        onClick={() => {
                            dispatch(
                                setCustomFilterDuration([
                                    durationSlider || 5,
                                    null,
                                ])
                            );
                        }}
                    >
                        Go
                    </Button>
                </div>
                {/* <Slider
                    range
                    max={120}
                    className="filter__duration--slider"
                    value={durationSlider}
                    onChange={(value) => setDurationSlider(value)}
                    onAfterChange={(values) =>
                        dispatch(setCustomFilterDuration(values))
                    }
                /> */}
            </>
        );
    };

    return (
        <>
            <div className="filter">
                <Select
                    value={filterTeams.active}
                    onChange={(value) => {
                        dispatch(changeActiveTeam([value]));
                        props.handleDrawer(false);
                    }}
                    dropdownRender={(menu) => (
                        <div>
                            <span className={"topbar-label"}>
                                {TopbarConfig.TEAMLABEL}
                            </span>
                            {menu}
                        </div>
                    )}
                    showSearch
                    optionFilterProp="children"
                >
                    {filterTeams.teams.map((team, idx) => (
                        <Option value={team.id} key={team.id}>
                            {team.name}
                        </Option>
                    ))}
                </Select>
            </div>
            {/* Reps Filter */}

            <div className="filter">
                <Select
                    value={filterReps.active[0]}
                    onChange={(value) => {
                        dispatch(setActiveRep([value]));
                        props.handleDrawer(false);
                    }}
                    dropdownRender={(menu) => (
                        <div>
                            <span className={"topbar-label"}>
                                {TopbarConfig.REPSLABEL}
                            </span>
                            {menu}
                        </div>
                    )}
                    showSearch
                    optionFilterProp="children"
                >
                    {filterReps.reps.map((rep, idx) => (
                        <Option value={rep.id} key={idx}>
                            {rep.name}
                        </Option>
                    ))}
                </Select>
            </div>

            <div className="filter" id="filter__callDuration">
                {/* <span className={'topbar-label'}>{TopbarConfig.CALLLABEL}</span> */}
                <Popover
                    className="filter__duration--popup"
                    placement="bottomRight"
                    title={"Select duration range"}
                    content={renderDurationPopup()}
                    trigger="click"
                    getPopupContainer={() => {
                        if (window.innerWidth > 560) {
                            return document.getElementById(
                                "filter__callDuration"
                            );
                        } else {
                            return document.body;
                        }
                    }}
                >
                    <div className="filter__duration">
                        <span className="bold uppercase font12 truncate">
                            {
                                filterCallDuration?.options?.[
                                    filterCallDuration.active
                                ]?.text
                            }
                        </span>
                        <span
                            className="ant-select-arrow"
                            unselectable="on"
                            aria-hidden="true"
                        >
                            <DownOutlined />
                        </span>
                    </div>
                </Popover>
            </div>

            <div className="filter" id="filter_date" ref={calRef}>
                {/* <span className={'topbar-label'}>{TopbarConfig.DATELABEL}</span> */}
                <Select
                    value={filterDates.active}
                    onChange={handleDurationChange}
                    dropdownRender={(menu) => (
                        <div>
                            <span className={"topbar-label"}>
                                {TopbarConfig.DATELABEL}
                            </span>
                            {menu}
                        </div>
                    )}
                    getPopupContainer={() => {
                        if (window.innerWidth > 560) {
                            return document.getElementById("filter_date");
                        } else {
                            return document.body;
                        }
                    }}
                >
                    {Object.keys(filterDates.dates).map((date, idx) => (
                        <Option value={date} key={date}>
                            {filterDates.dates[date].name}
                        </Option>
                    ))}
                </Select>
                <div className={"datepicker"}>
                    {showDatePicker ? (
                        <DatePicker
                            onChange={handleRangeChange}
                            className={"daterange topbar-filters-calendar"}
                            selectRange={true}
                            maxDate={new Date()}
                            minDetail={TopbarConfig.MINCALDETAIL}
                        />
                    ) : null}
                </div>
            </div>
        </>
    );
}
