import React from "react";

export default function SampleDataBanner({ desc }) {
    return (
        <div className="smplDtBnr">
            <div className="circle posAbs"></div>
            <p className="font18 bolder">{desc}</p>
            <div className="circle posAbs"></div>
        </div>
    );
}

SampleDataBanner.defaultProps = {
    desc: "You are viewing sample data some actions may not work",
};
