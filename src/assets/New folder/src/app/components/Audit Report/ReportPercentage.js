import Icon from "@presentational/reusables/Icon";
import { formatFloat } from "@tools/helpers";
import React from "react";

function ReportPercentage({ change, className }) {
    return change > 0 ? (
        <span className={`bold700 lima_cl ${className}`}>
            <Icon className="fa fa-caret-up marginR5" />
            {formatFloat(change, 2)}%
        </span>
    ) : change < 0 ? (
        <span className={`bold700 bitter_sweet_cl ${className}`}>
            <Icon className="fa fa-caret-down marginR5" />
            {-formatFloat(change, 2)}%
        </span>
    ) : (
        <></>
    );
}

ReportPercentage.defaultProps = {
    className: "",
};

export default ReportPercentage;
