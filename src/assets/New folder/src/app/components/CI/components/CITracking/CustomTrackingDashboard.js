import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import "./customTrackingDashboard.scss";
import { Col, Drawer, Popconfirm, Row, Skeleton, Tooltip } from "antd";

import Header from "./Header/Header";
import { OCCURRENCE_GRAPH, PERCENT_GRAPH } from "./constants";

import { useDispatch, useSelector } from "react-redux";

import DeleteSvg from "app/static/svg/DeleteSvg";
import DownloadIcon from "app/static/svg/DownloadIcon";

import ReactApexChart from "react-apexcharts";

import { useParams } from "react-router-dom";
import {
    clearCITrackingSnippets,
    getCIPhraseStats,
    getCISnippetsPhraseDetails,
    getCITabById,
    getCITrackingSnippets,
    getGraphByTabId,
    removeCIPhrase,
    setCITrackingSnippetsInitialLoad,
} from "@store/cutsomerIntelligence/CISlice";
import { prepareCIData } from "@store/ci/utils";
import apiErrors from "@apis/common/errors";
import { CIMainContext } from "../CIDashboard";
import MonologueDrawer from "../MonologueDrawer";
import SnippetPlaySvg from "app/static/svg/SnippetPlaySvg";
import PhraseDetailsDrawer from "./PhraseDetailsDrawer";
import { getWorldCloud } from "app/ApiUtils/customer_intelligence";
import {
    HomeContext,
    MeetingTypeConst,
} from "app/components/container/Home/Home";

export const CustomTrackigContext = createContext();

export default function CustomTrackingDashboard({
    search_phrases,
    contains_graph,

    is_removable,
    id,
    domain,
    percentage_graph_data,
    occurance_graph_data,
    total_meetings_count,

    isSample,
    tabId,
    stage,
}) {
    const { activeStage } = useContext(CIMainContext);
    const {
        filterTeams,
        filterReps,
        filterDates,
        filterCallDuration,
        activeCallTag,
    } = useSelector((state) => state.common);
    const {
        tabs,
        loading_editing_phrase,
        nextSnippetsUrl,
        tabData,
        tabLoading,
        graphLoading,
        graphData,
        snippetsInitialLoad,
        snippets,
        phraseStats,
    } = useSelector((state) => state.CISlice);
    const { slug } = useParams();

    const dispatch = useDispatch();
    const [activeGraphView, setActiveGraphView] = useState(PERCENT_GRAPH);
    const { meetingType } = useContext(HomeContext);

    const [activeSnippets, setActiveSnippets] = useState([]);
    const [phraseId, setPhraseId] = useState(null);
    const [phraseIndex, setPhraseIndex] = useState(null);
    const [activeStat, setActiveStat] = useState("");
    const [activeGraphData, setActiveGraphData] = useState([]);
    const [exclude, setExclude] = useState(false);
    const [maxY, setMaxY] = useState(0);

    const [saidByFilter, setSaidByFilter] = useState({
        saidByClient: true,
        saidByOwner: true,
    });

    const [statsDrawerVisible, setStatsDrawerVisible] = useState(false);

    const handleCloseStatsDraer = () => {
        setStatsDrawerVisible(false);
    };

    const handlePhraseDetailsSnippetClick = ({
        snippet_type,
        type,
        is_type = false,
    }) => {
        dispatch(setCITrackingSnippetsInitialLoad(true));
        dispatch(
            getCISnippetsPhraseDetails({
                id: phraseStats.data.id,
                type: snippet_type === "score" ? "ai_call_score" : snippet_type,
                stat: type,
                payload: getPayload(),
            })
        );
        setShowDrawer(true);
    };

    useEffect(() => {
        if (graphData)
            if (activeGraphView === PERCENT_GRAPH) {
                setActiveGraphData(
                    formatData(graphData?.distinct_meetings_graph_data)
                );
            } else {
                setActiveGraphData(
                    formatData(graphData?.sentences_count_graph_data)
                );
            }
    }, [graphData, activeGraphView]);

    const generatePayload = (phrase = undefined) => {
        return {
            exclude,
            ...prepareCIData({
                saidByFilter,
                topBarFilter: getTopBarData(),
                phrase,
                filters: {
                    stage: activeStage,
                },
            }),
        };
    };

    const getTopBarData = () => {
        let data = {
            callDuration:
                filterCallDuration.options[filterCallDuration.active].value,
            activeReps: filterReps.active,
            activeTeam: filterTeams.active,
            activeDateRange: filterDates.dates[filterDates.active].dateRange,
        };
        return {
            callType: data.callType,
            callDuration: data.callDuration,
            repId: data.activeReps,
            teamId: data.activeTeam,
            startDate: data.activeDateRange[0],
            endDate: data.activeDateRange[1],
            activeCallTag,
            meetingType,
        };
    };

    useEffect(() => {
        if (tabs.length) {
            const id = tabs?.find(
                (tab) => tab?.slug?.toLowerCase() === slug
            )?.id;
            if (id) {
                dispatch(
                    getCITabById({
                        id,
                        payload: generatePayload(),
                    })
                );
                dispatch(
                    getGraphByTabId({
                        id,
                        payload: generatePayload(),
                    })
                );
            }
        }
    }, [
        filterReps.active,
        filterCallDuration.active,
        filterDates.active,
        filterTeams.active,
        activeCallTag,
        slug,
        exclude,
        stage,
        tabs,
        tabId,
        saidByFilter,
        activeStage,
        meetingType,
    ]);

    const toggleExclude = () => {
        setExclude((prev) => !prev);
    };

    const toggleGraphView = (id) => {
        setActiveGraphView(id);
    };

    const [showDrawer, setShowDrawer] = useState(false);

    const [snippetToLoad, setSnippetToLoad] = useState({});

    const handleSnippetClick = ({ id, is_processed, phrase }) => {
        setShowDrawer(true);
        setSnippetToLoad({
            id,
            is_processed,
            phrase: is_processed ? phrase : undefined,
        });
        dispatch(setCITrackingSnippetsInitialLoad(true));
        dispatch(
            getCITrackingSnippets({
                id,
                payload: generatePayload(is_processed ? phrase : undefined),
                is_processed,
            })
        );
    };

    const getNext = useCallback(() => {
        dispatch(
            getCITrackingSnippets({
                id: snippetToLoad?.id,
                payload: snippetToLoad?.id
                    ? generatePayload(snippetToLoad?.phrase)
                    : getPayload(),
                is_processed: snippetToLoad?.is_processed,
                next: nextSnippetsUrl,
            })
        );
    }, [nextSnippetsUrl, snippetToLoad]);

    const handleClose = () => {
        setShowDrawer(false);
        setSnippetToLoad({});
        dispatch(clearCITrackingSnippets());
    };

    const options = {
        chart: {
            type: "line",
            zoom: {
                enabled: true,
                type: "x",
                autoScaleYaxis: true,
                zoomedArea: {
                    fill: {
                        color: "#90CAF9",
                        opacity: 0.4,
                    },
                    stroke: {
                        color: "#0D47A1",
                        opacity: 0.4,
                        width: 1,
                    },
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        markers: {
            size: [3, 4],
        },
        stroke: {
            show: true,
            curve: "smooth",
            lineCap: "butt",
            colors: undefined,
            width: 2,
            dashArray: 0,
        },
        title: {},
        grid: {
            strokeDashArray: 5,
            xaxis: {
                lines: {
                    show: true,
                    offsetX: 0.5,
                    offsetY: 0.5,
                },
            },
            padding: {
                top: 0,
                right: 30,
                bottom: 20,
                left: 30,
            },
        },
        xaxis: {
            type: "datetime",
            offsetX: 10,
            // tickAmount: 10,
            title: {
                text: "Date",
                offsetX: 0,
                offsetY: 80,
                style: {
                    color: undefined,
                    fontSize: "14px",

                    fontWeight: 600,
                    cssClass: "apexcharts-xaxis-title",
                },
            },
            axisBorder: {
                show: true,
                color: "#78909C",
                offsetX: -10,
                offsetY: 0,
            },
        },
        yaxis: {
            labels: {
                formatter: function (val) {
                    return val?.toFixed(0);
                },
                offsetX: 20,
                offsetY: 0,
                style: {
                    colors: [],
                    fontSize: "12px",
                    fontFamily: "ProximaNova",
                    fontWeight: 600,
                    cssClass: "apexcharts-yaxis-label",
                },
            },
            min: 0,
            max: maxY,
            tickAmount: maxY <= 100 ? Math.floor(Math.sqrt(maxY)) : 4,
            title: {
                text:
                    activeGraphView === PERCENT_GRAPH
                        ? `No of ${
                              meetingType === MeetingTypeConst.chat
                                  ? "Chats"
                                  : meetingType === MeetingTypeConst.email
                                  ? "Emails"
                                  : "Calls"
                          }`
                        : `Occurrence in ${
                              meetingType === MeetingTypeConst.chat
                                  ? "Chats"
                                  : meetingType === MeetingTypeConst.email
                                  ? "Emails"
                                  : "Calls"
                          }`,
                rotate: -90,
                offsetX: -10,
                offsetY: 0,
                style: {
                    color: undefined,
                    fontSize: "14px",
                    fontFamily: "ProximaNova",
                    fontWeight: 600,
                    cssClass: "apexcharts-yaxis-title",
                },
            },
            axisBorder: {
                show: true,
                color: "#78909C",
                offsetX: -2,
                offsetY: 0,
            },
        },
        legend: {
            position: "right",
            floating: false,
            offsetX: -20,
            offsetY: 35,
            itemMargin: {
                horizontal: 0,
                vertical: 5,
            },
            formatter: function (seriesName) {
                seriesName = seriesName.replaceAll('"', "");
                return `<div data-text="${seriesName}" class="legend-tooltip">${seriesName}</div>`;
            },
        },
        tooltip: {
            shared: false,
            intersect: false,
            followCursor: false,
            inverseOrder: false,
        },
    };

    const getWorldCloudHandler = (
        data,
        name,
        phraseId,
        nextSnippetsUrl,
        index,
        is_processed,
        phrase
    ) => {
        setActiveSnippets(data);
        setActiveStat(name);
        setPhraseId(phraseId);
        setPhraseIndex(index);
        getWorldCloud({
            domain,
            id: phraseId,
            tabId: id,
            nextSnippetsUrl,
            saidByFilter,
            topBarFilter: getTopBarData(),
            is_processed,
            phrase,
            filters: { stage },
        });
    };

    const handleSaidByFilter = (cheked, saidBy) => {
        if (saidBy === "saidByOwner") {
            if (saidByFilter.saidByClient === false && cheked === false)
                setSaidByFilter({
                    ...saidByFilter,
                    saidByClient: true,
                    saidByOwner: cheked,
                });
            else
                setSaidByFilter({
                    ...saidByFilter,
                    saidByOwner: cheked,
                });
        } else {
            if (saidByFilter.saidByOwner === false && cheked === false)
                setSaidByFilter({
                    ...saidByFilter,
                    saidByOwner: true,
                    saidByClient: cheked,
                });
            else
                setSaidByFilter({
                    ...saidByFilter,
                    saidByClient: cheked,
                });
        }
    };

    const deleteKeyword = (id) => {
        dispatch(removeCIPhrase(id)).then(({ payload }) => {
            if (payload?.status !== apiErrors.AXIOSERRORSTATUS) {
                dispatch(
                    getGraphByTabId({
                        id: tabs.find(
                            (e) => e.slug.toLowerCase() === slug.toLowerCase()
                        )?.id,
                        payload: generatePayload(),
                    })
                );
            }
        });
    };
    const span = exclude ? 6 : 4;
    const getName = (toLowerCase) => {
        const name =
            slug === "competition"
                ? "Competition"
                : slug === "features"
                ? "Features"
                : slug.charAt(0).toUpperCase() + slug.slice(1);
        return toLowerCase ? name.toLowerCase() : name;
    };

    const convertToDate = (date) => {
        var parts = date.split("/");
        return new Date(20 + parts[2], parts[1] - 1, parts[0]).getTime();
    };
    const formatData = (arr) => {
        const series = [];

        let max = 0;
        if (arr?.length) {
            const keys = Object.keys(arr[0]).filter((e) => e !== "date");

            const keysToIndex = {};
            for (let i = 0; i < keys.length; i++) {
                series.push({
                    name: keys[i],
                    label: keys[i],
                    data: [],
                });
                keysToIndex[keys[i]] = i;
            }
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < keys.length; j++) {
                    if (series[keysToIndex[keys[j]]]) {
                        if (arr[i][keys[j]] > max) {
                            max = arr[i][keys[j]];
                        }
                        series[keysToIndex[keys[j]]] = {
                            ...series[keysToIndex[keys[j]]],
                            data: [
                                ...series[keysToIndex[keys[j]]].data,
                                {
                                    x: new Date(arr[i].date),

                                    y: arr[i][keys[j]] || 0,
                                },
                            ],
                        };
                    }
                }
            }
            if (max) {
                max % 2 === 0 ? setMaxY(max + 2) : setMaxY(max + 1);
            }

            return series;
        }
        return [];
    };

    const { getPayload } = useContext(CIMainContext);

    return (
        <CustomTrackigContext.Provider value={{ generatePayload }}>
            <div className="ci_container">
                <Header
                    showSwitch={tabData?.search_phrases?.length}
                    selectedView={activeGraphView}
                    onSwitch={toggleGraphView}
                    placeholder={`Add a new ${getName(true)} phrase to track`}
                    id={id}
                    saidByFilter={saidByFilter}
                    handleSaidByFilter={handleSaidByFilter}
                    exclude={exclude}
                    toggleExclude={toggleExclude}
                />
                <div className="ci_graph_table_container flex1 overflowYscroll">
                    {graphLoading ? (
                        <div className="ci_table padding20 white_bg marginB20">
                            <Skeleton
                                active
                                paragraph={{ rows: 8 }}
                                title={false}
                            />
                        </div>
                    ) : (
                        <>
                            <div className="ci__switch">
                                <button
                                    className={`ci__switch--btn ${
                                        PERCENT_GRAPH === activeGraphView
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        toggleGraphView(PERCENT_GRAPH);
                                    }}
                                >
                                    No. of{" "}
                                    {meetingType === MeetingTypeConst.chat
                                        ? "Chats"
                                        : meetingType === MeetingTypeConst.email
                                        ? "Emails"
                                        : "Calls"}
                                </button>
                                <button
                                    className={`ci__switch--btn ${
                                        OCCURRENCE_GRAPH === activeGraphView
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        toggleGraphView(OCCURRENCE_GRAPH);
                                    }}
                                >
                                    No. of Occurrence
                                </button>
                            </div>
                            <div className="graph_container">
                                <ReactApexChart
                                    options={options}
                                    series={activeGraphData}
                                    type="line"
                                    height={400}
                                />
                            </div>
                        </>
                    )}
                    <div className="ci_table">
                        <Row className="ci_table_heading">
                            <Col span={4}>Phrase/Keyword</Col>
                            <Col
                                span={4}
                                style={{
                                    display: `${exclude ? "none" : "block"}`,
                                }}
                                className="text-center"
                            >
                                Occurrence
                            </Col>
                            <Col span={span} className="text-center">
                                {meetingType === MeetingTypeConst.chat
                                    ? "Chats"
                                    : meetingType === MeetingTypeConst.email
                                    ? "Emails"
                                    : "Calls"}
                            </Col>
                            <Col span={span} className="text-center">
                                Accounts
                            </Col>
                            <Col
                                span={4}
                                style={{
                                    display: `${exclude ? "none" : "block"}`,
                                }}
                                className="text-center"
                            >
                                Snippets
                            </Col>
                            <Col span={span} className="text-center">
                                Actions
                            </Col>
                        </Row>

                        {tabLoading ? (
                            new Array(4)
                                .fill(0)
                                .map((_, idx) => <Loader key={idx} />)
                        ) : (
                            <>
                                {loading_editing_phrase && <Loader />}
                                {tabData?.search_phrases?.map((stat, index) => (
                                    <Row
                                        className="ci_table_data flex alignCenter"
                                        key={stat.id}
                                    >
                                        <Col
                                            className="flex alignCenter"
                                            span={4}
                                        >
                                            <span>{stat.phrase}</span>
                                        </Col>

                                        <Col
                                            className="flex justifyCenter"
                                            span={4}
                                            style={{
                                                display: `${
                                                    exclude ? "none" : "flex"
                                                }`,
                                            }}
                                        >
                                            <span>
                                                {!stat.is_processed
                                                    ? "Processing"
                                                    : stat.sentences_count || 0}
                                            </span>
                                        </Col>
                                        <Col
                                            className="flex justifyCenter"
                                            span={span}
                                        >
                                            {!stat.is_processed ? (
                                                <span>Processing</span>
                                            ) : (
                                                <span>
                                                    {
                                                        stat.distinct_meetings_count
                                                    }
                                                    &nbsp;(
                                                    {tabData?.total_meetings_count
                                                        ? (
                                                              (stat.distinct_meetings_count *
                                                                  100) /
                                                              tabData?.total_meetings_count
                                                          ).toFixed(2)
                                                        : 0}
                                                    %)
                                                </span>
                                            )}
                                        </Col>
                                        <Col
                                            className="flex justifyCenter"
                                            span={span}
                                        >
                                            {!stat.is_processed ? (
                                                <span>Processing</span>
                                            ) : (
                                                <span>
                                                    {stat.distinct_accounts}
                                                    &nbsp;(
                                                    {tabData?.total_account_count
                                                        ? (
                                                              (stat.distinct_accounts *
                                                                  100) /
                                                              tabData?.total_account_count
                                                          ).toFixed(2)
                                                        : 0}
                                                    %)
                                                </span>
                                            )}
                                        </Col>
                                        <Col
                                            className="flex justifyCenter"
                                            span={4}
                                            style={{
                                                display: `${
                                                    exclude ? "none" : "block"
                                                }`,
                                            }}
                                        >
                                            <Tooltip
                                                destroyTooltipOnHide
                                                title={`${
                                                    isSample
                                                        ? "Not available for sample data"
                                                        : ""
                                                }`}
                                                placement={"top"}
                                            >
                                                <span
                                                    type="link"
                                                    className="flex justifyCenter"
                                                    style={{
                                                        margin: "0px !important",
                                                        color:
                                                            !stat.distinct_meetings_count ||
                                                            isSample
                                                                ? "#999"
                                                                : "#1a62f2",
                                                        cursor:
                                                            !stat.distinct_meetings_count ||
                                                            isSample
                                                                ? "not-allowed"
                                                                : "pointer",
                                                    }}
                                                    onClick={() => {
                                                        if (
                                                            !stat.distinct_meetings_count ||
                                                            isSample
                                                        )
                                                            return;
                                                        handleSnippetClick({
                                                            id: stat.id,
                                                            is_processed:
                                                                stat?.is_processed,
                                                            phrase: stat.phrase,
                                                        });
                                                    }}
                                                >
                                                    <SnippetPlaySvg />
                                                </span>
                                            </Tooltip>
                                        </Col>

                                        <Col
                                            className="flex alignCenter justifyCenter"
                                            span={span}
                                            style={{
                                                gap: "12px",
                                            }}
                                        >
                                            <span
                                                onClick={() => {
                                                    dispatch(
                                                        getCIPhraseStats({
                                                            id: stat.id,
                                                            payload:
                                                                getPayload(),
                                                        })
                                                    );
                                                    setStatsDrawerVisible(true);
                                                }}
                                                className="curPoint primary_hover"
                                            >
                                                View
                                            </span>
                                            <Popconfirm
                                                title="Are you sure to delete this keyword?"
                                                onConfirm={() =>
                                                    deleteKeyword(stat.id)
                                                }
                                                okText="Yes"
                                                cancelText="No"
                                                disabled={isSample}
                                            >
                                                <span className="dove_gray_cl curPoint">
                                                    <DeleteSvg />
                                                </span>
                                            </Popconfirm>
                                            <span
                                                onClick={() => {
                                                    if (
                                                        !stat.distinct_meetings_count ||
                                                        isSample
                                                    )
                                                        return;

                                                    getWorldCloudHandler(
                                                        stat.snippets,
                                                        stat.phrase,
                                                        stat.id,
                                                        stat.nextSnippetsUrl,
                                                        index,
                                                        stat.is_processed,
                                                        stat.phrase
                                                    );
                                                }}
                                                className="curPoint   dove_gray_cl"
                                                style={{
                                                    cursor:
                                                        !stat.distinct_meetings_count ||
                                                        isSample
                                                            ? "not-allowed"
                                                            : "pointer",
                                                }}
                                            >
                                                <Tooltip
                                                    title="Download Word Cloud"
                                                    // placement="left"
                                                >
                                                    <DownloadIcon />
                                                </Tooltip>
                                            </span>
                                        </Col>
                                    </Row>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                <PhraseDetailsDrawer
                    handleClose={handleCloseStatsDraer}
                    isVisible={statsDrawerVisible}
                    handleSnippetClick={handlePhraseDetailsSnippetClick}
                />

                <MonologueDrawer
                    isVisible={showDrawer}
                    handleClose={handleClose}
                    snippets={snippets}
                    getNext={getNext}
                    snippetLoading={snippetsInitialLoad}
                    nextSnippetsUrl={nextSnippetsUrl}
                />
            </div>
        </CustomTrackigContext.Provider>
    );
}

const Loader = () => (
    <Row className="ci_table_data loaders">
        <Col className="flex alignCenter" span={8}>
            <Skeleton active paragraph={false} />
        </Col>

        <Col className="flex alignCenter" span={4}>
            <Skeleton active paragraph={false} />
        </Col>
        <Col className="flex alignCenter" span={4}>
            <Skeleton active paragraph={false} />
        </Col>
        <Col className="flex alignCenter" span={4}>
            <Skeleton active paragraph={false} />
        </Col>

        <Col className="flex alignCenter" span={4}>
            <Skeleton active paragraph={false} />
        </Col>
    </Row>
);
