import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Select, Input } from "antd";
import { Error } from "@reusables";
import config from "@constants/IndividualCall";
import { PlusOutlined } from "@ant-design/icons";
import {
    // getCategories,
    addNewMeeting,
    // createCategory,
} from "@store/library/actions";
import { getCategories, createCategory } from "@store/library/librarySlice";
import SpeakerHeatMaps from "./SpeakerHeatmaps";
import ShakaPlayer from "../ShakaPlayer/ShakaPlayer";

const { Option } = Select;
const { TextArea } = Input;

export default function AddToLibrary({
    activeCall,
    showAddToLib,
    handleShowAddToLib,
    totalLength,
    monologues,
    mediaUri,
    callName,
}) {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.librarySlice.categories);

    const addToLibPlayerRef = useRef(null);
    const [formValues, setformValues] = useState({
        Folder: {
            touched: false,
            error: false,
            value: "",
            errorMsg: "",
        },
        Note: {
            touched: false,
            error: false,
            value: "",
            errorMsg: "",
        },
    });

    const [selectedFolder, setSelectedFolder] = useState(undefined);
    const [newFolder, setNewFolder] = useState("");
    const [creatingFolder, setCreatingFolder] = useState(false);
    const [selectedTimeline, setSelectedTimeline] = useState([0, totalLength]);
    // const [playedDuration, setPlayedDuration] = useState(0);

    useEffect(() => {
        dispatch(getCategories());
    }, []);

    const addToLibHandler = {
        validateField: (name) => {
            if (!formValues[name].value) {
                setformValues({
                    ...formValues,
                    [name]: {
                        ...formValues[name],
                        error: true,
                        errorMsg: `${name} is required`,
                    },
                });
                return false;
            } else {
                setformValues({
                    ...formValues,
                    [name]: {
                        ...formValues[name],
                        error: false,
                        errorMsg: "",
                    },
                });
            }
            return true;
        },
        validateForm: () => {
            for (const key of Object.keys(formValues)) {
                if (!addToLibHandler.validateField(key)) {
                    return false;
                }
            }
            return true;
        },
        handleSubmit: () => {
            if (addToLibHandler.validateForm()) {
                dispatch(
                    addNewMeeting(
                        {
                            startTime: selectedTimeline[0],
                            stopAt: selectedTimeline[1],
                        },
                        formValues,
                        activeCall.callDetails
                    )
                );
                setTimeout(() => {
                    handleShowAddToLib();
                }, 1000);
            }
        },
        handleChange: (value, type) => {
            setformValues({
                ...formValues,
                [type]: {
                    ...formValues[type],
                    value: value,
                    touched: true,
                },
            });
            if (type === "Folder") {
                setSelectedFolder(value);
            }
        },
        handleCreateFolder: () => {
            setCreatingFolder(true);
            dispatch(createCategory(newFolder)).then((res) => {
                if (!res.status) {
                    setformValues({
                        ...formValues,
                        Folder: {
                            ...formValues.Folder,
                            value: res.id,
                            touched: true,
                        },
                    });
                    setSelectedFolder(res.id);
                    setNewFolder("");
                }
                setCreatingFolder(false);
            });
        },
        handleTimelinePortion: (value) => {
            setSelectedTimeline(value);
            // playerHandler.seekTo(value[0]);
        },
    };

    const playerHandler = {
        seekTo: (time) => {
            if (addToLibPlayerRef.current) {
                addToLibPlayerRef.current.currentTime = time;
                addToLibPlayerRef.current.play();
                const controlsContainerEl = document.querySelector(
                    ".addToLib_player .shaka-controls-container"
                );
                controlsContainerEl &&
                    !controlsContainerEl.hasAttribute("shown") &&
                    controlsContainerEl.setAttribute("shown", true);
            }
        },
        // onProgress: (time) => {
        //     setPlayedDuration(time);
        // },
    };

    // useEffect(() => {
    //     if (playedDuration >= selectedTimeline[1]) {
    //         addToLibPlayerRef.current.pause();
    //         addToLibPlayerRef.current.currentTime = selectedTimeline[0];
    //     }
    // }, [playedDuration, addToLibHandler.current]);

    return (
        <Modal
            visible={showAddToLib}
            style={{ top: 20 }}
            title={config.MODAL.TITLE}
            className="addToLib modal"
            onOk={handleShowAddToLib}
            onCancel={handleShowAddToLib}
            footer={null}
            width={1170}
        >
            {callName && (
                <p className="font20 text-bolder lineHightN marginT0 marginB16">
                    {callName}
                </p>
            )}
            <div className="player">
                <div className="player-video">
                    <ShakaPlayer
                        onProgress={playerHandler.onProgress}
                        videoRef={addToLibPlayerRef}
                        uri={mediaUri}
                        callId={activeCall.callId}
                        customClass="addToLib_player"
                    />
                    <div className="details">
                        <SpeakerHeatMaps
                            monologues={monologues}
                            totalLength={totalLength}
                            handleChange={addToLibHandler.handleTimelinePortion}
                            seekPlayerTo={playerHandler.seekTo}
                            duration={selectedTimeline}
                        />
                    </div>
                </div>
                <div className="form">
                    <div className="select-folder">
                        <div className="select-section">
                            <p className="form__item--title">Select Folder</p>
                            <Select
                                showSearch
                                className={
                                    formValues.Folder.error ? "error" : ""
                                }
                                name="Folder"
                                placeholder="Select folder/ Create folder"
                                value={selectedFolder}
                                onSearch={(val) => {
                                    setNewFolder(val);
                                }}
                                notFoundContent={
                                    <div
                                        style={{
                                            display: "flex",
                                            flexWrap: "nowrap",
                                        }}
                                    >
                                        <Button
                                            type={"link"}
                                            onClick={
                                                addToLibHandler.handleCreateFolder
                                            }
                                            loading={creatingFolder}
                                            icon={<PlusOutlined />}
                                        >
                                            Create New Folder
                                        </Button>
                                    </div>
                                }
                                onChange={(value) => {
                                    addToLibHandler.handleChange(
                                        value,
                                        "Folder"
                                    );
                                }}
                                onBlur={() =>
                                    addToLibHandler.validateField("Folder")
                                }
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {!!categories.length &&
                                    categories.map((category) => (
                                        <Option
                                            key={`${category.id}`}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </Option>
                                    ))}
                            </Select>
                            {formValues.Folder.error && (
                                <Error
                                    errorMessage={formValues.Folder.errorMsg}
                                />
                            )}
                        </div>
                    </div>
                    <div className="name-comment marginT28">
                        <p className="form__item--title">Enter Comment</p>
                        <TextArea
                            className={formValues.Note.error ? "error" : ""}
                            name="Note"
                            // value={value}
                            onChange={(e) => {
                                addToLibHandler.handleChange(
                                    e.target.value,
                                    "Note"
                                );
                            }}
                            placeholder="Write a comment..."
                            autoSize={{ minRows: 5, maxRows: 8 }}
                            onBlur={() => addToLibHandler.validateField("Note")}
                        />
                        {formValues.Note.error && (
                            <Error errorMessage={formValues.Note.errorMsg} />
                        )}
                    </div>
                    <div className="flex justifyEnd marginT18">
                        <Button
                            key="submit"
                            className={"create-folder"}
                            type="primary"
                            onClick={addToLibHandler.handleSubmit}
                            // shape={'round'}
                        >
                            Add to Library
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
