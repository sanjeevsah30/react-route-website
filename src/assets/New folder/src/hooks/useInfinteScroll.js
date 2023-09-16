import { useEffect, useRef, useState } from "react";
import useInterval from "./useInterval";
import { isElementInViewport } from "@helpers";

function useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore,
    checkInterval = 200,
    scrollContainerSelector = "",
    contentEndSelector = "",
}) {
    const ref = useRef();
    // Normally we could use the "loading" prop, but when you set "checkInterval" to a very small
    // number (like 10 etc.), some request components can't set its loading state
    // immediately. Thus we set our own "listen" state which immeadiately turns to "false" on
    // calling "onLoadMore".
    const [listen, setListen] = useState(true);

    useEffect(() => {
        if (!loading) {
            setListen(true);
        }
    }, [loading]);

    function listenBottomOffset() {
        if (listen && !loading && hasNextPage) {
            if (ref.current) {
                try {
                    let isVisible = isElementInViewport(
                        contentEndSelector,
                        scrollContainerSelector
                    );
                    if (isVisible) {
                        setListen(false);
                        onLoadMore();
                    }
                } catch (e) {}
            }
        }
    }

    useInterval(
        () => {
            listenBottomOffset();
        },
        // Stop interval when there is no next page.
        hasNextPage ? checkInterval : 0
    );

    return ref;
}

export default useInfiniteScroll;
