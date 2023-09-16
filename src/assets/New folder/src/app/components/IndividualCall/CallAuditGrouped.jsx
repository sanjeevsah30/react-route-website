import { checkArray, uid } from "@tools/helpers";
import React, { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { Tooltip, Tag } from "antd";
import AiSiderContext from "../Compound Components/AI Audit Sider/AiSiderContext";
import { QuestionBlock } from "../Compound Components/AI Audit Sider/AiSiderUI";

function CallAuditGrouped({ seekToPoint }) {
    const [groupedData, setGroupedData] = useState([]);

    const getOnlyScoredQuestions = (data) =>
        data?.filter((item) => item.score_given !== null);

    const {
        filterCallsOnViewOfAi,
        // seekToPoint,
    } = useContext(AiSiderContext);

    const { ai_score, manual_score } = useSelector((state) => state.auditSlice);

    const aiData = ai_score?.data?.scored;
    const manualAudit = manual_score?.data?.scored;

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
        setGroupedData(data);

        // activeCategories?.map((category) => {
        //     category?.map(({questions}) => {
        //         questions?.find()
        //     })
        // })
    }, [aiData, manualAudit]);

    return (
        <div
            className="padding12  border_bottom"
            // className="flex1"
            style={{
                overflowY: "scroll",
            }}
        >
            {Object.keys(groupedData).map((key) => {
                if (groupedData[key]?.length) {
                    const keyCheck = key.toLocaleLowerCase();
                    return (
                        <div key={key}>
                            <div
                                className={`header_type ${
                                    keyCheck.toLocaleLowerCase() !== "yes" &&
                                    keyCheck.toLocaleLowerCase() !== "no" &&
                                    keyCheck.toLocaleLowerCase() !== "na"
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
                            {groupedData[key].map(
                                ({ category, questions }, id) => {
                                    return (
                                        <div key={id} className="marginB10">
                                            <Tooltip
                                                destroyTooltipOnHide
                                                title={category}
                                            >
                                                <Tag
                                                    style={{
                                                        color: "#1A62F2",
                                                        fontWeight: "600",
                                                        font: "12px",
                                                        maxWidth: "100%",
                                                    }}
                                                    color="#1A62F233"
                                                    className="text_ellipsis curPoint"
                                                >
                                                    {category}
                                                </Tag>
                                            </Tooltip>

                                            {questions.map(
                                                (question, index) => (
                                                    <QuestionBlock
                                                        key={question.id}
                                                        {...question}
                                                        sl_no={
                                                            index < 9
                                                                ? `0${
                                                                      index + 1
                                                                  }`
                                                                : index + 1
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
                    return null;
                    // <NoDataSvg />;
                }
            })}
        </div>
    );
}

export default CallAuditGrouped;
