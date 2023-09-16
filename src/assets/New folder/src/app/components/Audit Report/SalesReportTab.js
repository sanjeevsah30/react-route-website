import React, { useContext, useState } from "react";
import reportConfig from "@constants/Report";
import { Table, Row, Checkbox, Drawer } from "antd";
import { ReportContext } from "./AuditReport";
import ReportHeader from "./ReportHeader.js";
import OverallPerformance from "./OverallPerformance.js";
import TableActions from "./TableActions";
import PerformanceCard from "./PerformanceCard";
import { getColumnName, getSalesTeamColumList } from "./helper";
import LoadingCards from "./LoadingCards";
import {
    getAgentWiseListRequest,
    setReportActiveAgent,
    setReportActiveTeam,
} from "@store/audit_report/actions";
import { useDispatch } from "react-redux";
import ReportTable from "./ReportTable";
import InsightsTab from "./InsightsTab";
import Spinner from "@presentational/reusables/Spinner";

function SalesReportTab(props) {
    const {
        setColumListVisible,
        filterDates,
        teamList,
        teamPerformanceDetails,
        showLoader,
        filterTeams,
        agentList,
        getPayload,
        setTab,
        columListVisible,
        cardsLoading,
        tableLoading,
        versionData,
    } = useContext(ReportContext);

    const {
        SALES_TEAM_REPORT_TITLE,
        SALES_TEAM_REPORT_HEADLINE,
        SALES_TEAM_LIST_TITLE,
        AGENT_LIST_TITLE,
        SALES_TEAMS_COLUMNS,
        SALES_TEAMS_COLUMNS_NO_AIAUDIT,
        AGENT_REPORT,
    } = reportConfig;

    const dispatch = useDispatch();
    const [column_list, setColumn_list] = useState(
        versionData?.domain_type !== "b2c"
            ? SALES_TEAMS_COLUMNS_NO_AIAUDIT
            : SALES_TEAMS_COLUMNS
    );
    const handleTableChange = (pagination) => {
        dispatch(
            getAgentWiseListRequest(
                {
                    ...getPayload(),
                },
                filterTeams.active[0],
                pagination.current
            )
        );
    };

    return (
        <div className="audit_report" data-testid="component-sales-report">
            <ReportHeader
                title={SALES_TEAM_REPORT_TITLE}
                headline={SALES_TEAM_REPORT_HEADLINE}
                is_sales_header={true}
                filterDates={filterDates}
                filterTeams={filterTeams}
                showBackBtn={filterTeams.active.length !== 0}
                goBack={() => dispatch(setReportActiveTeam(0))}
            />
            <OverallPerformance
                filterDates={filterDates}
                loading={showLoader}
                overallPerformanceDetails={
                    teamPerformanceDetails?.audit_details
                }
                showAiCards={filterTeams.active.length !== 0}
                {...teamPerformanceDetails}
            />
            <div className="marginTB30 ">
                <div className="marginB15 bold">
                    CALL REPORTS{" "}
                    {versionData?.domain_type !== "b2c" ? "" : "(Manual Audit)"}
                </div>
                <Row gutter={[16, 24]}>
                    {cardsLoading ? (
                        <LoadingCards count={4} />
                    ) : (
                        teamPerformanceDetails?.call_record.map(
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
            <div className="marginTB30 ">
                <div className="marginB15 bold">
                    ACCOUNTS REPORTS{" "}
                    {versionData?.domain_type !== "b2c" ? "" : "(Manual Audit)"}
                </div>
                <Row gutter={[16, 24]}>
                    {cardsLoading ? (
                        <LoadingCards count={4} />
                    ) : (
                        teamPerformanceDetails?.account_record.map(
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
            {filterTeams.active.length === 0 ? (
                <>
                    <TableActions
                        title={SALES_TEAM_LIST_TITLE}
                        showColumList={true}
                        filterDates={filterDates}
                        showActions={!!teamList?.length}
                    />
                    <Spinner loading={tableLoading}>
                        <Table
                            pagination={false}
                            columns={getSalesTeamColumList(
                                (id) => {
                                    dispatch(setReportActiveTeam(id));
                                },
                                column_list,
                                versionData?.domain_type !== "b2c"
                            )}
                            dataSource={teamList}
                            scroll={{ x: "max-content" }}
                            rowKey={"id"}
                        />
                    </Spinner>
                </>
            ) : (
                <>
                    <InsightsTab />
                    <TableActions
                        title={AGENT_LIST_TITLE}
                        showColumList={true}
                        filterDates={filterDates}
                        showActions={!!agentList?.results?.length}
                    />
                    <Spinner loading={tableLoading}>
                        <ReportTable
                            columns={getSalesTeamColumList(
                                (id) => {
                                    setTab(AGENT_REPORT);
                                    dispatch(setReportActiveAgent(id));
                                },
                                column_list,
                                versionData?.domain_type !== "b2c"
                            )}
                            rowKey="id"
                            dataSource={agentList?.results}
                            scroll={{ x: "max-content" }}
                            onChange={handleTableChange}
                            total={agentList?.count}
                            filterDates={filterDates}
                        />
                    </Spinner>
                </>
            )}
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
                    {(versionData?.domain_type !== "b2c"
                        ? SALES_TEAMS_COLUMNS_NO_AIAUDIT
                        : SALES_TEAMS_COLUMNS
                    ).map((key) => (
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

export default SalesReportTab;
