import { openNotification } from "../../../../../store/common/actions";
import { isArrayEqual, uid } from "../../../../../tools/helpers";
import {
    decodeQuestionsFilter,
    decodeTracker,
    getDateFilter,
} from "../../../../../tools/searchFactory";
import TopbarConfig from "../../../../constants/Topbar/index";

export const initialState = {
    name: null,
    description: null,
    auditType: "ai",
    scheduling: "recurring",
    teams: [],
    reps: [],
    filterReps: [],
    auditors: [],
    tags: [],
    selectedTeams: [],
    selectedReps: [],
    selectedTags: [],
    currentStep: 0,
    callCount: null,
    activeDurationKey: null,
    activeTemplateKey: null,
    selectedCallTypes: [],
    activeClientKey: null,
    activeRecMediumKey: null,
    activeStageKey: null,
    activeProcStatusKey: null,
    activeDateRangeKey: "all",
    activeJoinDateRangeKey: null,
    activeTopicKey: null,
    meetingType: "call",
    keywords: [],
    keywordPresent: true,
    keywordSaidBy: [],
    target: {
        quantity: null,
        frequency: "calls",
        interval: "day",
        aggregate: null,
    },
    allocation: [
        {
            filter: "agent",
            dist_frequency: "equally",
            auditors: [],
        },
    ],
    allocationLength: 1,
    minCallScore: null,
    maxCallScore: null,
    questions: [],
    activeQuestions: {},
    questionCountRep: [0, 100],
    questionCountOther: [0, 100],
    interactivity: {
        clientLongestMonologue: [0, 100],
        clientTalkRatio: [0, 100],
        interactivity: [-10, 10],
        ownerLongestMonologue: [0, 100],
        ownerTalkRatio: [0, 100],
        patience: [0, 100],
        interruption_count: [null, null],
        talktime: [null, null],
    },
};
const ruleModalReducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case "NEXT_STEP":
            return {
                ...state,
                currentStep: state.currentStep + 1,
            };
        case "PREV_STEP":
            return {
                ...state,
                currentStep: state.currentStep - 1,
            };
        case "SET_STEP":
            return { ...state, currentStep: payload };
        case "RESET_MODAL":
            const {
                teams,
                tags,
                reps,
                filterReps: filteredReps,
                auditors,
            } = state;

            return {
                ...state,
                ...initialState,
                teams,
                tags,
                reps,
                auditors,
                filterReps: filteredReps,
                allocation: [
                    {
                        filter: "agent",
                        dist_frequency: "equally",
                        auditors: [],
                    },
                ],
            };
        case "INITIALISE_FILTERS":
            return { ...state, ...payload };
        case "INITIALISE_MODAL":
            const {
                name,
                audit_type: auditType,
                desc: description,
                scheduling,
                filters,
                dist_or_alloc: allocation,
                target,
            } = payload;
            const decodedFilters = decodeTracker(filters);
            const {
                client: activeClientKey,
                filterTags: selectedTags,
                repId: selectedReps,
                teamId: selectedTeams,
                searchKeywords,
                processing_status: activeProcStatusKey,
                conferenceMedium: activeRecMediumKey,
                templateId: activeTemplateKey,
                callType: selectedCallTypes,
                stageId: activeStageKey,
                startTime,
                endTime,
                startJoinTime,
                endJoinTime,
                duration,
                call_score,
                interactivity,
                questions,
                topics,
                meeting_type,
            } = decodedFilters;
            const teamSet = new Set(selectedTeams);
            let filterReps =
                teamSet.size === 0
                    ? state.reps
                    : state.reps.filter(
                          ({ team }) =>
                              teamSet.has(team) || teamSet.has(String(team))
                      );

            const { keywords, isInCall: keywordPresent } = searchKeywords;
            let saidBy = [];
            if (searchKeywords?.saidByOwner) {
                saidBy.push("Rep");
            }
            if (searchKeywords?.saidByClient) {
                saidBy.push("Others");
            }
            let initializedState = {};
            if (duration) {
                let flag = 0;
                for (let option in state.durationOptions) {
                    if (
                        isArrayEqual(
                            state.durationOptions[option].value,
                            duration
                        )
                    ) {
                        initializedState = {
                            ...initializedState,
                            activeDurationKey: option,
                        };
                        flag = 1;
                        break;
                    }
                }
                if (flag === 0) {
                    let id = uid();
                    const optionName =
                        duration[0] && duration[1]
                            ? `between ${duration[0]} - ${duration[1]} MIN`
                            : duration[0]
                            ? `above ${duration[0]} MIN`
                            : `below ${duration[1]} MIN`;
                    initializedState = {
                        ...initializedState,
                        durationOptions: {
                            ...state.durationOptions,
                            [id]: {
                                value: duration,
                                text: optionName,
                            },
                        },
                        activeDurationKey: id,
                    };
                }
            } else {
                initializedState = {
                    ...initializedState,
                    activeDurationKey: 0,
                };
            }
            let dateOption = {
                ...state.dateOptions,
            };

            if (auditType === "manual" && scheduling === "recurring") {
                initializedState = {
                    ...state,
                    ...initializedState,
                    activeDateRangeKey: "yesterday",
                };
            } else if (!startTime && !endTime) {
                initializedState = {
                    ...state,
                    ...initializedState,
                    activeDateRangeKey: "all",
                };
            } else {
                const dateFilter = getDateFilter(startTime, endTime);
                if (dateFilter?.isCustom) {
                    dateOption = {
                        ...dateOption,
                        [dateFilter.match.name]: {
                            dateRange: dateFilter?.match?.dateRange,
                            name: dateFilter.match.name,
                        },
                    };
                    initializedState = {
                        ...state,
                        ...initializedState,
                        dateOptions: {
                            ...dateOption,
                        },
                        activeDateRangeKey: dateFilter.match.name,
                    };
                } else {
                    initializedState = {
                        ...state,
                        ...initializedState,
                        activeDateRangeKey: dateFilter.match.name,
                    };
                }
            }

            if (!startJoinTime && !endJoinTime) {
                initializedState = {
                    ...state,
                    ...initializedState,
                    activeJoinDateRangeKey: "all",
                };
            } else {
                const dateJoinFilter = getDateFilter(
                    startJoinTime,
                    endJoinTime
                );
                if (dateJoinFilter?.isCustom) {
                    initializedState = {
                        ...state,
                        ...initializedState,
                        dateOptions: {
                            ...dateOption,
                            [dateJoinFilter.match.name]: {
                                dateRange: dateJoinFilter?.match?.dateRange,
                                name: dateJoinFilter.match.name,
                            },
                        },
                        activeJoinDateRangeKey: dateJoinFilter.match.name,
                    };
                } else {
                    initializedState = {
                        ...state,
                        ...initializedState,
                        activeJoinDateRangeKey: dateJoinFilter.match.name,
                    };
                }
            }
            let activeQuestions = state.activeQuestions;
            // if (call_score?.length) {
            //     if (call_score[0] === stats_threshold?.good) {
            //         activeQuestions = {
            //             ...activeQuestions,
            //             0: {
            //                 question_text: 'Call Score',
            //                 id: 0,
            //                 question_type: 'yes_no',
            //                 checked: 1,
            //             },
            //         };
            //     } else if (
            //         call_score[0] === stats_threshold?.average &&
            //         call_score[1] === stats_threshold?.good
            //     ) {
            //         activeQuestions = {
            //             ...activeQuestions,
            //             0: {
            //                 question_text: 'Call Score',
            //                 id: 0,
            //                 question_type: 'yes_no',
            //                 checked: 0,
            //             },
            //         };
            //     } else if (call_score[1] === stats_threshold.bad) {
            //         activeQuestions = {
            //             ...activeQuestions,
            //             0: {
            //                 question_text: 'Call Score',
            //                 id: 0,
            //                 question_type: 'yes_no',
            //                 checked: -1,
            //             },
            //         };
            //     }
            // }
            initializedState = {
                ...initialState,
                durationOptions: state.durationOptions,
                dateOptions: state.dateOptions,
                ...initializedState,
                activeClientKey,
                selectedCallTypes:
                    typeof selectedCallTypes === "number"
                        ? [selectedCallTypes]
                        : selectedCallTypes,
                activeProcStatusKey,
                activeRecMediumKey,
                activeStageKey,
                activeTemplateKey,
                selectedTags,
                selectedReps,
                selectedTeams,
                filterReps,
                name,
                auditType,
                description,
                scheduling,
                keywords,
                keywordPresent,
                keywordSaidBy: saidBy,
                target,
                allocationLength: allocation.length,
                allocation,
                minCallScore: call_score?.[0] || null,
                maxCallScore: call_score?.[1] || null,
                interactivity,
                questionCountRep:
                    questions?.byOwner || initialState.questionCountRep,
                questionCountOther:
                    questions?.byClient || initialState.questionCountOther,
                activeQuestions,
                activeTopicKey: topics?.topic || null,
                meetingType: meeting_type || "call",
            };
            return initializedState;
        case "INITIALISE_QUESTIONS":
            const selectedOptions = decodeQuestionsFilter(payload);
            let activeQuestionFilters = {};
            state.questions?.forEach((question) => {
                if (selectedOptions[question.id] !== undefined) {
                    activeQuestionFilters = {
                        ...activeQuestionFilters,
                        [question.id]: {
                            ...question,
                            checked: selectedOptions[question.id],
                        },
                    };
                }
            });
            return {
                ...state,
                activeQuestions: {
                    ...state.activeQuestions,
                    ...activeQuestionFilters,
                },
            };
        case "SET_CALL_COUNT":
            return { ...state, callCount: payload };
        case "SET_AUDITORS":
            return { ...state, auditors: payload };
        case "SET_RULE_NAME":
            return { ...state, name: payload };
        case "SET_RULE_DESCRIPTION":
            return { ...state, description: payload };
        case "SET_AUDIT_TYPE":
            if (payload === "ai") {
                return {
                    ...state,
                    auditType: payload,
                    target: {
                        ...state.target,
                        aggregate: null,
                    },
                    activeDateRangeKey: "all",
                    activeJoinDateRangeKey: null,
                };
            }
            return {
                ...state,
                auditType: payload,
                target: {
                    ...state.target,
                    aggregate: { value: "max", label: "Max" },
                },
                activeDateRangeKey:
                    state.scheduling === "recurring"
                        ? "yesterday"
                        : state.activeDateRangeKey,
                activeJoinDateRangeKey:
                    state.scheduling === "recurring"
                        ? "all"
                        : state.activeJoinDateRangeKey,
            };
        case "SET_SCHEDULING":
            return {
                ...state,
                scheduling: payload,
                activeDateRangeKey:
                    state.auditType === "ai"
                        ? "all"
                        : payload === "recurring"
                        ? "yesterday"
                        : state.activeDateRangeKey,
                activeJoinDateRangeKey:
                    state.auditType === "manual" && payload === "recurring"
                        ? "all"
                        : state.activeJoinDateRangeKey,
            };
        case "SET_SELECTED_TEAMS":
            const teamsSet = new Set(payload);
            if (teamsSet.size === 0) {
                return {
                    ...state,
                    selectedTeams: [...payload],
                    filterReps: state.reps,
                };
            } else {
                const filterReps = state.reps.filter(
                    ({ team }) =>
                        teamsSet.has(team) || teamsSet.has(String(team))
                );
                const filterRepsSet = new Set(
                    filterReps.map(({ id }) => String(id))
                );
                const filterSelectedReps =
                    state.selectedReps?.filter((id) => filterRepsSet.has(id)) ||
                    [];
                return {
                    ...state,
                    selectedTeams: [...payload],
                    filterReps: filterReps,
                    selectedReps: filterSelectedReps,
                };
            }

        // console.log(filterReps, filterSelectedReps, teamsSet, state.reps);

        case "SET_SELECTED_REPS":
            return { ...state, selectedReps: [...payload] };
        case "SET_SELECTED_TAGS":
            return {
                ...state,
                selectedTags: [...payload],
            };
        case "SET_DURATION":
            if (!payload) {
                return { ...state, activeDurationKey: null };
            }
            const { isCustom, customDuration, key } = payload;
            let tempState = state;
            if (isCustom) {
                let id = uid();
                if (!(customDuration?.[0] || customDuration?.[1])) {
                    openNotification("Invalid duration range");
                    return state;
                }
                const optionName =
                    customDuration[0] && customDuration[1]
                        ? `between ${customDuration[0]} - ${customDuration[1]} MIN`
                        : customDuration[0]
                        ? `above ${customDuration[0]} MIN`
                        : `below ${customDuration[1]} MIN`;
                tempState.durationOptions = {
                    ...tempState.durationOptions,
                    [id]: {
                        value: customDuration,
                        text: optionName,
                    },
                };
                return { ...tempState, activeDurationKey: id };
            }
            return { ...tempState, activeDurationKey: key };
        case "SET_TEMPLATE":
            return {
                ...state,
                activeTemplateKey: payload,
                activeQuestions: {},
            };
        case "SET_CALL_TYPE":
            return { ...state, selectedCallTypes: [...payload] };
        case "SET_CLIENT":
            return { ...state, activeClientKey: payload?.value || null };
        case "SET_RECORDING_MEDIUM":
            return { ...state, activeRecMediumKey: payload };
        case "SET_STAGE":
            return { ...state, activeStageKey: payload };
        case "SET_PROCESSING_STATUS":
            return { ...state, activeProcStatusKey: payload };
        case "SET_TOPIC":
            return { ...state, activeTopicKey: payload };
        case "SET_MEETING_TYPE":
            return { ...state, meetingType: payload };
        case "SET_DATES":
            return { ...state, activeDateRangeKey: payload };
        case "SET_JOIN_DATES":
            return { ...state, activeJoinDateRangeKey: payload };

        case "SET_CUSTOM_DATE_LABEL":
            return {
                ...state,
                dateOptions: {
                    ...state.dateOptions,
                    custom: {
                        ...state.dateOptions.custom,
                        name: payload,
                        label: payload,
                    },
                },
            };
        case "SET_CUSTOM_JOIN_DATE_LABEL":
            return {
                ...state,
                dateOptions: {
                    ...state.dateOptions,
                    custom: {
                        ...state.dateOptions.custom,
                        name: payload,
                        label: payload,
                    },
                },
            };

        case "SET_CUSTOM_RANGE":
            const tempDateOptions = state.dateOptions;
            tempDateOptions[TopbarConfig.CUSTOMLABEL].dateRange = payload;
            return {
                ...state,
                dateOptions: tempDateOptions,
                activeDateRangeKey: TopbarConfig.CUSTOMLABEL,
            };

        case "SET_CUSTOM_JOIN_RANGE":
            const tempJoinDateOptions = state.dateOptions;
            tempJoinDateOptions[TopbarConfig.CUSTOMLABEL].dateRange = payload;
            return {
                ...state,
                dateOptions: tempJoinDateOptions,
                activeJoinDateRangeKey: TopbarConfig.CUSTOMLABEL,
            };
        case "ADD_CUSTOM_RANGE":
            const { key: rangeKey, ...rest } = payload;
            return {
                ...state,
                dateOptions: {
                    ...state.dateOptions,
                    [rangeKey]: rest,
                },
                activeDateRangeKey: rangeKey,
            };
        case "ADD_CUSTOM_JOIN_RANGE":
            const { key: joinrangeKey, ...joinrest } = payload;
            return {
                ...state,
                dateOptions: {
                    ...state.dateOptions,
                    [joinrangeKey]: joinrest,
                },
                activeJoinDateRangeKey: joinrangeKey,
            };
        case "SET_KEYWORDS":
            return { ...state, keywords: payload };
        case "SET_KEYWORD_PRESENT":
            return { ...state, keywordPresent: payload };
        case "SET_KEYWORD_SAIDBY":
            return { ...state, keywordSaidBy: payload };
        case "SET_MIN_CALL_SCORE":
            return { ...state, minCallScore: payload };
        case "SET_MAX_CALL_SCORE":
            return { ...state, maxCallScore: payload };
        case "SET_QUESTIONS":
            return { ...state, questions: payload };
        case "SET_ACTIVE_QUESTIONS":
            return { ...state, activeQuestions: payload };
        case "SET_QUESTION_COUNT_REP":
            return { ...state, questionCountRep: payload };
        case "SET_QUESTION_COUNT_OTHER":
            return { ...state, questionCountOther: payload };
        case "SET_INTERACTIVITY":
            return { ...state, interactivity: payload };
        case "SET_TARGET_QTY":
            return { ...state, target: { ...state.target, quantity: payload } };
        case "SET_TARGET_FREQ":
            return {
                ...state,
                target: { ...state.target, frequency: payload },
            };
        case "SET_TARGET_INTERVAL":
            return { ...state, target: { ...state.target, interval: payload } };
        case "SET_TARGET_AGGREGATE":
            return {
                ...state,
                target: { ...state.target, aggregate: payload },
            };
        case "SET_ALLOCATION_FILTER":
            let tempAlloc = state.allocation;
            tempAlloc[payload.idx].filter = payload.value;
            return { ...state, allocation: tempAlloc };
        case "SET_ALLOCATION_DISTRIBUTION":
            let tempAlloc2 = state.allocation;
            tempAlloc2[payload.idx].dist_frequency = payload.value;
            return { ...state, allocation: tempAlloc2 };
        case "SET_ALLOCATION_AUDITORS":
            let tempAlloc4 = state.allocation;
            tempAlloc4[payload.idx].auditors = payload.auditors;
            return { ...state, allocation: tempAlloc4 };
        case "ADD_ALLOCATION":
            let tempAlloc3 = state.allocation;
            tempAlloc3.push({
                filter: "agent",
                dist_frequency: "equally",
                auditors: [],
            });
            return {
                ...state,
                allocationLength: state.allocationLength + 1,
                allocation: tempAlloc3,
            };
        case "DEL_ALLOCATION":
            if (state.allocationLength === 1) {
                openNotification(
                    "error",
                    "Error",
                    "One allocation is required"
                );
                return state;
            }
            let tempAlloc5 = state.allocation;
            tempAlloc5.splice(payload, 1);
            return {
                ...state,
                allocationLength: state.allocationLength - 1,
                allocation: tempAlloc5,
            };
        default:
            return state;
    }
};

export default ruleModalReducer;
