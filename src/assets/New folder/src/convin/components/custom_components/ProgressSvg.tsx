import { Box } from "@mui/material";
import { memo, ReactElement } from "react";

interface ProgressSvgProps {
    circleSize?: number;
    stroke?: string;
    strokeWidth?: number;
    color: string;
    speed?: number;
    percentage: number;
    showPercentage?: boolean;
    fontWeight?: number;
}

function ProgressSvg({
    circleSize = 140,
    percentage,
    showPercentage = true,
    fontWeight,
    color,
    speed = 1,
    stroke = "lightgrey",
    strokeWidth = 12,
}: ProgressSvgProps): ReactElement {
    const toDasharray = circleSize * 3.14;
    const innerRadius = circleSize / 2 - strokeWidth / 2;
    const outerRadius = circleSize / 2;
    const scale = innerRadius / outerRadius;
    const newPercentage = Math.floor(
        3.14 * percentage * scale * (circleSize / 100)
    );
    const uniqueModifier = Math.floor(Math.random() * 100000);

    return (
        <div
            className={`relative percentage-circle  percentage-circle--${uniqueModifier}`}
        >
            <style>
                {`
                    @-webkit-keyframes animate-progress-bar--${uniqueModifier} {
                        0% { stroke-dasharray: 0 ${toDasharray}; }
                      100% { stroke-dasharray: ${newPercentage} ${toDasharray}; }
                    }

                   @keyframes animate-progress-bar {
                        0% { stroke-dasharray: 0 ${toDasharray}; }
                      100% { stroke-dasharray: ${newPercentage} ${toDasharray}; }
                    }
                    
                    .percentage-circle--${uniqueModifier} {
                        width: ${circleSize}px;
                        height: ${circleSize}px;
                    }

                    .percentage-circle__circle--${uniqueModifier} {
                        animation: animate-progress-bar--${uniqueModifier} ${speed}s forwards;
                      
                    }
                `}
            </style>

            {showPercentage && (
                <Box
                    className="font-semibold absolute"
                    sx={{
                        fontSize: "16px",
                        fontWeight: fontWeight ?? 600,
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color,
                    }}
                >
                    {percentage}%
                </Box>
            )}

            <svg height={circleSize} width={circleSize}>
                <circle
                    cx={outerRadius}
                    cy={outerRadius}
                    r={innerRadius}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <circle
                    cx={outerRadius}
                    cy={outerRadius}
                    className={`percentage-circle__circle  percentage-circle__circle--${uniqueModifier}`}
                    strokeLinecap={
                        percentage <= 3 || percentage > 95 ? "butt" : "round"
                    }
                    r={innerRadius}
                    stroke={color}
                    strokeWidth={strokeWidth}
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
    showPercentage: true,
    fontWeight: 400,
};

export default memo(
    ProgressSvg,
    (prev, next) => prev.percentage === next.percentage
);
