import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import LibraryFolders from "./LibraryFolders";
import * as libActions from "@store/library/actions";
import { getCallById } from "@store/calls/actions";
import LibraryPlayer from "./LibraryPlayer";
import withReactTour from "hoc/withReactTour";
import { Route, useLocation, withRouter } from "react-router-dom";
import routes from "@constants/Routes/index";
import LibraryMeetings from "./LibraryMeetings";
import { compose } from "redux";
import withErrorCollector from "hoc/withErrorCollector";
import SampleDataBanner from "@presentational/reusables/SampleDataBanner";

function Library(props) {
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.common.showLoader);
    const { categories, selectedFolder, meetings, sample } = useSelector(
        (state) => state.library
    );
    const [showCreateFolder, setshowCreateFolder] = useState(false);
    const location = useLocation();

    useEffect(() => {
        dispatch(libActions.getCategories());
    }, []);

    useEffect(() => {
        if (location.pathname.split("/").length === 3) {
            handleSelectFolder(null, location.pathname.split("/")[2]);
        }
    }, [location]);

    useEffect(() => {
        if (!!selectedFolder) {
            dispatch(libActions.storeMeetings([]));
            dispatch(libActions.getMeetings(selectedFolder));
        }
    }, [selectedFolder]);

    // Create New Folder States
    const initForm = {
        folder: {
            value: "",
            error: false,
            errorMsg: "",
        },
    };
    const [formFolder, setFormFolder] = useState(initForm);
    const [call, setcall] = useState({});
    const [showVideoPlayer, setshowVideoPlayer] = useState(false);

    const handleSelectFolder = (event, folderId) => {
        dispatch(libActions.setSelectedFolder(folderId));
    };

    const handlePlayVideo = (thisCall, status) => {
        if (thisCall.id !== 0) {
            setcall(thisCall);
        }
        setshowVideoPlayer(status);
    };

    const createFormHandlers = {
        validateField: (name) => {
            if (!formFolder[name].value) {
                setFormFolder({
                    ...formFolder,
                    [name]: {
                        ...formFolder[name],
                        error: true,
                        errorMsg: `${name} is required`,
                    },
                });
                return false;
            } else {
                setFormFolder({
                    ...formFolder,
                    [name]: {
                        ...formFolder[name],
                        error: false,
                        errorMsg: "",
                    },
                });
            }
            return true;
        },

        validateForm: () => {
            for (const key of Object.keys(formFolder)) {
                if (!createFormHandlers.validateField(key)) {
                    return false;
                }
            }
            return true;
        },
        handleCreateNewFolder: (event) => {
            event.preventDefault();
            if (createFormHandlers.validateForm()) {
                dispatch(libActions.createCategory(formFolder.folder.value));
                setTimeout(() => {
                    setFormFolder(initForm);
                    createFormHandlers.handleCreateFolderModal();
                }, 1000);
            }
        },
        handleCreateFolderModal: () => {
            setshowCreateFolder((show) => !show);
        },
        handleNewFolder: (event) => {
            setFormFolder({
                ...formFolder,
                [event.target.name]: {
                    error: false,
                    errorMsg: "",
                    value: event.target.value,
                },
            });
        },
        openAddFolder: () => {
            createFormHandlers.handleCreateFolderModal();
        },
    };

    const callHandlers = {
        deleteMeeting: (id) => {
            dispatch(libActions.deleteMeeting(id));
        },
        handleViewOriginal: (id) => {
            dispatch(getCallById(id)).then((res) => {
                if (!res.status) {
                    props.setCall(res.id, res.title, "completed", res);
                }
            });
        },
    };

    return (
        <div className={`library ${props.isCallActive ? "hide" : ""}`}>
            {sample && (
                <SampleDataBanner desc="You are viewing sample data. Some actions won't work. You can add new folder." />
            )}
            <Route
                exact
                path={routes.LIBRARY}
                render={() => (
                    <LibraryFolders
                        isCallActive={props.isCallActive}
                        selectedFolder={selectedFolder}
                        handleSelectFolder={handleSelectFolder}
                        setCall={props.setCall}
                        showCreateFolder={showCreateFolder}
                        createFormHandlers={createFormHandlers}
                        categories={categories}
                        formFolder={formFolder}
                        loading={loading}
                        openAddFolder={createFormHandlers.openAddFolder}
                    />
                )}
            />
            {/* </Spinner> */}
            <Route
                exact
                path={routes.FOLDER}
                render={() => (
                    <LibraryMeetings
                        meetings={meetings}
                        callHandlers={callHandlers}
                        handlePlayVideo={handlePlayVideo}
                        loading={loading}
                        categories={categories}
                        selectedFolder={selectedFolder}
                    />
                )}
            />
            {showVideoPlayer && (
                <LibraryPlayer
                    id={call.id}
                    showVideoPlayer={showVideoPlayer}
                    handlePlayVideo={handlePlayVideo}
                    // start_time={call.start_time}
                    // end_time={call.end_time}
                />
            )}
        </div>
    );
}

export default compose(withRouter, withReactTour, withErrorCollector)(Library);
