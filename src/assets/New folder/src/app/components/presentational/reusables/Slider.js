import React, { useEffect, useState } from "react";

const Slider = (props) => {
    const [firstSliderValue, setfirstSliderValue] = useState(
        props.values[0] || 0
    );
    const [secondSliderValue, setsecondSliderValue] = useState(
        props.values[1] || 100
    );
    const setVals = () => {
        // Get slider values
        let slides = document.querySelectorAll(
            `.slider${props.sliderId ? props.sliderId : ""}`
        );
        let slide1 = parseFloat(slides[0].value);
        let slide2 = parseFloat(slides[1].value);
        // Neither slider will clip the other, so make sure we determine which is larger
        if (slide1 > slide2) {
            [slide1, slide2] = [slide2, slide1];
        }
        props.getSliderValue(slide1, slide2);
    };

    useEffect(() => {
        setfirstSliderValue(props.values[0]);
        setsecondSliderValue(props.values[1]);
    }, [props.values]);

    return (
        <div className="range-slider">
            <input
                value={firstSliderValue}
                className={`slider${props.sliderId ? props.sliderId : ""}`}
                onChange={setVals}
                min={props.minSliderValue}
                max={props.maxSliderValue}
                step={props.sliderStep}
                type="range"
            />
            <input
                value={secondSliderValue}
                className={`slider${props.sliderId ? props.sliderId : ""}`}
                onChange={setVals}
                min={props.minSliderValue}
                max={props.maxSliderValue}
                step={props.sliderStep}
                type="range"
            />
        </div>
    );
};
export default Slider;
