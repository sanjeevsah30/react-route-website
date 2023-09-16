import { HomeContext } from "@container/Home/Home";
import { clearReports } from "@store/dashboard/dashboard";
import {
    clearDefaultReports,
    getDefaultReports,
} from "@store/scheduledReports/scheduledReports";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CallFilters from "../../CallFilters/CallFilters";
import OverallParameterAnalytics from "../Components/OverallParameterAnalytics";
import SectionHeader from "../Components/SectionHeader";
import TemporaryComp from "../Components/TemporaryComp";
import SingleParameterAnalytics from "../../SingleParameterAnalytics/SingleParameterAnalytics";
import { report_types } from "../Constants/dashboard.constants";
import exportAsImage from "utils/exportAsImage";

export default function ParameterLevelAnalytics() {
    const dispatch = useDispatch();
    const [isMount, setIsMount] = useState(true);
    const parameterGraph = useRef();
    const [isParametergraph, setIsParametergraph] = useState(true);
    const [singleParameterLoader, setSingleParameterLoader] = useState(false);

    const default_reports = useSelector(
        (state) => state.scheduled_reports.default_reports
    );

    const { handleActiveComponent } = useContext(HomeContext);

    useEffect(() => {
        let payload = { dashboard: "parameter_analysis" };
        dispatch(getDefaultReports(payload));
        setIsMount(true);
        return () => {
            dispatch(clearDefaultReports());
            dispatch(clearReports());
            setIsMount(false);
        };
    }, []);

    return (
        <div className="parameter_level analysis__dashboard">
            <OverallParameterAnalytics showSeeDetails={false} />
            <div>
                <SectionHeader
                    title="Detailed Analysis"
                    defaultHeader={false}
                />
                <CallFilters
                    handleActiveComponent={handleActiveComponent}
                    // onBack={() => setActiveTab(tabIds.analysis)}
                    // visible={visible}
                />
            </div>
            <div>
                <SectionHeader
                    singleParameterLoader={singleParameterLoader}
                    setSingleParameterLoader={setSingleParameterLoader}
                    isParametergraph={isParametergraph}
                    title="Single Parameter Performance"
                    // defaultHeader={false}
                    report_type={report_types.parameters}
                    downloadGraph={() => {
                        setSingleParameterLoader(true);
                        exportAsImage(
                            parameterGraph?.current,
                            "parameter_trend_Graph"
                        )
                            .then(() => {
                                setSingleParameterLoader(false);
                            })
                            .catch(() => {
                                setSingleParameterLoader(false);
                            });
                    }}
                />
                <SingleParameterAnalytics
                    setIsParametergraph={setIsParametergraph}
                    parameterGraph={parameterGraph}
                />
            </div>
            {isMount && !!default_reports?.data?.length && (
                <div>
                    <SectionHeader title="Reports" defaultHeader={false} />
                    {default_reports?.data?.map((item, index) => (
                        <TemporaryComp item={item} index={index} key={index} />
                    ))}
                </div>
            )}
        </div>
    );
}
