import React from "react";
import NothingHere from "@presentational/reusables/NothingHere";

function NoTemplate(props) {
    return (
        <div className="height100p flex alignCenter justifyCenter">
            <NothingHere {...props} />
        </div>
    );
}

export default NoTemplate;
