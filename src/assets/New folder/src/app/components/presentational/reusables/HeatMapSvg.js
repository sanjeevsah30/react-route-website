import React from "react";
import config from "@constants/IndividualCall";
import { capitalizeFirstLetter, secondsToTime, uid } from "@helpers";
import { Popover, Button, Tooltip } from "antd";

function HeatMapSvg({
    bars,
    scaleFactor,
    showTimeBars,
    timeBars,
    totalLength,
    setcommentToAdd,
    commentToAdd,
    getComment,
    startAtPoint,
    sentimentMonologue,
}) {
    const abs = (num) => (num < 0 ? -num : num);

    if (showTimeBars) {
        for (let i = 0; i < config.MAXTIMEBARS; i++) {
            let currentTimeStamp = (i / config.MAXTIMEBARS) * totalLength;
            if (currentTimeStamp <= totalLength) {
                let content = (
                    <div className="flex justifySpaceBetween alignCenter">
                        <span className="font12 bold uppercase">
                            {secondsToTime(currentTimeStamp)}
                        </span>
                        {setcommentToAdd && (
                            <Button
                                type="link"
                                shape="round"
                                onClick={() => {
                                    setcommentToAdd(
                                        `${commentToAdd} @${secondsToTime(
                                            currentTimeStamp
                                        )} `
                                    );
                                    getComment();
                                }}
                            >
                                Add Comment
                            </Button>
                        )}
                    </div>
                );
                timeBars.push(
                    <Popover
                        overlayClassName="heatmap__popover"
                        key={i}
                        destroyTooltipOnHide={{ keepParent: false }}
                        placement="bottom"
                        content={content}
                    >
                        <div
                            className="timebar"
                            style={{
                                marginLeft: `${
                                    i / (config.MAXTIMEBARS / 100)
                                }%`,
                                width: `${1 / (config.MAXTIMEBARS / 100)}%`,
                            }}
                            onClick={() => {
                                if (
                                    startAtPoint &&
                                    typeof startAtPoint === "function"
                                ) {
                                    startAtPoint(currentTimeStamp, true);
                                }
                            }}
                        />
                    </Popover>
                );
            }
        }
    }

    return (
        <>
            <svg className="heatmap">
                <g>
                    {bars
                        ? bars.map((bar, index) => (
                              <rect
                                  className="subdivision"
                                  // eslint-disable-next-line react/no-array-index-key
                                  key={"heatmap" + index}
                                  x={`${bar.startsAt / scaleFactor}%`}
                                  fill={bar.color}
                                  rx="4px"
                                  width={`${
                                      abs(bar.endsAt - bar.startsAt) /
                                      scaleFactor
                                  }%`}
                              />
                          ))
                        : ""}
                </g>

                <foreignObject width="100%" height="100%">
                    {showTimeBars ? timeBars : ""}
                </foreignObject>
            </svg>
            <svg className="momment_heatmap">
                <g>
                    {sentimentMonologue
                        ? sentimentMonologue.map((bar, index) => (
                              <Tooltip
                                  title={`${capitalizeFirstLetter(
                                      bar.type
                                  )} Sentiment`}
                                  key={"heatmap1" + index}
                              >
                                  <circle
                                      className="subdivision curPoint"
                                      // eslint-disable-next-line react/no-array-index-key

                                      cx={`${
                                          bar.startsAt / scaleFactor - 0.5
                                      }%`}
                                      cy="4px"
                                      fill={bar.color}
                                      r="4px"
                                      onClick={() => {
                                          if (
                                              startAtPoint &&
                                              typeof startAtPoint === "function"
                                          ) {
                                              startAtPoint(bar.startsAt, true);
                                          }
                                      }}
                                      style={{
                                          transform: "translateX(4px)",
                                      }}
                                  />
                              </Tooltip>
                          ))
                        : ""}
                </g>

                {/* <foreignObject width="100%" height="100%">
                    {showTimeBars ? timeBars : ''}
                </foreignObject> */}
            </svg>
        </>
    );
}

export default React.memo(HeatMapSvg, (prev, next) => {
    return true;
});
