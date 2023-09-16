// Reusable Radio Buttons component

import { uid } from "@tools/helpers";
import React, { useState } from "react";

const Radio = (props) => {
    const [value, setvalue] = useState(props.value);
    const [options] = useState(props.options);

    // options is of the htmlFormat : [{value: optionlabel}, ...]

    const getValue = (event) => {
        let value = event.target.value;
        setvalue(value);
        props.handleChange(value);
    };

    return (
        <React.Fragment>
            {options.map((option, index) => (
                <label
                    className={"radioinput"}
                    key={uid() + index}
                    onChange={getValue}
                >
                    <div className={"radiocontainer"}>
                        <input
                            type={"radio"}
                            name={props.name}
                            value={Object.keys(option)[0]}
                            checked={props.value === Object.keys(option)[0]}
                            onChange={() => {}}
                            id={`${props.name}${index}`}
                        />
                        <div className={"radiocheck"} />
                    </div>
                    <label
                        className={"label"}
                        htmlFor={`${props.name}${index}`}
                    >
                        {option[Object.keys(option)[0]]}
                    </label>
                </label>
            ))}
        </React.Fragment>
    );
};

export default Radio;
