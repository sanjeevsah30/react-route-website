import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Box, Typography, Slider } from "@mui/material";

interface IProps {
    reverse: boolean;
    style?: React.CSSProperties;
    min: number;
    max: number;
    thresholdMarks: number[];
    thresholdMarksTitles: string[];
    value: number[];
    setValue: React.Dispatch<React.SetStateAction<number[]>>;
    step: number;
}

function DiscreteSlider(props: IProps) {
    const {
        reverse,
        value,
        setValue,
        min,
        max,
        thresholdMarks,
        thresholdMarksTitles,
        style,
        ...rest
    } = props;

    const [marks, setMarks] = useState(
        reverse ? thresholdMarks.map((val) => -val) : thresholdMarks
    );
    const [perc, setPerc] = useState(
        reverse
            ? value.map((val) => (1 - Math.abs(val / max)) * 100)
            : value.map((val) => (val / max) * 100)
    );

    const onChange = (_: Event, tValues: number | number[]) => {
        if (Array.isArray(tValues)) {
            const [minVal, maxVal] = tValues;
            const diff = Math.abs(maxVal - minVal);
            if (minVal < 5 || maxVal > 95) return;
            if (diff >= 5) {
                // Check if the difference is at least 5
                setValue(tValues);
                if (!reverse) {
                    setMarks([
                        (min + minVal) / 2,
                        (minVal + maxVal) / 2,
                        (maxVal + max) / 2,
                    ]);
                    setPerc(tValues.map((val) => (val / max) * 100));
                } else {
                    setMarks([
                        (-max + minVal) / 2,
                        (minVal + maxVal) / 2,
                        (maxVal + -min) / 2,
                    ]);
                    setPerc(
                        tValues.map((val) => (1 - Math.abs(val / max)) * 100)
                    );
                }
            }
        }
    };

    return (
        <Slider
            sx={{
                "& .MuiSlider-track": {
                    background:
                        "linear-gradient(0deg, #FDD250, #FDD250), rgba(26, 98, 242, 0.1)",
                    borderColor: "white",
                    height: "6px",
                },
                "& .MuiSlider-thumb": {
                    background: "white",
                    boxShadow: "0px 4px 20px rgba(51, 51, 51, 0.3)",
                },
                "& .MuiSlider-mark": {
                    background: "none",
                },
                "& .MuiSlider-markLabel": {
                    fontWeight: "600",
                    fontSize: "18px",
                    color: "#333",
                },

                "& .MuiSlider-rail": {
                    opacity: 1,
                    height: "6px",
                    background: `linear-gradient(to right, 
              #73B1FF 0% ${perc[0]}%, #FDD250 ${perc[0]}% ${perc[1]}%, 
              #FF8754 ${perc[1]}% 100%)`,
                },
                "& .MuiSlider-valueLabel": {
                    background: "#333",
                },
                ...style,
            }}
            valueLabelDisplay="on"
            valueLabelFormat={(x) => `${x}`}
            value={value}
            min={min}
            max={max}
            scale={(x) => x}
            marks={[
                { value: min },
                ...marks.map((val, idx) => ({
                    value: val,
                    label: thresholdMarksTitles[idx],
                })),
                { value: max, label: "" },
            ]}
            onChange={onChange}
            // disabled
            {...rest}
        />
    );
}

export default forwardRef(function ThresholdSlider(
    {
        hot,
        warm,
    }: {
        hot: number;
        warm: number;
    },
    ref
) {
    const [value, setValue] = useState<number[]>([warm, hot]);
    useImperativeHandle(
        ref,
        () => {
            return {
                value,
            };
        },
        [value]
    );
    return (
        <Box
            className="flex items-center"
            sx={{
                gap: 1,
            }}
        >
            <Typography
                sx={{
                    mt: -2.2,
                }}
            >
                0
            </Typography>
            <DiscreteSlider
                reverse={false}
                step={1}
                value={value}
                setValue={setValue}
                min={0}
                max={100}
                thresholdMarks={[
                    warm / 2,
                    warm + (hot - warm) / 2,
                    hot + (100 - hot) / 2,
                ]}
                thresholdMarksTitles={["Cold", "Warm", "Hot"]}
                style={{
                    width: "570px",
                }}
            />
            <Typography
                sx={{
                    mt: -2.2,
                }}
            >
                100
            </Typography>
        </Box>
    );
});
