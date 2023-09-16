import React, { useContext, useEffect, useRef, useState } from "react";
import { Label, Heatmap } from "@reusables";
import config from "@constants/IndividualCall";
import { Badge, Button, Popover, Tag, Tooltip } from "antd";
import Processing from "./Processing";
import IndividualCallConfig from "@constants/IndividualCall/index";
import { NoData } from "@presentational/reusables/index";

import SpeakerStats from "./SpeakerStats";
import { capitalizeFirstLetter, formatFloat } from "@tools/helpers";
import { useSelector } from "react-redux";
import { CallContext } from "./IndividualCall";

const CallOverview = (props) => {
    const baseClass = `individualcall-overview`;
    const ref = useRef();
    const [widthMd, setWidthMd] = useState(false);

    useEffect(() => {
        if (ref.current) {
            const observer = new ResizeObserver((entries) => {
                if (entries[0]?.contentRect?.width <= 700) {
                    return setWidthMd(true);
                }
                setWidthMd(false);
            });
            observer.observe(ref.current);
        }
    }, []);
    const {
        common: { versionData },
    } = useSelector((state) => state);

    return (
        <>
            {props.isProcessing ? (
                <div className="height100p flex alignCenter justifyCenter">
                    <Processing />
                </div>
            ) : (
                <>
                    <div className={`${baseClass} flex1`}>
                        <div className={`${baseClass}-stats`} ref={ref}>
                            {!!Object.keys(props.monologues).length ? (
                                <>
                                    <div
                                        className={`${baseClass}-stats-participants overflowYscroll`}
                                    >
                                        {Object.keys(props.monologues).map(
                                            (monologue) => {
                                                let repName =
                                                    props.monologues[
                                                        monologue
                                                    ][0].name;
                                                let repId =
                                                    props
                                                        .transcript_speaker_ids?.[
                                                        repName
                                                    ];
                                                return (
                                                    <OverviewHeatMap
                                                        key={repName}
                                                        monologue={
                                                            props.monologues[
                                                                monologue
                                                            ]
                                                        }
                                                        name={repName}
                                                        handleTabChange={
                                                            props.handleTabChange
                                                        }
                                                        getComment={
                                                            props.getComment
                                                        }
                                                        startAtPoint={
                                                            props.startAtPoint
                                                        }
                                                        playedSeconds={
                                                            props.playedSeconds
                                                        }
                                                        callerOverview={
                                                            props.callerOverview
                                                        }
                                                        communication={[
                                                            ...props
                                                                .actionItems[
                                                                repName
                                                            ].data,
                                                            ...props
                                                                .importantMoments[
                                                                repName
                                                            ].data,
                                                        ]}
                                                        questionCount={
                                                            props.questions[
                                                                repName
                                                            ].count
                                                        }
                                                        actionsCount={
                                                            props.actionItems[
                                                                repName
                                                            ].count
                                                        }
                                                        momentsCount={
                                                            props
                                                                .importantMoments[
                                                                repName
                                                            ].count
                                                        }
                                                        setcommentToAdd={
                                                            props.setcommentToAdd
                                                        }
                                                        commentToAdd={
                                                            props.commentToAdd
                                                        }
                                                        stats={
                                                            props.speaker_stats[
                                                                repId
                                                            ] || null
                                                        }
                                                        widthMd={widthMd}
                                                        sentimentMonologue={
                                                            props
                                                                .sentimentMonologues?.[
                                                                monologue
                                                            ]
                                                        }
                                                    />
                                                );
                                            }
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="height100p flex alignCenter justifyCenter">
                                    <NoData description="No information found" />
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

const OverviewHeatMap = (props) => {
    const { stats, widthMd } = props;
    const isParticipant = props.monologue?.[0]?.speaker_type === "PARTICIPANT";
    const { callDetails } = useContext(CallContext);
    const participant_talk_ratio = callDetails?.stats?.participant_talk_ratio;
    return (
        <div className={`individualcall-overview-stats-caller paddingT20`}>
            <div
                className="individualcall-overview-stats-receiver-top"
                style={
                    widthMd
                        ? {
                              flexDirection: "column",
                              gap: "12px",
                          }
                        : {}
                }
            >
                <div className="flex">
                    <div className="nameLabel">
                        <Label labelClass={"namelabel"} label={props.name} />
                        <div
                            className={`speaker_tag marginR8 ${props.monologue?.[0]?.speaker_type?.toLowerCase()}`}
                        >
                            {capitalizeFirstLetter(
                                props.monologue?.[0]?.speaker_type
                            )}
                        </div>
                    </div>
                    {stats && (
                        <Popover
                            overlayClassName={"heatmap__stat--popover"}
                            destroyTooltipOnHide={{ keepParent: false }}
                            content={
                                <SpeakerStats
                                    talkRatio={stats.talk_ratio}
                                    longestMonologue={stats.longest_monologue}
                                    patience={stats.patience}
                                    questionRate={stats.question_count}
                                    fillerRate={stats.filler_rate}
                                    overlapRate={stats.overlap_rate}
                                    talkSpeed={stats.talk_speed}
                                />
                            }
                            placement={"left"}
                            trigger={"hover"}
                        >
                            <Tooltip title={"Stats"}>
                                <Tag
                                    style={{
                                        border: "none",
                                    }}
                                    className="convin_tag curPoint stats_tag"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="5"
                                        height="11"
                                        viewBox="0 0 5 11"
                                        fill="none"
                                    >
                                        <path
                                            d="M3.80794 1.53073C3.95669 1.57059 4.11392 1.56545 4.25975 1.51595C4.40557 1.46644 4.53345 1.37481 4.6272 1.25264C4.72095 1.13046 4.77636 0.98323 4.78643 0.829561C4.79651 0.675891 4.76078 0.522686 4.68378 0.389319C4.60678 0.255951 4.49197 0.148412 4.35385 0.0802995C4.21573 0.0121871 4.06052 -0.0134389 3.90784 0.00666175C3.75515 0.0267624 3.61186 0.0916871 3.49608 0.193226C3.3803 0.294764 3.29722 0.428356 3.25737 0.577108C3.20392 0.776577 3.2319 0.989107 3.33515 1.16795C3.43841 1.34678 3.60847 1.47728 3.80794 1.53073Z"
                                            fill="#666666"
                                        />
                                        <path
                                            d="M2.82561 8.20513L4.07163 3.55493C4.29823 2.70923 3.31947 2.15478 2.0293 2.80773C1.23688 3.26575 0.546335 3.88077 0 4.6151C0 4.6151 2.56563 3.15856 2.13795 4.75468L0.891936 9.40488C0.665336 10.2506 1.64408 10.805 2.93425 10.1521C3.72668 9.69407 4.41722 9.07904 4.96356 8.34471C4.96356 8.34471 2.39793 9.80125 2.82561 8.20513Z"
                                            fill="#666666"
                                        />
                                    </svg>
                                    <span className="marginL4 marginT2 dove_gray_cl font12">
                                        Stats
                                    </span>
                                </Tag>
                            </Tooltip>
                        </Popover>
                    )}
                    <div className="dove_gray_cl marginL10">
                        {isParticipant || stats === null || stats === undefined
                            ? participant_talk_ratio?.[props.name]
                                ? `${formatFloat(
                                      participant_talk_ratio?.[props.name] *
                                          100,
                                      2
                                  )}%`
                                : ""
                            : typeof stats?.talk_ratio === "number"
                            ? `${formatFloat(stats.talk_ratio * 100, 2)}%`
                            : ""}
                    </div>
                </div>

                <div className="actions_stats">
                    {!!props.questionCount && (
                        <Tooltip
                            destroyTooltipOnHide
                            title={`${props.questionCount} Questions`}
                            placement={"top"}
                        >
                            <Tag
                                className="heatmap-tag questions"
                                // icon={<QuestionCircleOutlined />}
                                onClick={() =>
                                    props.handleTabChange(
                                        IndividualCallConfig.TABS.questions
                                            .value,
                                        props.name
                                    )
                                }
                            >
                                <span className="heatmap-tag-label">
                                    Questions
                                </span>
                                <span className="heatmap-tag-count">
                                    {props.questionCount}
                                </span>
                            </Tag>
                        </Tooltip>
                    )}
                    {!!props.actionsCount && (
                        <Tooltip
                            destroyTooltipOnHide
                            title={`${props.actionsCount} Actions`}
                            placement={"top"}
                        >
                            <Tag
                                className="heatmap-tag actions"
                                // icon={<AimOutlined />}
                                onClick={() =>
                                    props.handleTabChange(
                                        IndividualCallConfig.TABS.actions.value,
                                        props.name
                                    )
                                }
                            >
                                <span className="heatmap-tag-label">
                                    Actions
                                </span>
                                <span className="heatmap-tag-count">
                                    {props.actionsCount}
                                </span>
                            </Tag>
                        </Tooltip>
                    )}
                    {!!props.momentsCount && (
                        <Tooltip
                            destroyTooltipOnHide
                            title={`${props.momentsCount} Important Moments`}
                            placement={"top"}
                        >
                            <Tag
                                className="heatmap-tag moments"
                                // icon={<InfoCircleOutlined />}
                                onClick={() =>
                                    props.handleTabChange(
                                        IndividualCallConfig.TABS.moments.value,
                                        props.name
                                    )
                                }
                            >
                                <span className="heatmap-tag-label">
                                    Moments
                                </span>
                                <span className="heatmap-tag-count">
                                    {props.momentsCount}
                                </span>
                            </Tag>
                        </Tooltip>
                    )}
                </div>
            </div>
            <Heatmap
                showCommunication={false}
                showTimeline={true}
                getComment={props.getComment}
                startAtPoint={props.startAtPoint}
                showTimeBars={true}
                communication={props.communication}
                bars={props.monologue}
                playedSeconds={props.playedSeconds}
                {...props.callerOverview}
                setcommentToAdd={props.setcommentToAdd}
                commentToAdd={props.commentToAdd}
                sentimentMonologue={props.sentimentMonologue}
            />
        </div>
    );
};

export const CallOverviewTopics = (props) => {
    const baseClass = `individualcall-overview`;
    const {
        common: { versionData },
    } = useSelector((state) => state);
    return versionData?.domain_type === "b2b" ||
        Object.keys(props?.topics)?.length ? (
        <div className={`${baseClass}-stats-detailscontainer`}>
            <div className={`${baseClass}-stats-details`}>
                <span className="font16 bold600 marginR8">Topics</span>
                <div className={`${baseClass}-stats-details-topic`}>
                    {props.callTopics.length ? (
                        <Heatmap
                            showCommunication={false}
                            showMessages={false}
                            showColors={true}
                            showTimeBars={true}
                            startAtPoint={props.startAtPoint}
                            bars={props.callTopics}
                            totalLength={
                                props?.receiverOverview?.totalLength || 0
                            }
                            playedSeconds={props.playedSeconds}
                        />
                    ) : (
                        <Label
                            label={config.NOTOPICS}
                            labelClass={"notopics"}
                        />
                    )}
                </div>
                <div className={`${baseClass}-stats-details-legends marginT12`}>
                    {!!props.callTopics.length && (
                        <div className={"detsection alignCenter"}>
                            {Object.keys(props?.topics)?.map((topic) => {
                                return (
                                    <Button
                                        type={"text"}
                                        key={topic}
                                        onClick={() =>
                                            props.setActiveTopic(topic)
                                        }
                                        className="topic_name--btn"
                                    >
                                        <span className="bold400">{topic}</span>
                                        &nbsp;
                                        <Badge
                                            count={
                                                props.topics[topic]?.allData
                                                    ?.length
                                            }
                                            style={{
                                                backgroundColor: `${props.topics[topic]?.color}1A`,
                                                fontWeight: 700,
                                                color: props.topics[topic]
                                                    .color,
                                                borderRadius: "6px",
                                                marginLeft: "4px",
                                            }}
                                        />
                                    </Button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : null;
};

export default CallOverview;
