import { useVirtual } from "react-virtual";
import React, { useEffect, useState } from "react";

/* setDependecy is for react virtual. It need to recalulate the width once state changes */

function ReactVirtualCard({
    height,
    data,
    hasNextPage,
    loading,
    onLoadMore,
    Component,
    style,
    className,
    virtualDependecy,
    genereateCustomProps,
    ...rest
}) {
    const parentRef = React.useRef();

    /* Use this to trigger a recalculation of the height when there is a change in the child component
    eg : setDependency(prev=>prev+1) 
     */
    const rowVirtualizer = useVirtual({
        size: hasNextPage ? data.length + 1 : data.length,
        parentRef,
        estimateSize: React.useCallback((index) => {
            return 100;
        }, []),
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
        <div ref={parentRef} className={className} style={{ ...style }}>
            <div
                style={{
                    height: `${rowVirtualizer.totalSize}px`,
                    width: "100%",
                    position: "relative",
                }}
            >
                {rowVirtualizer.virtualItems.map((virtualRow, index) => {
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
                                    {...item}
                                    data={item}
                                    {...rest}
                                    index={virtualRow.index}
                                    items={data}
                                    {...genereateCustomProps(
                                        data,
                                        virtualRow.index
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

ReactVirtualCard.defaultProps = {
    genereateCustomProps: () => ({}),
};
export default ReactVirtualCard;
