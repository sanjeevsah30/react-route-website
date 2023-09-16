import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "antd";
import ShakaPlayer from "../../../../ShakaPlayer/ShakaPlayer";
import SpeakerHeatMaps from "../../../../AddToLibrary/SpeakerHeatmaps";
import {
    getTranscript,
    initializeIndividualCall,
} from "@store/individualcall/actions";
import { verifyInternalCoachingClip } from "@store/internalCoachingSlice/internalCoachingSlice";

export default function PendingModal({
    showModal,
    handleShowModel,
    activeClip,
}) {
    const activeCall = activeClip?.meeting;
    const mediaUri = activeClip?.media;
    const callName = activeCall?.title;
    const totalLength = activeClip?.end_time - activeClip?.start_time;
    const is_verified = activeClip?.status === "Verified";
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (activeCall) {
            dispatch(initializeIndividualCall(activeCall?.id));
            dispatch(getTranscript(activeCall?.id)).then(() =>
                setIsLoading(false)
            );
        }
    }, [activeCall]);

    const monologues = useSelector(
        (state) => state.individualcall[activeCall?.id]?.monologues
    );
    const pendingModalPlayerRef = useRef(null);
    const [selectedTimeline, setSelectedTimeline] = useState([0, totalLength]);
    const pendingModalHandler = {
        handleSubmit: ({ status }) => {
            dispatch(
                verifyInternalCoachingClip({
                    id: activeClip?.id,
                    payload: {
                        start_time: (
                            activeClip?.start_time + selectedTimeline[0]
                        ).toFixed(5),
                        end_time: (
                            activeClip?.start_time + selectedTimeline[1]
                        ).toFixed(5),
                        status: status,
                    },
                })
            );
            handleShowModel();
        },

        handleTimelinePortion: (value) => {
            setSelectedTimeline(value);
        },
    };

    const playerHandler = {
        seekTo: (time) => {
            if (pendingModalPlayerRef.current) {
                pendingModalPlayerRef.current.currentTime = time;
                pendingModalPlayerRef.current.play();
                const controlsContainerEl = document.querySelector(
                    ".pendingModal_player .shaka-controls-container"
                );
                controlsContainerEl &&
                    !controlsContainerEl.hasAttribute("shown") &&
                    controlsContainerEl.setAttribute("shown", true);
            }
        },
    };

    return (
        <Modal
            visible={showModal}
            style={{ top: 20 }}
            title={callName}
            className="addToLib modal"
            onCancel={handleShowModel}
            footer={
                is_verified ? (
                    <Button
                        type="primary"
                        onClick={() =>
                            pendingModalHandler.handleSubmit({
                                status: "In_Review",
                            })
                        }
                    >
                        Pending
                    </Button>
                ) : (
                    <Button
                        type="primary"
                        onClick={() =>
                            pendingModalHandler.handleSubmit({
                                status: "Verified",
                            })
                        }
                    >
                        Save
                    </Button>
                )
            }
            width={770}
        >
            <div>
                <ShakaPlayer
                    onProgress={playerHandler.onProgress}
                    videoRef={pendingModalPlayerRef}
                    uri={mediaUri}
                    callId={activeCall.id}
                    customClass="pendingModal_player"
                />
                {!isLoading && !is_verified && (
                    <div className="details">
                        <SpeakerHeatMaps
                            monologues={monologues}
                            totalLength={totalLength}
                            handleChange={
                                pendingModalHandler.handleTimelinePortion
                            }
                            seekPlayerTo={playerHandler.seekTo}
                            duration={selectedTimeline}
                        />
                    </div>
                )}
            </div>
        </Modal>
    );
}
