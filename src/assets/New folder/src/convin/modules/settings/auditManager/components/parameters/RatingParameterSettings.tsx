import { useState } from "react";
import useParameterStateContext from "../hooks/useParameterStateContext";
import { useGetViolationsQuery } from "@convin/redux/services/settings/auditManager.service";
import { ParameterSettingsAccordion } from "./BooleanPrameterSettings";
import {
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    TextField,
    Typography,
} from "@mui/material";
import ExpandAccordianSvg from "@convin/components/svg/ExpandAccordianSvg";
import GenericMultipleSelect from "@convin/components/select/GenericMultipleSelect";
import { Violation } from "@convin/type/Violation";
import { DeleteSvg } from "@convin/components/svg";
import { uid } from "tools/helpers";
import InfoSvg from "@convin/components/svg/InfoSvg";

export default function RatingParameterSettings(): JSX.Element {
    const { state, dispatch } = useParameterStateContext();
    const [expanded, setExpanded] = useState<string | number | false>(false);
    const { data: violationList, isFetching: violationListIsFetching } =
        useGetViolationsQuery();
    const handleChange =
        (panel: string | number) =>
        (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };
    return (
        <div>
            <Box
                sx={{
                    my: 2,
                }}
            >
                <TextField
                    label="Weight"
                    variant="filled"
                    className="w-[84px]"
                    value={state.settings.weight}
                    type="number"
                    onChange={(e) => {
                        dispatch({
                            type: "UPDATE",
                            payload: {
                                settings: {
                                    ...state.settings,
                                    weight: e.target.value,
                                },
                            },
                        });
                    }}
                />
                <Box className="flex gap-2 items-center" sx={{ my: 2 }}>
                    <InfoSvg />
                    <Typography variant="medium">
                        Assigned weight will be equally distributed among the
                        responses.
                    </Typography>
                </Box>
            </Box>
            {new Array(11).fill(0).map((e, idx) => {
                return (
                    <Box className="flex" sx={{ my: 2 }} key={idx}>
                        <ParameterSettingsAccordion
                            expanded={expanded === idx}
                            onChange={handleChange(idx)}
                            className="flex-1"
                        >
                            <AccordionSummary
                                expandIcon={<ExpandAccordianSvg />}
                            >
                                <Box
                                    className="flex items-center gap-2"
                                    sx={{
                                        ...(expanded === idx && {
                                            color: "primary.main",
                                        }),
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            ...(!(expanded === idx)
                                                ? { color: "color.999" }
                                                : { fontWeight: 600 }),
                                        }}
                                    >
                                        Response |
                                    </Typography>
                                    <Typography
                                        sx={{
                                            ...(!(expanded === idx)
                                                ? { color: "color.999" }
                                                : {
                                                      color: "primary.main",
                                                      fontWeight: 600,
                                                  }),
                                        }}
                                        variant="large"
                                        className="font-semibold"
                                    >
                                        {idx}
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box className="flex gap-3">
                                    <GenericMultipleSelect<Violation>
                                        className="flex-1"
                                        label="Violations"
                                        data={violationList || []}
                                        loading={violationListIsFetching}
                                        values={
                                            state.settings.rating_violations[
                                                idx
                                            ]
                                        }
                                        setValues={(val: number[]) => {
                                            dispatch({
                                                type: "UPDATE",
                                                payload: {
                                                    settings: {
                                                        ...state.settings,
                                                        rating_violations: {
                                                            ...state.settings
                                                                .rating_violations,
                                                            [idx]: val,
                                                        },
                                                    },
                                                },
                                            });
                                        }}
                                    />
                                </Box>
                                <Box
                                    className="flex justify-between"
                                    sx={{ my: 3 }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={state.settings.mandate_notes_on.includes(
                                                    idx
                                                )}
                                                onChange={(e) => {
                                                    if (e.target.checked)
                                                        dispatch({
                                                            type: "UPDATE",
                                                            payload: {
                                                                settings: {
                                                                    ...state.settings,
                                                                    mandate_notes_on:
                                                                        Array.from(
                                                                            new Set(
                                                                                [
                                                                                    ...state
                                                                                        .settings
                                                                                        .mandate_notes_on,
                                                                                    idx,
                                                                                ]
                                                                            )
                                                                        ),
                                                                },
                                                            },
                                                        });
                                                    else {
                                                        dispatch({
                                                            type: "UPDATE",
                                                            payload: {
                                                                settings: {
                                                                    ...state.settings,
                                                                    mandate_notes_on:
                                                                        state.settings.mandate_notes_on.filter(
                                                                            (
                                                                                e
                                                                            ) =>
                                                                                e !==
                                                                                idx
                                                                        ),
                                                                },
                                                            },
                                                        });
                                                    }
                                                }}
                                            />
                                        }
                                        label={
                                            <Typography
                                                component="span"
                                                variant="medium"
                                            >
                                                Note must
                                            </Typography>
                                        }
                                    />
                                    <Button
                                        onClick={() => {
                                            dispatch({
                                                type: "UPDATE",
                                                payload: {
                                                    settings: {
                                                        ...state.settings,
                                                        rating_reasons: {
                                                            ...state.settings
                                                                .rating_reasons,
                                                            [idx]: [
                                                                ...state
                                                                    .settings
                                                                    .rating_reasons[
                                                                    idx
                                                                ],
                                                                {
                                                                    id: uid(),
                                                                    reason_text:
                                                                        "",
                                                                    option_id:
                                                                        idx,
                                                                },
                                                            ],
                                                        },
                                                    },
                                                },
                                            });
                                        }}
                                        variant="text"
                                    >
                                        + Add Reason
                                    </Button>
                                </Box>
                                {state.settings.rating_reasons[idx].map(
                                    ({ id, reason_text }, reasonIdx) => {
                                        return (
                                            <Box
                                                className="flex gap-3 items-center"
                                                sx={{ mb: 2 }}
                                                key={id}
                                            >
                                                <TextField
                                                    label={`Reason ${
                                                        reasonIdx + 1
                                                    }`}
                                                    variant="filled"
                                                    className="flex-1"
                                                    value={reason_text}
                                                    onChange={(e) => {
                                                        dispatch({
                                                            type: "UPDATE",
                                                            payload: {
                                                                settings: {
                                                                    ...state.settings,
                                                                    rating_reasons:
                                                                        {
                                                                            ...state
                                                                                .settings
                                                                                .rating_reasons,
                                                                            [idx]: [
                                                                                ...state
                                                                                    .settings
                                                                                    .rating_reasons[
                                                                                    idx
                                                                                ],
                                                                            ].map(
                                                                                (
                                                                                    reason
                                                                                ) =>
                                                                                    reason.id !==
                                                                                    id
                                                                                        ? reason
                                                                                        : {
                                                                                              ...reason,
                                                                                              reason_text:
                                                                                                  e
                                                                                                      .target
                                                                                                      .value,
                                                                                          }
                                                                            ),
                                                                        },
                                                                },
                                                            },
                                                        });
                                                    }}
                                                />
                                                <Box
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        dispatch({
                                                            type: "UPDATE",
                                                            payload: {
                                                                settings: {
                                                                    ...state.settings,
                                                                    rating_reasons:
                                                                        {
                                                                            ...state
                                                                                .settings
                                                                                .rating_reasons,
                                                                            [idx]: [
                                                                                ...state
                                                                                    .settings
                                                                                    .rating_reasons[
                                                                                    idx
                                                                                ],
                                                                            ].filter(
                                                                                (
                                                                                    reason
                                                                                ) =>
                                                                                    reason.id !==
                                                                                    id
                                                                            ),
                                                                        },
                                                                },
                                                            },
                                                        });
                                                    }}
                                                >
                                                    <DeleteSvg />
                                                </Box>
                                            </Box>
                                        );
                                    }
                                )}
                            </AccordionDetails>
                        </ParameterSettingsAccordion>
                        {/* <Box className="h-[50px] w-[50px] flex items-center justify-center cursor-pointer">
              <DeleteSvg />
            </Box> */}
                    </Box>
                );
            })}
            <Box className="flex" sx={{ my: 2 }}>
                <ParameterSettingsAccordion
                    expanded={expanded === "na"}
                    onChange={handleChange("na")}
                    className="flex-1"
                >
                    <AccordionSummary expandIcon={<ExpandAccordianSvg />}>
                        <Box
                            className="flex items-center gap-2"
                            sx={{
                                ...(expanded === "na" && {
                                    color: "primary.main",
                                }),
                            }}
                        >
                            <Typography
                                sx={{
                                    ...(!(expanded === "na")
                                        ? { color: "color.999" }
                                        : { fontWeight: 600 }),
                                }}
                            >
                                Response |
                            </Typography>
                            <Typography
                                sx={{
                                    ...(!(expanded === "na")
                                        ? { color: "color.999" }
                                        : {
                                              color: "primary.main",
                                              fontWeight: 600,
                                          }),
                                }}
                                variant="large"
                                className="font-semibold"
                            >
                                Na
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box className="flex justify-between">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.settings.mandate_notes_on.includes(
                                            -1
                                        )}
                                        onChange={(e) => {
                                            if (e.target.checked)
                                                dispatch({
                                                    type: "UPDATE",
                                                    payload: {
                                                        settings: {
                                                            ...state.settings,
                                                            mandate_notes_on:
                                                                Array.from(
                                                                    new Set([
                                                                        ...state
                                                                            .settings
                                                                            .mandate_notes_on,
                                                                        -1,
                                                                    ])
                                                                ),
                                                        },
                                                    },
                                                });
                                            else {
                                                dispatch({
                                                    type: "UPDATE",
                                                    payload: {
                                                        settings: {
                                                            ...state.settings,
                                                            mandate_notes_on:
                                                                state.settings.mandate_notes_on.filter(
                                                                    (e) =>
                                                                        e !== -1
                                                                ),
                                                        },
                                                    },
                                                });
                                            }
                                        }}
                                    />
                                }
                                label={
                                    <Typography
                                        component="span"
                                        variant="medium"
                                    >
                                        Note must
                                    </Typography>
                                }
                            />
                        </Box>
                    </AccordionDetails>
                </ParameterSettingsAccordion>
            </Box>
        </div>
    );
}
