import React from "react";
import { useInView } from "react-intersection-observer";
import ReportDashboard from "./ReportDashboard";

function TemporaryComp(props) {
    const { ref, inView } = useInView({});
    return (
        <div ref={ref}>
            <ReportDashboard
                inView={inView}
                activeReportType={props.item.type}
                idx={props.index}
                key={props.index}
            />
        </div>
    );
}

export default TemporaryComp;
