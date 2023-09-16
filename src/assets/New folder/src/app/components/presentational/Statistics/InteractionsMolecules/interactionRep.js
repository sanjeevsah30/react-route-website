import React, { useState, Fragment, useEffect } from "react";
import { Popover, Tooltip } from "antd";
import { getNearestTen, getChartMarks, uid } from "@tools/helpers";
import CallHover from "./callhover";
import LineGraph from "../LineGraph";
import { Spinner } from "@presentational/reusables/index";

export default function InteractionRep(props) {
    const getColorClass = (value) => {
        if (props.activeCardData.type === "talkRatio") {
            if (value < 40) {
                return "warn";
            } else if (value <= 60 && value >= 40) {
                return "success";
            } else {
                return "danger";
            }
        } else {
            return "none";
        }
    };

    const [isVisible, setIsVisible] = useState(false);

    const nearestTen = getNearestTen(props.max) * 10;
    const chartMarks = props.max ? getChartMarks(props.max) : [];

    return (
        <div className="row rep-info">
            <div className="col-3 rep-name">
                <span className="paragraph ellipsis">{props.rep.repName}</span>
            </div>
            <div className="col-12">
                <p className="rep-calls">
                    {props.calls.length ? (
                        <>
                            {props.calls.map((call, idx) => {
                                let callValue =
                                    call[props.activeCardData.callData];
                                if (props.activeCardData.type === "talkRatio") {
                                    callValue = callValue * 100;
                                } else if (
                                    props.activeCardData.type ===
                                    "interactivity"
                                ) {
                                    callValue = callValue * 10;
                                }

                                return (
                                    <Popover
                                        title={call.title}
                                        destroyTooltipOnHide
                                        key={uid() + idx}
                                        content={
                                            <CallHover
                                                title={
                                                    props.activeCardData.tabText
                                                }
                                                value={`${callValue.toFixed(
                                                    2
                                                )} ${
                                                    props.activeCardData.unit
                                                }`}
                                                call={call}
                                                showingSampleData={
                                                    props.showingSampleData
                                                }
                                            />
                                        }
                                    >
                                        <span
                                            className="rep-calls-points"
                                            style={{
                                                left: `${
                                                    (callValue / nearestTen) *
                                                        100 -
                                                    1
                                                }%`,
                                            }}
                                        ></span>
                                    </Popover>
                                );
                            })}
                        </>
                    ) : null}
                    <Tooltip
                        destroyTooltipOnHide
                        placement="right"
                        title={`Team's Average ${props.teamAvg} ${props.activeCardData.unit}`}
                    >
                        <span
                            className="team-avg"
                            style={{
                                left: `${(props.teamAvg / nearestTen) * 100}%`,
                            }}
                        ></span>
                    </Tooltip>
                    {props.selectedIdealRange.idealMin && (
                        <Tooltip
                            destroyTooltipOnHide
                            placement="right"
                            title={`Ideal Range ${props.selectedIdealRange.idealMin}${props.activeCardData.unit} - ${props.selectedIdealRange.idealMax}${props.activeCardData.unit}`}
                        >
                            <span
                                className="ideal-range"
                                style={{
                                    left: `${
                                        (props.selectedIdealRange.idealMin /
                                            nearestTen) *
                                        100
                                    }%`,
                                    width: `${
                                        ((props.selectedIdealRange.idealMax -
                                            props.selectedIdealRange.idealMin) /
                                            nearestTen) *
                                        100
                                    }%`,
                                }}
                            ></span>
                        </Tooltip>
                    )}
                    {props.max
                        ? chartMarks.map((mark) => {
                              return (
                                  <Fragment key={mark}>
                                      <span
                                          className="grid-ticks-bar"
                                          style={{
                                              left: `${
                                                  (mark /
                                                      chartMarks[
                                                          chartMarks.length - 1
                                                      ]) *
                                                  100
                                              }%`,
                                          }}
                                      >
                                          |
                                      </span>
                                  </Fragment>
                              );
                          })
                        : null}
                </p>
            </div>
            <div className="col-9">
                <div className="row repStats">
                    <div
                        className={`col-6 ${
                            props.activeCardData.type
                        } ${getColorClass(props.avg)}`}
                    >
                        <span
                            className="graph-trigger"
                            onMouseEnter={() => {
                                setIsVisible(true);
                            }}
                            onMouseLeave={(event) => {
                                let e = event.toElement || event.relatedTarget;
                                if (e.parentNode === this || e === this) {
                                    return;
                                }
                                setIsVisible(false);
                            }}
                        >
                            <Popover
                                overlayClassName="repGraph"
                                title={""}
                                placement="left"
                                arrowPointAtCenter
                                autoAdjustOverflow
                                destroyTooltipOnHide
                                align={{
                                    overflow: {
                                        adjustX: false,
                                        adjustY: false,
                                    },
                                }}
                                visible={!props.showingSampleData && isVisible}
                                getPopupContainer={() =>
                                    document.querySelector(
                                        "#stats-bottom-section"
                                    )
                                }
                                trigger="click"
                                content={
                                    <Spinner loading={props.isLoadingRepGraph}>
                                        <LineGraph
                                            className="repGraph"
                                            xArr={
                                                props.rep.graphs
                                                    ? props.rep.graphs[
                                                          props.activeCardData
                                                              .type
                                                      ].xAxis
                                                    : []
                                            }
                                            yArr={
                                                props.rep.graphs
                                                    ? props.rep.graphs[
                                                          props.activeCardData
                                                              .type
                                                      ].yAxis
                                                    : []
                                            }
                                            xAxisLabel={""}
                                            yAxisLabel={
                                                props.activeCardData.yLabel
                                            }
                                            label={""}
                                            automargin={false}
                                        />
                                    </Spinner>
                                }
                            >
                                <span
                                    className="paragraph strong ellipsis"
                                    onMouseOver={() =>
                                        !props.showingSampleData &&
                                        props.addRepGraphData(props.rep.repId)
                                    }
                                >
                                    {(+props.avg).toFixed(2)}
                                    <span className="unit">
                                        {props.activeCardData.unit}
                                    </span>
                                </span>
                            </Popover>
                        </span>
                    </div>
                    {props.selectedIdealRange.idealMin && (
                        <>
                            <div className="col-8">
                                <span className="paragraph ellipsis">
                                    {(props.rep.in_ideal_range * 100).toFixed(
                                        2
                                    )}{" "}
                                    %
                                </span>
                            </div>
                            <div className="col-10">
                                <span className="paragraph ellipsis">
                                    {(
                                        (1 - props.rep.in_ideal_range) *
                                        100
                                    ).toFixed(2)}{" "}
                                    %
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
