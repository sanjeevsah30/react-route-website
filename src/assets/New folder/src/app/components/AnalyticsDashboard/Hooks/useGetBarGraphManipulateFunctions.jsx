import dashboardConfig from "@constants/Dashboard/index";
import { uid } from "@tools/helpers";
import React, { useCallback } from "react";

const RATIO = 0.2;

export default function useGetBarGraphManipulateFunctions() {
    const { primary_cl, danger_cl, colors } = dashboardConfig;

    /* We have to add dummy data as the graph libray's bar graph takes the height of the 
    parent conatainer and the data length to calculate each bar height. If we don't add dummy data 
    then suppose we have only one data then the bar height of that data will be almost the entire graph.
     
    To see the affects of not adding dummy data just remove the new Array(5-data.length) from the return statement
    */
    const getTopFive = useCallback(
        ({
            data,
            keys = { average: 0, change: 0 },
            data_to_top = true,
            showAll = false,
            use_color,
        }) => {
            // const colors = [
            //     primary_cl,
            //     '#5389f5',
            //     '#709df7',
            //     '#8db1f8',
            //     '#c6d8fc',
            // ];

            if (data?.length && data.length < 5) {
                if (data_to_top)
                    return [
                        ...new Array(5 - data.length).fill(0).map(() => ({
                            name: "",
                            id: uid(),
                            hide: true,
                            ...keys,
                        })),
                        ...data
                            .map((item, idx) => ({
                                ...item,
                                color: showAll
                                    ? primary_cl
                                    : use_color || primary_cl,
                            }))
                            .reverse(),
                    ];
                else
                    return [
                        ...data
                            .map((item, idx) => ({
                                ...item,
                                color: showAll
                                    ? primary_cl
                                    : use_color || primary_cl,
                            }))
                            .reverse(),
                        ...new Array(5 - data.length).fill(0).map(() => ({
                            name: "",
                            id: uid(),
                            hide: true,
                            ...keys,
                        })),
                    ];
            }

            if (data?.length >= 5) {
                return data
                    .slice(0, 5)
                    .map((item, idx) => ({
                        ...item,
                        color: showAll ? primary_cl : use_color || primary_cl,
                    }))
                    .reverse();
            }

            return data;
        },
        []
    );

    const showAllData = ({
        data = [],
        use_color = primary_cl,
        color_on_performance,
    }) => {
        if (!data.length) return [];
        let temp = [];
        if (data.length && data.length < 5) {
            temp = getTopFive({ data, showAll: true, use_color });
            const hidden = temp.filter((item) => item.hide);
            const actualData = temp.filter((item) => !item.hide);

            const mid = actualData.slice(
                Math.ceil(actualData.length * RATIO),
                actualData.length - 1 - Math.floor(actualData.length * RATIO)
            );
            const bottom = actualData?.slice(
                0,
                Math.ceil(actualData.length * RATIO)
            );
            const top = actualData?.slice(
                actualData.length - Math.ceil(actualData.length * RATIO)
            );

            return color_on_performance
                ? [
                      ...hidden,
                      ...bottom.map((item) => ({
                          ...item,
                          color: colors.bad_cl,
                      })),

                      ...mid.map((item) => ({ ...item, color: colors.avg_cl })),
                      ...top.map((item) => ({
                          ...item,
                          color: colors.good_cl,
                      })),
                  ]
                : temp;
        }

        temp = [
            ...data.map((item, idx) =>
                idx === 0
                    ? { ...item, color: primary_cl }
                    : { ...item, color: primary_cl }
            ),
        ];

        return color_on_performance
            ? temp
                  .map((item, idx) => {
                      return !item.hide
                          ? {
                                ...item,
                                color:
                                    idx <= Math.floor(data.length * RATIO)
                                        ? colors.good_cl
                                        : idx >=
                                          Math.floor(data.length * (1 - RATIO))
                                        ? colors.bad_cl
                                        : colors.avg_cl,
                            }
                          : item;
                  })
                  .reverse()
            : temp.reverse();
    };

    /* We have to add dummy data as the graph libray's bar graph takes the height of the 
    parent conatainer and the data length to calculate each bar height. If we don't add dummy data 
    then suppose we have only one data then the bar height of that data will be almost the entire graph.
     
    To see the affects of not adding dummy data just remove the new Array(5-data.length) from the return statement
    */
    const getBottomFive = useCallback(({ data, use_color }) => {
        const colors = ["#05299E", "#5E4AE3", "#947BD3", "#F0A7A0", "#F26CA7"];
        if (data?.length && data.length < 5) {
            return [
                ...new Array(5 - data.length).fill(0).map(() => ({
                    name: "",
                    id: uid(),
                    hide: true,
                    average: 0,
                    change: 0,
                })),
                ...data.map((item, idx) =>
                    idx === data.length - 1
                        ? { ...item, color: use_color || danger_cl }
                        : { ...item, color: use_color || colors[idx] }
                ),
            ];
        }

        if (data?.length >= 5) {
            return [...data]
                .reverse()
                .slice(0, 5)
                .map((item, idx) =>
                    idx === 0
                        ? { ...item, color: use_color || danger_cl }
                        : { ...item, color: use_color || colors[idx] }
                )
                .reverse();
        }

        return data;
    }, []);

    /* Add primary color or danger color to the first line data depending on the order i.e asc.dsc
      and remaing line data will be gray*/
    /* Add primary color or danger color to the first line data depending on the order i.e asc.dsc
      and remaing line data color will be from the colors list*/
    const lineGraphAddColor = ({
        data = [],
        show_all = false,
        is_top_five = true,
        use_color,
        color_on_performance = false,
    }) => {
        if (!data.length) return [];
        // const colors = [primary_cl, '#5389f5', '#709df7', '#8db1f8', '#c6d8fc'];
        const pallet = ["#702963", "#E0115F", "#00A86B", "#FF7417", "#997950"];

        if (color_on_performance) {
            const mid = data.slice(
                Math.ceil(data.length * RATIO),
                data.length - 1 - Math.floor(data.length * RATIO)
            );
            const top = data?.slice(0, Math.ceil(data.length * RATIO));
            const bottom = data?.slice(
                data.length - Math.ceil(data.length * RATIO)
            );

            return [
                ...top.map((item) => ({
                    ...item,
                    color: colors.good_cl,
                    label: item.name,
                    message: item.name,
                })),
                ...mid.map((item) => ({ ...item, color: colors.avg_cl })),
                ...bottom.map((item) => ({
                    ...item,
                    color: colors.bad_cl,
                    label: item.name,
                    message: item.name,
                })),
            ];
        }

        const temp = data.map((data, idx) => ({
            ...data,
            color: pallet[idx % 5],
            label: data.name,
            message: data.name,
        }));

        if (show_all) {
            temp[0].color = primary_cl;
            return temp;
        }

        if (is_top_five) {
            // temp[0].color = primary_cl;
            return temp.slice(0, 5);
        } else {
            temp.reverse();
            temp[0].color = danger_cl;
            return temp.slice(0, 5);
        }
    };

    return { getBottomFive, getTopFive, showAllData, lineGraphAddColor };
}
