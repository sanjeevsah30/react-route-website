import { formatFloat } from "@convin/utils/helper";
import { auditColors } from "theme/palette";

export const formatCIGraphData = (arr) => {
    const series = [];

    let max = 0;
    if (arr?.length) {
        const keys = Object.keys(arr?.[0] || {}).filter(
            (key) => key !== "date"
        );
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
                                x: new Date(
                                    new Date(
                                        new Date(arr[i].date)
                                    ).toUTCString()
                                ).toISOString(),

                                y: arr[i][keys[j]] || 0,
                            },
                        ],
                    };
                }
            }
        }
        return series;
    }
    return [];
};

export const formatOverallAnalysisLineGraph = ({ data }) => {
    let graph_data = [
        {
            id: "good",
            label: "good",
            name: "good",
            color: auditColors.good,
            data: [],
        },
        {
            id: "average",
            label: "average",
            name: "average",
            color: auditColors.average,
            data: [],
        },
        {
            id: "Need Attention",
            label: "Need Attention",
            name: "Need Attention",
            color: auditColors.bad,
            data: [],
        },
        {
            id: "Overall Avg Call Score",
            label: "Overall Avg Call Score",
            name: "Overall Avg Call Score",
            color: "#1a62f2",
            data: [],
        },
    ];

    for (let i = 0; i < data?.length; i += 1) {
        const { epoch, good, bad, average, overall_average } = data[i];

        if (i === 0) {
            graph_data[0]?.data.push({
                x: new Date(epoch),
                y: good,
                trend: null,
            });
            graph_data[1]?.data.push({
                x: new Date(epoch),
                y: average,
                trend: null,
            });
            graph_data[2]?.data.push({
                x: new Date(epoch),
                y: bad,
                trend: null,
            });
            graph_data[3]?.data.push({
                x: new Date(epoch),
                y: overall_average,
                trend: null,
            });
        } else {
            const {
                good: prev_good,
                bad: prev_bad,
                average: prev_average,
                overall_average: prev_overall_average,
            } = data?.[i - 1];
            graph_data[0]?.data.push({
                x: new Date(epoch),
                y: good,
                trend: formatFloat((good - prev_good) / prev_good, 2),
            });
            graph_data[1]?.data.push({
                x: new Date(epoch),
                y: average,
                trend: formatFloat((average - prev_average) / prev_average, 2),
            });
            graph_data[2]?.data.push({
                x: new Date(epoch),
                y: bad,
                trend: formatFloat((bad - prev_bad) / prev_bad, 2),
            });
            graph_data[3]?.data.push({
                x: new Date(epoch),
                y: overall_average,
                trend: formatFloat(
                    (overall_average - prev_overall_average) /
                        prev_overall_average,
                    2
                ),
            });
        }
    }
    return graph_data;
};
