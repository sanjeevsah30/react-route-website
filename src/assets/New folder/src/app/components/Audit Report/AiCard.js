import { formatFloat } from "@tools/helpers";
import { Col } from "antd";
import React from "react";
import ReportPercentage from "./ReportPercentage";

function AiCard({ title = "", score }) {
    return (
        <Col xs={24} sm={24} md={12} lg={6} sl={6}>
            <div
                className={`performance_card  posRel ai_card  column `}
                data-testid="component-report-aicard"
            >
                <div className="circle posAbs"></div>
                <div className="section_top paddingL16 paddingT16 bold textWhite">
                    <div className="textWhite">{title}</div>
                    <div className="font24 bolder textWhite">
                        {formatFloat(score?.count, 2)}%
                    </div>
                </div>

                <div className="paddingLR36 paddingTB10 bgWhite bold section_bottom posAbs text-center ">
                    <ReportPercentage change={score?.change} />
                </div>
            </div>
        </Col>
    );
}

export default AiCard;
