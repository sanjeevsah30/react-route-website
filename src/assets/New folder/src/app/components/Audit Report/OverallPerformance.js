import { Button, Row } from "antd";
import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";

import { getDateTime } from "@tools/helpers";

import AiCard from "./AiCard";
import LoadingCards from "./LoadingCards";
import { AuditCard } from "../AnalyticsDashboard/Components/AuditDashboardAnalytics";
import { auditCardLabels } from "../AnalyticsDashboard/Constants/dashboard.constants";
import { HomeContext } from "../container/Home/Home";
import PageFilters from "../presentational/PageFilters/PageFilters";
import FillterSvg from "app/static/svg/FillterSvg";
import { FiltersDrawer } from "./AuditorTab";

function OverallPerformance({
    showAiCards,
    loading,
    overallPerformanceDetails,
    filterDates,
    manual_audit_score,
    ai_audit_score,
    showFilters,
}) {
    const date = new Date();
    const { cardsLoading } = useSelector((state) => state.auditReport);
    const versionData = useSelector((state) => state.common.versionData);
    const { meetingType } = useContext(HomeContext);
    const [visible, setVisible] = useState(false);

    return (
        <>
            <div className="marginT21 marginB6 flex justifySpaceBetween alignCenter">
                <span className="font20 bold600">
                    Overall Performance{" "}
                    {versionData?.domain_type === "b2c" ? "" : "(Manual Audit)"}
                </span>
                {showFilters && (
                    <div className="flex alignCenter">
                        <PageFilters hideDuration={true} hideRepSelect={true} />
                        <Button
                            className="borderRadius4 capitalize flex alignCenter"
                            size={36}
                            onClick={() => setVisible(true)}
                            style={{
                                height: "36px",
                                marginLeft: "10px",
                            }}
                        >
                            <FillterSvg
                                style={{
                                    color: "#333333",
                                }}
                            />
                            <span>Filters</span>
                        </Button>
                    </div>
                )}

                <FiltersDrawer visible={visible} setVisible={setVisible} />
            </div>
            <span className="dusty_gray_cl font14 marginB20 inlineBlock">
                Last Updated on{" "}
                {getDateTime(
                    date,
                    undefined,
                    undefined,
                    "MMM dd, yyyy - HH:MM"
                )}
            </span>
            {showAiCards && (
                <div className="ai_card_container">
                    <Row gutter={[16, 24]}>
                        {cardsLoading ? (
                            <LoadingCards count={2} />
                        ) : (
                            <>
                                {versionData?.domain_type === "b2c" && (
                                    <AiCard
                                        title="Ai Audit Score"
                                        score={ai_audit_score}
                                    />
                                )}
                                <AiCard
                                    title="Manual Audit Score"
                                    score={manual_audit_score}
                                />
                            </>
                        )}
                    </Row>
                </div>
            )}
            <Row gutter={[16, 24]} className="audit_cards_container">
                {cardsLoading ? (
                    <LoadingCards count={3} />
                ) : (
                    overallPerformanceDetails?.map((audit_card, index) => {
                        return (
                            <AuditCard
                                {...audit_card}
                                change={audit_card?.change?.toFixed(2)}
                                key={index}
                                lg={4}
                                title={auditCardLabels[audit_card?.name]?.title}
                            />
                        );
                    })
                )}
            </Row>
        </>
    );
}

export default OverallPerformance;
