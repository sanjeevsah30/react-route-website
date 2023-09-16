// Reusuable presentational component for Dropdown Lists.
// This is using a select list.
// For the one using an input datalist. Just see the Dropdown_Datalist.js file.

import { uid } from "@tools/helpers";
import React from "react";
import Icon from "./Icon";

// Props to this component are just in the form of props to an input element.
// Except, here the 'input' prefixes are replaced by 'select'.

const DropdownSelect = (props) => {
    let options = props.options ? props.options : [], // If no options are passed to the dropdown.
        required = props.selectRequired ? props.selectRequired : false, // If a dropdown selection is required.
        autoFocus = props.selectAutoFocus ? props.selectAutoFocus : false, // If autofocus setting is sent as a prop.
        // selectedIndex = props.selectValue ? props.selectValue : 0,
        isDisabled = props.disabled ? props.disabled : false,
        withIds = props.withIds ? props.withIds : false;
    // isIdLabelArray = props.isIdLabelArray ? props.isIdLabelArray : false;

    // Now creating the list of options to render to the select list.

    let optionsToRender = [
        ...options.map((option, index) => {
            if (withIds) {
                return option["id"] === props.selectedOption ? (
                    <option
                        key={uid() + index}
                        selected
                        value={
                            props.isIdLabelArray
                                ? Object.keys(option)[0]
                                : option.id
                        }
                    >
                        {props.isIdLabelArray
                            ? Object.values(option)[0]
                            : option[props.field]}
                    </option>
                ) : (
                    <option
                        key={index}
                        value={
                            props.isIdLabelArray
                                ? Object.keys(option)[0]
                                : option.id
                        }
                    >
                        {props.isIdLabelArray
                            ? Object.values(option)[0]
                            : option[props.field]}
                    </option>
                );
            } else {
                return option === props.selectedOption ? (
                    <option
                        key={index}
                        selected
                        value={
                            props.isIdLabelArray
                                ? Object.keys(option)[0]
                                : index
                        }
                    >
                        {props.isIdLabelArray
                            ? Object.values(option)[0]
                            : option}
                    </option>
                ) : (
                    <option
                        key={index}
                        value={
                            props.isIdLabelArray
                                ? Object.keys(option)[0]
                                : index
                        }
                    >
                        {props.isIdLabelArray
                            ? Object.values(option)[0]
                            : option}
                    </option>
                );
            }
        }),
    ];

    return (
        <div className="dropdown">
            <select
                className={
                    props.selectClass ? `${props.selectClass} select` : "select"
                }
                title={props.selectTitle}
                name={props.selectName}
                required={required}
                onChange={props.handleChange}
                autoFocus={autoFocus}
                value={props.selectValue}
                disabled={isDisabled}
            >
                {optionsToRender}
            </select>
            <Icon className={"fa-sort-desc"} />
        </div>
    );
};

export default DropdownSelect;
