import React from "react";

export default function Logo(props) {
    return (
        <img
            src={
                props.logo
                    ? props.logo
                    : require("../../../static/images/convin-black.png").default
            }
            alt={props.logoAlt}
            className={
                props.logoClass
                    ? `${props.logoClass} convin-logo`
                    : "convin-logo"
            }
        />
    );
}
