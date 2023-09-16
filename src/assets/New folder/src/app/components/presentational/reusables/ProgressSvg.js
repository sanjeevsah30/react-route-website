import React from "react";
import "./progressSvg.scss";
function ProgressSvg(props) {
    let toDasharray = props.circleSize * 3.14;
    let innerRadius = props.circleSize / 2 - props.strokeWidth / 2;
    let outerRadius = props.circleSize / 2;
    let scale = innerRadius / outerRadius;
    let percentage = Math.floor(
        3.14 * props.percentage * scale * (props.circleSize / 100)
    );
    let uniqueModifier = Math.floor(Math.random() * 100000);

    return (
        <div
            className={
                "percentage-circle" +
                " posRel " +
                "percentage-circle--" +
                uniqueModifier
            }
        >
            <style>
                {`
                    @-webkit-keyframes animate-progress-bar--${uniqueModifier} {
                        0% { stroke-dasharray: 0 ${toDasharray}; }
                      100% { stroke-dasharray: ${percentage} ${toDasharray}; }
                    }

                   @keyframes animate-progress-bar {
                        0% { stroke-dasharray: 0 ${toDasharray}; }
                      100% { stroke-dasharray: ${percentage} ${toDasharray}; }
                    }
                    
                    .percentage-circle--${uniqueModifier} {
                        width: ${props.circleSize}px;
                        height: ${props.circleSize}px;
                    }

                    .percentage-circle__circle--${uniqueModifier} {
                        animation: animate-progress-bar--${uniqueModifier} ${props.speed}s forwards;
                      
                    }
                `}
            </style>

            {props.showPercentage && (
                <div
                    className="posAbs bold700"
                    style={{
                        color: props.color,
                        fontSize: props.fontSize || 24,
                        fontWeight: props.fontWeight || 700,
                        top: "50%",
                        left: "50%",

                        transform: "translate(-50%, -50%)",
                    }}
                >
                    {props.percentage}%
                </div>
            )}

            <svg height={props.circleSize} width={props.circleSize}>
                <circle
                    cx={outerRadius}
                    cy={outerRadius}
                    r={innerRadius}
                    stroke={props.stroke}
                    strokeWidth={props.strokeWidth}
                    fill="none"
                />
                <circle
                    cx={outerRadius}
                    cy={outerRadius}
                    className={
                        "percentage-circle__circle" +
                        " " +
                        "percentage-circle__circle--" +
                        uniqueModifier
                    }
                    strokeLinecap={
                        props.percentage <= 3 || props.percentage > 95
                            ? "butt"
                            : "round"
                    }
                    r={innerRadius}
                    stroke={props.color}
                    strokeWidth={props.strokeWidth}
                    fill="none"
                />
            </svg>
        </div>
    );
}
ProgressSvg.defaultProps = {
    speed: 1,
    strokeWidth: 12,
    circleSize: 140,
    stroke: "lightgrey",
    type: "good",
    showPercentage: true,
};

export default React.memo(
    ProgressSvg,
    (prev, next) => prev.percentage === next.percentage
);
