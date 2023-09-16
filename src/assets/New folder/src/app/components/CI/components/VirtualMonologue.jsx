import { useVirtual } from "react-virtual";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function VirtualMonologue({
    data,

    Component,
    nextSnippetsUrl,

    visible,

    isSample,
    getNext = () => {},

    ...rest
}) {
    const parentRef = React.useRef();
    const rowVirtualizer = useVirtual({
        size: nextSnippetsUrl ? data.length + 1 : data.length,
        parentRef,
        estimateSize: React.useCallback(() => 1000, []),
    });

    const snippetLoading = useSelector((state) => state.ci.snippetLoading);

    const [fetchNew, setFetchNew] = useState(false);
    React.useEffect(() => {
        const [lastItem] = [...rowVirtualizer.virtualItems].reverse();

        if (!lastItem) {
            return;
        }

        if (fetchNew) {
            return;
        }

        if (
            lastItem.index === data.length &&
            nextSnippetsUrl &&
            !snippetLoading &&
            visible
        ) {
            setFetchNew(true);
        }
    }, [rowVirtualizer.virtualItems]);

    useEffect(() => {
        if (fetchNew && visible) {
            getNext();
        }
    }, [fetchNew]);

    useEffect(() => {
        if (fetchNew) {
            setFetchNew(false);
        }
    }, [nextSnippetsUrl]);
    return (
        <div
            ref={parentRef}
            className="List"
            style={{
                height: window.innerHeight - 64,
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
                    const item = data[virtualRow.index];

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
                                nextSnippetsUrl ? (
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
                                    {...item}
                                    isSample={isSample}
                                    {...rest}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default VirtualMonologue;
