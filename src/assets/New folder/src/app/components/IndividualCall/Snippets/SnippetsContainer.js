import React, { useEffect, useState } from "react";
import SnippetsItem from "./SnippetsItem";
import { useVirtual } from "react-virtual";
import { useDispatch, useSelector } from "react-redux";
import { fetchCallSnippets } from "@store/individualcall/actions";
import ReactVirtualCard from "@presentational/reusables/ReactVirtualCard";
import Spinner from "@presentational/reusables/Spinner";

const getVirtualRowStyles = ({ size, start, index }, len) => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    // height: size,
    transform: `translateY(${start}px)`,
});

export default function SnippetsContainer({
    callId,
    setShowUpdateShareModal,
    seekToPoint,
}) {
    const dispatch = useDispatch();
    const { count, results, next, loading } = useSelector(
        ({ individualcall }) => individualcall.snippets
    );

    const parentRef = React.useRef();

    useEffect(() => {
        results || dispatch(fetchCallSnippets(callId));
    }, []);

    const loadMore = () => {
        dispatch(fetchCallSnippets(callId, next));
    };

    return (
        <Spinner loading={loading}>
            <div className="callSnippets__list" ref={parentRef}>
                <ul
                    style={{
                        height: "100%",
                        width: "100%",
                        position: "relative",
                    }}
                >
                    <ReactVirtualCard
                        hasNextPage={next || null}
                        data={results || []}
                        onLoadMore={loadMore}
                        Component={SnippetsItem}
                        setShowUpdateShareModal={setShowUpdateShareModal}
                        seekToPoint={seekToPoint}
                    />
                </ul>
            </div>
        </Spinner>
    );
}
