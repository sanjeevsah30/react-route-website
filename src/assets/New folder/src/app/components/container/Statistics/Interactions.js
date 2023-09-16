import React, { useState, useEffect, useRef } from "react";
import statisticsConfig from "@constants/Statistics/index";
import { cloneDeep } from "lodash";
import {
    scrollElementInView,
    getDMYDate,
    differenceInDates,
} from "@tools/helpers";
import usePrevious from "hooks/usePrevious";
import Interactions from "@presentational/Statistics/Interactions";
import { message } from "antd";
import { useSelector } from "react-redux";
import {
    getMappedReps,
    INTERACTION_REPS_DATA,
    INTERACTION_TILE_DATA,
} from "./__mock__/mock";
import SampleDataBanner from "@presentational/reusables/SampleDataBanner";

export default function InteractionsContainer(props) {
    const fields = [
        "longest_monologue_owner",
        "interactivity",
        "patience",
        "owner_talk_ratio",
        "owner_question_count",
        "longest_monologue_client",
    ];
    const [activeTeamCardInteractions, setActiveTeamCardInteractions] =
        useState(0);
    const [tileData, setTileData] = useState({
        talkRatio: 0,
        longestMonologue: 0,
        longestCustomerStory: 0,
        interactivity: 0,
        patience: 0,
        questionRate: 0,
    });
    const [interactionsMaxValues, setInteractionsMaxValues] = useState({
        talkRatio: 100,
        longestMonologue: 0,
        longestCustomerStory: 0,
        interactivity: 10,
        patience: 0,
        questionRate: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingRepGraph, setIsLoadingRepGraph] = useState(false);
    const [repTalkRatioData, setRepTalkRatioData] = useState("");
    const [repMonologueRepData, setRepMonologueRepData] = useState("");
    const [repMonologueClientData, setRepMonologueClientData] = useState("");
    const [repInteractivityData, setRepInteractivityData] = useState("");
    const [repPatienceData, setRepPatienceData] = useState("");
    const [repQuestionRateData, setRepQuestionRateData] = useState("");
    const [talkRatioChart, setTalkRatioChart] = useState({
        xAxis: [],
        yAxis: [],
    });
    const [repMonologueChart, setRepMonologueChart] = useState({
        xAxis: [],
        yAxis: [],
    });
    const [clientMonologueChart, setClientMonologueChart] = useState({
        xAxis: [],
        yAxis: [],
    });
    const [interactivityChart, setInteractivityChart] = useState({
        xAxis: [],
        yAxis: [],
    });
    const [patienceChart, setPatienceChart] = useState({
        xAxis: [],
        yAxis: [],
    });
    const [questionRateChart, setQuestionRateChart] = useState({
        xAxis: [],
        yAxis: [],
    });

    // graph data
    const [graphData, setGraphData] = useState({
        xAxis: [],
        yAxis: [],
        xAxisLabel: "",
        yAxisLabel: "",
    });
    const [showingSampleData, setShowingSampleData] = useState(false);
    const didFiltersChange = useSelector(
        (state) => state.common.didFiltersChange
    );

    const prevRepId = usePrevious(props.repId);
    const isInitialMount = useRef(true);

    const {
        common: { activeCallTag },
    } = useSelector((state) => state);

    useEffect(() => {
        // on rep change fetch tile data and rep trend
        if (+props.repId || +prevRepId) {
            handlers.triggerViewUpdate();
        }
    }, [props.repId]);

    useEffect(() => {
        // on team change fetch tile data
        handlers.triggerViewUpdate();
    }, [props.teamId, activeCallTag]);

    useEffect(() => {
        // on team change fetch tile data
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            handlers.triggerViewUpdate();
        }

        if (
            !props.dateArr[0] ||
            differenceInDates(props.dateArr[1], props.dateArr[0]) > 31
        ) {
            message.warning(
                "Please wait while we are loading. This may take some time!",
                3
            );
        }
    }, [props.callDuration, props.dateArr]);

    useEffect(() => {
        // on tile card change or graph data change refresh graph
        if (activeTeamCardInteractions === 0) {
            setGraphData({
                ...talkRatioChart,
                xAxisLabel:
                    statisticsConfig.TEAM_CARD_TABS_INTERACTIONS[0].xLabel,
                yAxisLabel:
                    statisticsConfig.TEAM_CARD_TABS_INTERACTIONS[0].yLabel,
            });
        } else if (activeTeamCardInteractions === 1) {
            setGraphData({
                ...repMonologueChart,
                xAxisLabel:
                    statisticsConfig.TEAM_CARD_TABS_INTERACTIONS[1].xLabel,
                yAxisLabel:
                    statisticsConfig.TEAM_CARD_TABS_INTERACTIONS[1].yLabel,
            });
        } else if (activeTeamCardInteractions === 2) {
            setGraphData({
                ...clientMonologueChart,
                xAxisLabel:
                    statisticsConfig.TEAM_CARD_TABS_INTERACTIONS[2].xLabel,
                yAxisLabel:
                    statisticsConfig.TEAM_CARD_TABS_INTERACTIONS[2].yLabel,
            });
        } else if (activeTeamCardInteractions === 3) {
            setGraphData({
                ...interactivityChart,
                xAxisLabel:
                    statisticsConfig.TEAM_CARD_TABS_INTERACTIONS[3].xLabel,
                yAxisLabel:
                    statisticsConfig.TEAM_CARD_TABS_INTERACTIONS[3].yLabel,
            });
        } else if (activeTeamCardInteractions === 4) {
            setGraphData({
                ...patienceChart,
                xAxisLabel:
                    statisticsConfig.TEAM_CARD_TABS_INTERACTIONS[4].xLabel,
                yAxisLabel:
                    statisticsConfig.TEAM_CARD_TABS_INTERACTIONS[4].yLabel,
            });
        } else {
            setGraphData({
                ...questionRateChart,
                xAxisLabel:
                    statisticsConfig.TEAM_CARD_TABS_INTERACTIONS[5].xLabel,
                yAxisLabel:
                    statisticsConfig.TEAM_CARD_TABS_INTERACTIONS[5].yLabel,
            });
        }
    }, [
        activeTeamCardInteractions,
        clientMonologueChart,
        interactivityChart,
        patienceChart,
        questionRateChart,
        repMonologueChart,
        talkRatioChart,
    ]);

    const handlers = {
        triggerViewUpdate: () => {
            handlers.updateTileData();
            handlers.updateRepsData();
            // handlers.updateGraphData();
        },
        updateTileData: () => {
            props.getStats(fields, null, false, +props.repId).then((data) => {
                if (!data.status) {
                    if (
                        !data.owner_talk_ratio.length &&
                        !data.longest_monologue_owner.length &&
                        !data.interactivity.length &&
                        !data.patience.length &&
                        !data.owner_question_count.length &&
                        !didFiltersChange
                    ) {
                        setShowingSampleData(true);
                        data = INTERACTION_TILE_DATA;
                    } else {
                        setShowingSampleData(false);
                    }
                    setTileData({
                        talkRatio:
                            data.owner_talk_ratio.length === 0
                                ? 0
                                : +(
                                      parseFloat(data.owner_talk_ratio[0].avg) *
                                      100
                                  ).toFixed(2),
                        longestMonologue:
                            data.longest_monologue_owner.length === 0
                                ? 0
                                : +parseFloat(
                                      data.longest_monologue_owner[0].avg
                                  ).toFixed(2),
                        longestCustomerStory:
                            data.longest_monologue_client.length === 0
                                ? 0
                                : +parseFloat(
                                      data.longest_monologue_client[0].avg
                                  ).toFixed(2),
                        interactivity:
                            data.interactivity.length === 0
                                ? 0
                                : +(
                                      parseFloat(data.interactivity[0].avg) * 10
                                  ).toFixed(2),
                        patience:
                            data.patience.length === 0
                                ? 0
                                : +parseFloat(data.patience[0].avg).toFixed(2),
                        questionRate:
                            data.owner_question_count.length === 0
                                ? 0
                                : +parseFloat(
                                      data.owner_question_count[0].avg
                                  ).toFixed(2),
                    });
                }
            });
        },
        updateRepsData: () => {
            setIsLoading(true);
            props.getStats(fields, null, true, props.repId).then((res) => {
                if (!res.status) {
                    let longestMonologueMax = 0,
                        longestCustomerStoryMax = 0,
                        patienceMax = 0,
                        questionRateMax = 0;
                    if (
                        !res.owner_talk_ratio.length &&
                        !res.longest_monologue_owner.length &&
                        !res.interactivity.length &&
                        !res.patience.length &&
                        !res.owner_question_count.length &&
                        !didFiltersChange
                    ) {
                        setShowingSampleData(true);
                        res = INTERACTION_REPS_DATA;
                    } else {
                        setShowingSampleData(false);
                    }
                    // prepare rep talkRatio data
                    if (res.owner_talk_ratio.length !== 0) {
                        let newRepData = {};
                        for (const talkRatio of res.owner_talk_ratio) {
                            newRepData[talkRatio.meeting__owner_id] =
                                cloneDeep(talkRatio);
                            newRepData[talkRatio.meeting__owner_id].calls =
                                talkRatio.meeting_details;
                            newRepData[talkRatio.meeting__owner_id].avg =
                                parseFloat(talkRatio.avg) * 100;
                        }
                        setRepTalkRatioData(newRepData);
                    } else {
                        setRepTalkRatioData("");
                    }

                    // prepare rep longest_monologue_owner data
                    if (res.longest_monologue_owner.length !== 0) {
                        let newRepData = {};
                        for (const lmowner of res.longest_monologue_owner) {
                            // lmowner.avg = lmowner.avg / 60;
                            lmowner.avg = +lmowner.avg;
                            newRepData[lmowner.meeting__owner_id] =
                                cloneDeep(lmowner);
                            newRepData[lmowner.meeting__owner_id].calls =
                                lmowner.meeting_details;
                            let max = +parseFloat(lmowner.max).toFixed(2);
                            if (max > longestMonologueMax) {
                                longestMonologueMax = max;
                            }
                        }
                        setRepMonologueRepData(newRepData);
                    } else {
                        setRepMonologueRepData("");
                        longestMonologueMax = 0;
                    }

                    // prepare rep longest_monologue_client data
                    if (res.longest_monologue_client.length !== 0) {
                        let newRepData = {};
                        for (const lmclient of res.longest_monologue_client) {
                            // lmclient.avg = lmclient.avg / 60;
                            lmclient.avg = +lmclient.avg;
                            newRepData[lmclient.meeting__owner_id] =
                                cloneDeep(lmclient);
                            newRepData[lmclient.meeting__owner_id].calls =
                                lmclient.meeting_details;
                            let max = +parseFloat(lmclient.max).toFixed(2);
                            if (max > longestCustomerStoryMax) {
                                longestCustomerStoryMax = max;
                            }
                        }
                        setRepMonologueClientData(newRepData);
                    } else {
                        setRepMonologueClientData("");
                        longestCustomerStoryMax = 0;
                    }

                    // prepare rep interactivity data
                    if (res.interactivity.length !== 0) {
                        let newRepData = {};
                        for (const interactivity of res.interactivity) {
                            newRepData[interactivity.meeting__owner_id] =
                                cloneDeep(interactivity);
                            newRepData[interactivity.meeting__owner_id].avg = +(
                                parseFloat(interactivity.avg) * 10
                            ).toFixed(2);
                            newRepData[interactivity.meeting__owner_id].calls =
                                interactivity.meeting_details;
                        }
                        setRepInteractivityData(newRepData);
                    } else {
                        setRepInteractivityData("");
                    }

                    // prepare rep patience data
                    if (res.patience.length !== 0) {
                        let newRepData = {};
                        for (const patience of res.patience) {
                            newRepData[patience.meeting__owner_id] =
                                cloneDeep(patience);
                            newRepData[patience.meeting__owner_id].calls =
                                patience.meeting_details;
                            let max = +parseFloat(patience.max).toFixed(2);
                            if (max > patienceMax) {
                                patienceMax = max;
                            }
                        }
                        setRepPatienceData(newRepData);
                    } else {
                        setRepPatienceData("");
                        patienceMax = 0;
                    }

                    // prepare rep owner_question_count data
                    if (res.owner_question_count.length !== 0) {
                        let newRepData = {};
                        for (const owner_question_count of res.owner_question_count) {
                            newRepData[owner_question_count.meeting__owner_id] =
                                cloneDeep(owner_question_count);
                            newRepData[
                                owner_question_count.meeting__owner_id
                            ].avg = parseFloat(owner_question_count.avg);
                            newRepData[
                                owner_question_count.meeting__owner_id
                            ].calls = owner_question_count.meeting_details;

                            let max = +parseFloat(
                                owner_question_count.max
                            ).toFixed(2);
                            if (max > questionRateMax) {
                                questionRateMax = max;
                            }
                        }
                        setRepQuestionRateData(newRepData);
                    } else {
                        setRepQuestionRateData("");
                        questionRateMax = 0;
                    }

                    // prepare max interactions data
                    setInteractionsMaxValues({
                        ...interactionsMaxValues,
                        longestMonologue: longestMonologueMax,
                        longestCustomerStory: longestCustomerStoryMax,
                        patience: patienceMax,
                        questionRate: questionRateMax,
                    });
                }
                setIsLoading(false);
            });
        },
        updateGraphData: () => {
            setIsLoading(true);
            props.getStats(fields, "day", false, props.repId).then((res) => {
                // prepare rep talkRatio chart
                if (
                    res.hasOwnProperty("owner_talk_ratio") &&
                    res.owner_talk_ratio.length !== 0
                ) {
                    let newChartData = {
                        xAxis: [],
                        yAxis: [],
                    };
                    for (const owner_talk_ratio of res.owner_talk_ratio) {
                        newChartData.xAxis.push(
                            getDMYDate(owner_talk_ratio.timestamp)
                        );
                        newChartData.yAxis.push(owner_talk_ratio.avg * 100);
                    }
                    setTalkRatioChart(newChartData);
                } else {
                    setTalkRatioChart({
                        xAxis: [],
                        yAxis: [],
                    });
                }

                // prepare rep longest_monologue_owner chart data
                if (
                    res.hasOwnProperty("longest_monologue_owner") &&
                    res.longest_monologue_owner.length !== 0
                ) {
                    let newChartData = {
                        xAxis: [],
                        yAxis: [],
                    };
                    for (const longest_monologue_owner of res.longest_monologue_owner) {
                        newChartData.xAxis.push(
                            getDMYDate(longest_monologue_owner.timestamp)
                        );
                        newChartData.yAxis.push(
                            longest_monologue_owner.avg / 60
                        );
                    }
                    setRepMonologueChart(newChartData);
                } else {
                    setRepMonologueChart({
                        xAxis: [],
                        yAxis: [],
                    });
                }

                // prepare rep longest_monologue_client chart data
                if (
                    res.hasOwnProperty("longest_monologue_client") &&
                    res.longest_monologue_client.length !== 0
                ) {
                    let newChartData = {
                        xAxis: [],
                        yAxis: [],
                    };
                    for (const longest_monologue_client of res.longest_monologue_client) {
                        newChartData.xAxis.push(
                            getDMYDate(longest_monologue_client.timestamp)
                        );
                        newChartData.yAxis.push(
                            longest_monologue_client.avg / 60
                        );
                    }
                    setClientMonologueChart(newChartData);
                } else {
                    setClientMonologueChart({
                        xAxis: [],
                        yAxis: [],
                    });
                }

                // prepare rep interactivity chart data
                if (
                    res.hasOwnProperty("interactivity") &&
                    res.interactivity.length !== 0
                ) {
                    let newChartData = {
                        xAxis: [],
                        yAxis: [],
                    };
                    for (const interactivity of res.interactivity) {
                        newChartData.xAxis.push(
                            getDMYDate(interactivity.timestamp)
                        );
                        newChartData.yAxis.push(interactivity.avg * 10);
                    }
                    setInteractivityChart(newChartData);
                } else {
                    setInteractivityChart({
                        xAxis: [],
                        yAxis: [],
                    });
                }

                // prepare rep patience data
                if (
                    res.hasOwnProperty("patience") &&
                    res.patience.length !== 0
                ) {
                    let newChartData = {
                        xAxis: [],
                        yAxis: [],
                    };
                    for (const patience of res.patience) {
                        newChartData.xAxis.push(getDMYDate(patience.timestamp));
                        newChartData.yAxis.push(patience.avg);
                    }
                    setPatienceChart(newChartData);
                } else {
                    setPatienceChart({
                        xAxis: [],
                        yAxis: [],
                    });
                }

                // prepare rep owner_question_count data
                if (
                    res.hasOwnProperty("owner_question_count") &&
                    res.owner_question_count.length !== 0
                ) {
                    let newChartData = {
                        xAxis: [],
                        yAxis: [],
                    };
                    for (const owner_question_count of res.owner_question_count) {
                        newChartData.xAxis.push(
                            getDMYDate(owner_question_count.timestamp)
                        );
                        newChartData.yAxis.push(owner_question_count.avg);
                    }
                    setQuestionRateChart(newChartData);
                } else {
                    setQuestionRateChart({
                        xAxis: [],
                        yAxis: [],
                    });
                }

                setIsLoading(false);
            });
        },

        addRepGraphData: (repId) => {
            setIsLoadingRepGraph(true);
            props.getStats(fields, "day", false, repId).then((res) => {
                // prepare rep talkRatio chart
                if (
                    res.hasOwnProperty("owner_talk_ratio") &&
                    res.owner_talk_ratio.length !== 0
                ) {
                    let newChartData = {
                        xAxis: [],
                        yAxis: [],
                    };
                    for (const owner_talk_ratio of res.owner_talk_ratio) {
                        newChartData.xAxis.push(owner_talk_ratio.epoch);
                        newChartData.yAxis.push(owner_talk_ratio.avg * 100);
                    }
                    let newRepData = cloneDeep(repTalkRatioData);
                    if (!newRepData[repId].graphs) {
                        newRepData[repId].graphs = {};
                    }
                    newRepData[repId].graphs.talkRatio = newChartData;
                    setRepTalkRatioData(newRepData);
                }

                // prepare rep longest_monologue_owner chart data
                if (
                    res.hasOwnProperty("longest_monologue_owner") &&
                    res.longest_monologue_owner.length !== 0
                ) {
                    let newChartData = {
                        xAxis: [],
                        yAxis: [],
                    };
                    for (const longest_monologue_owner of res.longest_monologue_owner) {
                        newChartData.xAxis.push(longest_monologue_owner.epoch);
                        newChartData.yAxis.push(
                            longest_monologue_owner.avg / 60
                        );
                    }
                    let newRepData = cloneDeep(repMonologueRepData);
                    if (!newRepData[repId].graphs) {
                        newRepData[repId].graphs = {};
                    }
                    newRepData[repId].graphs.longestMonologue = newChartData;
                    setRepMonologueRepData(newRepData);
                }

                // prepare rep longest_monologue_client chart data
                if (
                    res.hasOwnProperty("longest_monologue_client") &&
                    res.longest_monologue_client.length !== 0
                ) {
                    let newChartData = {
                        xAxis: [],
                        yAxis: [],
                    };
                    for (const longest_monologue_client of res.longest_monologue_client) {
                        newChartData.xAxis.push(longest_monologue_client.epoch);
                        newChartData.yAxis.push(
                            longest_monologue_client.avg / 60
                        );
                    }
                    let newRepData = cloneDeep(repMonologueClientData);
                    if (!newRepData[repId].graphs) {
                        newRepData[repId].graphs = {};
                    }
                    newRepData[repId].graphs.longestCustomerStory =
                        newChartData;
                    setRepMonologueClientData(newRepData);
                }

                // prepare rep interactivity chart data
                if (
                    res.hasOwnProperty("interactivity") &&
                    res.interactivity.length !== 0
                ) {
                    let newChartData = {
                        xAxis: [],
                        yAxis: [],
                    };
                    for (const interactivity of res.interactivity) {
                        newChartData.xAxis.push(interactivity.epoch);
                        newChartData.yAxis.push(interactivity.avg * 10);
                    }
                    let newRepData = cloneDeep(repInteractivityData);
                    if (!newRepData[repId].graphs) {
                        newRepData[repId].graphs = {};
                    }
                    newRepData[repId].graphs.interactivity = newChartData;
                    setRepInteractivityData(newRepData);
                }

                // prepare rep patience data
                if (
                    res.hasOwnProperty("patience") &&
                    res.patience.length !== 0
                ) {
                    let newChartData = {
                        xAxis: [],
                        yAxis: [],
                    };
                    for (const patience of res.patience) {
                        newChartData.xAxis.push(patience.epoch);
                        newChartData.yAxis.push(patience.avg);
                    }
                    let newRepData = cloneDeep(repPatienceData);
                    if (!newRepData[repId].graphs) {
                        newRepData[repId].graphs = {};
                    }
                    newRepData[repId].graphs.patience = newChartData;
                    setRepPatienceData(newRepData);
                }

                // prepare rep owner_question_count data
                if (
                    res.hasOwnProperty("owner_question_count") &&
                    res.owner_question_count.length !== 0
                ) {
                    let newChartData = {
                        xAxis: [],
                        yAxis: [],
                    };
                    for (const owner_question_count of res.owner_question_count) {
                        newChartData.xAxis.push(
                            getDMYDate(owner_question_count.timestamp)
                        );
                        newChartData.yAxis.push(owner_question_count.avg);
                    }
                    // setQuestionRateChart(newChartData)
                    let newRepData = cloneDeep(repQuestionRateData);
                    if (!newRepData[repId].graphs) {
                        newRepData[repId].graphs = {};
                    }
                    newRepData[repId].graphs.questionRate = newChartData;
                    setRepQuestionRateData(newRepData);
                }

                setIsLoadingRepGraph(false);
            });
        },

        handleActiveTeamCardInteractions: (tabIndex) => {
            setActiveTeamCardInteractions(tabIndex);
            setTimeout(() => {
                scrollElementInView(
                    ".stats-activity-member-section-wrapper .stats-activity-member-section-content:first-of-type"
                );
            }, 0);
        },
    };

    return (
        // <Spinner loading={isLoading} tip="Loading...">
        <>
            {showingSampleData && (
                <SampleDataBanner desc="You are viewing sample data. Some actions may not work" />
            )}
            <Interactions
                repsOptions={
                    showingSampleData ? getMappedReps() : props.repsOptions
                }
                activestatsRep={props.activestatsRep}
                handleRepsChange={props.handleRepsChange}
                teamCardsInteractions={
                    statisticsConfig.TEAM_CARD_TABS_INTERACTIONS
                }
                activeTeamCardInteractions={activeTeamCardInteractions}
                handleActiveTeamCardInteractions={
                    handlers.handleActiveTeamCardInteractions
                }
                xAxis={graphData.xAxis}
                yAxis={graphData.yAxis}
                xAxisLabel={graphData.xAxisLabel}
                yAxisLabel={graphData.yAxisLabel}
                activeTeam={props.activeTeam}
                isLoading={isLoading}
                tileData={tileData}
                repTalkRatioData={repTalkRatioData}
                repMonologueClientData={repMonologueClientData}
                repMonologueRepData={repMonologueRepData}
                repInteractivityData={repInteractivityData}
                repPatienceData={repPatienceData}
                repQuestionRateData={repQuestionRateData}
                interactionsMaxValues={interactionsMaxValues}
                addRepGraphData={handlers.addRepGraphData}
                isLoadingRepGraph={isLoadingRepGraph}
                showingSampleData={showingSampleData}
            />
        </>
        // </Spinner>
    );
}
