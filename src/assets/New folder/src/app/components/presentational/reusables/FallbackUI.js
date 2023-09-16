import React from "react";
import "../reusables/spinner.style.scss";

export default function FallbackUI() {
    return (
        <div className="fallback">
            {/* <i className="fa fa-spinner fa-pulse fa-4x fa-fw"></i> */}
            <div className="loader">...Loading</div>
        </div>
    );
}
