import React, { useContext, useEffect, useState } from "react";
import reportConfig from "@constants/Report";
import { Row, Checkbox, Drawer } from "antd";
import { ReportContext } from "./AuditReport";
import ReportHeader from "./ReportHeader.js";
import OverallPerformance from "./OverallPerformance.js";
import TableActions from "./TableActions";
import PerformanceCard from "./PerformanceCard";

import LoadingCards from "./LoadingCards";

import { useDispatch, useSelector } from "react-redux";
import { getCallWiseColumList, getColumnName } from "./helper";
import { getCallWiseListRequest } from "@store/audit_report/actions";
import ReportTable from "./ReportTable";
import InsightsTab from "./InsightsTab";
import { getActiveUrl } from "@apis/common/index";
import Spinner from "@presentational/reusables/Spinner";

function AgentsTab(props) {
    const {
        filterDates,
        showLoader,
        agentPerformanceDetails,
        callWiseData,
        filterAgents,
        setColumListVisible,
        columListVisible,
        handleTabChange,
        getPayload,
        tableLoading,
        versionData,
    } = useContext(ReportContext);

    const {
        AGENT_REPORT_HEADLINE,
        SALES_TEAM_REPORT,
        AGENT_REPORT_TITLE,
        CALL_LIST_TITLE,
        AGENTS_COLUMN,
        AGENTS_COLUMN_NO_AIAUDIT,
    } = reportConfig;

    const dispatch = useDispatch();
    const handleTableChange = (pagination, filters, sorter, extra) => {
        if (extra.action !== "sort") {
            dispatch(
                getCallWiseListRequest(
                    { ...getPayload() },
                    filterAgents.active,
                    pagination.current
                )
            );
        }
    };

    const [column_list, setColumn_list] = useState(
        versionData?.domain_type === "b2c"
            ? AGENTS_COLUMN_NO_AIAUDIT
            : AGENTS_COLUMN
    );

    const [columns, setColumns] = useState([...column_list]);

    const { domain } = useSelector((state) => state.common);

    useEffect(() => {
        if (callWiseData?.results[0]) {
            let { question_score } = callWiseData?.results[0];
            let col = [
                ...(versionData?.domain_type !== "b2c"
                    ? AGENTS_COLUMN_NO_AIAUDIT
                    : AGENTS_COLUMN),
            ];
            if (columns.length !== question_score?.length + 2) {
                col = [
                    ...columns,
                    ...question_score?.map(
                        ({ question_text }) => question_text
                    ),
                ];
                setColumn_list(col);
                setColumns(col);
            }
        }
    }, [callWiseData]);

    return (
        <div className="audit_report" data-testid="component-agent-report">
            <ReportHeader
                title={AGENT_REPORT_TITLE}
                headline={AGENT_REPORT_HEADLINE}
                showBackBtn={true}
                is_agent_header={true}
                goBack={() => handleTabChange(SALES_TEAM_REPORT)}
            />
            <OverallPerformance
                filterDates={filterDates}
                loading={showLoader}
                overallPerformanceDetails={
                    agentPerformanceDetails?.audit_details
                }
                showAiCards={true}
                {...agentPerformanceDetails}
            />
            <div className="marginTB30 ">
                <div className="marginB15 bold">
                    CALL REPORTS{" "}
                    {versionData?.domain_type !== "b2c" ? "" : "(Manual Audit)"}
                </div>
                <Row gutter={[16, 24]}>
                    {showLoader ? (
                        <LoadingCards count={4} />
                    ) : (
                        agentPerformanceDetails?.call_record.map(
                            (audit_cards, index) => (
                                <PerformanceCard
                                    {...audit_cards}
                                    filterDates={filterDates}
                                    key={index}
                                    cardSection="Calls"
                                />
                            )
                        )
                    )}
                </Row>
            </div>
            <div className="marginTB30">
                <div className="marginB15 bold">
                    ACCOUNTS REPORTS{" "}
                    {versionData?.domain_type !== "b2c" ? "" : "(Manual Audit)"}
                </div>
                <Row gutter={[16, 24]}>
                    {showLoader ? (
                        <LoadingCards count={4} />
                    ) : (
                        agentPerformanceDetails?.account_record.map(
                            (audit_cards, index) => (
                                <PerformanceCard
                                    {...audit_cards}
                                    filterDates={filterDates}
                                    key={index}
                                    cardSection="Accounts"
                                />
                            )
                        )
                    )}
                </Row>
            </div>
            <InsightsTab />
            <TableActions
                title={CALL_LIST_TITLE}
                showColumList={true}
                variations_text="Variations compared to last 30 days"
                showActions={!!callWiseData?.results?.length}
            />
            <Spinner loading={tableLoading}>
                <ReportTable
                    columns={getCallWiseColumList(
                        column_list,
                        versionData?.domain_type !== "b2c"
                    )}
                    rowKey="id"
                    dataSource={callWiseData?.results}
                    scroll={{ x: "max-content" }}
                    onChange={handleTableChange}
                    total={callWiseData?.count}
                    filterDates={filterDates}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                const win = window.open(
                                    `${getActiveUrl(domain)}/call/${record.id}`
                                );
                                win.focus();
                            },
                        };
                    }}
                />
            </Spinner>
            <Drawer
                title="COLUMN LIST"
                placement="right"
                closable={true}
                onClose={() => setColumListVisible(false)}
                visible={columListVisible}
                width={512}
                className="report_drawer"
            >
                <div className="greyText marginB20">
                    You can select/deselect columns for the table
                </div>
                <Checkbox.Group
                    className="flex row"
                    onChange={(values) => {
                        setColumn_list([...values]);
                    }}
                    value={column_list}
                >
                    {columns.map((key) => (
                        <div key={key} className={"col-24 paddingB24"}>
                            <Checkbox value={key}>
                                {getColumnName(
                                    key,
                                    versionData?.domain_type !== "b2c"
                                )}
                            </Checkbox>
                        </div>
                    ))}
                </Checkbox.Group>
            </Drawer>
        </div>
    );
}

export default AgentsTab;
