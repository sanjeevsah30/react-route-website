import React from "react";
import { Col } from "antd";
import ReportPercentage from "./ReportPercentage";

const showLedger = (name) => {
    switch (name) {
        case "Failed Calls":
            return true;
        case "Red Alerts":
            return true;
        case "Zero Tolerance":
            return true;
        case "Failed Accounts":
            return true;
        default:
            return false;
    }
};
function PerformanceCard({ text_class, name, count, change, cardSection }) {
    const flag = showLedger(name);
    return (
        <Col xs={24} sm={24} md={12} lg={6} sl={6}>
            <div
                className={`performance_card paddingLR16 paddingT23 posRel ${
                    flag ? "red_ledger" : ""
                }`}
                data-testid="component-report-performance-card"
            >
                <div className="flex alignCenter justifySpaceBetween">
                    <div className={`bold`}>
                        {name === "Red Alerts"
                            ? `${cardSection} with ${name}`
                            : name === "Zero Tolerance"
                            ? `${name} ${cardSection}`
                            : name}
                    </div>
                    <ReportPercentage change={change} />
                </div>
                <div className="flex alignCenter justifySpaceBetween marginT5">
                    <div
                        className={`bolder font24 ${
                            flag ? "report_red_color" : text_class
                        }`}
                    >
                        {count}
                    </div>
                </div>
            </div>
        </Col>
    );
}

PerformanceCard.defaultProps = {
    text_class: "textBlue",
    cardSection: "",
};

export default PerformanceCard;
