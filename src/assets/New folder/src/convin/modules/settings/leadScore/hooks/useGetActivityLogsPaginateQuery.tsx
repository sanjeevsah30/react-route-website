import {
    activityApiSlice,
    useGetScoreSenceActivityLogsQuery,
    useLazyGetScoreSenceActivityLogsQuery,
} from "@convin/redux/services/settings/activity.service";
import { ActivityPayload } from "@convin/type/Activity";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

export function useGetActivityLogsPaginateQuery(
    params: ActivityPayload,
    fetchAll: boolean,
    extras?: {
        skip?: boolean;
        refetchOnMountOrArgChange?: boolean;
    }
    // if `true`: auto do next fetches to get all notes at once
) {
    // baseResult is for example
    const baseResult = useGetScoreSenceActivityLogsQuery(params, {
        ...extras,
    });
    console.log(baseResult);
    // trigger may be fired many times
    const [trigger, nextResult] = useLazyGetScoreSenceActivityLogsQuery();
    const dispatch = useDispatch();
    const isBaseReady = useRef(false);
    const isNextDone = useRef(true);
    // next: starts with a null, fetching ended with an null , It stores a url
    const next = useRef<null | string>(null);

    // Base result
    useEffect(() => {
        if (!baseResult.data) {
            return;
        }
        next.current = baseResult.data?.next;
        if (baseResult.data) {
            isBaseReady.current = true;
            fetchAll && fetchNext();
        }
    }, [baseResult]);

    // When there comes a next fetched result
    useEffect(() => {
        if (!nextResult.isSuccess) return;

        if (
            isBaseReady.current &&
            nextResult.data &&
            nextResult.data.next !== next.current
        ) {
            next.current = nextResult.data.next; // undefined if no data further

            // Put next fetched snippets into the first queried collection (as a base collection)
            // This can help us do optimistic/pessimistic updates against the base collection
            const newItems = nextResult.data?.results || [];
            dispatch(
                activityApiSlice.util.updateQueryData(
                    "getScoreSenceActivityLogs",
                    params,
                    (drafts) => {
                        drafts.next = nextResult.data.next;
                        drafts.previous = nextResult.data.previous;
                        if (newItems && newItems.length > 0) {
                            // depends on the use case,
                            // maybe we can do deduplication, removal of some old entries here, if required
                            // ...

                            // adding new snippets to the cache
                            drafts.results.push(...newItems);
                        }
                    }
                )
            );
        }
    }, [nextResult]);

    const fetchNext = async () => {
        if (
            !isBaseReady.current ||
            !isNextDone.current ||
            next.current === undefined ||
            next.current === null
        )
            return;

        try {
            isNextDone.current = false;
            await trigger({
                ...params,
                next: next.current,
            });
        } catch (e) {
        } finally {
            isNextDone.current = true;
            fetchAll && fetchNext();
        }
    };

    const refetch = async () => {
        isBaseReady.current = false;
        next.current = null; // restart
        await baseResult.refetch(); // resatrt with a whole new refetching
    };

    return {
        data: baseResult.data,
        error: baseResult.error,
        isError: baseResult.isError,
        isLoading: baseResult.isLoading,
        isFetching: baseResult.isFetching || nextResult.isFetching,
        errorNext: nextResult.error,
        isErrorNext: nextResult.isError,
        isFetchingNext: nextResult.isFetching,
        hasNext: baseResult.data?.next !== null,
        fetchNext,
        refetch,
    };
}
