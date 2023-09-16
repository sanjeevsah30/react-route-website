import { useCallback, useRef } from "react";

function useInfiniteScroll({ isLoading, hasMore, onLoadMore, isError }) {
    const observer = useRef();
    const lastElementRef = useCallback(
        (node) => {
            if (isLoading || isError) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    onLoadMore();
                }
            });
            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore, isError]
    );
    return lastElementRef;
}

export default useInfiniteScroll;
