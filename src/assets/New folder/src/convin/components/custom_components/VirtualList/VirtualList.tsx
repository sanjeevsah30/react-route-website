import { useVirtual } from "react-virtual";
import React, { useCallback, useEffect, useRef } from "react";
import ThreeDotsWave from "../ThreeDotsWave";
import { Box, Stack } from "@mui/material";

export default function VirtualList<T>({
    data = [],
    Component,
    hasNext,
    fetchNext,
    isFetching,
    isLoading,
    ...rest
}: {
    data?: Array<T>;
    Component: React.FC<{
        prevIndexedData: T | null;
        data: T;
    }>;
    hasNext: boolean;
    fetchNext: () => unknown;
    isFetching: boolean;
    isLoading: boolean;
}) {
    const parentRef = useRef();
    const rowVirtualizer = useVirtual({
        size: hasNext ? data.length + 1 : data.length,
        parentRef,
        estimateSize: useCallback(() => 1000, []),
    });

    useEffect(() => {
        const [lastItem] = [...rowVirtualizer.virtualItems].reverse();

        if (!lastItem) {
            return;
        }

        if (lastItem.index === data.length && hasNext && !isFetching) {
            fetchNext();
        }
    }, [rowVirtualizer.virtualItems]);

    return (
        <Box
            sx={{
                p: 3,
            }}
            ref={parentRef}
            className="h-full w-full overflow-y-scroll"
        >
            <Stack
                style={{
                    height: `${rowVirtualizer.totalSize}px`,
                    width: "100%",
                    position: "relative",
                }}
            >
                {rowVirtualizer.virtualItems.map((virtualRow) => {
                    const { index, measureRef, start } = virtualRow;
                    const isLoaderRow = index > data.length - 1;
                    const item = data[index];
                    return (
                        <div
                            key={index}
                            ref={measureRef}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: `${data[index]}px`,
                                transform: `translateY(${start}px)`,
                            }}
                        >
                            {isLoaderRow ? (
                                hasNext ? (
                                    <ThreeDotsWave />
                                ) : (
                                    <></>
                                )
                            ) : (
                                <Component
                                    {...{
                                        prevIndexedData: index
                                            ? data[index - 1]
                                            : null,
                                        data: item,
                                        isLoading,
                                        ...rest,
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </Stack>
        </Box>
    );
}
