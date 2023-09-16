import React, { Suspense, useCallback, useState } from "react";
import callFiltersConfig from "@constants/CallFilters";
import "./callFilters.scss";
import FallbackUI from "@presentational/reusables/FallbackUI";

import { useSelector } from "react-redux";

import Spinner from "@presentational/reusables/Spinner";
import OverallAndAttributes from "./OverallDetails/OverallAndAttributes";

function CallFilters({ handleActiveComponent, onBack = () => {}, visible }) {
    const { auditOverallDetailsLoading } = useSelector(
        (state) => state.dashboard
    );

    return (
        <div
            className="call_filters_container paddingL10 flex alignCenter"
            style={{
                border: "1px solid rgba(153, 153, 153, 0.2)",
                minHeight: "420px",
                borderRadius: "6px",
            }}
        >
            <Spinner loading={auditOverallDetailsLoading}>
                <Suspense fallback={<FallbackUI />}>
                    <OverallAndAttributes
                        handleActiveComponent={handleActiveComponent}
                        onBack={onBack}
                        visible={visible}
                        parametersLoading={auditOverallDetailsLoading}
                    />
                </Suspense>
            </Spinner>
        </div>
    );
}

export default CallFilters;
