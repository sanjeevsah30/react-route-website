import React from "react";

function Dot({ className, style = {}, ...props }) {
    return (
        <div
            className={className || ""}
            style={{
                ...props,
                ...style,
                borderRadius: "50%",
                display: "inline-block",
            }}
        ></div>
    );
}

export default Dot;
