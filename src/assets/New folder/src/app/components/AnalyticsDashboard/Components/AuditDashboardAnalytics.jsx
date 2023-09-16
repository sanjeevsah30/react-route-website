import { Col, Row, Tooltip } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import DownFilledSvg from "../../../static/svg/DownFilledSvg";
import InfoCircleSvg from "../../../static/svg/InfoCircleSvg";
import UpFilledSvg from "../../../static/svg/UpFilledSvg";
import {
    auditCardLabels,
    dashboardRoutes,
    report_types,
} from "../Constants/dashboard.constants";
import useGetDashboardPayload from "../Hooks/useGetDashboardPayload";
import LineGraph from "@presentational/Statistics/LineGraph";
import SectionHeader from "./SectionHeader";
import exportAsImage from "utils/exportAsImage";
import { useDispatch, useSelector } from "react-redux";
import { HomeDashboardContext } from "../Context/HomeDashboardContext";
import {
    getAuditGraphDetails,
    getAuditOverallDetails,
} from "@store/dashboard/dashboard";
import { HomeContext } from "@container/Home/Home";
import Spinner from "../../presentational/reusables/Spinner";
import Loader from "../../presentational/reusables/Loader";
import { formatFloat } from "../../../../tools/helpers";
import LeftArrowSvg from "../../../static/svg/LeftArrowSvg";

export default React.memo(
    function AuditDashboardAnalytics({ showSeeDetails = true }) {
        const history = useHistory();
        const dispatch = useDispatch();
        const {
            common: { teams, versionData },
            dashboard: {
                templates_data: { template_active },
                loaders: {
                    audit_details_graph_loading: graphLoading,
                    audit_details_overall_loading: cardsLoading,
                },
                audit_data_graph,
                audit_data_overall,
            },
        } = useSelector((state) => state);

        const { filtersVisible } = useContext(HomeDashboardContext);
        const { meetingType } = useContext(HomeContext);
        const { getDashboardPayload } = useGetDashboardPayload();

        const [auditType, setAuditType] = useState("auditor");
        const [xArr, setXarr] = useState([]);
        const [yArr, setYarr] = useState([]);
        const graph = useRef();

        useEffect(() => {
            let x = [];
            let y = [];
            let data = audit_data_graph[auditType] || [];
            for (let i = 0; i < data.length; i++) {
                x.push(data[i].epoch / 1000);
                y.push(data[i]?.count || 0);
            }
            setXarr([...x]);
            setYarr([...y]);
        }, [auditType, audit_data_graph, audit_data_overall]);

        useEffect(() => {
            if (filtersVisible) return;
            if (
                (!template_active && versionData.domain_type === "b2c") ||
                !teams.length
            )
                return;

            const payload = getDashboardPayload();
            let api1, api2;
            api1 = dispatch(
                getAuditGraphDetails({
                    audit_start_date: payload.start_date,
                    audit_end_date: payload.end_date,
                    is_manual: true,
                    is_call_level: true,
                    is_line_graph: true,
                    meeting_type: meetingType,
                })
            );
            api2 = dispatch(
                getAuditOverallDetails({
                    audit_start_date: payload.start_date,
                    audit_end_date: payload.end_date,
                    is_manual: true,
                    is_call_level: true,
                    is_line_graph: true,
                    meeting_type: meetingType,
                })
            );

            return () => {
                api1?.abort();
                api2?.abort();
            };
        }, [getDashboardPayload, template_active, teams]);

        return (
            <div className="team__level__analytics marginTB16">
                <SectionHeader
                    title="Audit Dashboard"
                    duration="Last 30 days"
                    showSeeDetails={showSeeDetails}
                    seeDetailsClick={() => history.push(dashboardRoutes.audit)}
                    to={dashboardRoutes.audit}
                    downloadGraph={() => {
                        exportAsImage(
                            graph.current,
                            `audit_${auditType}_graph`
                        );
                    }}
                    report_type={report_types.audit}
                />
                <div className="audit_analytics_overall">
                    <div className="auditor_performance">
                        <div className="auditor_performance--header">
                            <span className="bold600">
                                Auditors Performance
                            </span>
                            <span className="auditor_performance--info">
                                <InfoCircleSvg />
                                The stats shown are based on Audits done in the
                                selected time period filter
                            </span>
                        </div>
                        <Row className="auditor_performance--content">
                            <Loader loading={cardsLoading}>
                                {audit_data_overall.map((card) => {
                                    if (
                                        card?.name !== "minutes" &&
                                        !(
                                            meetingType === "chat" &&
                                            card?.name === "call"
                                        ) &&
                                        !(
                                            meetingType === "call" &&
                                            card?.name === "chat"
                                        )
                                    ) {
                                        return (
                                            <AuditCard
                                                count={card?.count}
                                                change={card?.change.toFixed(2)}
                                                title={
                                                    auditCardLabels[card?.name]
                                                        ?.title
                                                }
                                                lg={10}
                                                name={card?.name}
                                                onClick={() =>
                                                    setAuditType(card?.name)
                                                }
                                                active={
                                                    card?.name === auditType
                                                }
                                            />
                                        );
                                    } else {
                                        return null;
                                    }
                                })}
                            </Loader>
                        </Row>
                    </div>
                    <div className="auditor_statistics">
                        <div className="auditor_statistics--header">
                            <span>Statistics</span>
                            <Tooltip
                                placement="top"
                                title={"Audit Report Statistics"}
                            >
                                <InfoCircleSvg
                                    style={{
                                        transform: "scale(0.85)",
                                        marginBottom: "-2px",
                                    }}
                                />
                            </Tooltip>
                        </div>
                        <Spinner loading={graphLoading}>
                            <div
                                className="auditor_statistics--content paddingT20"
                                ref={graph}
                            >
                                <LineGraph
                                    yAxisLabel={
                                        auditCardLabels[auditType]?.title
                                    }
                                    xArr={xArr}
                                    yArr={yArr}
                                />
                            </div>
                        </Spinner>
                    </div>
                </div>
            </div>
        );
    },
    () => true
);

export const AuditCard = ({
    title,
    name,
    count,
    change,
    active = false,
    ...props
}) => {
    return (
        <Col
            className="audit_analytics_card"
            {...props}
            style={{
                border: active
                    ? "0.0625rem solid #1a62f2"
                    : "0px solid transparent",
            }}
        >
            <span className="bold600 font16">{title}</span>
            <div className="audit_analytics_card--data">
                <div
                    className={
                        change * 100 !== 0 &&
                        name !== "auditor" &&
                        "card_translate"
                    }
                >
                    {count}
                </div>
                {change * 100 !== 0 && name !== "auditor" ? (
                    <div
                        style={{
                            background: change > 0 ? "#52C41A33" : "#FF636533",
                            color: change > 0 ? "#52C41A" : "#FF6365",
                        }}
                    >
                        {change > 0 ? <UpFilledSvg /> : <DownFilledSvg />}
                        {formatFloat(change, 2) || 0}%
                    </div>
                ) : null}
            </div>
        </Col>
    );
};
