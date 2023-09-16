import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    SelectProps,
} from "@mui/material";

interface Option<T extends string | number | null> {
    value: string;
    id: T;
}

interface GenericSelectProps<T extends string | number | null>
    extends SelectProps {
    label: string;
    value: T | null;
    options: Option<T>[];
    handleChange: (event: T) => void;
}

const GenericSelect = <T extends string | number | null>({
    label,
    value,
    options,
    handleChange,
    className = "",
    ...rest
}: GenericSelectProps<T>): JSX.Element => {
    const onChange = (e: SelectChangeEvent<unknown>) => {
        const value = e.target.value as T;
        handleChange(value);
    };
    return (
        <FormControl variant="outlined" className={className}>
            <InputLabel>{label}</InputLabel>
            <Select
                value={value?.toString() ?? ""}
                onChange={onChange}
                label={label}
            >
                {options.map((option, index) => (
                    <MenuItem
                        key={index}
                        value={option?.id ?? ""}
                        className="capitalize"
                    >
                        {option.value}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default GenericSelect;
