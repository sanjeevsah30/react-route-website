import React from "react";
import tourOptionsList from "./tourOptionsList";
import { Card } from "antd";
import { withRouter } from "react-router-dom";
import { updateTourJson } from "@tools/helpers";
import TourCard from "./TourCard";

function HelpMe(props) {
    const redirectToRoute = (route, tour_key, localStorage_key, tab) => {
        updateTourJson(tour_key, true);
        if (localStorage_key) {
            localStorage.setItem(localStorage_key, tab);
        }
        // window.location = route;
        props.history.push(`${route}`);
    };

    return (
        <div className="help row">
            <Card title="Select a tour to start" className="col-24">
                <div className="row">
                    {tourOptionsList.map((tourOption) => (
                        <TourCard
                            key={tourOption.tabName}
                            title={tourOption.tabName}
                            onClick={() =>
                                redirectToRoute(
                                    tourOption.route,
                                    tourOption.tour_key,
                                    tourOption.localStorage_key,
                                    tourOption.tabIdx
                                )
                            }
                        />
                    ))}
                </div>
            </Card>
        </div>
    );
}

export default withRouter(HelpMe);
