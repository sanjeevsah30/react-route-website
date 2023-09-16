// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

import { SelectProps } from "@mui/material/Select";

// ----------------------------------------------------------------------

export default function RHFSelect<T extends string | number | null>({
    name,
    options,
    label,
    ...other
}: {
    name: string;
    options: { id: T; value: string }[];
} & SelectProps): JSX.Element {
    const { control } = useFormContext();
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <FormControl>
                    <InputLabel id="demo-simple-select-label">
                        {label}
                    </InputLabel>

                    <Select {...field} fullWidth label={label} {...other}>
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
            )}
        />
    );
}
