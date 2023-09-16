// Reusable font awesome icon component.

import React from "react";

const Icon = (props) => {
    const className = props.className ? props.className : "";
    const handleClick = props.handleClick ? props.handleClick : () => {};
    const style = props.style || {};
    return (
        <i
            className={`fa ${className}`}
            title={props.iconTitle}
            style={{ ...style }}
            onClick={handleClick}
            aria-hidden={true}
        />
    );
};

export default Icon;
