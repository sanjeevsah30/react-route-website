import {
    fetchAccountCallsAndEmails,
    fetchAccountDetails,
    fetchAccountGraph,
} from "@store/accounts/actions";
import { accountFiltersPayload } from "@tools/searchFactory";
import React, { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router";
import { AccountsContext } from "../../Accounts";
import DetailsPageBody from "./Components/DetailsPageBody";
import DetailsPageHeader from "./Components/DetailsPageHeader";

function DetailsPage(props) {
    const location = useLocation();
    const dispatch = useDispatch();

    const { searchFilters } = useContext(AccountsContext);

    useEffect(() => {
        const acc_id = new URLSearchParams(location.search).get("acc_id");
        const {
            topics,
            clients,
            reps,
            keyword,
            aiDataFilter,
            date,
            leadScoreFilter,
            meeting_ids,
        } = searchFilters;

        dispatch(
            fetchAccountCallsAndEmails({
                id: acc_id,
                payload: accountFiltersPayload({
                    topics,
                    clients,
                    reps,
                    acc_id,
                    keyword,
                    aiDataFilter,
                    date,
                    leadScoreFilter,
                    meeting_ids,
                }),
            })
        );
    }, [searchFilters]);

    useEffect(() => {
        const acc_id = new URLSearchParams(location.search).get("acc_id");
        dispatch(fetchAccountDetails(acc_id));
        dispatch(fetchAccountGraph(acc_id));
    }, []);

    return (
        <div
            className="accounts__detailspage flex column"
            style={{
                height: "100vh",
            }}
        >
            {/* <div
                style={{
                    height: '100px',
                    background: 'blue',
                    flexShrink: 0,
                }}
            ></div> */}
            <DetailsPageHeader />
            <DetailsPageBody />
        </div>
    );
}

export default DetailsPage;
