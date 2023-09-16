import { Controller, UseFormReturn } from "react-hook-form";
import {
    TextField,
    Select,
    MenuItem,
    Autocomplete,
    createFilterOptions,
    InputLabel,
    FormControl,
    Typography,
    Stack,
} from "@mui/material";

import { useGetTeamsQuery } from "@convin/redux/services/settings/teamManager.service";
import { toOptions } from "@convin/components/custom_components/TreeSelect/MuiTeamSelector";
import { isDefined } from "@convin/utils/helper/common.helper";
import { useGetAvailableSubscriptionsQuery } from "@convin/redux/services/settings/userManager.service";
import { useGetRolesQuery } from "@convin/redux/services/settings/roleManager.service";
import { FormType } from "./CreateUserModal";
import { useEffect } from "react";

interface UserFormProps extends UseFormReturn<FormType> {
    index: number;
    checkSubscriptions: () => void;
}

export const UserForm = ({
    index,
    checkSubscriptions,
    ...methods
}: UserFormProps) => {
    const { data: allTeams } = useGetTeamsQuery();

    const { data: availableSubscriptions } =
        useGetAvailableSubscriptionsQuery();

    const { data: roles } = useGetRolesQuery();

    const {
        control,
        formState: { errors },
        watch,
    } = methods;

    const teamOptions = allTeams?.flatMap((category) => toOptions(category));

    const user_type = watch(`users.${index}.user_type`);
    const user_subscription = watch(`users.${index}.subscription`);
    useEffect(() => {
        if (user_type === 0) {
            methods.setValue(`users.${index}.subscription`, "");
        }
    }, [user_type]);

    useEffect(() => {
        checkSubscriptions();
    }, [user_subscription]);

    return (
        <Stack
            className="flex flex-grow"
            direction="row"
            gap={2}
            sx={{
                height: "56px",
                "& .MuiFormControl-root, & .MuiAutocomplete-root": {
                    flex: 1,
                    height: "56px",
                },
            }}
        >
            <Controller
                name={`users.${index}.first_name`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <TextField
                        label="First Name"
                        {...field}
                        error={!!errors.users?.[index]?.first_name}
                        helperText={
                            <>{errors.users?.[index]?.first_name?.message}</>
                        }
                        required
                    />
                )}
            />

            <Controller
                name={`users.${index}.last_name`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <TextField label="Last Name" {...field} />
                )}
            />

            <Controller
                name={`users.${index}.email`}
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <TextField
                        label="Email Address"
                        type="email"
                        {...field}
                        error={!!errors.users?.[index]?.email}
                        helperText={
                            <>{errors.users?.[index]?.email?.message}</>
                        }
                        required
                    />
                )}
            />
            <Controller
                name={`users.${index}.role`}
                control={control}
                render={({ field }) => (
                    <Autocomplete
                        // disableCloseOnSelect
                        {...field}
                        value={
                            roles?.find(
                                (option) =>
                                    String(option.id) === String(field.value)
                            ) || null
                        }
                        onChange={(event, value) => {
                            const selectedValue = value ? value.id : "";
                            field.onChange(selectedValue);
                        }}
                        options={isDefined(roles) ? roles : []}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) =>
                            option === value
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Role"
                                variant="outlined"
                                error={!!errors.users?.[index]?.role}
                                helperText={
                                    <>{errors.users?.[index]?.role?.message}</>
                                }
                                required
                            />
                        )}
                        renderOption={(props, option) => {
                            return (
                                <li {...props} key={option.id}>
                                    <span>{option.name}</span>
                                </li>
                            );
                        }}
                    />
                )}
            />
            <Controller
                name={`users.${index}.team`}
                control={control}
                render={({ field }) => (
                    <Autocomplete
                        // disableCloseOnSelect
                        {...field}
                        value={
                            teamOptions?.find(
                                (option) => option.id === field.value
                            ) || null
                        }
                        onChange={(event, value) => {
                            const selectedValue = value ? value.id : "";
                            field.onChange(selectedValue);
                        }}
                        options={isDefined(teamOptions) ? teamOptions : []}
                        getOptionLabel={(option) => option.name}
                        getOptionDisabled={(option) => option.hasSubteams}
                        isOptionEqualToValue={(option, value) =>
                            option.id === value || option === value
                        }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Team"
                                variant="outlined"
                                error={!!errors.users?.[index]?.team}
                                helperText={
                                    <>{errors.users?.[index]?.team?.message}</>
                                }
                                required
                            />
                        )}
                        renderOption={(props, option) => {
                            const hasSubteams = Boolean(option.hasSubteams);
                            const { depth } = option;
                            return (
                                <li {...props} key={option.id}>
                                    {hasSubteams ? (
                                        <span className="text-sm font-semibold">
                                            {option.name}
                                        </span>
                                    ) : (
                                        <span className={`ml-[${8 * depth}px]`}>
                                            {option.name}
                                        </span>
                                    )}
                                </li>
                            );
                        }}
                        filterOptions={createFilterOptions({
                            // join with some arbitrary separator to prevent matches across adjacent terms
                            stringify: (option) => option.matchTerms.join("//"),
                        })}
                    />
                )}
            />

            <Controller
                name={`users.${index}.user_type`}
                control={control}
                render={({ field }) => (
                    <FormControl>
                        <InputLabel>User Type</InputLabel>
                        <Select
                            label="User Type"
                            {...field}
                            error={!!errors.users?.[index]?.user_type}
                        >
                            <MenuItem value={0}>Observer</MenuItem>
                            <MenuItem value={1}>Product User</MenuItem>
                        </Select>
                        {errors.users?.[index]?.user_type && (
                            <Typography
                                variant="small"
                                component="span"
                                sx={{ color: "error.main" }}
                            >
                                {(
                                    <>
                                        {
                                            errors.users?.[index]?.user_type
                                                ?.message
                                        }
                                    </>
                                ) || ""}
                            </Typography>
                        )}
                    </FormControl>
                )}
            />

            <Controller
                name={`users.${index}.subscription`}
                control={control}
                render={({ field }) => (
                    <FormControl>
                        <InputLabel>License</InputLabel>
                        <Select
                            {...field}
                            disabled={user_type === 0}
                            label="License"
                        >
                            {availableSubscriptions?.map((e) => (
                                <MenuItem
                                    value={e.subscription_id}
                                    key={e.subscription_id}
                                >
                                    {e.subscription_type}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.users?.[index]?.subscription && (
                            <Typography
                                variant="small"
                                component="span"
                                sx={{ color: "error.main" }}
                            >
                                {(
                                    <>
                                        {
                                            errors.users?.[index]?.subscription
                                                ?.message
                                        }
                                    </>
                                ) || ""}
                            </Typography>
                        )}
                    </FormControl>
                )}
            />
            <Controller
                name={`users.${index}.primary_phone`}
                control={control}
                defaultValue=""
                render={({ field }) => <TextField label="User ID" {...field} />}
            />
        </Stack>
    );
};
