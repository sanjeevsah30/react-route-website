import { useContext, useEffect, useRef, useState } from "react";
import { secondsToTime } from "../../../../tools/helpers";
import { DeleteOutlined, PauseOutlined } from "@ant-design/icons";
import WaveSurfer from "wavesurfer.js";
import PlayBorderSvg from "../../../static/svg/PlayBorderSvg";
import { AuditRecordContext } from "@container/Home/Home";

const AudioRecording = ({ url, deleteRecording, showDelete = true }) => {
    const [waveform, setWaveform] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [duration, setDuration] = useState("00:00");
    const waveformRef = useRef(null);

    const { playerRef } = useContext(AuditRecordContext);

    useEffect(() => {
        setWaveform(
            WaveSurfer.create({
                barWidth: 3,
                barRadius: 3,
                barGap: 2,
                barMinHeight: 3,
                cursorWidth: 1,
                container: waveformRef?.current,
                backend: "WebAudio",
                height: 30,
                progressColor: "#1A62F2",
                responsive: true,
                waveColor: "#99999933",
                cursorColor: "transparent",
                scrollParent: true,
            })
        );
    }, []);

    useEffect(() => {
        if (waveform) {
            waveform.on("finish", () => {
                setPlaying(false);
            });
            waveform.on("ready", () => {
                setDuration(secondsToTime(waveform.getDuration()));
            });
        }
        return () => {
            if (waveform) {
                waveform.un("finish");
                waveform.un("ready");
            }
        };
    }, [waveform]);

    useEffect(() => {
        if (waveform) {
            loadWaveform();
        }
    }, [waveform, url]);

    const loadWaveform = () => {
        if (waveform) {
            waveform.drawBuffer();
            waveform.load(url);
        }
    };

    const handlePlay = () => {
        playerRef?.current?.pause();
        setPlaying(!playing);
        waveform?.playPause();
    };

    return (
        <div className="audio_recording_container">
            {showDelete && (
                <div className="delete_svg">
                    <DeleteOutlined
                        onClick={() => {
                            waveform?.stop();
                            deleteRecording();
                        }}
                    />
                </div>
            )}

            {playing ? (
                <PauseOutlined onClick={handlePlay} />
            ) : (
                <PlayBorderSvg onClick={handlePlay} />
            )}
            <div className="audio_recording">
                <div className="waveform_container">
                    <div ref={waveformRef} />
                </div>
            </div>
            <div className="comment_duration">{duration}</div>
        </div>
    );
};

export default AudioRecording;
