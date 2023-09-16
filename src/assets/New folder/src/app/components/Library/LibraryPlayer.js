import React, { useEffect, useRef, useState } from "react";
import { Modal } from "antd";
import ShakaPlayer from "../ShakaPlayer/ShakaPlayer";
import { getCallMedia } from "@apis/individual/index";
import { useSelector } from "react-redux";
import apiErrors from "@apis/common/errors";
import { secondsToTime } from "@tools/helpers";

export default function LibraryPlayer({
    id,
    showVideoPlayer,
    handlePlayVideo,
    start_time,
    end_time,
    uri,
}) {
    const domain = useSelector((state) => state.common.domain);
    const [mediaUri, setMediaUri] = useState(false);
    const [playedDuration, setPlayedDuration] = useState(0);
    // const [showUI, setShowUI] = useState(true);

    const playerRef = useRef(null);

    useEffect(() => {
        if (!uri) {
            getCallMedia(domain, id)?.then((res) => {
                if (res.status !== apiErrors.AXIOSERRORSTATUS) {
                    setMediaUri(res.location);
                }
            });
        } else setMediaUri(uri);
        return () => {
            setMediaUri("");
        };
    }, []);

    const playerHandler = {
        onProgress: (time) => {
            setPlayedDuration(time);
        },
    };

    // useEffect(() => {
    //     if (playedDuration >= end_time) {
    //         playerRef.current.pause();
    //         playerRef.current.currentTime = start_time;
    //     }
    // }, [playedDuration, playerRef.current]);
    return (
        <Modal
            visible={showVideoPlayer}
            title={""}
            className="libplayer modal"
            onOk={() => handlePlayVideo({ id: 0 }, false)}
            onCancel={() => handlePlayVideo({ id: 0 }, false)}
            footer={null}
        >
            <div className="player">
                {/* <div className="stats">
                    <p>
                        {secondsToTime(playedDuration)}/
                        {secondsToTime(end_time)}
                    </p>
                </div> */}
                <ShakaPlayer
                    {...playerHandler}
                    videoRef={playerRef}
                    uri={mediaUri}
                    // startTime={start_time}
                    playOnLoad={true}
                    // callId={id}
                />
            </div>
        </Modal>
    );
}
