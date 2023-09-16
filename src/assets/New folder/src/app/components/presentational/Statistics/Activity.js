import React, { useState, useEffect } from "react";
import { Tooltip, Button, Skeleton } from "antd";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import statisticsConfig from "@constants/Statistics";
import { compareValues, uid } from "@helpers";
import LineGraph from "./LineGraph";
import { NoData } from "@reusables";
import { useSelector } from "react-redux";
import InfoCircleSvg from "app/static/svg/InfoCircleSvg";

const ProgressBar = React.lazy(() => import("@reusables/ProgressBar"));
const TeamCardTabs = React.lazy(() => import("./TeamCardTabs"));

const Activity = (props) => {
    const [activeCardData, setactiveCardData] = useState("");
    const [selectedSort, setselectedSort] = useState("asc");
    const [repSortedData, setrepSortedData] = useState([]);
    const domain_type = useSelector(
        (state) => state.common.versionData.domain_type
    );
    const activeReps = useSelector((state) => state.common.filterReps.active);

    useEffect(() => {
        let card =
            statisticsConfig.TEAM_CARD_TABS_ACTIVITY[
                props.activeTeamCardActivity
            ];

        setactiveCardData(card);
        setselectedSort(card.defaultSort);

        let data = props.repsOptions
            .map((rep) => {
                if (props[card.repData] && props[card.repData][rep.id]) {
                    return {
                        ...props[card.repData][rep.id],
                        repId: rep.id,
                        repName: rep.name,
                    };
                }
            })
            .filter((t) => t);
        setrepSortedData(
            data.sort(compareValues(card.repDataType, card.defaultSort))
        );
    }, [
        props.activeTeamCardActivity,
        props.repDurationData,
        props.repsOptions,
        props.repVolumeData,
    ]);

    const handleSort = () => {
        setrepSortedData(
            repSortedData.sort(
                compareValues(
                    activeCardData.repDataType,
                    selectedSort === "asc" ? "desc" : "asc"
                )
            )
        );
        setselectedSort(selectedSort === "asc" ? "desc" : "asc");
    };

    const curRep =
        props?.repsOptions &&
        props.repsOptions?.find(({ id }) => id === props.activestatsRep)?.name;

    // console.log(props.isGraphLoading);
    return domain_type === "b2c" ? (
        <div className="stats-activity-container">
            {/* Team Cards Section for Activity */}
            <div className="flex" style={{ padding: "20px 20px 0 20px" }}>
                <div>
                    <div className="flex alignCenter marginB34">
                        <h4 className="marginB0">
                            {
                                // parseInt(props.activestatsRep) !== 0
                                !!props.activestatsRep !== false
                                    ? activeReps?.length > 1
                                        ? `${activeReps?.length} Reps`
                                        : `${curRep}'s Statistics`
                                    : "Team Statistics"
                            }
                        </h4>
                        <Tooltip
                            title={
                                !!props.activestatsRep !== false ? (
                                    <>
                                        {
                                            statisticsConfig
                                                .TEAM_CARD_TABS_ACTIVITY[
                                                props.activeTeamCardActivity
                                            ].repHelpText
                                        }
                                    </>
                                ) : (
                                    <>
                                        {
                                            statisticsConfig
                                                .TEAM_CARD_TABS_ACTIVITY[
                                                props.activeTeamCardActivity
                                            ].teamHelpText
                                        }
                                    </>
                                )
                            }
                        >
                            <InfoCircleSvg
                                style={{
                                    transform: "scale(0.8)",
                                    marginBottom: "2px",
                                    marginLeft: "8px",
                                }}
                            />
                        </Tooltip>
                    </div>
                    <TeamCardTabs
                        teamCards={props.teamCardsActivity}
                        activeTeamCard={props.activeTeamCardActivity}
                        handleActiveTeamCard={
                            props.handleActiveTeamCardActivity
                        }
                        isLoading={props.isLoading}
                        tileData={props.tileData}
                    />
                </div>

                {!!props.activestatsRep !== false ? (
                    <>
                        <div className="stats-activity-graph-section">
                            <div className="stats-activity-graph-section-area">
                                <h4 className="stats-activity-member-section-title">
                                    {activeReps.length > 1
                                        ? `Rep${statisticsConfig.REP_GRAPH_TITLE}`
                                        : `${curRep} ${statisticsConfig.REP_GRAPH_TITLE}`}
                                </h4>
                            </div>
                            <div className="plot-container">
                                <LineGraph
                                    xArr={props.xAxis}
                                    yArr={props.yAxis}
                                    xAxisLabel={props.xAxisLabel}
                                    yAxisLabel={props.yAxisLabel}
                                    label={props.activeTeam}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Graph and Member Section */}
                        <div className="stats-activity-graph-section">
                            <div className="stats-activity-graph-section-area">
                                <h4 className="stats-activity-graph-section-title">
                                    {statisticsConfig.TEAM_GRAPH_TITLE}
                                </h4>
                                <div className="plot-container">
                                    <LineGraph
                                        xArr={props.xAxis}
                                        yArr={props.yAxis}
                                        label={props.activeTeam}
                                        xAxisLabel={props.xAxisLabel}
                                        yAxisLabel={props.yAxisLabel}
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            className="stats-activity-graph-member-container"
                            style={{ display: "none" }}
                        >
                            {/* Graph Section goes here*/}
                            {/* Member Section goes */}
                            <div
                                className="stats-activity-member-section"
                                style={{ flex: 2 }}
                            >
                                <div className="stats-activity-member-section-header">
                                    <h4 className="stats-activity-member-section-title">
                                        {statisticsConfig.PROGRESS_BAR_TITLE}
                                    </h4>
                                    {props.activeTeamCardActivity === 0 && (
                                        <div className="graph-indication">
                                            <div className="indication"></div>
                                            <div className="indication-desc">
                                                {
                                                    statisticsConfig.PROGRESS_BAR_LEGEND_LABEL
                                                }
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="stats-activity-member-section-content-title">
                                    {/* headings */}
                                    <div className="stats-activity-member-section-item1 activity-member-section-title">
                                        NAME
                                    </div>
                                    <div className="stats-activity-member-section-item2 activity-member-section-title">
                                        {activeCardData.progressTitle}
                                        {activeCardData.showMax &&
                                            `0-${
                                                props.activityMaxValues[
                                                    activeCardData.type
                                                ]
                                            }`}
                                    </div>
                                    <div className="stats-activity-member-section-item3 activity-member-section-title">
                                        {activeCardData.label}
                                        <Tooltip
                                            destroyTooltipOnHide
                                            title="Sort Data"
                                        >
                                            <Button
                                                type={"link"}
                                                icon={
                                                    selectedSort === "asc" ? (
                                                        <CaretUpOutlined />
                                                    ) : (
                                                        <CaretDownOutlined />
                                                    )
                                                }
                                                onClick={handleSort}
                                            />
                                        </Tooltip>
                                    </div>
                                </div>
                                {props.isLoading ? (
                                    <p className="loading">
                                        {statisticsConfig.LOADING_TEXT}{" "}
                                        <span>.</span>
                                        <span>.</span>
                                        <span>.</span>
                                    </p>
                                ) : (
                                    <div className="stats-activity-member-section-wrapper">
                                        {/* list of members goes here */}
                                        {repSortedData.length ? (
                                            repSortedData.map((rep, index) =>
                                                parseInt(rep.repId) ===
                                                0 ? null : (
                                                    <div
                                                        key={uid() + index}
                                                        className="stats-activity-member-section-content"
                                                        onClick={() => {
                                                            !props.showingSampleData &&
                                                                props.handleRepsChange(
                                                                    rep.repId
                                                                );
                                                        }}
                                                    >
                                                        <div className="stats-activity-member-section-item1 activity-member-section-content">
                                                            <span>
                                                                {rep.repName}
                                                            </span>
                                                        </div>
                                                        <div className="stats-activity-member-section-item2 activity-member-section-content">
                                                            {props.repDurationData &&
                                                            props.repVolumeData &&
                                                            props.tileData[
                                                                activeCardData
                                                                    .type
                                                            ] ? (
                                                                <ProgressBar
                                                                    percentage={
                                                                        props[
                                                                            activeCardData
                                                                                .repData
                                                                        ][
                                                                            rep
                                                                                .repId
                                                                        ]
                                                                            ? props
                                                                                  .activityMaxValues[
                                                                                  activeCardData
                                                                                      .type
                                                                              ] ===
                                                                              0
                                                                                ? 0
                                                                                : (props[
                                                                                      activeCardData
                                                                                          .repData
                                                                                  ][
                                                                                      rep
                                                                                          .repId
                                                                                  ][
                                                                                      activeCardData
                                                                                          .repDataType
                                                                                  ] *
                                                                                      100) /
                                                                                  props
                                                                                      .activityMaxValues[
                                                                                      activeCardData
                                                                                          .type
                                                                                  ]
                                                                            : 0
                                                                    }
                                                                    traceActive={
                                                                        props.activeTeamCardActivity ===
                                                                        0
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    traceWidth={
                                                                        props
                                                                            .activityMaxValues[
                                                                            activeCardData
                                                                                .type
                                                                        ] === 0
                                                                            ? 0
                                                                            : (props
                                                                                  .tileData[
                                                                                  activeCardData
                                                                                      .type
                                                                              ] *
                                                                                  100) /
                                                                              props
                                                                                  .activityMaxValues[
                                                                                  activeCardData
                                                                                      .type
                                                                              ]
                                                                    }
                                                                    traceValue={`Team's Average ${
                                                                        props
                                                                            .tileData[
                                                                            activeCardData
                                                                                .type
                                                                        ]
                                                                    }${
                                                                        activeCardData.unit
                                                                    }`}
                                                                />
                                                            ) : (
                                                                <ProgressBar
                                                                    percentage={
                                                                        0
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="stats-activity-member-section-item3 activity-member-section-content">
                                                            {props.repDurationData &&
                                                            props.repVolumeData ? (
                                                                <>
                                                                    {props[
                                                                        activeCardData
                                                                            .repData
                                                                    ][rep.repId]
                                                                        ? parseFloat(
                                                                              props[
                                                                                  activeCardData
                                                                                      .repData
                                                                              ][
                                                                                  rep
                                                                                      .repId
                                                                              ][
                                                                                  activeCardData
                                                                                      .repDataType
                                                                              ]
                                                                          ).toFixed(
                                                                              2
                                                                          )
                                                                        : 0}
                                                                </>
                                                            ) : (
                                                                <>0</>
                                                            )}
                                                            {" " +
                                                                activeCardData.unit}
                                                        </div>
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <NoData
                                                description={"No Data found"}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    ) : (
        <div className="stats-activity-container">
            <div className="stats-activity-container-title">
                {parseInt(props.activestatsRep) !== 0 && (
                    <button
                        className="cta withicon"
                        onClick={() => props.handleRepsChange(0)}
                    >
                        <i className="fa fa-arrow-left" aria-hidden="true"></i>
                        <span>{statisticsConfig.GO_BACK}</span>
                    </button>
                )}
                {/* Team Section Cards*/}
                <h4 className="stats-activity-team-title">
                    {parseInt(props.activestatsRep) !== 0
                        ? `${curRep}'s Statistics`
                        : "TEAM STATISTICS"}
                </h4>
                <p className="stats-activity-help-text">
                    <i className="fa fa-info-circle" aria-hidden="true"></i>
                    {parseInt(props.activestatsRep) !== 0 ? (
                        <>
                            {
                                statisticsConfig.TEAM_CARD_TABS_ACTIVITY[
                                    props.activeTeamCardActivity
                                ].repHelpText
                            }
                        </>
                    ) : (
                        <>
                            {
                                statisticsConfig.TEAM_CARD_TABS_ACTIVITY[
                                    props.activeTeamCardActivity
                                ].teamHelpText
                            }
                        </>
                    )}
                </p>
            </div>
            {/* Team Cards Section for Activity */}
            <div>
                <TeamCardTabs
                    teamCards={props.teamCardsActivity}
                    activeTeamCard={props.activeTeamCardActivity}
                    handleActiveTeamCard={props.handleActiveTeamCardActivity}
                    isLoading={props.isLoading}
                    tileData={props.tileData}
                />
            </div>

            {+props.activestatsRep !== 0 ? (
                <>
                    {/* Individual Activity Section */}
                    <div className="stats-activity-individual-graph-container">
                        <div className="stats-activity-individual-graph-container-title">
                            <h4 className="stats-activity-member-section-title">
                                {`${curRep} ${statisticsConfig.REP_GRAPH_TITLE}`}
                            </h4>
                        </div>
                        <div className="stats-activity-individual-graph-container-area plot-container">
                            <LineGraph
                                xArr={props.xAxis}
                                yArr={props.yAxis}
                                xAxisLabel={props.xAxisLabel}
                                yAxisLabel={props.yAxisLabel}
                                label={props.activeTeam}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Graph and Member Section */}
                    <div className="stats-activity-graph-member-container">
                        {/* Graph Section goes here*/}
                        <div className="stats-activity-graph-section">
                            <div className="stats-activity-graph-section-area">
                                <h4 className="stats-activity-graph-section-title">
                                    {statisticsConfig.TEAM_GRAPH_TITLE}
                                </h4>
                                <div className="plot-container">
                                    <LineGraph
                                        xArr={props.xAxis}
                                        yArr={props.yAxis}
                                        label={props.activeTeam}
                                        xAxisLabel={props.xAxisLabel}
                                        yAxisLabel={props.yAxisLabel}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Member Section goes */}
                        <div className="stats-activity-member-section">
                            <div className="stats-activity-member-section-header">
                                <h4 className="stats-activity-member-section-title">
                                    {statisticsConfig.PROGRESS_BAR_TITLE}
                                </h4>
                                {props.activeTeamCardActivity === 0 && (
                                    <div className="graph-indication">
                                        <div className="indication"></div>
                                        <div className="indication-desc">
                                            {
                                                statisticsConfig.PROGRESS_BAR_LEGEND_LABEL
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="stats-activity-member-section-content-title">
                                {/* headings */}
                                <div className="stats-activity-member-section-item1 activity-member-section-title">
                                    NAME
                                </div>
                                <div className="stats-activity-member-section-item2 activity-member-section-title">
                                    {activeCardData.progressTitle}
                                    {activeCardData.showMax &&
                                        `0-${
                                            props.activityMaxValues[
                                                activeCardData.type
                                            ]
                                        }`}
                                </div>
                                <div className="stats-activity-member-section-item3 activity-member-section-title">
                                    {activeCardData.label}
                                    <Tooltip
                                        destroyTooltipOnHide
                                        title="Sort Data"
                                    >
                                        <Button
                                            type={"link"}
                                            icon={
                                                selectedSort === "asc" ? (
                                                    <CaretUpOutlined />
                                                ) : (
                                                    <CaretDownOutlined />
                                                )
                                            }
                                            onClick={handleSort}
                                        />
                                    </Tooltip>
                                </div>
                            </div>
                            {props.isLoading ? (
                                <p className="loading">
                                    {statisticsConfig.LOADING_TEXT}{" "}
                                    <span>.</span>
                                    <span>.</span>
                                    <span>.</span>
                                </p>
                            ) : (
                                <div className="stats-activity-member-section-wrapper">
                                    {/* list of members goes here */}
                                    {repSortedData.length ? (
                                        repSortedData.map((rep, index) =>
                                            parseInt(rep.repId) === 0 ? null : (
                                                <div
                                                    key={uid() + index}
                                                    className="stats-activity-member-section-content"
                                                    onClick={() => {
                                                        !props.showingSampleData &&
                                                            props.handleRepsChange(
                                                                rep.repId
                                                            );
                                                    }}
                                                >
                                                    <div className="stats-activity-member-section-item1 activity-member-section-content">
                                                        <span>
                                                            {rep.repName}
                                                        </span>
                                                    </div>
                                                    <div className="stats-activity-member-section-item2 activity-member-section-content">
                                                        {props.repDurationData &&
                                                        props.repVolumeData &&
                                                        props.tileData[
                                                            activeCardData.type
                                                        ] ? (
                                                            <ProgressBar
                                                                percentage={
                                                                    props[
                                                                        activeCardData
                                                                            .repData
                                                                    ][rep.repId]
                                                                        ? props
                                                                              .activityMaxValues[
                                                                              activeCardData
                                                                                  .type
                                                                          ] ===
                                                                          0
                                                                            ? 0
                                                                            : (props[
                                                                                  activeCardData
                                                                                      .repData
                                                                              ][
                                                                                  rep
                                                                                      .repId
                                                                              ][
                                                                                  activeCardData
                                                                                      .repDataType
                                                                              ] *
                                                                                  100) /
                                                                              props
                                                                                  .activityMaxValues[
                                                                                  activeCardData
                                                                                      .type
                                                                              ]
                                                                        : 0
                                                                }
                                                                traceActive={
                                                                    props.activeTeamCardActivity ===
                                                                    0
                                                                        ? true
                                                                        : false
                                                                }
                                                                traceWidth={
                                                                    props
                                                                        .activityMaxValues[
                                                                        activeCardData
                                                                            .type
                                                                    ] === 0
                                                                        ? 0
                                                                        : (props
                                                                              .tileData[
                                                                              activeCardData
                                                                                  .type
                                                                          ] *
                                                                              100) /
                                                                          props
                                                                              .activityMaxValues[
                                                                              activeCardData
                                                                                  .type
                                                                          ]
                                                                }
                                                                traceValue={`Team's Average ${
                                                                    props
                                                                        .tileData[
                                                                        activeCardData
                                                                            .type
                                                                    ]
                                                                }${
                                                                    activeCardData.unit
                                                                }`}
                                                            />
                                                        ) : (
                                                            <ProgressBar
                                                                percentage={0}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="stats-activity-member-section-item3 activity-member-section-content">
                                                        {props.repDurationData &&
                                                        props.repVolumeData ? (
                                                            <>
                                                                {props[
                                                                    activeCardData
                                                                        .repData
                                                                ][rep.repId]
                                                                    ? parseFloat(
                                                                          props[
                                                                              activeCardData
                                                                                  .repData
                                                                          ][
                                                                              rep
                                                                                  .repId
                                                                          ][
                                                                              activeCardData
                                                                                  .repDataType
                                                                          ]
                                                                      ).toFixed(
                                                                          2
                                                                      )
                                                                    : 0}
                                                            </>
                                                        ) : (
                                                            <>0</>
                                                        )}
                                                        {" " +
                                                            activeCardData.unit}
                                                    </div>
                                                </div>
                                            )
                                        )
                                    ) : (
                                        <NoData description={"No Data found"} />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Activity;
