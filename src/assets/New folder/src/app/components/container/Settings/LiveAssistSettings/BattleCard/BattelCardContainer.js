import { getColor } from "@tools/helpers";
import { Col, Popconfirm, Popover, Row, Skeleton } from "antd";
import React, { useContext, useState } from "react";
import MoreSvg from "app/static/svg/MoreSvg";
import { BattleCardContext } from "./BattleCardContext";
import "./battle_card.scss";
import { useSelector } from "react-redux";
import { BattleCardColors } from "./BattleCardConfigModalReducer";
import { NoData } from "app/components/presentational/reusables";
import NoDataSvg from "@convin/components/svg/NoDataSvg";
export default function BattleCardContainer() {
    const {
        liveAssistSlice: {
            battle_cards: { data, loading },
        },
    } = useSelector((state) => state);
    return (
        <div className="live_assist--card_container">
            {loading ? (
                <Skeleton
                    active
                    paragraph={{ rows: 8 }}
                    title={false}
                    style={{ marginTop: "10px" }}
                />
            ) : !data.length ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <NoDataSvg />
                    <div className="bold600">No Data!</div>
                </div>
            ) : (
                <Row gutter={[8, 8]}>
                    {data.map((card, idx) => (
                        <BattleCard {...card} key={card.id} />
                    ))}
                </Row>
            )}
        </div>
    );
}

function BattleCard({ name, category, id }) {
    const {
        activeCardId,
        handleSelectedBattleCard,
        setBattleCardToEditId,
        handleBattleCardModal,
        handleBattleCardDelete,
    } = useContext(BattleCardContext);
    const color = getColor(name);
    const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
    return (
        <Col sm={24} md={12} lg={8} xl={8} xxl={8} xxxl={4}>
            <div
                className={
                    activeCardId === id
                        ? "battle_card selected_battle_card"
                        : "battle_card"
                }
                onClick={() => handleSelectedBattleCard(id)}
            >
                <div className="flex alignCenter justifySpaceBetween marginB4">
                    <h4
                        className="battle_card--title"
                        style={{ color: BattleCardColors[id % 6] }}
                    >
                        {name}
                    </h4>
                    <Popover
                        content={
                            <div onClick={(e) => e.stopPropagation()}>
                                <div
                                    onClick={() => {
                                        setBattleCardToEditId(id);
                                        handleBattleCardModal();
                                        setMoreOptionsVisible(false);
                                    }}
                                    className="option"
                                >
                                    Edit
                                </div>
                                <Popconfirm
                                    title="Are you sure to delete this meeting?"
                                    onConfirm={(e) => {
                                        e.stopPropagation();
                                        handleBattleCardDelete(id);
                                        setMoreOptionsVisible(false);
                                    }}
                                    onCancel={(e) => e.stopPropagation()}
                                >
                                    <div className="option">Delete</div>
                                </Popconfirm>
                            </div>
                        }
                        title="More Options"
                        trigger="click"
                        visible={moreOptionsVisible}
                        onVisibleChange={(visible) =>
                            setMoreOptionsVisible(visible)
                        }
                        overlayClassName={"completed_card_more_options_popover"}
                        placement="bottom"
                    >
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                            }}
                        >
                            <MoreSvg />
                        </div>
                    </Popover>
                </div>
                <div className="battle_card--category">{category.name}</div>
            </div>
        </Col>
    );
}
