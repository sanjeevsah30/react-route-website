import React, { useState } from "react";
import { Col, Progress, Row, Skeleton, Table, Tooltip } from "antd";
import InfoCircleSvg from "app/static/svg/InfoCircleSvg";
import GoldSvg from "app/static/svg/Gold";
import SilverSvg from "app/static/svg/SilverSvg";
import BronzeSvg from "app/static/svg/BronzeSvg";
import BarSvg from "app/static/svg/BarSvg";
import LineSvg from "app/static/svg/LineSvg";
import { formatFloat } from "@tools/helpers";
import { useSelector } from "react-redux";

const Leaderboard = ({ tooltip_text }) => {
    const {
        coaching_dashboard: { rep_leaderboard, rep_leaderboard_loading },
        auth,
    } = useSelector((state) => state);

    const data = rep_leaderboard
        ? rep_leaderboard
              ?.map?.((e, idx) => ({
                  id: e.ID,
                  progress: e["AVG. COACHING PROGRESS"],
                  call_quality: e["AVG. CALL QUALITY"],
                  rank: e["RANK"],
                  name: e.NAME,
              }))
              .slice(0, 5)
        : [];

    return (
        <div className="leaderboard_wrapper">
            {rep_leaderboard_loading ? (
                <div className="padding16">
                    <Skeleton active paragraph={{ rows: 8 }} title={false} />
                </div>
            ) : (
                <div className="leaderboard_table">
                    <div className="top_header">
                        <div className="flex alignCenter bold600 mine_shaft_cl font16">
                            <span>Leaderboard ({data?.length})</span>
                            <Tooltip title={"Leaderboard"}>
                                <span className="curPoint paddingT5 paddingL10">
                                    <InfoCircleSvg />
                                </span>
                            </Tooltip>
                        </div>
                    </div>

                    <Row className="leaderboard-header width100p bordered">
                        <Col className="flex alignCenter" span={2}>
                            <span>RANK</span>
                        </Col>
                        <Col className="flex alignCenter" span={12}>
                            <span> NAME </span>
                        </Col>
                        <Col className="flex alignCenter text-center" span={5}>
                            <span> AVERAGE COACHING PROGRESS </span>
                        </Col>
                        <Col
                            className="flex justifyCenter alignCenter text-center"
                            span={5}
                        >
                            <span> AVG CALL QUALITY </span>
                        </Col>
                    </Row>
                    <div className="paddingTB15">
                        {data?.map((el, idx) => (
                            <LeaderboardUser
                                rank={el.rank}
                                name={el.name}
                                progress={el.progress}
                                call_quality={el.call_quality}
                                key={idx}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const LeaderboardUser = ({ rank, name, progress, call_quality }) => {
    const {
        common: {
            versionData: { stats_threshold },
        },
    } = useSelector((state) => state);
    return (
        <Row className="width100p paddingLR15 paddingTB10" gutter={[0, 12]}>
            <Col className="flex alignCenter" span={2}>
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
            </Col>
            <Col className="flex column" span={12}>
                <div>{name}</div>
                <Progress
                    percent={progress}
                    showInfo={false}
                    strokeColor="#1A62F2"
                />
            </Col>
            <Col
                className="flex bold600 font18 justifyCenter alignCenter text-center"
                span={5}
            >
                <span> {formatFloat(progress, 2)}% </span>
            </Col>
            <Col
                className="flex justifyCenter alignCenter text-center bold600 font18"
                span={5}
            >
                <span
                    style={{
                        color:
                            call_quality >= stats_threshold.good
                                ? "#52C41A"
                                : call_quality > stats_threshold.bad
                                ? "#ECA51D"
                                : "#FF6365",
                    }}
                >
                    {" "}
                    {formatFloat(call_quality, 2)}%{" "}
                </span>
            </Col>
        </Row>
    );
};

export default Leaderboard;
