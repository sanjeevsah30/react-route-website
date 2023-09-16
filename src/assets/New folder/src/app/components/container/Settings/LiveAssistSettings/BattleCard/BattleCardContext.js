import { createContext, useContext, useReducer, useState } from "react";
import battleCardModalConfigReducer, {
    initialState,
} from "./BattleCardConfigModalReducer";
import { useHistory } from "react-router-dom";
import routes from "@constants/Routes/index";
import { useDispatch } from "react-redux";
import { deleteBattleCard } from "@store/liveAssistSlice/liveAssistSlice";
import { SettingRoutes } from "@convin/config/routes.config";

export const BattleCardContext = createContext();

const BattleCardProvider = ({ children }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [battleCardModalVisible, setBattleCardModalVisible] = useState(false);
    const [activeCardId, setActiveCardId] = useState(null);
    const [battleCardToEditId, setBattleCardToEditId] = useState(null);
    const [modalState, modalDispatch] = useReducer(
        battleCardModalConfigReducer,
        {
            ...initialState,
        }
    );
    const handleBattleCardModal = () => {
        setBattleCardModalVisible((prev) => !prev);
        modalDispatch({
            type: "SET_STEP",
            payload: 0,
        });
    };

    const handleSelectedBattleCard = (id) => {
        history.push(`/settings/${SettingRoutes.AGENT_ASSIST.path}/${id}`);
        setActiveCardId(id);
    };

    const handleBattleCardDelete = (id) => {
        dispatch(deleteBattleCard(id)).then(() => {
            if (activeCardId && activeCardId === id) {
                history.push(
                    `/settings/${SettingRoutes.AGENT_ASSIST.path}/${id}`
                );
            }
        });
    };

    const value = {
        battleCardModalVisible,
        handleSelectedBattleCard,
        handleBattleCardModal,
        modalState,
        modalDispatch,
        activeCardId,
        setActiveCardId,
        battleCardToEditId,
        setBattleCardToEditId,
        handleBattleCardDelete,
    };

    return (
        <BattleCardContext.Provider value={value}>
            {children}
        </BattleCardContext.Provider>
    );
};

export default BattleCardProvider;
