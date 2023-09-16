import {
    QuestionCircleOutlined,
    InfoCircleOutlined,
    AimOutlined,
} from "@ant-design/icons";
import IndividualCallConfig from "@constants/IndividualCall/index";
import { Spinner } from "@presentational/reusables/index";
import {
    getTranscript,
    initializeIndividualCall,
} from "@store/individualcall/actions";
import { Badge, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function SearchCallSummary({
    callId,
    talkRatio,
    longestMonologue,
    interactivity,
    handleClick,
    longestMonologueClient,
    questionRate,
    patience,
    talkSpeed,
    overlapRate,
    fillerRate,
}) {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    const questions = useSelector((state) =>
        state.individualcall[callId]
            ? state.individualcall[callId].questions
            : {}
    );
    const importantMoments = useSelector((state) =>
        state.individualcall[callId]
            ? state.individualcall[callId].importantMoments
            : {}
    );
    const actionItems = useSelector((state) =>
        state.individualcall[callId]
            ? state.individualcall[callId].actionItems
            : {}
    );
    const monologueTopics = useSelector((state) =>
        state.individualcall[callId]
            ? state.individualcall[callId].monologueTopics
            : []
    );
    const monologues = useSelector((state) =>
        state.individualcall[callId]
            ? state.individualcall[callId].monologues
            : {}
    );
    useEffect(() => {
        dispatch(initializeIndividualCall(callId));
        dispatch(getTranscript(callId, true, false)).then(() => {
            setIsLoading(false);
        });
    }, []);

    return (
        <Spinner loading={isLoading}>
            <div className="padding16">
                <div className="marginB15">
                    <p className="font14 text-bold uppercase borderBottom paddingB5">
                        Speakers
                    </p>
                    {Object.keys(monologues).map((speaker) => (
                        <p
                            className="flex justifySpaceBetween alignCenter paddingT10"
                            key={speaker}
                        >
                            <span className="text-bold font14 width10 display-in truncate">
                                {speaker}
                            </span>
                            {questions[speaker] && (
                                <Button
                                    className="marginR8 flex alignCenter"
                                    type="primary"
                                    shape="round"
                                    disabled={!questions[speaker].count}
                                    onClick={() =>
                                        handleClick(
                                            IndividualCallConfig.TABS.questions
                                                .value,
                                            speaker
                                        )
                                    }
                                    icon={<QuestionCircleOutlined />}
                                >
                                    <span className="font12">
                                        {questions[speaker].count} Question(s)
                                    </span>
                                </Button>
                            )}
                            {actionItems[speaker] && (
                                <Button
                                    className="marginR8 flex alignCenter"
                                    type="primary"
                                    shape="round"
                                    disabled={!actionItems[speaker].count}
                                    onClick={() =>
                                        handleClick(
                                            IndividualCallConfig.TABS.actions
                                                .value,
                                            speaker
                                        )
                                    }
                                    icon={<AimOutlined />}
                                >
                                    <span className="font12">
                                        {actionItems[speaker].count} Action(s)
                                    </span>
                                </Button>
                            )}
                            {importantMoments[speaker] && (
                                <Button
                                    className="marginR8 flex alignCenter"
                                    type="primary"
                                    shape="round"
                                    disabled={!importantMoments[speaker].count}
                                    icon={<InfoCircleOutlined />}
                                    onClick={() =>
                                        handleClick(
                                            IndividualCallConfig.TABS.moments
                                                .value,
                                            speaker
                                        )
                                    }
                                >
                                    <span className="font12">
                                        {importantMoments[speaker].count}{" "}
                                        Moment(s)
                                    </span>
                                </Button>
                            )}
                        </p>
                    ))}
                </div>
                <div className="marginB15">
                    <p className="font14 text-bold uppercase borderBottom paddingB5">
                        Topics
                    </p>
                    {!!Object.keys(monologueTopics).length &&
                        Object.keys(monologueTopics).map((topic) => (
                            <Button
                                key={topic}
                                className="marginR8"
                                type="link"
                                shape="round"
                                onClick={() =>
                                    handleClick(
                                        IndividualCallConfig.TABS.topics.value,
                                        "",
                                        topic
                                    )
                                }
                            >
                                <Badge
                                    color={monologueTopics[topic].color}
                                    text={`${topic} (${monologueTopics[topic].count})`}
                                />
                            </Button>
                        ))}
                </div>
                <div className="">
                    <p className="font15 text-bold uppercase borderBottom paddingB5">
                        Conversation Skills
                    </p>
                    <p className="font13 paddingB5 srchSummary__stats">
                        <span className="text-bold">Talk Ratio:&nbsp;</span>
                        <span>{(talkRatio * 100).toFixed(2)} %</span>
                    </p>
                    <p className="font13 paddingB5 srchSummary__stats">
                        <span className="text-bold">
                            Longest Rep Monologue:&nbsp;
                        </span>
                        <span>{(longestMonologue / 60).toFixed(2)} min</span>
                    </p>
                    <p className="font13 paddingB5 srchSummary__stats">
                        <span className="text-bold">
                            Longest Customer Monologue:&nbsp;
                        </span>
                        <span>
                            {(longestMonologueClient / 60).toFixed(2)} min
                        </span>
                    </p>
                    <p className="font13 paddingB5 srchSummary__stats">
                        <span className="text-bold">Interactivity:&nbsp;</span>
                        <span>{(interactivity * 10).toFixed(2)}</span>
                    </p>
                    <p className="font13 paddingB5 srchSummary__stats">
                        <span className="text-bold">Patience:&nbsp;</span>
                        <span>{patience.toFixed(2)}</span>
                    </p>
                    <p className="font13 paddingB5 srchSummary__stats">
                        <span className="text-bold">Question Count:&nbsp;</span>
                        <span>{questionRate}</span>
                    </p>
                    <p className="font13 paddingB5 srchSummary__stats">
                        <span className="text-bold">Filler Words:&nbsp;</span>
                        <span>{Math.floor(fillerRate * 60)} words per min</span>
                    </p>
                    <p className="font13 paddingB5 srchSummary__stats">
                        <span className="text-bold">
                            Interruption Count:&nbsp;
                        </span>
                        <span>{overlapRate}</span>
                    </p>
                    <p className="font13 paddingB5 srchSummary__stats">
                        <span className="text-bold">Talk Speed:&nbsp;</span>
                        <span>{Math.floor(talkSpeed * 60)} words per min</span>
                    </p>
                </div>
            </div>
        </Spinner>
    );
}
SearchCallSummary.defaultProps = {
    callId: 0,
};
