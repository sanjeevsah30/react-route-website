// Reusable presentational component for a Dropdown list.
// This is using an input tag that provides an autocompletion list.
// For the one using a select list. Just see the Dropdown_Select.js file.

import { uid } from "@tools/helpers";
import React, { useState, useRef, useEffect } from "react";

// Passing props to this component is similar to passing props to any other input element.
// Refer to reusables/Input.js for reference.

const DropdownDatalist = (props) => {
    let required = props.inputRequired ? props.inputRequired : false, //
        autoFocus = props.inputAutoFocus ? props.inputAutoFocus : false, // Autofocus set or not.
        // showValue = props.showValue ? props.showValue : false,
        inputref = useRef(null);

    const [filteredOptions, setfilteredOptions] = useState(props.options);
    const [isDataListActive, setisDataListActive] = useState(false);

    const [selectedVal, setselectedVal] = useState({
        [props.text]: "",
    });

    useEffect(() => {
        setfilteredOptions(props.options);
    }, [props.options]);

    const filterValues = (value) => {
        let nameregex = new RegExp(value, "ig");
        let foundValues =
            props.options &&
            props.options.filter((option) => {
                let stringText = option[props.text];
                let stringValue = "" + option[props.value];
                return (
                    (stringText && stringText.search(nameregex) !== -1) ||
                    (stringValue && stringValue.search(nameregex) !== -1)
                );
            });
        setfilteredOptions(foundValues);
    };

    const handleClick = (event, option) => {
        setselectedVal(option);
        props.handleChange(event, option, cleanField);
        inputref.current.focus();
    };

    const handleChange = (event) => {
        setselectedVal({
            [props.text]: event.target.value,
        });
        props.handleChange(event, {
            [props.text]: event.target.value,
        });
        filterValues(event.target.value);
    };

    const cleanField = () => {
        setselectedVal({
            [props.text]: "",
        });
        setfilteredOptions(props.options);
        inputref.current.focus();
    };

    return (
        <div className="dropdown-datalist">
            <input
                className={
                    props.inputClass
                        ? `${props.inputClass} input datainput`
                        : "input datainput"
                }
                title={props.inputTitle}
                name={props.inputName}
                value={selectedVal[props.text] || selectedVal[props.value]}
                onChange={handleChange}
                placeholder={props.inputPlaceholder}
                required={required}
                autoFocus={autoFocus}
                autoComplete={"off"}
                list={
                    props.inputClass ? props.inputClass + "-list" : "input-list"
                }
                onClick={() => setisDataListActive(true)}
                onFocus={() =>
                    setTimeout(() => {
                        setisDataListActive(true);
                    }, 351)
                }
                onBlur={() =>
                    setTimeout(() => {
                        setisDataListActive(false);
                    }, 350)
                }
                ref={inputref}
                onKeyUp={(event) =>
                    props.handleKeyUp &&
                    props.handleKeyUp(event, selectedVal, cleanField)
                }
            />
            <div className={isDataListActive ? "datalist active" : "datalist"}>
                {filteredOptions && filteredOptions.length > 0 ? (
                    filteredOptions.map((option, index) => (
                        <div
                            key={uid() + index}
                            tabIndex={1}
                            className="datalist-option"
                            onClick={(event) => {
                                handleClick(event, option);
                            }}
                        >
                            <button className={"accessibility"}>
                                <p className="datalist-option-text">
                                    {option[props.text]}
                                </p>
                                {props.showValue && (
                                    <p className="datalist-option-value">
                                        {option[props.value]}
                                    </p>
                                )}
                            </button>
                        </div>
                    ))
                ) : (
                    <div
                        className="datalist-option"
                        onClick={(event) => {
                            handleClick(event, selectedVal);
                        }}
                    >
                        <p className="datalist-option-text newtag">
                            <span className="newtag-svg">
                                <svg viewBox="0 0 490.885 490.885">
                                    <g>
                                        <path d="M368.368,73.538c-24.853,0-45.001,20.148-45.001,45.001c0,24.854,20.148,45.001,45.001,45.001   c24.853,0,45.001-20.147,45.001-45.001C413.369,93.687,393.221,73.538,368.368,73.538z M368.368,142.69   c-13.338,0-24.15-10.813-24.15-24.15c0-13.337,10.812-24.149,24.15-24.149c13.337,0,24.15,10.813,24.15,24.149   C392.517,131.877,381.705,142.69,368.368,142.69z" />
                                        <path d="M221.586,490.885c-13.836,0-26.837-5.375-36.611-15.16L15.63,306.392c-20.179-20.189-20.179-53.023,0-73.212L197.69,51.13   c45.815-47.735,156.567-85.98,242.547,0c66.869,66.869,66.869,175.675,0,242.546l-182.05,182.05   C248.414,485.51,235.412,490.885,221.586,490.885z M212.433,65.872l-182.06,182.05c-12.045,12.055-12.045,31.674,0,43.729   l169.344,169.334c11.688,11.687,32.029,11.708,43.728,0l182.05-182.051c58.735-58.745,58.741-154.321,0-213.061   C384.505,24.883,287.162-8.858,212.433,65.872z" />
                                        <path d="M150.307,228.587h16.401v73.468h-16.401l-35.003-46.039v46.039H98.912v-73.468h15.343l36.051,47.292V228.587z" />
                                        <path d="M237.753,228.587v14.61h-36.581v15.13h32.906v13.979h-32.906v15.241h37.731v14.508H184.78v-73.468H237.753z" />
                                        <path d="M276.432,270.84l13.032-42.253h17.134l12.93,42.253l14.61-42.253h17.766l-25.646,73.468h-12.198l-16.076-51.079   l-15.974,51.079h-12.197l-25.647-73.468h17.766L276.432,270.84z" />
                                    </g>
                                </svg>
                            </span>
                            <span>{selectedVal[props.text]}</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DropdownDatalist;
