import React, { Fragment, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Spinner } from "@presentational/reusables/index";
import { getDateTime } from "@tools/helpers";
import commonConfig from "@constants/common/index";
import CallCard from "./CallCard";
import NoMeetingsFound from "./NoMeetingsFound";
import InfiniteLoader from "@presentational/reusables/InfiniteLoader";
import { SearchContext } from "./MyMeetings";
import FiltersUI from "../Accounts/Pages/DetailsPage/Components/FiltersUI";
import { USER_TYPES } from "@store/initialState";

export default function UpcomingCalls({
    filtersUpcomingCalls,
    removeFilter,
    clearAll,
}) {
    const {
        upcomingCalls,
        loading,
        upcomingCallsFilters: { filterTeams, filterReps },
    } = useSelector(({ calls }) => calls);
    const user = useSelector((state) => state.auth);
    const isObserver = user?.user_type === USER_TYPES.observer;

    const { upcomingCallshandlers } = useContext(SearchContext);
    // Search calls if any filter change on topbar
    useEffect(() => {
        upcomingCallshandlers.getCalls();
    }, [filtersUpcomingCalls]);

    const onLoadMore = () => {
        upcomingCallshandlers.getCalls(upcomingCalls.next);
    };

    const [prevDate, setPrevDate] = useState(null);
    return (
        <Spinner loading={loading}>
            <div className="flex column height100p">
                <div
                    className={`${
                        filtersUpcomingCalls?.length ? "padding18" : ""
                    }`}
                >
                    <FiltersUI
                        data={[...filtersUpcomingCalls]}
                        blockWidth={200}
                        maxCount={1}
                        removeFilter={removeFilter}
                        clearAll={clearAll}
                    />
                </div>

                {upcomingCalls?.results.length ? (
                    <>
                        <InfiniteLoader
                            Component={UpcomingCallComponent}
                            handlers={upcomingCallshandlers}
                            prevDate={prevDate}
                            setPrevDate={setPrevDate}
                            data={upcomingCalls.results || []}
                            genereateCustomProps={(data, index) => {
                                return index !== 0
                                    ? {
                                          prevDate: getDateTime(
                                              data[index - 1]?.start_time,
                                              "dayDate"
                                          ),
                                      }
                                    : {};
                            }}
                            onLoadMore={onLoadMore}
                            style={{
                                flex: "1",
                                overflowY: "scroll",
                                padding: "18px 22px",
                            }}
                            hasNextPage={upcomingCalls.next}
                        />
                    </>
                ) : (
                    <div className="myCallContainer-nocalls ">
                        <NoMeetingsFound
                            desc={
                                isObserver
                                    ? "Seems there are no meetings scheduled"
                                    : "Seems there are no meetings scheduled or you may not have connected your calendar yet."
                            }
                            showCTA={
                                !filtersUpcomingCalls?.length && !isObserver
                            }
                        />
                    </div>
                )}
            </div>
        </Spinner>
    );
}

const UpcomingCallComponent = ({
    start_time,
    index,
    prevDate,
    id,
    owner,
    call_types,
    handlers,
    data,
}) => {
    let showLine = false;
    const currDate = getDateTime(start_time, "dayDate");

    if (prevDate !== currDate || index === 0) {
        showLine = true;
    }
    const allCallTypes = useSelector((state) => state.common.call_types || []);
    const user = useSelector((state) => state.auth);

    let userHasAccess =
        owner?.id === user.id || user.id === commonConfig.ADMIN ? true : false;

    return (
        <Fragment key={id}>
            {(showLine || index === 0) && (
                <div className="date__value marginB16">{currDate}</div>
            )}
            <div className=" dove_gray_cl marginB16">
                {getDateTime(start_time, "time")}
            </div>
            <CallCard
                showOwnerActions={userHasAccess}
                call={data}
                handleNewType={handlers.changeCallType}
                callCategories={allCallTypes}
                activeCallCategory={
                    allCallTypes.length && call_types
                        ? allCallTypes.find(
                              (callType) => callType.id === call_types.id
                          )
                        : -1
                }
            />
        </Fragment>
    );
};
