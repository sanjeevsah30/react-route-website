import { Button, Col, Row } from "antd";
import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";
import routes from "@constants/Routes/index";
import NotesCardContainer from "./NotesCardContainer";
import { NotesCardContext } from "./NotesCardProvider";
import CreateBattleCardModal from "./CreateNotesModal";
import NoteCardPrieview from "./NoteCardPrieview";
import "../../LiveAssistSettings/BattleCard/battle_card.scss";
import { SettingRoutes } from "@convin/config/routes.config";
export default function MainContainer() {
    const { handleNotesCardModal } = useContext(NotesCardContext);

    return (
        <div className="live_assist">
            <div className="live_assist--header">
                <span className="live_assist--title">Notes Settings </span>
                <Button type="primary" onClick={handleNotesCardModal}>
                    Create Custom Field
                </Button>
            </div>
            <div
                className="flex flex1 overflowYscroll"
                style={{
                    gap: "8px",
                }}
            >
                <div className="flex1 overflowYscroll">
                    <NotesCardContainer />
                </div>
                <Switch>
                    <Route
                        path={`/settings/${SettingRoutes.NOTES.path}/:id`}
                        render={() => (
                            <div
                                style={{
                                    width: "420px",
                                }}
                                className="overflowYscroll height100p"
                            >
                                <NoteCardPrieview />
                            </div>
                        )}
                    />
                </Switch>
            </div>
            <CreateBattleCardModal />
        </div>
    );
}
