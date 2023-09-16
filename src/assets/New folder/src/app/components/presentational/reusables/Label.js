import React from "react";

export default function Label({ labelClass, label }) {
    return (
        <label className={labelClass ? `label ${labelClass}` : "label"}>
            {label}
        </label>
    );
}
