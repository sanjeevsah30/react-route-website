import React from "react";
import CloseSvg from "app/static/svg/CloseSvg";
export default function Chip({ title, color, textColor, handleRemove }) {
    return (
        <div
            className="chip flex justifySpaceBetween alignCenter text_ellipsis"
            style={{
                background: color ? color : "#1a62f2",
                color: textColor || "white",
            }}
        >
            {title}
            {handleRemove && (
                <div
                    style={{
                        transform: "scale(0.6)",
                    }}
                    onClick={() => handleRemove(title)}
                    className="marginL10 curPoint"
                >
                    <CloseSvg />
                </div>
            )}
        </div>
    );
}
