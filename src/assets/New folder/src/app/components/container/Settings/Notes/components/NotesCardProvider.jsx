import { createContext, useContext, useReducer, useState } from "react";

import { useHistory } from "react-router-dom";
import routes from "@constants/Routes/index";
import { useDispatch } from "react-redux";
import notesCardConfigModalReducer, {
    initialState,
} from "./NotesCardConfigModal";
import { deleteNotesSettingCard } from "../../../../../../store/notesSettingSlice/notesSettingSlice";

export const NotesCardContext = createContext();

const NotesCardProvider = ({ children }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [notesCardModalVisible, setNotesCardModalVisible] = useState(false);
    const [activeCardId, setActiveCardId] = useState(null);
    const [notesCardToEditId, setNotesCardToEditId] = useState(null);
    const [modalState, modalDispatch] = useReducer(
        notesCardConfigModalReducer,
        {
            ...initialState,
        }
    );
    const handleNotesCardModal = () => {
        setNotesCardModalVisible((prev) => !prev);
    };

    const handleSelectedNotesCard = (id) => {
        history.push(`${routes.settings.notes}/${id}`);
        setActiveCardId(id);
    };

    const handleNotesCardDelete = (id) => {
        dispatch(deleteNotesSettingCard(id)).then(() => {
            if (activeCardId && activeCardId === id) {
                history.push(`${routes.settings.notes}`);
            }
        });
    };

    const value = {
        notesCardModalVisible,
        handleSelectedNotesCard,
        handleNotesCardModal,
        modalState,
        modalDispatch,
        activeCardId,
        setActiveCardId,
        notesCardToEditId,
        setNotesCardToEditId,
        handleNotesCardDelete,
    };

    return (
        <NotesCardContext.Provider value={value}>
            {children}
        </NotesCardContext.Provider>
    );
};

export default NotesCardProvider;
