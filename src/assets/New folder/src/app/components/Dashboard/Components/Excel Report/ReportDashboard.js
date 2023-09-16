import Spinner from "@presentational/reusables/Spinner";
import { Button, Dropdown, Menu, Table, Tooltip } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import NoReportSvg from "app/static/svg/NoReportSvg";
import BarGraph from "../BarGraph";
import { HomeDashboardContext } from "../Dashboard";

import "./style.scss";

import ScheduleSvg from "app/static/svg/ScheduleSvg";
import DownloadSvg from "app/static/svg/DownloadSvg";
import ParameterReport from "./ParameterReport";
import AmCharts from "@container/Home/AmCharts";

import ChartImg from "../svg/chart-growth.png";
import ExcelImg from "../svg/microsoft-excel.png";

import exportAsImage from "utils/exportAsImage";
import Loader from "@presentational/reusables/Loader";
import { clearReports, getReport } from "@store/dashboard/dashboard";
import MatrixSvg from "app/static/svg/MatrixSvg";
import LineGraphSvg from "app/static/svg/LineGraphSvg";

function ReportDashboard(props) {
    let badPerform = {
        type: "wrose",
        heading: "Area of concern",
        perColor: "#FF6365",
        data: [],
    };
    let goodPerform = {
        type: "good",
        heading: "Good performing Parameters",
        perColor: "#52C41A",
        data: [],
        goodCountFlag: 0,
    };
    const rest = {
        show_all: true,
        tooltip_label_key: "",
        color_on_performance: false,
        hideTooltip: true,
    };
    const {
        dashboard: { reports },
        // common: { props.activeReportType },
        scheduled_reports: { default_reports },
    } = useSelector((state) => state);

    // activeTab = true means active Matrix
    const [activeTab, setActiveTab] = useState(true);

    const activeRep = useSelector((state) => state.common.filterReps.active);
    const activeCallDuration = useSelector(
        (state) => state.common.filterCallDuration.active
    );
    const activeDates = useSelector((state) => state.common.filterDates.active);
    const activeTeams = useSelector((state) => state.common.filterTeams.active);
    // const activeTemplate = useSelector(state => state.common.filterAuditTemplates.active)
    const activeTemplate = useSelector(
        (state) => state.dashboard.templates_data.template_active
    );

    const dispatch = useDispatch();

    const getIndex = (columns_to_color, columns) => {
        let index = {};
        for (let i = 0; i < columns?.length; i++) {
            index[columns[i]] = i;
        }
        const color_index = [];
        for (let i = 0; i < columns_to_color?.length; i++) {
            color_index[i] = index[columns_to_color[i]];
        }
        return color_index;
    };
    const {
        common: {
            versionData: { stats_threshold },
        },
    } = useSelector((state) => state);

    const { setShowScheduelModal, handleDownload, getPayload, setReportType } =
        useContext(HomeDashboardContext);

    const [currentPage, setCurrentPage] = useState(1);

    const graphRef = useRef(null);

    const onClick = ({ key }) => {
        if (key === "2") {
            handleDownload();
        } else {
            exportAsImage(graphRef?.current, "Graph");
        }
    };

    // const tempReport = reports?.data?.find(({ report }) => report === props.activeReportType)
    const tempReport = reports?.data[props.activeReportType]?.report_data;
    const loader = reports?.data[props.activeReportType]?.loading;

    useEffect(() => {
        if (props.inView) {
            let payload = getPayload();
            payload.type = props.activeReportType;
            // meeting type is hardcorded beacuse other reports are not avilable for chat for now
            payload.meeting_type = "call";
            // payload.type = props.activeReportType;
            dispatch(getReport({ ...payload }));
        }

        // return () => {
        //     dispatch(clearReports());
        // }
    }, [
        activeRep,
        activeTemplate,
        activeTeams,
        activeDates,
        activeCallDuration,
        props.inView,
    ]);

    const menu = (
        <Menu
            onClick={onClick}
            items={
                props.activeReportType === "parameter_pareto_report" ||
                props.activeReportType === "agent_pareto_report" ||
                tempReport?.graph_data?.length
                    ? [
                          {
                              label: "GRAPH",
                              key: "1",
                              icon: (
                                  <img
                                      style={{ width: 20, height: 20 }}
                                      src={ChartImg}
                                      alt="graph"
                                  />
                              ),
                          },
                          {
                              label: "REPORT",
                              key: "2",
                              icon: (
                                  <img
                                      style={{ width: 20, height: 20 }}
                                      src={ExcelImg}
                                      alt="excel"
                                  />
                              ),
                          },
                      ]
                    : [
                          {
                              label: "REPORT",
                              key: "2",
                              icon: (
                                  <img
                                      style={{ width: 20, height: 20 }}
                                      src={ExcelImg}
                                      alt="excel"
                                  />
                              ),
                          },
                      ]
            }
        />
    );

    // console.log(tempReport?.data, props.activeReportType);

    return (
        // <></>
        <div
            // className="paddingTB30 height100p"
            className="paddingB30 paddingT20 paddingLR10 marginB10"
            style={{
                // minHeight: "420px",
                border: "1px solid rgba(153, 153, 153, 0.2)",
                borderRadius: "10px",
                boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.05)",
            }}
        >
            {!!tempReport && (
                <div
                    className="flex marginB20 alignCenter"
                    style={{
                        justifyContent: "space-between",
                        // marginTop: '-30px',
                    }}
                >
                    <p
                        className="bold600"
                        style={{
                            fontSize: "14px",
                            paddingLeft: "20px",
                            minWidth: "7.8125rem",
                        }}
                    >
                        {
                            default_reports?.data?.find((el) => {
                                return el.type === props.activeReportType;
                            })?.name
                        }
                    </p>
                    {!!tempReport?.graph_data?.length &&
                        !!tempReport?.data?.length && (
                            <div
                                className="flex alignCenter"
                                style={{
                                    border: "1px solid rgba(153, 153, 153, 0.2)",
                                    borderRadius: "10px",
                                }}
                            >
                                <div
                                    className={`padding10 curPoint`}
                                    style={{
                                        backgroundColor: `${
                                            activeTab
                                                ? ""
                                                : "rgba(153, 153, 153, 0.2)"
                                        }`,
                                        borderTopLeftRadius: "10px",
                                        borderBottomLeftRadius: "10px",
                                        color: `${
                                            activeTab ? "#1a62f2" : "#666666"
                                        }`,
                                    }}
                                    onClick={() => setActiveTab(true)}
                                >
                                    <MatrixSvg />
                                    <span className="marginL11">Matrix</span>
                                </div>
                                <div
                                    className={`padding10 curPoint`}
                                    style={{
                                        backgroundColor: `${
                                            !activeTab
                                                ? ""
                                                : "rgba(153, 153, 153, 0.2)"
                                        }`,
                                        borderTopRightRadius: "10px",
                                        borderBottomRightRadius: "10px",
                                        color: `${
                                            !activeTab ? "#1a62f2" : "#666666"
                                        }`,
                                    }}
                                    onClick={() => setActiveTab(false)}
                                >
                                    <LineGraphSvg />
                                    <span className="marginL11">Graph</span>
                                </div>
                            </div>
                        )}
                    <div className="flex alignCenter">
                        <Tooltip title="Schedule Report">
                            <Button
                                type="text"
                                className="borderRadius6"
                                onClick={() => {
                                    props.activeReportType &&
                                        setReportType(props.activeReportType);
                                    setShowScheduelModal(true);
                                }}
                            >
                                <ScheduleSvg />
                            </Button>
                        </Tooltip>

                        <Dropdown overlay={menu}>
                            <Button
                                type="text"
                                className="borderRadius6 paddingT8"
                                // onClick={() => handleDownload()}
                            >
                                <DownloadSvg />
                            </Button>
                        </Dropdown>
                    </div>
                </div>
            )}
            <Loader loading={loader}>
                {
                    <>
                        {activeTab === false && (
                            <div ref={graphRef}>
                                {(props.activeReportType ===
                                    "parameter_pareto_report" ||
                                    props.activeReportType ===
                                        "agent_pareto_report") && (
                                    <AmCharts
                                        data={getReportsJson(
                                            tempReport,
                                            tempReport?.columns
                                        ).map((e) => ({ ...e, divider: 80 }))}
                                        x_label={
                                            props.activeReportType ===
                                            "parameter_pareto_report"
                                                ? "Parameters"
                                                : "Agent Email"
                                        }
                                    />
                                )}

                                {!!tempReport?.graph_data?.length && (
                                    <div
                                        // className={`flex1  flex column ${
                                        //     reports?.data?.graph_data?.length > 5 ? '' : ''
                                        // }`}
                                        style={
                                            tempReport?.graph_data?.length <= 5
                                                ? {
                                                      height: "390px",
                                                  }
                                                : {
                                                      height: "390px",
                                                      overflowY: "scroll",
                                                  }
                                        }
                                        className="report_graph"
                                    >
                                        <div className="bold600 mine_shaft_cl">
                                            Graph
                                        </div>
                                        <div
                                            style={{
                                                height:
                                                    tempReport?.graph_data
                                                        ?.length <= 5
                                                        ? "356px"
                                                        : `${
                                                              (tempReport
                                                                  ?.graph_data
                                                                  ?.length +
                                                                  1) *
                                                              50
                                                          }px`,
                                            }}
                                            className="flex alignCenter"
                                        >
                                            {tempReport?.graph_data?.length ? (
                                                <BarGraph
                                                    data={[
                                                        ...tempReport?.graph_data,
                                                    ]
                                                        .sort(
                                                            (a, b) =>
                                                                b?.average -
                                                                a?.average
                                                        )
                                                        .map((item) => ({
                                                            ...item,
                                                            remmaining:
                                                                100 -
                                                                item.average,
                                                            id:
                                                                item.id +
                                                                " " +
                                                                item.name,
                                                        }))}
                                                    cursor_pointer={false}
                                                    {...rest}
                                                />
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === true && (
                            <>
                                {tempReport?.data?.length ? (
                                    <React.Fragment>
                                        {props.activeReportType ===
                                            "best_worst_parameter_report" &&
                                        !reports.loading ? (
                                            <div className="parameter-report-container padding10">
                                                {tempReport?.data.forEach(
                                                    (dataItem, index) => {
                                                        if (index < 5)
                                                            goodPerform.data.push(
                                                                dataItem
                                                            );
                                                        else if (
                                                            index >
                                                            tempReport?.data
                                                                .length -
                                                                6
                                                        )
                                                            badPerform.data.push(
                                                                dataItem
                                                            );
                                                    }
                                                )}
                                                <ParameterReport
                                                    perData={badPerform}
                                                />
                                                <ParameterReport
                                                    perData={goodPerform}
                                                />
                                            </div>
                                        ) : props.activeReportType ===
                                              "performance_report" &&
                                          !reports.loading ? (
                                            <>
                                                <div className="bold600 font18">
                                                    Best Performing
                                                </div>
                                                <Table
                                                    columns={getColumns(
                                                        tempReport?.columns,
                                                        getIndex(
                                                            tempReport?.color_columns,
                                                            tempReport?.columns
                                                        ),
                                                        stats_threshold
                                                    )}
                                                    dataSource={getReportsJson(
                                                        tempReport?.data,
                                                        tempReport?.columns
                                                    )?.slice(0, 5)}
                                                    scroll={{
                                                        x: "max-content",
                                                    }}
                                                    rowKey={"id"}
                                                    className="report_table"
                                                    pagination={{
                                                        position: [
                                                            "bottomRight",
                                                        ],
                                                    }}
                                                />

                                                <div className="bold600 font18">
                                                    Need Attention
                                                </div>
                                                <Table
                                                    columns={getColumns(
                                                        tempReport?.columns,
                                                        getIndex(
                                                            tempReport?.color_columns,
                                                            tempReport?.columns
                                                        ),
                                                        stats_threshold
                                                    )}
                                                    dataSource={getReportsJson(
                                                        tempReport?.data,
                                                        tempReport?.columns
                                                    )?.slice(
                                                        5,
                                                        getReportsJson(
                                                            tempReport?.data,
                                                            tempReport?.columns
                                                        )?.length
                                                    )}
                                                    scroll={{
                                                        x: "max-content",
                                                    }}
                                                    rowKey={"id"}
                                                    className="report_table"
                                                    pagination={{
                                                        position: [
                                                            "bottomRight",
                                                        ],
                                                    }}
                                                />
                                            </>
                                        ) : (
                                            <Table
                                                columns={getColumns(
                                                    tempReport?.columns,
                                                    getIndex(
                                                        tempReport?.color_columns,
                                                        tempReport?.columns
                                                    ),
                                                    stats_threshold
                                                )}
                                                dataSource={getReportsJson(
                                                    tempReport?.data,
                                                    // reports?.data?.find(({ type }) => type === props.activeReportType)?.columns
                                                    tempReport?.columns
                                                )}
                                                scroll={{ x: "max-content" }}
                                                rowKey={"id"}
                                                className="report_table"
                                                pagination={{
                                                    position: ["bottomRight"],
                                                }}
                                            />
                                        )}
                                    </React.Fragment>
                                ) : (
                                    <div className="flex alignCenter justifyCenter height100p">
                                        <div className="flex column alignCenter">
                                            <NoReportSvg />
                                            <div className="bold700 mine_shaft_cl font18">
                                                No Data!
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                }
            </Loader>
        </div>
    );
}

export default React.memo(ReportDashboard);
const getColumns = (columns = [], color_index = [], stats_threshold) => {
    return [
        ...columns.map((key, index) => {
            const give_color = color_index.includes(index);

            const column = {
                title: (
                    <Tooltip destroyTooltipOnHide title={key}>
                        <div
                            style={
                                key.length > 30
                                    ? {
                                          width: "200px",
                                          textOverflow: "ellipsis",
                                          overflow: "hidden",
                                          whiteSpace: "nowrap",
                                      }
                                    : {
                                          display: "flex",
                                          justifyContent: `${
                                              index === 0 ? "" : "center"
                                          }`,
                                      }
                            }
                        >
                            {key}
                        </div>
                    </Tooltip>
                ),
                dataIndex: key,
                key,
                render: (text) => {
                    const color = give_color
                        ? text < 50
                            ? "bitter_sweet_bg50 bold600 justifyCenter"
                            : text < 75
                            ? "average_orng_bg50 bold600 justifyCenter"
                            : "lima_bg50 bold600 justifyCenter"
                        : index === 0
                        ? "font16 bold600"
                        : "newBlue_bg10 justifyCenter";
                    return (
                        <div
                            style={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                borderRadius: "6px",
                                // justifyContent: 'center',
                            }}
                            className={`flex paddingLR16 paddingTB14 ${color}`}
                        >
                            <span dangerouslySetInnerHTML={{ __html: text }} />
                            <span className="mariginL4">
                                {key.includes("%") ? "%" : ""}
                            </span>
                        </div>
                    );
                },
                showSorterTooltip: false,
            };
            if (key.length > 30) {
                column.width = 200;
            }
            if (index === 0) {
                column.fixed = "left";
            }
            if (give_color) {
                column.sorter = (a, b) => a[key] - b[key];
            }
            return column;
        }),
    ];
};

const getReportsJson = (data = [], columns = []) => {
    const json = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (!json[i]) json[i] = { id: i };
            json[i][columns[j]] = data[i][j];
        }
    }
    return json;
};
