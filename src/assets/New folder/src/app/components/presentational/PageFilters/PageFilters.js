import TopbarConfig from "@constants/Topbar/index";
import { HomeContext, MeetingTypeConst } from "@container/Home/Home";
import Icon from "@presentational/reusables/Icon";
import ReportCalendar from "@presentational/reusables/ReportCalendar";
import {
    changeActiveTeam,
    setActiveCallDuration,
    setActiveCallTags,
    setActiveFilterDate,
    setActiveRep,
    setActiveTemplateForFilters,
    setCustomFilterDuration,
    setFilterDates,
} from "@store/common/actions";
import { setActiveTemplate } from "@store/dashboard/dashboard";
import { flattenTeams, getLocaleDate } from "@tools/helpers";
import { fixBeforeAfterDateField, fixDateField } from "@tools/searchFactory";
import {
    Button,
    Checkbox,
    Col,
    Collapse,
    DatePicker,
    InputNumber,
    Popover,
    Row,
    Select,
} from "antd";
import React, { useEffect, useRef, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import CalendarSvg from "app/static/svg/CalendarSvg";
import ChevronDownSvg from "app/static/svg/ChevronDownSvg";
import ChevronUpSvg from "app/static/svg/ChevronUpSvg";
import CloseSvg from "app/static/svg/CloseSvg";
import MinusSvg from "app/static/svg/MinusSvg";
import PlusSvg from "app/static/svg/PlusSvg";
import SearchSvg from "app/static/svg/SearchSvg";

import MeetingsSvg from "app/static/svg/sidebar/MeetingsSvg";

import "./style.scss";
import { useLocation } from "react-router-dom";
import { CustomSelect } from "../../Resuable/index";
import ReactVirtualCard from "@presentational/reusables/ReactVirtualCard";

const { Panel } = Collapse;

const { Option } = Select;

function PageFilters({
    className,
    showTemplateSelection,
    hideDuration = false,
    hideTeamSelect = false,
    hideRepSelect = false,
    durationPlaceholder,
    hideAllRepsOption = false,
    hideReportSelect = true,
    getApplicableFilters = [
        "team_filter",
        "duration_filter",
        "owner_filter",
        "date_filter",
        "template_filter",
        "rep_filter",
    ],
    showTagsFilter,
    showChat,
    dateOptionPlaceholder = "Select created date",
}) {
    const {
        auth,
        common: {
            filterTeams,
            filterReps,
            filterCallDuration,
            filterDates,
            versionData,
            tags,
            activeCallTag,
        },
        dashboard: {
            templates_data: { templates, template_active },
        },
    } = useSelector((state) => state);
    const { meetingType, setMeetingType } = useContext(HomeContext);
    const dispatch = useDispatch();
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [showDateOptions, setShowDateOptions] = useState(false);
    const [showTeamOptions, setShowTeamOptions] = useState(false);
    const [showRepOptions, setShowRepOptions] = useState(false);

    const [min_duration, set_min_duration] = useState(0);
    const [max_duration, set_max_duration] = useState(null);
    const [teamSelection, setTeamSelection] = useState(filterTeams?.active);
    const [tagSelection, setTagSelection] = useState(activeCallTag);
    const [filterSearchTeams, setFilterSearchTeams] = useState(
        filterTeams.teams
    );
    const [filterSearchReps, setFilterSearchReps] = useState(filterReps.reps);
    const [repSelection, setRepSelection] = useState(filterReps?.active);
    const [showTagOptions, setShowTagOptions] = useState(false);

    const [teamToSearch, setTeamToSearch] = useState("");
    const [repToSearch, setRepToSearch] = useState("");
    const [tagToSearch, setTagToSearch] = useState("");

    const location = useLocation();

    const handleTeamSelection = (id, is_team, subteams, remove) => {
        if (is_team && !remove) {
            setTeamSelection(
                Array.from(new Set([...teamSelection, ...subteams]))
            );
            return;
        }
        if (is_team && remove) {
            setTeamSelection(
                teamSelection.filter((item) => !subteams.includes(item))
            );
            return;
        }

        if (id === 0) {
            setTeamSelection([]);
            dispatch(changeActiveTeam([]));
            return setShowTeamOptions(false);
        }
        if (teamSelection?.includes(id))
            return setTeamSelection((prev) => prev.filter((e) => e !== id));

        return setTeamSelection([...teamSelection, id]);
    };
    const handleTagSelection = (id) => {
        if (id === 0) {
            setTagSelection([]);
            dispatch(setActiveCallTags([]));
            return setShowTagOptions(false);
        }
        if (tagSelection?.includes(id))
            return setTagSelection((prev) => prev.filter((e) => e !== id));

        return setTagSelection([...tagSelection, id]);
    };

    useEffect(() => {
        // if (typeof filterReps.active === 'number')
        //     if (filterReps.active === 0)
        //         return setRepSelection([]);
        //     else
        //         return setRepSelection([filterReps.active]);
        setRepSelection(filterReps.active);
    }, [filterReps.active]);

    useEffect(() => {
        setActiveCallTags(activeCallTag);
    }, [activeCallTag]);

    useEffect(() => {
        // dispatch(changeActiveTeam([auth?.team]));
        // setTeamSelection([auth?.team]);
    }, [auth]);

    const duration_selector_id = "call__duration";
    const date_selector_id = "date__selector";
    const team_selector_id = "team__selector";
    const rep_selector_id = "rep_selector_id";
    const tag_selector_id = "tag_selector";

    const handleTeamOptionsClose = (e) => {
        if (e.target.closest(`#${team_selector_id}`)) {
            return;
        }
        if (e.target.closest(".team_selector_popover")) {
            return;
        }
        setShowTeamOptions(false);
    };

    const handleRepOptionsClose = (e) => {
        if (e.target.closest(`#${rep_selector_id}`)) {
            return;
        }
        if (e.target.closest(".rep_selector_popover")) {
            return;
        }
        setShowRepOptions(false);
    };

    const handleRepSelection = (id) => {
        if (repSelection.find((item) => item === id) === undefined)
            setRepSelection(Array.from(new Set([...repSelection, id])));
        else {
            setRepSelection((prev) => prev.filter((item) => item !== id));
        }
        if (id === 0) {
            setRepSelection([]);
            dispatch(setActiveRep([]));
            return setShowRepOptions(false);
        }
    };

    const handleDateOptionsClose = (e) => {
        if (e.target.closest(`#${date_selector_id}`)) {
            return;
        }
        if (e.target.closest(".date_selector_popover")) {
            return;
        }
        setShowDateOptions(false);
    };

    const handleTagOptionsClose = (e) => {
        if (e.target.closest(`#${tag_selector_id}`)) {
            return;
        }
        if (e.target.closest(".tag_selector_popover")) {
            return;
        }
        setShowTagOptions(false);
    };

    const handleClickEvent = (e) => {
        handleDateOptionsClose(e);
        handleTeamOptionsClose(e);
        handleTagOptionsClose(e);
        handleRepOptionsClose(e);
    };

    useEffect(() => {
        document.body.addEventListener("click", handleClickEvent);

        return () => {
            document.body.removeEventListener("click", handleClickEvent);
        };
    }, []);

    useEffect(() => {
        if (!showTeamOptions && teamToSearch) {
            setTeamToSearch("");
        }

        if (!showRepOptions && repToSearch) {
            setRepToSearch("");
        }
    }, [showTeamOptions, showRepOptions]);

    useEffect(() => {
        set_max_duration(
            filterCallDuration?.options?.[filterCallDuration.active]
                ?.value?.[1] || null
        );
        set_min_duration(
            filterCallDuration?.options?.[filterCallDuration.active]
                ?.value?.[0] || null
        );
    }, [filterCallDuration.active]);

    const handleDurationChange = (value) => {
        if (value === TopbarConfig.CUSTOMLABEL) {
            setShowDatePicker(true); // Show datepicker.
        } else {
            dispatch(setActiveFilterDate(value));
        }
    };

    const handleRangeChange = (newRange, label, afterDate) => {
        // Now adding the new values to the options for the dropdown menu for later use.
        let newOption = "";
        if (label) {
            newOption =
                label +
                " " +
                (label === "After"
                    ? getLocaleDate(afterDate)
                    : getLocaleDate(newRange[0]) || getLocaleDate(newRange[1]));
        } else
            newOption =
                getLocaleDate(newRange[0]) + " - " + getLocaleDate(newRange[1]);

        dispatch(
            setFilterDates({
                [newOption]: {
                    name: newOption,
                    dateRange: [
                        newRange[0]?.toString() || null,
                        newRange[1]?.toString() || null,
                    ],
                },
                ...filterDates.dates,
            })
        );

        dispatch(setActiveFilterDate(newOption));

        // Now that the use of the date picker is over. It's okay to hide it.
        setShowDatePicker(false);
    };

    const handleTemplateSelection = (team_ids) => {
        if (!team_ids.length) {
            return dispatch(
                setActiveTemplate(
                    template_active ||
                        templates?.filter(({ parameters, teams }) =>
                            parameters?.meeting_type
                                ? parameters?.meeting_type === meetingType
                                : parameters?.call_tags?.length !== 0 ||
                                  parameters?.call_types.length !== 0 ||
                                  teams.length
                        )?.[0]?.id ||
                        undefined
                )
            );
        }
        const getTemplatesOfTeam = templates
            ?.filter(({ parameters }) =>
                parameters?.meeting_type
                    ? parameters?.meeting_type === meetingType
                    : true
            )
            ?.filter(({ teams, parameters }) =>
                team_ids.length
                    ? teams.find(({ id }) => team_ids?.includes(id))
                        ? true
                        : (parameters?.call_tags?.length ||
                              parameters?.call_types?.length) &&
                          !teams.length
                    : true
            );
        if (getTemplatesOfTeam?.length) {
            dispatch(setActiveTemplate(getTemplatesOfTeam[0]?.id));
            return;
        }
        // showTemplateSelection &&
        dispatch(setActiveTemplate(null));
        dispatch(setActiveTemplateForFilters(null));
    };

    useEffect(() => {
        if (template_active)
            dispatch(setActiveTemplateForFilters(template_active));
    }, [template_active]);

    useEffect(() => {
        const url = new URLSearchParams(document.location.search);

        if (url.get("share_id")) return;
        if (!template_active) {
            if (versionData?.filters?.template) {
                dispatch(setActiveTemplate(versionData?.filters?.template));
            } else {
                handleTemplateSelection(filterTeams.active);
            }
        } else {
            handleTemplateSelection(filterTeams.active);
        }
        setFilterSearchTeams(filterTeams.teams);
    }, [filterTeams]);

    useEffect(() => {
        setFilterSearchReps(filterReps.reps);
    }, [filterReps]);

    useEffect(() => {
        setTeamSelection(filterTeams.active);
    }, [filterTeams.active]);

    const teamFilterHandler = (e) => {
        setTeamToSearch(e.target.value);
    };
    const repFilterHandler = (e) => {
        setRepToSearch(e.target.value);
    };

    const tagFilterHandler = (e) => {
        setTagToSearch(e.target.value);
    };

    const RenderDurationPopup = () => {
        return (
            <>
                <div className="font14 dove_gray_cl marginB20">
                    Select your Range
                </div>

                <div
                    className="filter__duration--tagContainer"
                    style={{
                        width: "520px",
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
                                dispatch(setActiveCallDuration(key));
                            }}
                        >
                            {filterCallDuration?.options?.[key]?.text}
                        </span>
                    ))}
                </div>

                <div className="space" />
                <p className="text-center font14 marginT20 marginB30 dove_gray_cl">
                    {durationPlaceholder ||
                        "or Select Minimum and Maximum Call Level Duration"}
                </p>

                <div className="flex justifyCenter duration_input_container">
                    <InputNumber
                        placeholder="Min"
                        className="duration_input"
                        onPressEnter={(e) => {
                            if (min_duration === null && max_duration === null)
                                return;
                            dispatch(
                                setCustomFilterDuration([
                                    min_duration,
                                    max_duration,
                                ])
                            );
                        }}
                        onChange={(value) => {
                            set_min_duration(value);
                        }}
                        value={min_duration}
                    />

                    <InputNumber
                        value={max_duration}
                        placeholder="Max"
                        className="duration_input"
                        onPressEnter={(e) => {
                            if (min_duration === null && max_duration === null)
                                return;
                            dispatch(
                                setCustomFilterDuration([
                                    min_duration,
                                    max_duration,
                                ])
                            );
                        }}
                        onChange={(value) => {
                            set_max_duration(value);
                            // setDurationSlider(value);
                        }}
                    />

                    <Button
                        type="primary"
                        className="footer_button borderRadius6"
                        onClick={() => {
                            dispatch(
                                setCustomFilterDuration([
                                    min_duration,
                                    max_duration,
                                ])
                            );
                        }}
                        disabled={
                            min_duration === null && max_duration === null
                        }
                    >
                        Go
                    </Button>
                </div>
            </>
        );
    };
    const calRef = useRef(null);

    const RenderRepOptions = () => {
        return (
            <div>
                <div
                    className="placeholder flex justifySpaceBetween"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    {/* <span>Select Reps</span> */}
                    <span className="flex alignCenter">
                        <SearchSvg />
                        <input
                            placeholder="Search"
                            onChange={repFilterHandler}
                            style={{
                                outline: "none",
                                border: "none",
                                width: "100%",
                            }}
                            className="marginL10"
                            value={repToSearch}
                        />
                    </span>

                    <span
                        className="curPoint"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowRepOptions(false);
                        }}
                    >
                        <CloseSvg
                            style={{
                                transform: "scale(0.8)",
                            }}
                        />
                    </span>
                </div>

                <div className="options_container paddingT10">
                    {filterSearchReps
                        .slice(Number(hideAllRepsOption))
                        .filter(
                            ({ team, id }) =>
                                id === 0 ||
                                !filterTeams.active[0] ||
                                filterTeams.active.includes(team)
                        )
                        ?.filter?.((rep) => {
                            return rep?.name
                                ?.toLowerCase()
                                ?.includes(repToSearch.toLowerCase())
                                ? true
                                : false;
                        })
                        .map((rep, idx) => (
                            <div
                                className="team_option paddingL10 paddingTB10 curPoint"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRepSelection(rep.id);
                                }}
                                key={idx}
                            >
                                <span className="capitalize flex">
                                    <Checkbox
                                        checked={
                                            rep.id === 0
                                                ? repSelection.length === 0
                                                    ? true
                                                    : false
                                                : repSelection?.includes(rep.id)
                                        }
                                        className="marginR9"
                                    />
                                    <span className="mine_shaft_cl ">
                                        {rep.name}
                                    </span>
                                </span>
                            </div>
                        ))}
                </div>
                <div className="footer paddingTB6 paddingLR16 flex justifySpaceBetween alignCenter">
                    <Button
                        onClick={() => {
                            dispatch(setActiveRep([]));
                        }}
                        type="text"
                        className="capitalize dusty_gray_cl"
                    >
                        Clear All
                    </Button>

                    <Button
                        onClick={() => {
                            if (
                                repSelection.length === 1 &&
                                location.pathname?.includes("home")
                            ) {
                                const teamId = filterReps?.reps?.find(
                                    (r) => r.id === repSelection[0]
                                )?.team;

                                if (teamId) {
                                    dispatch(changeActiveTeam([teamId]));
                                }
                                dispatch(setActiveRep(repSelection));
                                return;
                            }

                            dispatch(setActiveRep(repSelection));
                        }}
                        type="primary"
                        className="borderRadius5 capitalize"
                    >
                        Apply
                    </Button>
                </div>
            </div>
        );
    };

    const RenderDateOptions = (placeholder) => {
        return (
            <div>
                <div className="placeholder flex justifySpaceBetween">
                    <span>{placeholder}</span>
                    <span
                        className="curPoint"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDateOptions(false);
                        }}
                    >
                        <CloseSvg
                            style={{
                                transform: "scale(0.8)",
                            }}
                        />
                    </span>
                </div>

                <div className="options_container">
                    {Object.keys(filterDates?.dates || {})?.map((date, idx) => {
                        return !filterDates.dates[date].is_roling_date ? (
                            <div
                                key={idx}
                                className="option"
                                onClick={() => {
                                    handleDurationChange(date);
                                }}
                            >
                                <div
                                    className={`${
                                        filterDates.active === date
                                            ? "bold600"
                                            : ""
                                    }`}
                                >
                                    <div>{filterDates.dates[date]?.name}</div>

                                    <div className="font10 dusty_gray_cl">
                                        {filterDates.dates[date].label}
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
                            <Panel header="Before" key="1">
                                <DatePicker
                                    onChange={(date, dateString) => {
                                        if (!date) {
                                            return;
                                        }
                                        setShowDateOptions((prev) => !prev);
                                        handleRangeChange(
                                            [
                                                null,
                                                new Date(
                                                    fixBeforeAfterDateField(
                                                        date,
                                                        true
                                                    )
                                                ),
                                            ],
                                            "Before"
                                        );
                                    }}
                                    format="DD/MM/YY"
                                    suffixIcon={<CalendarSvg />}
                                    value={""}
                                />
                            </Panel>
                            <Panel header="After" key="2">
                                <DatePicker
                                    onChange={(date, dateString) => {
                                        if (!date) {
                                            return;
                                        }
                                        setShowDateOptions((prev) => !prev);
                                        handleRangeChange(
                                            [
                                                new Date(
                                                    fixBeforeAfterDateField(
                                                        date,
                                                        false
                                                    )
                                                ),
                                                null,
                                            ],
                                            "After",
                                            date
                                        );
                                    }}
                                    format="DD/MM/YY"
                                    suffixIcon={<CalendarSvg />}
                                    value={""}
                                />
                            </Panel>

                            <Panel header="Rolling Date Range" key="4">
                                {Object.keys(filterDates?.dates || {})?.map(
                                    (date, idx) => {
                                        return filterDates.dates[date]
                                            .is_roling_date ? (
                                            <div
                                                className="rolling_date_option"
                                                key={idx}
                                                onClick={() => {
                                                    handleDurationChange(date);
                                                    setShowDateOptions(false);
                                                }}
                                            >
                                                <Checkbox
                                                    className="flex alignCenter"
                                                    checked={
                                                        filterDates.active ===
                                                        date
                                                    }
                                                >
                                                    <div>
                                                        <div className="font12">
                                                            {
                                                                filterDates
                                                                    .dates[date]
                                                                    ?.name
                                                            }
                                                        </div>
                                                        <div className="font10 dusty_gray_cl">
                                                            {
                                                                filterDates
                                                                    .dates[date]
                                                                    .label
                                                            }
                                                        </div>
                                                    </div>
                                                </Checkbox>
                                            </div>
                                        ) : null;
                                    }
                                )}
                            </Panel>
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
        );
    };

    const RenderTeamOptions = () => {
        return (
            <div>
                <div
                    className="placeholder flex justifySpaceBetween"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <span className="flex alignCenter">
                        <SearchSvg />

                        <input
                            placeholder="Search"
                            onChange={teamFilterHandler}
                            style={{
                                outline: "none",
                                border: "none",
                                width: "100%",
                            }}
                            className="marginL10"
                            value={teamToSearch}
                        />
                    </span>
                    <span
                        className="curPoint"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowTeamOptions(false);
                        }}
                    >
                        <CloseSvg
                            style={{
                                transform: "scale(0.8)",
                            }}
                        />
                    </span>
                </div>

                <div className="options_container paddingT10">
                    {filterSearchTeams
                        .filter((team) => {
                            return true;
                        })
                        .filter((team) => {
                            return (
                                team.name
                                    .toLowerCase()
                                    .includes(teamToSearch.toLowerCase()) ||
                                (team?.subteams?.length
                                    ? team.subteams.some((subteam) =>
                                          subteam.name
                                              .toLowerCase()
                                              .includes(
                                                  teamToSearch.toLowerCase()
                                              )
                                      )
                                    : false)
                            );
                        })
                        ?.map((team, idx) => {
                            return team?.subteams?.length ? (
                                <TeamOption
                                    team={team}
                                    key={idx}
                                    teamSelection={teamSelection}
                                    handleTeamSelection={handleTeamSelection}
                                />
                            ) : (
                                <div
                                    className="team_option paddingL10 paddingTB10 curPoint"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTeamSelection(team.id);
                                    }}
                                    key={idx}
                                >
                                    <span className="capitalize">
                                        <Checkbox
                                            checked={
                                                team.id === 0
                                                    ? teamSelection.length === 0
                                                        ? true
                                                        : false
                                                    : teamSelection?.includes(
                                                          team.id
                                                      )
                                            }
                                            className="marginR9"
                                        />
                                        <span className="mine_shaft_cl ">
                                            {team.name}
                                        </span>
                                    </span>
                                </div>
                            );
                        })}
                </div>
                <div className="footer paddingTB6 paddingLR16 flex justifySpaceBetween alignCenter">
                    <Button
                        onClick={() => {
                            dispatch(changeActiveTeam([]));
                        }}
                        type="text"
                        className="capitalize dusty_gray_cl"
                    >
                        Clear All
                    </Button>

                    <Button
                        onClick={() => {
                            dispatch(changeActiveTeam(teamSelection));
                            dispatch(setActiveRep([]));
                            handleTemplateSelection(
                                teamSelection,
                                showTemplateSelection
                            );
                        }}
                        type="primary"
                        className="borderRadius5 capitalize"
                    >
                        Apply
                    </Button>
                </div>
            </div>
        );
    };

    const RenderCallTags = () => {
        return (
            <div>
                <div
                    className="placeholder flex justifySpaceBetween"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <span className="flex alignCenter">
                        <SearchSvg />
                        <input
                            placeholder="Select Tags"
                            onChange={tagFilterHandler}
                            style={{
                                outline: "none",
                                border: "none",
                                width: "100%",
                            }}
                            className="marginL10"
                            value={tagToSearch}
                        />
                    </span>
                    <span
                        className="curPoint"
                        onClick={(e) => {
                            setShowTagOptions(false);
                            setTagToSearch("");
                        }}
                    >
                        <CloseSvg
                            style={{
                                transform: "scale(0.8)",
                            }}
                        />
                    </span>
                </div>

                <ReactVirtualCard
                    data={[{ id: 0, tag_name: "All" }, ...tags]?.filter(
                        (tag) => {
                            return tag?.tag_name
                                ?.toLowerCase()
                                ?.includes(tagToSearch.toLowerCase())
                                ? true
                                : false;
                        }
                    )}
                    className="options_container paddingT10"
                    Component={(tag, id) => (
                        <div
                            className="team_option paddingL10 paddingTB10 curPoint"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleTagSelection(tag.id);
                            }}
                            key={id}
                        >
                            <span className="capitalize flex">
                                <Checkbox
                                    checked={
                                        tag.id === 0
                                            ? tagSelection.length === 0
                                                ? true
                                                : false
                                            : tagSelection?.includes(tag.id)
                                    }
                                    className="marginR9"
                                />
                                <span className="mine_shaft_cl flex1">
                                    {tag.tag_name}
                                </span>
                            </span>
                        </div>
                    )}
                />

                <div className="footer paddingTB6 paddingLR16 flex justifySpaceBetween alignCenter">
                    <Button
                        onClick={() => {
                            setTagSelection([]);
                            dispatch(setActiveCallTags([]));
                        }}
                        type="text"
                        className="capitalize dusty_gray_cl"
                    >
                        Clear All
                    </Button>

                    <Button
                        onClick={() => {
                            dispatch(setActiveCallTags([...tagSelection]));
                        }}
                        type="primary"
                        className="borderRadius5 capitalize"
                    >
                        Apply
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex alignCenter">
            {versionData?.has_chat && showChat && (
                <CustomSelect
                    data={[
                        { id: MeetingTypeConst.calls },
                        { id: MeetingTypeConst.chat },
                        { id: MeetingTypeConst.email },
                    ]}
                    option_name={"id"}
                    option_key={"id"}
                    select_placeholder={"Choose Meeting type"}
                    placeholder={"Choose Meeting type"}
                    style={{
                        height: "36px",
                        width: "128px",
                    }}
                    value={meetingType}
                    onChange={(value) => {
                        if (
                            value === MeetingTypeConst.chat ||
                            value === MeetingTypeConst.email
                        ) {
                            dispatch(setActiveCallDuration(0));
                        }
                        if (templates) {
                            const chatOrEmailOrCalltempList = templates.filter(
                                ({ parameters, teams }) =>
                                    parameters?.meeting_type
                                        ? parameters?.meeting_type === value
                                        : parameters?.call_tags?.length !== 0 ||
                                          parameters?.call_types.length !== 0 ||
                                          teams.length
                            );
                            if (chatOrEmailOrCalltempList?.[0])
                                dispatch(
                                    setActiveTemplate(
                                        chatOrEmailOrCalltempList?.[0]?.id
                                    )
                                );
                        }
                        setMeetingType(value);
                    }}
                    className={"custom__select marginR12"}
                    dropdownAlign={{ offset: [-90, 4] }}
                    showSearch={false}
                />
            )}

            <Row gutter={[12, 12]} className={"page__filters"}>
                {hideTeamSelect || (
                    <>
                        <Col className="flex alignCenter">
                            <div
                                id={team_selector_id}
                                onClick={() => {
                                    setShowTeamOptions((prev) => !prev);
                                }}
                                ref={calRef}
                            >
                                <Popover
                                    placement="bottomRight"
                                    overlayClassName="date_selector_popover team_selector_popover"
                                    content={RenderTeamOptions()}
                                    trigger="click"
                                    getPopupContainer={() => {
                                        return document.getElementById(
                                            team_selector_id
                                        );
                                    }}
                                    visible={
                                        !getApplicableFilters?.includes(
                                            "team_filter"
                                        )
                                            ? false
                                            : showTeamOptions
                                    }
                                >
                                    <Select
                                        className={
                                            "custom__select active_hover active_focus"
                                        }
                                        style={{
                                            width: "200px",
                                            borderRadius: "4px",
                                        }}
                                        dropdownClassName={"hide_dropdown"}
                                        suffixIcon={
                                            <Icon className="fas fa-chevron-down dove_gray_cl" />
                                        }
                                        disabled={
                                            !getApplicableFilters?.includes(
                                                "team_filter"
                                            )
                                        }
                                        // showSearch
                                        // onSearch={teamFilterHandler}
                                        value={
                                            filterTeams.active?.length === 0
                                                ? "All Teams"
                                                : filterTeams.active?.length ===
                                                  1
                                                ? flattenTeams(
                                                      filterTeams.teams
                                                  )?.find(
                                                      ({ id }) =>
                                                          id ===
                                                          filterTeams.active[0]
                                                  )?.name
                                                : `${filterTeams?.active?.length} teams`
                                        }
                                    ></Select>
                                </Popover>
                            </div>
                        </Col>
                    </>
                )}
                {hideRepSelect ||
                    (window.location.pathname.includes("coaching") ||
                    // window.location.pathname.includes("ci_dashboard") ||
                    window.location.pathname.includes("statistic") ? (
                        <Col
                            className="flex alignCenter"
                            onClick={() => setShowDateOptions(false)}
                        >
                            <Select
                                className="custom__select active_hover active_focus br4"
                                value={
                                    filterReps.loading
                                        ? "...Loading"
                                        : filterReps?.active.length === 0
                                        ? 0
                                        : filterReps?.active[0]
                                }
                                suffixIcon={
                                    <Icon className="fas fa-chevron-down dove_gray_cl" />
                                }
                                onChange={(val) => {
                                    if (val !== 0)
                                        dispatch(setActiveRep([val]));
                                    else dispatch(setActiveRep([]));
                                }}
                                disabled={
                                    !getApplicableFilters?.includes(
                                        "owner_filter"
                                    )
                                }
                                dropdownRender={(menu) => (
                                    <div>
                                        <span className={"topbar-label"}>
                                            Select Owner
                                        </span>
                                        {menu}
                                    </div>
                                )}
                                showSearch
                                optionFilterProp="children"
                                dropdownClassName={"account_select_dropdown"}
                                loading={filterReps.loading}
                            >
                                {filterReps.reps
                                    .slice(Number(hideAllRepsOption))
                                    .filter(
                                        ({ team, id }) =>
                                            id === 0 ||
                                            !filterTeams.active[0] ||
                                            filterTeams.active.includes(team)
                                    )
                                    .map((rep, idx) => (
                                        <Option value={rep.id} key={idx}>
                                            {rep.name}
                                        </Option>
                                    ))}
                            </Select>
                        </Col>
                    ) : (
                        <Col
                            className="flex alignCenter"
                            // onClick={() => setShowDateOptions(false)}
                        >
                            <div
                                id={rep_selector_id}
                                onClick={() =>
                                    setShowRepOptions((prev) => !prev)
                                }
                                ref={calRef}
                            >
                                <Popover
                                    placement="bottomRight"
                                    overlayClassName="date_selector_popover team_selector_popover"
                                    content={RenderRepOptions()}
                                    trigger="click"
                                    getPopupContainer={() => {
                                        return document.getElementById(
                                            rep_selector_id
                                        );
                                    }}
                                    visible={
                                        !getApplicableFilters?.includes(
                                            "owner_filter"
                                        )
                                            ? false
                                            : showRepOptions
                                    }
                                >
                                    <Select
                                        className={
                                            "custom__select active_hover active_focus"
                                        }
                                        style={{
                                            width: "200px",
                                            borderRadius: "4px",
                                        }}
                                        dropdownClassName={"hide_dropdown"}
                                        suffixIcon={
                                            <Icon className="fas fa-chevron-down dove_gray_cl curPoint" />
                                        }
                                        disabled={
                                            !getApplicableFilters?.includes(
                                                "owner_filter"
                                            )
                                        }
                                        // showSearch
                                        // onSearch={teamFilterHandler}
                                        value={
                                            filterReps.active.length === 0
                                                ? "All Reps"
                                                : filterReps.active?.length ===
                                                  1
                                                ? filterReps.reps?.find(
                                                      ({ id }) =>
                                                          id ===
                                                          filterReps.active[0]
                                                  )?.name
                                                : `${filterReps?.active?.length} reps`
                                        }
                                    ></Select>
                                </Popover>
                            </div>
                        </Col>
                    ))}

                {showTemplateSelection && (
                    <Col
                        className="flex alignCenter"
                        onClick={() => setShowDateOptions(false)}
                    >
                        <Select
                            value={template_active}
                            onChange={(value) => {
                                dispatch(setActiveTemplate(value));
                            }}
                            dropdownRender={(menu) => (
                                <div>
                                    <span className={"topbar-label"}>
                                        {"Select a template"}
                                    </span>
                                    {menu}
                                </div>
                            )}
                            disabled={
                                !getApplicableFilters?.includes(
                                    "template_filter"
                                )
                            }
                            className="custom__select active_hover active_focus br4"
                            suffixIcon={
                                <Icon className="fas fa-chevron-down dove_gray_cl" />
                            }
                            optionFilterProp="children"
                            dropdownClassName={"account_select_dropdown"}
                            placeholder="Select a template"
                        >
                            {templates
                                ?.filter(({ parameters }) =>
                                    parameters?.meeting_type
                                        ? parameters?.meeting_type ===
                                          meetingType
                                        : true
                                )
                                ?.filter(({ teams, parameters }) =>
                                    filterTeams.active.length === 0
                                        ? teams?.length === 0 &&
                                          parameters?.call_tags?.length === 0 &&
                                          parameters?.call_types.length === 0 &&
                                          parameters?.meeting_type === null
                                            ? false
                                            : true
                                        : teams?.find?.(({ id }) =>
                                              filterTeams?.active?.includes(id)
                                          ) ||
                                          ((parameters?.call_tags?.length ||
                                              parameters?.call_types?.length) &&
                                              !teams.length)
                                        ? true
                                        : false
                                )
                                .map(({ id, name }, idx) => (
                                    <Option value={id} key={idx}>
                                        {name}
                                    </Option>
                                ))}
                        </Select>
                    </Col>
                )}
                {hideDuration || (
                    <Col
                        className="flex alignCenter"
                        onClick={() => setShowDateOptions(false)}
                    >
                        {/* <SelectAccountCallDuration
                    className="custom__select"
                    dropdownClassName={'account_duration_select'}
                /> */}
                        <div
                            className="filter flex alignCenter"
                            id={duration_selector_id}
                        >
                            <Popover
                                placement="bottomRight"
                                overlayClassName="duration_selector_popover"
                                title={
                                    meetingType !== MeetingTypeConst.chat &&
                                    meetingType !== MeetingTypeConst.email &&
                                    getApplicableFilters?.includes(
                                        "duration_filter"
                                    ) && (
                                        <div className="paddingTB10 paddingLR6 dark_charcoal_cl flex alignCenter">
                                            <MeetingsSvg
                                                style={{
                                                    transform: "scasle(0.8)",
                                                }}
                                            />
                                            <span className="font16 marginL16 bold600 ">
                                                Duration Range
                                            </span>
                                        </div>
                                    )
                                }
                                content={
                                    ((location.pathname?.includes("calls") ||
                                        location.pathname?.includes("home") ||
                                        location.pathname?.includes(
                                            "ci_dashboard"
                                        )) &&
                                        meetingType ===
                                            MeetingTypeConst.chat) ||
                                    meetingType === MeetingTypeConst.email ||
                                    !getApplicableFilters?.includes(
                                        "duration_filter"
                                    )
                                        ? null
                                        : RenderDurationPopup()
                                }
                                trigger="click"
                                getPopupContainer={() => {
                                    return document.getElementById(
                                        duration_selector_id
                                    );
                                }}
                            >
                                <Select
                                    value={
                                        filterCallDuration?.options?.[
                                            filterCallDuration.active
                                        ]?.text
                                    }
                                    className={
                                        "custom__select active_hover active_focus br4"
                                    }
                                    dropdownClassName={"hide_dropdown"}
                                    suffixIcon={
                                        <Icon className="fas fa-chevron-down dove_gray_cl" />
                                    }
                                    disabled={
                                        ((location.pathname?.includes(
                                            "calls"
                                        ) ||
                                            location.pathname?.includes(
                                                "home"
                                            ) ||
                                            location.pathname?.includes(
                                                "ci_dashboard"
                                            )) &&
                                            (meetingType ===
                                                MeetingTypeConst.chat ||
                                                meetingType ===
                                                    MeetingTypeConst.email)) ||
                                        !getApplicableFilters?.includes(
                                            "duration_filter"
                                        )
                                    }
                                >
                                    {" "}
                                </Select>
                            </Popover>
                        </div>
                    </Col>
                )}

                <Col className="flex alignCenter">
                    <div
                        id={date_selector_id}
                        onClick={() => setShowDateOptions((prev) => !prev)}
                        ref={calRef}
                    >
                        <Popover
                            placement="bottomRight"
                            overlayClassName="date_selector_popover"
                            content={
                                getApplicableFilters?.includes("date_filter") &&
                                RenderDateOptions(dateOptionPlaceholder)
                            }
                            trigger="click"
                            getPopupContainer={() => {
                                return document.getElementById(
                                    date_selector_id
                                );
                            }}
                            visible={showDateOptions}
                        >
                            <Select
                                value={
                                    filterDates.dates[filterDates.active]?.name
                                }
                                className={
                                    "custom__select  active_hover active_focus br4"
                                }
                                style={{
                                    width: "200px",
                                }}
                                dropdownClassName={"hide_dropdown"}
                                suffixIcon={
                                    <Icon className="fas fa-chevron-down dove_gray_cl" />
                                }
                                disabled={
                                    !getApplicableFilters?.includes(
                                        "date_filter"
                                    )
                                }
                            ></Select>
                        </Popover>
                    </div>
                    <ReportCalendar
                        handleRangeChange={handleRangeChange}
                        showDatePicker={showDatePicker}
                        setShowDatePicker={setShowDatePicker}
                        filterDates={filterDates}
                    />
                </Col>
                {showTagsFilter ? (
                    <>
                        <Col className="flex alignCenter">
                            <div
                                id={tag_selector_id}
                                onClick={() => {
                                    setShowTagOptions((prev) => !prev);
                                    if (tagToSearch) setTagToSearch("");
                                }}
                                ref={calRef}
                            >
                                <Popover
                                    placement="bottomRight"
                                    overlayClassName={`date_selector_popover team_selector_popover ${
                                        showTagOptions ? "" : "visibile_hidden"
                                    }`}
                                    content={RenderCallTags()}
                                    trigger="click"
                                    getPopupContainer={() => {
                                        return document.getElementById(
                                            tag_selector_id
                                        );
                                    }}
                                    open={true}
                                    style={{
                                        visibility: "hidden",
                                    }}
                                >
                                    <Select
                                        className={
                                            "custom__select active_hover active_focus"
                                        }
                                        style={{
                                            width: "200px",
                                            borderRadius: "4px",
                                        }}
                                        dropdownClassName={"hide_dropdown"}
                                        suffixIcon={
                                            <Icon className="fas fa-chevron-down dove_gray_cl" />
                                        }
                                        value={
                                            activeCallTag?.length === 0
                                                ? "All Tags"
                                                : activeCallTag?.length === 1
                                                ? tags?.find(
                                                      ({ id }) =>
                                                          id ===
                                                          activeCallTag[0]
                                                  )?.tag_name
                                                : `${activeCallTag?.length} tags`
                                        }
                                    ></Select>
                                </Popover>
                            </div>
                        </Col>
                    </>
                ) : (
                    <></>
                )}
            </Row>
        </div>
    );
}

const TeamOption = ({ team, handleTeamSelection, teamSelection }) => {
    const subteams_ids = team?.subteams?.map(({ id }) => id);

    const entire_team_selected = subteams_ids.every((val) =>
        teamSelection.includes(val)
    );
    return (
        <div className="team_option" onClick={(e) => e.stopPropagation()}>
            <Collapse
                expandIconPosition={"right"}
                bordered={false}
                expandIcon={({ isActive }) =>
                    isActive ? <ChevronUpSvg /> : <ChevronDownSvg />
                }
                accordion={true}
                defaultActiveKey={team.id}
            >
                <Panel
                    header={
                        <span
                            className="capitalize"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleTeamSelection(
                                    team.id,
                                    true,
                                    subteams_ids,
                                    entire_team_selected
                                );
                            }}
                        >
                            <Checkbox
                                checked={entire_team_selected}
                                className="marginR9"
                            />
                            <span className="mine_shaft_cl ">{team.name}</span>
                        </span>
                    }
                    key={team.id}
                >
                    {team?.subteams?.map(({ name, id }) => (
                        <div
                            key={id}
                            className="paddingL16 marginB10 curPoint"
                            onClick={(e) => {
                                handleTeamSelection(id);
                            }}
                        >
                            <Checkbox
                                checked={teamSelection?.includes(id)}
                                className="marginR9"
                            />
                            <span className="font12 dove_gray_cl">{name}</span>
                        </div>
                    ))}
                </Panel>
            </Collapse>
        </div>
    );
};

PageFilters.defaultProps = {
    className: "",
    showTemplateSelection: false,
    hideDuration: false,
};

export default React.memo(PageFilters, (prev, next) => false);
