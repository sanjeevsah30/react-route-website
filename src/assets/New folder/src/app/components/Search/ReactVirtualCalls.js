import { useVirtual } from "react-virtual";
import React, { useEffect, useState } from "react";
import { getDateTime } from "@tools/helpers";

function ReactVirtualCalls({
    data,
    hasNextPage,
    loading,
    onLoadMore,
    user,
    Component,
    allCallTypes,
    handleCallType,
    sharerHandler,
    setactiveCall,
    isSearchActive,
    searchInfiniteRef,
}) {
    const parentRef = React.useRef();
    const rowVirtualizer = useVirtual({
        size: hasNextPage ? data.length + 1 : data.length,
        parentRef,
        estimateSize: React.useCallback(() => 1000, []),
    });
    const [fetchNew, setFetchNew] = useState(false);
    React.useEffect(() => {
        const [lastItem] = [...rowVirtualizer.virtualItems].reverse();
        if (!lastItem) {
            return;
        }
        if (fetchNew) {
            return;
        }
        if (lastItem.index === data.length && hasNextPage && !loading) {
            setFetchNew(true);
        }
    }, [rowVirtualizer.virtualItems]);

    useEffect(() => {
        if (fetchNew) onLoadMore(true);
    }, [fetchNew]);

    useEffect(() => {
        if (fetchNew) setFetchNew(false);
    }, [hasNextPage]);
    return (
        <div
            ref={parentRef}
            className="List"
            style={{
                height: window.innerHeight - 133.6,
                paddingTop: isSearchActive && !loading ? "82px" : "10px",
                width: `100%`,
                overflowY: "scroll",
            }}
        >
            <div
                style={{
                    height: `${rowVirtualizer.totalSize}px`,
                    width: "100%",
                    position: "relative",
                }}
            >
                {rowVirtualizer.virtualItems.map((virtualRow) => {
                    const isLoaderRow = virtualRow.index > data.length - 1;
                    const call = data[virtualRow.index];

                    return (
                        <div
                            key={virtualRow.index}
                            ref={virtualRow.measureRef}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: `${data[virtualRow.index]}px`,
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                        >
                            {isLoaderRow ? (
                                hasNextPage ? (
                                    <p className="loading text-center marginB20">
                                        LOADING
                                        <span>.</span>
                                        <span>.</span>
                                        <span>.</span>
                                    </p>
                                ) : (
                                    <></>
                                )
                            ) : (
                                <Component
                                    key={call.id}
                                    call={call}
                                    handleCallType={handleCallType}
                                    callCategories={virtualRow.index}
                                    callCardIndex={virtualRow.index}
                                    index={virtualRow.index}
                                    setactiveCall={setactiveCall}
                                    allCallTypes={allCallTypes}
                                    sharerHandler={sharerHandler}
                                    user={user}
                                    // uniqueKey={key}
                                    prevDate={
                                        virtualRow.index !== 0
                                            ? getDateTime(
                                                  data[virtualRow.index - 1]
                                                      ?.start_time,
                                                  "date"
                                              )
                                            : null
                                    }
                                    currDate={getDateTime(
                                        data[virtualRow.index]?.start_time,
                                        "date"
                                    )}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ReactVirtualCalls;
