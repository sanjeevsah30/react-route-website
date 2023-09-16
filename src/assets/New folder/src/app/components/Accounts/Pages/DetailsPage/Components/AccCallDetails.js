import {
    Button,
    Col,
    Collapse,
    Popover,
    Radio,
    Row,
    Skeleton,
    Tabs,
    Tag,
} from "antd";
import React, { useContext, useEffect, useState } from "react";

import Dot from "@presentational/reusables/Dot";
import PhoneSvg from "app/static/svg/PhoneSvg";
import {
    capitalizeFirstLetter,
    checkArray,
    formatFloat,
    getDateTime,
    getDuration,
    goToCall,
    goToTranscriptTab,
    secondsToTime,
} from "@tools/helpers";
import { AccountsContext, useParticipantsHook } from "../../../Accounts";
import MultipleAvatars from "../../../../presentational/reusables/MultipleAvatars";
import IndividualCallConfig from "@constants/IndividualCall/index";
import NoTopicsSvg from "app/static/svg/NoTopicsSvg";
import ClockSvg from "app/static/svg/ClockSvg";
import NoActionItemsSvg from "app/static/svg/NoActionItemsSvg";
import NoQuestionsSvg from "app/static/svg/NoQuestionsSvg";
import NoMomentsSvg from "app/static/svg/NoMomentsSvg";
import config from "@constants/IndividualCall";
import MonologuePlayer from "@presentational/reusables/MonologuePlayer";
import { PlayCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import NoSearchResultsSvg from "app/static/svg/NoSearchResultsSvg";
import { LeadInfo } from "@convin/modules/conversationDetails/components/ConversationLeadScore";
import { capitalize } from "lodash";

const { Panel } = Collapse;
const { TabPane } = Tabs;

const getTotalKeys = (obj = {}) => {
    return Object.keys(obj).length;
};

function AccCallDetails({
    title,
    start_time,
    end_time,
    owner,
    client,
    reps,
    id,
    searchActive,
    search_context,
    calls,
    meeting_type,
    conference_tool,
}) {
    const {
        state: { activeCallTranscripts, activeCall },
        domain,
        transcriptsLoader,
    } = useContext(AccountsContext);

    const [activeTopic, setActiveTopic] = useState("");
    const [stats, setStats] = useState({});
    const [snippets, setSnippets] = useState([]);
    const [transcripts, setTranscripts] = useState([]);

    useEffect(() => {
        if (activeCallTranscripts?.monologueTopics) {
            const keys = Object.keys(activeCallTranscripts?.monologueTopics);
            keys.length && setActiveTopic(keys[0]);
        }
    }, [activeCallTranscripts]);

    const [participants, setParticipants] = useParticipantsHook({
        owner: [owner],
        client: client ? [client] : [],
        reps,
    });

    console.log(activeCall);
    useEffect(() => {
        const arr = [];
        if (owner) {
            arr.push(owner);
        }
        if (client) {
            arr.push(client);
        }

        setParticipants([...arr, ...reps]);
    }, [owner, reps, client]);

    useEffect(() => {
        if (activeCall?.stats) setStats(activeCall.stats);
    }, [activeCall]);

    const getTotalStats = ({ ai_score, manual_score, lead_score }) => {
        let count = 9;
        if (typeof ai_score === "number") {
            count += 1;
        }
        if (typeof manual_score === "number") {
            count += 1;
        }
        if (typeof lead_score === "number") {
            count += 1;
        }
        return count;
    };

    const {
        searchFilters: { aiDataFilter, leadScoreFilter },
    } = useContext(AccountsContext);

    useEffect(() => {
        const call = calls?.find((call) => call.id === id);
        if (call) {
            call.snippets && setSnippets(call.snippets);
            Array.isArray(call?.search_context) &&
                setTranscripts(call.search_context);
        }
    }, [calls, id]);

    return (
        <>
            <div className="border_bottom padding19 mine_shaft_cl flexShrink call__details--container">
                <div className="flex justifySpaceBetween">
                    <div className="flex1 paddingR16">
                        <div className="bold700 font18">{title}</div>
                        {start_time && end_time && (
                            <Tag
                                color="#1A62F233"
                                className="bold primary_cl--important"
                            >
                                <div className=" flex alignCenter">
                                    <ClockSvg />
                                    <span className="bold600 font12">
                                        &nbsp;
                                        {getDuration(start_time, end_time)}{" "}
                                    </span>
                                </div>
                            </Tag>
                        )}
                    </div>
                    <div className="dove_gray_cl font12 marginT4">
                        {getDateTime(start_time)}
                    </div>
                </div>

                {/* <Row>
                    <Col span={18}>
                        <div className="bold700 font18">{title}</div>
                        {start_time && end_time && (
                            <Tag
                                color="#1A62F233"
                                className="bold primary_cl--important"
                            >
                                <div className=" flex alignCenter">
                                    <ClockSvg />
                                    <span className="bold600 font12">
                                        &nbsp;
                                        {getDuration(start_time, end_time)}{' '}
                                    </span>
                                </div>
                            </Tag>
                        )}
                    </Col>
                    <Col span={6} className="flex justifyEnd">
                        <div className="dove_gray_cl font12">
                            {getDateTime(start_time)}
                        </div>
                    </Col>
                </Row> */}
                <Row className="marginT20">
                    <Col
                        span={12}
                        className="dove_gray_cl font14 curPoint flex alignCenter"
                    >
                        <MultipleAvatars
                            participants={participants}
                            className={"calls__card__avatar--group"}
                            size={25}
                        />
                    </Col>
                    <Col span={12} className="flex justifyEnd">
                        {conference_tool === "convin_qms" ? (
                            <></>
                        ) : (
                            <Button
                                ghost
                                className="borderRadius5 border button_primary acc_details_btn view_transcript_button marginR10"
                                onClick={() =>
                                    goToCall({
                                        domain,
                                        id,
                                        tab: IndividualCallConfig.TABS
                                            .transcript.value,
                                    })
                                }
                            >
                                <span className="bold700">View Transcript</span>
                            </Button>
                        )}
                        <Button
                            icon={
                                <PhoneSvg
                                    style={{
                                        fontSize: "12px",
                                        color: "#ffffff",
                                    }}
                                />
                            }
                            className="acc_details_btn borderRadius5 border go__to__call--btn font12 flex alignCenter"
                            onClick={() =>
                                goToCall({
                                    domain,
                                    id,
                                    conference_tool,
                                    meeting_type,
                                })
                            }
                        >
                            <span className="bold700">
                                Go to {meeting_type || "call"}
                            </span>
                        </Button>
                    </Col>
                </Row>
            </div>
            <div className="dusty_gray_cl">
                {transcriptsLoader ? (
                    <Skeleton
                        className="paddingLR16 paddingTB16"
                        active
                        title={false}
                        paragraph={{
                            rows: 5,
                        }}
                    />
                ) : (
                    <Collapse
                        expandIconPosition="right"
                        bordered={false}
                        defaultActiveKey={["snippets", "transcripts", "stats"]}
                    >
                        {activeCall?.lead_analysis?.classification &&
                        activeCall?.lead_analysis?.metadata !== null ? (
                            <Panel
                                header={
                                    <div>
                                        {"Lead Score "}|
                                        <span
                                            className={`lead_score_type ${activeCall?.lead_analysis?.classification?.toLowerCase()}`}
                                        >
                                            {capitalize(
                                                activeCall?.lead_analysis
                                                    ?.classification
                                            )}
                                        </span>
                                    </div>
                                }
                                key="lead_score"
                                className="white_bg"
                            >
                                <LeadInfo {...activeCall.lead_analysis} />
                            </Panel>
                        ) : (
                            <></>
                        )}
                        {(aiDataFilter?.question_id ||
                            aiDataFilter?.sub_filter_id ||
                            leadScoreFilter?.type_id) && (
                            <Panel
                                header={`Snippets (${snippets?.length})`}
                                key="snippets"
                                className="white_bg"
                            >
                                {snippets.length ? (
                                    checkArray(snippets)?.map(
                                        (snippet, idx) => (
                                            <TopicTranscript
                                                {...snippet}
                                                key={idx + snippet.start_time}
                                                text={
                                                    snippet.n_sentences_transcript_text
                                                }
                                                time={snippet.start_time}
                                                highlightMarkDissableClass=""
                                                meeting_id={activeCall.id}
                                                title={activeCall.title}
                                                startsAt={snippet.start_time}
                                                endsAt={snippet.end_time}
                                                index={idx}
                                            />
                                        )
                                    )
                                ) : (
                                    <div className="flex alignCenter justifyCenter column paddingT20">
                                        <NoSearchResultsSvg />
                                        <div className="bold700 font18 marginTB20">
                                            No Snippets Found!
                                        </div>
                                    </div>
                                )}
                            </Panel>
                        )}
                        {searchActive && (
                            <Panel
                                header={`Transcripts (${transcripts?.length})`}
                                key="transcripts"
                                className="white_bg"
                            >
                                {checkArray(transcripts)?.map(
                                    (snippet, index) => (
                                        <TopicTranscript
                                            {...snippet}
                                            key={snippet.start_time + index}
                                            text={snippet.headline}
                                            time={snippet.start_time}
                                            highlightMarkDissableClass=""
                                            meeting_id={activeCall.id}
                                            title={activeCall.title}
                                            startsAt={snippet.start_time}
                                            endsAt={snippet.end_time}
                                            index={index}
                                        />
                                    )
                                )}
                            </Panel>
                        )}
                        <Panel
                            header={`Stats (${getTotalStats({ ...stats })})`}
                            key="stats"
                            className="white_bg"
                        >
                            <div className="stats__container">
                                {typeof stats?.ai_score === "number" && (
                                    <div className="stats">
                                        <span className="stat_label">
                                            Ai Audit Score
                                        </span>
                                        <span className="stat_value">
                                            {formatFloat(stats?.ai_score, 2)}%
                                        </span>
                                    </div>
                                )}
                                {typeof stats?.manual_score === "number" && (
                                    <div className="stats">
                                        <span className="stat_label">
                                            Manual Audit Score
                                        </span>
                                        <span className="stat_value">
                                            {formatFloat(
                                                stats?.manual_score,
                                                2
                                            )}
                                            %
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="stats__container">
                                <div className="stats">
                                    <span className="stat_label">
                                        {config.TALKRATIO}
                                    </span>
                                    <span className="stat_value">
                                        {formatFloat(
                                            stats?.owner_talk_ratio * 100,
                                            2
                                        )}
                                        %
                                    </span>
                                </div>
                                <div className="stats">
                                    <span className="stat_label">
                                        {config.PATIENCE}
                                    </span>
                                    <span className="stat_value">
                                        {formatFloat(stats?.patience, 2)} Sec
                                    </span>
                                </div>
                                <div className="stats">
                                    <span className="stat_label">
                                        {config.INTERACTIVITY}
                                    </span>
                                    <span className="stat_value">
                                        {formatFloat(
                                            stats?.interactivity * 10,
                                            2
                                        )}
                                    </span>
                                </div>
                                <div className="stats">
                                    <span className="stat_label">
                                        {config.LONGESTMONO}
                                    </span>
                                    <span className="stat_value">
                                        {formatFloat(
                                            stats?.longest_monologue_owner / 60,
                                            2
                                        )}{" "}
                                        {config.STATS_UNIT}
                                    </span>
                                </div>
                                <div className="stats">
                                    <span className="stat_label">
                                        {config.LONGESTSTORY}
                                    </span>
                                    <span className="stat_value">
                                        {formatFloat(
                                            stats?.longest_monologue_client /
                                                60,
                                            2
                                        )}{" "}
                                        {config.STATS_UNIT}
                                    </span>
                                </div>
                                <div className="stats">
                                    <span className="stat_label">
                                        {config.QUESTION_RATE}
                                    </span>
                                    <span className="stat_value">
                                        {stats?.owner_question_count || 0}
                                    </span>
                                </div>
                                <div className="stats">
                                    <span className="stat_label">
                                        {config.FILLER_RATE}
                                    </span>
                                    <span className="stat_value">
                                        {formatFloat(
                                            stats?.owner_filler_rate * 60
                                        )}{" "}
                                        WPM
                                    </span>
                                </div>
                                <div className="stats">
                                    <span className="stat_label">
                                        {config.OVERLAP_RATE}
                                    </span>
                                    <span className="stat_value">
                                        {" "}
                                        {formatFloat(
                                            stats?.owner_overlap_rate
                                        )}{" "}
                                    </span>
                                </div>
                                <div className="stats">
                                    <span className="stat_label">
                                        {config.TALK_SPEED}
                                    </span>
                                    <span className="stat_value">
                                        {" "}
                                        {formatFloat(
                                            stats?.owner_talk_speed * 60
                                        )}{" "}
                                        WPM
                                    </span>
                                </div>
                            </div>
                        </Panel>
                        <Panel
                            header={`Topics Discussed (${getTotalKeys(
                                activeCallTranscripts?.monologueTopics
                            )})`}
                            className="white_bg"
                            key="topics"
                        >
                            {activeCallTranscripts?.monologueTopics && (
                                <Radio.Group
                                    size={"small"}
                                    onChange={(e) =>
                                        setActiveTopic(e.target.value)
                                    }
                                    value={activeTopic}
                                >
                                    {Object.keys(
                                        activeCallTranscripts?.monologueTopics
                                    )?.map((key) => (
                                        <Radio.Button value={key} key={key}>
                                            {key}
                                        </Radio.Button>
                                    ))}
                                </Radio.Group>
                            )}
                            <div>
                                {activeTopic &&
                                activeCallTranscripts?.monologueTopics?.[
                                    activeTopic
                                ] &&
                                activeCallTranscripts?.monologueTopics?.[
                                    activeTopic
                                ].allData.length ? (
                                    activeCallTranscripts?.monologueTopics?.[
                                        activeTopic
                                    ]?.allData?.map((data, idx) => (
                                        <TopicTranscript
                                            key={data.time + idx}
                                            {...data}
                                            showBorder={
                                                idx !==
                                                activeCallTranscripts
                                                    ?.monologueTopics?.[
                                                    activeTopic
                                                ].allData.length -
                                                    1
                                            }
                                            meeting_id={activeCall.id}
                                            title={activeCall.title}
                                        />
                                    ))
                                ) : (
                                    <div className="flex alignCenter justifyCenter column paddingTB20">
                                        <NoTopicsSvg />
                                        <div className="bold700 font18 marginT10">
                                            No Topics Found!
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Panel>
                        <Panel
                            header={`Action Items Detected (${
                                activeCallTranscripts?.actionItems?.["all"]
                                    ?.count || 0
                            })`}
                            key="action_items"
                            className="white_bg"
                        >
                            <SentencePanel
                                object={activeCallTranscripts?.actionItems}
                                notFoundText="No Action Items Found!"
                                NotFoundSvg={NoActionItemsSvg}
                                meeting_id={activeCall.id}
                                title={activeCall.title}
                            />
                        </Panel>
                        <Panel
                            header={`Questions Asked (${
                                activeCallTranscripts?.questions?.["all"]
                                    ?.count || 0
                            })`}
                            key="questions"
                            className="white_bg"
                        >
                            <SentencePanel
                                object={activeCallTranscripts?.questions}
                                notFoundText="No Questions Found!"
                                NotFoundSvg={NoQuestionsSvg}
                                meeting_id={activeCall.id}
                                title={activeCall.title}
                            />
                        </Panel>
                        <Panel
                            header={`Moments Detected (${
                                activeCallTranscripts?.importantMoments?.["all"]
                                    ?.count || 0
                            })`}
                            key="moments"
                            className="white_bg"
                        >
                            <SentencePanel
                                object={activeCallTranscripts?.importantMoments}
                                notFoundText="No Moments Found!"
                                NotFoundSvg={NoMomentsSvg}
                                meeting_id={activeCall.id}
                                title={activeCall.title}
                            />
                        </Panel>
                    </Collapse>
                )}
            </div>
        </>
    );
}

const TopicTranscript = ({
    time,
    text,
    speaker_name,
    highlightMarkDissableClass = "highlight_mark_dissable",
    showBorder,
    meeting_id,
    title,
    startsAt,
    endsAt,
}) => {
    const { domain } = useSelector((state) => state.common);

    return (
        <div
            className={`transcript paddingTB12 ${
                showBorder ? "border_bottom" : ""
            }`}
        >
            <Row className="marginB4">
                <Col span={24} className="flex justifySpaceBetween">
                    <div className="bolder font14 flex alignCenter">
                        <Dot
                            height="8px"
                            width="8px"
                            className="dusty_gray_bg "
                        />
                        <span className="flex1 paddingL14 bold600">
                            {speaker_name || "Multiple Speakers"}
                        </span>
                    </div>
                    <div
                        className=" flex alignCenter primary_cl  curPoint"
                        onClick={(e) => {
                            goToTranscriptTab({
                                event: e,
                                start_time: startsAt,
                                end_time: endsAt,
                                headline: text,
                                meeting_id,
                                domain,
                            });
                        }}
                    >
                        <div className="marginR5">
                            <ClockSvg />
                        </div>

                        <span className="font12 bold600">
                            {" "}
                            {secondsToTime(time)}
                        </span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={24} className="flex alignStart paddingL15">
                    <Popover
                        overlayClassName={"minWidth30 maxWidth30 maxHeight30"}
                        destroyTooltipOnHide={{ keepParent: false }}
                        content={
                            <MonologuePlayer
                                id={meeting_id}
                                start_time={startsAt}
                                end_time={endsAt}
                            />
                        }
                        title={title}
                        placement={"bottom"}
                        trigger="click"
                        // getPopupContainer={() =>
                        //     document.getElementById(`search__callCard${id}`)
                        // }
                    >
                        <div className="flex alignStart">
                            <Button
                                className="margin0 text-center"
                                icon={<PlayCircleOutlined />}
                                type="link"
                            />
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: text,
                                }}
                                className={`paddingL6 font12 monologue transcript_cl ${highlightMarkDissableClass}`}
                            />
                        </div>
                    </Popover>
                </Col>
            </Row>
        </div>
    );
};

const Transcript = ({
    time,
    text,
    speaker_name,
    showBorder,
    startsAt,
    endsAt,
    meeting_id,
    title = "",
}) => {
    const { domain } = useSelector((state) => state.common);
    return (
        <Row className="transcript paddingT11">
            <Col span={24}>
                <div className="flex justifyEnd">
                    <div
                        className=" flex alignCenter primary_cl curPoint"
                        onClick={(e) => {
                            goToTranscriptTab({
                                event: e,
                                start_time: startsAt,
                                end_time: endsAt,
                                headline: text,
                                meeting_id,
                                domain,
                            });
                        }}
                    >
                        <div className="marginR5">
                            <ClockSvg />
                        </div>
                        <span className="font12 bold600">
                            {" "}
                            {secondsToTime(time)}
                        </span>
                    </div>
                </div>
            </Col>

            <Col
                span={24}
                className={`${
                    showBorder ? "border_bottom" : ""
                } flex alignStart  paddingB14`}
            >
                {/* <Dot height="8px" width="8px" className="dusty_gray_bg marginT4" /> */}

                <Popover
                    overlayClassName={"minWidth30 maxWidth30 maxHeight30"}
                    destroyTooltipOnHide={{ keepParent: false }}
                    content={
                        <MonologuePlayer
                            id={meeting_id}
                            start_time={startsAt}
                            end_time={endsAt}
                        />
                    }
                    title={title}
                    placement={"bottom"}
                    trigger="click"
                    // getPopupContainer={() =>
                    //     document.getElementById(`search__callCard${id}`)
                    // }
                >
                    <div className="flex alignStart">
                        <Button
                            className="margin0 text-center"
                            icon={<PlayCircleOutlined />}
                            type="link"
                        />
                        <div
                            dangerouslySetInnerHTML={{
                                __html: text,
                            }}
                            className="paddingL14 flex1 transcript_cl monologue font12"
                        />
                    </div>
                </Popover>
            </Col>
        </Row>
    );
};

const SentencePanel = ({
    object,
    header,
    key,
    NotFoundSvg,
    notFoundText,
    showBorder,
    meeting_id,
    meeting_title,
}) => {
    return (
        <>
            {object &&
            Object.keys(object)?.filter((key) => object[key].data.length)
                ?.length ? (
                <Tabs
                    defaultActiveKey={"all"}
                    className="accounts__detailspage__body--tabs--container action_items_transcripts_container"
                >
                    {Object.keys(object)
                        ?.filter((key) => object[key].data.length)
                        ?.map((key) => (
                            <TabPane tab={capitalizeFirstLetter(key)} key={key}>
                                {object[key].data.length ? (
                                    object[key].data?.map((data, idx) => (
                                        <Transcript
                                            {...data}
                                            key={data.time + idx}
                                            showBorder={
                                                object[key].data.length - 1 !==
                                                idx
                                            }
                                            meeting_id={meeting_id}
                                            title={meeting_title}
                                        />
                                    ))
                                ) : (
                                    <div className="flex alignCenter justifyCenter column paddingT20">
                                        <NotFoundSvg />
                                        <div className="bold700 font18 marginTB20">
                                            {notFoundText}
                                        </div>
                                    </div>
                                )}
                            </TabPane>
                        ))}
                </Tabs>
            ) : (
                <div className="flex alignCenter justifyCenter column paddingT20">
                    <NotFoundSvg />
                    <div className="bold700 font18 marginTB20">
                        {notFoundText}
                    </div>
                </div>
            )}
        </>
    );
};

AccCallDetails.defaultProps = {
    calls: [],
};

export default AccCallDetails;
