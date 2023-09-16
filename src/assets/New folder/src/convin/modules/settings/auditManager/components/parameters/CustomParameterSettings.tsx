import BorderedBox from "@convin/components/custom_components/BorderedBox";
import GenericSelect from "@convin/components/select/GenericSelect";
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
import useParameterStateContext from "../hooks/useParameterStateContext";
import { uid } from "tools/helpers";
import { ParameterSettingsAccordion } from "./BooleanPrameterSettings";
import ExpandAccordianSvg from "@convin/components/svg/ExpandAccordianSvg";
import GenericMultipleSelect from "@convin/components/select/GenericMultipleSelect";
import { Violation } from "@convin/type/Violation";
import { DeleteSvg } from "@convin/components/svg";
import { useState } from "react";
import { useGetViolationsQuery } from "@convin/redux/services/settings/auditManager.service";
import { isDefined } from "@convin/utils/helper/common.helper";

export default function CustomParameterSettings(): JSX.Element {
    const { state, dispatch } = useParameterStateContext();
    const [expanded, setExpanded] = useState<string | number | false>(false);
    const { data: violationList, isFetching: violationListIsFetching } =
        useGetViolationsQuery();
    const handleChange =
        (panel: string | number) =>
        (event: React.SyntheticEvent, isExpanded: boolean) => {
            if (isDefined(panel)) setExpanded(isExpanded ? panel : false);
        };
    return (
        <div>
            <Box sx={{ my: 3 }} className="flex justify-center gap-3 w-[300px]">
                <GenericSelect<number>
                    className="flex-1"
                    label="Type"
                    options={[
                        { id: 0, value: "Absolute" },
                        { id: 1, value: "Deduction" },
                    ]}
                    value={Number(state.settings.is_deduction)}
                    handleChange={(e) => {
                        dispatch({
                            type: "UPDATE",
                            payload: {
                                ...state,
                                settings: {
                                    ...state.settings,
                                    is_deduction: Boolean(e),
                                },
                            },
                        });
                    }}
                />
                <GenericSelect<number>
                    className="flex-1"
                    label="Applied Level"
                    options={[{ id: 1, value: "Template" }]}
                    value={Number(state.settings.is_template_level)}
                    handleChange={() => {
                        return;
                    }}
                />
            </Box>
            <BorderedBox className="flex-shrink-0 w-[190px]">
                <Button
                    variant="text"
                    className="uppercase w-full"
                    onClick={() => {
                        dispatch({
                            type: "UPDATE",
                            payload: {
                                ...state,
                                settings: {
                                    ...state.settings,
                                    custom: [
                                        ...state?.settings?.custom,
                                        {
                                            id: uid(),
                                            name: "",
                                            default: false,
                                            reasons: [],
                                            mandate_notes: false,
                                            weight: 0,
                                            violation: [],
                                        },
                                    ],
                                },
                            },
                        });
                    }}
                >
                    + Custom Response
                </Button>
            </BorderedBox>
            {state.settings?.custom?.map(
                ({ id, weight, mandate_notes, violation, reasons, name }) => {
                    return (
                        <Box className="flex" sx={{ my: 2 }} key={id}>
                            <ParameterSettingsAccordion
                                expanded={expanded === id}
                                onChange={handleChange(id)}
                                className="flex-1"
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandAccordianSvg />}
                                >
                                    <Box
                                        className="flex items-center gap-2 w-full"
                                        sx={{
                                            ...(expanded === id && {
                                                color: "primary.main",
                                            }),
                                        }}
                                    >
                                        {expanded === id ? (
                                            <>
                                                <TextField
                                                    value={name}
                                                    onChange={(e) => {
                                                        dispatch({
                                                            type: "UPDATE",
                                                            payload: {
                                                                settings: {
                                                                    ...state.settings,
                                                                    custom: [
                                                                        ...state
                                                                            ?.settings
                                                                            ?.custom,
                                                                    ].map(
                                                                        (
                                                                            item
                                                                        ) => {
                                                                            return item.id ===
                                                                                id
                                                                                ? {
                                                                                      ...item,
                                                                                      name: e
                                                                                          .target
                                                                                          .value,
                                                                                  }
                                                                                : item;
                                                                        }
                                                                    ),
                                                                },
                                                            },
                                                        });
                                                    }}
                                                    variant="filled"
                                                    label="Name"
                                                    className="flex-1 mr-4"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    disabled={expanded === -1}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <Typography
                                                    sx={{
                                                        ...(!(expanded === id)
                                                            ? {
                                                                  color: "color.999",
                                                              }
                                                            : {
                                                                  fontWeight: 600,
                                                              }),
                                                    }}
                                                >
                                                    Response |
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        ...(!(expanded === id)
                                                            ? {
                                                                  color: "color.999",
                                                              }
                                                            : {
                                                                  color: "primary.main",
                                                                  fontWeight: 600,
                                                              }),
                                                    }}
                                                    variant="large"
                                                    className="font-semibold"
                                                >
                                                    {name || "Custom Response"}
                                                </Typography>
                                            </>
                                        )}
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {id !== -1 ? (
                                        <Box className="flex gap-3">
                                            <TextField
                                                label={
                                                    state.settings.is_deduction
                                                        ? "Deduction"
                                                        : "Weight"
                                                }
                                                variant="filled"
                                                className="w-[84px]"
                                                value={weight}
                                                type="number"
                                                onChange={(e) => {
                                                    dispatch({
                                                        type: "UPDATE",
                                                        payload: {
                                                            settings: {
                                                                ...state.settings,
                                                                custom: [
                                                                    ...state
                                                                        ?.settings
                                                                        ?.custom,
                                                                ].map(
                                                                    (item) => {
                                                                        return item.id ===
                                                                            id
                                                                            ? {
                                                                                  ...item,
                                                                                  weight: e
                                                                                      .target
                                                                                      .value,
                                                                              }
                                                                            : item;
                                                                    }
                                                                ),
                                                            },
                                                        },
                                                    });
                                                }}
                                            />
                                            <GenericMultipleSelect<Violation>
                                                className="flex-1"
                                                label="Violations"
                                                data={violationList || []}
                                                loading={
                                                    violationListIsFetching
                                                }
                                                values={violation}
                                                setValues={(val: number[]) => {
                                                    dispatch({
                                                        type: "UPDATE",
                                                        payload: {
                                                            settings: {
                                                                ...state.settings,
                                                                custom: [
                                                                    ...state
                                                                        ?.settings
                                                                        ?.custom,
                                                                ].map(
                                                                    (item) => {
                                                                        return item.id ===
                                                                            id
                                                                            ? {
                                                                                  ...item,
                                                                                  violation:
                                                                                      val,
                                                                              }
                                                                            : item;
                                                                    }
                                                                ),
                                                            },
                                                        },
                                                    });
                                                }}
                                            />
                                        </Box>
                                    ) : (
                                        <></>
                                    )}

                                    <Box
                                        className="flex justify-between"
                                        sx={{ ...(id !== -1 && { my: 3 }) }}
                                    >
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={mandate_notes}
                                                    onChange={(e) => {
                                                        dispatch({
                                                            type: "UPDATE",
                                                            payload: {
                                                                settings: {
                                                                    ...state.settings,
                                                                    custom: [
                                                                        ...state
                                                                            ?.settings
                                                                            ?.custom,
                                                                    ].map(
                                                                        (
                                                                            item
                                                                        ) => {
                                                                            return item.id ===
                                                                                id
                                                                                ? {
                                                                                      ...item,
                                                                                      mandate_notes:
                                                                                          e
                                                                                              .target
                                                                                              .checked,
                                                                                  }
                                                                                : item;
                                                                        }
                                                                    ),
                                                                },
                                                            },
                                                        });
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
                                        {id !== -1 ? (
                                            <Button
                                                onClick={() => {
                                                    dispatch({
                                                        type: "UPDATE",
                                                        payload: {
                                                            settings: {
                                                                ...state.settings,
                                                                custom: [
                                                                    ...state
                                                                        ?.settings
                                                                        ?.custom,
                                                                ].map(
                                                                    (item) => {
                                                                        return item.id ===
                                                                            id
                                                                            ? {
                                                                                  ...item,
                                                                                  reasons:
                                                                                      [
                                                                                          ...reasons,
                                                                                          {
                                                                                              id: uid(),
                                                                                              reason_text:
                                                                                                  "",
                                                                                              option_id:
                                                                                                  id,
                                                                                          },
                                                                                      ],
                                                                              }
                                                                            : item;
                                                                    }
                                                                ),
                                                            },
                                                        },
                                                    });
                                                }}
                                                variant="text"
                                            >
                                                + Add Reason
                                            </Button>
                                        ) : (
                                            <></>
                                        )}
                                    </Box>
                                    {reasons.map(
                                        (
                                            { id: reasonId, reason_text },
                                            reasonIdx
                                        ) => {
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
                                                                        custom: [
                                                                            ...state
                                                                                ?.settings
                                                                                ?.custom,
                                                                        ].map(
                                                                            (
                                                                                item
                                                                            ) => {
                                                                                return item.id ===
                                                                                    id
                                                                                    ? {
                                                                                          ...item,
                                                                                          reasons:
                                                                                              [
                                                                                                  ...reasons,
                                                                                              ].map(
                                                                                                  (
                                                                                                      r
                                                                                                  ) =>
                                                                                                      r.id ===
                                                                                                      reasonId
                                                                                                          ? {
                                                                                                                ...r,
                                                                                                                reason_text:
                                                                                                                    e
                                                                                                                        .target
                                                                                                                        .value,
                                                                                                            }
                                                                                                          : r
                                                                                              ),
                                                                                      }
                                                                                    : item;
                                                                            }
                                                                        ),
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
                                                                        custom: [
                                                                            ...state
                                                                                ?.settings
                                                                                ?.custom,
                                                                        ].map(
                                                                            (
                                                                                item
                                                                            ) => {
                                                                                return item.id ===
                                                                                    id
                                                                                    ? {
                                                                                          ...item,
                                                                                          reasons:
                                                                                              [
                                                                                                  ...reasons,
                                                                                              ].filter(
                                                                                                  (
                                                                                                      r
                                                                                                  ) =>
                                                                                                      r.id !==
                                                                                                      reasonId
                                                                                              ),
                                                                                      }
                                                                                    : item;
                                                                            }
                                                                        ),
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
                            {id !== -1 ? (
                                <Box
                                    className="h-[50px] w-[50px] flex items-center justify-center cursor-pointer"
                                    onClick={() => {
                                        dispatch({
                                            type: "UPDATE",
                                            payload: {
                                                settings: {
                                                    ...state.settings,
                                                    custom: [
                                                        ...state?.settings
                                                            ?.custom,
                                                    ].filter((item) => {
                                                        return item.id !== id;
                                                    }),
                                                },
                                            },
                                        });
                                    }}
                                >
                                    <DeleteSvg />
                                </Box>
                            ) : (
                                <></>
                            )}
                        </Box>
                    );
                }
            )}
        </div>
    );
}
