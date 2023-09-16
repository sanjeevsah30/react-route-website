import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CustomSelect } from "../../Resuable/index";
import FiltersUI from "../../Accounts/Pages/DetailsPage/Components/FiltersUI";
import useGetActiveDashboardFilters from "../Hooks/useGetActiveDashboardFilters";
import { useDispatch } from "react-redux";
import { setActiveSearchView } from "@store/search/actions";
import ReportDashboard from "../Components/ReportDashboard";
import { getAllReports } from "@store/scheduledReports/scheduledReports";
import SectionHeader from "../Components/SectionHeader";

export default React.memo(
    function SingleReport() {
        const [activeReportType, setActiveReportType] = useState(null);
        const {
            scheduled_reports: { all_reports },
        } = useSelector((state) => state);
        const dispatch = useDispatch();

        const { activeFilters, handleRemove, clearSearch } =
            useGetActiveDashboardFilters();

        useEffect(() => {
            dispatch(getAllReports());
        }, []);

        useEffect(() => {
            if (all_reports?.data?.length) {
                const url = new URLSearchParams(document.location.search);
                const report_type = url.get("report_type");

                setActiveReportType(report_type || all_reports.data[0].type);
            }
        }, [all_reports?.data?.length]);

        return (
            <div>
                <FiltersUI
                    data={activeFilters}
                    blockWidth={200}
                    maxCount={6}
                    removeFilter={handleRemove}
                    clearAll={() => {
                        clearSearch();
                        dispatch(setActiveSearchView(0));
                    }}
                />
                <div className="analysis__dashboard">
                    <div className="flex alignCenter justifySpaceBetween">
                        <SectionHeader
                            defaultHeader={false}
                            title={"Reports"}
                        />
                        <CustomSelect
                            data={all_reports?.data}
                            option_key={"type"}
                            option_name={"name"}
                            select_placeholder={"Select a Report"}
                            placeholder={"Select a report"}
                            style={{
                                maxWidth: "200px",
                                height: "36px",
                                width: "200px",
                            }}
                            value={activeReportType}
                            onChange={(value) => {
                                setActiveReportType(value);
                            }}
                            loading={all_reports?.loading}
                        />
                    </div>
                    <div
                        style={{
                            marginTop: "-8px",
                        }}
                    >
                        {activeReportType ? (
                            <ReportDashboard
                                inView={true}
                                activeReportType={activeReportType}
                                isSingleReportDashboard={true}
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
        );
    },
    () => true
);
