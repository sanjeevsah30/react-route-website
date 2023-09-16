import {
    Autocomplete,
    TextField,
    Checkbox,
    createFilterOptions,
} from "@mui/material";

import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import { useSelector } from "react-redux";
import { flattenTeams } from "@convin/utils/helper";
import { Controller, useFormContext } from "react-hook-form";
import { useTheme } from "@mui/material/styles";

export const toOptions = (category, depth = 0, parentId = null) => {
    const { id, name, subteams = [] } = category;
    const children = subteams.flatMap((child) =>
        toOptions(child, depth + 1, id)
    );
    const option = {
        id,
        name,
        depth,
        parentId,
        matchTerms: [name].concat(children.map((obj) => obj.name)),
        hasSubteams: subteams.length !== 0,
        subteamsId: children.map((obj) => obj.id),
    };
    return [option].concat(children);
};

function concatIfNotPresent(array, elementsToConcat) {
    const uniqueElements = new Set(array);

    elementsToConcat.forEach((element) => {
        uniqueElements.add(element);
    });

    return Array.from(uniqueElements);
}

export default function MuiTeamSelector({ value = [], updateValue }) {
    const {
        common: { teams },
    } = useSelector((state) => state);
    const optionsList = teams.flatMap((category) => toOptions(category));
    optionsList.unshift({
        id: -1,
        name: "Select All",
        depth: 0,
        parentId: null,
        matchTerms: [],
        hasSubteams: false,
        subteamsId: [],
    });
    const theme = useTheme();

    const handleChange = (event, newValue, reason) => {
        let valueToUpdate = newValue.map((e) => (e?.id ? e.id : e));

        if (reason === "removeOption") {
            const removedOptionId = value.filter((e) => !newValue.includes(e));
            const removedOption = optionsList.find(
                (e) => e.id === removedOptionId[0]
            );
            if (removedOption?.hasSubteams) {
                valueToUpdate = valueToUpdate.filter(
                    (e) => !removedOption.subteamsId.includes(e)
                );
            }
            if (removedOption.parentId) {
                valueToUpdate = valueToUpdate.filter(
                    (e) => e !== removedOption.parentId
                );
            }
        } else {
            if (newValue.length > 0) {
                const lastValue = newValue[newValue.length - 1];
                if (lastValue.id === -1) {
                    updateValue(flattenTeams(teams).map((e) => e.id));
                    return;
                }
                if (lastValue?.hasSubteams) {
                    const everySubteamSelected = lastValue.subteamsId.every(
                        (val) => valueToUpdate.includes(val)
                    );
                    if (everySubteamSelected)
                        valueToUpdate = valueToUpdate
                            .filter((e) => e !== lastValue.id)
                            .filter((e) => !lastValue.subteamsId.includes(e));
                    else
                        valueToUpdate = concatIfNotPresent(
                            valueToUpdate.filter((e) => e !== lastValue.id),
                            lastValue.subteamsId
                        );
                }
            }
        }
        updateValue(valueToUpdate);
    };
    return (
        <Autocomplete
            multiple
            disableCloseOnSelect
            options={optionsList}
            isOptionEqualToValue={(option, value) => {
                return option.id === value;
            }}
            renderOption={(props, option, { selected, inputValue }) => {
                const matches = match(option.name, inputValue);
                const parts = parse(option.name, matches);
                const isDisabled = option.id === -1 || option.hasSubteams;

                return (
                    <li {...props} key={option.name}>
                        {!isDisabled && (
                            <Checkbox
                                checked={value.includes(option.id)}
                                sx={{ ml: 2 * option.depth }}
                            />
                        )}
                        <div>
                            {parts.map((part, index) => (
                                <span
                                    key={index + part.text}
                                    style={{
                                        fontWeight: part.highlight ? 700 : 400,
                                        color: `${
                                            isDisabled
                                                ? theme.palette.primary.main
                                                : "black"
                                        }`,
                                        textDecoration: `${
                                            isDisabled ? "underline" : "none"
                                        }`,
                                    }}
                                >
                                    {part.text}
                                </span>
                            ))}
                        </div>
                    </li>
                );
            }}
            renderInput={(params) => (
                <TextField {...params} label="Teams and Sub-Teams" />
            )}
            getOptionLabel={(option) =>
                optionsList.find(({ id }) => id === option)?.name || ""
            }
            filterOptions={createFilterOptions({
                // join with some arbitrary separator to prevent matches across adjacent terms
                stringify: (option) => option.matchTerms.join("//"),
            })}
            className="w-full"
            value={value}
            onChange={handleChange}
            // {...rest}
        />
    );
}

export function MuiTeamSelectorDefault({ name, value, updateValue, ...rest }) {
    const { control } = useFormContext();

    const {
        common: { teams },
    } = useSelector((state) => state);
    const optionsList = teams.flatMap((category) => toOptions(category));

    const handleChange = (newValue) => {
        const valueToUpdate = newValue.map((e) => (e?.id ? e.id : e));
        updateValue(valueToUpdate);
        return valueToUpdate;
    };

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                return (
                    <Autocomplete
                        multiple
                        disableCloseOnSelect
                        options={optionsList}
                        isOptionEqualToValue={(option, value) => {
                            return option.id === value;
                        }}
                        renderOption={(
                            props,
                            option,
                            { selected, inputValue }
                        ) => {
                            const matches = match(option.name, inputValue);
                            const parts = parse(option.name, matches);
                            const isDisabled =
                                option.depth === 0 && option.hasSubteams;
                            return (
                                <li
                                    {...(!isDisabled && props)}
                                    key={option.name}
                                >
                                    {!isDisabled && (
                                        <Checkbox
                                            checked={value.includes(option.id)}
                                            sx={{ ml: 2 * option.depth }}
                                        />
                                    )}
                                    <div className={isDisabled ? "px-6" : ""}>
                                        {parts.map((part, index) => (
                                            <span
                                                key={index + part.text}
                                                style={{
                                                    fontWeight: part.highlight
                                                        ? 700
                                                        : 400,
                                                }}
                                            >
                                                {part.text}
                                            </span>
                                        ))}
                                    </div>
                                </li>
                            );
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Teams and Sub-Teams"
                            />
                        )}
                        getOptionLabel={(option) =>
                            flattenTeams(teams).find(({ id }) => id === option)
                                ?.name || ""
                        }
                        filterOptions={createFilterOptions({
                            // join with some arbitrary separator to prevent matches across adjacent terms
                            stringify: (option) => option.matchTerms.join("//"),
                        })}
                        className="w-full"
                        value={value}
                        onChange={(event, newValue) => {
                            field.onChange(handleChange(newValue));
                        }}
                        {...rest}
                    />
                );
            }}
        />
    );
}
