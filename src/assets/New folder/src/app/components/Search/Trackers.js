import React, { useEffect, useState, useContext } from "react";
import { isEqual } from "lodash";
import { withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    getTrackers,
    createNewTracker,
    removeTracker,
} from "@store/search/actions";
import config from "@constants/Search";
import * as searchActions from "@store/search/actions";

import TrackersUI from "./TrackersUI";
import { openNotification } from "@store/common/actions";
import { SearchContext } from "../MyMeetings/MyMeetings";

function Trackers(props) {
    const dispatch = useDispatch();
    const { trackers } = useSelector((state) => state.search);

    // Tracker states

    const [trackerNameToFind, setTrackerNameToFind] = useState("");
    const [newTracker, setnewTracker] = useState(config.TRACKER_INIT);
    const [isEditing, setisEditing] = useState(false);
    const { setFiltersForSearch, setDrawerState, drawerAction } =
        useContext(SearchContext);

    const trackerHandlers = {
        handleChange: (val, type) => {
            setnewTracker({
                ...newTracker,
                [type]: val,
            });
        },

        handleSubmit: () => {
            if (!newTracker.name) {
                setnewTracker({
                    ...newTracker,
                    error: "Name is required to proceed",
                });
                return;
            }
            let data = {
                name: newTracker.name,
                update_interval:
                    config.NOTIFICATION[newTracker.update_interval],
                search_json: props.filtersData,
            };
            if (isEditing) {
                dispatch(
                    searchActions.editTracker(
                        {
                            name: newTracker.name,
                            update_interval:
                                config.NOTIFICATION[newTracker.update_interval],
                        },
                        newTracker.id
                    )
                );
                // props.toggleTrackersUI();
            } else {
                dispatch(createNewTracker(data));
            }
            setnewTracker(config.TRACKER_INIT);
            setisEditing(false);
            props.setnewTrackerModal(false);
        },

        removeTracker: (id) => {
            dispatch(removeTracker(id));
            props.setDisableCreateAlert(false);
        },

        applyTracker: (id) => {
            let tracker = trackers.results.find((tracker) => tracker.id === id);
            tracker = { ...tracker };

            if (tracker) {
                setFiltersForSearch(JSON.parse(tracker.search_json));
            } else {
                openNotification("error", "Error", "No such tracker found!");
            }
            setDrawerState({ type: drawerAction.CLOSE_ALERTS });
        },

        editTracker: (id) => {
            setisEditing(true);
            props.setDisableCreateAlert(false);
            let tracker = trackers.find((tracker) => tracker.id === id);
            let idx = config.NOTIFICATION.findIndex((n) =>
                isEqual(JSON.parse(tracker.update_interval), n)
            );
            setnewTracker({
                id: id,
                name: tracker.name,
                update_interval: idx,
            });
            // props.toggleTrackersUI();
            props.setnewTrackerModal(true);
        },
    };

    return (
        <TrackersUI
            {...trackerHandlers}
            // toggleTrackersUI={props.toggleTrackersUI}
            showTrackersUI={props.showTrackersUI}
            newTrackerModal={props.newTrackerModal}
            setnewTrackerModal={props.setnewTrackerModal}
            newTracker={newTracker}
            setnewTracker={setnewTracker}
            isEditing={isEditing}
            setisEditing={setisEditing}
            trackerNameToFind={trackerNameToFind}
            setTrackerNameToFind={setTrackerNameToFind}
        />
    );
}

export default withRouter(Trackers);
