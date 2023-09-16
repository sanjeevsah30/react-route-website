import React, { useState, createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.scss";
import NewLibraryView from "./NewLibraryView";
import {
    getCategories,
    createCategory,
    setSelectedFolder,
    getMeetings,
    storeMeetings,
    deleteSnippet,
    getUploads,
    updateFolderName,
    uploadMedia,
    deleteUploads,
    deleteFolder,
} from "@store/library/librarySlice";
import LibraryPlayer from "./LibraryPlayer";
import { checkFileType } from "@tools/helpers";

export const LibraryContext = createContext({});

function NewLibraryContainer() {
    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [createFolderName, setCreateFolderName] = useState("");
    const [showEditModal, setShowEditModal] = useState({
        name: "",
        category_id: 0,
        visible: false,
    });
    const [showMoreSnippet, setShowMoreSnippet] = useState(false);
    const [uploadSnippetsModal, setUploadSnippetsModal] = useState(false);
    const [showVideoPlayer, setShowVideoPlayer] = useState(false);
    const [uri, setUri] = useState("");
    const [call, setCall] = useState({});
    const [files, setFiles] = useState({});
    // const [uploadProgress, setUploadProgress] = useState({
    //     value: 0,
    //     isError: false,
    // });
    // const [editFolder, setEditFolder] = useState({
    //     category_id: 0,
    //     showModal: false
    // });
    const [uploadState, setuploadState] = useState({
        file: "",
        dragOver: false,
        type: "",
        error: "",
    });

    const intialState = {
        showCreateFolder,
        showMoreSnippet,
        createFolderName,
        uploadSnippetsModal,
        files,
        // uploadProgress,
        showEditModal,
        // editFolder,
        setShowMoreSnippet,
        setShowCreateFolder,
        setUploadSnippetsModal,
        setCreateFolderName,
        setFiles,
        // setUploadProgress,
        setShowEditModal,
        // setEditFolder,
        // getMediaHandler,
    };

    const { categories, selectedFolder, meetings, uploads } = useSelector(
        (state) => state.librarySlice
    );

    // console.log(meetings)
    const dispatch = useDispatch();
    // console.log('itration')

    // -------------- handlerFunctions---------
    const createFolder = (category) => {
        dispatch(createCategory(category));
    };
    const handleSelectFolder = (event, folderId) => {
        dispatch(setSelectedFolder(folderId));
    };

    const deleteSnippetHandler = (id) => {
        dispatch(deleteSnippet(id));
    };

    const handlePlayVideo = (thisCall, status) => {
        if (thisCall.id !== 0) {
            setCall(thisCall);
        }
        setShowVideoPlayer(status);
    };
    const getMediaHandler = (mediaId, status) => {
        const activeMedia = uploads.media.find((item) => item.id === mediaId);
        setUri(activeMedia.media);
        const temp = checkFileType(activeMedia.file_type);
        if (temp === "audio" || temp === "video") setShowVideoPlayer(status);
        else window.open(activeMedia.media, "_blank");
    };

    const getSnippetHandler = (mediaId, status) => {
        const activeSnippets = meetings.snippets.find(
            (item) => item.id === mediaId
        );
        setUri(activeSnippets.media);
        setShowVideoPlayer(status);
    };

    // const updateCallProgress = (progress) => {
    //     setUploadProgress({
    //         value: progress,
    //         isError: false,
    //     });
    // };

    // -------------- useEffects ---------
    useEffect(() => {
        dispatch(getCategories());
    }, []);

    useEffect(() => {
        if (!!selectedFolder) {
            // console.log("Running")
            dispatch(storeMeetings([]));
            dispatch(getMeetings(selectedFolder));
            dispatch(getUploads(selectedFolder));
        }
    }, [selectedFolder]);

    return (
        <LibraryContext.Provider value={intialState}>
            <NewLibraryView
                categories={categories}
                createFolder={createFolder}
                handleSelectFolder={handleSelectFolder}
                meetings={meetings}
                uploads={uploads}
                handlePlayVideo={handlePlayVideo}
                deleteSnippetHandler={deleteSnippetHandler}
                updateFolderName={updateFolderName}
                uploadMedia={uploadMedia}
                // updateCallProgress={updateCallProgress}
                selectedFolder={selectedFolder}
                // uploadProgress={uploadProgress}
                deleteUploads={deleteUploads}
                deleteFolder={deleteFolder}
                getMediaHandler={getMediaHandler}
                getSnippetHandler={getSnippetHandler}
            />
            {showVideoPlayer && (
                <LibraryPlayer
                    id={call.id}
                    showVideoPlayer={showVideoPlayer}
                    handlePlayVideo={handlePlayVideo}
                    start_time={call.start_time}
                    end_time={call.end_time}
                    uri={uri}
                />
            )}
        </LibraryContext.Provider>
    );
}

export default NewLibraryContainer;
