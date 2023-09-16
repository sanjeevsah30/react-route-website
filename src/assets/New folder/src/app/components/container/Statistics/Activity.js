import React, { useState, useEffect, useRef, useContext } from "react";
import statisticsConfig from "@constants/Statistics/index";
import Activity from "@presentational/Statistics/Activity";
import { cloneDeep } from "lodash";
import usePrevious from "hooks/usePrevious";
import { Spinner } from "@presentational/reusables";
import { useSelector } from "react-redux";
import { ACTIVITY_TILE_DATA, getMappedReps } from "./__mock__/mock";
import SampleDataBanner from "@presentational/reusables/SampleDataBanner";
import { HomeContext, MeetingTypeConst } from "@container/Home/Home";

export default function ActivityContainer(props) {
    const fields = ["duration", "volume"];
    const didFiltersChange = useSelector(
        (state) => state.common.didFiltersChange
    );
    const { meetingType } = useContext(HomeContext);
    const [showingSampleData, setShowingSampleData] = useState(false);
    const [activeTeamCardActivity, setActiveTeamCardActivity] = useState(0);
    const [tileData, setTileData] = useState({
        callDuration: 0,
        totalCallVolume: 0,
        totalCallDuration: 0,
    });
    const [activityMaxValues, setActivityMaxValues] = useState({
        callDuration: 0,
        totalCallVolume: 0,
        totalCallDuration: 0,
    });
    const [repDurationData, setRepDurationData] = useState("");
    const [repVolumeData, setRepVolumeData] = useState("");
    const [avgDurationChart, setAvgDurationChart] = useState({
        xAxis: [],
        yAxis: [],
    });
    const [totalDurationChart, setTotalDurationChart] = useState({
        xAxis: [],
        yAxis: [],
    });
    const [totalVolumeChart, setTotalVolumeChart] = useState({
        xAxis: [],
        yAxis: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isGraphLoading, setIsGraphLoading] = useState(true);
    const isInitialMount = useRef(true);

    // graph data
    const [graphData, setGraphData] = useState({
        xAxis: [],
        yAxis: [],
        xAxisLabel: "",
        yAxisLabel: "",
    });

    const prevRepId = usePrevious(props.repId);

    const {
        common: { activeCallTag },
    } = useSelector((state) => state);

    useEffect(() => {
        // on rep change fetch tile data and rep trend
        if (props.repId || prevRepId) {
            handlers.triggerViewUpdate();
        }
    }, [props.repId]);

    useEffect(() => {
        // on rep change fetch tile data and rep trend
        if (meetingType) {
            handlers.triggerViewUpdate();
        }
    }, [meetingType]);

    useEffect(() => {
        // on team change fetch tile data
        // handlers.triggerViewUpdate();
    }, [props.teamId, activeCallTag]);

    useEffect(() => {
        // on call duration and date change fetch tile data
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            handlers.triggerViewUpdate();
        }
    }, [props.callDuration, props.dateArr, props.teamId, activeCallTag]);

    useEffect(() => {
        // on team change fetch tile data
        if (activeTeamCardActivity === 0) {
            const temp =
                meetingType === MeetingTypeConst.chat
                    ? totalVolumeChart
                    : avgDurationChart;
            setGraphData({
                ...temp,
                // ...avgDurationChart,
                xAxisLabel:
                    meetingType === MeetingTypeConst.chat
                        ? statisticsConfig.TEAM_CARD_TABS_ACTIVITY_ON_CHAT[0]
                              .xLabel
                        : statisticsConfig.TEAM_CARD_TABS_ACTIVITY[0].xLabel,
                yAxisLabel:
                    meetingType === MeetingTypeConst.chat
                        ? statisticsConfig.TEAM_CARD_TABS_ACTIVITY_ON_CHAT[0]
                              .yLabel
                        : statisticsConfig.TEAM_CARD_TABS_ACTIVITY[0].yLabel,
            });
        } else if (activeTeamCardActivity === 1) {
            setGraphData({
                ...totalVolumeChart,
                xAxisLabel: statisticsConfig.TEAM_CARD_TABS_ACTIVITY[1].xLabel,
                yAxisLabel: statisticsConfig.TEAM_CARD_TABS_ACTIVITY[1].yLabel,
            });
        } else {
            setGraphData({
                ...totalDurationChart,
                xAxisLabel: statisticsConfig.TEAM_CARD_TABS_ACTIVITY[2].xLabel,
                yAxisLabel: statisticsConfig.TEAM_CARD_TABS_ACTIVITY[2].yLabel,
            });
        }
    }, [
        activeTeamCardActivity,
        avgDurationChart,
        totalDurationChart,
        totalVolumeChart,
    ]);

    useEffect(() => {
        setActiveTeamCardActivity(0);
    }, [meetingType]);

    const handlers = {
        triggerViewUpdate: () => {
            handlers.updateTileData();
            // handlers.updateRepsData();
            handlers.updateGraphData();
        },
        getPreparedTileData: (data) => {
            return {
                callDuration:
                    !!data.overall_avg === false
                        ? 0
                        : +(parseFloat(data.overall_avg) / 60).toFixed(2),
                totalCallDuration:
                    !!data.total_duration === false
                        ? 0
                        : +(parseFloat(data.total_duration) / 60).toFixed(2),
                totalCallVolume:
                    !!data.total_volume === false
                        ? 0
                        : +parseFloat(data.total_volume).toFixed(2),
            };
        },
        updateTileData: () => {
            setIsLoading(true);
            props
                .getStatsTiles(fields, null, false, props.repId)
                .then((res) => {
                    if (!res.status) {
                        setTileData(handlers.getPreparedTileData(res));
                        const updateRepVolumeData = (data = []) => {
                            let newRepData = {};
                            for (const user_stat of data) {
                                newRepData[user_stat.id] = cloneDeep(user_stat);
                                newRepData[user_stat.id].sum =
                                    +user_stat.volume.toFixed(2);
                                let sum = parseFloat(user_stat.volume);
                                if (sum > volumeMaxSum) {
                                    volumeMaxSum = sum;
                                }
                            }
                            setRepVolumeData(newRepData);
                        };
                        const updateRepDurationData = (data = []) => {
                            let newRepData = {};
                            for (const user_stat of data) {
                                user_stat.avg = +(user_stat.avg / 60).toFixed(
                                    2
                                );
                                user_stat.sum = +(
                                    user_stat.duration / 60
                                ).toFixed(2);
                                newRepData[user_stat.id] = cloneDeep(user_stat);
                                let sum = parseFloat(user_stat.sum);
                                let avg = +parseFloat(user_stat.avg).toFixed(2);
                                if (sum > durationMaxSum) {
                                    durationMaxSum = sum;
                                }
                                if (avg > durationAvg) {
                                    durationAvg = avg;
                                }
                            }
                            setRepDurationData(newRepData);
                        };
                        let durationMaxSum = 0,
                            volumeMaxSum = 0,
                            durationAvg = 0;
                        if (
                            res.hasOwnProperty("data") &&
                            res?.data?.length !== 0
                        ) {
                            updateRepDurationData(res?.data);
                        } else if (!didFiltersChange) {
                            // updateRepDurationData(ACTIVITY_REPS_DATA);
                            updateRepDurationData();
                        } else {
                            setRepDurationData("");
                            durationMaxSum = 0;
                            durationAvg = 0;
                        }

                        // prepare rep volume data
                        if (
                            res.hasOwnProperty("data") &&
                            res?.data?.length !== 0
                        ) {
                            updateRepVolumeData(res?.data);
                        } else if (!didFiltersChange) {
                            // updateRepVolumeData(ACTIVITY_REPS_DATA);
                            updateRepVolumeData();
                        } else {
                            setRepVolumeData("");
                            volumeMaxSum = 0;
                        }

                        // Set Activity Max Values
                        setActivityMaxValues({
                            callDuration: durationAvg,
                            totalCallVolume: volumeMaxSum,
                            totalCallDuration: durationMaxSum,
                        });

                        setIsLoading(false);
                    }
                });
        },

        updateGraphData: () => {
            setIsGraphLoading(true);
            props
                .getStatsGraph(fields, "day", false, props.repId)
                .then((res) => {
                    if (!res.status) {
                        const setDurationGraph = (data) => {
                            let newavgDurationChart = {
                                xAxis: [],
                                yAxis: [],
                            };
                            let newtotalDurationChart = {
                                xAxis: [],
                                yAxis: [],
                            };
                            for (const graph_stats of data) {
                                newavgDurationChart.xAxis.push(
                                    graph_stats.epoch / 1000
                                );
                                newtotalDurationChart.xAxis.push(
                                    graph_stats.epoch / 1000
                                );
                                newavgDurationChart.yAxis.push(
                                    graph_stats.average / 60
                                );
                                newtotalDurationChart.yAxis.push(
                                    graph_stats.duration / 60
                                );
                            }
                            setAvgDurationChart(newavgDurationChart);
                            setTotalDurationChart(newtotalDurationChart);
                        };
                        const setVolumeGraph = (data = []) => {
                            let newtotalVolumeChart = {
                                xAxis: [],
                                yAxis: [],
                            };
                            for (const graph_stats of data) {
                                newtotalVolumeChart.xAxis.push(
                                    graph_stats.epoch / 1000
                                );
                                newtotalVolumeChart.yAxis.push(
                                    graph_stats.volume
                                );
                            }
                            setTotalVolumeChart(newtotalVolumeChart);
                        };
                        if (res?.length !== 0) {
                            setDurationGraph(res);
                            setShowingSampleData(false);
                        } else if (!didFiltersChange) {
                            setShowingSampleData(true);
                            setDurationGraph([]);
                        } else {
                            setAvgDurationChart({
                                xAxis: [],
                                yAxis: [],
                            });
                            setTotalDurationChart({
                                xAxis: [],
                                yAxis: [],
                            });
                        }

                        // prepare volume chart data
                        if (res?.length !== 0) {
                            setVolumeGraph(res);
                            setShowingSampleData(false);
                        } else if (!didFiltersChange) {
                            setShowingSampleData(true);
                            // setVolumeGraph(ACTIVITY_GRAPH_DATA);
                            setVolumeGraph([]);
                        } else {
                            setTotalVolumeChart({
                                xAxis: [],
                                yAxis: [],
                            });
                        }

                        setIsGraphLoading(false);
                    }
                });
        },
        handleActiveTeamCardActivity: (tabIndex) => {
            setActiveTeamCardActivity(tabIndex);
            // setTimeout(() => {
            //     scrollElementInView(
            //         '.stats-activity-member-section-wrapper .stats-activity-member-section-content:first-child'
            //     );
            // }, 0);
        },
    };

    const children = (
        <>
            {showingSampleData && (
                <SampleDataBanner desc="You are viewing sample data. Some actions may not work" />
            )}
            <Activity
                teamCardsActivity={
                    meetingType === "chat"
                        ? statisticsConfig.TEAM_CARD_TABS_ACTIVITY_ON_CHAT
                        : statisticsConfig.TEAM_CARD_TABS_ACTIVITY
                }
                repsOptions={
                    showingSampleData ? getMappedReps() : props.repsOptions
                }
                activestatsRep={props.activestatsRep}
                handleRepsChange={props.handleRepsChange}
                activeTeamCardActivity={activeTeamCardActivity}
                tileData={
                    showingSampleData
                        ? handlers.getPreparedTileData(ACTIVITY_TILE_DATA)
                        : tileData
                }
                activityMaxValues={activityMaxValues}
                repDurationData={repDurationData}
                repVolumeData={repVolumeData}
                handleActiveTeamCardActivity={
                    handlers.handleActiveTeamCardActivity
                }
                xAxis={graphData.xAxis}
                yAxis={graphData.yAxis}
                xAxisLabel={graphData.xAxisLabel}
                yAxisLabel={graphData.yAxisLabel}
                activeTeam={props.activeTeam}
                isLoading={isLoading}
                isGraphLoading={isGraphLoading}
                showingSampleData={showingSampleData}
            />
        </>
    );

    return (
        <>
            {
                <Spinner loading={isLoading} tip="Loading...">
                    {children}
                </Spinner>
            }
        </>
    );
}
