import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import NotesCardProvider from "./components/NotesCardProvider";
import MainContainer from "./components/MainContainer";
import { listNotesSettingsCard } from "@store/notesSettingSlice/notesSettingSlice";

export default function NotesCardSettings() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(listNotesSettingsCard());
        // dispatch(listLiveAssistBattleCardCtegories());
    }, []);
    return (
        <NotesCardProvider>
            <MainContainer />
        </NotesCardProvider>
    );
}
