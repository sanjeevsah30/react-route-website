import React, { Fragment } from "react";
import { getChartMarks } from "@tools/helpers";

export default function InteractionScale(props) {
    const chartMarks = props.max ? getChartMarks(props.max) : [];
    return (
        <div className="row">
            <div className="col-3">
                <span className="paragraph strong ellipsis">Rep Name</span>
            </div>
            <div className="col-12 grid">
                <p className="grid-ticks">
                    {props.max
                        ? chartMarks.map((mark) => {
                              return (
                                  <Fragment key={mark}>
                                      <span
                                          className="grid-ticks-mark"
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
                                          {mark}
                                      </span>
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
                    <span className="grid-ticks-mark" style={{ left: `0%` }}>
                        0
                    </span>
                    <span className="grid-ticks-bar" style={{ left: `0%` }}>
                        |
                    </span>
                    <span className="zeroline"></span>
                </p>
            </div>
            <div className="col-9">
                <div className="row repStats">
                    <div className={`col-6`}>
                        <span className="paragraph strong ellipsis">Avg</span>
                    </div>
                    {props.selectedIdealRange.idealMin ? (
                        <>
                            <div className="col-8">
                                <span className="paragraph strong">
                                    % calls in
                                    <br /> ideal range
                                </span>
                            </div>
                            <div className="col-10">
                                <span className="paragraph strong">
                                    % calls outside <br /> ideal range
                                </span>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
