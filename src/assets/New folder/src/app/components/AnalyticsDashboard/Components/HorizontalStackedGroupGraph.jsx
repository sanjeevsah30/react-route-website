import React, { useContext, useEffect, useState } from "react";
// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/bar
import { Select, Tooltip } from "antd";
import { formatFloat, getDateTime } from "@tools/helpers";
import { useSelector } from "react-redux";
import Icon from "@presentational/reusables/Icon";
import RenderLabels from "./RenderLabels";
import { HomeDashboardContext } from "../Context/HomeDashboardContext";
import EmptyDataState from "./EmptyDataState";
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const { Option } = Select;

const HorizontalStackedGroupGraph = ({
    colors,
    mode = "horizontal",
    default_keys,
    show_all = false,

    widthMd,
    onClick,
    cursor_pointer,
    first_key,
    onLabelClick,
    barClick = () => {},
}) => {
    const { get_dashboard_label } = useContext(HomeDashboardContext);
    //widthMd if card size is less than 500 then it will be true else it will be false. We use the resizeobserever to get width of the card
    const {
        rep_data: { rep_details_data },
        rep_details_data_err,
    } = useSelector((state) => state.dashboard);

    const [keys, setKeys] = useState([]);

    const [data, setData] = useState([]);

    const [matrice, setMatrice] = useState("overall_avg");

    useEffect(() => {
        var maxLen = 0,
            maxIn = 0;
        rep_details_data?.forEach((rep, index) => {
            const len = rep?.data?.length || 0;
            if (maxLen < len) {
                maxLen = len;
                maxIn = index;
            }
        });

        if (rep_details_data?.[maxIn]?.data?.length) {
            let defaultVals;
            rep_details_data?.[maxIn]?.data?.forEach(({ epoch }) => {
                defaultVals = { [epoch?.toString()]: 0, ...defaultVals };
            });
            setKeys([
                ...rep_details_data?.[maxIn]?.data?.map(({ epoch }) =>
                    epoch?.toString()
                ),
            ]);
            rep_details_data?.[0]?.data?.map(({ epoch, average }) => ({
                ...rep_details_data?.[0],
                [epoch]: average,
            }));
            let temp = [];
            for (let i = 0; i < rep_details_data?.length; i++) {
                let obj = {
                    id: rep_details_data[i]?.id,
                    name: rep_details_data[i]?.name,
                    ...defaultVals,
                };
                for (let j = 0; j < rep_details_data[maxIn]?.data.length; j++) {
                    obj[rep_details_data[i]?.data?.[j]?.epoch] =
                        matrice !== "overall_avg"
                            ? formatFloat(
                                  (rep_details_data[i]?.data?.[j]?.[matrice] /
                                      rep_details_data[i]?.data?.[j]?.total) *
                                      100
                              )
                            : rep_details_data[i]?.data?.[j]?.[matrice];
                }

                temp.push({ ...obj });
            }

            setData(temp);
        }
    }, [rep_details_data, matrice]);

    const type = get_dashboard_label();
    return (
        <div
            style={
                rep_details_data_err
                    ? { display: "flex" }
                    : {
                          height:
                              data.length <= 5
                                  ? "400px"
                                  : `${data.length * 65}px`,
                          position: "relative",
                      }
            }
            className="width100p"
        >
            {rep_details_data_err ? (
                <EmptyDataState msg={rep_details_data_err} />
            ) : (
                <>
                    <div className="flex justifySpaceBetween alignCenter ">
                        <div className="bold600">Performance Graph</div>
                        <RenderLabels
                            labels={keys.map((i, idx) => ({
                                label: getDateTime(
                                    new Date(+i),
                                    undefined,
                                    undefined,
                                    "dd MM"
                                ),
                                color: colors[idx % colors.length],
                            }))}
                        />
                        <Select
                            className="graph__dropdown bold400 font12 marginR10"
                            suffixIcon={
                                <Icon className="fas fa-chevron-down dove_gray_cl" />
                            }
                            dropdownRender={(menu) => (
                                <div className="mine_shaft_cl">
                                    <span
                                        className={
                                            "freq_label dove_gray_cl width100p font12 bold400 paddingTB9 paddingLR6"
                                        }
                                    >
                                        {"Select Matrice"}
                                    </span>
                                    {menu}
                                </div>
                            )}
                            dropdownClassName="freq_dropdown"
                            // dropdownStyle={{display: "none"}}
                            onChange={(value) => {
                                setMatrice(value);
                            }}
                            value={matrice}
                        >
                            <Option
                                className="option__container bold400 font12"
                                value="overall_avg"
                            >
                                Overall Average
                            </Option>
                            <Option
                                className="option__container bold400 font12"
                                value="good"
                            >
                                Good {type}
                            </Option>
                            <Option
                                value="average"
                                className="option__container bold400 font12"
                            >
                                Average {type}
                            </Option>
                            <Option
                                value="bad"
                                className="option__container bold400 font12"
                            >
                                Need Attention {type}
                            </Option>
                        </Select>
                    </div>

                    <StackedBarComponent
                        data={data}
                        keys={keys}
                        colors={colors}
                    />
                    {[...Array(19)].map((_, idx) => (
                        <div
                            style={{
                                position: "absolute",
                                overflow: "hidden",
                                top: "10%",
                                left: "0",
                                width: `${5 * (idx + 1)}%`,
                                minHeight: "300px",
                                borderRight:
                                    "1px dashed rgba(153, 153, 153, 0.2)",
                            }}
                            key={idx}
                        ></div>
                    ))}
                </>
            )}
        </div>
    );
};

HorizontalStackedGroupGraph.defaultProps = {
    colors: ["#FF66B3", "#7D8CC4", "#00BD9D", "#54428E"],
};

export default HorizontalStackedGroupGraph;

const StackedBarComponent = ({ data, keys, colors }) => {
    return data.map((element) => (
        <div className="stacked_bar_container" key={element.id}>
            <div className="stacked_bar_info">
                <div className="stacked_bar_label">{element.name}</div>
            </div>
            <div className="stacked_bar_graph_container">
                {keys.map((key, idx) => (
                    <Tooltip title={`${element[key].toFixed(2)}%`} key={idx}>
                        <div className="stacked_bar" key={key}>
                            {element[key] !== 0 ? (
                                <div
                                    className="stacked_bar_filled"
                                    style={{
                                        width: `${element[key]}%`,
                                        background: colors[idx % colors.length],
                                    }}
                                >
                                    <span className="stacked_bar_percent_label">
                                        {`${element[key].toFixed(2)}%`}
                                    </span>
                                </div>
                            ) : (
                                <div
                                    className="stacked_bar_filled"
                                    style={{
                                        width: `1%`,
                                        background: "#fafbfc",
                                    }}
                                >
                                    <div
                                        className="stacked_bar_zero"
                                        // style={{ color: '#000000', right: '-5px' }}
                                    >
                                        0%
                                    </div>
                                </div>
                            )}
                        </div>
                    </Tooltip>
                ))}
                {/* <div className="stacked_bar">
                    <div
                        className="stacked_bar_filled"
                        style={{ width: '50%', background: 'yellow' }}
                    >
                        <span className="stacked_bar_percent_label">59%</span>
                    </div>
                </div> */}
            </div>
        </div>
    ));
};
