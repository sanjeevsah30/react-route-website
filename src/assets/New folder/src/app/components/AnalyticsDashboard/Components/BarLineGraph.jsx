import Icon from "@presentational/reusables/Icon";
import Loader from "@presentational/reusables/Loader";
import { Select, Tooltip } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ISvg from "app/static/svg/ISvg";
import exportAsImage from "utils/exportAsImage";
import EmptyDataState from "./EmptyDataState";
import DownloadSvg from "app/static/svg/DownloadSvg";
import useGetBarGraphManipulateFunctions from "../Hooks/useGetBarGraphManipulateFunctions";
import InfoCircleSvg from "app/static/svg/InfoCircleSvg";

const BarLineGraph = ({
    labels = [],
    type,
    is_switch,
    is_select,
    Component,
    LineComponent,
    lineData,
    barData,
    rest = {},
    loading,
    select_data,
    selectVal,
    line_loading = false,
    option_key = "name",
    select_placeholder = "Select Team",
    heading = "Team Average Score",
    multiline,
    line_rest = {},
    select_type = "team",
    SelectComponent,
    hidePrimarySelect = false,
    add_primary = true,
    style = {},
}) => {
    const [line, setLine] = useState([]);
    const [bar, setBar] = useState([]);
    const [activeId, setActiveId] = useState(undefined);
    const { lineGraphAddColor } = useGetBarGraphManipulateFunctions();
    useEffect(() => {
        let tofind = lineData;
        if (line_rest.color_on_performance) {
            tofind = lineGraphAddColor({
                data: lineData,
                color_on_performance: true,
            });
        }
        const find = tofind.find(({ id }) => id === activeId);

        multiline
            ? setLine(find?.data || [])
            : setLine(
                  find
                      ? [
                            {
                                ...find,
                                color: add_primary ? "#1a62f2" : find.color,
                            },
                        ]
                      : []
              );
    }, [activeId, lineData]);

    useEffect(() => {
        setBar(barData);
    }, [barData]);

    const {
        dashboard: {
            templates_data: { template_active },
        },
    } = useSelector((state) => state);

    useEffect(() => {
        activeId && setActiveId(undefined);
    }, [select_data]);

    useEffect(() => {
        setActiveId(lineData?.[0]?.id);
    }, [lineData]);

    const repLevel = useRef();
    const trend = useRef();

    return (
        <div
            className="custom__card flex  padding20"
            style={{
                gap: "60px",
                // height: '100%',
                minHeight: "420px",
                ...style,
                alignItems: "flex-start",
            }}
        >
            <div
                className="flex1 overflowYscroll"
                style={{
                    height: "386px",
                }}
            >
                <Loader loading={loading}>
                    {!loading && (
                        <div className="" ref={repLevel}>
                            <div className="flexShrink">
                                <div className="bold600 mineShaft">
                                    {heading}

                                    {(lineData?.length > 0 ||
                                        barData?.length > 0) && (
                                        <Tooltip title="Download Graph">
                                            <DownloadSvg
                                                style={{
                                                    fontSize: "20px",
                                                    paddingLeft: "15px",
                                                    color: "#1A61EE",
                                                }}
                                                onClick={() =>
                                                    exportAsImage(
                                                        repLevel.current,
                                                        "Rep Level Graph"
                                                    )
                                                }
                                            />
                                        </Tooltip>
                                    )}
                                </div>
                            </div>

                            <div className="flex1 ">
                                <div
                                    style={{
                                        height:
                                            bar.length <= 5
                                                ? "386px"
                                                : `${(bar.length + 1) * 50}px`,
                                    }}
                                    className="flex alignCenter"
                                >
                                    {bar.length ? (
                                        <Component
                                            data={bar}
                                            onClick={(id) => setActiveId(id)}
                                            cursor_pointer={true}
                                            activeId={activeId}
                                            {...rest}
                                            type={type}
                                        />
                                    ) : (
                                        <>
                                            <EmptyDataState />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </Loader>
            </div>

            <div
                className="flex1 height100p"
                style={{
                    height: "386px",
                }}
            >
                <Loader loading={line_loading}>
                    {!line_loading && (
                        <>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                {activeId ? (
                                    <span className="mine_shaft_cl bold600">
                                        Showing Trend For
                                        {(lineData?.length > 0 ||
                                            barData?.length > 0) && (
                                            <Tooltip title="Download Graph">
                                                <DownloadSvg
                                                    style={{
                                                        fontSize: "20px",
                                                        paddingLeft: "15px",
                                                        color: "#1A61EE",
                                                    }}
                                                    onClick={() =>
                                                        exportAsImage(
                                                            trend.current,
                                                            "Trend Graph"
                                                        )
                                                    }
                                                />
                                            </Tooltip>
                                        )}
                                    </span>
                                ) : (
                                    <Tooltip
                                        title={` The graph will only be generated
                                             when you select one specific ${select_type}.`}
                                    >
                                        <InfoCircleSvg />
                                    </Tooltip>
                                    // <></>
                                )}
                                <div
                                    className="flex justifyCenter alignCenter"
                                    style={{
                                        gap: "10px",
                                    }}
                                >
                                    {SelectComponent && <SelectComponent />}
                                    {hidePrimarySelect || (
                                        <Select
                                            className="custom__select"
                                            value={activeId}
                                            onChange={(val) => {
                                                setActiveId(val);
                                            }}
                                            dropdownRender={(menu) => (
                                                <div>
                                                    <span
                                                        className={
                                                            "topbar-label"
                                                        }
                                                    >
                                                        {select_placeholder}
                                                    </span>
                                                    {menu}
                                                </div>
                                            )}
                                            placeholder={select_placeholder}
                                            suffixIcon={
                                                <Icon className="fas fa-chevron-down dove_gray_cl" />
                                            }
                                            style={{
                                                height: "36px",
                                                width: "192px",
                                            }}
                                            dropdownClassName={
                                                "account_select_dropdown"
                                            }
                                            showSearch
                                            optionFilterProp="children"
                                        >
                                            {select_type === "team"
                                                ? select_data.map((item, idx) =>
                                                      item.id ===
                                                      0 ? null : item?.subteams
                                                            ?.length ? (
                                                          <Select.OptGroup
                                                              label={item.name}
                                                          >
                                                              {item.subteams.map(
                                                                  (team) => (
                                                                      <Select.Option
                                                                          key={
                                                                              team.id
                                                                          }
                                                                          value={
                                                                              team.id
                                                                          }
                                                                      >
                                                                          {
                                                                              team.name
                                                                          }
                                                                      </Select.Option>
                                                                  )
                                                              )}
                                                          </Select.OptGroup>
                                                      ) : (
                                                          <Select.Option
                                                              value={item.id}
                                                              key={idx}
                                                          >
                                                              {item.name}
                                                          </Select.Option>
                                                      )
                                                  )
                                                : select_data?.map((item) => (
                                                      <Select.Option
                                                          value={item.id}
                                                          key={item.id}
                                                      >
                                                          {item?.[option_key]}
                                                      </Select.Option>
                                                  ))}
                                        </Select>
                                    )}
                                </div>
                            </div>
                            <div
                                style={{
                                    height: "386px",
                                }}
                                className="flex column justifySpaceBetween"
                                ref={trend}
                            >
                                {line?.length ? (
                                    <LineComponent data={line} {...line_rest} />
                                ) : (
                                    <>
                                        <EmptyDataState />
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </Loader>
            </div>
        </div>
    );
};

export default BarLineGraph;
