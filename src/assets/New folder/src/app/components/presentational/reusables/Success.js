import React from "react";

export default function Success(props) {
    return (
        <span
            className={
                props.successClass
                    ? `success-span ${props.successClass}`
                    : "success-span"
            }
        >
            {props.successMessage}
        </span>
    );
}
