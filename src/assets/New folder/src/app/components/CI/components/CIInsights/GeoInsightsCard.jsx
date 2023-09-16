import routes from "@constants/Routes/index";
import { formatFloat } from "@tools/helpers";
import { Col, Row } from "antd";
import React from "react";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";
import SnippetPlaySvg from "app/static/svg/SnippetPlaySvg";
import { GEO_COLOR_RANGE } from "./helper";
import IndiaChoroPleth from "./IndiaChoroPleth";
import { scaleQuantile } from "d3-scale";

export default function GeoInsightCard({
    change,
    title,
    data = [],
    total = 0,
    color = "#1a62f2",
    ...rest
}) {
    return (
        <div
            className="flex column marginB24"
            style={{
                height: "384px",
            }}
        >
            <div className="flex flexShrink alignCenter marginB16">
                <span className="bold600 marginR5 font16">
                    Conversation Reasons
                </span>
                <span className="dove_gray_cl">
                    Identified in <span className="bold600">36.6%</span> of all
                    conversations
                </span>
            </div>
            <div className="box flex alignCenter flex1">
                <div
                    className="donut_container"
                    style={{
                        width: "400px",
                    }}
                >
                    <IndiaChoroPleth />
                </div>
                <div className=" flex1 height100p">
                    <Table
                        data={data}
                        total={total}
                        color={color}
                        title={title}
                    />
                </div>
            </div>
        </div>
    );
}

const Table = ({ data, total, color, title }) => {
    const colorScale = scaleQuantile()
        .domain(data.map((d) => d.value))
        .range(GEO_COLOR_RANGE);

    return (
        <div className="table__container">
            <div className="heading marginT24">
                <Row>
                    <Col
                        span={6}
                        style={{
                            textAlign: "left",
                        }}
                    >
                        Top {title?.split(" ")?.[1] || title?.split(" ")?.[0]}
                    </Col>
                    <Col span={4}>Occurrence</Col>
                    <Col span={4}>Calls</Col>
                    <Col span={4}>Accounts</Col>
                    <Col span={3}>Snippets</Col>
                    <Col span={3}>Action</Col>
                </Row>
            </div>
            <div className="content  paddingTB24">
                {data.map(({ insight_name, occurance, calls, account }, i) => (
                    <Row>
                        <Col span={4} className="legend_container">
                            <div
                                className="legend bold600"
                                style={{
                                    background: colorScale(occurance),
                                }}
                            />{" "}
                            {insight_name}
                        </Col>
                        <Col span={4}>{occurance}</Col>
                        <Col span={4} className="percentage_container">
                            <span>{calls}</span>
                            <div className="percentage">
                                {formatFloat(calls / total, 2)}%
                            </div>
                        </Col>
                        <Col span={4} className="percentage_container">
                            <span>{account}</span>
                        </Col>

                        <Col span={4}>
                            <SnippetPlaySvg />
                        </Col>
                        <Col span={4}>
                            <Link to={`${routes.CI_DASHBOARD}/insights/1`}>
                                View
                            </Link>
                        </Col>
                    </Row>
                ))}
            </div>
        </div>
    );
};
