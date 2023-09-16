/*
importing dependencies and CSS file(s) required for UI customization
*/
import { getCallMedia, handleDownloadVideo } from "@apis/individual/index";
import PersuasionTag from "@presentational/reusables/PersuasionTag";
import { openNotification } from "@store/common/actions";
import { Button, Tooltip } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import "shaka-player/dist/controls.css";
import CompressSvg from "app/static/svg/CompressSvg";
import ExpandSvg from "app/static/svg/ExpandSvg";
import "./player.scss";
const shaka = require("shaka-player/dist/shaka-player.ui.js");

const ShakaPlayer = ({
    uri,
    videoRef,
    seekTime,
    onProgress,
    onEnded,
    onDuration,
    onPlayerLoad,
    startTime,
    playOnLoad,
    callId,
    subtitles,
    customClass,
    showCompressToggle,
    callName,
    showTagTranscripts,
}) => {
    const timerRef = useRef(0);
    const domain = useSelector((state) => state.common.domain);
    const videoComponent = videoRef;
    const videoContainer = useRef(null);
    const [retryCount, setRetryCount] = useState(0);
    const [isCompressed, setIsCompressed] = useState(false);
    const [showNewTooltip, setShowNewTooltip] = useState(false);
    const onErrorEvent = (evt) => {
        onError(evt.detail);
    };

    const onError = (error) => {
        console.error("Error code", error.code, "object", error);
        // https://shaka-player-demo.appspot.com/docs/api/shaka.util.Error.html
        if (error.code === 3016 && error.category === 3 && callId) {
            setRetryCount((c) => c + 1);
        }
    };

    const pauseHandler = () => videoComponent.current?.pause();

    useEffect(() => {
        // window.addEventListener('focus', () => videoComponent.current.play())
        if (window.location.pathname.includes("coaching"))
            window.addEventListener("blur", pauseHandler);
        else window.removeEventListener("blur", pauseHandler);
    }, [window.location.pathname]);

    useEffect(() => {
        if (showTagTranscripts && !isCompressed) {
            handleMiniPlayer();
        }
    }, [showTagTranscripts]);

    useEffect(() => {
        if (retryCount !== 0)
            if (retryCount < 4) {
                getCallMedia(domain, callId).then((res) => {
                    if (res.location && videoComponent.current) {
                        videoComponent.current.src = uri;
                    }
                });
            } else {
                openNotification(
                    "error",
                    "Player Error!",
                    "Player has encountered an error. Please try refreshing the page."
                );
            }
    }, [retryCount]);

    const seekToPoint = (time) => {
        videoComponent.current.currentTime = time;
    };

    useEffect(() => {
        if (seekTime !== -1 && videoComponent.current) {
            seekToPoint(seekTime);
        }
    }, [seekTime]);

    useEffect(() => {
        if (uri) {
            //Link to MPEG-DASH video
            var manifestUri = uri || "";

            //Getting reference to video and video container on DOM
            const video = videoComponent.current;
            const videoContainerRef = videoContainer.current;

            //Initialize shaka player
            var player = new shaka.Player(video);
            shaka.name = callName;

            //Setting UI configuration JSON object
            const uiConfig = {};

            uiConfig["overflowMenuButtons"] = [
                "playback_rate",
                "quality",
                // 'picture_in_picture',
            ];
            uiConfig["addBigPlayButton"] = true;
            uiConfig["controlPanelElements"] = [
                "time_and_duration",
                "play_pause",
                "spacer",
                "mute",
                "volume",
                "fullscreen",
                "picture_in_picture",
            ];

            uiConfig["seekBarColors"] = {
                // Replace the colors with the color(s) you want
                base: " #FFFFFF33",
                buffered: "rgba(255, 255, 255, 0.54)",
                played: "#1A62F2",
            };

            if (subtitles) {
                uiConfig["controlPanelElements"].push("Subtitles");
            }

            uiConfig["controlPanelElements"].push("Download");

            uiConfig["controlPanelElements"].push("overflow_menu");

            //Setting up shaka player UI
            const ui = new shaka.ui.Overlay(player, videoContainerRef, video);

            ui.configure(uiConfig); //configure UI
            ui.getControls();

            // Listen for error events.
            player.addEventListener("error", onErrorEvent);

            // Try to load a manifest.
            // This is an asynchronous process.
            player
                .load(manifestUri, startTime)
                .then(function () {
                    onPlayerLoad();
                })
                .catch(onError); // onError is executed if the asynchronous load fails.

            video.addEventListener("timeupdate", (event) => {
                onProgress(video.currentTime);
            });
            video.addEventListener("ended", (event) => {
                onEnded(video.ended);
            });
            video.addEventListener("loadedmetadata", function () {
                if (playOnLoad) {
                    video.play();
                }
                onDuration(video.duration);
            });
        }
        return () => {
            if (player) {
                player.unload();
                player.destroy();
            }
        };
    }, [uri]);

    const handleMiniPlayer = () => {
        const controlsContainerEl = videoContainer.current.querySelector(
            ".shaka-controls-container"
        );
        if (!isCompressed) {
            timerRef.current = setInterval(() => {
                !controlsContainerEl?.hasAttribute("shown") &&
                    controlsContainerEl?.setAttribute("shown", true);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        setIsCompressed((prev) => !prev);
        videoContainer.current.classList.toggle("miniPlayer");
    };

    useEffect(() => {
        const LS_KEY_NEwTOOLTIP = "NEW_TOOLTIP";
        const count = localStorage.getItem(LS_KEY_NEwTOOLTIP);
        if (!count || parseInt(count) < 3) {
            localStorage.setItem(
                LS_KEY_NEwTOOLTIP,
                count ? parseInt(count) + 1 : 1
            );
            setShowNewTooltip(true);
            setTimeout(() => {
                setShowNewTooltip(false);
            }, 10000);
        }
    }, [showCompressToggle]);

    const PlayerTooltip = (
        <div className="player__tooltip">
            <PersuasionTag label="New" />
            <span className="bold600 marginL4">Minimize the player</span>
            <button onClick={() => setShowNewTooltip(false)}>
                <CloseOutlined />
            </button>
        </div>
    );

    const {
        common: { versionData },
    } = useSelector((state) => state);

    return (
        <div className={`video-container ${customClass}`} ref={videoContainer}>
            {showCompressToggle && (
                <Tooltip
                    placement="right"
                    title={PlayerTooltip}
                    visible={showNewTooltip}
                    color="purple"
                >
                    <Button
                        icon={isCompressed ? <ExpandSvg /> : <CompressSvg />}
                        className="player_expCom"
                        onClick={handleMiniPlayer}
                    />
                </Tooltip>
            )}
            <video
                className="shaka-video"
                ref={videoComponent}
                poster={
                    versionData?.logo ? (
                        <></>
                    ) : (
                        require("../../static/images/player_poster.png").default
                    )
                }
                autoPlay={!!startTime}
                crossOrigin="anonymous"
                id="asset-uri-input"
            >
                {subtitles && (
                    <track
                        default
                        kind="captions"
                        srcLang="en"
                        src={subtitles}
                        type="text/vtt"
                    />
                )}
            </video>
        </div>
    );
};

ShakaPlayer.defaultProps = {
    seekTime: -1,
    stopAt: -1,
    onProgress: () => {},
    onEnded: () => {},
    onDuration: () => {},
    onPlayerLoad: () => {},
    selectedTimeline: [0, -1],
    startTime: 0,
    playOnLoad: false,
    reloadUri: () => {},
};

ShakaPlayer.Subtitles = class extends shaka.ui.Element {
    constructor(parent, controls) {
        super(parent, controls);

        // The actual button that will be displayed
        this.button_ = document.createElement("button");
        this.button_.textContent = "CC";
        this.button_.classList.add("subtitles");
        this.parent.appendChild(this.button_);

        // Listen for clicks on the button to start the next playback
        this.eventManager.listen(this.button_, "click", () => {
            let video = document.querySelector(".main_player .shaka-video");
            if (!video) {
                return;
            }
            if (this.button_.classList.contains("disabled")) {
                this.button_.classList.remove("disabled");
                video.textTracks[0].mode = "showing";
            } else {
                this.button_.classList.add("disabled");
                video.textTracks[0].mode = "hidden";
            }
        });
    }
};

ShakaPlayer.Download = class extends shaka.ui.Element {
    constructor(parent, controls) {
        super(parent, controls);
        // The actual button that will be displayed
        this.button_ = document.createElement("button");
        this.button_.textContent = "Download";
        this.button_.classList.add("download");
        this.button_.innerHTML = `<svg width="23" height="19" viewBox="0 0 23 19" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M2.81856 11.4168C2.81856 12.4569 2.81856 13.497 2.81856 14.5371C2.81856 14.7575 2.81591 14.9751 2.84237 15.1955C2.82914 15.1015 2.81591 15.0047 2.80533 14.9106C2.83972 15.1498 2.90321 15.3837 2.9958 15.6067C2.96141 15.5207 2.92437 15.4347 2.88998 15.3487C2.98257 15.5664 3.10161 15.768 3.24446 15.9561C3.18891 15.8835 3.13336 15.811 3.0778 15.7384C3.21536 15.9131 3.3688 16.0717 3.54339 16.2114C3.47196 16.155 3.40054 16.0985 3.32911 16.0421C3.51429 16.1872 3.71269 16.3082 3.92697 16.4022C3.84231 16.3673 3.75766 16.3297 3.67301 16.2947C3.89257 16.3888 4.12272 16.4533 4.35816 16.4882C4.26557 16.4748 4.17034 16.4614 4.07775 16.4506C4.3079 16.4802 4.53804 16.4748 4.77083 16.4748C5.12002 16.4748 5.47185 16.4748 5.82104 16.4748C7.01674 16.4748 8.21244 16.4748 9.40815 16.4748C10.8684 16.4748 12.3286 16.4748 13.7889 16.4748C15.0375 16.4748 16.2861 16.4748 17.5347 16.4748C18.1061 16.4748 18.6775 16.4775 19.2489 16.4748C19.3732 16.4748 19.5002 16.4667 19.6245 16.4506C19.5319 16.4641 19.4367 16.4775 19.3441 16.4882C19.5795 16.4533 19.8097 16.3888 20.0293 16.2947C19.9446 16.3297 19.86 16.3673 19.7753 16.4022C19.9896 16.3082 20.188 16.1872 20.3732 16.0421C20.3017 16.0985 20.2303 16.155 20.1589 16.2114C20.3308 16.0717 20.4869 15.9158 20.6245 15.7384C20.5689 15.811 20.5134 15.8835 20.4578 15.9561C20.6007 15.768 20.7197 15.5664 20.8123 15.3487C20.7779 15.4347 20.7409 15.5207 20.7065 15.6067C20.7991 15.3837 20.8625 15.1498 20.8969 14.9106C20.8837 15.0047 20.8705 15.1015 20.8599 15.1955C20.9181 14.7467 20.8837 14.2737 20.8837 13.8222C20.8837 13.1745 20.8837 12.5241 20.8837 11.8764C20.8837 11.7232 20.8837 11.57 20.8837 11.4168C20.8837 10.8551 21.3705 10.3149 21.9419 10.3418C22.5159 10.3687 23 10.8148 23 11.4168C23 12.379 23 13.3411 23 14.3059C23 14.8703 23.0026 15.4347 22.8228 15.9776C22.6376 16.5393 22.3439 17.0473 21.9392 17.4746C21.5345 17.9019 21.0477 18.1922 20.5081 18.4045C19.8652 18.6598 19.1748 18.6275 18.4976 18.6275C17.6326 18.6275 16.7649 18.6275 15.8999 18.6275C14.7042 18.6275 13.5085 18.6275 12.3127 18.6275C11.08 18.6275 9.84992 18.6275 8.61719 18.6275C7.64105 18.6275 6.66755 18.6275 5.69142 18.6275C5.2761 18.6275 4.86078 18.6302 4.44546 18.6275C3.43228 18.6222 2.41647 18.1975 1.72603 17.437C1.06469 16.7113 0.702272 15.7733 0.702272 14.787C0.702272 13.7657 0.702272 12.7445 0.702272 11.7232C0.702272 11.6238 0.702272 11.5216 0.702272 11.4222C0.702272 10.8605 1.18902 10.3203 1.76042 10.3472C2.33446 10.3687 2.81856 10.8148 2.81856 11.4168Z" fill="white"/>
           <path d="M12.9071 0.921718C12.9071 1.29928 12.9071 1.67455 12.9071 2.05212C12.9071 2.95229 12.9071 3.85246 12.9071 4.75494C12.9071 5.8485 12.9071 6.93976 12.9071 8.03332C12.9071 8.97493 12.9071 9.91655 12.9071 10.8582C12.9071 11.3163 12.9151 11.7745 12.9071 12.2326C12.9071 12.2395 12.9071 12.2464 12.9071 12.2533C12.9071 12.7345 12.4204 13.1972 11.849 13.1742C11.2749 13.1512 10.7908 12.769 10.7908 12.2533C10.7908 11.8757 10.7908 11.5005 10.7908 11.1229C10.7908 10.2227 10.7908 9.32257 10.7908 8.4201C10.7908 7.32653 10.7908 6.23527 10.7908 5.14171C10.7908 4.2001 10.7908 3.25849 10.7908 2.31687C10.7908 1.85873 10.7829 1.40058 10.7908 0.942438C10.7908 0.935532 10.7908 0.928625 10.7908 0.921718C10.7908 0.440551 11.2776 -0.0221977 11.849 0.000824657C12.423 0.023847 12.9071 0.406018 12.9071 0.921718Z" fill="white"/>
           <path d="M11.1009 12.9015C10.5903 12.4571 10.0824 12.0151 9.57186 11.5708C8.75973 10.864 7.94759 10.1572 7.13281 9.4481C6.94499 9.28464 6.75981 9.12348 6.57199 8.96002C6.18047 8.61929 6.15137 7.99309 6.57199 7.65696C6.99525 7.31853 7.65131 7.29321 8.06928 7.65696C8.57984 8.10129 9.08775 8.54332 9.59831 8.98765C10.4104 9.69444 11.2226 10.4012 12.0374 11.1103C12.2252 11.2738 12.4104 11.4349 12.5982 11.5984C12.9897 11.9391 13.0188 12.5653 12.5982 12.9015C12.1749 13.2376 11.5189 13.2652 11.1009 12.9015Z" fill="white"/>
           <path d="M11.1004 11.6001C11.6109 11.1558 12.1188 10.7137 12.6294 10.2694C13.4415 9.56263 14.2537 8.85584 15.0684 8.14676C15.2563 7.9833 15.4414 7.82214 15.6293 7.65868C16.0208 7.31795 16.7403 7.29263 17.1265 7.65868C17.5154 8.02704 17.5445 8.59799 17.1265 8.96175C16.616 9.40608 16.1081 9.8481 15.5975 10.2924C14.7854 10.9992 13.9732 11.706 13.1585 12.4151C12.9707 12.5786 12.7855 12.7397 12.5977 12.9032C12.2061 13.2439 11.4866 13.2692 11.1004 12.9032C10.7141 12.5348 10.6824 11.9639 11.1004 11.6001Z" fill="white"/>
           </svg>
           `;
        this.parent.appendChild(this.button_);

        // Listen for clicks on the button to start the next playback
        this.eventManager.listen(this.button_, "click", () => {
            const manifestUri = document.getElementById("asset-uri-input");
            // const extension = manifestUri.src.split('.').slice(-1);
            const link = document.createElement("a");
            // manifestUri.src && handleDownloadVideo(manifestUri.src);
            link.href = manifestUri.src;
            // link.setAttribute('download', `${shaka.name}.${extension}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
};

// Factory that will create a button at run time.
ShakaPlayer.Download.Factory = class {
    create(rootElement, controls) {
        return new ShakaPlayer.Download(rootElement, controls);
    }
};

shaka.ui.Controls.registerElement(
    /* This name will serve as a reference to the button in the UI configuration object */ "Download",
    new ShakaPlayer.Download.Factory()
);

// Factory that will create a button at run time.
ShakaPlayer.Subtitles.Factory = class {
    create(rootElement, controls) {
        return new ShakaPlayer.Subtitles(rootElement, controls);
    }
};

// Register our factory with the controls, so controls can create button instances.
shaka.ui.Controls.registerElement(
    /* This name will serve as a reference to the button in the UI configuration object */ "Subtitles",
    new ShakaPlayer.Subtitles.Factory()
);

export default ShakaPlayer;
