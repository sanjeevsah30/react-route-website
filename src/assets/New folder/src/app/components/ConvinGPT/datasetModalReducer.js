import { openNotification } from "../../../store/common/actions";
import { isArrayEqual, uid } from "../../../tools/helpers";
import {
    decodeQuestionsFilter,
    decodeTracker,
    getDateFilter,
} from "../../../tools/searchFactory";
import TopbarConfig from "../../constants/Topbar/index";

export const initialState = {
    name: null,
    description: null,
    teams: [],
    reps: [],
    filterReps: [],
    tags: [],
    selectedTeams: [],
    selectedReps: [],
    selectedTags: [],
    currentStep: 0,
    activeDurationKey: null,
    activeTemplateKey: null,
    selectedCallTypes: [],
    activeClientKey: null,
    activeRecMediumKey: null,
    activeStageKey: null,
    activeProcStatusKey: null,
    activeTopicKey: null,
    meetingType: "call",
    activeDateRangeKey: null,
    keywords: [],
    keywordPresent: true,
    keywordSaidBy: [],
    target: {
        quantity: null,
        aggregate: "max",
        frequency: "calls",
    },
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
const datasetModalReducer = (state, action) => {
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
            const { teams, tags, reps, filterReps: filteredReps } = state;

            return {
                ...state,
                ...initialState,
                teams,
                tags,
                reps,
                filterReps: filteredReps,
            };
        case "INITIALISE_FILTERS":
            return { ...state, ...payload };
        case "INITIALISE_MODAL":
            const {
                name,
                desc: description,
                filters,
                target,
                stats_threshold,
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
            }
            if (!startTime && !endTime) {
                initializedState = {
                    ...state,
                    ...initializedState,
                    activeDateRangeKey: "all",
                };
            } else {
                const dateFilter = getDateFilter(startTime, endTime);
                if (dateFilter?.isCustom) {
                    initializedState = {
                        ...state,
                        ...initializedState,
                        dateOptions: {
                            ...state.dateOptions,
                            [dateFilter.match.name]: {
                                dateRange: dateFilter.match.dateRange,
                                name: dateFilter.match.name,
                            },
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
                description,
                keywords,
                keywordPresent,
                keywordSaidBy: saidBy,
                target,
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
        case "SET_DATASET_NAME":
            return { ...state, name: payload };
        case "SET_DATASET_DESCRIPTION":
            return { ...state, description: payload };
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
            return { ...state, activeTemplateKey: payload };
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
        case "SET_CUSTOM_RANGE":
            const tempDateOptions = state.dateOptions;
            tempDateOptions[TopbarConfig.CUSTOMLABEL].dateRange = payload;
            return {
                ...state,
                dateOptions: tempDateOptions,
                activeDateRangeKey: TopbarConfig.CUSTOMLABEL,
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
        case "SET_TARGET_AGGREGATE":
            return {
                ...state,
                target: { ...state.target, aggregate: payload },
            };
        default:
            return state;
    }
};

export default datasetModalReducer;
