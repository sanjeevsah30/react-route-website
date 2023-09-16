import GridLayout from "react-grid-layout";
import "../style.scss";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import CreateDashboardDrawer from "./CreateDashboardDrawer";
import { Box, Button, Typography } from "@mui/material";
import ReportDashboard from "app/components/AnalyticsDashboard/Components/ReportDashboard";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import useCustomDashboardStateContext from "../hooks/useCustomDashboardStateContext";
import { useParams } from "react-router-dom";
import {
    useGetDashboardDataQuery,
    useUpdateDashboardMutation,
} from "@convin/redux/services/home/customDashboard.service";

import { isDefined } from "@convin/utils/helper/common.helper";
import { AuditCard } from "./AuditCard";
import CustomDashboardModalStateProvider from "../context/CustomDashboardModalStateContext";
import { CustomReportFiltersModal } from "./CustomReportFiltersModal";
import ResizeSvg from "@convin/components/svg/ResizeSvg";
import SkeletonLoader from "@convin/components/custom_components/Loader/SkeletonLoader";
import { MoreOptionsPopover } from "./MoreOptionsPopover";
import { RenameCardModal } from "./RenameCardModal";
import { convertDateToEpoch } from "@convin/utils/helper/date.helper";
import { clearReportFile } from "@store/dashboard/dashboard";
import { useDispatch } from "react-redux";
import ShareDownloadModal from "./ShareDownloadModal";
import NoDashBoardDataSvg from "app/static/svg/NoDashBoardDataSvg";
interface RouteParams {
    id: string;
}

export default function CustomDashboardView(): JSX.Element {
    const params = useParams<RouteParams>();
    return <View key={params.id} id={+params.id} />;
}

const View: FunctionComponent<{ id: number }> = ({ id }) => {
    const dispatch = useDispatch();
    const ref = useRef<HTMLDivElement>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const [isShareModelOpen, setIsShareModelOpen] = useState<boolean>(false);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState<boolean>(false);
    const [isFiltersModalOpen, setIsFiltersModalOpen] =
        useState<boolean>(false);
    const { data: customDashboardData, isLoading: dashboardDataLoading } =
        useGetDashboardDataQuery(id, {
            refetchOnMountOrArgChange: true,
        });

    const [updateDashboardLayout] = useUpdateDashboardMutation();
    const { prepareDashboardStateForUpdate } = useCustomDashboardStateContext();

    const onResizeStop: GridLayout.ItemCallback = (
        layouts: GridLayout.Layout[]
    ) => {
        if (id)
            updateDashboardLayout({
                id,
                ...customDashboardData,
                layout: [...layouts],
            });
    };

    // useEffect(() => {
    //     return () => {
    //         dispatch(clearReportFile([]));
    //     };
    // }, []);

    const onDragStop = (layouts: GridLayout.Layout[]) => {
        if (id)
            updateDashboardLayout({
                id: id,
                ...customDashboardData,
                layout: [...layouts],
            });
    };

    return (
        <Box>
            <CreateDashboardDrawer
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
            />
            <CustomDashboardModalStateProvider>
                {dashboardDataLoading ? (
                    <SkeletonLoader />
                ) : (
                    <>
                        {customDashboardData !== undefined &&
                        Object.keys(customDashboardData).length ? (
                            <>
                                <Box
                                    className="flex justify-between flex-shrink-0"
                                    sx={{ p: 1 }}
                                >
                                    {customDashboardData !== undefined &&
                                    customDashboardData.description ? (
                                        <Typography>
                                            {`Description: ${customDashboardData.description}`}
                                        </Typography>
                                    ) : (
                                        <div></div>
                                    )}
                                    <Box>
                                        {false && (
                                            <Button variant="outlined">
                                                SCHEDULE
                                            </Button>
                                        )}

                                        <Button
                                            variant="outlined"
                                            sx={{ ml: 1 }}
                                            onClick={() => {
                                                setIsShareModelOpen(true);
                                            }}
                                        >
                                            SHARE
                                        </Button>

                                        <Button
                                            variant="outlined"
                                            sx={{ ml: 1 }}
                                            onClick={() => {
                                                prepareDashboardStateForUpdate({
                                                    ...customDashboardData,
                                                });
                                                setIsDrawerOpen(true);
                                            }}
                                        >
                                            EDIT
                                        </Button>
                                    </Box>
                                </Box>
                                <Box id="custom_dashboard" ref={ref}>
                                    <GridLayout
                                        className="layout flex-1"
                                        layout={customDashboardData?.layout?.map(
                                            (e) => ({
                                                ...e,
                                                i: `${e.i}`,
                                            })
                                        )}
                                        cols={12}
                                        rowHeight={30}
                                        width={window.innerWidth * 0.95}
                                        isResizable={true}
                                        autoSize={true}
                                        onDragStop={onDragStop}
                                        onResizeStop={onResizeStop}
                                        resizeHandle={
                                            <Box
                                                component="div"
                                                className="react-resizable-handle"
                                            >
                                                <ResizeSvg />
                                            </Box>
                                        }
                                    >
                                        {customDashboardData?.single_objects?.map(
                                            (item) => {
                                                return (
                                                    <Box
                                                        key={item.id}
                                                        className="flex flex-col items-center justify-center cursor-pointer"
                                                        sx={{
                                                            p: 1,
                                                            background: "#fff",
                                                            borderRadius:
                                                                "12px",
                                                            boxShadow:
                                                                "0px 4px 20px rgba(51, 51, 51, 0.1)",
                                                        }}
                                                        // component="span"
                                                    >
                                                        <MoreOptionsPopover
                                                            {...{
                                                                item,
                                                                className:
                                                                    "absolute z-10 top-5 right-5",
                                                                setIsFiltersModalOpen,
                                                                setIsRenameModalOpen,
                                                            }}
                                                        />
                                                        <AuditCard
                                                            title={item.name}
                                                            name={item.name}
                                                            count={
                                                                item?.data
                                                                    ?.count
                                                            }
                                                            active={true}
                                                            change={
                                                                item?.data
                                                                    ?.change ||
                                                                0
                                                            }
                                                        />
                                                    </Box>
                                                );
                                            }
                                        )}

                                        {isDefined(
                                            customDashboardData?.reports
                                        ) ? (
                                            customDashboardData?.reports?.map(
                                                (item) => {
                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className="cursor-pointer"
                                                        >
                                                            <ReportDashboard
                                                                inView={true}
                                                                report_name={
                                                                    item.name
                                                                }
                                                                activeReportType={
                                                                    item.type
                                                                }
                                                                isSingleReportDashboard={
                                                                    false
                                                                }
                                                                isPined={true}
                                                                pinReportId={
                                                                    item.id
                                                                }
                                                                isCustomDashboard={
                                                                    true
                                                                }
                                                                isGraph={
                                                                    item.is_graph
                                                                }
                                                                filters={
                                                                    item.filters
                                                                }
                                                                renderOptions={() => {
                                                                    return (
                                                                        <MoreOptionsPopover
                                                                            {...{
                                                                                item,
                                                                                setIsFiltersModalOpen,
                                                                                setIsRenameModalOpen,
                                                                            }}
                                                                        />
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                    );
                                                }
                                            )
                                        ) : (
                                            <></>
                                        )}
                                    </GridLayout>
                                </Box>
                            </>
                        ) : (
                            <Box
                                className="flex items-center justify-center flex-col"
                                sx={{ height: "calc(100vh - 300px)" }}
                            >
                                <NoDashBoardDataSvg />
                                <Typography className="font-semibold">
                                    {"You Don't have Permission !"}
                                </Typography>
                            </Box>
                        )}
                    </>
                )}

                <CustomReportFiltersModal
                    {...{ isFiltersModalOpen, setIsFiltersModalOpen }}
                />

                <RenameCardModal
                    {...{ isRenameModalOpen, setIsRenameModalOpen }}
                />

                <ShareDownloadModal
                    {...{
                        isShareModelOpen,
                        setIsShareModelOpen,
                        dashboardRef: ref,
                    }}
                />
            </CustomDashboardModalStateProvider>
        </Box>
    );
};
