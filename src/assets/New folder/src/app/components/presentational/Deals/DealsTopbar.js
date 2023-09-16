import React from "react";

import { Label } from "@reusables";
import config from "@constants/Deals";

const DealsTopbar = (props) => {
    return (
        <div className={`deals-topbar`}>
            {props.activeCall !== -1 && (
                <div className={`deals-topbar-breadcrumb`}>
                    BreadCrumb here.
                </div>
            )}
            {props.activeCall === -1 && (
                <div className={`deals-topbar-filter`}>
                    <Label label={config.REPS} />
                </div>
            )}
        </div>
    );
};

export default DealsTopbar;
