import React, { useState, useCallback, useEffect, useMemo } from "react";
import DropShadowBox from "@convin/components/custom_components/DropShadowBox";
import Chip from "@mui/material/Chip";
import {
    Box,
    Autocomplete,
    TextField,
    Typography,
    useTheme,
    Divider,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { CallTag } from "@convin/type/CallManager";
import {
    useCreateCallTagMutation,
    useDeleteCallTagMutation,
    useLazyGetCallTagByIdQuery,
    useGetCallTagsQuery,
} from "@convin/redux/services/settings/callTagsManager.service";
import PageLoader from "@convin/components/custom_components/PageLoader";
import CallManagerDeleteDialog from "../../../../components/custom_components/Dialog/CallManagerDeleteDialog";
import CustomSearchComponent from "./CustomSearchComponent";

//function to remove the space before and after the "-"
export function removeSpaceBeforeAfterDash(str: string): string {
    return str.replace(/\s*-\s*/g, "-");
}

const CallTagsManager = (): JSX.Element => {
    //states
    const [value, setValue] = useState<string>("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [toBeDeleted, setToBeDeleted] = useState<
        (CallTag & { meeting: number }) | null
    >(null);
    const [query, setQuery] = useState<string>("");

    //theme
    const theme = useTheme();

    //rtk-query hooks
    const { data: callTags, isLoading } = useGetCallTagsQuery();
    const [createCallTag, { isLoading: createLoader }] =
        useCreateCallTagMutation();
    const [deleteCallTag] = useDeleteCallTagMutation();
    const [getCallTagById, callTagById] = useLazyGetCallTagByIdQuery();

    //useEffect
    useEffect(() => {
        if (callTagById?.data !== undefined) {
            setToBeDeleted(callTagById?.data);
        }
    }, [callTagById]);

    useEffect(() => {
        if (!openDeleteDialog && toBeDeleted) {
            setToBeDeleted(null);
        }
    }, [openDeleteDialog]);

    //functions
    const handleDelete = useCallback((): void => {
        if (toBeDeleted) deleteCallTag(toBeDeleted.id);
    }, [toBeDeleted]);

    const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        if (value && event.key === "Enter") {
            createCallTag({ tag_name: value })
                .unwrap()
                .then(() => setValue(""))
                .catch(() => {
                    return;
                });
        }
    };

    //logic for search filter
    const filteredTags = useMemo(() => {
        return callTags?.filter((item) => {
            return removeSpaceBeforeAfterDash(item.tag_name)
                .toLowerCase()
                .includes(removeSpaceBeforeAfterDash(query).toLowerCase());
        });
    }, [callTags, query]);

    const toggleDeleteDialog = useCallback((): void => {
        setOpenDeleteDialog((prev) => !prev);
    }, []);

    if (isLoading) {
        return <PageLoader />;
    }

    return (
        // <DropShadowBox Component={Box} sx={{ p: "32px" }}>
        <div className="w-full h-full">
            <div>
                <Typography variant="h5" className="font-semibold">
                    Tags Manager
                </Typography>
            </div>

            <Divider
                sx={{
                    my: 2,
                }}
            />

            <div className="pb-8">
                <CustomSearchComponent
                    value={query}
                    setValue={setQuery}
                    placeholder="Search Tag here"
                />
            </div>
            <Autocomplete
                multiple
                freeSolo
                open={false}
                options={[]}
                value={filteredTags ? filteredTags : []}
                disableClearable={true}
                renderTags={(value) =>
                    value.map((option) => {
                        return (
                            <Chip
                                sx={{ margin: "4px" }}
                                key={option?.id}
                                label={option?.tag_name}
                                size="small"
                                onDelete={() => {
                                    toggleDeleteDialog();
                                    getCallTagById(option.id);
                                }}
                            />
                        );
                    })
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Tag"
                        placeholder="Add Tag"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyUp={(e) => handleKeyUp(e)}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {createLoader ? (
                                        <CircularProgress
                                            color="inherit"
                                            size={15}
                                        />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                    />
                )}
            />
            <CallManagerDeleteDialog
                title="Delete Conversation Tag"
                message="Are you sure you want to delete this converation tag?"
                open={openDeleteDialog}
                onClose={toggleDeleteDialog}
                onDelete={handleDelete}
                label={toBeDeleted?.tag_name}
                meetingCount={toBeDeleted?.meeting}
                loading={callTagById.isFetching}
            />
        </div>
        // </DropShadowBox>
    );
};

export default CallTagsManager;
