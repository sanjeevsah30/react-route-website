import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete, {
    AutocompleteProps,
    createFilterOptions,
} from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export interface CustomAutoCompleteProps<T> {
    autocompleteProps?: AutocompleteProps<
        T,
        boolean | undefined,
        boolean | undefined,
        boolean | undefined
    >;
    label: string;
    loading?: boolean;
    data: T[];
    values?: number[];
    setValues?: (val: number[]) => void;
    className?: string;
    limitTags?: number;
}

const GenericMultipleSelect = <T extends { id: number; label: string }>(
    props: CustomAutoCompleteProps<T>
): JSX.Element => {
    const {
        label,
        data,
        values = [],
        setValues = () => {
            return;
        },
        ...rest
    } = props;
    const handleOptionChange = (_: unknown, value: T[]) => {
        const selectedIds = value.map((option) => option.id); // Extract ids from selected options
        setValues(selectedIds); // Update state with selected ids
    };

    return (
        <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={data}
            disableCloseOnSelect
            disableClearable
            getOptionLabel={(option) => option.label}
            renderOption={(props, option, { selected }) => {
                return (
                    <li {...props} key={option?.id} id={option?.id?.toString()}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.label}
                    </li>
                );
            }}
            renderInput={(params) => (
                <TextField {...params} label={label} placeholder="Search" />
            )}
            value={data.filter((option) => values.includes(option.id))}
            onChange={handleOptionChange}
            {...rest}
        />
    );
};

export default GenericMultipleSelect;
