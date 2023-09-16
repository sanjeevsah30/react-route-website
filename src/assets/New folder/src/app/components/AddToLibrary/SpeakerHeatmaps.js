import { Heatmap } from "@presentational/reusables/index";
import { Input, Slider } from "antd";
import React, { useEffect, useState } from "react";
import { secondsToTime, timeToSeconds } from "@helpers";
import ScissorsSvg from "app/static/svg/ScissorsSvg";

const SpeakerHeatMaps = ({
    classname,
    totalLength,
    monologues,
    handleChange,
    snippetToUpdate,
    duration,
    seekPlayerTo,
    config,
}) => {
    const [rangeValue, setRangeValue] = useState([0, totalLength]);
    const [inputStartVal, setInputStartVal] = useState("00:00");
    const [inputEndVal, setInputEndVal] = useState(() =>
        secondsToTime(totalLength)
    );
    const handleSliderValueChange = (val) => {
        setRangeValue(val);
        setInputStartVal(secondsToTime(val[0]));
        setInputEndVal(secondsToTime(val[1]));
    };
    const handleStartChange = (e) => {
        const value = e.target.value;
        const convertedVal = timeToSeconds(value);
        if (!isNaN(convertedVal)) {
            if (convertedVal > 0) {
                handleChange([convertedVal, rangeValue[1]]);
                setRangeValue((prev) => [convertedVal, prev[1]]);
                seekPlayerTo(convertedVal);
            } else {
                handleChange([0, rangeValue[1]]);
                setRangeValue((prev) => [0, prev[1]]);
                setInputStartVal("00:00");
                seekPlayerTo(0);
            }
        }
    };

    const handleEndChange = (e) => {
        const value = e.target.value;
        const convertedVal = timeToSeconds(value);
        if (!isNaN(convertedVal)) {
            if (convertedVal < totalLength) {
                handleChange([rangeValue[0], convertedVal]);
                setRangeValue([rangeValue[0], convertedVal]);
                seekPlayerTo(convertedVal);
            } else {
                handleChange([rangeValue[0], totalLength]);
                setRangeValue([rangeValue[0], totalLength]);
                setInputEndVal(secondsToTime(totalLength));
                seekPlayerTo(totalLength);
            }
        }
    };

    const handleAfterChange = (val) => {
        duration[0] === val[0] ? seekPlayerTo(val[1]) : seekPlayerTo(val[0]);
        handleChange(val);
    };

    useEffect(() => {
        if (snippetToUpdate) {
            handleSliderValueChange([
                snippetToUpdate.start_time,
                snippetToUpdate.end_time,
            ]);
        }
    }, [snippetToUpdate]);

    useEffect(() => {
        if (config?.shareDuration) {
            handleSliderValueChange(config?.shareDuration);
        }
    }, [config?.shareDuration]);

    return (
        <div className={`spkrHeatmap ${classname || ""}`} id={"spkrSlider"}>
            <div className="spkrHeatmap__header">
                <div className="spkrHeatmap__header--left">
                    <ScissorsSvg className="spkrHeatmap__header--leftIcon" />
                    <p className="font14 text-bolder marginL8 lineHightN">
                        Trim Call
                    </p>
                </div>
                <div className="spkrHeatmap__header--right">
                    <div className="flex alignCenter">
                        <p className="font12 dvGrey marginR8 lineHightN">
                            Start
                        </p>
                        <Input
                            onBlur={handleStartChange}
                            onPressEnter={handleStartChange}
                            value={inputStartVal}
                            onChange={({ target: { value } }) => {
                                let regex = /[^0-9:]/gi;
                                if (regex.test(value)) {
                                    return;
                                }
                                setInputStartVal(value);
                            }}
                        />
                    </div>
                    <div className="flex alignCenter marginL14">
                        <p className="font12 dvGrey marginR8 lineHightN">End</p>
                        <Input
                            onBlur={handleEndChange}
                            onPressEnter={handleEndChange}
                            value={inputEndVal}
                            onChange={({ target: { value } }) => {
                                let regex = /[^0-9:]/gi;
                                if (regex.test(value)) {
                                    return;
                                }
                                setInputEndVal(value);
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="spkrHeatmap__content">
                <Slider
                    className="spkrHeatmap__selector"
                    range
                    step={0.01}
                    max={totalLength}
                    tooltipVisible={false}
                    value={rangeValue}
                    onChange={handleSliderValueChange}
                    tipFormatter={(time) => secondsToTime(time)}
                    onAfterChange={handleAfterChange}
                    tooltipPlacement={"bottomRight"}
                    getTooltipPopupContainer={() =>
                        document.querySelector(".spkrHeatmap__content")
                    }
                />
                <div className="spkrHeatmap__content--lines">
                    {Object.keys(monologues).map((speaker) => (
                        <div className="spkrHeatmap__timeline" key={speaker}>
                            <p>{speaker}</p>
                            <Heatmap
                                showCommunication={false}
                                showTimeline={true}
                                showTimeBars={true}
                                bars={monologues[speaker]}
                                totalLength={totalLength}
                                showPlayerTracker={false}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

SpeakerHeatMaps.defaultProps = {
    handleChange: () => {},
};

export default SpeakerHeatMaps;
