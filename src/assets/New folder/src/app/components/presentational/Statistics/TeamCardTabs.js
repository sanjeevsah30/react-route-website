/* eslint-disable jsx-a11y/anchor-is-valid */
import { uid } from "@tools/helpers";
import React from "react";
import { useSelector } from "react-redux";
const TeamCardTabs = (props) => {
    const domain_type = useSelector(
        (state) => state.common.versionData.domain_type
    );
    const activeCard = props.activeTeamCard ? props.activeTeamCard : 0;

    const cardsToRender = props.teamCards.map((tab, index) => {
        let cardClass =
            index === activeCard
                ? "stats-activity-team-item stats-activity-team-item-selected"
                : "stats-activity-team-item";
        cardClass = props.isLoading ? `${cardClass} loading` : cardClass;
        return (
            <div
                className={"stats-activity-team-item-wrapper"}
                key={uid() + index}
                onClick={() => props.handleActiveTeamCard(index)}
                style={{ minWidth: "282px" }}
            >
                <a className="accessibility">
                    <div className={cardClass}>
                        <h4>{tab.tabName}</h4>
                        <h2 style={{ textTransform: "lowercase" }}>
                            {props.tileData[tab.type]} {tab.unit}
                        </h2>
                    </div>
                </a>
            </div>
        );
    });
    return (
        <div
            className={`stats-activity-team-container ${
                domain_type === "b2c" ? "flex column alignCenter" : ""
            }`}
            style={{ gap: "20px" }}
        >
            {" "}
            {cardsToRender}{" "}
        </div>
    );
};

export default TeamCardTabs;
