import React from "react";

export default function Error(props) {
    return (
        <span
            className={
                props.errorClass
                    ? `error-span ${props.erorrClass}`
                    : "error-span"
            }
        >
            {props.errorMessage}
        </span>
    );
}
