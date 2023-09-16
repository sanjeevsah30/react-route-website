import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as callsAction from "@store/calls/actions";
import useInfiniteScroll from "hooks/useInfinteScroll";
import callsConfig from "@constants/MyCalls/index";
import { BackTop } from "antd";
import { getDateTime, uid } from "@tools/helpers";
import { changeCallType } from "@store/common/actions";
import commonConfig from "@constants/common/index";

import CompletedCallCard from "./CompletedCallCard";
import { Spinner, NoData } from "@reusables";

export default function CompletedCalls(props) {
    const dispatch = useDispatch();
    let prevDate = null;

    const user = useSelector((state) => state.auth);
    const calls = useSelector((state) => state.calls.completed);
    const loading = useSelector((state) => state.calls.loading);
    const nextUrl = useSelector((state) => state.calls.completedNextUrl);
    const allCallTypes = useSelector((state) => state.common.call_types || []);

    const [activeIdx, setActiveIdx] = useState(null);
    const [isFetchingNewCalls, setIsFetchingNewCalls] = useState(false);

    const filterTeams = useSelector((state) => state.common.filterTeams);
    const filterReps = useSelector((state) => state.common.filterReps);
    const filterCallDuration = useSelector(
        (state) => state.common.filterCallDuration
    );
    const filterDates = useSelector((state) => state.common.filterDates);

    // Search calls on change of fields
    useEffect(() => {
        // if (!calls.length) {
        //     getSearchCalls();
        // } else
        if (calls.length && activeIdx === null) {
            handlers.activateCallCard(0);
        }
    }, [calls.length]);

    // Search calls if any filter change on topbar
    useEffect(() => {
        getSearchCalls();
    }, [filterReps, filterCallDuration.active, filterDates.active]);

    const getSearchCalls = () => {
        if (activeIdx) {
            setActiveIdx(null);
        }
        let data = getActiveFilters();
        return dispatch(callsAction.getCompletedCalls(data));
    };

    const getActiveFilters = () => {
        return {
            // activeCallType: +Object.keys(
            //     filterCallTypes.callTypes[filterCallTypes.active]
            // )[0],
            activeCallDuration:
                filterCallDuration?.options?.[filterCallDuration.active]?.value,
            activeReps: filterReps.active,
            activeTeam: filterTeams.active,
            activeDateRange: filterDates.dates[filterDates.active].dateRange,
        };
    };

    // call card handlers
    const handlers = {
        changeCallType: (type, callId) => {
            dispatch(
                changeCallType(
                    type,
                    callId,
                    "meeting",
                    callsConfig.COMPLETED_TYPE
                )
            );
        },
        activateCallCard: (idx) => {
            if (activeIdx !== idx) {
                props.setSidebarData(calls[idx], callsConfig.COMPLETED_TYPE);
            }
            setActiveIdx(idx);
        },
        loadMoreCalls: () => {
            setIsFetchingNewCalls(true);
            dispatch(
                callsAction.getNextCalls(
                    callsConfig.COMPLETED_TYPE,
                    getActiveFilters()
                )
            ).then(() => {
                setIsFetchingNewCalls(false);
            });
        },
    };

    const completedInfiniteRef = useInfiniteScroll({
        loading: isFetchingNewCalls,
        hasNextPage: props.isCallActive ? false : nextUrl,
        onLoadMore: handlers.loadMoreCalls,
        scrollContainerSelector: "#callsCompletedContainer",
        contentEndSelector: "#content-end",
    });

    return (
        <div
            ref={completedInfiniteRef}
            id="callsCompletedContainer"
            className="myCallContainer-content content-container"
        >
            <BackTop
                target={() =>
                    document.querySelector("#callsCompletedContainer")
                }
            />
            {loading ? (
                <Spinner />
            ) : (
                <>
                    {calls.length ? (
                        <>
                            {calls.map((call, idx) => {
                                let showLine = false;
                                let currDate = getDateTime(
                                    call.start_time,
                                    "date"
                                );
                                if (idx === 0) {
                                    prevDate = getDateTime(
                                        call.start_time,
                                        "date"
                                    );
                                }
                                if (prevDate !== currDate || idx === 0) {
                                    prevDate = currDate;
                                    showLine = true;
                                }
                                let userHasAccess =
                                    call.owner?.id === user.id ||
                                    user.id === commonConfig.ADMIN
                                        ? true
                                        : false;
                                return (
                                    <Fragment key={uid() + call.id}>
                                        {showLine && <div>{currDate}</div>}
                                        <CompletedCallCard
                                            callCardIndex={idx}
                                            isActive={idx === activeIdx}
                                            showOwnerActions={userHasAccess}
                                            call={call}
                                            handleNewType={
                                                handlers.changeCallType
                                            }
                                            setactiveCall={props.setCall}
                                            callCategories={allCallTypes}
                                            activeCallCategory={
                                                allCallTypes.length &&
                                                call.call_types
                                                    ? allCallTypes.find(
                                                          (callType) =>
                                                              callType.id ===
                                                              call.call_types
                                                                  ?.id
                                                      )
                                                    : -1
                                            }
                                            sharerHandler={
                                                props.callHandlers.sharerHandler
                                            }
                                            onClick={handlers.activateCallCard}
                                        />
                                    </Fragment>
                                );
                            })}
                            {nextUrl ? (
                                <div id="content-end">
                                    <p className="loading">
                                        {callsConfig.LAZY_LOADING_TEXT}
                                        <span>.</span>
                                        <span>.</span>
                                        <span>.</span>
                                    </p>
                                </div>
                            ) : null}
                        </>
                    ) : (
                        <NoData description={callsConfig.NO_CALLS} />
                    )}
                </>
            )}
        </div>
    );
}
