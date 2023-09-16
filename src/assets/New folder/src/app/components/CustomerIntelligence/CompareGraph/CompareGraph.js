import React, { useContext, useEffect, useState } from "react";
import "./compareGraph.scss";
import { Button, Col, Popconfirm, Row, Skeleton, Tabs, Tooltip } from "antd";
import NoData from "@presentational/reusables/NoData";
import Header from "./Header/Header";
import { OCCURRENCE_GRAPH, PERCENT_GRAPH } from "../constants";
import SnippetsDrawer from "../SnippetsDrawer/SnippetsDrawer";
import { uid } from "@tools/helpers";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteTabKeyWord,
    fetchSingleTabData,
    getPhraseSnippets,
    setSaidByFilter,
} from "@store/ci/actions";
import { getWorldCloud } from "app/ApiUtils/customer_intelligence/index";
import DeleteSvg from "app/static/svg/DeleteSvg";
import DownloadIcon from "app/static/svg/DownloadIcon";
import Spinner from "@presentational/reusables/Spinner";
import { CiContext } from "../CustomerIntelligence";
import ReactApexChart from "react-apexcharts";
import SampleDataBanner from "@presentational/reusables/SampleDataBanner";

export default function CompareGraph({
    search_phrases,
    contains_graph,
    slug,
    is_removable,
    id,
    domain,
    percentage_graph_data,
    occurance_graph_data,
    total_meetings_count,
    saidByFilter,
    isSample,
    tabId,
    stage,
}) {
    const dispatch = useDispatch();
    const [activeGraphView, setActiveGraphView] = useState(PERCENT_GRAPH);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [activeSnippets, setActiveSnippets] = useState([]);
    const [phraseId, setPhraseId] = useState(null);
    const [phraseIndex, setPhraseIndex] = useState(null);
    const [activeStat, setActiveStat] = useState("");
    const [activeGraphData, setActiveGraphData] = useState([]);
    const [exclude, setExclude] = useState(false);
    const [nextSnippetsUrl, setNextSnippetUrl] = useState(null);
    const isLoading = useSelector((state) => state.ci.isLoading);
    const graphLoading = useSelector((state) => state.ci.graphLoading);
    const [maxY, setMaxY] = useState(0);
    const {
        filterReps,
        filterDates,
        filterCallDuration,
        getTopBarData,
        filterTeams,
        loading_phrases,
        loading_editing_phrase,
        tabs,
        activeCallTag,
    } = useContext(CiContext);
    useEffect(() => {
        if (search_phrases?.length)
            if (activeGraphView === PERCENT_GRAPH) {
                setActiveGraphData(formatData(percentage_graph_data));
            } else {
                setActiveGraphData(formatData(occurance_graph_data));
            }
    }, [
        search_phrases,
        activeGraphView,
        percentage_graph_data,
        occurance_graph_data,
    ]);

    useEffect(() => {
        tabs?.length &&
            dispatch(
                fetchSingleTabData({
                    domain,
                    id: tabs?.find((tab) => tab?.slug?.toLowerCase() === tabId)
                        ?.id,
                    saidByFilter,
                    topBarFilter: getTopBarData(),
                    exclude: exclude,
                    filters: { stage },
                })
            );
    }, [
        filterReps.active,
        filterCallDuration.active,
        filterDates.active,
        filterTeams.active,
        tabId,
        exclude,
        stage,
        activeCallTag,
    ]);

    const toggleExclude = () => {
        setExclude((prev) => !prev);
    };

    const toggleGraphView = (id) => {
        setActiveGraphView(id);
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
                offsetY: 20,
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
                        ? "No of calls"
                        : "Occurrence in calls",
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
        },
        tooltip: {
            enabled: true,
            x: {
                show: true,
                format: "dd MMM yyyy h:m TT",
                formatter: undefined,
            },
            fixed: {
                enabled: true,
                position: "top",
                offsetX: 0,
                offsetY: 0,
            },
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
                dispatch(
                    setSaidByFilter({
                        saidByFilter: {
                            ...saidByFilter,
                            saidByClient: true,
                            saidByOwner: cheked,
                        },
                        id,
                        domain,
                        topBarFilter: getTopBarData(),
                        filters: { stage },
                    })
                );
            else
                dispatch(
                    setSaidByFilter({
                        saidByFilter: {
                            ...saidByFilter,
                            saidByOwner: cheked,
                        },
                        id,
                        domain,
                        topBarFilter: getTopBarData(),
                        filters: { stage },
                    })
                );
        } else {
            if (saidByFilter.saidByOwner === false && cheked === false)
                dispatch(
                    setSaidByFilter({
                        saidByFilter: {
                            ...saidByFilter,
                            saidByOwner: true,
                            saidByClient: cheked,
                        },
                        id,
                        domain,
                        topBarFilter: getTopBarData(),
                        filters: { stage },
                    })
                );
            else
                dispatch(
                    setSaidByFilter({
                        saidByFilter: {
                            ...saidByFilter,
                            saidByClient: cheked,
                        },
                        id,
                        domain,
                        topBarFilter: getTopBarData(),
                        filters: { stage },
                    })
                );
        }
    };

    const toggleDrawer = (
        status,
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
        setIsDrawerVisible(status);
        setPhraseId(phraseId);
        setPhraseIndex(index);

        if (status && !data) {
            dispatch(
                getPhraseSnippets({
                    domain,
                    id: phraseId,
                    tabId: id,
                    nextSnippetsUrl,
                    saidByFilter,
                    topBarFilter: getTopBarData(),
                    is_processed,
                    phrase,
                    filters: { stage },
                })
            );
        }
    };

    useEffect(() => {
        if (typeof phraseIndex === "number") {
            setActiveSnippets(search_phrases[phraseIndex]?.snippets);
            setNextSnippetUrl(search_phrases[phraseIndex]?.nextSnippetsUrl);
        }
    }, [search_phrases]);

    const deleteKeyword = (id, keyword, tabId) => {
        dispatch(
            deleteTabKeyWord({
                id,
                domain,
                tabId,
                saidByFilter,
                topBarFilter: getTopBarData(),
                filters: { stage },
            })
        );
    };
    const span = exclude ? 8 : 4;
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
            const keys = search_phrases.map(({ phrase }) => phrase);
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

    return (
        <>
            {isSample && <SampleDataBanner />}

            <div className="ci_container">
                {contains_graph && (
                    <Header
                        showSwitch={search_phrases && search_phrases.length}
                        selectedView={activeGraphView}
                        onSwitch={toggleGraphView}
                        placeholder={`Add a new ${getName(
                            true
                        )} phrase to track`}
                        id={id}
                        saidByFilter={saidByFilter}
                        handleSaidByFilter={handleSaidByFilter}
                        exclude={exclude}
                        toggleExclude={toggleExclude}
                    />
                )}
                <div className="ci_graph_table_container flex1 overflowYscroll">
                    {(search_phrases && search_phrases.length) ||
                    loading_phrases ||
                    graphLoading ||
                    (search_phrases &&
                        !search_phrases.length &&
                        loading_editing_phrase) ? (
                        <>
                            {graphLoading ||
                            (search_phrases &&
                                !search_phrases.length &&
                                loading_editing_phrase) ? (
                                <Skeleton
                                    active
                                    paragraph={{ rows: 4 }}
                                    title={false}
                                />
                            ) : (
                                <>
                                    <div className="ci__switch">
                                        <button
                                            className={`ci__switch--btn ${
                                                PERCENT_GRAPH ===
                                                activeGraphView
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                toggleGraphView(PERCENT_GRAPH);
                                            }}
                                        >
                                            No. of Calls
                                        </button>
                                        <button
                                            className={`ci__switch--btn ${
                                                OCCURRENCE_GRAPH ===
                                                activeGraphView
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() => {
                                                toggleGraphView(
                                                    OCCURRENCE_GRAPH
                                                );
                                            }}
                                        >
                                            No. of Occurrences
                                        </button>
                                    </div>

                                    <ReactApexChart
                                        options={options}
                                        series={activeGraphData}
                                        type="line"
                                        height={400}
                                    />
                                </>
                            )}
                            <div className="ci_table">
                                <Row className="ci_table_heading">
                                    <Col span={8}>Phrase/Keyword</Col>
                                    <Col
                                        span={4}
                                        style={{
                                            display: `${exclude ? "none" : ""}`,
                                        }}
                                    >
                                        No. of Occurrences
                                    </Col>
                                    <Col span={span}>No. of Calls</Col>
                                    <Col
                                        span={4}
                                        style={{
                                            display: `${exclude ? "none" : ""}`,
                                        }}
                                    >
                                        View
                                    </Col>
                                    <Col span={span}>Actions</Col>
                                </Row>

                                {loading_phrases ? (
                                    new Array(4)
                                        .fill(0)
                                        .map((_, idx) => <Loader key={idx} />)
                                ) : (
                                    <>
                                        {loading_editing_phrase && <Loader />}
                                        {search_phrases?.map((stat, index) => (
                                            <Row
                                                className="ci_table_data"
                                                key={stat.id}
                                            >
                                                <Col
                                                    className="flex alignCenter"
                                                    span={8}
                                                >
                                                    <span>{stat.phrase}</span>
                                                </Col>

                                                <Col
                                                    className="flex alignCenter"
                                                    span={4}
                                                    style={{
                                                        display: `${
                                                            exclude
                                                                ? "none"
                                                                : ""
                                                        }`,
                                                    }}
                                                >
                                                    <span>
                                                        {stat.sentences_count ||
                                                            0}
                                                    </span>
                                                </Col>
                                                <Col
                                                    className="flex alignCenter"
                                                    span={span}
                                                >
                                                    <span>
                                                        {
                                                            stat.distinct_meetings_count
                                                        }
                                                        &nbsp;(
                                                        {total_meetings_count
                                                            ? (
                                                                  (stat.distinct_meetings_count *
                                                                      100) /
                                                                  total_meetings_count
                                                              ).toFixed(2)
                                                            : 0}
                                                        %)
                                                    </span>
                                                </Col>
                                                <Col
                                                    className="flex alignCenter"
                                                    span={4}
                                                    style={{
                                                        display: `${
                                                            exclude
                                                                ? "none"
                                                                : ""
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
                                                            className="padding0 margin0 capitalize"
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
                                                            onClick={() =>
                                                                toggleDrawer(
                                                                    true,
                                                                    stat.snippets,
                                                                    stat.phrase,
                                                                    stat.id,
                                                                    stat.nextSnippetsUrl,
                                                                    index,
                                                                    stat.is_processed,
                                                                    stat.phrase
                                                                )
                                                            }
                                                        >
                                                            Snippets
                                                        </span>
                                                    </Tooltip>
                                                </Col>

                                                <Col
                                                    className="flex alignCenter"
                                                    span={span}
                                                >
                                                    <Popconfirm
                                                        title="Are you sure to delete this keyword?"
                                                        onConfirm={() =>
                                                            deleteKeyword(
                                                                stat.id,
                                                                stat.phrase,
                                                                id
                                                            )
                                                        }
                                                        okText="Yes"
                                                        cancelText="No"
                                                        disabled={isSample}
                                                    >
                                                        <Button
                                                            danger
                                                            type="link"
                                                            disabled={isSample}
                                                            icon={
                                                                <DeleteSvg
                                                                    style={{
                                                                        transform:
                                                                            "scale(1.6)",
                                                                    }}
                                                                />
                                                            }
                                                        />
                                                    </Popconfirm>
                                                    <span
                                                        onClick={() =>
                                                            getWorldCloudHandler(
                                                                stat.snippets,
                                                                stat.phrase,
                                                                stat.id,
                                                                stat.nextSnippetsUrl,
                                                                index,
                                                                stat.is_processed,
                                                                stat.phrase
                                                            )
                                                        }
                                                        className="curPoint marginL20"
                                                        style={{
                                                            display: `${
                                                                !stat.distinct_meetings_count ||
                                                                isSample
                                                                    ? "none"
                                                                    : ""
                                                            }`,
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
                            <SnippetsDrawer
                                title={activeStat}
                                isVisible={isDrawerVisible}
                                snippets={activeSnippets}
                                nextSnippetsUrl={nextSnippetsUrl}
                                phraseId={phraseId}
                                domain={domain}
                                tabId={id}
                                phraseIndex={phraseIndex}
                                saidByFilter={saidByFilter}
                                toggleModal={() =>
                                    toggleDrawer(false, [], "", null, null)
                                }
                                isSample={isSample}
                                is_processed={
                                    search_phrases?.find(
                                        (p) => p.id === phraseId
                                    )?.is_processed
                                }
                                phrase={
                                    search_phrases?.find(
                                        (p) => p.id === phraseId
                                    )?.phrase
                                }
                            />
                        </>
                    ) : (
                        !loading_phrases &&
                        !graphLoading &&
                        !search_phrases?.length && (
                            <div className="height100p flex alignCenter justifyCenter">
                                <NoData
                                    description={`Once you add a ${getName(
                                        true
                                    )} phrase, we will show what people are saying about them.`}
                                />
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
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
