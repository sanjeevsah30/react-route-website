import Accordion, { AccordionProps } from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    TextField,
    styled,
} from "@mui/material";
import ExpandAccordianSvg from "@convin/components/svg/ExpandAccordianSvg";
import { useGetViolationsQuery } from "@convin/redux/services/settings/auditManager.service";
import GenericMultipleSelect from "@convin/components/select/GenericMultipleSelect";
import { Violation } from "@convin/type/Violation";
import { DeleteSvg } from "@convin/components/svg";
import useParameterStateContext from "../hooks/useParameterStateContext";
import { uid } from "tools/helpers";

export const ParameterSettingsAccordion = styled((props: AccordionProps) => (
    <Accordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "6px",
    "& .Mui-expanded": {
        background: "white !important",
        borderRadius: "inherit",
    },
    "&:before": {
        display: "none",
    },
}));

export default function BooleanPrameterSettings(): JSX.Element {
    const { state, dispatch } = useParameterStateContext();
    const [expanded, setExpanded] = useState<string | false>(false);
    const { data: violationList, isFetching: violationListIsFetching } =
        useGetViolationsQuery();
    const handleChange =
        (panel: string) =>
        (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    return (
        <div>
            <Box className="flex" sx={{ my: 2 }}>
                <ParameterSettingsAccordion
                    expanded={expanded === "yes"}
                    onChange={handleChange("yes")}
                    className="flex-1"
                >
                    <AccordionSummary expandIcon={<ExpandAccordianSvg />}>
                        <Box
                            className="flex items-center gap-2"
                            sx={{
                                ...(expanded === "yes" && {
                                    color: "primary.main",
                                }),
                            }}
                        >
                            <Typography
                                sx={{
                                    ...(!(expanded === "yes")
                                        ? { color: "color.999" }
                                        : { fontWeight: 600 }),
                                }}
                            >
                                Response |
                            </Typography>
                            <Typography
                                sx={{
                                    ...(!(expanded === "yes")
                                        ? { color: "color.999" }
                                        : {
                                              color: "primary.main",
                                              fontWeight: 600,
                                          }),
                                }}
                                variant="large"
                                className="font-semibold"
                            >
                                Yes
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box className="flex gap-3">
                            <TextField
                                label="Weight"
                                variant="filled"
                                className="w-[84px]"
                                value={state.settings.yes_weight}
                                type="number"
                                onChange={(e) => {
                                    dispatch({
                                        type: "UPDATE",
                                        payload: {
                                            settings: {
                                                ...state.settings,
                                                yes_weight: e.target.value,
                                            },
                                        },
                                    });
                                }}
                            />
                            <GenericMultipleSelect<Violation>
                                className="flex-1"
                                label="Violations"
                                data={violationList || []}
                                loading={violationListIsFetching}
                                values={
                                    state.settings.boolean_violations.yes_weight
                                }
                                setValues={(val: number[]) => {
                                    dispatch({
                                        type: "UPDATE",
                                        payload: {
                                            settings: {
                                                ...state.settings,
                                                boolean_violations: {
                                                    ...state.settings
                                                        .boolean_violations,
                                                    yes_weight: val,
                                                },
                                            },
                                        },
                                    });
                                }}
                            />
                        </Box>
                        <Box className="flex justify-between" sx={{ my: 3 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.settings.mandate_notes_on.includes(
                                            1
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
                                                                        1,
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
                                                                        e !== 1
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
                                                boolean_reasons: {
                                                    ...state.settings
                                                        .boolean_reasons,
                                                    yes_reasons: [
                                                        ...state.settings
                                                            .boolean_reasons
                                                            .yes_reasons,
                                                        {
                                                            id: uid(),
                                                            reason_text: "",
                                                            option_id: 1,
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
                        {state.settings.boolean_reasons.yes_reasons.map(
                            ({ id, reason_text }, idx) => {
                                return (
                                    <Box
                                        className="flex gap-3 items-center"
                                        sx={{ mb: 2 }}
                                        key={id}
                                    >
                                        <TextField
                                            label={`Reason ${idx + 1}`}
                                            variant="filled"
                                            className="flex-1"
                                            value={reason_text}
                                            onChange={(e) => {
                                                dispatch({
                                                    type: "UPDATE",
                                                    payload: {
                                                        settings: {
                                                            ...state.settings,
                                                            boolean_reasons: {
                                                                ...state
                                                                    .settings
                                                                    .boolean_reasons,
                                                                yes_reasons: [
                                                                    ...state
                                                                        .settings
                                                                        .boolean_reasons
                                                                        .yes_reasons,
                                                                ].map(
                                                                    (reason) =>
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
                                                            boolean_reasons: {
                                                                ...state
                                                                    .settings
                                                                    .boolean_reasons,
                                                                yes_reasons: [
                                                                    ...state
                                                                        .settings
                                                                        .boolean_reasons
                                                                        .yes_reasons,
                                                                ].filter(
                                                                    (reason) =>
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
            </Box>

            <Box className="flex" sx={{ my: 2 }}>
                <ParameterSettingsAccordion
                    expanded={expanded === "no"}
                    onChange={handleChange("no")}
                    className="flex-1"
                >
                    <AccordionSummary expandIcon={<ExpandAccordianSvg />}>
                        <Box
                            className="flex items-center gap-2"
                            sx={{
                                ...(expanded === "no" && {
                                    color: "primary.main",
                                }),
                            }}
                        >
                            <Typography
                                sx={{
                                    ...(!(expanded === "no")
                                        ? { color: "color.999" }
                                        : { fontWeight: 600 }),
                                }}
                            >
                                Response |
                            </Typography>
                            <Typography
                                sx={{
                                    ...(!(expanded === "no")
                                        ? { color: "color.999" }
                                        : {
                                              color: "primary.main",
                                              fontWeight: 600,
                                          }),
                                }}
                                variant="large"
                                className="font-semibold"
                            >
                                No
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box className="flex gap-3">
                            <TextField
                                label="Weight"
                                variant="filled"
                                className="w-[84px]"
                                value={state.settings.no_weight}
                                type="number"
                                onChange={(e) => {
                                    dispatch({
                                        type: "UPDATE",
                                        payload: {
                                            settings: {
                                                ...state.settings,
                                                no_weight: e.target.value,
                                            },
                                        },
                                    });
                                }}
                            />
                            <GenericMultipleSelect<Violation>
                                className="flex-1"
                                label="Violations"
                                data={violationList || []}
                                loading={violationListIsFetching}
                                values={
                                    state.settings.boolean_violations.no_weight
                                }
                                setValues={(val: number[]) => {
                                    dispatch({
                                        type: "UPDATE",
                                        payload: {
                                            settings: {
                                                ...state.settings,
                                                boolean_violations: {
                                                    ...state.settings
                                                        .boolean_violations,
                                                    no_weight: val,
                                                },
                                            },
                                        },
                                    });
                                }}
                            />
                        </Box>
                        <Box className="flex justify-between" sx={{ my: 3 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={state.settings.mandate_notes_on.includes(
                                            0
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
                                                                        0,
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
                                                                        e !== 0
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
                                                boolean_reasons: {
                                                    ...state.settings
                                                        .boolean_reasons,
                                                    no_reasons: [
                                                        ...state.settings
                                                            .boolean_reasons
                                                            .no_reasons,
                                                        {
                                                            id: uid(),
                                                            reason_text: "",
                                                            option_id: 0,
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
                        {state.settings.boolean_reasons.no_reasons.map(
                            ({ id, reason_text }, idx) => {
                                return (
                                    <Box
                                        className="flex gap-3 items-center"
                                        sx={{ mb: 2 }}
                                        key={id}
                                    >
                                        <TextField
                                            label={`Reason ${idx + 1}`}
                                            variant="filled"
                                            className="flex-1"
                                            value={reason_text}
                                            onChange={(e) => {
                                                dispatch({
                                                    type: "UPDATE",
                                                    payload: {
                                                        settings: {
                                                            ...state.settings,
                                                            boolean_reasons: {
                                                                ...state
                                                                    .settings
                                                                    .boolean_reasons,
                                                                no_reasons: [
                                                                    ...state
                                                                        .settings
                                                                        .boolean_reasons
                                                                        .no_reasons,
                                                                ].map(
                                                                    (reason) =>
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
                                                            boolean_reasons: {
                                                                ...state
                                                                    .settings
                                                                    .boolean_reasons,
                                                                no_reasons: [
                                                                    ...state
                                                                        .settings
                                                                        .boolean_reasons
                                                                        .no_reasons,
                                                                ].filter(
                                                                    (reason) =>
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
            </Box>
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
