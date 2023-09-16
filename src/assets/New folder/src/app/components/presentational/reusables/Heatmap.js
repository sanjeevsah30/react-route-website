// A Heatmap component that can be used across the app.

import React from "react";
import config from "@constants/IndividualCall";
import {
    QuestionOutlined,
    CommentOutlined,
    AimOutlined,
} from "@ant-design/icons";
import { secondsToTime, uid } from "@helpers";
import { Tooltip } from "antd";
import HeatMapSvg from "./HeatMapSvg";

const Heatmap = ({
    showCommunication,
    totalLength,
    communication,
    showTimeBars,
    bars,
    startAtPoint,
    getComment,
    activateContextMenu,
    playedSeconds,
    showTimeline,
    showPlayerTracker,
    setcommentToAdd,
    commentToAdd,
    sentimentMonologue,
}) => {
    const scaleFactor = totalLength / 100; // Seconds per percentage of width of heatmap.
    // const timeStop = props.totalLength / config.MAXTIMESTOPS; // Increment in each time stop.
    const timeStops = [];
    const timeBars = [];

    timeStops.push(0); // Add 00:00 to time stops.

    const renderedCommunication =
        showCommunication && communication ? (
            <div className="heatmap communicationsec nobg">
                {communication.map((comm, idx) => {
                    timeStops.push(comm.time);
                    return (
                        <Tooltip
                            destroyTooltipOnHide
                            key={idx}
                            placement="top"
                            title={comm.label || comm.text}
                        >
                            <div
                                className="communication"
                                style={{
                                    marginLeft: `${comm.time / scaleFactor}%`,
                                }}
                                onClick={() => {
                                    if (comm.type === config.QUESTIONTYPE) {
                                        if (
                                            startAtPoint &&
                                            typeof startAtPoint === "function"
                                        )
                                            startAtPoint(comm.time, true);
                                    } else if (
                                        comm.type === config.COMMENTTYPE
                                    ) {
                                        getComment();
                                    } else if (
                                        startAtPoint &&
                                        typeof startAtPoint === "function"
                                    )
                                        startAtPoint(comm.time, true);
                                }}
                            >
                                {comm.type === config.COMMENTTYPE && (
                                    <CommentOutlined />
                                )}
                                {comm.type === config.QUESTIONTYPE && (
                                    <QuestionOutlined />
                                )}
                                {comm.type === config.ACTIONTYPE && (
                                    <AimOutlined />
                                )}
                            </div>
                        </Tooltip>
                    );
                })}
            </div>
        ) : (
            ""
        );

    timeStops.push(totalLength); // Add the end point of the call.

    const timeline = showTimeline ? (
        <div className="heatmap-timeline">
            {timeStops.map((time, index) => {
                const timeToShow = secondsToTime(time);

                // Now we have the hours, minutes and seconds.
                // Just return them.

                return (
                    <div
                        className="timestop"
                        // eslint-disable-next-line react/no-array-index-key
                        key={uid() + index}
                        style={{
                            marginLeft: `calc(${time / scaleFactor}% ${
                                index === timeStops.length - 1
                                    ? " - 1.5rem"
                                    : " - 0.8rem"
                            })`,
                        }}
                    >
                        {timeToShow}
                    </div>
                );
            })}
        </div>
    ) : (
        ""
    );

    return (
        <div className="heatmap-container">
            {showCommunication ? renderedCommunication : ""}
            <div className="posRel">
                {scaleFactor && (
                    <HeatMapSvg
                        bars={bars}
                        scaleFactor={scaleFactor}
                        showTimeBars={showTimeBars}
                        timeBars={timeBars}
                        totalLength={totalLength}
                        setcommentToAdd={setcommentToAdd}
                        commentToAdd={commentToAdd}
                        getComment={getComment}
                        startAtPoint={startAtPoint}
                        sentimentMonologue={sentimentMonologue}
                    />
                )}

                {showPlayerTracker && (
                    <div
                        className="player-tracker"
                        style={{
                            left: `${playedSeconds / scaleFactor}%`,
                        }}
                    >
                        <span className="dropper">
                            <i className="fa fa-caret-up" aria-hidden="true" />
                        </span>
                    </div>
                )}
            </div>

            {timeline}
        </div>
    );
};

export default React.memo(Heatmap);
