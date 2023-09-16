import * as caApi from "@apis/call_audit";
import { Button, Modal, Skeleton } from "antd";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getAllTeams,
    getTopics,
    openNotification,
} from "../../../../../store/common/actions";
import { getSamplingRules } from "../../../../../store/search/actions";
import { getAuditors } from "../../../../../store/userManagerSlice/userManagerSlice";
import { differenceInDates, getLocaleDate } from "../../../../../tools/helpers";
import { encodeFilterData } from "../../../../../tools/searchFactory";
import apiErrors from "../../../../ApiUtils/common/errors";
import { getSearchResults } from "../../../../ApiUtils/search/index";
import {
    createSamplingRuleApi,
    editSamplingRuleApi,
    getSamplingRuleApi,
} from "../../../../ApiUtils/settings/index";
import settingsConfig from "../../../../constants/Settings/index";
import Loader from "../../../presentational/reusables/Loader";
import StepContent from "../../../presentational/reusables/StepContent";
import Steps from "../../../presentational/reusables/Steps";
import { AssignForm, ConfigureForm, FiltersForm } from "./forms/index";
import RuleModalProvider, { RuleModalContext } from "./RuleModalContext";
import "./sampling_manager.style.scss";

const { SAMPLING_RULE_STEPS: steps } = settingsConfig;

const CreateRuleModal = ({ visible, onCancel, ruleId }) => {
    const {
        domain,
        teams,
        users,
        tags,
        topics,
        versionData: { stats_threshold, has_chat },
    } = useSelector((state) => state.common);
    const { auditors } = useSelector((state) => state.userManagerSlice);
    const reduxDispatch = useDispatch();

    const { currentStep, dispatch, auditType, scheduling, ...state } =
        useContext(RuleModalContext);

    const [loading, setIsLoading] = useState(false);
    const [editing, setIsEditing] = useState(false);
    const [filters, setFilters] = useState([]);

    useEffect(() => {
        if (ruleId && visible) {
            setIsLoading(true);
            getSamplingRuleApi(domain, ruleId)
                .then((res) => {
                    setIsLoading(false);
                    if (res?.status === apiErrors.AXIOSERRORSTATUS) {
                        return openNotification("error", "Error", res.message);
                    }
                    dispatch({
                        type: "INITIALISE_MODAL",
                        payload: { ...res, stats_threshold },
                    });
                    setFilters(res.filters);
                })
                .catch((err) => {
                    openNotification("error", "Error", err);
                    setIsLoading(false);
                });
        }
    }, [visible]);
    useEffect(() => {
        if (!auditors.length) {
            reduxDispatch(getAuditors());
        }
        if (!teams.length) {
            reduxDispatch(getAllTeams());
        }
        if (!topics.length) {
            reduxDispatch(getTopics());
        }
    }, []);
    useEffect(() => {
        if (state.activeTemplateKey && filters.length) {
            caApi
                .getSearchAuditTemplate(domain, state.activeTemplateKey)
                .then((res) => {
                    if (res.status === apiErrors.AXIOSERRORSTATUS) {
                        openNotification("error", "Error", res.message);
                    } else {
                        if (res.template && res.categories) {
                            let questions = [];
                            const { categories } = res;
                            for (let i = 0; i < categories.length; i++) {
                                for (
                                    let j = 0;
                                    j < categories[i].questions.length;
                                    j++
                                ) {
                                    questions.push(categories[i].questions[j]);
                                }
                            }

                            const questionFilters = [
                                {
                                    question_text: "Call Score",
                                    id: 0,
                                    question_type: "yes_no",
                                },
                                ...questions.map((question) => ({
                                    ...question,
                                })),
                            ];

                            dispatch({
                                type: "SET_QUESTIONS",
                                payload: questionFilters,
                            });
                            dispatch({
                                type: "INITIALISE_QUESTIONS",
                                payload: filters,
                            });
                        }
                    }
                });
            // });
        }
    }, [state.activeTemplateKey, filters]);
    useEffect(() => {
        dispatch({
            type: "INITIALISE_FILTERS",
            payload: { teams, tags, reps: users, auditors, filterReps: users },
        });
    }, [teams, tags, users, auditors]);

    const createSamplingRule = () => {
        let requestData = {
            name: state.name,
            desc: state.description,
            audit_type: auditType,
            scheduling: scheduling,
            filters: encodeFilterData({ ...state, stats_threshold, has_chat }),
            target: {
                quantity: state.target.quantity,
                frequency: state.target.frequency,
                interval: state.target.interval,
            },
            dist_or_alloc: state.allocation.map(({ auditors, ...rest }) => {
                if (auditType === "ai") {
                    return {
                        ...rest,
                    };
                }
                return { auditors, ...rest };
            }),
        };

        if (auditType === "manual") {
            requestData = {
                ...requestData,
                target: {
                    ...requestData.target,
                    // aggregate: state.target.aggregate.value,
                },
            };
        }

        if (ruleId) {
            setIsEditing(true);
            editSamplingRuleApi(domain, ruleId, requestData)
                .then((res) => {
                    setIsEditing(false);
                    if (res?.status === apiErrors.AXIOSERRORSTATUS) {
                        return openNotification("error", "Error", res.message);
                    }
                    reduxDispatch(getSamplingRules());
                    onCancel();
                })
                .catch((err) => {
                    setIsEditing(false);
                    openNotification("error", "Error", err);
                });
        } else {
            createSamplingRuleApi(domain, requestData)
                .then((res) => {
                    setIsEditing(false);
                    if (res?.status === apiErrors.AXIOSERRORSTATUS) {
                        return openNotification("error", "Error", res.message);
                    }
                    reduxDispatch(getSamplingRules());
                    dispatch({ type: "RESET_MODAL" });
                    onCancel();
                })
                .catch((err) => {
                    setIsEditing(false);
                    openNotification("error", "Error", err);
                });
        }
    };
    return (
        <Modal
            open={visible}
            centered
            onCancel={onCancel}
            title={`${ruleId ? "Edit" : "Create"} Sampling Rule`}
            width="1000px"
            footer={
                !loading && (
                    <>
                        {currentStep !== 0 && (
                            <Button
                                type="default"
                                onClick={() => {
                                    dispatch({ type: "PREV_STEP" });
                                }}
                            >
                                BACK
                            </Button>
                        )}
                        <Button
                            type="primary"
                            onClick={() => {
                                if (currentStep !== steps.length - 1) {
                                    if (currentStep === 0) {
                                        if (!state.name) {
                                            openNotification(
                                                "error",
                                                "Error",
                                                "Enter the name of the sampling rule"
                                            );
                                        } else {
                                            dispatch({ type: "NEXT_STEP" });
                                        }
                                    } else if (currentStep === 1) {
                                        getSearchResults({
                                            data: encodeFilterData({
                                                ...state,
                                                stats_threshold,
                                                has_chat,
                                            }),
                                        }).then((res) =>
                                            dispatch({
                                                type: "SET_CALL_COUNT",
                                                payload: res?.count || 0,
                                            })
                                        );

                                        dispatch({ type: "NEXT_STEP" });
                                    }
                                } else {
                                    if (!state.target.quantity) {
                                        return openNotification(
                                            "error",
                                            "Error",
                                            "Enter target quantity"
                                        );
                                    }
                                    if (auditType === "manual") {
                                        let flag = 0;
                                        state.allocation.forEach((alloc) => {
                                            if (alloc?.auditors?.length === 0) {
                                                flag = 1;
                                            }
                                        });
                                        if (flag) {
                                            return openNotification(
                                                "error",
                                                "Error",
                                                "Select auditors for allocation"
                                            );
                                        }
                                    }
                                    createSamplingRule();
                                    // dispatch({ type: 'SET_STEP', payload: 0 });

                                    // onCancel();
                                }
                            }}
                            loading={editing}
                            disabled={editing}
                        >
                            {currentStep === steps.length - 1
                                ? `${ruleId ? "EDIT" : "CREATE"} RULE`
                                : "NEXT"}
                        </Button>
                    </>
                )
            }
            wrapClassName="step_modal"
        >
            <Loader loading={loading}>
                <div className="step_modal--body">
                    <div className="step_modal--steps">
                        <Steps
                            items={steps}
                            current={currentStep}
                            setCurrent={(value) => {
                                if (currentStep === 0) {
                                    if (!state.name) {
                                        openNotification(
                                            "error",
                                            "Error",
                                            "Enter the name of the sampling rule"
                                        );
                                    } else {
                                        dispatch({
                                            type: "SET_STEP",
                                            payload: value,
                                        });
                                    }
                                } else if (currentStep === 1) {
                                    getSearchResults({
                                        data: encodeFilterData({
                                            ...state,
                                            stats_threshold,
                                            has_chat,
                                        }),
                                    }).then((res) =>
                                        dispatch({
                                            type: "SET_CALL_COUNT",
                                            payload: res.count || 0,
                                        })
                                    );

                                    dispatch({
                                        type: "SET_STEP",
                                        payload: value,
                                    });
                                } else {
                                    dispatch({
                                        type: "SET_STEP",
                                        payload: value,
                                    });
                                }
                            }}
                            alignment="vertical"
                        />
                    </div>
                    <div className="step_modal--content">
                        {currentStep === 0 ? (
                            <StepContent
                                title="Configure"
                                description="Give sampling name and description"
                                form={<ConfigureForm />}
                            />
                        ) : currentStep === 1 ? (
                            <StepContent
                                title="Filters"
                                additionalTitle={`${
                                    auditType === "ai" ? "AI" : "Manual"
                                } Audit | ${
                                    scheduling === "recurring"
                                        ? "Recurring"
                                        : "One Time"
                                }`}
                                additionalContent={
                                    auditType === "ai" && "AI Audit"
                                }
                                description="Choose filters for this sampling rule."
                                form={
                                    <FiltersForm context={RuleModalContext} />
                                }
                            />
                        ) : (
                            <StepContent
                                title="Assign"
                                additionalTitle={`${
                                    auditType === "ai" ? "AI" : "Manual"
                                } Audit | ${
                                    scheduling === "recurring"
                                        ? "Recurring"
                                        : "One Time"
                                }`}
                                description={
                                    auditType === "manual" ? (
                                        <span>
                                            On Average{" "}
                                            <span className="desc_value">
                                                {state.callCount !== null ? (
                                                    state.callCount
                                                ) : (
                                                    <span>
                                                        <Skeleton
                                                            paragraph={false}
                                                        />
                                                    </span>
                                                )}
                                            </span>{" "}
                                            calls have been identified{" "}
                                            {state.activeDurationKey === null ||
                                            state.dateOptions[
                                                state.activeDateRangeKey
                                            ].dateRange[1] === null
                                                ? null
                                                : differenceInDates(
                                                      new Date(),
                                                      state.dateOptions[
                                                          state
                                                              .activeDateRangeKey
                                                      ].dateRange[1]
                                                  ) < 1
                                                ? `in last ${Math.round(
                                                      differenceInDates(
                                                          state.dateOptions[
                                                              state
                                                                  .activeDateRangeKey
                                                          ].dateRange[1],
                                                          state.dateOptions[
                                                              state
                                                                  .activeDateRangeKey
                                                          ].dateRange[0]
                                                      )
                                                  )} days `
                                                : differenceInDates(
                                                      state.dateOptions[
                                                          state
                                                              .activeDateRangeKey
                                                      ].dateRange[1],
                                                      state.dateOptions[
                                                          state
                                                              .activeDateRangeKey
                                                      ].dateRange[0]
                                                  ) < 1
                                                ? `on ${getLocaleDate(
                                                      state.dateOptions[
                                                          state
                                                              .activeDateRangeKey
                                                      ].dateRange[0]
                                                  )}`
                                                : `between ${getLocaleDate(
                                                      state.dateOptions[
                                                          state
                                                              .activeDateRangeKey
                                                      ].dateRange[0]
                                                  )} and ${getLocaleDate(
                                                      state.dateOptions[
                                                          state
                                                              .activeDateRangeKey
                                                      ].dateRange[1]
                                                  )}`}
                                        </span>
                                    ) : (
                                        <span>
                                            <span className="desc_value">
                                                {state.callCount !== null ? (
                                                    state.callCount
                                                ) : (
                                                    <span>
                                                        <Skeleton
                                                            paragraph={false}
                                                        />
                                                    </span>
                                                )}
                                            </span>{" "}
                                            calls have been identified under
                                            this rule
                                        </span>
                                    )
                                }
                                form={<AssignForm />}
                            />
                        )}
                    </div>
                </div>
            </Loader>
        </Modal>
    );
};

const withContextModal = (props) => {
    return (
        <RuleModalProvider>
            <CreateRuleModal {...props} />
        </RuleModalProvider>
    );
};

export default withContextModal;
