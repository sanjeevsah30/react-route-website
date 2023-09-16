import React, { useContext, useEffect, useState } from "react";
import reportConfig from "@constants/Report";

import { ReportContext } from "./AuditReport";
import ReportHeader from "./ReportHeader.js";
import OverallPerformance from "./OverallPerformance.js";
import TableActions from "./TableActions";

import { useDispatch, useSelector } from "react-redux";
import { getAuditorListRequest } from "@store/audit_report/actions";

import ReportTable from "./ReportTable";
import Spinner from "@presentational/reusables/Spinner";
import { Button, Checkbox, Collapse, Drawer } from "antd";
import CloseSvg from "app/static/svg/CloseSvg";
import MinusSvg from "app/static/svg/MinusSvg";
import PlusSvg from "app/static/svg/PlusSvg";
import { HomeContext } from "@container/Home/Home";
import { getName } from "@tools/helpers";
import { getAuditors } from "@store/userManagerSlice/userManagerSlice";
import InfoCircleSvg from "../../static/svg/InfoCircleSvg";

const { Panel } = Collapse;

function AuditorTab({ downloading }) {
    const {
        auditorColums,
        auditorList,
        auditPerformanceDetails,
        showLoader,
        filterDates,
        getPayload,
        setPerformanceReportVisible,
        setAuditorData,
        tableLoading,
        auditorCallWiseData,
        versionData,
        visible,
        setVisible,
        filters,
        setFilters,
    } = useContext(ReportContext);
    const {
        AUDIT_REPORT_TITLE,
        AUDITOR_REPORT_HEADLINE,
        AUDITOR_LIST_TITLE,
        AGENTS_COLUMN,
        AGENTS_COLUMN_NO_AIAUDIT,
        COACHING_REPORT_TITLE,
        COACHING_LIST_TITLE,
        COACH_REPORT_HEADLINE,
    } = reportConfig;

    const dispatch = useDispatch();

    const handleTableChange = (pagination, filters, sorter, extra) => {
        let params = { page: pagination.current };
        if (sorter.order) {
            params = {
                order_by: sorter.field,
                order: sorter.order === "ascend" ? "in" : "de",
                ...params,
            };
        }
        dispatch(getAuditorListRequest(getPayload(), params));
    };

    const [column_list, setColumn_list] = useState(
        versionData?.domain_type !== "b2c"
            ? AGENTS_COLUMN_NO_AIAUDIT
            : AGENTS_COLUMN
    );

    const [columns, setColumns] = useState([...column_list]);
    const [tableData, setTableData] = useState(auditorList?.results || []);

    useEffect(() => {
        if (auditorCallWiseData?.data?.results?.[0]) {
            let { question_score = [] } =
                auditorCallWiseData?.data?.results?.[0];
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
    }, [auditorCallWiseData?.data]);

    return (
        <div className="audit_report" data-testid="component-auditor-report">
            <span
                className={`mine_shaft_cl flex alignCenter ${
                    versionData?.domain_type === "b2c" ? "" : "marginT21"
                }`}
            >
                <InfoCircleSvg className="marginR4" />
                The stats shown are based on Audits done in the selected time
                period filter
            </span>
            <OverallPerformance
                overallPerformanceDetails={auditPerformanceDetails}
                loading={showLoader}
                filterDates={filterDates}
                showFilters={versionData?.domain_type !== "b2c"}
            />

            <TableActions
                title={AUDITOR_LIST_TITLE}
                filterDates={filterDates}
                showActions={!!auditorList?.results?.length}
                downloading={downloading}
            />
            <Spinner loading={tableLoading}>
                <ReportTable
                    columns={auditorColums}
                    rowKey="id"
                    dataSource={auditorList?.results}
                    scroll={{ x: "max-content" }}
                    onChange={handleTableChange}
                    total={auditorList?.count}
                    filterDates={filterDates}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                setAuditorData(record);
                                setPerformanceReportVisible(true);
                            },
                        };
                    }}
                />
                <FiltersDrawer visible={visible} setVisible={setVisible} />
            </Spinner>
        </div>
    );
}

export const FiltersDrawer = React.memo(
    ({ visible, setVisible }) => {
        const dispatch = useDispatch();

        const { dashboard_filters } = useSelector((state) => state.dashboard);
        const { users } = useSelector((state) => state.common);
        const { filters, setFilters } = useContext(ReportContext);

        const { is_Auditor } = useContext(HomeContext);

        const [auditors, setAuditors] = useState([]);

        const CallFilterFooter = () => (
            <div className="filter_footer">
                <Button
                    type="primary"
                    className="footer_button"
                    onClick={() => {
                        setVisible(false);
                        setFilters({
                            ...filters,
                            auditors,
                        });
                    }}
                >
                    Apply Filter
                </Button>
            </div>
        );

        const { auditors: allAuditors } = useSelector(
            (state) => state.userManagerSlice
        );

        useEffect(() => {
            dispatch(getAuditors());
        }, []);
        return (
            <Drawer
                title={<div className="bold700 font24">Filters</div>}
                placement="right"
                width={480}
                visible={visible}
                onClose={() => {
                    setVisible(false);
                }}
                footer={<CallFilterFooter />}
                closable={false}
                bodyStyle={{ padding: 0 }}
                extra={
                    <>
                        <span
                            className="curPoint"
                            onClick={() => setVisible(false)}
                        >
                            <CloseSvg />
                        </span>
                    </>
                }
                className={
                    "upcomming__calls__drawer drawer__filters search__filter__drawer"
                }
            >
                <Collapse
                    expandIconPosition="right"
                    bordered={false}
                    className="dashboard-drawer"
                    expandIcon={({ isActive }) =>
                        isActive ? (
                            <MinusSvg
                                style={{
                                    color: "#999999",
                                }}
                            />
                        ) : (
                            <PlusSvg
                                style={{
                                    color: "#999999",
                                }}
                            />
                        )
                    }
                >
                    <Panel
                        header="Choose Auditor"
                        key="1"
                        className="callFilter-panel font16"
                    >
                        {
                            <>
                                <Checkbox.Group
                                    className="flex row"
                                    onChange={(values) => {
                                        const index = values.findIndex(
                                            (val) => val === 0
                                        );

                                        const prevIndex = auditors.findIndex(
                                            (val) => val === 0
                                        );

                                        /* If index has 0 and prevIndex has no zero - Select All - Remove others  
                                IF index has no 0 and previndex has zero - Unselect All - Add others
                    */

                                        setAuditors(
                                            values.length === 1
                                                ? values
                                                : index > -1 &&
                                                  prevIndex === -1 &&
                                                  values.length > 1
                                                ? [0]
                                                : values.filter(
                                                      (val) => val !== 0
                                                  )
                                        );
                                        // dispatch(
                                        //     setDashboardFilters({
                                        //         ...dashboard_filters,
                                        //         audit_filter: {
                                        //             ...dashboard_filters.audit_filter,
                                        //             auditors:
                                        //                 values.length === 1
                                        //                     ? values
                                        //                     : index > -1 &&
                                        //                       prevIndex ===
                                        //                           -1 &&
                                        //                       values.length > 1
                                        //                     ? [0]
                                        //                     : values.filter(
                                        //                           (val) =>
                                        //                               val !== 0
                                        //                       ),
                                        //         },
                                        //     })
                                        // );
                                    }}
                                    value={auditors}
                                >
                                    <span className={"marginB20"}>
                                        <Checkbox value={0}>All</Checkbox>
                                    </span>
                                    {allAuditors.map((user) => {
                                        return (
                                            <span
                                                key={user.id}
                                                className={"marginB20"}
                                            >
                                                <Checkbox value={user.id}>
                                                    {getName(user)}
                                                </Checkbox>
                                            </span>
                                        );
                                    })}
                                </Checkbox.Group>
                            </>
                        }
                    </Panel>
                </Collapse>
            </Drawer>
        );
    },
    (prev, next) => prev.visible === next.visible
);

export default AuditorTab;
