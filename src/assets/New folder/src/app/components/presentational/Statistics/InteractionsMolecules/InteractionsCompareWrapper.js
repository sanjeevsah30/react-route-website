import { getAllUsers } from "@store/common/actions";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InteractionsCompare from "./interactionsCompare";
import { isEmpty } from "lodash";
import { Button, Tag } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { uid } from "@tools/helpers";

const { CheckableTag } = Tag;
export default function InteractionsCompareWrapper({
    repsToCompare,
    data,
    handleRepSelection,
}) {
    const dispatch = useDispatch();
    const idealRanges = useSelector((state) => state.stats.idealRanges);
    const users = useSelector((state) => state.common.users);
    const [repFirstName, setRepFirstName] = useState("");
    const [repSecondName, setRepSecondName] = useState("");
    const [repCompareData, setRepCompareData] = useState({});
    const [maxComplement, setMaxComplement] = useState(0);

    useEffect(() => {
        // Get the users.
        if (!users.length) {
            dispatch(getAllUsers());
        }
    }, []);

    useEffect(() => {
        if (repsToCompare.length === 2) {
            setRepFirstName(
                users.find((user) => user.id === repsToCompare[0]).first_name
            );
            setRepSecondName(
                users.find((user) => user.id === repsToCompare[1]).first_name
            );
            if (data) {
                let compareData = {};
                let max = 0;
                Object.keys(data).forEach((key) => {
                    let repFirst = data[key][repsToCompare[0]];
                    let repSecond = data[key][repsToCompare[1]];
                    let comparisonBar = getComparisonBar(
                        repFirst ? repFirst.avg : 0,
                        repSecond ? repSecond.avg : 0
                    );
                    compareData[key] = {
                        repFirst: repFirst
                            ? `${repFirst.avg.toFixed(2)} ${TAB_DATA[key].unit}`
                            : "NA",
                        repSecond: repSecond
                            ? `${repSecond.avg.toFixed(2)} ${
                                  TAB_DATA[key].unit
                              }`
                            : "NA",
                        isNA: !repFirst || !repSecond,
                        ...comparisonBar,
                    };
                    if (max < comparisonBar.complement) {
                        max = comparisonBar.complement;
                    }

                    let selectedIdealRange = getIdealRanges(key);
                    if (!isEmpty(selectedIdealRange)) {
                        let inIdeal = getComparisonBar(
                            repFirst ? repFirst.in_ideal_range * 100 : 0,
                            repSecond ? repSecond.in_ideal_range * 100 : 0
                        );
                        let outIdeal = getComparisonBar(
                            100 -
                                (repFirst ? repFirst.in_ideal_range * 100 : 0),
                            100 -
                                (repSecond ? repSecond.in_ideal_range * 100 : 0)
                        );

                        compareData[key] = {
                            ...compareData[key],
                            inIdeal: inIdeal,
                            outIdeal: outIdeal,
                            repFirstInRange: repFirst
                                ? `${(repFirst.in_ideal_range * 100).toFixed(
                                      2
                                  )}%`
                                : "NA",
                            repSecondInRange: repSecond
                                ? `${(repSecond.in_ideal_range * 100).toFixed(
                                      2
                                  )}%`
                                : "NA",
                            repFirstOutRange: repFirst
                                ? `${(
                                      100 -
                                      repFirst.in_ideal_range * 100
                                  ).toFixed(2)}%`
                                : "NA",
                            repSecondOutRange: repSecond
                                ? `${(
                                      100 -
                                      repSecond.in_ideal_range * 100
                                  ).toFixed(2)}%`
                                : "NA",
                        };
                        max = Math.max(
                            max,
                            inIdeal.complement,
                            outIdeal.complement
                        );
                    }
                });
                setRepCompareData(compareData);
                setMaxComplement(max);
            }
        }
    }, [users, repsToCompare, data]);

    const TAB_DATA = {
        repTalkRatioData: {
            callData: "owner_talk_ratio",
            type: "talkRatio",
            tabName: "Rep Talk Ratio",
            unit: "%",
            color: "#FFD700",
            helpText:
                "Percentage of the call (average) where rep was speaking .",
        },
        repMonologueRepData: {
            callData: "longest_monologue_owner",
            tabName: "Longest Rep Monologue",
            type: "longestMonologue",
            unit: "sec",
            color: "#FFC5F7",
            helpText:
                "Average of longest time duration where this rep was speaking without a break.",
        },
        repMonologueClientData: {
            callData: "longest_monologue_client",
            type: "longestCustomerStory",
            tabName: "Longest Customer Monologue",
            unit: "sec",
            color: "#9292EE",
            helpText:
                "Average of longest time duration for which customer were speaking without a break when in call with this rep.",
        },
        repInteractivityData: {
            callData: "interactivity",
            type: "interactivity",
            tabName: "Interactivity",
            unit: "",
            color: "#B273FF",
            helpText:
                "Average of conversation switches per minute of call between all reps & client.",
        },
        repPatienceData: {
            callData: "patience",
            type: "patience",
            tabName: "Patience",
            unit: "sec",
            color: "#f8cc8c",
            helpText: "Time gap between customer finishing & rep speaking up",
        },
        repQuestionRateData: {
            callData: "owner_question_count",
            type: "questionRate",
            tabName: "Question Rate",
            unit: "",
            color: "#DD9EDA",
            helpText:
                "Average number of questions being asked by this rep during a call.",
        },
    };

    const getIdealRanges = (key) => {
        let selectedRange = idealRanges.find(
            (range) => range.metric === TAB_DATA[key].callData
        );
        if (selectedRange) {
            if (TAB_DATA[key].type === "talkRatio") {
                return {
                    idealMin: selectedRange.range_start * 100 || 0,
                    idealMax: selectedRange.range_end * 100 || 0,
                };
            } else if (TAB_DATA[key].type === "interactivity") {
                return {
                    idealMin: selectedRange.range_start * 10 || 0,
                    idealMax: selectedRange.range_end * 10 || 0,
                };
            } else {
                return {
                    idealMin: selectedRange.range_start || 0,
                    idealMax: selectedRange.range_end || 0,
                };
            }
        } else {
            return {};
        }
    };

    const getComparisonBar = (val1, val2) => {
        if (val1 > val2) {
            return {
                class: "left",
                complement: val2
                    ? +((val1 - val2) / val2).toFixed(2)
                    : +val1.toFixed(2),
            };
        } else if (val1 < val2) {
            return {
                class: "right",
                complement: val1
                    ? +((val2 - val1) / val1).toFixed(2)
                    : +val2.toFixed(2),
            };
        } else {
            return {
                class: "equal",
                complement: 0,
            };
        }
    };

    return (
        <>
            {repsToCompare.length === 2 ? (
                <div className="container comparer flex column maxHeightInherit">
                    <div className="flex1">
                        <Button
                            type="primary"
                            shape="round"
                            onClick={() => {
                                handleRepSelection();
                            }}
                            icon={<ArrowLeftOutlined />}
                        >
                            Back
                        </Button>
                    </div>
                    <div className="row header">
                        <div className="col-5">
                            <span className="paragraph strong">METRICS</span>
                        </div>
                        <div className="col-4 flexImp alignCenter">
                            <span className="paragraph strong ellipsis">
                                {repFirstName}
                            </span>
                        </div>
                        <div className="col-11">
                            <span className="paragraph strong ellipsis">
                                Difference
                            </span>
                        </div>
                        <div className="col-4 flexImp alignCenter">
                            <span className="paragraph strong ellipsis">
                                {repSecondName}
                            </span>
                        </div>
                    </div>
                    <div className="comparer__data flex1 overflowYscroll">
                        {Object.keys(repCompareData).map((key) => (
                            <InteractionsCompare
                                key={key}
                                activeCardData={TAB_DATA[key]}
                                maxComplement={maxComplement}
                                data={repCompareData[key]}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex topic-comparer-modal flexWrap">
                    {users.map((user) => (
                        <CheckableTag
                            className={
                                repsToCompare.length === 2 ? "disabled" : ""
                            }
                            key={uid() + user.id}
                            checked={repsToCompare.indexOf(user.id) !== -1}
                            onChange={() => handleRepSelection(user.id)}
                        >
                            {user.first_name}
                        </CheckableTag>
                    ))}
                </div>
            )}
        </>
    );
}
