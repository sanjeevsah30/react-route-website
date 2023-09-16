import { useEffect, useState } from "react";

const useRecorder = (options) => {
    const [audioURL, setAudioURL] = useState(undefined);
    const [status, setStatus] = useState("idle");
    const [recorder, setRecorder] = useState(null);
    const [stream, setStream] = useState(null);

    useEffect(() => {
        // Lazily obtain recorder first time we're recording.
        const handleData = (e) => {
            if (status === "stopped") {
                setAudioURL(e.data || null);
            }
        };
        if (recorder === null) {
            if (status === "recording") {
                requestRecorder(options)
                    .then(({ recorder, stream }) => {
                        setRecorder(recorder);
                        setStream(stream);
                    })
                    .catch((err) => setStatus("error"));
            }
            return;
        }
        if (
            recorder &&
            status === "recording" &&
            (recorder.state !== "recording" || recorder.state === "inactive")
        ) {
            recorder?.start();
        } else if (
            recorder.state !== "inactive" &&
            (status === "stopped" || status === "deleted")
        ) {
            recorder.stream.getTracks().forEach((track) => track.stop());
            recorder.stop();
            recorder.removeEventListener("dataavailable", handleData);
            setStatus("idle");
            setRecorder(null);
        } else if (recorder.state === "inactive" && status === "stopped") {
            recorder.stream.getTracks().forEach((track) => track.stop());
            // recorder.stop();
            recorder.removeEventListener("dataavailable", handleData);
            setStatus("idle");
            setRecorder(null);
        }

        recorder.addEventListener("dataavailable", handleData);
        return () => {
            // recorder.removeEventListener('dataavailable', handleData);
            recorder.stream.getTracks().forEach((track) => track.stop());
            setRecorder(null);
        };
    }, [recorder, status]);

    const startRecording = () => {
        setStatus("recording");
    };

    const stopRecording = () => {
        setStatus("stopped");
    };
    const deleteRecording = () => {
        setStatus("deleted");
    };

    return {
        audioURL,
        status,
        startRecording,
        stopRecording,
        deleteRecording,
        stream,
    };
};

async function requestRecorder(options) {
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        ...options,
    });
    return { recorder: new MediaRecorder(stream), stream };
}
export default useRecorder;
