import { uid } from "@tools/helpers";
import React, { useCallback, useEffect, useRef, useState } from "react";

function InfiniteLoader({
    loading,
    hasNextPage,
    data,
    onLoadMore,
    Component,
    style,
    className,
    genereateCustomProps,
    ...rest
}) {
    const [fetchMore, setFetcMore] = useState(false);
    const loader = useRef(null);
    // here we handle what happens when user scrolls to Load More div
    // in this case we just update page variable
    const handleObserver = useCallback(
        (entities) => {
            const target = entities[0];
            if (target.isIntersecting) {
                setFetcMore(true);
            }
        },
        [hasNextPage]
    );
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: "20px",
            threshold: 1.0,
        };
        // initialize IntersectionObserver and attaching to Load More div
        const observer = new IntersectionObserver(handleObserver, options);
        if (loader.current) {
            observer.observe(loader.current);
        }
    }, []);

    useEffect(() => {
        fetchMore && onLoadMore();
    }, [fetchMore]);

    useEffect(() => {
        if (fetchMore) {
            setFetcMore(false);
        }
    }, [data]);

    return (
        <div style={style} className={className}>
            {data.map((item, i) => {
                return (
                    <Component
                        key={item.id || uid()}
                        {...item}
                        {...rest}
                        data={item}
                        {...genereateCustomProps(data, i)}
                    />
                );
            })}

            {hasNextPage && (
                <p
                    className="loading text-center marginB20 loading"
                    ref={loader}
                >
                    LOADING
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                </p>
            )}
        </div>
    );
}

InfiniteLoader.defaultProps = {
    genereateCustomProps: () => {},
};

export default InfiniteLoader;
