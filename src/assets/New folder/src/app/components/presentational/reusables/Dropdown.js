// File for the dropdown list.
// Implementation similar to that of react-selec.

import React, { useState, useEffect, useRef } from "react";

const Dropdown = (props) => {
    // Warning : This component is a bit state heavy.

    const options = props.options ? props.options : [],
        [selectedOpt, setselectedOpt] = useState([]), // Just using an array for now. Initial value is 0.
        [showOptions, setshowOptions] = useState(false), // State to decide whether to show the options or not.
        isMulti = props.isMulti ? props.isMulti : false,
        wrapperRef = useRef(null),
        [rerender, setrerender] = useState(false); // A variable to keep a time delay for loading as state updation is asynchronous.

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, false);
        return () => {
            document.removeEventListener("click", handleClickOutside, false);
        };
    }, []);

    useEffect(() => {
        if (props.options.length <= selectedOpt[0]) {
            // If the options suddenly changed to a size less than the index in the selectedOpt array.
            setselectedOpt([0]);
        }
    }, [props.options]);

    const handleClick = (optionIndex) => {
        // Function to handle the click on an option.

        let newOptions = selectedOpt;

        if (isMulti) {
            // If there can be multiple options selected. Then add the selected options to the list.

            if (newOptions.includes(optionIndex)) {
                // Remove the option.

                newOptions.splice(newOptions.indexOf(optionIndex), 1);
            } else {
                // Add the option.

                newOptions.push(optionIndex);
            }

            setselectedOpt(newOptions);

            setrerender(!rerender);
        } else {
            // If only one option can be selected at once.

            if (
                optionIndex !== selectedOpt[0] ||
                (selectedOpt.length < 1 && optionIndex !== 0)
            ) {
                // If the user has not selected the same option again.
                // Only then set the newoptons and re-render.

                newOptions = [optionIndex];

                setselectedOpt(newOptions);

                setrerender(!rerender);
            }

            // Hide the dropdown.
            setshowOptions(false);
        }

        // Now calling the handleChange Function.

        if (!isMulti) props.handleChange(newOptions); // Handle Change for a multi select will only fire once the user is done selecting.
    };

    const optionsMapper = (options) => [
        ...options.map((option, index) => {
            let isActive = false,
                id = Object.keys(option)[0];

            if (
                props.currentVals &&
                ((Array.isArray(props.currentVals.index) &&
                    props.currentVals.index.includes(index)) ||
                    (!Array.isArray(props.currentVals.index) &&
                        index === props.currentVals.index))
            )
                isActive = true;
            else if (!props.currentVals) {
                // If currentVals has been passed. Then there is no need to check the following. Since the user is setting the options for themselves.

                if (!isMulti) {
                    if (
                        selectedOpt.includes(index) ||
                        (selectedOpt.length === 0 && index === 0)
                    ) {
                        isActive = true;
                    }
                } else {
                    if (selectedOpt.includes(index)) isActive = true;
                }
            }

            return (
                <div
                    className={`dropdown-list-option ${
                        isActive ? "dropdown-list-label-active" : ""
                    }`}
                    key={index}
                    id={id}
                    title={option[id]}
                    onClick={() => handleClick(index)}
                >
                    <span className={"dropdown-list-option-label"}>
                        {option[id]}
                    </span>
                    {isMulti ? (
                        <span className={"dropdown-list-check-container"}>
                            <span
                                className={`dropdown-checkmark ${
                                    isActive ? "active" : ""
                                }`}
                            />
                        </span>
                    ) : (
                        ""
                    )}
                </div>
            );
        }),
    ];

    const toggleDropdown = () => {
        setshowOptions(!showOptions);

        if (isMulti) props.handleChange(selectedOpt); // If the dropdown is a multiselect one. Handle its change on toggle.
    }; // Toggle the dropdown.

    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setshowOptions(false);
        }
    };

    return (
        <div
            className={`dropdown-list ${
                props.listClass ? props.listClass : ""
            }`}
            title={props.listTitle}
            ref={wrapperRef}
        >
            <div className="dropdown-list-toggler" onClick={toggleDropdown}>
                <div className={"dropdown-list-toggler-label"}>
                    {props.currentVals
                        ? props.currentVals.label[
                              Object.keys(props.currentVals.label)[0]
                          ]
                        : selectedOpt.length > 0
                        ? isMulti && selectedOpt.length > 1
                            ? "Multiple"
                            : options.length > selectedOpt[0]
                            ? options[selectedOpt[0]][
                                  Object.keys(options[selectedOpt[0]])[0]
                              ]
                            : options[0][Object.keys(options[0])[0]] // Display the selected option.
                        : options[0][Object.keys(options[0])[0]]}
                </div>
                <i
                    className={`fa ${props.faicon ? props.faicon : ""}`}
                    aria-hidden="true"
                ></i>
            </div>

            {showOptions ? (
                <div className={"dropdown-list-options"}>
                    {isMulti && ( // Show this button only when the user is selecting multiple options.
                        <div
                            className="dropdown-list-options-donebutton"
                            onClick={toggleDropdown}
                            title={"Done"}
                        >
                            Done
                        </div>
                    )}

                    {optionsMapper(options)}
                </div>
            ) : (
                ""
            )}
        </div>
    );
};

export default Dropdown;
