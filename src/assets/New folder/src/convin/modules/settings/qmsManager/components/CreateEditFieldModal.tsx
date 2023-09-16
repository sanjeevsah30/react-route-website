import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControlLabel,
    Typography,
    styled,
} from "@mui/material";
import {
    FormProvider,
    RHFRadioGroup,
    RHFTextField,
} from "@convin/components/hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import useQmsStateContext from "../hooks/useQmsStateContext";
import { dateFieldOptions, fieldTypes } from "../constants";
import React, { useState } from "react";
import {
    useCreateQmsFieldMutation,
    useUpdateQmsFiledMutation,
} from "@convin/redux/services/settings/qms.service";
import { QmsField } from "../context/QmsStateContext";
import { CloseSvg } from "@convin/components/svg";
import { LoadingButton } from "@mui/lab";
import { showToast } from "@convin/utils/toast";

type Action =
    | { type: "ADD_OPTION"; option: string }
    | { type: "REMOVE_OPTION"; index: number }
    | { type: "RENAME_OPTION"; index: number; newLabel: string };

const StyledDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
        height: "590px",
        width: "650px",
        borderRadius: theme.shape.borderRadius * 3,
    },
    "& .MuiFormControlLabel-root": {
        ".MuiRadio-root:first-of-type, .MuiCheckbox-root:first-of-type": {
            marginLeft: theme.spacing(-1.25),
        },

        ".MuiFormControlLabel-label": {
            marginRight: theme.spacing(3),
        },
    },
}));

const CreateEditFieldModal = ({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) => {
    const schema = Yup.object().shape({
        name: Yup.string().required("*Field Name is required"),
    });

    const optionManager = (action: Action) => {
        if (
            action.type === "ADD_OPTION" &&
            state.metadata.choices !== undefined
        ) {
            dispatch({
                type: "UPDATE",
                payload: {
                    metadata: {
                        ...state.metadata,
                        choices: [...state.metadata.choices, action.option],
                    },
                },
            });
        } else if (
            action.type === "REMOVE_OPTION" &&
            state.metadata.choices !== undefined
        )
            dispatch({
                type: "UPDATE",
                payload: {
                    metadata: {
                        ...state.metadata,
                        choices: [
                            ...state.metadata.choices.filter(
                                (_, index) => index !== action.index
                            ),
                        ],
                    },
                },
            });
        else if (
            action.type === "RENAME_OPTION" &&
            state.metadata.choices !== undefined
        ) {
            dispatch({
                type: "UPDATE",
                payload: {
                    metadata: {
                        ...state.metadata,
                        choices: [
                            ...state.metadata.choices.map((option, index) =>
                                index === action.index
                                    ? action.newLabel
                                    : option
                            ),
                        ],
                    },
                },
            });
        }
    };

    const { state, dispatch } = useQmsStateContext();
    const [createQmsFiled, { isLoading: isCreating }] =
        useCreateQmsFieldMutation();
    const [updateQmsField, { isLoading: isUpdating }] =
        useUpdateQmsFiledMutation();

    const [editOption, setEditOption] = useState("");
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const methods = useForm({
        resolver: yupResolver(schema),
        defaultValues: state,
        values: state,
    });

    const { handleSubmit } = methods;

    const handleOptionClick = (index: number, label: string) => {
        setEditIndex(index);
        setEditOption(label);
    };

    const handleClose = (
        event?: Record<string, unknown> | React.MouseEvent<HTMLElement>,
        reason?: string
    ): void => {
        if (!reason || reason !== "backdropClick") {
            onClose();
            dispatch({
                type: "RESET",
                payload: {},
            });
        }
    };

    return (
        <StyledDialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            sx={{ borderRadius: "12px" }}
        >
            <Box className="flex h-full">
                <FormProvider
                    methods={methods}
                    onSubmit={handleSubmit(() => {
                        let payload = state;
                        if (state.metadata.nature === "select") {
                            let flag = 0;
                            if (!state.metadata.choices?.[0].length)
                                if (
                                    state.metadata.choices?.length === 1 &&
                                    !state.metadata.choices?.[0].length
                                )
                                    return showToast({
                                        type: "error",
                                        message:
                                            "At least one option is required.",
                                    });
                            state.metadata.choices?.forEach((choice, index) => {
                                if (!choice.length) {
                                    showToast({
                                        type: "error",
                                        message: `Option ${
                                            index + 1
                                        } is blank.`,
                                    });
                                    flag = 1;
                                }
                            });
                            if (flag) return;
                            payload = {
                                ...state,
                                metadata: {
                                    ...state.metadata,
                                    date_time: undefined,
                                },
                            };
                        }
                        if (state.metadata.nature === "date_time") {
                            payload = {
                                ...state,
                                metadata: {
                                    ...state.metadata,
                                    choices: undefined,
                                },
                            };
                        }
                        if (state.metadata.nature === "text_field") {
                            payload = {
                                ...state,
                                metadata: {
                                    ...state.metadata,
                                    choices: undefined,
                                    date_time: undefined,
                                },
                            };
                        }
                        if (!state.id) {
                            createQmsFiled(payload)
                                .unwrap()
                                .then(() => {
                                    handleClose();
                                });
                        } else {
                            updateQmsField(payload)
                                .unwrap()
                                .then(() => {
                                    handleClose();
                                });
                        }
                    })}
                    className="flex flex-col h-full w-full"
                >
                    <Box
                        className="flex items-center justify-between"
                        sx={{
                            p: 2.5,
                        }}
                    >
                        <Typography
                            variant="extraLarge"
                            className="font-semibold"
                        >
                            {state.id ? "Update" : "Create"} Custom Field
                        </Typography>
                        <Box
                            sx={{
                                color: "grey.666",
                            }}
                            className="cursor-pointer"
                            onClick={handleClose}
                        >
                            <CloseSvg />
                        </Box>
                    </Box>
                    <DialogContent
                        dividers
                        className="flex-1 flex flex-col justify-between"
                    >
                        <div>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Choose the Nature of Field
                            </Typography>
                            <RHFRadioGroup<QmsField["metadata"]["nature"]>
                                name="nature"
                                options={fieldTypes}
                                className="radio-group"
                                value={state.metadata.nature}
                                handleChange={(value) => {
                                    dispatch({
                                        type: "UPDATE",
                                        payload: {
                                            ...state,
                                            metadata: {
                                                ...state.metadata,
                                                nature: value,
                                                choices: !state.id
                                                    ? value === "select"
                                                        ? [""]
                                                        : []
                                                    : state.metadata
                                                          .choices || [""],
                                            },
                                        },
                                    });
                                }}
                                sx={{ mb: 2 }}
                            />
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Field Details
                            </Typography>
                            <RHFTextField
                                name="name"
                                label="Field Name"
                                variant="outlined"
                                className="w-full"
                                sx={{ mb: 2 }}
                                value={state.name}
                                onChange={(
                                    e: React.ChangeEvent<
                                        HTMLTextAreaElement | HTMLInputElement
                                    >
                                ) =>
                                    dispatch({
                                        type: "UPDATE",
                                        payload: {
                                            name: e.target.value,
                                        },
                                    })
                                }
                            />
                            {state.metadata.nature === "date_time" ? (
                                <RHFRadioGroup<
                                    QmsField["metadata"]["date_time"]
                                >
                                    name="date_time"
                                    options={dateFieldOptions}
                                    className="radio-group"
                                    value={state.metadata.date_time}
                                    handleChange={(value) =>
                                        dispatch({
                                            type: "UPDATE",
                                            payload: {
                                                metadata: {
                                                    ...state.metadata,
                                                    date_time: value,
                                                },
                                                // date_time: value,
                                            },
                                        })
                                    }
                                />
                            ) : state.metadata.nature === "select" &&
                              state.metadata.choices !== undefined ? (
                                <Box>
                                    {state.metadata.choices.map(
                                        (option, index) => (
                                            <div
                                                className="flex items-center mb-2"
                                                key={`${option}-${index}`}
                                            >
                                                <div
                                                    className="flex items-center justify-start"
                                                    key="add-option"
                                                >
                                                    <Box
                                                        className="w-4 h-4 border-solid border-[1px] rounded-full mr-2"
                                                        sx={{
                                                            borderColor:
                                                                "grey.666",
                                                        }}
                                                    />
                                                    {editIndex === index ? (
                                                        <input
                                                            type="text"
                                                            value={editOption}
                                                            placeholder="Add option"
                                                            className="focus-visible:outline-none placeholder:text-[#999] w-20 max-w-32"
                                                            onChange={(
                                                                e: React.ChangeEvent<
                                                                    | HTMLTextAreaElement
                                                                    | HTMLInputElement
                                                                >
                                                            ) => {
                                                                setEditOption(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (
                                                                    e.key ===
                                                                    "Enter"
                                                                ) {
                                                                    optionManager(
                                                                        {
                                                                            type: "RENAME_OPTION",
                                                                            index: index,
                                                                            newLabel:
                                                                                editOption,
                                                                        }
                                                                    );
                                                                    setEditIndex(
                                                                        null
                                                                    );
                                                                }
                                                            }}
                                                            onBlur={() => {
                                                                optionManager({
                                                                    type: "RENAME_OPTION",
                                                                    index: index,
                                                                    newLabel:
                                                                        editOption,
                                                                });
                                                                setEditIndex(
                                                                    null
                                                                );
                                                            }}
                                                            style={{
                                                                width: "200px",
                                                            }}
                                                        />
                                                    ) : (
                                                        <Box
                                                            component="span"
                                                            onClick={() =>
                                                                handleOptionClick(
                                                                    index,
                                                                    option
                                                                )
                                                            }
                                                            sx={{
                                                                width: "200px",
                                                                height: "22px",
                                                                color:
                                                                    option ===
                                                                    ""
                                                                        ? "#999"
                                                                        : "#333",
                                                            }}
                                                        >
                                                            {option === ""
                                                                ? "Add option"
                                                                : option}
                                                        </Box>
                                                    )}
                                                    {state?.metadata?.choices
                                                        ?.length &&
                                                        state.metadata.choices
                                                            .length > 1 && (
                                                            <span
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    e.preventDefault();
                                                                    optionManager(
                                                                        {
                                                                            type: "REMOVE_OPTION",
                                                                            index: index,
                                                                        }
                                                                    );
                                                                }}
                                                            >
                                                                <CloseSvg />
                                                            </span>
                                                        )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                    <Typography
                                        component="span"
                                        className="ml-1 mr-2"
                                    >
                                        or
                                    </Typography>
                                    <Button
                                        className="font-bold"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            optionManager({
                                                type: "ADD_OPTION",
                                                option: "New Option",
                                            });
                                        }}
                                    >
                                        Add &quot;Other&quot;{" "}
                                    </Button>
                                </Box>
                            ) : null}
                        </div>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={state.is_mandatory}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                        dispatch({
                                            type: "UPDATE",
                                            payload: {
                                                is_mandatory: e.target.checked,
                                            },
                                        })
                                    }
                                />
                            }
                            label={
                                <Typography component="span">
                                    Make this field mandatory
                                </Typography>
                            }
                        />
                    </DialogContent>
                    <DialogActions>
                        <LoadingButton
                            variant="global"
                            sx={{ py: 1, px: 5, mb: 1.5, mt: 1, mr: 1.5 }}
                            type="submit"
                            loading={isCreating || isUpdating}
                        >
                            Save
                        </LoadingButton>
                    </DialogActions>
                </FormProvider>
            </Box>
        </StyledDialog>
    );
};

export default CreateEditFieldModal;
