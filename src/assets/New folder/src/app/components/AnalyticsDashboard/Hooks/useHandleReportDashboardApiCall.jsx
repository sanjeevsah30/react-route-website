import { getReport } from "@store/dashboard/dashboard";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import useGetDashboardPayload from "./useGetDashboardPayload";

export default function useHandleReportDashboardApiCall({
    inView,
    activeReportType,
    isSingleReportDashboard = false,
    filters,
    pinReportId,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const { getDashboardPayload } = useGetDashboardPayload();
    let timer = useRef();
    let hasFetchedOnce = useRef();

    useEffect(() => {
        if (isSingleReportDashboard) {
            return;
        }
        if (inView && !hasFetchedOnce.current) {
            setIsLoading(true);
            timer.current = setTimeout(() => {
                let payload = Object.keys(filters || {})?.length
                    ? { ...filters, type: activeReportType }
                    : { ...getDashboardPayload(), type: activeReportType };

                dispatch(getReport({ ...payload, id: pinReportId })).then(
                    (res) => {
                        setIsLoading(false);
                        hasFetchedOnce.current = true;
                        timer.current = null;
                    }
                );
            }, 1000);
        } else {
            if (timer.current) {
                clearTimeout(timer.current);
                timer.current = null;
            }
        }
    }, [inView]);

    useEffect(
        () => {
            let api;
            if (
                hasFetchedOnce.current ||
                (isSingleReportDashboard && activeReportType)
            ) {
                let payload = getDashboardPayload();
                payload.type = activeReportType;
                setIsLoading(true);
                api = dispatch(getReport({ ...payload }));
                api.then((res) => {
                    if (res?.error?.name === "AbortError") return;
                    setIsLoading(false);
                });
            }
            return () => {
                isSingleReportDashboard && api?.abort();
            };
        },
        isSingleReportDashboard
            ? [getDashboardPayload, activeReportType]
            : [getDashboardPayload]
    );

    return [isLoading];
}
