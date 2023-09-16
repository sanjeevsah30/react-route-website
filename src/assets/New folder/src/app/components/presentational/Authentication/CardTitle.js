import React from "react";
import Logo from "@presentational/reusables/Logo";
import { useSelector } from "react-redux";
import { getDomain } from "@tools/helpers";

export default function CardTitle({ orgName, title, layout }) {
    const {
        common: { versionData },
    } = useSelector((state) => state);
    return (
        <div className="row title-row">
            <div
                className={`user-auth-card-logos flex alignCenter width100p justifyEnd`}
            >
                <Logo logoAlt="convin" logo={versionData.logo} />
                {!!orgName && (
                    <span className={"orgName"}>
                        {getDomain(window.location.host)}
                    </span>
                )}
            </div>
        </div>
    );
}
