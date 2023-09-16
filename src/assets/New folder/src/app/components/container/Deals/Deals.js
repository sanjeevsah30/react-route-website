import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTeamReps } from "@apis/topbar";
import config from "@constants/Deals";

// Presentational Deals Components.
import DealsTopbar from "@presentational/Deals/DealsTopbar";
import CallUI from "@presentational/Deals/CallUI";
import DealsList from "@presentational/Deals/DealsList";

const DealsPanel = (props) => {
    const [activeCall, setactiveCall] = useState(-1); // Index of the call currently active in Deals.
    const [calls, setcalls] = useState([]);
    const [reps, setreps] = useState([]);
    const [deals, setdeals] = useState([]);
    const [filters, setfilters] = useState({});
    const domain = useSelector((state) => state.common.domain);

    useEffect(() => {
        // Get the reps for the currently passed active team.
        if (Number(props.activeTeam) > 0) {
            getTeamReps(domain, props.activeTeam).then((res) => {
                if (res.hasOwnProperty("results")) {
                    // Mapping the ids with the names or usernames on the reps.

                    let newReps = [{ 0: "All" }];

                    if (res.results.length > 0) {
                        let mappedReps = res.results.map((rep, index) => {
                            return {
                                [rep.id]: rep.first_name
                                    ? rep.first_name
                                    : rep.email
                                    ? rep.email
                                    : `Rep ${index + 1}`,
                            };
                        });

                        newReps = [...newReps, ...mappedReps];
                        setreps(newReps);
                    }
                }
            });
        }
    }, [props.activeTeam]);

    return (
        <div className={"deals-container view"}>
            <div className="view-container">
                <div className="card">
                    {/* <DealsTopbar activeCall={activeCall} />
					<DealsList activeCall={activeCall} />
					{activeCall !== -1 ? <CallUI /> : ""} */}
                    {/* Dummy Div */}
                    <p>
                        <strong>Coming Soon...</strong>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DealsPanel;
