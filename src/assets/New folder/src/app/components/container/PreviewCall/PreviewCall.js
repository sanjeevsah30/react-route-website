import React, { useRef, useState, useEffect } from "react";
import { isEmpty } from "lodash";
import PreviewCallUI from "@presentational/PreviewCallUI";
import PreviewError from "@presentational/PreviewCallUI/PreviewError";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { getSharedMeeting, getSharedMeetingMedia } from "@apis/sharer";
import apiErrors from "@apis/common/errors";
import { openNotification } from "@store/common/actions";
import { FallbackUI } from "@presentational/reusables/index";
import { checkAuth } from "@store/auth/actions";

function PreviewCall(props) {
    const dispatch = useDispatch();
    const previewRef = useRef(null);
    const domain = useSelector((state) => state.common.domain);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [loading, setloading] = useState(true);
    const [mediaUri, setMediaUri] = useState("");
    const [playedDuration, setPlayedDuration] = useState(0);
    const [meeting, setMeeting] = useState({});
    const [mediaStartTime, setMediaStartTime] = useState(0);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        dispatch(checkAuth());
        let query = props.location.search.substring(1);
        let params = {};
        if (query) {
            params = JSON.parse(
                '{"' +
                    decodeURI(query)
                        .replace(/"/g, '\\"')
                        .replace(/&/g, '","')
                        .replace(/=/g, '":"') +
                    '"}'
            );
        }
        if (params.id || params.share_id) {
            getSharedMeeting(domain, params.id || params.share_id).then(
                (res) => {
                    if (res.status === apiErrors.AXIOSERRORSTATUS) {
                        openNotification("error", "Error", res.message);
                    } else if (res.expired) {
                        setIsExpired(true);
                    } else {
                        setMeeting(res);
                    }
                    setloading(false);
                }
            );
            getSharedMeetingMedia(domain, params.id || params.share_id).then(
                (res) => {
                    if (res.status !== apiErrors.AXIOSERRORSTATUS) {
                        setMediaStartTime(res.start_time || 0);
                        setMediaUri(res.location);
                    }
                }
            );
        }
    }, []);
    useEffect(() => {
        if (isAuthenticated && !isEmpty(meeting) && mediaUri) {
            window.location.href = `/call/${meeting.meeting_json.id}?start_time=${mediaStartTime}`;
        }
    }, [isAuthenticated, meeting, mediaUri]);

    const playerHandlers = {
        seekToPoint: (time, seeknplay) => {
            if (previewRef.current) {
                time = Math.floor(time);
                previewRef.current.currentTime = time;
                if (seeknplay) {
                    previewRef.current.play();
                }
            }
        },
        onProgress: (duration) => {
            setPlayedDuration(duration);
        },
    };

    return (
        <>
            {loading ? (
                <FallbackUI />
            ) : (
                <>
                    {Object.keys(meeting).length ? (
                        <PreviewCallUI
                            previewRef={previewRef}
                            playerHandlers={playerHandlers}
                            mediaUri={mediaUri}
                            meeting={meeting}
                            playedDuration={playedDuration}
                            mediaStartTime={mediaStartTime}
                        />
                    ) : (
                        <PreviewError
                            title={
                                isExpired
                                    ? "Sorry, this link is no longer valid."
                                    : "Sorry, the meeting you were looking for does not exist."
                            }
                        />
                        // <Result
                        //     status="404"
                        //     title="404"
                        //     subTitle={

                        //     }
                        //     extra={
                        //         <Link to={routes.HOME}>
                        //             <Button type="primary">Back Home</Button>
                        //         </Link>
                        //     }
                        // />
                    )}
                </>
            )}
        </>
    );
}

export default withRouter(PreviewCall);
