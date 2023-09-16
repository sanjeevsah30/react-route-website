import React from "react";
import "./style.scss";
import UpFilledSvg from "../../../static/svg/UpFilledSvg";
import DownFilledSvg from "../../../static/svg/DownFilledSvg";

function SortArrow({ active, isDsc }) {
    return (
        <div className="sort_arrow">
            <UpFilledSvg
                style={{
                    color: !isDsc && active ? "#333333" : "#999999",
                }}
            />
            <DownFilledSvg
                style={{
                    color: isDsc && active ? "#333333" : "#999999",
                }}
            />
        </div>
    );
}

export default SortArrow;
