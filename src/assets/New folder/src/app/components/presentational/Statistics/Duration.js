import React, { useState, useEffect } from "react";
import { ProgressBar } from "@reusables";
import statisticsConfig from "@constants/Statistics";
import { Tooltip } from "antd";
import { compareValues, uid } from "@helpers";

const Duration = (props) => {
    const [selectedSort, setselectedSort] = useState("desc");
    const [topicSortedData, settopicSortedData] = useState([]);

    useEffect(() => {
        if (props.topics) {
            let data = props.topics
                .map((topic) => {
                    if (props.topicData) {
                        return {
                            ...topic,
                            avg: props.topicData[topic.id]
                                ? props.topicData[topic.id].avg
                                : 0,
                        };
                    }
                })
                .filter((t) => t);
            settopicSortedData(data.sort(compareValues("avg", selectedSort)));
        }
    }, [props.topics, props.topicData]);

    return (
        <div className="stats-topics-duration-container">
            {/* labels */}
            <div className="stats-topics-grid-labels">
                <h4 className="stats-topics-grid-label1">TOPIC</h4>
                <h4 className="stats-topics-grid-label2">DURATION</h4>
            </div>
            <div className="stats-topics-duration-container-wrapper">
                {/* contents */}
                {topicSortedData.map((topic, idx) => {
                    return (
                        <div
                            key={uid() + idx}
                            className="stats-topics-grid-content"
                        >
                            <div
                                className="stats-topics-grid-content-item1"
                                onClick={props.handleSelectedTopic}
                            >
                                <Tooltip
                                    destroyTooltipOnHide
                                    placement={"right"}
                                    title={topic.name}
                                >
                                    <button
                                        className="accessibility"
                                        value={topic.id}
                                        title={topic.name}
                                    >
                                        {topic.name}
                                    </button>
                                </Tooltip>
                            </div>
                            <div className="stats-topics-grid-content-item2">
                                <ProgressBar
                                    percentage={
                                        (topic.avg * 100) / props.durationMax
                                    }
                                    color={topic.color}
                                />
                            </div>
                            <div className="stats-topics-grid-content-item3">
                                {+topic.avg.toFixed(2)}
                                <>{statisticsConfig.TOPIC_UNIT}</>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Duration;
