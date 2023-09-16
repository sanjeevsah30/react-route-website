import {
    Radio,
    RadioGroup,
    FormControlLabel,
    RadioGroupProps,
} from "@mui/material";
import React from "react";

// ----------------------------------------------------------------------

export default function GenericRadioGroup<
    T extends string | number | undefined
>({
    options,
    handleChange,
    value,
    ...other
}: {
    name: string;
    options: { id: T; label: string }[];
    value: T;
    handleChange: (event: T) => void;
} & RadioGroupProps): JSX.Element {
    const onChange = (e: React.SyntheticEvent<Element, Event>) => {
        handleChange((e.target as HTMLInputElement).value as T);
    };
    return (
        <RadioGroup value={value} row {...other}>
            {options.map(({ id, label }) => (
                <FormControlLabel
                    key={id}
                    label={label}
                    value={id}
                    onChange={onChange}
                    control={<Radio />}
                />
            ))}
        </RadioGroup>
    );
}
