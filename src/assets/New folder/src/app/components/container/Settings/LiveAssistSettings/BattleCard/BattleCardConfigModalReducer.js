export const BattleCardTypeConfig = {
    HINT: "hint",
    CHECKLIST: "checklist",
    GUIDED_WORKFLOW: "guided_workflow",
};

export const BattleCardColors = [
    "#6633D2",
    "#B07E1C",
    "#F56493",
    "#3E3E3E",
    "#80941F",
    "#17A375",
];

export const initialState = {
    name: "",
    category: null,
    team_ids: [],
    mentioned_by: "both",
    phrases: [],
    type: BattleCardTypeConfig.HINT,
    currentStep: 0,
    hint: "",
    check_list: [""],
    guided_workflow: [""],
};
const battleCardConfigModalReducer = (state, action) => {
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
        case "UPDATE_MODAL_STATE":
            return { ...state, ...payload };
        case "RESET_STATE":
            return { ...initialState };
        default:
            return state;
    }
};

export default battleCardConfigModalReducer;
