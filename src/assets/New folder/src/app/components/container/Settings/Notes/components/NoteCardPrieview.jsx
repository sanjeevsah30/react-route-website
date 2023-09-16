import React, { useContext, useEffect } from "react";

import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Skeleton } from "antd";
import {
    getNotesCardById,
    resetActiveNotesCard,
} from "../../../../../../store/notesSettingSlice/notesSettingSlice";
import { NotesCardContext } from "./NotesCardProvider";
import Chip from "../../LiveAssistSettings/BattleCard/Chip";
import { getColor } from "../../../../../../tools/helpers";
import routes from "../../../../../constants/Routes";
import MinusSvg from "../../../../../static/svg/MinusSvg";
import CloseSvg from "@container/Settings/MomentsSettings/CloseSvg";

export default function NoteCardPrieview() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { activeCardId, setActiveCardId } = useContext(NotesCardContext);
    const {
        notesSettingSlice: { activeNoteCard },
    } = useSelector((state) => state);
    useEffect(() => {
        if (activeCardId !== +id) {
            setActiveCardId(+id);
        }
        dispatch(getNotesCardById(id));
    }, [id]);
    return (
        <div className="battle_card_preview">
            {activeNoteCard.loading ? (
                <Skeleton
                    active
                    paragraph={{ rows: 8 }}
                    title={false}
                    style={{ marginTop: "10px" }}
                />
            ) : (
                <>
                    <NoteCardDetails data={activeNoteCard.data} />
                </>
            )}
        </div>
    );
}

function NoteCardDetails({ data = {} }) {
    const history = useHistory();
    const dispatch = useDispatch();
    return (
        <div className="card_details margin0">
            <div className="flex justifySpaceBetween alignCenter">
                <h4 className="card_details--title text_ellipsis">
                    {data?.name}
                </h4>

                <div
                    className="curPoint flex  alignCenter"
                    onClick={() => {
                        history.push(`${routes.settings.notes}`);
                        dispatch(resetActiveNotesCard());
                    }}
                >
                    <CloseSvg
                        style={{
                            transform: "scale(1.2)",
                            color: "#333",
                        }}
                    />
                </div>
            </div>

            <div className="card_details--category">
                <h3 className="card_details--category--key">
                    Conversation Type
                </h3>
                <h3 className="card_details--category--value">
                    {data?.meeting_type}
                </h3>
            </div>
            <div className="card_details--teams">
                <h3 className="card_details--teams--title">Applied Teams</h3>
                <div className="card_details--teams--chips">
                    {data?.teams?.map?.(({ name, id }) => (
                        <Chip title={name} color={getColor(name)} key={id} />
                    ))}
                </div>
            </div>
            <div className="card_details--teams">
                <h3 className="card_details--teams--title">Call Tags</h3>
                <div className="card_details--teams--chips">
                    {data?.tags?.map?.(({ id, tag_name }) => (
                        <Chip
                            title={tag_name}
                            textColor="#1a62f2"
                            color={"#1a62f233"}
                            key={id}
                        />
                    ))}
                </div>
            </div>
            <div className="card_details--teams">
                <h3 className="card_details--teams--title">Call Type</h3>
                <div className="card_details--teams--chips">
                    {data?.call_type?.map?.(({ id, type }) => (
                        <Chip
                            title={type}
                            textColor="#1a62f2"
                            color={"#1a62f233"}
                            key={id}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

// function PreviewCard({ data = {} }) {
//     const { HINT, CHECKLIST } = BattleCardTypeConfig;
//     const history = useHistory();
//     const dispatch = useDispatch();
//     return (
//         <div
//             className="preview_card"
//             style={{ background: BattleCardColors[data?.id % 6] }}
//         >
//             <div className="preview_card--head">
//                 <div className="flex">
//                     {data?.type === HINT ? (
//                         <HintSvg />
//                     ) : data?.type === CHECKLIST ? (
//                         <CheckPointSvg />
//                     ) : (
//                         <StepsSvg />
//                     )}
//                     <h4 className="preview_card--head--title marginL10">
//                         {data?.name}
//                     </h4>
//                 </div>
//                 <div
//                     className="curPoint"
//                     onClick={() => {
//                         history.push(`${routes.settings.battle_cards}`);
//                         dispatch(resetActiveBattleCard());
//                     }}
//                 >
//                     <MinusSvg style={{ color: 'white' }} />
//                 </div>
//             </div>
//             {data?.type === HINT ? (
//                 <pre
//                     style={{
//                         whiteSpace: 'pre-wrap',
//                         color: 'white',
//                     }}
//                     className="paddingLR16"
//                 >
//                     {data.metadata.hint}
//                 </pre>
//             ) : data?.type === CHECKLIST ? (
//                 data?.metadata?.check_list?.map?.((e, idx) => (
//                     <div className="preview_card--bullets" key={idx}>
//                         <ThreeCircleSvg style={{ marginRight: '8px' }} />
//                         <div className="flex1">{e}</div>
//                     </div>
//                 ))
//             ) : (
//                 data?.metadata?.guided_workflow?.map?.((e, idx) => (
//                     <div className="preview_card--steps" key={idx}>
//                         <div className="bold600">Step {idx + 1}</div>
//                         <div>{e}</div>
//                     </div>
//                 ))
//             )}

//             <div className="preview_card--footer">
//                 <h4 className="preview_card--footer--question">
//                     is this helpful ?
//                 </h4>
//                 <div className="flex alignCenter">
//                     <LikeFilled className="preview_card--footer--icon" />
//                     <LikeFilled
//                         className="preview_card--footer--icon"
//                         style={{
//                             transform: 'rotateX(-180deg) rotateY(180deg)',
//                             color: '#FFFFFF3D',
//                         }}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }
