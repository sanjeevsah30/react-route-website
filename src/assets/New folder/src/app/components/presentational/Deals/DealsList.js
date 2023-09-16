import React from "react";

const DealsList = (props) => {
    return (
        <div
            className={`deals-list ${props.activeCall !== -1 ? "hidden" : ""}`}
        ></div>
    );
};

export default DealsList;
