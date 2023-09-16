import { formatFloat } from "@tools/helpers";
import { Drawer, Skeleton } from "antd";
import { useSelector } from "react-redux";
import CloseSvg from "app/static/svg/CloseSvg";
import PlaySvgA from "app/static/svg/PlaySvgA";
import { InsightSummaryCard } from "../CIInsights/CIInsightsDetalis";
import { CustomInsightSummaryCard } from "../CIInsights/CustomInsightSummaryCard";
import DisplayTrend from "app/components/AnalyticsDashboard/Components/DisplayTrend";
import {
    HomeContext,
    MeetingTypeConst,
} from "app/components/container/Home/Home";
import { useContext } from "react";

export default function PhraseDetailsDrawer({
    handleClose,
    isVisible,
    handleSnippetClick = () => {},
}) {
    const { meetingType } = useContext(HomeContext);
    const { phraseStats } = useSelector((state) => state.CISlice);
    const { stats_threshold } = useSelector(
        (state) => state.common.versionData
    );
    const avgAiScore =
        formatFloat(phraseStats?.data?.call_score?.ai_avg_score, 2) || 0;

    const renderSentiment = (n) => {
        return n === 0 ? (
            <span
                style={{
                    color: "#CECECE",
                }}
            >
                {" "}
                Neutral
            </span>
        ) : n > 0 ? (
            <span
                style={{
                    color: "#38AA00",
                }}
            >
                Positive
            </span>
        ) : (
            <span
                style={{
                    color: "#FF3639",
                }}
            >
                Negative
            </span>
        );
    };

    return (
        <Drawer
            placement="right"
            onClose={handleClose}
            visible={isVisible}
            getContainer={false}
            className="snippetsDrawer phraseStatsDrawer"
            bodyStyle={{
                padding: "0",
            }}
            title={<div className="font20 blod600">Detailed Analysis</div>}
            extra={
                <>
                    <span className="curPoint" onClick={handleClose}>
                        <CloseSvg />
                    </span>
                </>
            }
        >
            {phraseStats?.loading ? (
                <Skeleton
                    active
                    paragraph={{ rows: 8 }}
                    title={false}
                    style={{ marginTop: "10px" }}
                />
            ) : (
                <div
                    style={{
                        boxShadow: "0px 4px 20px 0px #1515150D",
                    }}
                    className="paddingLR14 borderRadius6"
                >
                    <div className="marginTB16">
                        <span className="reason_title font18 bold600 marginR8">
                            {phraseStats?.data?.name}
                        </span>
                        {/* <InfoCircleSvg /> */}
                    </div>
                    <div
                        style={{
                            boxShadow: "0px 4px 20px rgba(21, 21, 21, 0.10)",
                            background: "#ffffff",
                        }}
                    >
                        <div
                            className="flex justifySpaceBetween padding16 borderBottom"
                            style={{
                                borderBottom: "1px solid #9999991A",
                            }}
                        >
                            <div className="dove_gray_cl">Occurence</div>
                            <div>
                                {phraseStats?.data?.detail_data?.occurrences}
                            </div>
                        </div>

                        <div
                            className="flex justifySpaceBetween padding16 borderBottom"
                            style={{
                                borderBottom: "1px solid #9999991A",
                            }}
                        >
                            <div className="dove_gray_cl">
                                {meetingType === MeetingTypeConst.chat
                                    ? "Chats"
                                    : meetingType === MeetingTypeConst.email
                                    ? "Emails"
                                    : "Calls"}
                            </div>
                            <div>{phraseStats?.data?.detail_data?.calls}</div>
                        </div>

                        <div
                            className="flex justifySpaceBetween padding16 borderBottom"
                            style={{
                                borderBottom: "1px solid #9999991A",
                            }}
                        >
                            <div className="dove_gray_cl">Trend</div>
                            <div>
                                <DisplayTrend
                                    trend={
                                        phraseStats?.data?.detail_data?.trend
                                    }
                                    style={{
                                        fontSize: "14px",
                                    }}
                                    color={true}
                                />
                            </div>
                        </div>

                        <div
                            className="flex justifySpaceBetween padding16 borderBottom"
                            style={{
                                borderBottom: "1px solid #9999991A",
                            }}
                        >
                            <div className="dove_gray_cl">Account</div>
                            <div>
                                {phraseStats?.data?.detail_data?.account_data}
                            </div>
                        </div>

                        <div className="flex justifySpaceBetween padding16 borderBottom">
                            <div className="dove_gray_cl">Sentiment</div>
                            <div>
                                {renderSentiment(
                                    phraseStats?.data?.detail_data?.sentiment
                                )}
                            </div>
                        </div>
                    </div>
                    <div
                        className="section_title"
                        style={{ marginTop: "10px" }}
                    >
                        Insights from{" "}
                        <strong>
                            {phraseStats?.data?.account_data?.total || 0}
                        </strong>{" "}
                        Accounts
                    </div>
                    <CustomInsightSummaryCard
                        total={phraseStats?.data?.account_data?.total}
                        data={phraseStats?.data?.account_data?.data}
                        handleSnippetClick={handleSnippetClick}
                    />

                    <div className="section_title">
                        Insights from{" "}
                        <strong>
                            {phraseStats?.data?.call_score?.total || 0}
                        </strong>{" "}
                        {meetingType === MeetingTypeConst.chat
                            ? "Chats"
                            : meetingType === MeetingTypeConst.email
                            ? "Emails"
                            : "Calls"}
                    </div>

                    <InsightSummaryCard
                        title="AI Score"
                        total={phraseStats?.data?.call_score?.total || 0}
                        avgAiScore={{
                            value: avgAiScore,
                            color:
                                avgAiScore >= stats_threshold?.good
                                    ? "#52C41A"
                                    : avgAiScore >= stats_threshold?.bad
                                    ? "#ECA51D"
                                    : "#FF6365",
                        }}
                        handleSnippetClick={handleSnippetClick}
                        pie_data={
                            phraseStats?.data?.call_score?.total
                                ? [
                                      {
                                          id: "Good",
                                          label: "Good",
                                          count: phraseStats?.data?.call_score
                                              ?.good,
                                          value: formatFloat(
                                              (phraseStats?.data?.call_score
                                                  ?.good /
                                                  phraseStats?.data?.call_score
                                                      ?.total) *
                                                  100,
                                              1
                                          ),
                                          color: `#52C41A`,
                                      },
                                      {
                                          id: "Average",
                                          label: "Average",

                                          count: phraseStats?.data?.call_score
                                              ?.avg,
                                          value: formatFloat(
                                              (phraseStats?.data?.call_score
                                                  ?.avg /
                                                  phraseStats?.data?.call_score
                                                      ?.total) *
                                                  100,
                                              1
                                          ),
                                          color: "#ECA51D",
                                      },
                                      {
                                          id: "Bad",
                                          label: "Bad",
                                          count: phraseStats?.data?.call_score
                                              ?.bad,
                                          value: formatFloat(
                                              (phraseStats?.data?.call_score
                                                  ?.bad /
                                                  phraseStats?.data?.call_score
                                                      ?.total) *
                                                  100,
                                              1
                                          ),
                                          color: "#FF6365",
                                      },
                                  ]
                                : []
                        }
                    />

                    <InsightSummaryCard
                        title="Sentiment"
                        total={phraseStats?.data?.sentiment?.total || 0}
                        handleSnippetClick={handleSnippetClick}
                        pie_data={
                            phraseStats?.data?.sentiment?.total
                                ? [
                                      {
                                          id: "Positive",
                                          label: "Positive",
                                          count: phraseStats?.data?.sentiment
                                              ?.positive,
                                          value: formatFloat(
                                              (phraseStats?.data?.sentiment
                                                  ?.positive /
                                                  phraseStats?.data?.sentiment
                                                      ?.total) *
                                                  100,
                                              1
                                          ),
                                          color: `#38AA00`,
                                      },
                                      {
                                          id: "Neutral",
                                          label: "Neutral",

                                          count: phraseStats?.data?.sentiment
                                              ?.neutral,
                                          value: formatFloat(
                                              (phraseStats?.data?.sentiment
                                                  ?.neutral /
                                                  phraseStats?.data?.sentiment
                                                      ?.total) *
                                                  100,
                                              1
                                          ),
                                          color: "#CECECE",
                                      },
                                      {
                                          id: "Negative",
                                          label: "Negative",
                                          count: phraseStats?.data?.sentiment
                                              ?.negative,
                                          value: formatFloat(
                                              (phraseStats?.data?.sentiment
                                                  ?.negative /
                                                  phraseStats?.data?.sentiment
                                                      ?.total) *
                                                  100,
                                              1
                                          ),
                                          color: "#FF3639",
                                      },
                                  ]
                                : []
                        }
                    />

                    <div className="section_title">
                        Insights from{" "}
                        <strong>{phraseStats?.data?.agent?.total}</strong>{" "}
                        Agents
                    </div>

                    <InsightSummaryCard
                        title="Agent Performance"
                        total={phraseStats?.data?.agent?.total || 0}
                        handleSnippetClick={handleSnippetClick}
                        pie_data={
                            phraseStats?.data?.sentiment?.total
                                ? [
                                      {
                                          id: "Good Performers",
                                          label: "Good Performers",
                                          count: phraseStats?.data?.agent?.good,
                                          value: formatFloat(
                                              (phraseStats?.data?.agent?.good /
                                                  phraseStats?.data?.agent
                                                      ?.total) *
                                                  100,
                                              1
                                          ),
                                          color: `#52C41A`,
                                      },
                                      {
                                          id: "Average Performers",
                                          label: "Average Performers",

                                          count: phraseStats?.data?.agent?.avg,
                                          value: formatFloat(
                                              (phraseStats?.data?.agent?.avg /
                                                  phraseStats?.data?.agent
                                                      ?.total) *
                                                  100,
                                              1
                                          ),
                                          color: "#ECA51D",
                                      },
                                      {
                                          id: "Bad Performers",
                                          label: "Bad Performers",
                                          count: phraseStats?.data?.agent?.bad,
                                          value: formatFloat(
                                              (phraseStats?.data?.agent?.bad /
                                                  phraseStats?.data?.agent
                                                      ?.total) *
                                                  100,
                                              1
                                          ),
                                          color: "#FF3635",
                                      },
                                  ]
                                : []
                        }
                    />
                </div>
            )}
        </Drawer>
    );
}
