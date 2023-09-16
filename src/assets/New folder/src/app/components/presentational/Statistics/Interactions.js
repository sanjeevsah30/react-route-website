import React, { useState, useEffect, Suspense } from "react";
import statisticsConfig from "@constants/Statistics";
import { orderBy } from "lodash";
import { Radio, Button, Tooltip, Modal, Skeleton } from "antd";
import { useSelector } from "react-redux";
import { Spinner, FallbackUI, NoData } from "@reusables";
import InteractionsCompareWrapper from "./InteractionsMolecules/InteractionsCompareWrapper";
import { uid } from "@tools/helpers";
import { INTERACTIONS_IDEAL_RANGE } from "@container/Statistics/__mock__/mock";

const InteractionLegend = React.lazy(() =>
    import("./InteractionsMolecules/interactionLegend")
);
const InteractionRep = React.lazy(() =>
    import("./InteractionsMolecules/interactionRep")
);
const InteractionScale = React.lazy(() =>
    import("./InteractionsMolecules/InteractionScale")
);

export default function Interactions(props) {
    const idealRanges = useSelector((state) => state.stats.idealRanges);
    const [activeCardData, setactiveCardData] = useState("");
    const [repData, setRepData] = useState([]);
    const [repsToCompare, setRepsToCompare] = useState([]);
    const [isCompareActive, setIsCompareActive] = useState(false);
    const [selectedIdealRange, setSelectedIdealRange] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [statsData, setStatsData] = useState([]);

    useEffect(() => {
        setIsUpdating(true);
        let card =
            statisticsConfig.TEAM_CARD_TABS_INTERACTIONS[
                props.activeTeamCardInteractions
            ];

        setactiveCardData(card);
        let data = props.repsOptions
            .map((rep) => {
                if (props[card.repData][rep.id]) {
                    return {
                        ...props[card.repData][rep.id],
                        repId: rep.id,
                        repName: rep.name,
                    };
                }
            })
            .filter((t) => t);
        setRepData(orderBy(data, [card.repDataType], [card.defaultSort]));
        let selectedRange = props.showingSampleData
            ? INTERACTIONS_IDEAL_RANGE.find(
                  (range) => range.metric === card.callData
              )
            : idealRanges.find((range) => range.metric === card.callData);
        if (selectedRange) {
            if (card.type === "talkRatio") {
                setSelectedIdealRange({
                    idealMin: selectedRange.range_start * 100 || 0,
                    idealMax: selectedRange.range_end * 100 || 0,
                });
            } else if (card.type === "interactivity") {
                setSelectedIdealRange({
                    idealMin: selectedRange.range_start * 10 || 0,
                    idealMax: selectedRange.range_end * 10 || 0,
                });
            } else {
                setSelectedIdealRange({
                    idealMin: selectedRange.range_start || 0,
                    idealMax: selectedRange.range_end || 0,
                });
            }
        } else {
            setSelectedIdealRange({});
        }
        setIsUpdating(false);
    }, [
        props.activeTeamCardInteractions,
        idealRanges,
        props.repQuestionRateData,
    ]);

    useEffect(() => {
        const data = {
            repTalkRatioData: props.repTalkRatioData,
            repMonologueClientData: props.repMonologueClientData,
            repMonologueRepData: props.repMonologueRepData,
            repInteractivityData: props.repInteractivityData,
            repPatienceData: props.repPatienceData,
            repQuestionRateData: props.repQuestionRateData,
        };
        setStatsData(data);
    }, [
        props.repTalkRatioData,
        props.repMonologueClientData,
        props.repMonologueRepData,
        props.repInteractivityData,
        props.repPatienceData,
        props.repQuestionRateData,
    ]);

    const handleRepSelection = (repId) => {
        if (!repId) {
            setRepsToCompare([]);
            return;
        }
        let repIndexInArray = repsToCompare.indexOf(repId);
        if (repIndexInArray !== -1) {
            let updatedArray = [...repsToCompare];
            updatedArray.splice(repIndexInArray, 1);
            setRepsToCompare(updatedArray);
        } else {
            setRepsToCompare([...repsToCompare, repId]);
        }
    };

    const handleCloseModal = () => {
        setIsCompareActive(false);
        setRepsToCompare([]);
    };

    return (
        <Suspense fallback={<FallbackUI />}>
            <Spinner loading={props.isLoading || isUpdating} tip="Loading...">
                <div className="stats-interactions-container">
                    <Modal
                        className="comparer-modal"
                        visible={isCompareActive}
                        title={
                            repsToCompare.length === 2
                                ? "Comparison between Reps"
                                : "Select any two reps"
                        }
                        onOk={() => handleCloseModal()}
                        onCancel={() => handleCloseModal()}
                        footer={""}
                        width={1040}
                    >
                        <InteractionsCompareWrapper
                            data={statsData}
                            repsToCompare={repsToCompare}
                            handleRepSelection={handleRepSelection}
                        />
                    </Modal>
                    <div className="stats-details">
                        <div className="row legend-wrapper">
                            <div className="interactions-help-text col-10">
                                <p className="stats-activity-help-text">
                                    <i
                                        className="fa fa-info-circle"
                                        aria-hidden="true"
                                    ></i>
                                    {+props.activestatsRep !== 0 ? (
                                        <>{activeCardData.repHelpText}</>
                                    ) : (
                                        <>{activeCardData.teamHelpText}</>
                                    )}
                                </p>
                            </div>
                            <div className="col-14 legend-container">
                                <InteractionLegend />
                            </div>
                        </div>
                        {/* Team Cards Section for Interactions */}
                        <div className="interactions-cards">
                            <Radio.Group
                                value={props.activeTeamCardInteractions}
                                size="large"
                                onChange={(e) =>
                                    props.handleActiveTeamCardInteractions(
                                        e.target.value
                                    )
                                }
                            >
                                {props.teamCardsInteractions.map(
                                    (option, idx) => {
                                        return (
                                            <Radio.Button
                                                key={uid() + idx}
                                                value={idx}
                                            >
                                                {option.tabName}
                                            </Radio.Button>
                                        );
                                    }
                                )}
                            </Radio.Group>
                            <div className="compare-cta">
                                <Tooltip
                                    placement={"left"}
                                    destroyTooltipOnHide
                                    title={
                                        repsToCompare.length < 2
                                            ? "Select any two reps to compare"
                                            : "Click to compare reps attributes"
                                    }
                                >
                                    <Button
                                        disabled={
                                            isCompareActive ||
                                            props.showingSampleData
                                        }
                                        type="primary"
                                        shape="round"
                                        onClick={() => {
                                            setIsCompareActive(true);
                                            // openNotification(
                                            //     'info',
                                            //     'Select Rep',
                                            //     'Select any two reps to compare'
                                            // );
                                        }}
                                    >
                                        Compare
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                        <div className="stats-scale">
                            <InteractionScale
                                max={
                                    props.interactionsMaxValues[
                                        activeCardData.type
                                    ]
                                }
                                selectedIdealRange={selectedIdealRange}
                            />
                        </div>
                    </div>
                    <div
                        className="stats-bottom-section"
                        id="stats-bottom-section"
                    >
                        <Skeleton
                            loading={props.isLoading || isUpdating}
                            active
                            title={false}
                            paragraph={{ rows: props.repsOptions.length }}
                        >
                            {!props.isLoading && repData.length ? (
                                repData.map((rep, idx, data) => {
                                    let repId = +rep.repId;
                                    return +repId === 0 ? null : (
                                        <InteractionRep
                                            key={uid() + idx}
                                            idx={idx}
                                            rep={rep}
                                            avg={
                                                props[activeCardData.repData][
                                                    repId
                                                ]
                                                    ? props[
                                                          activeCardData.repData
                                                      ][repId][
                                                          activeCardData
                                                              .repDataType
                                                      ]
                                                    : 0
                                            }
                                            calls={
                                                props[activeCardData.repData][
                                                    repId
                                                ] &&
                                                props[activeCardData.repData][
                                                    repId
                                                ].calls
                                                    ? props[
                                                          activeCardData.repData
                                                      ][repId].calls
                                                    : []
                                            }
                                            activeCardData={activeCardData}
                                            teamAvg={
                                                +props.interactionsMaxValues[
                                                    activeCardData.type
                                                ] === 0
                                                    ? 0
                                                    : props.tileData[
                                                          activeCardData.type
                                                      ]
                                            }
                                            max={
                                                props.interactionsMaxValues[
                                                    activeCardData.type
                                                ]
                                            }
                                            addRepGraphData={
                                                rep.graphs &&
                                                rep.graphs[activeCardData.type]
                                                    ? () => {}
                                                    : props.addRepGraphData
                                            }
                                            isLoadingRepGraph={
                                                props.isLoadingRepGraph
                                            }
                                            checkboxDisabled={
                                                repsToCompare.length === 2 &&
                                                repsToCompare.indexOf(repId) ===
                                                    -1
                                            }
                                            handleRepSelection={
                                                handleRepSelection
                                            }
                                            selectedIdealRange={
                                                selectedIdealRange
                                            }
                                            // isCompareActive={isCompareActive}
                                            showingSampleData={
                                                props.showingSampleData
                                            }
                                        />
                                    );
                                })
                            ) : (
                                <NoData description={"No Data found"} />
                            )}
                        </Skeleton>
                    </div>
                </div>
            </Spinner>
        </Suspense>
    );
}
