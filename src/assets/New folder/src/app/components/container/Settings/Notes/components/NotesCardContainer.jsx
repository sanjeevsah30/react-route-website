import { Col, Popconfirm, Popover, Row, Skeleton } from "antd";
import React, { useContext, useState } from "react";
import MoreSvg from "../../../../../static/svg/MoreSvg";
import { getColor } from "../../../../../../tools/helpers";
import { NotesCardContext } from "./NotesCardProvider";
import { useSelector } from "react-redux";
import NoDataSvg from "app/static/svg/NoDataSvg";

export default function NotesCardContainer() {
    const {
        notesSettingSlice: {
            note_cards: { loading, data },
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
            ) : data.length ? (
                <Row gutter={[8, 8]}>
                    {data.map((card, idx) => (
                        <NotesCard {...card} />
                    ))}
                </Row>
            ) : (
                <div className="height100p flex column alignCenter justifyCenter">
                    <NoDataSvg />
                    <div className="bold600 font18 marginT10">
                        Create Custom Field
                    </div>
                </div>
            )}
        </div>
    );
}

function NotesCard({ key, id, name }) {
    const {
        activeCardId,

        handleSelectedNotesCard,
        setNotesCardToEditId,

        handleNotesCardModal,
        handleNotesCardDelete,
    } = useContext(NotesCardContext);
    const color = getColor(key);
    const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
    return (
        <Col sm={24} md={12} lg={8} xl={8} xxl={8} xxxl={4}>
            <div
                className={
                    activeCardId === id
                        ? "battle_card selected_battle_card"
                        : "battle_card"
                }
                onClick={() => handleSelectedNotesCard(id)}
            >
                <div className="flex alignCenter justifySpaceBetween marginB4">
                    <h4 className="battle_card--title">{name}</h4>
                    <Popover
                        content={
                            <div onClick={(e) => e.stopPropagation()}>
                                <div
                                    onClick={() => {
                                        setNotesCardToEditId(id);
                                        handleNotesCardModal();
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
                                        handleNotesCardDelete(id);
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
                        open={moreOptionsVisible}
                        onOpenChange={(visible) =>
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
            </div>
        </Col>
    );
}
