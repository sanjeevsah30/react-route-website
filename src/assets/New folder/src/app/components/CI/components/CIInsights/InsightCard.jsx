import routes from "@constants/Routes/index";
import Dot from "@presentational/reusables/Dot";
import { formatFloat } from "@tools/helpers";
import { Col, Row, Skeleton, Tooltip } from "antd";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import LoadingCards from "app/components/Audit Report/LoadingCards";
import NoDataSvg from "app/static/svg/NoDataSvg";
import SnippetPlaySvg from "app/static/svg/SnippetPlaySvg";
import CIDonutChart from "./CIDonutChart";
import EmptyDataState from "app/components/AnalyticsDashboard/Components/EmptyDataState";
import { HomeContext, MeetingTypeConst } from "@container/Home/Home";

const alpha = [
    "",
    "dd",
    "cc",
    "bb",
    "aa",
    "99",
    "88",
    "77",
    "66",
    "55",
    "44",
    "33",
    "22",
    "11",
];

export default function InsightCard({
    change,
    title,
    data = [],
    total = 0,
    color = "#1a62f2",
    type = "reason",
    loading,
    onSnippetClick,
    total_acc,
    ...rest
}) {
    const { meetingType } = useContext(HomeContext);
    return (
        <div
            className="flex column marginB24"
            style={{
                height: "430px",
                maxHeight: "430px",
                minHeight: "384px",
            }}
        >
            <div className="flex flexShrink alignCenter marginB16">
                <div className="flex1 flex alignCenter">
                    <Dot
                        width="12px"
                        height="12px"
                        className="primary_bg pointer_dot marginR10"
                        style={{
                            position: "relative",
                            zIndex: 10,
                        }}
                    />
                    <span className="bold600 marginR5 font16">{title}</span>
                    <span className="dove_gray_cl marginLR10 font18">|</span>
                    <span className="dove_gray_cl">
                        Identified in{" "}
                        <span className="bold600 mine_shaft_cl">
                            {formatFloat(change * 100, 1)}%
                        </span>{" "}
                        <span>
                            of all conversations{" "}
                            {`(${total} ${
                                meetingType === MeetingTypeConst.chat
                                    ? "Chats"
                                    : meetingType === MeetingTypeConst.email
                                    ? "Emails"
                                    : "Calls"
                            })`}
                        </span>
                    </span>
                </div>
                {data?.length ? (
                    <Link
                        to={`${routes.CI_DASHBOARD}/insights/${type}/${data?.[0]?.id}`}
                    >
                        <button className="details__btn paddingLR16">
                            See Details
                        </button>
                    </Link>
                ) : null}
            </div>
            <div className="box flex alignCenter flex1 marginL18 paddingR16">
                {loading ? (
                    <Skeleton
                        active
                        paragraph={{ rows: 8 }}
                        title={false}
                        style={{ marginTop: "10px", padding: "20px" }}
                    />
                ) : data.length ? (
                    <>
                        <div
                            style={{
                                width: "400px",
                                height: "250px",
                            }}
                        >
                            <CIDonutChart
                                {...rest}
                                data={data?.map(
                                    (
                                        {
                                            insight_name,
                                            occurance,
                                            calls,
                                            analyzed_calls,
                                            sentiment,
                                            sub_insights = [],
                                        },
                                        i
                                    ) => ({
                                        id: insight_name,
                                        label: insight_name,
                                        value: (calls / total) * 100,
                                        sentiment,
                                        sub_insights,
                                        color:
                                            title === "Sentiment"
                                                ? insight_name
                                                      ?.toLowerCase()
                                                      ?.includes("positive")
                                                    ? "#38AA00"
                                                    : insight_name
                                                          ?.toLowerCase()
                                                          ?.includes("negative")
                                                    ? "#FF3639"
                                                    : "#CECECE"
                                                : `${color}${alpha[i]}`,
                                    })
                                )}
                                title={title}
                                total_occ={total}
                            />
                        </div>

                        <div className=" flex1 height100p flex column">
                            <Table
                                {...{
                                    data,
                                    total,
                                    color,
                                    title,
                                    type,
                                    onSnippetClick,
                                    total_acc,
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex column alignCenter justifyCenter height100p width100p">
                        <EmptyDataState />
                    </div>
                )}
            </div>
        </div>
    );
}

const Table = ({
    data,
    total,
    color,
    title,
    type,
    onSnippetClick,
    total_acc,
}) => {
    const { meetingType } = useContext(HomeContext);
    return (
        <div className="table__container flex1 flex column">
            <div className="heading marginT24 borderRadius6">
                <Row>
                    <Col
                        span={6}
                        style={{
                            textAlign: "left",
                        }}
                        className="paddingL20"
                    >
                        Top {title?.split(" ")?.[1] || title?.split(" ")?.[0]}
                    </Col>
                    <Col span={4}>Occurrence</Col>
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
                    <Col span={4}>Accounts</Col>
                    <Col span={3}>Snippets</Col>
                    <Col span={3}>Action</Col>
                </Row>
            </div>
            <div className="content  paddingTB24 marginTB16 borderRadius6 flex1">
                {data.map(
                    ({ insight_name, occurrence, calls, account, id }, i) => (
                        <Row>
                            <Col
                                span={6}
                                className="legend_container paddingL20 flex alignCenter justifyCenter"
                            >
                                <div
                                    className="legend bold600"
                                    style={{
                                        background:
                                            title === "Sentiment"
                                                ? insight_name
                                                      ?.toLowerCase()
                                                      ?.includes("positive")
                                                    ? "#38AA00"
                                                    : insight_name
                                                          ?.toLowerCase()
                                                          ?.includes("negative")
                                                    ? "#FF3639"
                                                    : "#CECECE"
                                                : `${color}${alpha[i]}`,
                                    }}
                                />
                                <Tooltip
                                    title={insight_name}
                                    // placement="left"
                                >
                                    <span
                                        style={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {" "}
                                        {insight_name}
                                    </span>
                                </Tooltip>
                            </Col>
                            <Col span={4}>{occurrence}</Col>
                            <Col span={4} className="percentage_container">
                                <span>{calls}</span>
                                <div
                                    className="percentage"
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
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
                                <span>{account}</span>
                                <div
                                    className="percentage"
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
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
                                onClick={() => {
                                    +id && onSnippetClick(id);
                                }}
                                style={{
                                    cursor: +id ? "pointer" : "not-allowed",
                                }}
                            >
                                <span className="primary_cl">
                                    <SnippetPlaySvg />
                                </span>
                            </Col>
                            <Col span={3}>
                                <Link
                                    to={`${routes.CI_DASHBOARD}/insights/${type}/${id}`}
                                >
                                    View
                                </Link>
                            </Col>
                        </Row>
                    )
                )}
            </div>
        </div>
    );
};
