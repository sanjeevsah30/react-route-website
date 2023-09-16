import routes from "@constants/Routes/index";
import { NoData } from "@presentational/reusables/index";
import {
    clearCISnippets,
    getCIInsightInDetail,
    getCIInsightSnippets,
    getCIInsightStats,
    getCIInsightTopic,
    getCIInsightTopicSnippets,
    getCIInsightTypeSnippets,
    setSnippetsInitialLoad,
} from "@store/cutsomerIntelligence/ciInsightsSlice";
import {
    capitalizeFirstLetter,
    formatFloat,
    numFormatter,
} from "@tools/helpers";
import { Col, Collapse, Row, Skeleton, Tooltip } from "antd";
import React, { useCallback, useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import ChevronDownSvg from "app/static/svg/ChevronDownSvg";
import ChevronUpSvg from "app/static/svg/ChevronUpSvg";
import PlaySvgA from "app/static/svg/PlaySvgA";
import SnippetPlaySvg from "app/static/svg/SnippetPlaySvg";
import { CIMainContext } from "../CIDashboard";
import MonologueDrawer from "../MonologueDrawer";
import CIDonutChart from "./CIDonutChart";
import CIDonutChartV2 from "./CIDonutChartV2";
import { CustomInsightSummaryCard } from "./CustomInsightSummaryCard";
import { alpha } from "./helper";
import EmptyDataState from "app/components/AnalyticsDashboard/Components/EmptyDataState";
import {
    HomeContext,
    MeetingTypeConst,
} from "app/components/container/Home/Home";

const getPieColor = (type) => {
    switch (type) {
        case "reason":
            return "#1a62f2";
        case "objection":
            return "#7030FE";
        case "question":
            return "#F564A9";
        case "reagion":
            return "#1a62f2";
        case "feature":
            return "#FE654F";
        case "competition":
            return "#333333";
        default:
            return "#1a62f2";
    }
};

const getName = (type) => {
    switch (type) {
        case "reason":
            return "Conversation Reason";
        case "objection":
            return "Objection";
        case "question":
            return "Question";
        case "reagion":
            return "Reagion";
        case "feature":
            return "Product Feature";
        case "competition":
            return "Competition";
        case "sentiment":
            return "Sentiment";
        default:
            return "Conversation Reason";
    }
};

export default function CIInsightsDetalis() {
    const { type, id } = useParams();
    const dispatch = useDispatch();
    const {
        common: {
            filterReps,
            filterDates,
            filterCallDuration,
            filterTeams,
            activeCallTag,
            teams,
        },
        CIInsightsSlice: {
            details,
            insightStats,
            insightTopics,
            snippets,
            nextSnippetsUrl,
            snippetsInitialLoad,
        },
    } = useSelector((state) => state);

    const { getPayload, activeStage } = useContext(CIMainContext);

    const [showDrawer, setShowDrawer] = useState(false);
    const { stats_threshold } = useSelector(
        (state) => state.common.versionData
    );

    const avgAiScore =
        formatFloat(insightStats?.data?.call_score?.ai_avg_score, 2) || 0;

    const handleSnippetClick = ({
        id,
        snippet_type,
        type,
        is_type = false,
        is_topic = false,
        topic_id,
    }) => {
        setShowDrawer(true);
        dispatch(setSnippetsInitialLoad(true));
        dispatch(
            is_type
                ? getCIInsightTypeSnippets({
                      id,
                      title: snippet_type,
                      type,
                      payload: getPayload(),
                  })
                : is_topic
                ? getCIInsightTopicSnippets({
                      insight_id: id,
                      topic_id,
                      payload: getPayload(),
                  })
                : getCIInsightSnippets({ id, payload: getPayload() })
        );
    };

    const getNext = useCallback(() => {
        dispatch(
            getCIInsightSnippets({
                next: nextSnippetsUrl,
                payload: getPayload(),
            })
        );
    }, [nextSnippetsUrl]);

    const handleClose = () => {
        setShowDrawer(false);
        dispatch(clearCISnippets());
    };

    useEffect(() => {
        const payload = getPayload();
        dispatch(getCIInsightInDetail({ type, payload }));
    }, [
        filterTeams.active,
        filterReps.active,
        filterCallDuration.active,
        filterDates.active,
        activeStage,
        activeCallTag,
    ]);

    useEffect(() => {
        const payload = getPayload();
        dispatch(getCIInsightStats({ id, payload }));
        if (+id) dispatch(getCIInsightTopic({ id, payload }));
    }, [
        filterTeams.active,
        filterReps.active,
        filterCallDuration.active,
        filterDates.active,
        activeStage,
        id,
        activeCallTag,
    ]);

    const color = getPieColor(type);
    const { meetingType } = useContext(HomeContext);

    return (
        <>
            <div
                className="insights_details marginB20"
                style={{
                    height: "20px",
                }}
            >
                <div className="section_1 flex alignCenter">
                    <Link
                        className="flex alignCenter"
                        to={`${routes.CI_DASHBOARD}/insights`}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M16.8449 7.61527H3.94192L9.57901 1.97818C10.0295 1.52768 10.0295 0.788384 9.57901 0.337879C9.12851 -0.112626 8.40077 -0.112626 7.95026 0.337879L0.337879 7.95026C-0.112626 8.40077 -0.112626 9.12851 0.337879 9.57901L7.95026 17.1914C8.40077 17.6419 9.12851 17.6419 9.57901 17.1914C10.0295 16.7409 10.0295 16.0132 9.57901 15.5627L3.94192 9.92556H16.8449C17.4802 9.92556 18 9.40574 18 8.77042C18 8.13509 17.4802 7.61527 16.8449 7.61527Z"
                                fill="#5F6368"
                            />
                        </svg>
                    </Link>

                    <span className="marginL10 bold600">
                        Detailed Insight View
                    </span>
                </div>
                <div className="section_2 paddingL26">
                    Showing insights for{" "}
                    <span className="bold600 mine_shaft_cl">
                        {details?.analyzed_calls || 0}
                    </span>{" "}
                    {meetingType === MeetingTypeConst.chat
                        ? "Chats"
                        : meetingType === MeetingTypeConst.email
                        ? "Emails"
                        : "Calls"}
                </div>
                <div className="section_3"></div>
            </div>
            <div className="insights_details">
                <div className="section_1 box">
                    {details?.loading ? (
                        <Skeleton
                            active
                            paragraph={{ rows: 8 }}
                            title={false}
                            style={{ marginTop: "10px" }}
                        />
                    ) : (
                        <>
                            <div className="flex column flexShrink marginB8">
                                <span className="bold600 marginR5 font16">
                                    {getName(type)}
                                </span>
                                <span className="dove_gray_cl">
                                    Identified in{" "}
                                    <span className="bold600 mine_shaft_cl">
                                        {formatFloat(
                                            (details.analyzed_calls /
                                                details.total_calls) *
                                                100,
                                            1
                                        )}
                                        %
                                    </span>{" "}
                                    of all conversations
                                </span>
                            </div>
                            <div className="donut_container flex">
                                {details?.data?.length ? (
                                    <CIDonutChart
                                        data={details?.data?.map?.(
                                            ({ insight_name, calls }, i) => ({
                                                id: insight_name,
                                                label: insight_name,
                                                value:
                                                    (calls /
                                                        details.analyzed_calls) *
                                                    100,

                                                color:
                                                    type === "sentiment"
                                                        ? insight_name
                                                              ?.toLowerCase()
                                                              ?.includes(
                                                                  "positive"
                                                              )
                                                            ? "#38AA00"
                                                            : insight_name
                                                                  ?.toLowerCase()
                                                                  ?.includes(
                                                                      "negative"
                                                                  )
                                                            ? "#FF3639"
                                                            : "#CECECE"
                                                        : `${color}${alpha[i]}`,
                                            })
                                        )}
                                        title={getName(type)}
                                        // total_occ={details?.data?.reduce(
                                        //     (sum, { occurrence }) => {
                                        //         return sum + occurrence;
                                        //     },
                                        //     0
                                        // )}
                                        total_occ={details.analyzed_calls}
                                    />
                                ) : (
                                    <EmptyDataState />
                                )}
                            </div>
                            {/* <div>
                    <div className="flex alignCenter">
                        <HandSvg />
                        <span className="bold600 marginL10 font16">
                            Insights
                        </span>
                    </div>
                    <div>
                        <ul className="insights_list">
                            <li>
                                You can work and carry-on and put lots of little
                                happy things in here..
                            </li>
                            <li>
                                You don't have to spend all your time thinking
                                about what you're doing, you just let it happen.
                            </li>
                        </ul>
                    </div>
                </div> */}
                        </>
                    )}
                </div>
                <div className="section_2 box">
                    <div className="heading marginB20 borderRadius6">
                        <Row>
                            <Col span={6}>
                                Primary {capitalizeFirstLetter(type)}
                            </Col>
                            <Col
                                span={4}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                Occurrence
                            </Col>
                            <Col
                                span={4}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                {meetingType === MeetingTypeConst.chat
                                    ? "Chats"
                                    : meetingType === MeetingTypeConst.email
                                    ? "Emails"
                                    : "Calls"}
                            </Col>
                            <Col
                                span={4}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                Accounts
                            </Col>
                            <Col
                                span={3}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                Snippets
                            </Col>
                            <Col
                                span={3}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                Action
                            </Col>
                        </Row>
                    </div>
                    {details?.loading ? (
                        <Skeleton
                            active
                            paragraph={{ rows: 8 }}
                            title={false}
                            style={{ marginTop: "10px" }}
                        />
                    ) : (
                        <div>
                            {!!details?.data?.length ? (
                                details?.data?.map((e, idx) => {
                                    return (
                                        <Card
                                            key={idx}
                                            {...e}
                                            handleSnippetClick={
                                                handleSnippetClick
                                            }
                                            total={details.analyzed_calls}
                                            total_acc={details.total_accounts}
                                        />
                                    );
                                })
                            ) : (
                                <div className="marginT60">
                                    <EmptyDataState />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <div className="section_3 box">
                    {insightStats?.loading ? (
                        <Skeleton
                            active
                            paragraph={{ rows: 8 }}
                            title={false}
                            style={{ marginTop: "10px" }}
                        />
                    ) : (
                        <>
                            <div>
                                <span className="reason_title font18 bold600 marginR8">
                                    {insightStats?.data?.name}
                                </span>
                                {/* <InfoCircleSvg /> */}
                            </div>
                            <div
                                className="section_title"
                                style={{ marginTop: "10px" }}
                            >
                                Insights from{" "}
                                <strong>
                                    {insightStats?.data?.account_data?.total ||
                                        0}
                                </strong>{" "}
                                Accounts
                            </div>

                            {/* <InsightSummaryCard
                                title="Deals Summary"
                                total={insightStats?.data?.account_data?.total}
                                handleSnippetClick={handleSnippetClick}
                                pie_data={
                                    insightStats?.data?.account_data?.total
                                        ? [
                                              {
                                                  id: 'Deals Lost',
                                                  label: 'Deals Lost',
                                                  count: insightStats?.data
                                                      ?.account_data?.loss,
                                                  value: formatFloat(
                                                      (insightStats?.data
                                                          ?.account_data?.loss /
                                                          insightStats?.data
                                                              ?.account_data
                                                              ?.total) *
                                                          100,
                                                      1
                                                  ),
                                                  color: `#481111`,
                                              },
                                              {
                                                  id: 'Deals Won',
                                                  label: 'Deals Won',

                                                  count: insightStats?.data
                                                      ?.account_data?.won,
                                                  value: formatFloat(
                                                      (insightStats?.data
                                                          ?.account_data?.won /
                                                          insightStats?.data
                                                              ?.account_data
                                                              ?.total) *
                                                          100,
                                                      1
                                                  ),
                                                  color: '#1BA9D6',
                                              },
                                          ]
                                        : []
                                }
                            /> */}

                            <CustomInsightSummaryCard
                                total={insightStats?.data?.account_data?.total}
                                data={insightStats?.data?.account_data?.data}
                                handleSnippetClick={handleSnippetClick}
                            />
                            <div className="section_title">
                                Insights from{" "}
                                <strong>
                                    {insightStats?.data?.call_score?.total || 0}
                                </strong>{" "}
                                {meetingType === MeetingTypeConst.chat
                                    ? "Chats"
                                    : meetingType === MeetingTypeConst.email
                                    ? "Emails"
                                    : "Calls"}
                            </div>

                            <InsightSummaryCard
                                title="AI Score"
                                total={
                                    insightStats?.data?.call_score?.total || 0
                                }
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
                                    insightStats?.data?.call_score?.total
                                        ? [
                                              {
                                                  id: "Good",
                                                  label: "Good",
                                                  count: insightStats?.data
                                                      ?.call_score?.good,
                                                  value: formatFloat(
                                                      (insightStats?.data
                                                          ?.call_score?.good /
                                                          insightStats?.data
                                                              ?.call_score
                                                              ?.total) *
                                                          100,
                                                      1
                                                  ),
                                                  color: `#52C41A`,
                                              },
                                              {
                                                  id: "Average",
                                                  label: "Average",

                                                  count: insightStats?.data
                                                      ?.call_score?.average,
                                                  value: formatFloat(
                                                      (insightStats?.data
                                                          ?.call_score
                                                          ?.average /
                                                          insightStats?.data
                                                              ?.call_score
                                                              ?.total) *
                                                          100,
                                                      1
                                                  ),
                                                  color: "#ECA51D",
                                              },
                                              {
                                                  id: "Bad",
                                                  label: "Bad",
                                                  count: insightStats?.data
                                                      ?.call_score?.bad,
                                                  value: formatFloat(
                                                      (insightStats?.data
                                                          ?.call_score?.bad /
                                                          insightStats?.data
                                                              ?.call_score
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
                            {type !== "sentiment" ? (
                                <InsightSummaryCard
                                    title="Sentiment"
                                    total={
                                        insightStats?.data?.sentiment?.total ||
                                        0
                                    }
                                    handleSnippetClick={handleSnippetClick}
                                    pie_data={
                                        insightStats?.data?.sentiment?.total
                                            ? [
                                                  {
                                                      id: "Positive",
                                                      label: "Positive",
                                                      count: insightStats?.data
                                                          ?.sentiment?.positive,
                                                      value: formatFloat(
                                                          (insightStats?.data
                                                              ?.sentiment
                                                              ?.positive /
                                                              insightStats?.data
                                                                  ?.sentiment
                                                                  ?.total) *
                                                              100,
                                                          1
                                                      ),
                                                      color: `#38AA00`,
                                                  },
                                                  {
                                                      id: "Neutral",
                                                      label: "Neutral",

                                                      count: insightStats?.data
                                                          ?.sentiment?.neutral,
                                                      value: formatFloat(
                                                          (insightStats?.data
                                                              ?.sentiment
                                                              ?.neutral /
                                                              insightStats?.data
                                                                  ?.sentiment
                                                                  ?.total) *
                                                              100,
                                                          1
                                                      ),
                                                      color: "#CECECE",
                                                  },
                                                  {
                                                      id: "Negative",
                                                      label: "Negative",
                                                      count: insightStats?.data
                                                          ?.sentiment?.negative,
                                                      value: formatFloat(
                                                          (insightStats?.data
                                                              ?.sentiment
                                                              ?.negative /
                                                              insightStats?.data
                                                                  ?.sentiment
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
                            ) : (
                                <></>
                            )}

                            <div className="section_title">
                                Insights from{" "}
                                <strong>
                                    {insightStats?.data?.agent?.total}
                                </strong>{" "}
                                Agents
                            </div>

                            <InsightSummaryCard
                                title="Agent Performance"
                                total={insightStats?.data?.agent?.total || 0}
                                handleSnippetClick={handleSnippetClick}
                                pie_data={
                                    insightStats?.data?.sentiment?.total
                                        ? [
                                              {
                                                  id: "Good Performers",
                                                  label: "Good Performers",
                                                  count: insightStats?.data
                                                      ?.agent?.good,
                                                  value: formatFloat(
                                                      (insightStats?.data?.agent
                                                          ?.good /
                                                          insightStats?.data
                                                              ?.agent?.total) *
                                                          100,
                                                      1
                                                  ),
                                                  color: `#52C41A`,
                                              },
                                              {
                                                  id: "Average Performers",
                                                  label: "Average Performers",

                                                  count: insightStats?.data
                                                      ?.agent?.avg,
                                                  value: formatFloat(
                                                      (insightStats?.data?.agent
                                                          ?.avg /
                                                          insightStats?.data
                                                              ?.agent?.total) *
                                                          100,
                                                      1
                                                  ),
                                                  color: "#ECA51D",
                                              },
                                              {
                                                  id: "Bad Performers",
                                                  label: "Bad Performers",
                                                  count: insightStats?.data
                                                      ?.agent?.bad,
                                                  value: formatFloat(
                                                      (insightStats?.data?.agent
                                                          ?.bad /
                                                          insightStats?.data
                                                              ?.agent?.total) *
                                                          100,
                                                      1
                                                  ),
                                                  color: "#FF3635",
                                              },
                                          ]
                                        : []
                                }
                            />
                            {insightTopics?.loading ? (
                                <Skeleton
                                    active
                                    paragraph={{ rows: 8 }}
                                    title={false}
                                    style={{ marginTop: "10px" }}
                                />
                            ) : (
                                <>
                                    <div className="section_title">
                                        Insights from{" "}
                                        <strong>
                                            {insightTopics?.data?.total_call ||
                                                0}
                                        </strong>{" "}
                                        {meetingType === MeetingTypeConst.chat
                                            ? "Chats"
                                            : meetingType ===
                                              MeetingTypeConst.email
                                            ? "Emails"
                                            : "Calls"}
                                    </div>
                                    <div
                                        className="marginT24 padding17"
                                        style={{
                                            boxShadow:
                                                "0px 4px 20px rgba(21, 21, 21, 0.10)",
                                            background: "#ffffff",
                                            borderRadius: "6px",
                                        }}
                                    >
                                        <div className="bold600 marginB12 dove_gray_cl">
                                            Other {capitalizeFirstLetter(type)}s
                                        </div>
                                        {insightTopics?.data?.total_call ? (
                                            <div className="list_item_container">
                                                {insightTopics?.data?.data?.map(
                                                    (e) => {
                                                        return (
                                                            <div
                                                                key={e.id}
                                                                className="list_item paddingLR18 paddingTB8"
                                                            >
                                                                <div className="flex alignCenter min_width_0_flex_child">
                                                                    <div className="dot"></div>{" "}
                                                                    <div className="dusty_gray_cl flex1 elipse_text">
                                                                        {
                                                                            e.insight_name
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="flex alignCenter min_width_0_flex_child justifySpaceBetween paddingL10">
                                                                    <span className="bold600 dove_gray_cl elipse_text">{`${
                                                                        e.calls
                                                                    } ${
                                                                        meetingType ===
                                                                        MeetingTypeConst.chat
                                                                            ? "Chats"
                                                                            : meetingType ===
                                                                              MeetingTypeConst.email
                                                                            ? "Emails"
                                                                            : "Calls"
                                                                    }`}</span>
                                                                    <span
                                                                        onClick={() =>
                                                                            handleSnippetClick(
                                                                                {
                                                                                    is_topic: true,
                                                                                    id,
                                                                                    topic_id:
                                                                                        e.id,
                                                                                }
                                                                            )
                                                                        }
                                                                        className="curPoint"
                                                                    >
                                                                        <PlaySvgA />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        ) : (
                                            <div className="paddingTB20">
                                                <EmptyDataState />
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
                <MonologueDrawer
                    isVisible={showDrawer}
                    handleClose={handleClose}
                    snippets={snippets}
                    getNext={getNext}
                    snippetLoading={snippetsInitialLoad}
                    nextSnippetsUrl={nextSnippetsUrl}
                />
            </div>
        </>
    );
}

const { Panel } = Collapse;

const Card = ({
    id,
    insight_name,
    occurrence,
    calls,
    account,
    sub_insights,
    handleSnippetClick,
    total,
    total_acc,
}) => {
    const { type, id: linkId } = useParams();

    return (
        <div
            className="insight--detail--card"
            style={{
                ...(id === +linkId && {
                    border: "1px solid #1a62f2",
                }),
            }}
        >
            <Collapse
                expandIconPosition={"right"}
                bordered={false}
                expandIcon={({ isActive }) =>
                    isActive ? <ChevronUpSvg /> : <ChevronDownSvg />
                }
            >
                <Panel
                    showArrow={!!sub_insights?.length}
                    header={
                        <div className="content panel width100p">
                            <Row>
                                <Col
                                    span={6}
                                    className="legend_container bold600"
                                >
                                    <Tooltip
                                        title={insight_name}
                                        // placement="left"
                                    >
                                        <span> {insight_name}</span>
                                    </Tooltip>
                                </Col>
                                <Col
                                    span={4}
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    {numFormatter(+occurrence)}
                                </Col>
                                <Col
                                    span={4}
                                    className="percentage_container"
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <span
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {numFormatter(calls)}
                                    </span>
                                    <div
                                        className="percentage"
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {formatFloat((calls / total) * 100, 1)}%
                                    </div>
                                </Col>
                                <Col
                                    span={4}
                                    className="percentage_container"
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <span>{numFormatter(account)}</span>
                                    <div
                                        className="percentage"
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {formatFloat(
                                            (account / total_acc) * 100,
                                            1
                                        )}
                                        %
                                    </div>
                                </Col>
                                <Col
                                    span={3}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSnippetClick({ id });
                                    }}
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                    className="curPoint primary_cl"
                                >
                                    <SnippetPlaySvg />
                                </Col>
                                <Col
                                    span={3}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Link
                                        to={`${routes.CI_DASHBOARD}/insights/${type}/${id}`}
                                    >
                                        View
                                    </Link>
                                </Col>
                            </Row>
                        </div>
                    }
                    key={id}
                >
                    {sub_insights?.length ? (
                        <>
                            <div className="subheading">
                                <Row>
                                    <Col span={6}>{type}</Col>
                                    <Col
                                        span={4}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        Occurrence
                                    </Col>
                                    <Col
                                        span={4}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        Calls
                                    </Col>
                                    <Col
                                        span={4}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        Accounts
                                    </Col>
                                    <Col
                                        span={3}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        Snippets
                                    </Col>
                                    <Col
                                        span={3}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        Action
                                    </Col>
                                </Row>
                            </div>

                            {sub_insights.map(
                                ({
                                    insight_name,
                                    occurrence,
                                    calls,
                                    account,
                                    id,
                                }) => (
                                    <div
                                        className="content subcontent"
                                        style={{
                                            ...(id === +linkId && {
                                                border: "1px solid #1a62f2",
                                                borderRadius: "8px",
                                            }),
                                        }}
                                    >
                                        <Row>
                                            <Col
                                                span={6}
                                                className="legend_container bold600"
                                            >
                                                <Tooltip
                                                    title={insight_name}
                                                    // placement="left"
                                                >
                                                    <span> {insight_name}</span>
                                                </Tooltip>
                                            </Col>
                                            <Col
                                                span={4}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                {numFormatter(occurrence)}
                                            </Col>
                                            <Col
                                                span={4}
                                                className="percentage_container"
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                >
                                                    {numFormatter(calls)}
                                                </span>
                                                <div
                                                    className="percentage"
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                >
                                                    {formatFloat(
                                                        (calls / total) * 100,
                                                        2
                                                    )}
                                                    %
                                                </div>
                                            </Col>
                                            <Col
                                                span={4}
                                                className="percentage_container"
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <span>
                                                    {numFormatter(account)}
                                                </span>
                                                <div
                                                    className="percentage"
                                                    style={{
                                                        display: "flex",
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                >
                                                    {formatFloat(
                                                        (account / total_acc) *
                                                            100,
                                                        2
                                                    )}
                                                    %
                                                </div>
                                            </Col>
                                            <Col
                                                onClick={() => {
                                                    handleSnippetClick({ id });
                                                }}
                                                span={3}
                                                className="curPoint primary_cl"
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <SnippetPlaySvg />
                                            </Col>
                                            <Col
                                                span={3}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Link
                                                    to={`${routes.CI_DASHBOARD}/insights/${type}/${id}`}
                                                >
                                                    View
                                                </Link>
                                            </Col>
                                        </Row>
                                    </div>
                                )
                            )}
                        </>
                    ) : null}
                </Panel>
            </Collapse>
        </div>
    );
};

// Stats is HOC to make indivisual stats
const Stat = ({
    name,
    handleSnippetClick,
    num,
    per,
    color,
    snippet_type,
    type,
}) => {
    const { id } = useParams();
    return (
        <div>
            <h4 className="dove_gray_cl">{name}</h4>
            <div className="marginB17 flex alignCenter justifySpaceBetween">
                <div className="flex alignCenter ">
                    <span className="font18 bold600 marginR4" style={{ color }}>
                        {num}
                    </span>
                    <span
                        className="font12 bold600 paddingLR2 paddingTB7 dusty_gray_1a_bg dove_gray_cl"
                        style={{ borderRadius: "4px" }}
                    >{`${per}%`}</span>
                </div>

                <span
                    className="primary_cl curPoint"
                    onClick={() =>
                        handleSnippetClick({
                            is_type: true,
                            snippet_type,
                            type,
                            id,
                        })
                    }
                >
                    <SnippetPlaySvg />
                </span>
            </div>
        </div>
    );
};

const AIScore = ({ data, handleSnippetClick }) => {
    return (
        <>
            <Stat
                name="Good"
                color={data?.[0].color}
                num={data?.[0].count}
                per={data?.[0].value}
                {...{ handleSnippetClick }}
                snippet_type="ai_call_score"
                type="good"
            />
            <Stat
                name="Average"
                color={data?.[1].color}
                num={data?.[1].count}
                per={data?.[1].value}
                {...{ handleSnippetClick }}
                snippet_type="ai_call_score"
                type="avg"
            />
            <Stat
                name="Bad"
                color={data?.[2].color}
                num={data?.[2].count}
                per={data?.[2].value}
                {...{ handleSnippetClick }}
                snippet_type="ai_call_score"
                type="bad"
            />
        </>
    );
};
const AgetPerformance = ({ data, handleSnippetClick }) => {
    return (
        <>
            <Stat
                color={data?.[0].color}
                num={data?.[0].count}
                per={data?.[0].value}
                name="Good Performers"
                {...{ handleSnippetClick }}
                snippet_type="agent"
                type="good"
            />
            <Stat
                name="Average Performers"
                color={data?.[1].color}
                num={data?.[1].count}
                per={data?.[1].value}
                {...{ handleSnippetClick }}
                snippet_type="agent"
                type="avg"
            />
            <Stat
                name="Need Attention"
                color={data?.[2].color}
                num={data?.[2].count}
                per={data?.[2].value}
                {...{ handleSnippetClick }}
                snippet_type="agent"
                type="bad"
            />
        </>
    );
};

const Sentiment = ({ data, handleSnippetClick }) => {
    return (
        <>
            <Stat
                name="Positive"
                color={data?.[0].color}
                num={data?.[0].count}
                per={data?.[0].value}
                {...{ handleSnippetClick }}
                snippet_type="sentiment"
                type="positive"
            />
            <Stat
                name="Neutral"
                color={data?.[1].color}
                num={data?.[1].count}
                per={data?.[1].value}
                {...{ handleSnippetClick }}
                snippet_type="sentiment"
                type="neutral"
            />
            <Stat
                name="Negative"
                color={data?.[2].color}
                num={data?.[2].count}
                per={data?.[2].value}
                {...{ handleSnippetClick }}
                snippet_type="sentiment"
                type="negative"
            />
        </>
    );
};

const DealsSummary = ({ data, handleSnippetClick }) => {
    return (
        <>
            <Stat
                name="Deals Lost"
                color={data?.[0].color}
                num={data?.[0].count}
                per={data?.[0].value}
                {...{ handleSnippetClick }}
                snippet_type="account"
                type="loss"
            />
            <Stat
                name="Deals Won"
                color={data?.[1].color}
                num={data?.[1].count}
                per={data?.[1].value}
                {...{ handleSnippetClick }}
                snippet_type="account"
                type="won"
            />
        </>
    );
};

const RenderStat = (title, pie_data, handleSnippetClick) => {
    switch (title) {
        case "Deals Summary":
            return <DealsSummary data={pie_data} {...{ handleSnippetClick }} />;
        case "AI Score":
            return <AIScore data={pie_data} {...{ handleSnippetClick }} />;
        case "Sentiment":
            return <Sentiment data={pie_data} {...{ handleSnippetClick }} />;
        case "Agent Performance":
            return (
                <AgetPerformance data={pie_data} {...{ handleSnippetClick }} />
            );
        default:
            return <></>;
    }
};

//InsightSummaryCard is Layout HOC to make each insight Cards
export const InsightSummaryCard = ({
    title = "Deals Summary",
    total,
    pie_data = [],
    handleSnippetClick,
    avgAiScore,
}) => {
    return (
        <div
            className="padding16 marginB20 marginT16 borderRadius8"
            style={{
                boxShadow: "0px 4px 20px rgba(21, 21, 21, 0.10)",
                background: "#ffffff",
            }}
        >
            <div className="dove_gray_cl bold600 font14 flex justifySpaceBetween">
                <span>{title}</span>
                {title === "AI Score" && (
                    <div>
                        <span>Avg. AI Score: </span>
                        <span
                            style={{
                                color: `${avgAiScore?.color}`,
                            }}
                        >
                            {avgAiScore?.value} %
                        </span>
                    </div>
                )}
            </div>
            {total ? (
                <>
                    <div className="flex alignCenter">
                        <div
                            className="flex1 flex alignCenter justifyCenter"
                            style={{ height: "11.25rem" }}
                        >
                            <CIDonutChartV2 data={pie_data} />
                        </div>
                        <div
                            className="flex1 paddingLR17 paddingT8"
                            style={{
                                background: "#F9F9F9",
                                borderRadius: "6px",
                            }}
                        >
                            {RenderStat(title, pie_data, handleSnippetClick)}
                        </div>
                    </div>
                </>
            ) : (
                <div className="paddingTB20">
                    <EmptyDataState />
                </div>
            )}
        </div>
    );
};
