import React, { useEffect } from "react";
import {
    AutoSizer,
    CellMeasurer,
    List,
    CellMeasurerCache,
    InfiniteLoader,
    WindowScroller,
} from "react-virtualized";

function VirtualizeTranscript({
    data,
    Component,
    rowCount,
    activeTranscript,
    ...rest
}) {
    const cache = new CellMeasurerCache({
        fixedWidth: true,
        defaultHeight: 50,
    });

    function RenderItem({ index, key, style, parent }) {
        const item = data[index];

        return (
            <CellMeasurer
                key={key}
                cache={cache}
                parent={parent}
                columnIndex={0}
                rowIndex={index}
            >
                <Component
                    style={style}
                    transcript={item}
                    {...rest}
                    index={index}
                />
            </CellMeasurer>
        );
    }
    return (
        <WindowScroller>
            {({
                height,
                isScrolling,
                onChildScroll,
                registerChild,
                scrollTop,
            }) => (
                <AutoSizer disableHeight>
                    {({ width }) => (
                        <List
                            isScrolling={isScrolling}
                            onScroll={onChildScroll}
                            height={500}
                            width={width}
                            rowCount={data.length}
                            rowHeight={cache.rowHeight}
                            rowRenderer={RenderItem}
                            deferredMeasurementCache={cache}
                            overscanRowCount={10}
                            scrollToIndex={activeTranscript}
                        />
                    )}
                </AutoSizer>
            )}
        </WindowScroller>
    );
}

export default VirtualizeTranscript;
