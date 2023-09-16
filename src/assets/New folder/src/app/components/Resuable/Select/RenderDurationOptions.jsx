import { Button, InputNumber } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";

const RenderDurationOptions = ({
    durationOptions: options,
    activeKey: active,
    setDuration,
    closePopover,
}) => {
    const [customDuration, setCustomDuration] = useState([null, null]);
    return (
        <>
            <div className="font14 dove_gray_cl marginB20">
                Select your Range
            </div>

            <div
                className="filter__duration--tagContainer"
                style={{
                    width: "520px",
                }}
            >
                {Object.keys(options).map((key) => (
                    <span
                        className={`filter__duration--tag ${
                            key === active ? "active" : ""
                        }`}
                        key={key}
                        onClick={() => {
                            setDuration({ isCustom: false, key });
                            closePopover();
                        }}
                    >
                        {options?.[key]?.text}
                    </span>
                ))}
            </div>

            <div className="space" />
            <p className="text-center font14 marginT20 marginB30 dove_gray_cl">
                Select Minimum and Maximum Call Level Duration
            </p>

            <div className="flex justifyCenter duration_input_container">
                <InputNumber
                    placeholder="Min"
                    className="duration_input"
                    onPressEnter={(e) => {
                        if (
                            customDuration[0] === null &&
                            customDuration[0] === null
                        )
                            return;
                        setDuration({ isCustom: true, customDuration });
                        setCustomDuration([null, null]);
                    }}
                    onChange={(value) => {
                        setCustomDuration((prev) => [value, prev[1]]);
                    }}
                    value={customDuration[0]}
                />

                <InputNumber
                    // value={max_duration}
                    placeholder="Max"
                    className="duration_input"
                    onPressEnter={(e) => {
                        if (
                            customDuration[0] === null &&
                            customDuration[0] === null
                        )
                            return;
                        setDuration({ isCustom: true, customDuration });
                        setCustomDuration([null, null]);
                    }}
                    onChange={(value) => {
                        setCustomDuration((prev) => [prev[0], value]);
                    }}
                />

                <Button
                    type="primary"
                    className="footer_button borderRadius6"
                    onClick={() => {
                        setDuration({ isCustom: true, customDuration });
                        setCustomDuration([null, null]);
                        closePopover();
                    }}
                    disabled={
                        customDuration[0] === null && customDuration[1] === null
                    }
                >
                    Go
                </Button>
            </div>
        </>
    );
};

export default RenderDurationOptions;
