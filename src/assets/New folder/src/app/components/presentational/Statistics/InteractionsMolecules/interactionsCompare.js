import { trimNumber } from "@tools/helpers";
import { Tooltip } from "antd";
import React from "react";

export default function InteractionsCompare({
    activeCardData,
    maxComplement,
    data,
}) {
    return (
        <>
            <div
                className={`row avg details comparison-container ${
                    data.isNA ? "data-na" : ""
                }`}
            >
                <div className="col-5">
                    <span className="paragraph strong">
                        <Tooltip
                            destroyTooltipOnHide
                            title={activeCardData.helpText}
                            placement={"top"}
                        >
                            <i
                                className="fa fa-info-circle"
                                aria-hidden="true"
                            ></i>
                            &nbsp;
                        </Tooltip>
                        {activeCardData.tabName}
                    </span>
                </div>
                <div className="col-4">
                    <span>{data.repFirst}</span>
                </div>
                <div className="col-11 bar-container flexImp alignCenter">
                    <div className={`bar ${data.isNA ? "left" : data.class}`}>
                        <span
                            className="bar-line"
                            style={{
                                width: data.isNA
                                    ? "200%"
                                    : `${
                                          (data.complement / maxComplement) *
                                          100
                                      }%`,
                                background: data.isNA
                                    ? "#dc0d0e"
                                    : activeCardData.color,
                            }}
                        ></span>
                        <span className="value">
                            {data.isNA
                                ? "NA"
                                : `${trimNumber(data.complement * 100)}%`}
                        </span>
                    </div>
                </div>
                <div className="col-4">
                    <span>{data.repSecond}</span>
                </div>
            </div>
            {data.inIdeal ? (
                <>
                    <div
                        className={`row in-ideal details comparison-container ${
                            data.isNA ? "data-na" : ""
                        }`}
                    >
                        <div className="col-5">
                            <span className="paragraph strong">
                                % Calls in ideal <br /> range (
                                {activeCardData.tabName})
                            </span>
                        </div>
                        <div className="col-4">
                            <span>{data.repFirstInRange}</span>
                        </div>
                        <div className="col-11 bar-container flexImp alignCenter">
                            <div
                                className={`bar ${
                                    data.isNA ? "left" : data.inIdeal.class
                                }`}
                            >
                                <span
                                    className="bar-line"
                                    style={{
                                        width: data.isNA
                                            ? "200%"
                                            : `${
                                                  (data.inIdeal.complement /
                                                      maxComplement) *
                                                  100
                                              }%`,
                                        background: data.isNA
                                            ? "#dc0d0e"
                                            : activeCardData.color,
                                    }}
                                ></span>
                                <span className="value">
                                    {data.isNA
                                        ? "NA"
                                        : `${trimNumber(
                                              data.inIdeal.complement * 100
                                          )}%`}
                                </span>
                            </div>
                        </div>
                        <div className="col-4">
                            <span>{data.repSecondInRange}</span>
                        </div>
                    </div>
                    <div
                        className={`row out-ideal details comparison-container ${
                            data.isNA ? "data-na" : ""
                        }`}
                    >
                        <div className="col-5">
                            <span className="paragraph strong">
                                % Calls outside ideal <br /> range (
                                {activeCardData.tabName})
                            </span>
                        </div>
                        <div className="col-4">
                            <span>{data.repFirstOutRange}</span>
                        </div>
                        <div className="col-11 bar-container flexImp alignCenter">
                            <div
                                className={`bar ${
                                    data.isNA ? "left" : data.outIdeal.class
                                }`}
                            >
                                <span
                                    className="bar-line"
                                    style={{
                                        width: data.isNA
                                            ? "200%"
                                            : `${
                                                  (data.outIdeal.complement /
                                                      maxComplement) *
                                                  100
                                              }%`,
                                        background: data.isNA
                                            ? "#dc0d0e"
                                            : activeCardData.color,
                                    }}
                                ></span>
                                <span className="value">
                                    {data.isNA
                                        ? "NA"
                                        : `${trimNumber(
                                              data.outIdeal.complement * 100
                                          )}%`}
                                </span>
                            </div>
                        </div>
                        <div className="col-4">
                            <span>{data.repSecondOutRange}</span>
                        </div>
                    </div>
                </>
            ) : null}
        </>
    );
}
