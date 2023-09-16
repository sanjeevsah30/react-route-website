import React from "react";
import NoDashBoardDataSvg from "app/static/svg/NoDashBoardDataSvg";

const EmptyDataState = ({ msg }) => (
    <div className="flex1 flex column alignCenter justifyCenter">
        <NoDashBoardDataSvg
            style={{
                transform: "scale(1.2)",
            }}
        />
        <div className="font16 bold600 marginT16">{msg || "No Data !"}</div>
    </div>
);
export default EmptyDataState;
