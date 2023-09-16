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
    team_ids: [],
    call_tags_ids: [],
    call_type_ids: [],
    meeting_type: "Call",
};
const notesCardConfigModalReducer = (state, action) => {
    const { type, payload } = action;

    switch (type) {
        case "UPDATE_MODAL_STATE":
            return { ...state, ...payload };
        case "RESET_STATE":
            return { ...initialState };
        default:
            return state;
    }
};

export default notesCardConfigModalReducer;
