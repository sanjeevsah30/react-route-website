import React, { useContext, useEffect } from "react";
import "./battle_card.scss";
import MinusSvg from "app/static/svg/MinusSvg";
import ThreeCircleSvg from "app/static/svg/ThreeCircleSvg";
import { LikeFilled } from "@ant-design/icons";
import { getColor } from "@tools/helpers";
import Chip from "./Chip";
import { BattleCardContext } from "./BattleCardContext";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    getBattleCardById,
    resetActiveBattleCard,
} from "@store/liveAssistSlice/liveAssistSlice";
import { Skeleton } from "antd";
import {
    BattleCardColors,
    BattleCardTypeConfig,
} from "./BattleCardConfigModalReducer";
import HintSvg from "./Svg/HintSvg";
import StepsSvg from "./Svg/StepsSvg";
import CheckPointSvg from "./Svg/CheckPointSvg";
import routes from "@constants/Routes/index";
import { CloseSvg } from "@convin/components/svg";

export default function BattleCardPreview() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const { activeCardId, setActiveCardId } = useContext(BattleCardContext);
    const {
        liveAssistSlice: { activeBattleCard },
    } = useSelector((state) => state);
    useEffect(() => {
        if (activeCardId !== +id) {
            setActiveCardId(+id);
        }
        dispatch(getBattleCardById(id));
    }, [id]);
    return (
        <div className="battle_card_preview">
            <div className="flex alignCenter justifySpaceBetween marginB16">
                <h4 className="blod600 font16">Battle Card Preview</h4>
                <div
                    className="curPoint"
                    onClick={() => {
                        history.push(`${routes.settings.battle_cards}`);
                        dispatch(resetActiveBattleCard());
                    }}
                    style={{
                        transform: "scale(0.6)",
                    }}
                >
                    <CloseSvg style={{ color: "#333" }} />
                </div>
            </div>

            {activeBattleCard.loading ? (
                <Skeleton
                    active
                    paragraph={{ rows: 8 }}
                    title={false}
                    style={{ marginTop: "10px" }}
                />
            ) : (
                <>
                    <PreviewCard data={activeBattleCard.data} />
                    <BattleCardDetails data={activeBattleCard.data} />
                </>
            )}
        </div>
    );
}

function BattleCardDetails({ data = {} }) {
    return (
        <div className="card_details">
            <h4 className="card_details--title">Battle Card Details</h4>
            <div className="card_details--category">
                <h3 className="card_details--category--key">Category</h3>
                <h3 className="card_details--category--value">
                    {data?.category?.name}
                </h3>
            </div>
            <div className="card_details--teams">
                <h3 className="card_details--teams--title">Applied Teams</h3>
                <div className="card_details--teams--chips">
                    {data?.teams?.map?.(({ id, name }) => (
                        <Chip title={name} color={getColor(name)} key={id} />
                    ))}
                </div>
            </div>
            <div className="card_details--teams">
                <h3 className="card_details--teams--title">
                    Triggering Phrases
                </h3>
                <div className="card_details--teams--chips">
                    {data?.metadata?.phrase_list?.map?.((e) => {
                        return <Chip title={e} key={e} />;
                    })}
                </div>
            </div>

            <div className="card_details--category" style={{ border: "none" }}>
                <h3 className="card_details--category--key">Mentioned By</h3>
                <h3 className="card_details--category--value capitalize">
                    {data?.metadata?.said_by}
                </h3>
            </div>
        </div>
    );
}

function PreviewCard({ data = {} }) {
    const { HINT, CHECKLIST } = BattleCardTypeConfig;
    const history = useHistory();
    const dispatch = useDispatch();
    return (
        <div
            className="preview_card"
            style={{ background: BattleCardColors[data?.id % 6] }}
        >
            <div className="preview_card--head">
                <div className="flex">
                    {data?.type === HINT ? (
                        <HintSvg />
                    ) : data?.type === CHECKLIST ? (
                        <CheckPointSvg />
                    ) : (
                        <StepsSvg />
                    )}
                    <h4 className="preview_card--head--title marginL10">
                        {data?.name}
                    </h4>
                </div>
            </div>
            {data?.type === HINT ? (
                <pre
                    style={{
                        whiteSpace: "pre-wrap",
                        color: "white",
                    }}
                    className="paddingLR16"
                >
                    {data.metadata.hint}
                </pre>
            ) : data?.type === CHECKLIST ? (
                data?.metadata?.check_list?.map?.((e, idx) => (
                    <div className="preview_card--bullets" key={idx}>
                        <ThreeCircleSvg style={{ marginRight: "8px" }} />
                        <div className="flex1">{e}</div>
                    </div>
                ))
            ) : (
                data?.metadata?.guided_workflow?.map?.((e, idx) => (
                    <div className="preview_card--steps" key={idx}>
                        <div className="bold600">Step {idx + 1}</div>
                        <div>{e}</div>
                    </div>
                ))
            )}

            <div className="preview_card--footer">
                <h4 className="preview_card--footer--question">
                    is this helpful ?
                </h4>
                <div className="flex alignCenter">
                    <LikeFilled className="preview_card--footer--icon" />
                    <LikeFilled
                        className="preview_card--footer--icon"
                        style={{
                            transform: "rotateX(-180deg) rotateY(180deg)",
                            color: "#FFFFFF3D",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
