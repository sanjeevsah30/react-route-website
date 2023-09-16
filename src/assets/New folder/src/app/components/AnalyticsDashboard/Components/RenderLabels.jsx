import { Popover, Tooltip } from "antd";
import React from "react";

const RenderLabels = ({ labels = [], type, MAX_COUNT = 3, className = "" }) => {
    const rest = labels.slice(MAX_COUNT);
    const show = labels.slice(0, MAX_COUNT);

    const content = (
        <div
            style={{
                maxWidth: "500px",
                display: "flex",
                flexWrap: "wrap",
                paddingRight: "16px",
            }}
        >
            {rest.map(({ label, color }, idx) => (
                <span key={idx} className="marginR10">
                    <span
                        className={"inlineBlock dashboard__mark marginR10"}
                        style={{
                            background: color,
                        }}
                    />
                    <span className=" dashboard__label white_cl">
                        {label?.toLowerCase() === "bad"
                            ? "Need Attention"
                            : label}{" "}
                        {type ? <span>{type}</span> : <></>}
                    </span>
                </span>
            ))}
        </div>
    );

    return (
        <div className={`dashboard__legend__container ${className}`}>
            {show.map(({ label, color, message }, idx) => (
                <Tooltip title={message} key={idx}>
                    <div
                        style={{
                            gap: 4,
                        }}
                        className=" flex alignCenter"
                    >
                        <div
                            className={"inlineBlock dashboard__mark"}
                            style={{
                                background: color,
                            }}
                        />
                        <div className=" dashboard__label">
                            {label?.toLowerCase() === "bad"
                                ? "Need Attention"
                                : label}{" "}
                            {type ? <span>{type}</span> : <></>}
                        </div>
                    </div>
                </Tooltip>
            ))}
            {!!rest.length && (
                <Popover
                    overlayClassName={"extra_labels"}
                    content={content}
                    title={<></>}
                >
                    <div className="font12 curPoint extra_labels_count">
                        +{rest.length}
                    </div>
                </Popover>
            )}
        </div>
    );
};

export default RenderLabels;
