import React, { useState, useEffect } from "react";
import { Button, Modal, Radio } from "antd";
import { Tag } from "antd";
import { useSelector } from "react-redux";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getRandomColors, uid } from "@tools/helpers";

const { CheckableTag } = Tag;

export default function TopicCompareModal(props) {
    const [showCompare, setShowCompare] = useState(false);
    const [selectedReps, setSelectedReps] = useState([]);
    const topicData = useSelector((state) => state.stats.topicDuration);
    const topics = useSelector((state) => state.common.topics);
    const [selectedComparisonType, setSelectedComparisonType] = useState("avg");
    const [maxComplements, setMaxComplements] = useState({
        maxAvg: 0,
        maxPercentage: 0,
    });
    const [comparisonData, setComparisonData] = useState([]);

    useEffect(() => {
        if (selectedReps.length === 2) {
            getComparisonData();
        }
    }, [selectedComparisonType, selectedReps]);

    const handleShowCompare = () => {
        if (showCompare) {
            setSelectedReps([]);
        }
        setShowCompare((prev) => !prev);
    };

    const handleRepSelect = (rep, checked) => {
        if (selectedReps.length < 2 || selectedReps.indexOf(rep) > -1) {
            const nextSelectedTags = checked
                ? [...selectedReps, rep]
                : selectedReps.filter((t) => t !== rep);
            setSelectedReps(nextSelectedTags);
        }
    };

    const getComparisonBar = (val1, val2) => {
        if (val1 > val2) {
            return {
                class: "left",
                complement: val2 ? (val1 / val2).toFixed(2) : val1.toFixed(2),
            };
        } else if (val1 < val2) {
            return {
                class: "right",
                complement: val1 ? (val2 / val1).toFixed(2) : val2.toFixed(2),
            };
        } else {
            return {
                class: "equal",
                complement: 0,
            };
        }
    };

    const getComparisonData = () => {
        let maxAvg = 0;
        let maxPercentage = 0;
        const comparisonData = topics.map((topic) => {
            let firstRepData = {
                duration_avg: 0,
                presence_per_call: 0,
            };
            let secondRepData = {
                duration_avg: 0,
                presence_per_call: 0,
            };
            if (topicData[topic.id]) {
                let firstDataFound = topicData[topic.id].find(
                    (details) => +details.speaker_id === +selectedReps[0]
                );
                let secondDataFound = topicData[topic.id].find(
                    (details) => +details.speaker_id === +selectedReps[1]
                );
                firstRepData = firstDataFound || firstRepData;
                secondRepData = secondDataFound || secondRepData;
            }
            let avgBarData = getComparisonBar(
                firstRepData.duration_avg,
                secondRepData.duration_avg
            );
            let percentageBarData = getComparisonBar(
                firstRepData.presence_per_call * 100,
                secondRepData.presence_per_call * 100
            );
            maxAvg =
                +avgBarData.complement > +maxAvg
                    ? +avgBarData.complement
                    : +maxAvg;
            maxPercentage =
                +percentageBarData.complement > +maxPercentage
                    ? +percentageBarData.complement
                    : +maxPercentage;
            return {
                id: topic.id,
                name: topic.name,
                firstRep_avg: firstRepData.duration_avg,
                firstRep_percentage: firstRepData.presence_per_call,
                secondRep_avg: secondRepData.duration_avg,
                secondRep_percentage: secondRepData.presence_per_call,
                complement_avg: avgBarData.complement,
                class_avg: avgBarData.class,
                complement_percentage: percentageBarData.complement,
                class_percentage: percentageBarData.class,
            };
        });

        setMaxComplements({
            maxAvg,
            maxPercentage,
        });
        setComparisonData(comparisonData);
    };

    return (
        <div className="compare-wrapper col-24">
            <Button
                className="topic-compare-btn"
                type={"primary"}
                shape={"round"}
                onClick={handleShowCompare}
            >
                Compare
            </Button>
            <Modal
                className="topic-comparer-modal"
                visible={showCompare}
                title={
                    selectedReps.length < 2 ? (
                        "Select atmost two reps to compare"
                    ) : (
                        <>
                            <Button
                                type={"primary"}
                                shape={"round"}
                                icon={<ArrowLeftOutlined />}
                                onClick={() => {
                                    setSelectedReps([]);
                                }}
                            >
                                Back
                            </Button>
                            <span>Topic wise comparison</span>
                        </>
                    )
                }
                onOk={() => handleShowCompare()}
                onCancel={() => handleShowCompare()}
                footer={""}
                width={1040}
            >
                {selectedReps.length < 2 ? (
                    <>
                        {props.reps.map((rep) => {
                            return Object.keys(rep)[0] ? (
                                <CheckableTag
                                    className={
                                        selectedReps.length === 2
                                            ? "disabled"
                                            : ""
                                    }
                                    key={Object.values(rep)[0]}
                                    checked={
                                        selectedReps.indexOf(
                                            Object.values(rep)[0]
                                        ) > -1
                                    }
                                    onChange={(checked) =>
                                        handleRepSelect(
                                            +Object.values(rep)[0],
                                            checked
                                        )
                                    }
                                >
                                    {Object.values(rep)[1]}
                                </CheckableTag>
                            ) : null;
                        })}
                    </>
                ) : (
                    <>
                        <div className="row comparison-type">
                            <Radio.Group
                                onChange={(e) =>
                                    setSelectedComparisonType(e.target.value)
                                }
                                value={selectedComparisonType}
                            >
                                <Radio value={"avg"}>Avg. Time (in sec)</Radio>
                                <Radio value={"percentage"}>
                                    % Calls ( Where topic was mentioned )
                                </Radio>
                            </Radio.Group>
                        </div>
                        <div className="comparison-table">
                            <div className="row">
                                <div className="col-4 matrices">
                                    <span className="paragraph strong label">
                                        Matrices
                                    </span>
                                </div>
                                <div className="col-4 rep-first">
                                    <span className="paragraph strong label">
                                        {
                                            Object.values(
                                                props.reps.find(
                                                    (rep) =>
                                                        +Object.values(
                                                            rep
                                                        )[0] ===
                                                        +selectedReps[0]
                                                )
                                            )[1]
                                        }
                                    </span>
                                </div>
                                <div className="col-12 difference">
                                    <span className="paragraph strong label">
                                        Difference
                                    </span>
                                </div>
                                <div className="col-4 rep-second">
                                    <span className="paragraph strong label">
                                        {
                                            Object.values(
                                                props.reps.find(
                                                    (rep) =>
                                                        +Object.values(
                                                            rep
                                                        )[0] ===
                                                        +selectedReps[1]
                                                )
                                            )[1]
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="topic-comparison-data comparison-container">
                                {comparisonData.map((topic) => {
                                    return (
                                        <div
                                            className="data-row row"
                                            key={uid() + topic.id}
                                        >
                                            <div className="col-4 topic-name">
                                                <span className="paragraph strong label">
                                                    {topic.name}
                                                </span>
                                            </div>
                                            <div className="col-4 rep-first-data">
                                                {selectedComparisonType ===
                                                "avg" ? (
                                                    <span>
                                                        {" "}
                                                        {topic.firstRep_avg.toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span>
                                                        {(
                                                            topic.firstRep_percentage *
                                                            100
                                                        ).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="col-12 difference-chart bar-container flexImp alignCenter">
                                                <div
                                                    className={`bar ${
                                                        selectedComparisonType ===
                                                        "avg"
                                                            ? topic.class_avg
                                                            : topic.class_percentage
                                                    }`}
                                                >
                                                    <span
                                                        className="bar-line"
                                                        style={{
                                                            background: `${getRandomColors(
                                                                topic.name
                                                            )}80`,
                                                            width:
                                                                selectedComparisonType ===
                                                                "avg"
                                                                    ? `${
                                                                          (topic.complement_avg /
                                                                              maxComplements.maxAvg) *
                                                                          100
                                                                      }%`
                                                                    : `${
                                                                          (topic.complement_percentage /
                                                                              maxComplements.maxPercentage) *
                                                                          100
                                                                      }%`,
                                                        }}
                                                    ></span>
                                                    <span className="value">
                                                        {selectedComparisonType ===
                                                        "avg"
                                                            ? `${topic.complement_avg}x`
                                                            : `${topic.complement_percentage}x`}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-4 rep-second-data">
                                                {selectedComparisonType ===
                                                "avg" ? (
                                                    <span>
                                                        {" "}
                                                        {topic.secondRep_avg.toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span>
                                                        {(
                                                            topic.secondRep_percentage *
                                                            100
                                                        ).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
}
