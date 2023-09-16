import dashboardConfig from "@constants/Dashboard/index";
import { formatFloat, getColor, months } from "@tools/helpers";

export const getBarData = (data) => {
    const newData = data.map((item) => ({
        ...item,
        remmaining: 100 - item.average,
    }));
    return newData;
};

/* Maintain the order of keys when calling this function*/
export const getPieData = (data, keys = [], colors = {}) => {
    const temp = [];

    try {
        for (let key of keys) {
            temp.push({
                id: key,
                label: key,
                value: formatFloat(
                    (data?.[key]?.count / data?.total?.count) * 100,
                    2
                ),

                count: data?.[key]?.count,
                trend: formatFloat(data?.[key]?.change, 2),
                color: colors[key],
            });
        }
        // check for completed calls and dialed calls keys in data object
        if ("Completed Calls" in data && "All Calls" in data) {
            // temp.push({
            //     id: 'Completed Calls',
            //     label: 'Completed Calls',
            //     value: data?.['Completed Calls'],
            // });
            // temp.push({
            //     id: 'All Calls',
            //     label: 'All Calls',
            //     value: data?.['All Calls'],
            // });
        }

        return temp;
    } catch (err) {
        console.log(err);
        return [];
    }
};

export const getLineData = (items, is_multiple) => {
    let prev = null;
    const graphData = [];
    try {
        for (let i = 0; i < items.length; i++) {
            graphData.push({
                ...items[i],
                data:
                    items[i]?.data?.map?.(({ epoch, average }, idx) => ({
                        x: `${new Date(epoch).getDate()} ${
                            months[new Date(epoch).getMonth()]
                        }`,
                        y: formatFloat(average, 2),
                        name: items[i].name,
                        trend:
                            idx === 0
                                ? null
                                : formatFloat(
                                      (average -
                                          items[i]?.data[idx - 1]?.average) /
                                          items[i]?.data[idx - 1]?.average,
                                      2
                                  ),
                    })) || [],
            });
        }

        return graphData;
    } catch (err) {
        console.log(err);
        return [];
    }
};

export const getMultiLineData = (items, is_multiple) => {
    let prev = null;
    const res = [];
    if (!items.length) return [];
    for (let i = 0; i < items.length; i++) {
        const {
            colors: { good_cl, bad_cl, avg_cl },
        } = dashboardConfig;
        const { data } = items[i];
        let graph_data = [
            {
                id: "good",
                label: "good",
                name: "good",
                color: good_cl,
                data: [],
            },
            {
                id: "average",
                label: "average",
                name: "average",
                color: avg_cl,
                data: [],
            },
            {
                id: "bad",
                label: "bad",
                name: "bad",
                color: bad_cl,
                data: [],
            },
        ];

        for (let j = 0; j < data?.length; j++) {
            const { epoch, good, bad, average } = data[j];
            if (j === 0) {
                graph_data[0]?.data.push({
                    x: `${new Date(epoch).getDate()} ${
                        months[new Date(epoch).getMonth()]
                    }`,
                    y: good,
                    trend: null,
                });
                graph_data[1]?.data.push({
                    x: `${new Date(epoch).getDate()} ${
                        months[new Date(epoch).getMonth()]
                    }`,
                    y: average,
                    trend: null,
                });
                graph_data[2]?.data.push({
                    x: `${new Date(epoch).getDate()} ${
                        months[new Date(epoch).getMonth()]
                    }`,
                    y: bad,
                    trend: null,
                });
            } else {
                const {
                    good: prev_good,
                    bad: prev_bad,
                    average: prev_average,
                } = data?.[j - 1];
                graph_data[0]?.data.push({
                    x: `${new Date(epoch).getDate()} ${
                        months[new Date(epoch).getMonth()]
                    }`,
                    y: good,
                    trend: formatFloat((good - prev_good) / prev_good, 2),
                });
                graph_data[1]?.data.push({
                    x: `${new Date(epoch).getDate()} ${
                        months[new Date(epoch).getMonth()]
                    }`,
                    y: average,
                    trend: formatFloat(
                        (average - prev_average) / prev_average,
                        2
                    ),
                });
                graph_data[2]?.data.push({
                    x: `${new Date(epoch).getDate()} ${
                        months[new Date(epoch).getMonth()]
                    }`,
                    y: bad,
                    trend: formatFloat((bad - prev_bad) / prev_bad, 2),
                });
            }
        }

        res.push({
            ...items[i],
            data: graph_data,
        });
    }

    return res;
};

export const getMultiLineLeadScoreData = (items, is_multiple) => {
    let prev = null;
    const res = [];
    if (!items.length) return [];
    try {
        for (let i = 0; i < items.length; i++) {
            const { colors } = dashboardConfig;
            const { data } = items[i];
            let graph_data = [
                {
                    id: "hot",
                    label: "hot",
                    name: "hot",
                    color: colors.hot,
                    data: [],
                },
                {
                    id: "warm",
                    label: "warm",
                    name: "warm",
                    color: colors.warm,
                    data: [],
                },
                {
                    id: "cold",
                    label: "cold",
                    name: "cold",
                    color: colors.cold,
                    data: [],
                },
            ];

            for (let j = 0; j < data?.length; j++) {
                const { epoch, hot, warm, cold } = data[j];
                if (j === 0) {
                    graph_data[0]?.data.push({
                        x: `${new Date(epoch).getDate()} ${
                            months[new Date(epoch).getMonth()]
                        }`,
                        y: hot,
                        trend: null,
                    });
                    graph_data[1]?.data.push({
                        x: `${new Date(epoch).getDate()} ${
                            months[new Date(epoch).getMonth()]
                        }`,
                        y: warm,
                        trend: null,
                    });
                    graph_data[2]?.data.push({
                        x: `${new Date(epoch).getDate()} ${
                            months[new Date(epoch).getMonth()]
                        }`,
                        y: cold,
                        trend: null,
                    });
                } else {
                    const {
                        hot: prev_hot,
                        warm: prev_warm,
                        cold: prev_cold,
                    } = data?.[j - 1];
                    graph_data[0]?.data.push({
                        x: `${new Date(epoch).getDate()} ${
                            months[new Date(epoch).getMonth()]
                        }`,
                        y: hot,
                        trend: formatFloat((hot - prev_hot) / prev_hot, 2),
                    });
                    graph_data[1]?.data.push({
                        x: `${new Date(epoch).getDate()} ${
                            months[new Date(epoch).getMonth()]
                        }`,
                        y: warm,
                        trend: formatFloat((warm - prev_warm) / prev_warm, 2),
                    });
                    graph_data[2]?.data.push({
                        x: `${new Date(epoch).getDate()} ${
                            months[new Date(epoch).getMonth()]
                        }`,
                        y: cold,
                        trend: formatFloat((cold - prev_cold) / prev_cold, 2),
                    });
                }
            }

            res.push({
                ...items[i],
                data: graph_data,
            });
        }

        return res;
    } catch (err) {
        console.log(err);
        return [];
    }
};
export const getMultiLineViolationsData = (items, violations) => {
    let graph_data = [];

    try {
        for (let i = 0; i < items.length; i++) {
            graph_data.push({
                ...items[i],
                color: getColor(items[i].name),
                data: items[i].data?.map(({ epoch, average }, idx) => ({
                    x: `${new Date(epoch).getDate()} ${
                        months[new Date(epoch).getMonth()]
                    }`,
                    y: average,
                    name: items[i].name,
                    trend:
                        idx === 0
                            ? null
                            : formatFloat(
                                  (average - items[i]?.data[idx - 1]?.average) /
                                      items[i]?.data[idx - 1]?.average,
                                  2
                              ),
                })),
            });
        }

        return graph_data;
    } catch (err) {
        console.log(err);
        return [];
    }
};

//Removes keys with zero values
export const formatViolationComposition = (data) => {
    for (let i = 0; i < data.length; i++) {
        const keys = Object.keys(data[0]).filter(
            (key) => key !== "id" || key !== "name"
        );
        if (!keys.length) continue;

        for (let j = 0; j < keys.length; j++) {
            if (!keys[j].includes("change")) {
                if (data[i][keys[j]]) {
                } else {
                    delete data[i][keys[j]];
                    delete data[i][`${keys[j]}_change`];
                }
            }
        }
    }
    return data;
};
