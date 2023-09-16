import { useGetTeamsQuery } from "@convin/redux/services/settings/teamManager.service";
import { toOptions } from "../TreeSelect/MuiTeamSelector";
import {
    Autocomplete,
    TextField,
    TextFieldProps,
    createFilterOptions,
} from "@mui/material";
import { isDefined } from "@convin/utils/helper/common.helper";

interface MuiSingleTeamSelectorProps {
    selectedId: number | null;
    handleChange: (newValue: number | null) => void;
    helperText?: React.ReactNode;
    size?: TextFieldProps["size"];
    className?: string;
    excludeTeam?: [number];
}

export default function MuiSingleTeamSelector({
    selectedId,
    handleChange,
    helperText = null,
    size = "medium",
    className,
    excludeTeam,
}: MuiSingleTeamSelectorProps): JSX.Element {
    const { data: allTeams } = useGetTeamsQuery();

    const optionsList = allTeams
        ?.filter((e) => (excludeTeam?.includes(e.id) ? false : e.subteams?.filter(team=> !excludeTeam?.includes(team.id)).length)).map(e=>({
            ...e,
            subteams: e.subteams?.filter(team=> !excludeTeam?.includes(team.id))
        }))
        .flatMap((category) => toOptions(category));

    return (
        <>
            <Autocomplete
                // disableCloseOnSelect
                options={isDefined(optionsList) ? optionsList : []}
                getOptionLabel={(option) => option.name}
                getOptionDisabled={(option) => option.hasSubteams}
                isOptionEqualToValue={(option, value) =>
                    option.id === value || option === value
                }
                className={className}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        required={isDefined(helperText) ? true : false}
                        label="Team"
                        variant="outlined"
                        error={helperText !== null ? true : false}
                        helperText={helperText}
                        size={size}
                    />
                )}
                renderOption={(props, option, { selected, inputValue }) => {
                    const hasSubteams = Boolean(option.hasSubteams);
                    const { depth } = option;
                    // console.log(option.name, option.hasSubteams);
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
                value={
                    optionsList?.find((option) => option.id === selectedId) ||
                    null
                }
                onChange={(e, newValue) => {
                    handleChange(newValue ? newValue.id : null);
                }}
                filterOptions={createFilterOptions({
                    // join with some arbitrary separator to prevent matches across adjacent terms
                    stringify: (option) => option.matchTerms.join("//"),
                })}
            />
        </>
    );
}
