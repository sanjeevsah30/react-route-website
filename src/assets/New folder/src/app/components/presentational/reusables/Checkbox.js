import React from "react";

const Checkbox = (props) => {
    const handleChange = props.onChange ? props.onChange : () => {},
        checked = props.checked ? props.checked : false,
        name = props.name ? props.name : "",
        required = props.required ? "required" : false,
        checkClass = props.checkClass ? props.checkClass : "";

    return (
        <label className={`checkbox-container`}>
            <input
                type={"checkbox"}
                className={`checkbox ${checkClass}`}
                onChange={handleChange}
                checked={checked}
                name={name}
                required={required}
            />
            <div className={`checkmark`} />
            <span>{props.label}</span>
        </label>
    );
};

export default Checkbox;
