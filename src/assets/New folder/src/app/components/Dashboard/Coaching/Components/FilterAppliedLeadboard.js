import { Col, Row, Tooltip } from "antd";
import React from "react";
import TrendGraph from "./TrendGraph";
import GoldSvg from "app/static/svg/Gold";
import SilverSvg from "app/static/svg/SilverSvg";
import BronzeSvg from "app/static/svg/BronzeSvg";
import { formatFloat } from "@tools/helpers";
import { useDispatch, useSelector } from "react-redux";
import { changeActiveTeam, setActiveRep } from "@store/common/actions";

function FilterAppliedLeadboard({ data, type }) {
    const {
        common: { filterTeams, filterReps },
    } = useSelector((state) => state);
    return (
        <div>
            <div className="paddingLR20  marginB16 leaderboard__headings">
                <Row className="flex1">
                    <Col span={1} className="flex justifyCenter alignCenter">
                        <span>Rank</span>
                    </Col>
                    <Col span={2} className="flex alignCenter">
                        <div className="">
                            {(Array.isArray(filterTeams.active) &&
                                filterTeams.active.length !== 1) ||
                            +filterTeams.active === 0
                                ? "Team Name"
                                : "Rep Name"}
                        </div>
                    </Col>
                    <Col span={2} className="flex alignCenter justifyCenter">
                        <div>Avg. Coaching Progress</div>
                    </Col>
                    <Col span={2} className="flex alignCenter justifyCenter">
                        <div>Sessions Not Started</div>
                    </Col>
                    <Col span={2} className="flex alignCenter justifyCenter">
                        <div>Sessions Completed</div>
                    </Col>
                    <Col span={2} className="flex alignCenter justifyCenter">
                        <div>Assigned Sessions</div>
                    </Col>
                    <Col span={2} className="flex alignCenter justifyCenter">
                        <div>Areas of Concern</div>
                    </Col>

                    <Col span={4} className="flex alignCenter justifyCenter">
                        <div>Trend</div>
                    </Col>
                    <Col span={3} className="flex alignCenter justifyCenter">
                        <div>Recent Evaluation</div>
                    </Col>
                    <Col span={2} className="flex alignCenter justifyCenter">
                        <div>Avg. Call Quality</div>
                    </Col>
                    <Col span={2} className="flex alignCenter justifyCenter">
                        Actions
                    </Col>
                </Row>
            </div>
            {data.map((e, i) => (
                <DataCard key={i} {...e} type={type} />
            ))}
        </div>
    );
}

const DataCard = ({
    rank,
    name,
    average_coaching_progress,
    sessions_not_started,
    sessions_completed,
    assigned,
    area_of_concern,
    recent_evalution,
    average_call_quality,
    trend,
    type,
    id,
}) => {
    const colors = ["#52C41A", "#FFCA28", "#FF8A00", "#FF0080", "#00C5FF"];
    const dispatch = useDispatch();
    // const trend = [
    //     {
    //         epoch: 1655145000000,

    //         percentage: 2,
    //     },
    //     {
    //         epoch: 1655231400000,

    //         percentage: 1,
    //     },
    //     {
    //         epoch: 1655663400000,

    //         percentage: 17,
    //     },
    //     {
    //         epoch: 1655749800000,

    //         percentage: 3,
    //     },
    //     {
    //         epoch: 1655836200000,

    //         percentage: 1,
    //     },
    //     {
    //         epoch: 1656268200000,

    //         percentage: 0,
    //     },
    // ];

    const {
        common: {
            versionData: { stats_threshold },
        },
    } = useSelector((state) => state);

    return (
        <div className="coach__stat--card marginB16">
            <Row className="flex1 font16 mine_shaft_cl">
                <Col span={1} className="flex alignCenter justifyCenter">
                    <div>
                        {rank === 1 ? (
                            <GoldSvg />
                        ) : rank === 2 ? (
                            <SilverSvg />
                        ) : rank === 3 ? (
                            <BronzeSvg />
                        ) : (
                            <span className="bold600 font16 none_shaft_cl">
                                #{rank}
                            </span>
                        )}
                    </div>
                </Col>
                <Col span={2} className="flex alignCenter">
                    <Tooltip destroyTooltipOnHide title={name}>
                        <div
                            className="bold600 font16 mine_shaft_cl"
                            style={{
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {name}
                        </div>
                    </Tooltip>
                </Col>
                <Col span={2} className="flex alignCenter justifyCenter">
                    <div className="primary_cl">
                        {formatFloat(average_coaching_progress, 2)}%
                    </div>
                </Col>
                <Col span={2} className="flex alignCenter justifyCenter">
                    <div>{sessions_not_started}</div>
                </Col>
                <Col span={2} className="flex alignCenter justifyCenter">
                    <div>{sessions_completed}</div>
                </Col>
                <Col span={2} className="flex alignCenter justifyCenter">
                    <div
                        style={{
                            color: "#FD6D01",
                        }}
                    >
                        {assigned}
                    </div>
                </Col>

                <Col span={2} className="flex alignCenter justifyCenter ">
                    <div className="bitter_sweet_cl">{area_of_concern}</div>
                </Col>

                <Col span={4} className="flex alignCenter justifyCenter">
                    <TrendGraph
                        x={trend.map(({ epoch }) =>
                            new Date(epoch).toDateString()
                        )}
                        y={trend.map(({ percentage }) => percentage)}
                    />
                </Col>
                <Col span={3} className="flex alignCenter justifyCenter">
                    <div className="flex">
                        {recent_evalution?.map((c, idx) => (
                            <Tooltip
                                key={idx}
                                destroyTooltipOnHide
                                title={<div>{formatFloat(c, 2)}%</div>}
                            >
                                <div
                                    className="circle"
                                    style={{
                                        backgroundColor:
                                            c >= stats_threshold.good
                                                ? "#52C41A"
                                                : c >= 50
                                                ? "#ECA51D"
                                                : "#FF6365",
                                    }}
                                ></div>
                            </Tooltip>
                        ))}
                    </div>
                </Col>
                <Col span={2} className="flex alignCenter justifyCenter">
                    <div
                        style={{
                            color:
                                average_call_quality >= stats_threshold.good
                                    ? "#52C41A"
                                    : average_call_quality > 50
                                    ? "#ECA51D"
                                    : "#FF6365",
                        }}
                    >
                        {formatFloat(average_call_quality, 2)}%
                    </div>
                </Col>
                <Col
                    span={2}
                    className="flex alignCenter justifyCenter primary_cl curPoint"
                    onClick={() => {
                        type === "team"
                            ? dispatch(changeActiveTeam([id]))
                            : dispatch(setActiveRep([id]));
                    }}
                >
                    View
                </Col>
            </Row>
        </div>
    );
};

export default FilterAppliedLeadboard;
