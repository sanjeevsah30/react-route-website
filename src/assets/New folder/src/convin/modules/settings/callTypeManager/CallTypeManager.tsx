import React, { useState, useCallback, useEffect, useMemo } from "react";
import DropShadowBox from "@convin/components/custom_components/DropShadowBox";
import Chip from "@mui/material/Chip";
import {
    Box,
    Autocomplete,
    TextField,
    Typography,
    Divider,
    useTheme,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import PageLoader from "@convin/components/custom_components/PageLoader";
import { CallType } from "@convin/type/CallManager";
import {
    useCreateCallTypeMutation,
    useDeleteCallTypeMutation,
    useGetCallTypesQuery,
    useLazyGetCallTypeByIdQuery,
} from "@convin/redux/services/settings/callTypeManager.service";
import CallManagerDeleteDialog from "@convin/components/custom_components/Dialog/CallManagerDeleteDialog";
import CustomSearchComponent from "../callTagsManager/components/CustomSearchComponent";
import { removeSpaceBeforeAfterDash } from "../callTagsManager/components/CallTagsManager";

const CallTypeManager = (): JSX.Element => {
    //states
    const [value, setValue] = useState<string>("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [toBeDeleted, setToBeDeleted] = useState<
        (CallType & { meeting: number }) | null
    >(null);
    const [query, setQuery] = useState<string>("");

    //theme
    const theme = useTheme();

    //rtk-query hooks
    const { data: callTypes, isLoading } = useGetCallTypesQuery();
    const [createCallType, { isLoading: createLoader }] =
        useCreateCallTypeMutation();
    const [deleteCallType] = useDeleteCallTypeMutation();
    const [getCallTypeId, callTypeById] = useLazyGetCallTypeByIdQuery();

    //useEffect
    useEffect(() => {
        if (callTypeById.data !== undefined) {
            setToBeDeleted(callTypeById?.data);
        }
    }, [callTypeById]);

    useEffect(() => {
        if (!openDeleteDialog && toBeDeleted) {
            setToBeDeleted(null);
        }
    }, [openDeleteDialog]);

    //functions
    const handleDelete = useCallback((): void => {
        if (toBeDeleted) deleteCallType(toBeDeleted.id);
    }, [toBeDeleted]);

    const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        if (value && event.key === "Enter") {
            createCallType({ type: value })
                .unwrap()
                .then(() => setValue(""))
                .catch(() => {
                    return;
                });
        }
    };

    //search filter logic
    const filteredItems = useMemo(() => {
        return callTypes?.filter((item) => {
            return removeSpaceBeforeAfterDash(item.type)
                .toLowerCase()
                .includes(removeSpaceBeforeAfterDash(query).toLowerCase());
        });
    }, [callTypes, query]);

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
                    Type Manager
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
                    placeholder="Search Type here"
                />
            </div>
            <Autocomplete
                multiple
                freeSolo
                open={false}
                options={[]}
                value={filteredItems ? filteredItems : []}
                disableClearable={true}
                renderTags={(value) =>
                    value.map((option, index) => {
                        return (
                            <Chip
                                sx={{ margin: "4px" }}
                                key={index}
                                label={option?.type}
                                size="small"
                                onDelete={() => {
                                    toggleDeleteDialog();
                                    getCallTypeId(option.id);
                                }}
                            />
                        );
                    })
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Type"
                        placeholder="Add Type"
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
                title="Delete Conversation Type"
                message="Are you sure you want to delete this converation type?"
                open={openDeleteDialog}
                onClose={toggleDeleteDialog}
                onDelete={handleDelete}
                label={toBeDeleted?.type}
                meetingCount={toBeDeleted?.meeting}
                loading={callTypeById.isFetching}
            />
        </div>
        // </DropShadowBox>
    );
};
export default CallTypeManager;
