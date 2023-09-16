import React, { useEffect } from "react";

import MainContainer from "./MainContainer";
import BattleCardProvider from "./BattleCardContext";
import { useDispatch } from "react-redux";
import {
    listBattleCards,
    listLiveAssistBattleCardCtegories,
} from "@store/liveAssistSlice/liveAssistSlice";
export default function BattleCards() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(listBattleCards());
        dispatch(listLiveAssistBattleCardCtegories());
    }, []);
    return (
        <BattleCardProvider>
            <MainContainer />
        </BattleCardProvider>
    );
}
