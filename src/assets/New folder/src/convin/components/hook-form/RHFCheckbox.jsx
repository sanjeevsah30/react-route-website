import PropTypes from "prop-types";
// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import {
    Checkbox,
    FormGroup,
    FormControlLabel,
    Box,
    Typography,
} from "@mui/material";
import SingleObjSvg from "../svg/SingleObjSvg";

// ----------------------------------------------------------------------

RHFCheckbox.propTypes = {
    name: PropTypes.string,
    children: PropTypes.node,
};

export function RHFCheckbox({ name, children, onChange, ...other }) {
    const { control } = useFormContext();

    return (
        <FormControlLabel
            control={
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <>
                            <Checkbox
                                {...field}
                                checked={field.value}
                                onChange={onChange}
                            />
                            <>{children}</>
                        </>
                    )}
                />
            }
            {...other}
        />
    );
}

// ----------------------------------------------------------------------

RHFMultiCheckbox.propTypes = {
    name: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.string),
};

export function RHFMultiCheckbox({ name, options, ...other }) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                const onSelected = (option) =>
                    field.value.includes(option)
                        ? field.value.filter((value) => value !== option)
                        : [...field.value, option];

                return (
                    <FormGroup>
                        {options.map((option) => (
                            <FormControlLabel
                                key={option}
                                control={
                                    <Checkbox
                                        checked={field.value.includes(option)}
                                        onChange={() =>
                                            field.onChange(onSelected(option))
                                        }
                                    />
                                }
                                label={option}
                                {...other}
                            />
                        ))}
                    </FormGroup>
                );
            }}
        />
    );
}

export function RHFMultiCheckboxLabel({ name, options, labelComp, ...other }) {
    const { control } = useFormContext();
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                const onSelected = (option) => {
                    return field.value
                        .map(({ type }) => type)
                        .includes(option.type)
                        ? field.value.filter(
                              (value) => value.type !== option.type
                          )
                        : [...field.value, option];
                };

                return (
                    <FormGroup>
                        {options.map((option) => (
                            <FormControlLabel
                                key={option.name}
                                control={
                                    <Checkbox
                                        checked={field.value
                                            .map((item) => item.type)
                                            .includes(option.type)}
                                        onChange={() =>
                                            field.onChange(onSelected(option))
                                        }
                                    />
                                }
                                sx={{ pl: 2, pr: 3, py: 1 }}
                                labelPlacement="start"
                                label={
                                    <Box
                                        sx={{
                                            display: "flex",
                                        }}
                                    >
                                        {labelComp}
                                        <Typography
                                            sx={{
                                                pl: 1,
                                            }}
                                        >
                                            {option.name}
                                        </Typography>
                                    </Box>
                                }
                                value={option}
                                {...other}
                            />
                        ))}
                    </FormGroup>
                );
            }}
        />
    );
}
