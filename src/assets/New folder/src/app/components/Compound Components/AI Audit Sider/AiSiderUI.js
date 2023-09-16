import Dot from "@presentational/reusables/Dot";
import {
    capitalizeFirstLetter,
    checkArray,
    formatFloat,
    getDateTime,
    secondsToTime,
    uid,
} from "@tools/helpers";
import { Checkbox, Collapse, Tag, Tooltip } from "antd";
import React, { useContext, useEffect, useState } from "react";

import CloseSvg from "app/static/svg/CloseSvg";
import NoDataSvg from "app/static/svg/NoDataSvg";

import AiSiderContext from "./AiSiderContext";
import "./aiSider.scss";
import TimeStamp from "@presentational/reusables/TimeStamp";
import ChevronUpSvg from "app/static/svg/ChevronUpSvg";
import ChevronDownSvg from "app/static/svg/ChevronDownSvg";
import HelpSvg from "app/static/svg/sidebar/HelpSvg";
import { useSelector } from "react-redux";
import { CallContext } from "../../IndividualCall/IndividualCall";
import Icon from "@presentational/reusables/Icon";

const { Panel } = Collapse;

function AiSiderUI(props) {
    const [groupedAiData, setGroupedAiData] = useState({});
    const [showGrouped, setShowGrouped] = useState(false);
    const getOnlyScoredQuestions = (data) =>
        data?.filter((item) => item.score_given !== null);
    const [activeKeys, setActiveKeys] = useState([]);

    const {
        aiData,
        closeDrawer,
        label,
        ai_score = 0,
        loading,
        filterCallsOnViewOfAi,
        seekToPoint,
    } = useContext(AiSiderContext);

    useEffect(() => {
        setActiveKeys(aiData.map(({ category }) => category));
    }, [aiData]);

    const {
        common: {
            versionData: { stats_threshold },
        },
    } = useSelector((state) => state);

    const color =
        ai_score < stats_threshold.bad
            ? "bitter_sweet_cl"
            : ai_score < stats_threshold.good
            ? "average_orng_cl"
            : "lima_cl";

    useEffect(() => {
        const data = {};
        checkArray(aiData).forEach(({ category, questions }) => {
            const filteredQuestions = getOnlyScoredQuestions(questions || []);
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

    return (
        <div className="ai_audit_container height100p flex column">
            <div className="individual_drawer_header">
                <div className="flex alignCenter justifySpaceBetween">
                    <div className="flex alignCenter">
                        <span className="font18 bold700">{label} &nbsp;</span>
                        <Dot
                            height="6px"
                            width="6px"
                            className="dusty_gray_bg"
                        />
                        <span className={`${color} font20 bold700`}>
                            &nbsp;{formatFloat(ai_score)}%
                        </span>
                    </div>
                    <div className="flex alignCenter">
                        <span className="curPoint " onClick={closeDrawer}>
                            <CloseSvg />
                        </span>
                    </div>
                </div>
                <div className="flex  alignCenter posRel">
                    <div>
                        <span className="marginR10 font12 dove_gray_cl">
                            Group by
                        </span>
                        <Checkbox
                            onChange={(e) => setShowGrouped(e.target.checked)}
                        />
                        <span className="marginL10 font14 bold600">
                            RESPONSE TYPE
                        </span>
                    </div>
                </div>
            </div>
            <div
                className="overflowYscroll flex1 "
                style={{
                    overflowX: "hidden",
                }}
            >
                {!!!aiData?.length && !loading ? (
                    <div className="flex column alignCenter justifyCenter height100p">
                        <NoDataSvg />
                        <div className="bolder">No data to show !</div>
                    </div>
                ) : showGrouped ? (
                    <div className="border_bottom paddingT24">
                        {Object.keys(groupedAiData).map((key) => {
                            if (groupedAiData[key]?.length) {
                                const keyCheck = key.toLocaleLowerCase();
                                return (
                                    <div className="paddingB24" key={key}>
                                        <div
                                            className={`header_type marginLR24 ${
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
                                            <span className="response_type">
                                                Response Type |{" "}
                                            </span>
                                            <span className="bold600 font14">
                                                {" "}
                                                {key.toUpperCase()}
                                            </span>
                                        </div>
                                        {groupedAiData[key].map(
                                            ({ category, questions }, idx) => {
                                                return (
                                                    <div
                                                        key={idx}
                                                        className="marginB10"
                                                    >
                                                        <div className="category_tag marginLR24">
                                                            {category}
                                                        </div>

                                                        {questions?.map(
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
                                                                    seekToPoint={
                                                                        seekToPoint
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                );
                            } else {
                                return <></>;
                            }
                        })}
                    </div>
                ) : (
                    !!activeKeys?.length && (
                        <>
                            {aiData?.map(
                                ({
                                    category,
                                    calculated_score,
                                    max_score,
                                    questions,
                                }) => {
                                    const filteredQuestions =
                                        getOnlyScoredQuestions(questions);
                                    return filteredQuestions?.map(
                                        (question, index) => (
                                            <QuestionBlock
                                                key={question.id}
                                                {...question}
                                                sl_no={
                                                    index < 9
                                                        ? `0${index + 1}`
                                                        : index + 1
                                                }
                                                onClick={filterCallsOnViewOfAi}
                                                showBorder={
                                                    index !==
                                                    filteredQuestions.length - 1
                                                }
                                                seekToPoint={seekToPoint}
                                            />
                                        )
                                    );
                                }
                            )}
                        </>
                        // <Collapse
                        //     expandIconPosition="right"
                        //     bordered={false}
                        //     defaultActiveKey={activeKeys}
                        // >
                        //     {aiData?.map(
                        //         ({
                        //             category,
                        //             calculated_score,
                        //             max_score,
                        //             questions,
                        //         }) => {
                        //             const filteredQuestions =
                        //                 getOnlyScoredQuestions(questions);

                        //             return filteredQuestions?.length ? (
                        //                 <Panel
                        //                     header={
                        //                         <span className="flex1 bold600 font16">
                        //                             {category}
                        //                         </span>
                        //                     }
                        //                     key={category}
                        //                     className="ai__category__accordian  white_bg font14"
                        //                     extra={
                        //                         <div className="category__score marginR16">
                        //                             {formatFloat(
                        //                                 calculated_score,
                        //                                 2
                        //                             )}
                        //                             /{formatFloat(max_score)}
                        //                         </div>
                        //                     }
                        //                 >
                        //                     {filteredQuestions?.map(
                        //                         (question, index) => (
                        //                             <QuestionBlock
                        //                                 key={question.id}
                        //                                 {...question}
                        //                                 sl_no={
                        //                                     index < 9
                        //                                         ? `0${index + 1
                        //                                         }`
                        //                                         : index + 1
                        //                                 }
                        //                                 onClick={
                        //                                     filterCallsOnViewOfAi
                        //                                 }
                        //                                 showBorder={
                        //                                     index !==
                        //                                     filteredQuestions.length -
                        //                                     1
                        //                                 }
                        //                                 seekToPoint={
                        //                                     seekToPoint
                        //                                 }
                        //                             />
                        //                         )
                        //                     )}
                        //                 </Panel>
                        //             ) : null;
                        //         }
                        //     )}
                        // </Collapse>
                    )
                )}
            </div>
        </div>
    );
}

export const QuestionBlock = React.memo(
    ({
        id,
        question,
        percent,
        score_label,
        score_given,
        sl_no,
        sub_filters,
        onClick,
        showBorder,
        snippets,
        seekToPoint,
        ...rest
    }) => {
        const [filtersVisisble, setFiltersVisible] = useState(false);

        const { chat, handleGoToChatClick } = useContext(CallContext);

        return (
            <>
                <div
                    className={`question_container marginB8 paddingLR24 ${
                        showBorder ? "border_bottom" : ""
                    } `}
                >
                    <div
                        className={`${filtersVisisble ? "border_bottom" : ""}`}
                    >
                        <div className="flex justifySpaceBetween paddingT10 paddingB8">
                            {/* <div className="paddingR20 flex  mine_shaft_cl">
                            <span className="font16 bold600 marginR8">
                                {sl_no}.
                            </span>
                            <div
                                className="flex1 paddingL8"
                                style={{
                                    borderLeft: '1px solid #99999933',
                                }}
                            >
                                <div className=" question_text font16 bold600">
                                    {question}
                                </div>


                            </div>
                        </div> */}
                            <div className="paddingR20 mine_shaft_cl">
                                <div className="font12">
                                    <span>{`${sl_no}. `}</span>
                                    <span
                                        className="flex1 paddingL8"
                                        style={{
                                            borderLeft: "1px solid #99999933",
                                        }}
                                    >
                                        {question}
                                    </span>
                                </div>
                                {/* <div
                            className="font10 marginT12 primary_cl curPoint bold600 marginB10 paddingL12 hover--underline posRel"
                            onClick={() =>
                                onClick({
                                    question_id: id,
                                    score_given,
                                    name: question,
                                })
                            }
                        >
                            VIEW{' '}
                            <ChevronRightSvg
                                style={{
                                    transform: 'scale(0.8)',
                                }}
                            />
                        </div> */}
                                <div className="marginT10">
                                    {snippets?.map(
                                        ({ start_time, timestamp }, index) => {
                                            let doReturn = chat
                                                ? true
                                                : index === 0
                                                ? true
                                                : snippets[index].start_time -
                                                      snippets[index - 1]
                                                          .start_time >
                                                  5
                                                ? true
                                                : false;
                                            return doReturn ? (
                                                <TimeStamp
                                                    onClick={() =>
                                                        chat
                                                            ? handleGoToChatClick(
                                                                  new Date(
                                                                      timestamp
                                                                  )?.getTime() /
                                                                      1000
                                                              )
                                                            : seekToPoint(
                                                                  start_time
                                                              )
                                                    }
                                                    start_time={
                                                        chat
                                                            ? getDateTime(
                                                                  timestamp,
                                                                  "datetime"
                                                              )
                                                            : secondsToTime(
                                                                  start_time
                                                              )
                                                    }
                                                    key={start_time}
                                                />
                                            ) : null;
                                        }
                                    )}
                                </div>
                            </div>
                            <div
                                className="flex alignStart curPoint"
                                onClick={() => {
                                    sub_filters.length &&
                                        setFiltersVisible((prev) => !prev);
                                }}
                            >
                                {/* <div
                                    className={`score_label font16 marginR8 ${score_label?.toLowerCase() === 'yes'
                                        ? 'lima_cl'
                                        : score_label?.toLowerCase() === 'no'
                                            ? 'bitter_sweet_cl'
                                            : score_label?.toLowerCase() === 'na'
                                                ? 'mine_shaft'
                                                : 'primary'
                                        }`}
                                >
                                    {capitalizeFirstLetter(
                                        score_label.toLowerCase()
                                    )}
                                </div> */}
                                {!!sub_filters.length ? (
                                    filtersVisisble ? (
                                        <Icon className="fas fa-chevron-down" />
                                    ) : (
                                        // <ChevronDownSvg
                                        //     style={{
                                        //         marginTop: '8px',
                                        //         fill: '#666666',
                                        //     }}
                                        // />
                                        <Icon className="fas fa-chevron-up" />
                                        // <ChevronUpSvg
                                        //     style={{
                                        //         marginTop: '8px',
                                        //         fill: '#666666',
                                        //     }}
                                        // />
                                    )
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                    </div>
                    <div
                        className={`filters_container ${
                            filtersVisisble ? "" : "filters_hide"
                        } `}
                    >
                        {sub_filters?.map((filter, index) => (
                            <SubfilterBlock
                                key={filter.id}
                                {...filter}
                                onClick={onClick}
                                showBorder={index !== sub_filters.length - 1}
                                seekToPoint={seekToPoint}
                            />
                        ))}
                    </div>
                    {/* <div className="flex alignCenter">
                    <HelpSvg
                        style={{
                            transform: "scale(0.8)"
                        }}
                    />
                    <div className='marginL11'>Don’t agree with Convin’s recommendation, <u className='primary_cl'>Tell us Why?</u></div>
                </div> */}
                </div>
                {/* <div className="Ai_question_container">

            </div> */}
            </>
        );
    },
    () => true
);

const SubfilterBlock = ({
    id,
    name,
    score,
    onClick,
    showBorder,
    snippets,
    seekToPoint,
}) => {
    const { chat, handleGoToChatClick } = useContext(CallContext);
    return (
        <div className={`paddingTB12 ${showBorder ? "border_bottom" : ""}`}>
            <div className=" flex  justifySpaceBetween">
                <div>
                    <div className="font16 marginR5 flex alignStart">
                        <Dot
                            height="6px"
                            width="6px"
                            className="silver_bg marginLR10 marginT5"
                        />
                        <div className="flex1">
                            <div className="mine_shaft_cl font14">{name}</div>
                            <div className="marginT10">
                                {snippets?.map(
                                    ({ start_time, timestamp }, index) => {
                                        let doReturn = chat
                                            ? true
                                            : index === 0
                                            ? true
                                            : snippets[index].start_time -
                                                  snippets[index - 1]
                                                      .start_time >
                                              5
                                            ? true
                                            : false;
                                        return doReturn ? (
                                            <TimeStamp
                                                onClick={() =>
                                                    chat
                                                        ? handleGoToChatClick(
                                                              new Date(
                                                                  timestamp
                                                              )?.getTime() /
                                                                  1000
                                                          )
                                                        : seekToPoint(
                                                              start_time
                                                          )
                                                }
                                                start_time={
                                                    chat
                                                        ? getDateTime(
                                                              timestamp,
                                                              "datetime"
                                                          )
                                                        : secondsToTime(
                                                              start_time
                                                          )
                                                }
                                                key={start_time}
                                            />
                                        ) : null;
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={`score_label font14 ${
                        score ? "lima_cl" : "bitter_sweet_cl"
                    } font12`}
                >
                    {score ? "Yes" : "No"}
                </div>
            </div>
        </div>
    );
};

export default AiSiderUI;
