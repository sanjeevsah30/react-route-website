import React from "react";
import InfoCircleSvg from "app/static/svg/InfoCircleSvg";

function IncompleteAuditBanner(props) {
    return (
        <div className="flex padding6 alignCenter bg_audit_red marginB10">
            <div className="flex justifyCenter alignCenter font20 audit_incomplete_info">
                <InfoCircleSvg
                    style={{
                        color: "white",
                    }}
                />
            </div>
            <div className="flex1 paddingL10 ">
                <div className="bold textWhite">Audit is incomplete</div>
            </div>
        </div>
    );
}

export default IncompleteAuditBanner;
