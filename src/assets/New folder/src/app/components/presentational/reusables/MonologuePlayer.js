import { fetchCallMedia } from "@store/search/actions";
import { secondsToTime } from "@tools/helpers";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShakaPlayer from "../../ShakaPlayer/ShakaPlayer";

export default function MonologuePlayer({
    id,
    start_time,
    end_time,
    autoPlay,
}) {
    const dispatch = useDispatch();
    const searchUrls = useSelector((state) => state.search.searchUrls);
    const [mediaUri, setMediaUri] = useState("");
    const [playedDuration, setPlayedDuration] = useState(0);

    const playerRef = useRef(null);

    useEffect(() => {
        if (!searchUrls[id]) {
            dispatch(fetchCallMedia(id));
        } else {
            setMediaUri(searchUrls[id]);
        }
    }, [id, searchUrls[id]]);

    const playerHandler = {
        onProgress: (time) => {
            setPlayedDuration(time);
        },
    };

    useEffect(() => {
        if (playedDuration >= end_time) {
            playerRef.current.pause();
            playerRef.current.currentTime = start_time;
        }
    }, [playedDuration, playerRef.current]);
    return (
        <div className="monologue_player">
            <div className="stats">
                <p>
                    {secondsToTime(playedDuration)}/{secondsToTime(end_time)}
                </p>
            </div>
            <ShakaPlayer
                {...playerHandler}
                videoRef={playerRef}
                uri={mediaUri}
                startTime={start_time}
                playOnLoad={autoPlay}
                callId={id}
            />
        </div>
    );
}

MonologuePlayer.defaultProps = {
    autoPlay: false,
    onPlayerLoad: () => {},
};
