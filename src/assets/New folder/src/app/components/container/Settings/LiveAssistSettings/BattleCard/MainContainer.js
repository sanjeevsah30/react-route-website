import { Button, Col, Row } from "antd";
import React, { useContext } from "react";
import "./battle_card.scss";
import BattleCardContainer from "./BattelCardContainer";
import BattleCardPreview from "./BattleCardPreview";
import CreateBattleCardModal from "./CreateBattleCardModal";
import { BattleCardContext } from "./BattleCardContext";
import { Route, Switch } from "react-router-dom";
import routes from "@constants/Routes/index";
import { SettingRoutes } from "@convin/config/routes.config";
export default function MainContainer() {
    const { handleBattleCardModal } = useContext(BattleCardContext);

    return (
        <div className="live_assist">
            <div className="live_assist--header">
                <span className="live_assist--title">
                    Agent Assist - Battle Cards
                </span>
                <Button type="primary" onClick={handleBattleCardModal}>
                    Create Battle Card
                </Button>
            </div>
            <div
                className="flex flex1 overflowYscroll"
                style={{
                    gap: "8px",
                }}
            >
                <div className="flex1 overflowYscroll">
                    <BattleCardContainer />
                </div>
                {/* <Switch>
                    <Route
                        exact
                        path={`/settings/${SettingRoutes.AGENT_ASSIST.path}/:id`}
                                                render={() => (
                            <div
                                style={{
                                    width: "420px",
                                }}
                                className="overflowYscroll height100p"
                            >
                                <BattleCardPreview />
                            </div>
                        )}
                    />
                </Switch> */}
                <Switch>
                    <Route
                        path={`/settings/${SettingRoutes.AGENT_ASSIST.path}/:id`}
                        render={() => (
                            <div
                                style={{
                                    width: "420px",
                                }}
                                className="overflowYscroll height100p"
                            >
                                <BattleCardPreview />
                            </div>
                        )}
                    />
                </Switch>
            </div>
            <CreateBattleCardModal visible={false} ruleId={null} />
        </div>
    );
}
