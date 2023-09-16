import { Component, createRef } from "react";
import WaveSurfer from "wavesurfer.js";
import { secondsToTime } from "../../../../tools/helpers";
import PlayOutlineSvg from "../../../static/svg/PlayOutlineSvg";
import { PauseOutlined } from "@ant-design/icons";
import { openNotification } from "../../../../store/common/actions";

export default class AudioComment extends Component {
    constructor(props) {
        super(props);
        this.waveformRef = createRef(null);
        this.state = {
            loading: false,
            playing: false,
            duration: "00:00",
        };
    }
    componentDidMount() {
        this.setState({ loading: true });
        this.waveform = WaveSurfer.create({
            barWidth: 3,
            barRadius: 3,
            barGap: 2,
            barMinHeight: 4,
            cursorWidth: 1,
            container: this.waveformRef.current,
            backend: "WebAudio",
            height: 55,
            progressColor: "#1A62F2",
            responsive: true,
            waveColor: "#99999933",
            cursorColor: "transparent",
            fillParent: true,
        });
        this.waveform.drawBuffer();
        this.waveform.load(this.props.url);
        this.waveform.on("finish", () => {
            this.setState({ playing: false });
        });
        this.waveform.on("ready", () => {
            this.setState({
                duration: secondsToTime(this.waveform.getDuration()),
                loading: false,
            });
        });
        this.waveform.on("error", () => {
            this.setState({ loading: false });
            openNotification(
                "error",
                "Error",
                "Error occurred while playing the recording"
            );
        });
    }
    componentWillUnmount() {
        this.waveform.un("finish");
        this.waveform.un("ready");
        this.waveform.un("error");
    }

    handlePlay = () => {
        this.setState({ playing: !this.state.playing });
        this.waveform.playPause();
    };
    render() {
        return (
            <div className="audio_comment_container">
                <div
                    className="audio_comment"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="play_svg_container">
                        <div
                            className="play_svg"
                            onClick={(e) => {
                                this.handlePlay();
                                e.stopPropagation();
                            }}
                        >
                            {this.state.playing ? (
                                <PauseOutlined />
                            ) : (
                                <PlayOutlineSvg />
                            )}
                        </div>
                    </div>
                    <div className="waveform_container">
                        <div ref={this.waveformRef} />
                    </div>
                </div>
                <div className="comment_duration">
                    {this.state.loading ? "Loading..." : this.state.duration}
                </div>
            </div>
        );
    }
}
