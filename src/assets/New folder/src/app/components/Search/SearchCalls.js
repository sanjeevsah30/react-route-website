import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import CompletedCallCard from "../MyMeetings/CompletedCallCard";
import callsConfig from "@constants/MyCalls/index";
import commonConfig from "@constants/common/index";
import { changeCallType } from "@store/common/actions";

import NoMeetingsFound from "../MyMeetings/NoMeetingsFound";
import ReactVirtualCard from "@presentational/reusables/ReactVirtualCard";
import { getDateTime } from "@tools/helpers";

export default function SearchCalls({
    calls,
    setactiveCall,
    nextUrl,
    activeCallIndex,
    searchKeywords,
    sharerHandler,
    isSearchActive,
    setisSearchActive,
    clearSearch,
    disableCreateAlert,
    onLoadMore,
    setClientValue,
}) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth);

    const allCallTypes = useSelector((state) => state.common.call_types || []);
    const fetchingCalls = useSelector(
        (state) => state.callListSlice.fetchingCalls
    );
    const handleCallType = (type, callId) => {
        dispatch(
            changeCallType(type, callId, "meeting", callsConfig.COMPLETED_TYPE)
        );
    };

    const [scrollToTop, setScrollToTop] = useState(null);
    useEffect(() => {
        if (scrollToTop === 0) {
            setScrollToTop(null);
        }
    }, [scrollToTop]);
    return (
        <>
            <>
                {fetchingCalls ? null : calls?.length ? null : (
                    <div className="myCallContainer-nocalls">
                        <NoMeetingsFound desc="No calls found for the given filter." />
                    </div>
                )}
            </>
            {/* )} */}
            {!fetchingCalls && !!calls.length && (
                <ReactVirtualCard
                    data={calls}
                    hasNextPage={nextUrl}
                    handleCallType={handleCallType}
                    setactiveCall={setactiveCall}
                    allCallTypes={allCallTypes}
                    sharerHandler={sharerHandler}
                    user={user}
                    Component={CallCardComp}
                    isSearchActive={isSearchActive}
                    genereateCustomProps={(data, index) => {
                        return index !== 0
                            ? {
                                  prevDate: getDateTime(
                                      data[index - 1]?.start_time,
                                      "date",
                                      undefined,
                                      "MMM dd, yyyy"
                                  ),
                              }
                            : {};
                    }}
                    onLoadMore={onLoadMore}
                    style={{
                        height: "100%",
                        overflow: "auto",
                    }}
                />
            )}
        </>
    );
}

const CallCardComp = ({
    data,
    user,
    allCallTypes,
    style,
    handleCallType,
    index,
    activeCallIndex,
    setactiveCall,
    sharerHandler,
    setRerender,
    uniqueKey,
    prevDate,
    id,
    start_time,
}) => {
    let showLine = false;
    let currDate = getDateTime(start_time, "date", undefined, "MMM dd, yyyy");
    if (prevDate !== currDate || index === 0) {
        showLine = true;
    }
    return (
        <div style={style} key={data.id}>
            {showLine && (
                <div className="date_timeline_container">
                    <div className="date"> {currDate}</div>
                </div>
            )}
            <CompletedCallCard
                key={data.id}
                showOwnerActions={true}
                handleNewType={handleCallType}
                callCardIndex={index}
                isActive={index === activeCallIndex}
                call={data}
                callCategories={allCallTypes}
                allCallTypes={allCallTypes}
                activeCallCategory={
                    allCallTypes.length && data.call_types
                        ? allCallTypes.find(
                              (callType) => callType.id === data.call_types.id
                          )
                        : -1
                }
                sharerHandler={sharerHandler}
                onClick={() => {}}
                setRerender={setRerender}
                index={index}
            />
        </div>
    );
};
