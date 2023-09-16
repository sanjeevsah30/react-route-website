import React, { useContext, useEffect, useState, useRef } from "react";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import { Row, Collapse, Tag, Button, Tooltip } from "antd";
import { AccountsContext } from "../../../Accounts";
import { useDispatch } from "react-redux";
import Dot from "@presentational/reusables/Dot";

import {
    createAccountComments,
    fetchAccountComments,
    updateAccountComments,
    setAccountCommentToReply,
    fetchAccountCommentReply,
    deleteAccountComment,
    setAccountSearchFilter,
    fetchAccountAudit,
    fetchAccountLeadScore,
    createMediaAccountComments,
} from "@store/accounts/actions";

import { getAllUsers } from "@store/common/actions";

import CommentsTab from "app/components/Compound Components/Comments/CommentsTab";
import {
    capitalizeFirstLetter,
    checkArray,
    formatFloat,
    isElementInViewport,
    uid,
} from "@tools/helpers";

import { AI_ACCOUNTS_SCORE } from "@constants/Account/index";
import Spinner from "@presentational/reusables/Spinner";
import NoDataSvg from "app/static/svg/NoDataSvg";
import ChevronRightSvg from "app/static/svg/ChevronRightSvg";
import { Checkbox } from "antd";

import ResetSvg from "app/static/svg/ResetSvg";

const { Panel } = Collapse;

function DetailsPageBody(props) {
    const {
        state: {
            aiScoreCollpase,
            commentsCollapse,
            currentAccountId,
            leadScoreCollpase,
        },
        setState,
        accountDetails: { ai_score },
        comments: { count: commentsCount, results, next },
        users,
        activeComment /* activeComment indicates you are viewing a particular comment thread and its replies*/,
        aiData,
        loaders,
        leadScoreData,
    } = useContext(AccountsContext);

    const [showResetForCalls, setShowResetForCalls] = useState(false);
    const [showResetForAudit, setShowResetForAudit] = useState(false);
    const [showResetForLeadScore, setShowResetForLeadScore] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!users?.length) {
            dispatch(getAllUsers());
        }
    }, []);

    useEffect(() => {
        if (!commentsCollapse && currentAccountId) {
            dispatch(fetchAccountComments(currentAccountId));
        }
    }, [commentsCollapse]);

    useEffect(() => {
        if (!aiScoreCollpase && currentAccountId && !aiData.length) {
            dispatch(fetchAccountAudit(currentAccountId));
        }
    }, [aiScoreCollpase]);

    useEffect(() => {
        if (!leadScoreCollpase && currentAccountId && !leadScoreData.length) {
            dispatch(fetchAccountLeadScore(currentAccountId));
        }
    }, [leadScoreCollpase]);

    const saveComment = ({ id, payload }) => {
        if (activeComment?.comment?.id) {
            payload.parent = activeComment.comment.id;
        }
        if (currentAccountId && !id) {
            dispatch(
                createAccountComments(currentAccountId, {
                    ...payload,
                    mentioned_users: payload.mentioned_users?.map(
                        ({ id }) => +id
                    ),
                })
            );
        }
        if (id) {
            dispatch(updateAccountComments(id, payload));
        }
    };

    const addMediaComment = (payload) => {
        if (activeComment?.comment?.id) {
            payload.append("parent", activeComment.comment.id);
        }
        if (currentAccountId) {
            dispatch(createMediaAccountComments(currentAccountId, payload));
        }
    };

    const deleteComment = ({ id, payload }) => {
        dispatch(deleteAccountComment(id, payload));
    };

    const loadMoreComments = () => {
        dispatch(fetchAccountComments(currentAccountId, next));
    };

    const loadMoreReplies = () => {
        const {
            comment: { id: acitveCommentId },
            replies: { next: nextReplies },
        } = activeComment;
        dispatch(fetchAccountCommentReply(acitveCommentId, nextReplies));
    };

    const setCommentToReply = (comment) => {
        dispatch(
            setAccountCommentToReply({
                comment,
            })
        );
        dispatch(fetchAccountCommentReply(comment.id));
    };

    const removeReplyBlock = () => {
        dispatch(fetchAccountComments(currentAccountId));
        dispatch(setAccountCommentToReply({ comment: null, replies: null }));
    };

    const [activeKeys, setActiveKeys] = useState([]);

    useEffect(() => {
        setActiveKeys(aiData.map(({ category }) => category));
    }, [aiData]);

    const filterCallsOnViewOfAi = (aiDataFilter) => {
        aiDataFilter.type = "Account Scoring";
        dispatch(
            setAccountSearchFilter({
                aiDataFilter,
            })
        );

        setShowResetForAudit(true);
        showResetForCalls || setShowResetForCalls((prev) => !prev);
    };

    const filterCallsOnLeadScore = (leadScoreFilter) => {
        leadScoreFilter.type = "Lead Score";
        dispatch(
            setAccountSearchFilter({
                leadScoreFilter,
            })
        );
        setShowResetForLeadScore(true);
        showResetForCalls || setShowResetForCalls((prev) => !prev);
    };

    const getOnlyScoredQuestions = (data) =>
        data.filter((item) => item.score_given !== null);

    const [groupedAiData, setGroupedAiData] = useState({});
    const [showGrouped, setShowGrouped] = useState(false);

    useEffect(() => {
        const data = {};
        checkArray(aiData).forEach(({ category, questions }) => {
            const filteredQuestions = getOnlyScoredQuestions(questions);
            const tempKeys = {};
            filteredQuestions.forEach((question) => {
                const { score_label } = question;
                const label = score_label?.toLowerCase();
                if (tempKeys[label]) tempKeys[label].push(question);
                else tempKeys[label] = [question];
            });

            const keys = Object.keys(tempKeys);

            keys.forEach((key) => {
                if (data[key]) {
                    data[key].push({
                        category,
                        questions: tempKeys[key],
                    });
                } else {
                    data[key] = [
                        {
                            category,
                            questions: tempKeys[key],
                        },
                    ];
                }
            });
        });

        setGroupedAiData(data);
    }, [aiData]);

    useEffect(() => {
        const handleSticky = () => {
            if (
                isElementInViewport(
                    ".graph_container",
                    ".right__section__container"
                )
            ) {
                callsContainerRef.current &&
                    callsContainerRef.current.classList.remove("fullheight");
            } else {
                callsContainerRef.current &&
                    callsContainerRef.current.classList.add("fullheight");
            }
        };
        rightSectionRef.current &&
            rightSectionRef.current.addEventListener("scroll", handleSticky);

        return () => {
            rightSectionRef.current &&
                rightSectionRef.current.removeEventListener(
                    "scroll",
                    handleSticky
                );
        };
    }, []);

    const rightSectionRef = useRef();
    const callsContainerRef = useRef();

    return (
        <div className="accounts__detailspage__body ">
            <div
                style={{
                    height: "100%",
                    width: "280px",
                }}
                className={"marginR10"}
            >
                <LeftSection />
            </div>
            <Row
                className="right__section__container flex1 overflowXHidden marginR10"
                ref={rightSectionRef}
            >
                <RightSection callsContainerRef={callsContainerRef} />
            </Row>
            <div
                style={{
                    height: "100%",
                    overflow: "scroll",
                }}
                className={`${
                    commentsCollapse ? "collapse" : "collapse active"
                } `}
            >
                <Spinner loading={loaders.commentsLoader}>
                    {/*Compound component should be used for comments*/}
                    <CommentsTab
                        closeDrawer={() =>
                            setState({
                                type: "SET_COMMENTS_SIDER_COLLAPSE",
                            })
                        }
                        containerStyle={{
                            height: "100%",
                        }}
                        comments={results}
                        totalComments={commentsCount}
                        createComment={saveComment}
                        loadMoreComments={loadMoreComments}
                        editComment={saveComment}
                        setCommentToReply={setCommentToReply}
                        activeComment={activeComment}
                        removeReplyBlock={removeReplyBlock}
                        saveReply={saveComment}
                        loadMoreReplies={loadMoreReplies}
                        deleteComment={deleteComment}
                        defaultComment={""}
                        addMediaComment={addMediaComment}
                    />
                </Spinner>
            </div>
            <div
                style={{
                    height: "100%",
                    overflow: "scroll",
                }}
                className={`${
                    leadScoreCollpase ? "collapse" : "collapse active"
                } `}
            >
                <Spinner loading={loaders.leadScoreLoader}>
                    <div className="collapse__content">
                        <div className="flexShrink flex alignCenter justifySpaceBetween paddingLR16 border_bottom">
                            <div className="flex alignCenter">
                                <span className="font16 bold700">
                                    Lead Score Insights
                                </span>
                            </div>
                            <div className="flex alignCenter">
                                {showResetForLeadScore && (
                                    <div className="marginR10">
                                        <Button
                                            className="borderRadius5"
                                            icon={<ResetSvg />}
                                            size={22}
                                            onClick={(e) => {
                                                setShowResetForLeadScore(false);
                                                dispatch(
                                                    setAccountSearchFilter({
                                                        leadScoreFilter: {},
                                                    })
                                                );
                                                e.stopPropagation();
                                            }}
                                        />
                                    </div>
                                )}
                                <div
                                    className="curPoint font36 marginT2"
                                    onClick={() => {
                                        setState({
                                            type: "SET_LEAD_SCORE_SIDER_COLLAPSE",
                                        });
                                    }}
                                >
                                    &times;
                                </div>
                            </div>
                        </div>
                        <div className="overflowYauto flex1 ">
                            {!!!leadScoreData.length &&
                            !loaders.leadScoreLoader ? (
                                <div className="flex column alignCenter justifyCenter height100p">
                                    <NoDataSvg />
                                    <div className="bolder">
                                        No data to show !
                                    </div>
                                </div>
                            ) : (
                                leadScoreData.map((data, index) => {
                                    return (
                                        <LeadScoreQuestionBlock
                                            {...data}
                                            key={data.id}
                                            {...data}
                                            sl_no={
                                                index < 9
                                                    ? `0${index + 1}`
                                                    : index + 1
                                            }
                                            onClick={filterCallsOnLeadScore}
                                            showBorder={
                                                index !==
                                                leadScoreData.length - 1
                                            }
                                        />
                                    );
                                })
                            )}
                        </div>
                    </div>
                </Spinner>
            </div>
            <div
                style={{
                    height: "100%",
                    overflow: "scroll",
                }}
                className={`${
                    aiScoreCollpase ? "collapse" : "collapse active"
                } `}
            >
                <Spinner loading={loaders.aiDataLoader}>
                    <div className="collapse__content">
                        <div className="flexShrink border_bottom paddingT16 paddingLR16 paddingB10 bold alignCenter posRel width100p">
                            <div className="flex alignCenter justifySpaceBetween">
                                <div className="flex alignCenter">
                                    <span className="font16 bold700">
                                        {AI_ACCOUNTS_SCORE} &nbsp;
                                    </span>
                                    <Dot
                                        height="6px"
                                        width="6px"
                                        className="dusty_gray_bg"
                                    />
                                    <span className="primary_cl font20 bold700">
                                        &nbsp;{formatFloat(ai_score)}%
                                    </span>
                                </div>
                                <div className="flex alignCenter">
                                    {showResetForAudit && (
                                        <div className="marginR10">
                                            <Button
                                                className="borderRadius5"
                                                icon={<ResetSvg />}
                                                size={22}
                                                onClick={(e) => {
                                                    setShowResetForAudit(false);
                                                    dispatch(
                                                        setAccountSearchFilter({
                                                            aiDataFilter: {},
                                                        })
                                                    );
                                                    e.stopPropagation();
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div
                                        className="curPoint font36 marginT2"
                                        onClick={() => {
                                            setState({
                                                type: "SET_AI_SIDER_COLLAPSE",
                                            });
                                        }}
                                    >
                                        &times;
                                    </div>
                                </div>
                            </div>
                            <div className="flex  alignCenter posRel">
                                <div>
                                    <span className="marginR10 font12 dove_gray_cl">
                                        Group by
                                    </span>
                                    <Checkbox
                                        onChange={(e) =>
                                            setShowGrouped(e.target.checked)
                                        }
                                    />
                                    <span className="marginL10 font14 bold600">
                                        RESPONSE TYPE
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="overflowYauto flex1 ">
                            {!!!aiData.length && !loaders.aiDataLoader ? (
                                <div className="flex column alignCenter justifyCenter height100p">
                                    <NoDataSvg />
                                    <div className="bolder">
                                        No data to show !
                                    </div>
                                </div>
                            ) : showGrouped ? (
                                <div className="padding12  border_bottom">
                                    {Object.keys(groupedAiData).map((key) => {
                                        if (groupedAiData[key]?.length) {
                                            const keyCheck =
                                                key.toLocaleLowerCase();
                                            return (
                                                <>
                                                    <div
                                                        className={`header_type ${
                                                            keyCheck.toLocaleLowerCase() !==
                                                                "yes" &&
                                                            keyCheck.toLocaleLowerCase() !==
                                                                "no" &&
                                                            keyCheck.toLocaleLowerCase() !==
                                                                "na"
                                                                ? "rated"
                                                                : key
                                                        }_header borderRadius6 padding10 marginB16`}
                                                        key={key}
                                                    >
                                                        <span className="bold600 font12 response_type marginR5">
                                                            Response Type |{" "}
                                                        </span>
                                                        <span className="bold700 font14">
                                                            {" "}
                                                            {key.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    {groupedAiData[key].map(
                                                        ({
                                                            category,
                                                            questions,
                                                        }) => {
                                                            return (
                                                                <div
                                                                    key={uid()}
                                                                    className="marginB10"
                                                                >
                                                                    <Tooltip
                                                                        destroyTooltipOnHide
                                                                        title={
                                                                            category
                                                                        }
                                                                    >
                                                                        <Tag
                                                                            style={{
                                                                                color: "#1A62F2",
                                                                                fontWeight:
                                                                                    "600",
                                                                                font: "12px",
                                                                                maxWidth:
                                                                                    "100%",
                                                                            }}
                                                                            color="#1A62F233"
                                                                            className="text_ellipsis curPoint"
                                                                        >
                                                                            {
                                                                                category
                                                                            }
                                                                        </Tag>
                                                                    </Tooltip>

                                                                    {questions.map(
                                                                        (
                                                                            question,
                                                                            index
                                                                        ) => (
                                                                            <QuestionBlock
                                                                                key={
                                                                                    question.id
                                                                                }
                                                                                {...question}
                                                                                sl_no={
                                                                                    index <
                                                                                    9
                                                                                        ? `0${
                                                                                              index +
                                                                                              1
                                                                                          }`
                                                                                        : index +
                                                                                          1
                                                                                }
                                                                                onClick={
                                                                                    filterCallsOnViewOfAi
                                                                                }
                                                                            />
                                                                        )
                                                                    )}
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </>
                                            );
                                        } else {
                                            return <></>;
                                        }
                                    })}
                                </div>
                            ) : (
                                !!activeKeys.length && (
                                    <Collapse
                                        expandIconPosition="right"
                                        bordered={false}
                                        defaultActiveKey={activeKeys}
                                    >
                                        {aiData.map(
                                            ({
                                                category,
                                                calculated_score,
                                                max_score,
                                                questions,
                                            }) => {
                                                const filteredQuestions =
                                                    getOnlyScoredQuestions(
                                                        questions
                                                    );

                                                return filteredQuestions.length ? (
                                                    <Panel
                                                        header={
                                                            <span className="paddingR10 flex1">
                                                                {category}
                                                            </span>
                                                        }
                                                        key={category}
                                                        className="ai__category__accordian  white_bg font14"
                                                        extra={
                                                            <div className="category__score primary_cl borderRadius5 paddingTB6 paddingLR3 font12">
                                                                {formatFloat(
                                                                    calculated_score,
                                                                    2
                                                                )}
                                                                /
                                                                {formatFloat(
                                                                    max_score,
                                                                    2
                                                                )}
                                                            </div>
                                                        }
                                                    >
                                                        {filteredQuestions.map(
                                                            (
                                                                question,
                                                                index
                                                            ) => (
                                                                <QuestionBlock
                                                                    key={
                                                                        question.id
                                                                    }
                                                                    {...question}
                                                                    sl_no={
                                                                        index <
                                                                        9
                                                                            ? `0${
                                                                                  index +
                                                                                  1
                                                                              }`
                                                                            : index +
                                                                              1
                                                                    }
                                                                    onClick={
                                                                        filterCallsOnViewOfAi
                                                                    }
                                                                    showBorder={
                                                                        index !==
                                                                        filteredQuestions.length -
                                                                            1
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </Panel>
                                                ) : null;
                                            }
                                        )}
                                    </Collapse>
                                )
                            )}
                        </div>
                    </div>
                </Spinner>
            </div>
        </div>
    );
}

const LeadScoreQuestionBlock = ({
    id,
    question,
    result,
    type_id,
    weight,
    onClick,
    showBorder,
    sl_no,
}) => (
    <div className={`question_container paddingLR16 `}>
        <div className="border_bottom">
            <div className="flex justifySpaceBetween paddingT18 paddingB17">
                <div className="paddingR20 flex">
                    <span className="font14 bold marginR8">{sl_no}.</span>
                    <div className="flex1">
                        <div
                            className="paddingL8 font12 bold600"
                            style={{
                                borderLeft: "1px solid #99999933",
                                lineHeight: "14px",
                            }}
                        >
                            {question}
                        </div>
                        {result && (
                            <div
                                className="font10 marginT12 primary_cl curPoint bold600 marginB10 paddingL12 hover--underline posRel"
                                onClick={() =>
                                    onClick({
                                        type_id,
                                        result,
                                        name: question,
                                        id,
                                    })
                                }
                            >
                                VIEW{" "}
                                <ChevronRightSvg
                                    style={{
                                        transform: "scale(0.8)",
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div
                    className={`bold600 font12  capitalize ${
                        result === null
                            ? "mine_shaft_cl"
                            : result
                            ? "lima_cl"
                            : "bitter_sweet_cl"
                    }`}
                >
                    {result === null ? "Na" : result ? "Yes" : "No"}
                </div>
            </div>
        </div>
    </div>
);

const QuestionBlock = ({
    id,
    question,
    percent,
    score_label,
    score_given,
    sl_no,
    sub_filters,
    onClick,
    showBorder,
}) => (
    <div className={`question_container ${showBorder ? "border_bottom" : ""} `}>
        <div className="border_bottom">
            <div className="flex justifySpaceBetween paddingT18 paddingB17">
                <div className="paddingR20 flex">
                    <span className="font14 bold marginR8">{sl_no}.</span>
                    <div className="flex1">
                        <div
                            className="paddingL8 font12 bold600"
                            style={{
                                borderLeft: "1px solid #99999933",
                                lineHeight: "14px",
                            }}
                        >
                            {question}
                        </div>
                        <div
                            className="font10 marginT12 primary_cl curPoint bold600 marginB10 paddingL12 hover--underline posRel"
                            onClick={() =>
                                onClick({
                                    question_id: id,
                                    score_given,
                                    name: question,
                                })
                            }
                        >
                            VIEW{" "}
                            <ChevronRightSvg
                                style={{
                                    transform: "scale(0.8)",
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div
                    className={`bold600 font12  capitalize ${
                        score_label?.toLowerCase() === "yes"
                            ? "lima_cl"
                            : score_label?.toLowerCase() === "no"
                            ? "bitter_sweet_cl"
                            : "primary"
                    }`}
                >
                    {capitalizeFirstLetter(score_label.toLowerCase())}
                </div>
            </div>
        </div>

        {sub_filters.map((filter, index) => (
            <SubfilterBlock
                key={filter.id}
                {...filter}
                onClick={onClick}
                showBorder={index !== sub_filters.length - 1}
            />
        ))}
    </div>
);

const SubfilterBlock = ({ id, name, score, onClick, showBorder }) => (
    <div
        className={`paddingTB12 ${showBorder ? "border_bottom" : ""} marginL25`}
    >
        <div className=" flex  justifySpaceBetween">
            <div>
                <div className="bold600 font12 marginR5 flex alignStart">
                    <Dot
                        height="6px"
                        width="6px"
                        className="silver_bg marginLR10 marginT5"
                    />
                    <span className="flex1">{name}</span>
                </div>
                <div
                    className="font10 marginT8 primary_cl curPoint bold600 marginB10 paddingL12 hover--underline posRel marginL16"
                    onClick={() =>
                        onClick({
                            sub_filter_id: id,
                            score,
                            name,
                        })
                    }
                >
                    VIEW{" "}
                    <ChevronRightSvg
                        style={{
                            transform: "scale(0.8)",
                        }}
                    />
                </div>
            </div>

            <div
                className={`bold ${
                    score ? "lima_cl" : "bitter_sweet_cl"
                } font12`}
            >
                {score ? "Yes" : "No"}
            </div>
        </div>
    </div>
);

export default DetailsPageBody;
