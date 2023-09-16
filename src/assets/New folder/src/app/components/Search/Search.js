import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { clearFilters, getSalesTasks, getTopics } from "@store/common/actions";
import * as searchActions from "@store/search/actions";
import useInfiniteScroll from "hooks/useInfinteScroll";
import config from "@constants/Search/index";
import { capitalizeFirstLetter, flattenTeams, uid } from "@helpers";
import { Spinner } from "@reusables";
import TopbarConfig from "@constants/Topbar/index";
import SearchCalls from "./SearchCalls";
import SearchSidebar from "./SearchSidebar";
import Trackers from "./Trackers";
import "./search.scss";
import { Button, Checkbox, Drawer, Input, Modal } from "antd";
import { isEqual } from "lodash";

import {
    getSearchAuditTemplateRequest,
    storeSearchAuditTemplate,
} from "@store/call_audit/actions";

import CloseSvg from "app/static/svg/CloseSvg";
import TrackerModal from "./TrackerModal";
import { prepareSearchData } from "@store/search/utils";
import { SearchContext } from "../MyMeetings/MyMeetings";
import { HomeContext } from "@container/Home/Home";
import {
    getCallList,
    getNextCallList,
} from "@store/callListSlice/callListSlice";
import { useGetLeadScoreConfigQuery } from "@convin/redux/services/settings/scoreSense.service";

function Search({
    isCallActive,
    history,
    location,
    setCall,
    sharerHandler,
    showTrackersUI,
    drawerState,
    setDrawerState,
    drawerAction,
    newTrackerModal,
    setnewTrackerModal,
    clearSearch,
    updateTopbarFilters,
}) {
    const dispatch = useDispatch();

    const { setShowUpdateView, showUpdateView } = useContext(SearchContext);

    const {
        common: {
            salesTasks,
            showLoader: loading,
            tags: allTags,
            topics: allTopics,
            filterAuditTemplates: { active: templateActive },
            call_types: allTypes,
            filterTeams,
            filterReps,
            filterDates,
            filterCallDuration,
            users,
        },
        search: {
            fields,
            searchFilters,
            defaultView,
            activeFilters,
            views,
            defaultSearchFilters,
            samplingRules,
            activeSamplingRule,
        },
        accounts: { filters },
        callAudit: { searchAuditTemplate },
        callListSlice: { calls, next_url: nextUrl, fetchingCalls: isFetching },
    } = useSelector((state) => state);

    const { fromFiltersPage } = searchAuditTemplate;

    const [defaultActiveFilter, setdefaultActiveFilter] = useState(["client"]);

    // Check if user has searched
    const [isSearchActive, setisSearchActive] = useState(false);

    // saved filters data for lazy loading: used by handleLoadMore
    const [filtersData, setfiltersData] = useState({});

    const [activeCallIndex, setactiveCallIndex] = useState(-1);

    const [disableCreateAlert, setDisableCreateAlert] = useState(false);

    const [isDefaultView, setIsDefaultView] = useState(false);
    const [viewName, setViewName] = useState("");
    const [viewIdToUpdate, setViewIdToUpdate] = useState(null);
    const [clearClicked, setClearCliked] = useState(false);

    const { fetchingShare, meetingType } = useContext(HomeContext);

    useEffect(() => {
        if (
            drawerState.showFilters ||
            drawerState.showUpcommingCalls ||
            defaultView === null ||
            fetchingShare
        ) {
            return;
        }
        let api = handleSearch();
        dispatch(
            searchActions.setActiveSearchFilters([
                ...getPageFilters(),
                ...createActiveFilters(),
            ])
        );

        return () => {
            api && api?.abort?.();
        };
    }, [
        searchFilters,
        filterReps.active,
        filterTeams.active,
        filterCallDuration.active,
        filterDates.active,
        fetchingShare,
        meetingType,
    ]);

    useEffect(() => {
        let api;
        if (drawerState.showFilters && (isFetching || loading)) {
            api = handleSearch();
        }
        return () => {
            api && api?.abort();
        };
    }, [drawerState.showFilters]);

    useEffect(() => {
        let api;
        if (activeSamplingRule) {
            api = handleSearch();
        }
        return () => {
            api && api?.abort();
        };
    }, [activeSamplingRule]);

    useEffect(() => {
        if (clearClicked) {
            handleSearch();
            dispatch(
                searchActions.setActiveSearchFilters([
                    ...getPageFilters(),
                    ...createActiveFilters(),
                ])
            );
            setClearCliked(false);
            return;
        }
    }, [clearClicked]);

    useEffect(() => {
        if (!allTopics.length) {
            dispatch(getTopics());
        }
        if (!salesTasks.length) {
            dispatch(getSalesTasks({}));
        }
        if (!samplingRules.length) {
            dispatch(searchActions.getSamplingRules());
        }

        return () => {
            dispatch(searchActions.storeFields({}));
        };
    }, []);

    // Handle sidenav filter value changes

    const callHandlers = {
        activateCall: (index) => {
            if (index >= 0) {
                setactiveCallIndex(index);
            }
        },

        handleLoadMore: (scrolling) => {
            // dispatch(
            //     searchActions.getNextCalls(fields, prepareData(), scrolling)
            // );

            dispatch(
                getNextCallList({
                    fields,
                    searchData: prepareData(),
                    scrolling: true,
                    next: nextUrl,
                    doEncode: true,
                })
            );
        },
    };
    useEffect(() => {
        if (fromFiltersPage) {
            setdefaultActiveFilter(["template"]);
            setisSearchActive(true);
            dispatch(
                storeSearchAuditTemplate({
                    ...searchAuditTemplate,
                    fromFiltersPage: false,
                })
            );
        }
    }, [calls]);

    const handleSearch = (searchData, gKeyword) => {
        // return dispatch(searchActions.searchCalls(fields, prepareData(), true));
        return dispatch(
            getCallList({
                fields,
                searchData: prepareData(),
                doEncode: true,
            })
        );
    };

    useEffect(() => {
        if (defaultView !== 0) {
            const view = views?.find(({ id }) => id === +defaultView);

            if (view?.json_filters) {
                const json_filters = [...view?.json_filters];
                json_filters?.pop();

                if (
                    isEqual(json_filters, prepareSearchData({}, prepareData()))
                ) {
                    setShowUpdateView(true);
                } else {
                    setShowUpdateView(false);
                }
            }
        }
    }, [activeFilters, defaultView]);

    useEffect(() => {
        if (defaultView && showUpdateView) {
            const view = views?.find(({ id }) => id === +defaultView);
            if (view) {
                setViewName(view.name);
                setIsDefaultView(view.is_default);
                setViewIdToUpdate(view.id);
            }
        } else {
            setViewName("");
            setIsDefaultView(false);
            setViewIdToUpdate(null);
        }
    }, [showUpdateView]);

    const prepareData = (flag = true) => {
        let data = {
            client: searchFilters?.client?.value,
            searchKeywords: {
                keywords: searchFilters?.keywords,
                isInCall: searchFilters?.keyword_present_in_call,
                saidByOwner: searchFilters?.keyword_said_by_rep,
                saidByClient: searchFilters?.keyword_said_by_others,
            },
            filterTags: searchFilters?.call_tags,
            questions: {
                byOwner: searchFilters?.no_of_questions_by_rep,
                byClient: searchFilters?.no_of_questions_by_others,
            },
            topics: {
                topic: searchFilters?.topic,
                inCall: searchFilters?.topic_in_call,
            },
            interactivity: searchFilters?.interactivity,
            callType: searchFilters?.call_types,
            callDuration:
                filterCallDuration.options[filterCallDuration.active].value,
            activeReps: filterReps.active,
            activeTeam: filterTeams.active,
            activeDateRange: filterDates.dates[filterDates.active].dateRange,
            conferenceMedium: searchFilters?.recording_medium,
            processingStatus: searchFilters?.processing_status,
            auditQuestions: searchFilters?.activeQuestions,
            template: searchFilters?.template,
            audit_filter: searchFilters.audit_filter,
            min_aiscore: searchFilters.min_aiscore,
            max_aiscore: searchFilters.max_aiscore,
            stage: searchFilters.stage,
            sortKey: searchFilters.sortKey,
            meetingType,
            versionData,
            min_patience: searchFilters.min_patience,
            max_patience: searchFilters.max_patience,
            max_interruption_count: searchFilters.max_interruption_count,
            min_interruption_count: searchFilters.min_interruption_count,
            min_talktime: searchFilters?.min_talktime,
            max_talktime: searchFilters?.max_talktime,
            lead_config: {
                ...searchFilters.lead_config,
            },
            audit_feedback_status: searchFilters.audit_feedback_status,
        };
        flag && setfiltersData(data);
        return data;
    };

    useEffect(() => {
        if (drawerState.showFilters && templateActive)
            dispatch(getSearchAuditTemplateRequest(templateActive));

        return () => {};
    }, [templateActive, drawerState.showFilters]);

    const searchInfiniteRef = useInfiniteScroll({
        loading: loading || isFetching,
        hasNextPage: isCallActive ? false : !!nextUrl,
        onLoadMore: callHandlers.handleLoadMore,
        scrollContainerSelector: "#searchCallsContainer",
        contentEndSelector: "#content-end",
    });

    const SearchFilterFooter = () => (
        <div className="filter_footer">
            <Button
                className="footer_button clear__button"
                onClick={() => {
                    // setDrawerState({
                    //     type: drawerAction.CLOSE_FILTERS,
                    // });
                    dispatch(searchActions.clearSearchFilters());
                    dispatch(clearFilters());
                    dispatch(searchActions.setActiveSearchView(0));
                    setClearCliked(true);
                    // clearSearch();
                }}
            >
                Clear
            </Button>
            <Button
                type="primary"
                className="footer_button"
                onClick={() => {
                    handleSearch();
                    dispatch(
                        searchActions.setActiveSearchFilters([
                            ...getPageFilters(),
                            ...createActiveFilters(),
                        ])
                    );
                    setDrawerState({
                        type: drawerAction.CLOSE_FILTERS,
                    });
                }}
            >
                Apply Filter
            </Button>
        </div>
    );

    useEffect(() => {
        if (activeFilters.length) {
            dispatch(
                searchActions.setActiveSearchFilters([
                    ...getPageFilters(),
                    ...createActiveFilters(),
                ])
            );
        }
    }, [filterReps.reps, filterTeams.teams, users]);

    useEffect(() => {
        if (defaultView === 0) {
            setShowUpdateView(false);
            setViewName("");
            setIsDefaultView(false);
        }
    }, [defaultView]);

    const getPageFilters = useCallback(() => {
        const { FILTER_CONSTANTS: CONSTANTS } = config;

        const data = [];
        if (filterDates.active !== "last30days") {
            data.push({
                id: uid(),
                type: CONSTANTS.DATE,
                name: filterDates?.dates[filterDates?.active]?.name,
            });
        }
        if (filterTeams.active.length) {
            const teams = flattenTeams(filterTeams.teams);
            filterTeams.active.forEach((id) =>
                data.push({
                    id: `team.${id}`,
                    type: CONSTANTS.TEAM,
                    name: teams?.find((team) => team.id === id)?.name,
                })
            );
        }
        // if (+filterReps.active) {
        //     data.push({
        //         id: uid(),
        //         type: CONSTANTS.OWNER,
        //         name: capitalizeFirstLetter(
        //             filterReps?.reps?.find?.(
        //                 ({ id }) => id === +filterReps.active
        //             )?.name
        //         ),
        //     });
        // }

        if (!!filterReps.active.length) {
            filterReps.active.forEach((id) => {
                data.push({
                    id: `rep.${id}`,
                    type: "Owner",
                    name: filterReps?.reps?.find((rep) => rep?.id === id)?.name,
                });
            });
        }

        if (
            +filterCallDuration.active !== Number(TopbarConfig.defaultDuration)
        ) {
            data.push({
                id: uid(),
                type: CONSTANTS.DURATION,
                name: filterCallDuration?.options?.[filterCallDuration.active]
                    ?.text,
            });
        }

        return data;
    }, [
        filterDates.active,
        filterTeams,
        filterReps,
        filterCallDuration.active,
    ]);

    const createActiveFilters = useCallback(() => {
        const { FILTER_CONSTANTS: CONSTANTS } = config;
        const {
            client,
            call_tags,
            keywords,
            keyword_present_in_call,
            keyword_said_by_rep,
            keyword_said_by_others,
            no_of_questions_by_rep,
            no_of_questions_by_others,
            topic,
            topic_in_call,
            interactivity: {
                clientLongestMonologue,
                clientTalkRatio,
                interactivity,
                ownerLongestMonologue,
                ownerTalkRatio,
            },
            recording_medium,
            processing_status,
            call_types,
            activeQuestions,
            audit_filter,
            min_aiscore,
            max_aiscore,
            stage,
            max_patience,
            min_patience,
            max_interruption_count,
            min_interruption_count,
            min_talktime,
            max_talktime,
            audit_feedback_status,
        } = searchFilters;
        const data = [];

        if (client?.key) {
            data.push({
                id: "client." + client.key,
                type: CONSTANTS.CLIENT,
                name: capitalizeFirstLetter(client.label),
            });
        }
        if (call_tags?.length) {
            for (let tagId of call_tags) {
                let name = capitalizeFirstLetter(
                    allTags.find(({ id }) => tagId === id)?.tag_name || ""
                );
                data.push({
                    id: "tag." + tagId,
                    type: CONSTANTS.CALL_TAG,
                    name,
                });
            }
        }
        if (keywords?.length) {
            for (let word of keywords) {
                data.push({
                    id: "keyword." + word,
                    type: CONSTANTS.KEYWORDS,
                    name: capitalizeFirstLetter(word),
                });
            }
        }
        if (keyword_present_in_call === false) {
            data.push({
                id: uid(),
                type: CONSTANTS.WORD_IN_CALL,
                name: "No",
            });
        }
        if (keyword_said_by_rep) {
            data.push({
                id: uid(),
                type: CONSTANTS.WORD_SAID_BY_REP,
                name: "Yes",
            });
        }
        if (keyword_said_by_others) {
            data.push({
                id: uid(),
                type: CONSTANTS.WORD_SAID_BY_OTHERS,
                name: "Yes",
            });
        }
        if (call_types) {
            call_types.forEach((item) => {
                let value = allTypes.find(({ id }) => id === item)?.type;
                if (value) {
                    data.push({
                        id: "callType." + item,
                        type: CONSTANTS.CALL_TYPE,
                        name: capitalizeFirstLetter(value),
                    });
                }
            });
        }
        if (
            (no_of_questions_by_rep?.[0] >= 0 &&
                no_of_questions_by_rep?.[1] < 100) ||
            (no_of_questions_by_rep?.[0] > 0 &&
                no_of_questions_by_rep?.[1] <= 100)
        ) {
            data.push({
                id: uid(),
                type: CONSTANTS.QUESTIONS_BY_REP,
                name:
                    no_of_questions_by_rep?.[0] +
                    "-" +
                    no_of_questions_by_rep?.[1],
            });
        }
        if (
            (no_of_questions_by_others?.[0] >= 0 &&
                no_of_questions_by_others?.[1] < 100) ||
            (no_of_questions_by_others?.[0] > 0 &&
                no_of_questions_by_others?.[1] <= 100)
        ) {
            data.push({
                id: uid(),
                type: CONSTANTS.QUESTIONS_BY_OTHERS,
                name:
                    no_of_questions_by_others?.[0] +
                    "-" +
                    no_of_questions_by_others?.[1],
            });
        }
        if (topic) {
            const value = allTopics?.find(({ id }) => id === topic);
            data.push({
                id: "topic." + topic,
                type: CONSTANTS.TOPIC,
                name: value.name,
            });
        }
        if (topic_in_call === false) {
            data.push({
                id: uid(),
                type: CONSTANTS.TOPIC_IN_CALL,
                name: "No",
            });
        }
        if (
            (clientLongestMonologue?.[0] >= 0 &&
                clientLongestMonologue?.[1] < 100) ||
            (clientLongestMonologue?.[0] > 0 &&
                clientLongestMonologue?.[1] <= 100)
        ) {
            data.push({
                id: uid(),
                type: CONSTANTS.CLINET_MONOLOGUE,
                name:
                    clientLongestMonologue?.[0] +
                    "-" +
                    clientLongestMonologue?.[1] +
                    " Mins",
            });
        }
        if (
            (clientTalkRatio?.[0] >= 0 && clientTalkRatio?.[1] < 100) ||
            (clientTalkRatio?.[0] > 0 && clientTalkRatio?.[1] <= 100)
        ) {
            data.push({
                id: uid(),
                type: CONSTANTS.CLIENT_TALK_RATIO,
                name: clientTalkRatio?.[0] + "-" + clientTalkRatio?.[1] + "%",
            });
        }
        if (
            (interactivity?.[0] >= -10 && interactivity?.[1] < 10) ||
            (interactivity?.[0] > 0 && interactivity?.[1] <= 10)
        ) {
            data.push({
                id: uid(),
                type: CONSTANTS.INTERACTIVITY,
                name: interactivity?.[0] + " To " + interactivity?.[1],
            });
        }
        if (
            (ownerLongestMonologue?.[0] >= 0 &&
                ownerLongestMonologue?.[1] < 100) ||
            (ownerLongestMonologue?.[0] > 0 &&
                ownerLongestMonologue?.[1] <= 100)
        ) {
            data.push({
                id: uid(),
                type: CONSTANTS.REP_MONOLOGUE,
                name:
                    ownerLongestMonologue?.[0] +
                    "-" +
                    ownerLongestMonologue?.[1] +
                    "Mins",
            });
        }
        if (
            (ownerTalkRatio?.[0] >= 0 && ownerTalkRatio?.[1] < 100) ||
            (ownerTalkRatio?.[0] > 0 && ownerTalkRatio?.[1] <= 100)
        ) {
            data.push({
                id: uid(),
                type: CONSTANTS.REP_TALK_RATIO,
                name: ownerTalkRatio?.[0] + "-" + ownerTalkRatio?.[1] + "%",
            });
        }
        if (
            ((min_patience !== null || max_patience !== null) &&
                min_patience >= 0 &&
                max_patience < 100) ||
            (min_patience > 0 && max_patience <= 100)
        ) {
            data.push({
                id: uid(),
                type: CONSTANTS.PATIENCE,
                name:
                    (min_patience || 0) +
                    (max_patience !== min_patience &&
                        "-" + (max_patience || 100)) +
                    " secs",
            });
        }
        if (
            min_interruption_count !== null ||
            max_interruption_count !== null
        ) {
            data.push({
                id: uid(),
                type: CONSTANTS.INTERRUPTION_COUNT,
                name:
                    (min_interruption_count || 0) +
                    (max_interruption_count ? " - " : "") +
                    (max_interruption_count || ""),
            });
        }
        if (recording_medium) {
            data.push({
                id: recording_medium,
                type: CONSTANTS.RECORDING_MEDIUM,
                name: capitalizeFirstLetter(recording_medium),
            });
        }

        if (processing_status !== defaultSearchFilters?.processing_status) {
            data.push({
                id: "ps." + processing_status ? processing_status : "All",
                type: CONSTANTS.PROCESSING_STATUS,
                name: processing_status || "All",
            });
        }

        if (typeof min_aiscore === "number") {
            data.push({
                id: uid(),
                type: CONSTANTS.MIN_AI_SCORE,
                name: min_aiscore + "%",
            });
        }

        if (typeof max_aiscore === "number") {
            data.push({
                id: uid(),
                type: CONSTANTS.MAX_AI_SCORE,
                name: max_aiscore + "%",
            });
        }

        const question_ids = Object.keys(activeQuestions);

        for (let id of question_ids) {
            data.push({
                id: "question." + id,
                type: CONSTANTS.CALL_SCORING,
                name:
                    id === "0"
                        ? activeQuestions[id].checked === -1
                            ? "Need Attention"
                            : activeQuestions[id].checked === 0
                            ? "Average"
                            : "Good"
                        : activeQuestions[id]?.question_text,
            });
        }
        if (audit_filter.audit_type) {
            data.push({
                id: uid(),
                type: CONSTANTS.AUDIT_TYPE,
                name: audit_filter.audit_type,
            });
        }
        if (
            audit_filter?.manualAuditDateRange?.[0] &&
            audit_filter?.manualAuditDateRange?.[1]
        ) {
            data.push({
                id: uid(),
                type: CONSTANTS.AUDITED_DATE,
                name: `${new Date(
                    audit_filter?.manualAuditDateRange[0]
                ).toLocaleDateString()} - ${new Date(
                    audit_filter?.manualAuditDateRange?.[1]
                ).toLocaleDateString()}`,
            });
        }
        if (audit_filter.auditors.length) {
            for (let id of audit_filter.auditors) {
                data.push({
                    id: `auditor.${id}`,
                    type: CONSTANTS.AUDITOR,
                    name:
                        id === 0
                            ? "All"
                            : id === -1
                            ? "None"
                            : users?.find((user) => user.id === id)?.first_name,
                });
            }
        }
        if (stage) {
            data.push({
                id: uid(),
                type: "Stage",
                name: filters.stage.find(({ id }) => stage === id)?.stage,
            });
        }

        if (typeof min_talktime === "number") {
            data.push({
                id: uid(),
                type: CONSTANTS.MIN_TALKTIME,
                name: min_talktime + " seconds",
            });
        }

        if (typeof max_talktime === "number") {
            data.push({
                id: uid(),
                type: CONSTANTS.MAX_TALKTIME,
                name: max_talktime + " seconds",
            });
        }

        if (Object.values(searchFilters.lead_config).includes(true)) {
            data.push({
                id: uid(),
                type: CONSTANTS.LEADCONFIG,
                name: searchFilters.lead_config.is_hot
                    ? "Hot"
                    : searchFilters.lead_config.is_warm
                    ? "Warm"
                    : "Cold",
            });
        }

        if (audit_feedback_status) {
            data.push({
                id: uid(),
                type: CONSTANTS.AUDIT_STATUS,
                name: audit_feedback_status.split("_").join(" "),
            });
        }
        return data;
    }, [searchFilters, users]);

    const {
        common: { versionData: stats_threshold },
    } = useSelector((state) => state);
    const {
        common: { versionData },
    } = useSelector((state) => state);

    const handleSaveView = () => {
        if (showUpdateView && viewIdToUpdate) {
            dispatch(
                searchActions.updateSearchView(viewIdToUpdate, {
                    name: viewName,
                    is_default: isDefaultView,
                })
            );
        } else
            dispatch(
                searchActions.createSearchView({
                    name: viewName,
                    is_default: isDefaultView,
                    json_filters: prepareSearchData(
                        {},
                        filtersData,
                        {
                            client: searchFilters.client
                                ? salesTasks.find(
                                      ({ id }) =>
                                          +searchFilters.client.value === id
                                  ) || {
                                      ...searchFilters.client,
                                      name: searchFilters.client.label,
                                      id: searchFilters.client.id,
                                  }
                                : null,
                            topics:
                                allTopics.find(
                                    ({ id }) => id === searchFilters.topic
                                ) || null,
                            tags: allTags.filter(({ id }) => {
                                for (let tag of searchFilters.call_tags) {
                                    if (+tag === id) return true;
                                }
                                return false;
                            }),
                            owner:
                                filterReps.reps.find(
                                    ({ id }) => id === filterReps.active
                                ) || null,
                            team:
                                filterTeams.teams.find(
                                    ({ id }) => id === filterTeams.active
                                ) || null,
                            questions: Object.keys(
                                searchFilters.activeQuestions
                            ).length
                                ? searchFilters.activeQuestions
                                : null,
                            template: Object.keys(searchFilters.activeQuestions)
                                .length
                                ? searchFilters.template || null
                                : null,
                            keywords: searchFilters.keywords,
                            stage: filters?.stage?.find(
                                ({ id }) => searchFilters.stage === id
                            ),
                        },
                        stats_threshold
                    ),
                })
            );
        setDrawerState({
            type: drawerAction.CLOSE_CREATE_VIEW_MODAL,
        });
    };

    // Handle sidenav filter value changes

    return (
        <div
            className="flex1 width100p"
            style={{
                overflow: "auto",
            }}
        >
            <Spinner
                loading={loading || isFetching}
                tip={`LOADING ${capitalizeFirstLetter(meetingType)}...`}
            >
                <SearchCalls
                    {...callHandlers}
                    calls={calls}
                    searchInfiniteRef={searchInfiniteRef}
                    activeCallIndex={activeCallIndex}
                    isCallActive={isCallActive}
                    setactiveCall={setCall}
                    nextUrl={nextUrl}
                    loading={loading}
                    sharerHandler={sharerHandler}
                    isSearchActive={isSearchActive}
                    setisSearchActive={setisSearchActive}
                    setnewTrackerModal={setnewTrackerModal}
                    clearSearch={clearSearch}
                    disableCreateAlert={disableCreateAlert}
                    onLoadMore={callHandlers.handleLoadMore}
                />
                <Drawer
                    className={
                        "upcomming__calls__drawer drawer__filters search__filter__drawer"
                    }
                    title={<div className="title__main__heading">Filters</div>}
                    placement="right"
                    onClose={() =>
                        setDrawerState({ type: drawerAction.CLOSE_FILTERS })
                    }
                    visible={drawerState.showFilters}
                    width={"480px"}
                    extra={
                        <>
                            <span
                                onClick={() =>
                                    setDrawerState({
                                        type: drawerAction.CLOSE_FILTERS,
                                    })
                                }
                            >
                                <CloseSvg />
                            </span>
                        </>
                    }
                    footer={<SearchFilterFooter />}
                >
                    <SearchSidebar
                        allTags={allTags}
                        allTopics={allTopics}
                        isSearchActive={isSearchActive}
                        salesTasks={salesTasks}
                        clearSearch={clearSearch}
                        defaultActiveFilter={defaultActiveFilter}
                    />
                </Drawer>
                <Drawer
                    className={"upcomming__calls__drawer"}
                    title={
                        <div>
                            <div className="title__main__heading">Alerts</div>
                        </div>
                    }
                    placement="right"
                    onClose={() =>
                        setDrawerState({ type: drawerAction.CLOSE_ALERTS })
                    }
                    visible={drawerState.showAlerts}
                    width={"480px"}
                    extra={
                        <>
                            <span
                                onClick={() =>
                                    setDrawerState({
                                        type: drawerAction.CLOSE_ALERTS,
                                    })
                                }
                            >
                                <CloseSvg />
                            </span>
                        </>
                    }
                >
                    <Trackers
                        showTrackersUI={showTrackersUI}
                        newTrackerModal={newTrackerModal}
                        setnewTrackerModal={setnewTrackerModal}
                        filtersData={filtersData}
                        setDisableCreateAlert={setDisableCreateAlert}
                    />
                </Drawer>
                <TrackerModal
                    visible={drawerState.showCreateTrackerModal}
                    closeModal={() =>
                        setDrawerState({
                            type: drawerAction.CLOSE_TRACKER_MODAL,
                        })
                    }
                    data={{}}
                    filtersData={filtersData}
                />
                <Modal
                    visible={drawerState.showCrateViewModal}
                    title={
                        showUpdateView ? "Update This View" : "Create New View"
                    }
                    // case constants.CLOSE_CREATE_VIEW_MODAL:
                    //     return { showCrateViewModal: false };
                    centered={true}
                    className="homepage_modal"
                    onOk={() => {}}
                    onCancel={() => {
                        setDrawerState({
                            type: drawerAction.CLOSE_CREATE_VIEW_MODAL,
                        });
                    }}
                    width={605}
                    footer={[
                        <Checkbox
                            onChange={(e) => {
                                setIsDefaultView(e.target.checked);
                            }}
                            checked={isDefaultView}
                        >
                            Make this as default
                        </Checkbox>,
                        <Button
                            key="submit"
                            type="primary"
                            onClick={handleSaveView}
                        >
                            {showUpdateView ? "Update View" : "Save View"}
                        </Button>,
                    ]}
                    closeIcon={<CloseSvg />}
                >
                    <div className="marginB12 setting_name">View Name</div>

                    <Input
                        name="name"
                        placeholder="Enter name"
                        value={viewName}
                        allowClear
                        onChange={(e) => {
                            setViewName(e.target.value);
                        }}
                        className="borderRadius5"
                    />
                </Modal>
            </Spinner>
        </div>
    );
}

export default withRouter(Search);
