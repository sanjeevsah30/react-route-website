import React, { useState, useEffect } from "react";
import { Heatmap, Label, Tag } from "@presentational/reusables";
import IndividualCallConfig from "@constants/IndividualCall/index";
import { getColor, getRandomColors, uid } from "@tools/helpers";
import { Row, Col } from "antd";

export default function MeetingHeatMap(props) {
    const [monologues, setMonologues] = useState({});
    const [callerOverview, setCallerOverview] = useState({});
    const [questions, setQuestions] = useState([]);
    const [actionItems, setActionItems] = useState([]);

    useEffect(() => {
        // get the Caller Overview.
        setCallerOverview({
            recpName: props.meeting.owner && props.meeting.owner.first_name,
            totalLength: props.mEndTime - props.mStartTime,
            mainLabel: `${
                props.meeting.stats && props.meeting.stats.owner_question_count
            } Questions`,
            talkratio: `${
                props.meeting.stats &&
                (props.meeting.stats.owner_talk_ratio * 100).toFixed(2)
            } %`,
        });

        let transQuestions = {};
        let transMonologues = {};
        let transActions = {};

        props.transcript.map((transcript) => {
            if (!transQuestions[transcript.speaker_name]) {
                transQuestions[transcript.speaker_name] = {
                    questionCount: 0,
                    questions: [],
                };
            }
            if (!transMonologues[transcript.speaker_name]) {
                transMonologues[transcript.speaker_name] = [];
            }

            if (!transActions[transcript.speaker_name]) {
                transActions[transcript.speaker_name] = [];
            }

            // Extract Monologues for all speakers
            transMonologues[transcript.speaker_name].push({
                startsAt: transcript.start_time,
                endsAt: transcript.end_time,
                color: getColor(transcript.speaker_name),
                name: transcript.speaker_name,
            });

            // Extract all questions for all speakers
            if (transcript.sentence_categories.question) {
                transcript.sentence_categories.question.forEach((question) => {
                    // if (question.text.split(' ').length > 3) {
                    // Increment question count
                    transQuestions[transcript.speaker_name].questionCount =
                        transQuestions[transcript.speaker_name].questionCount +
                        1;

                    // Add question
                    transQuestions[transcript.speaker_name].questions.push({
                        name: transcript.speaker_name,
                        time: question.start_time || 0,
                        text: question.text,
                        type: IndividualCallConfig.QUESTIONTYPE,
                    });
                    // }
                });
            }

            // Extract Actions
            if (transcript.sentence_categories.action) {
                transcript.sentence_categories.action.forEach((action) => {
                    transActions[transcript.speaker_name].push({
                        name: transcript.speaker_name,
                        time: action.start_time || 0,
                        text: action.text,
                        type: IndividualCallConfig.ACTIONTYPE,
                    });
                });
            }
        });

        setQuestions(transQuestions);
        setMonologues(transMonologues);
        setActionItems(transActions);
    }, [props.meeting]);

    return (
        <>
            {Object.keys(monologues).map((monologue, idx) => {
                let repName = monologues[monologue][0].name;
                return (
                    <Row className={"share-heatmap"} key={uid() + idx}>
                        <Col span={12} className={"share-heatmap-top-left"}>
                            {/* <Label label={IndividualCallConfig.CALLER} /> */}
                            <Label labelClass={"namelabel"} label={repName} />
                        </Col>
                        <Col span={12} className={"share-heatmap-top-right"}>
                            <Tag
                                label={`${questions[repName].questionCount} Questions`}
                            />
                            {/* <Tag label={callerOverview.talkratio} /> */}
                        </Col>
                        <Col span={24} className={"share-heatmap-bars"}>
                            <Heatmap
                                // showCommunication={true}
                                showMessages={true}
                                showTimeline={true}
                                defaultClass={"callerbar"}
                                startAtPoint={props.seekNplay}
                                showTimeBars={true}
                                communication={[
                                    ...questions[repName].questions,
                                    ...actionItems[repName],
                                ]}
                                bars={monologues[monologue]}
                                playedSeconds={props.playedSeconds}
                                {...callerOverview}
                            />
                        </Col>
                    </Row>
                );
            })}
        </>
    );
}
