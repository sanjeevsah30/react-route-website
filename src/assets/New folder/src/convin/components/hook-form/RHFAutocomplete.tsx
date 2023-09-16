// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { TextField, Checkbox } from "@mui/material";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
// ----------------------------------------------------------------------

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
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function RHFAutoComplete<
    T extends { id: number; label: string }
>(props: CustomAutoCompleteProps<T> & { name: string }) {
    const { control } = useFormContext();
    const { name, data, label, ...rest } = props;
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Autocomplete
                    {...field}
                    multiple
                    id="checkboxes-tags-demo"
                    options={data}
                    disableCloseOnSelect
                    disableClearable
                    getOptionLabel={(option) => option.label}
                    renderOption={(props, option, { selected }) => (
                        <li {...props}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                            />
                            {option.label}
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label}
                            placeholder="Search"
                        />
                    )}
                    {...rest}
                />
            )}
        />
    );
}
