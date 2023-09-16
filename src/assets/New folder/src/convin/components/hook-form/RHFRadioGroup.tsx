// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import {
    Radio,
    RadioGroup,
    FormHelperText,
    FormControlLabel,
    RadioGroupProps,
} from "@mui/material";
import React from "react";

// ----------------------------------------------------------------------

export default function RHFRadioGroup<T extends string | number | undefined>({
    name,
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
    const { control } = useFormContext();
    const onChange = (e: React.SyntheticEvent<Element, Event>) => {
        handleChange((e.target as HTMLInputElement).value as T);
    };
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <>
                    <RadioGroup {...field} value={value} row {...other}>
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

                    {!!error && (
                        <FormHelperText error sx={{ px: 2 }}>
                            {error.message}
                        </FormHelperText>
                    )}
                </>
            )}
        />
    );
}
