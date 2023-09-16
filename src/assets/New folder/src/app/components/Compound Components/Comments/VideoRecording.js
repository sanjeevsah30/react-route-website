import PlayOutlineSvg from "../../../static/svg/PlayOutlineSvg";
import { Modal } from "antd";
import { useContext, useState } from "react";
import "./videorecording.scss";
import { AuditRecordContext } from "@container/Home/Home";

const VideoRecording = ({ src, deleteRecording, hideClose = false }) => {
    const [modalVisible, isModalVisible] = useState(false);
    const { playerRef } = useContext(AuditRecordContext);
    return (
        <div
            className="video_recording_container"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="video_container">
                {hideClose || (
                    <div
                        onClick={deleteRecording}
                        className="close_svg curPont"
                    >
                        x
                    </div>
                )}

                <PlayOutlineSvg
                    className="play_svg"
                    onClick={() => {
                        playerRef?.current?.pause();
                        isModalVisible(true);
                    }}
                />
                <video key={src} width="100%">
                    <source src={src} type="video/mp4" />
                    Sorry, your browser doesn't support embedded videos.
                </video>
            </div>
            <Modal
                visible={modalVisible}
                onCancel={() => isModalVisible(false)}
                footer={null}
                destroyOnClose={true}
                centered
                width="500px"
                style={{
                    top: "20%",
                    right: "-25%",

                    borderRadius: "12px",
                }}
                className="video_recording_modal"
            >
                <video
                    controls
                    key={src}
                    width="100%"
                    height="268px"
                    // poster={
                    //     require('../../../static/images/player_poster.png')
                    //         .default
                    // }
                >
                    <source src={src} type="video/mp4" />
                    Sorry, your browser doesn't support embedded videos.
                </video>
            </Modal>
        </div>
    );
};

export default VideoRecording;
