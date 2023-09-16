import { Button, Spin, Table, Tooltip } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import NoReportSvg from "app/static/svg/NoReportSvg";

import "../report.style.scss";

import ScheduleSvg from "app/static/svg/ScheduleSvg";
import DownloadSvg from "app/static/svg/DownloadSvg";
import ParameterReport from "./ParameterReport";
import AmCharts from "@container/Home/AmCharts";

import exportAsImage from "utils/exportAsImage";
import Loader from "@presentational/reusables/Loader";
import MatrixSvg from "app/static/svg/MatrixSvg";
import LineGraphSvg from "app/static/svg/LineGraphSvg";
import { HomeDashboardContext } from "../Context/HomeDashboardContext";
import BarGraph from "./BarGraph";
import {
    getColumns,
    getReportsJson,
    isOnlyDownloadableReport,
} from "../Utills/dashboard.utils";
import useHandleReportDashboardApiCall from "../Hooks/useHandleReportDashboardApiCall";
import { LoadingOutlined } from "@ant-design/icons";
import PinSvg from "app/static/svg/PinSvg";
import UnpinSvg from "app/static/svg/UnpinSvg";
import { Box, Divider, Modal, Typography } from "@mui/material";
import { CloseSvg } from "@convin/components/svg";
import {
    useGetDashboardListQuery,
    usePinReportMutation,
    useUnPinReportMutation,
    useUpdateCustomDahboardReportMutation,
} from "@convin/redux/services/home/customDashboard.service";
import { useHistory } from "react-router-dom";
import { dashboardRoutes } from "app/components/AnalyticsDashboard/Constants/dashboard.constants";
import useGetDashboardPayload from "../Hooks/useGetDashboardPayload";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 766,
    bgcolor: "#fff",
    boxShadow: 24,
    borderRadius: "12px",
    maxHeight: 600,
};

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

function ReportDashboard({
    inView,
    activeReportType,
    isSingleReportDashboard,
    isPined = false,
    pinReportId,
    isCustomDashboard,
    renderOptions,
    isGraph = false,
    filters = {},
    report_name,
}) {
    const {
        common: { versionData },
        dashboard: { reports },
        // common: { props.activeReportType },
        scheduled_reports: { all_reports },
    } = useSelector((state) => state);
    const { data: customDashboards } = useGetDashboardListQuery(undefined, {
        skip: !versionData?.feature_access?.custom_dashboard,
    });
    const [updateReport] = useUpdateCustomDahboardReportMutation();
    const [pinReport] = usePinReportMutation();
    const [unPinReport] = useUnPinReportMutation();

    const { getDashboardPayload } = useGetDashboardPayload();
    const [isLoading] = useHandleReportDashboardApiCall({
        inView,
        activeReportType,
        isSingleReportDashboard,
        filters,
        pinReportId,
    });

    // activeTab = true means active Matrix
    const [activeTab, setActiveTab] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [dashboards, setDashboards] = useState([]);
    const history = useHistory();

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

    const { setShowScheduelModal, handleDownload, setReportType } =
        useContext(HomeDashboardContext);

    const graphRef = useRef(null);

    const onClick = () => {
        if (activeTab) {
            setIsDownloading(true);
            handleDownload(
                isSingleReportDashboard ? activeReportType : tempReport.report
            )
                .then((res) => setIsDownloading(false))
                .catch((err) => setIsDownloading(false));
        } else {
            exportAsImage(graphRef?.current, "Graph");
        }
    };

    const tempReport =
        reports?.data[pinReportId || activeReportType]?.report_data;

    const [name, setName] = useState("");

    useEffect(() => {
        setActiveTab(!isGraph);
    }, [isGraph]);

    useEffect(() => {
        setName(
            all_reports?.data?.find((el) => {
                return el.type === activeReportType;
            })?.name
        );
    }, [activeReportType, all_reports?.data]);
    return (
        <div
            className="paddingT20 paddingLR10 overflowYscroll height100p width100p"
            style={{
                border: "1px solid rgba(153, 153, 153, 0.2)",
                borderRadius: "10px",
                boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.05)",
                ...(!activeTab && {
                    paddingBottom: "20px",
                }),
                background: "#fff",
                marginBottom: "20px",
            }}
        >
            {(!!tempReport || isCustomDashboard) && (
                <div
                    className="flex marginB20 alignCenter"
                    style={{
                        justifyContent: "space-between",
                    }}
                >
                    <p
                        className="bold600"
                        style={{
                            fontSize: "18px",
                            paddingLeft: "20px",
                            minWidth: "7.8125rem",
                        }}
                    >
                        {pinReportId ? report_name : name}
                    </p>
                    {((!!tempReport?.graph_data?.length &&
                        !!tempReport?.data?.length) ||
                        (name?.toLowerCase()?.includes("pareto") &&
                            !!tempReport?.data?.length)) && (
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
                                onClick={() => {
                                    if (
                                        window.location.pathname.includes(
                                            "custom"
                                        ) &&
                                        pinReportId
                                    ) {
                                        updateReport({
                                            id: pinReportId,
                                            is_graph: false,
                                        });
                                    }
                                    setActiveTab(true);
                                }}
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
                                onClick={() => {
                                    if (
                                        window.location.pathname.includes(
                                            "custom"
                                        ) &&
                                        pinReportId
                                    ) {
                                        updateReport({
                                            id: pinReportId,
                                            is_graph: true,
                                        });
                                    }
                                    setActiveTab(false);
                                }}
                            >
                                <LineGraphSvg />
                                <span className="marginL11">Graph</span>
                            </div>
                        </div>
                    )}
                    {isCustomDashboard ? (
                        renderOptions()
                    ) : (
                        <div className="flex alignCenter">
                            {versionData?.feature_access?.custom_dashboard ? (
                                <Tooltip title="Pin Custom Report to dashboard">
                                    {isPined ? (
                                        <Button
                                            type="text"
                                            className="borderRadius6"
                                            onClick={() => {
                                                unPinReport(pinReportId);
                                            }}
                                        >
                                            <UnpinSvg />
                                        </Button>
                                    ) : (
                                        <Button
                                            type="text"
                                            className="borderRadius6"
                                            onClick={() => setIsModelOpen(true)}
                                        >
                                            <PinSvg />
                                        </Button>
                                    )}
                                </Tooltip>
                            ) : (
                                <></>
                            )}
                            <Tooltip title="Schedule Report">
                                <Button
                                    type="text"
                                    className="borderRadius6"
                                    onClick={() => {
                                        activeReportType &&
                                            setReportType(activeReportType);
                                        setShowScheduelModal(true);
                                    }}
                                >
                                    <ScheduleSvg />
                                </Button>
                            </Tooltip>

                            <Button
                                type="text"
                                className="borderRadius6 paddingT8 flex items-center"
                                onClick={onClick}
                                style={{
                                    backgroundColor: "transparent",
                                    position: "relative",
                                }}
                                disabled={isDownloading || isLoading}
                            >
                                <DownloadSvg />
                                <Spin
                                    style={{
                                        position: "absolute",
                                        top: "60%",
                                        left: "50%",
                                        transform: "translate(-50%,-50%)",
                                    }}
                                    spinning={isDownloading}
                                    indicator={
                                        <LoadingOutlined
                                            style={{
                                                fontSize: 24,
                                                height: 24,
                                                width: 24,
                                            }}
                                            spin
                                        />
                                    }
                                />
                            </Button>
                        </div>
                    )}
                </div>
            )}
            <Loader loading={isLoading}>
                {
                    <>
                        {activeTab === false && (
                            <div ref={graphRef}>
                                {name?.toLowerCase()?.includes("pareto") && (
                                    <AmCharts
                                        data={getReportsJson(
                                            tempReport?.data,
                                            // reports?.data?.find(({ type }) => type === props.activeReportType)?.columns
                                            tempReport?.columns
                                        ).map((e) => ({ ...e, divider: 80 }))}
                                        x_label={
                                            name
                                                ?.toLowerCase()
                                                ?.includes("agent")
                                                ? "Agent Email"
                                                : "Parameters"
                                        }
                                    />
                                )}

                                {!!tempReport?.graph_data?.length ? (
                                    <div
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
                                                    useSuffix={true}
                                                />
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex alignCenter justifyCenter height100p">
                                        <div className="flex column alignCenter marginB20">
                                            <NoReportSvg />
                                            <div className="bold700 mine_shaft_cl font18">
                                                {isOnlyDownloadableReport(
                                                    tempReport?.report
                                                )
                                                    ? "The selected report can only be Downloaded!"
                                                    : "No Data!"}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === true && (
                            <>
                                {tempReport?.data?.length ? (
                                    <React.Fragment>
                                        {activeReportType ===
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
                                        ) : activeReportType ===
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
                                                        tempReport?.data
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
                                                        tempReport?.data
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
                                                    tempReport?.data
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
                                        <div className="flex column alignCenter marginB20">
                                            <NoReportSvg />
                                            <div className="bold700 mine_shaft_cl font18">
                                                {isOnlyDownloadableReport(
                                                    tempReport?.report
                                                )
                                                    ? "The selected report can only be Downloaded!"
                                                    : "No Data!"}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                }
            </Loader>
            <Modal open={isModelOpen}>
                <Box sx={style}>
                    {customDashboards?.length ? (
                        <>
                            {" "}
                            <Box
                                className="flex items-center justify-between"
                                sx={{ px: 3, py: 3.7 }}
                            >
                                <Typography
                                    id="modal-modal-title"
                                    className="font-semibold"
                                    variant="large"
                                >
                                    Add Metrics to Custom Dashboard
                                </Typography>
                                <Box
                                    component={"span"}
                                    onClick={() => setIsModelOpen(false)}
                                >
                                    <CloseSvg />
                                </Box>
                            </Box>
                            <Divider />
                            <Box sx={{ px: 3, pt: 3 }}>
                                <Typography
                                    className="font-semibold"
                                    sx={{ mb: 3 }}
                                >
                                    Which custom dashboard would you like to add
                                    this metrics to?
                                </Typography>
                                <Box
                                    className="flex gap-4 flex-wrap"
                                    sx={{ overflow: "scroll", maxHeight: 350 }}
                                >
                                    {customDashboards.map((dashboard) => (
                                        <Box
                                            sx={{
                                                px: 1.5,
                                                py: 0.75,
                                                borderRadius: "8px",
                                                border: dashboards.includes(
                                                    dashboard.id
                                                )
                                                    ? "1px solid #1A62F2"
                                                    : "1px solid #49454F",
                                                width: 175,
                                                overflow: "hidden",
                                                whiteSpace: "nowrap",
                                                textOverflow: "ellipsis",
                                                backgroundColor:
                                                    dashboards.includes(
                                                        dashboard.id
                                                    )
                                                        ? "primary.background"
                                                        : "",
                                                color: dashboards.includes(
                                                    dashboard.id
                                                )
                                                    ? "primary.main"
                                                    : "",
                                            }}
                                            onClick={() => {
                                                if (
                                                    dashboards.includes(
                                                        dashboard.id
                                                    )
                                                ) {
                                                    setDashboards(
                                                        dashboards.filter(
                                                            (e) =>
                                                                e !==
                                                                dashboard.id
                                                        )
                                                    );
                                                } else {
                                                    setDashboards((prev) => [
                                                        ...prev,
                                                        dashboard.id,
                                                    ]);
                                                }
                                            }}
                                        >
                                            {dashboard.dashboard_name}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                            <Box
                                sx={{ px: 2.5, py: 3 }}
                                className="flex justify-center"
                            >
                                <Button
                                    onClick={() => {
                                        setIsModelOpen(false);

                                        pinReport({
                                            custom_dashboards: dashboards,
                                            type: activeReportType,
                                            card_type: "report",
                                            filters: getDashboardPayload(),
                                            is_graph: !activeTab,
                                        });
                                        // also send the set of filters in payload
                                    }}
                                    type="primary"
                                    className="borderRadius5 paddingLR24 paddingTB6"
                                    style={{ height: "40px" }}
                                >
                                    ADD TO DASHBOARD
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ px: 3, pt: 3 }}>
                            <Typography
                                className="font-semibold"
                                sx={{ textAlign: "center" }}
                            >
                                Oops, No existing custom dashboard.
                            </Typography>
                            <Box sx={{ textAlign: "center" }}>
                                <Typography
                                    component="span"
                                    className="font-semibold"
                                >
                                    Would you like to Create a{" "}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: "primary.main",
                                    }}
                                    component="span"
                                    className="font-semibold"
                                >
                                    New Custom Dashboard
                                </Typography>
                                <Typography
                                    sx={{ color: "primary.main" }}
                                    component="span"
                                    className="font-semibold"
                                >
                                    ?
                                </Typography>
                            </Box>
                            <Box
                                className="flex items-center justify-center"
                                sx={{ mt: 4, mb: 5 }}
                            >
                                <Button
                                    className="marginR12 paddingLR38 paddingTB6 borderRadius6"
                                    style={{ height: "40px" }}
                                    onClick={() => setIsModelOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary paddingLR38 paddingTB6 borderRadius6"
                                    style={{ height: "40px" }}
                                    onClick={() =>
                                        history.push(dashboardRoutes.custom)
                                    }
                                >
                                    Create
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Modal>
        </div>
    );
}

export default ReportDashboard;
