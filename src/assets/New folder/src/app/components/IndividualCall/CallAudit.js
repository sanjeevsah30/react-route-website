import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Collapse, Tooltip, Checkbox } from "antd";

import AuditQuestion from "./AuditQuestion";

import { useSelector } from "react-redux";

import Dot from "@presentational/reusables/Dot";

import { formatFloat, getPercentage } from "@tools/helpers";
import { Link } from "react-router-dom";
import routes from "@constants/Routes/index";
// import { SettingOutlined } from '@ant-design/icons';

import { CallContext } from "./IndividualCall";
import { HomeContext } from "@container/Home/Home";

import {
    PlusSvg,
    MinusSvg,
    CloseSvg,
    NoTemplateSvg,
    SavingSvg,
    FlagSvg,
    SettingsSvg,
} from "app/static/svg/indexSvg";
import ProgressSvg from "@presentational/reusables/ProgressSvg";
import TemplateSelector from "./TemplateSelector";
import CallAuditGrouped from "./CallAuditGrouped";
import useHandleAuditCalculation from "./Hooks/useHandleAuditCalculation";

const { Panel } = Collapse;

function CallAudit({
    closeAuditDrawer,
    callId,
    seekToPoint,
    auditor,
    showAcknowledgeBtn,
    template,
    owner,
    acknowledged,
    audit_status,
}) {
    const [aiData, setAiData] = useState([]);
    const ref = useRef(null);

    const {
        setShowDisputeModal,
        handleAcknowledge,
        acknowledging,
        activeCategories,
    } = useContext(CallContext);

    const {
        ai_score,
        manual_score,
        audit_template,
        saving_state,
        is_audit_incomplete,
    } = useSelector((state) => state.auditSlice);

    useEffect(() => {
        setAiData(ai_score?.data?.scored);
    }, [ai_score?.data]);

    useEffect(() => {
        if (is_audit_incomplete) {
            if (ref?.current) {
                ref.current.classList.add("show_audit_incomplete");
            }
        } else {
            if (ref?.current) {
                ref.current.classList.remove("show_audit_incomplete");
            }
        }
    }, [is_audit_incomplete]);

    const { auth } = useSelector((state) => state);
    const [showGrouped, setShowGrouped] = useState(false);
    const { role } = auth;

    const { is_Auditor } = useContext(HomeContext);
    useHandleAuditCalculation();
    const score =
        ((formatFloat(manual_score?.data?.scores?.template_score, 2) || 0) /
            (formatFloat(
                manual_score?.data?.scores?.template_marks_audited,
                2
            ) || 0)) *
        100;

    const aiPercentage = getPercentage(
        ai_score?.data?.scores?.template_score,
        ai_score?.data?.scores?.template_marks_audited
    );

    const manualPercentage = getPercentage(
        manual_score?.data?.scores?.template_score,
        manual_score?.data?.scores?.template_marks_audited
    );
    const {
        common: {
            versionData: { stats_threshold, logo },
        },
    } = useSelector((state) => state);

    return (
        <>
            <div className="posRel manual__audit flex column">
                <div className="manual__audit__header flexShrink">
                    <div className="flex justifySpaceBetween  width100p">
                        <div className="flex alignCenter marginB6">
                            <TemplateSelector
                                callId={callId}
                                template={template}
                                callApi={true}
                            />
                            <span>
                                <ProgressSvg
                                    percentage={75}
                                    color={"#1a62f2"}
                                    stroke={"#99999933"}
                                    circleSize={16}
                                    strokeWidth={3}
                                    fontSize={14}
                                    fontWeight={600}
                                    showPercentage={false}
                                />
                            </span>
                        </div>
                        <div className="flex alignCenter dove_gray_cl">
                            {!!manual_score?.data?.auditor &&
                                owner?.id === auth.id && (
                                    <Tooltip
                                        destroyTooltipOnHide
                                        title="Raise Dispute"
                                    >
                                        <div
                                            className="curPoint close_btn marginR20"
                                            onClick={() =>
                                                setShowDisputeModal(true)
                                            }
                                        >
                                            <FlagSvg
                                                style={{
                                                    color: "#666666",
                                                }}
                                            />
                                        </div>
                                    </Tooltip>
                                )}
                            {is_Auditor(role?.code_names) && (
                                <Link to={routes.settings.audit_manager}>
                                    <span className="marginR20">
                                        <SettingsSvg />
                                    </span>
                                </Link>
                            )}
                            <div
                                className="curPoint close_btn"
                                onClick={closeAuditDrawer}
                            >
                                <CloseSvg
                                // style={{
                                //     color: '#666666',
                                // }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="dove_gray_cl flex alignCenter justifySpaceBetween width100p">
                        <div className="flex alignCenter min_width_0_flex_child">
                            <span className="font14 elipse_text">
                                Total Points Earned
                            </span>{" "}
                            <Dot
                                height="6px"
                                width="6px"
                                className="dusty_gray_bg marginLR8"
                            />
                            <span className="font16 bold600 primary_cl">
                                {formatFloat(
                                    manual_score?.data?.scores?.template_score,
                                    2
                                ) > 1
                                    ? formatFloat(
                                          manual_score?.data?.scores
                                              ?.template_score,
                                          2
                                      ) || 0
                                    : 0}
                                /
                                {formatFloat(
                                    manual_score?.data?.scores
                                        ?.template_marks_audited,
                                    2
                                ) || 0}{" "}
                                {!manual_score?.data?.auditor
                                    ? ` (${formatFloat(
                                          ((manual_score?.data?.scores
                                              ?.template_score > -1
                                              ? manual_score?.data?.scores
                                                    ?.template_score
                                              : 0) *
                                              100) /
                                              manual_score?.data?.scores
                                                  ?.template_marks_audited,
                                          2
                                      )}%)`
                                    : ""}
                            </span>
                            {/* {(score > -1 || aiPercentage > -1) && ( */}
                            <>
                                {!manual_score?.data?.auditor ? (
                                    <>
                                        {ai_score?.data?.status ? (
                                            <>
                                                <span className="fontt14 marginL18 elipse_text">
                                                    Scored by{" "}
                                                    {logo ? "Ai" : "Convin"}
                                                </span>{" "}
                                                <Dot
                                                    height="6px"
                                                    width="6px"
                                                    className="dusty_gray_bg marginLR8"
                                                />
                                                <span
                                                    style={{
                                                        color:
                                                            aiPercentage >=
                                                            stats_threshold.good
                                                                ? "#52C41A"
                                                                : aiPercentage >=
                                                                  stats_threshold.average
                                                                ? "#ECA51D"
                                                                : "#FF6365",
                                                    }}
                                                    className={`bold600 font16`}
                                                >
                                                    {`${
                                                        aiPercentage > 1
                                                            ? aiPercentage
                                                            : 0
                                                    }%`}
                                                </span>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <span className="font14 marginL18 elipse_text">
                                            {`Scored by ${manual_score?.data?.auditor?.first_name}`}
                                        </span>{" "}
                                        <Dot
                                            height="6px"
                                            width="6px"
                                            className="dusty_gray_bg marginLR8"
                                        />
                                        <span
                                            style={{
                                                color:
                                                    score >=
                                                    stats_threshold.good
                                                        ? "#52C41A"
                                                        : score >=
                                                          stats_threshold.average
                                                        ? "#ECA51D"
                                                        : "#FF6365",
                                            }}
                                            className={`bold600 font16`}
                                        >
                                            {`${
                                                manualPercentage > 1
                                                    ? manualPercentage
                                                    : 0
                                            }%`}
                                        </span>
                                    </>
                                )}
                            </>
                        </div>
                    </div>
                    {
                        // !manual_score?.data?.auditor ?
                        <div className="flex alignCenter justifySpaceBetween width100p">
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
                            {saving_state.savingResponse && (
                                <span className="flex alignCenter marginR10">
                                    <span className="saving">
                                        <SavingSvg />
                                    </span>
                                    <span className="marginL8">
                                        Saving Data...
                                    </span>
                                </span>
                            )}
                        </div>
                        // : (
                        //     <></>
                        // )
                    }
                </div>
                {showGrouped ? (
                    <CallAuditGrouped seekToPoint={seekToPoint} />
                ) : (
                    <div
                        className="flex1"
                        style={{
                            overflowY: "scroll",
                        }}
                    >
                        {activeCategories?.length ? (
                            activeCategories.map((category) => {
                                return category?.questions?.length ? (
                                    <CategoryCard
                                        {...category}
                                        key={category.id}
                                        fetchQuestions={() => {}}
                                        handleClick={() => {}}
                                        scores={
                                            manual_score?.data?.scores || {}
                                        }
                                        callId={callId}
                                        seekToPoint={seekToPoint}
                                        aiData={aiData}
                                        activeTemplate={audit_template}
                                        auditor={auditor}
                                        ai_score={ai_score}
                                        audit_status={audit_status}
                                    />
                                ) : null;
                            })
                        ) : (
                            <div className="flex alignCenter justifyCenter column flex1 height100p">
                                <NoTemplateSvg />
                                <div className="font16 mine_shaft_cl bold700">
                                    No Categories Attached!
                                </div>
                                <div className="font14 dusty_gray_cl ">
                                    Try contacting your admin
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {showAcknowledgeBtn && (
                    <>
                        {manual_score?.data?.acknowledged ? (
                            <div className="submit_button_container ">
                                <Button
                                    className="submit_button capitalize"
                                    type="primary"
                                    disabled={true}
                                >
                                    Acknowledged
                                </Button>
                            </div>
                        ) : (
                            <div className="submit_button_container ">
                                <Button
                                    onClick={() => {
                                        handleAcknowledge(
                                            {
                                                status: "acknowledge",
                                                template_id: audit_template?.id,
                                            },
                                            "Thank you for Acknowledging"
                                        );
                                    }}
                                    className="submit_button capitalize"
                                    type="primary"
                                    loading={acknowledging}
                                >
                                    I Acknowledge
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

const CategoryCard = ({
    name,
    id,
    fetchQuestions,
    handleClick,
    scores,
    questions,
    callId,
    questions_count,
    seekToPoint,
    aiData,
    activeTemplate,
    auditor,
    ai_score,
    audit_status,
}) => {
    const {
        auth,
        auditSlice: { score_objects },
    } = useSelector((state) => state);

    const [collActive, setCollActive] = useState(false);
    const enabledQuestions = questions.filter(
        ({ is_disabled }) => !is_disabled
    );

    const { is_Auditor } = useContext(HomeContext);
    const { role } = auth;

    let aiQuestions =
        aiData?.find(({ category_id, questions }) => {
            return category_id === id;
        })?.questions || [];
    const { violations } = useSelector((state) => state.auditSlice);
    const isAnyQuestionMarked = score_objects?.data?.filter(
        (item) => item.score_given !== null
    );
    return (
        <Collapse
            expandIconPosition="right"
            bordered={false}
            defaultActiveKey={id}
            className="marginTB16 marginLR16"
            expandIcon={({ isActive }) => {
                // setCollActive(!!isActive);
                return isActive ? (
                    <MinusSvg
                        style={{
                            color: "#999999",
                        }}
                    />
                ) : (
                    <PlusSvg
                        style={{
                            color: "#999999",
                        }}
                    />
                );
            }}
        >
            <Panel
                key={id}
                header={
                    <>
                        <div className="flex alignCenter paddingR10 justifySpaceBetween">
                            <span className="paddingR12 flex flex1 font16 bold600">
                                {name}
                            </span>
                            {!isAnyQuestionMarked.length ? (
                                <div className="bold600 flex font12 alignCenter justifyCenter  categoryScore">
                                    <span className=" primary ">
                                        {`${
                                            formatFloat(
                                                (ai_score?.data?.scores?.[id]
                                                    ?.category_score /
                                                    ai_score?.data?.scores?.[id]
                                                        ?.category_max_marks) *
                                                    100,
                                                2
                                            ) > -1
                                                ? formatFloat(
                                                      (ai_score?.data?.scores?.[
                                                          id
                                                      ]?.category_score /
                                                          ai_score?.data
                                                              ?.scores?.[id]
                                                              ?.category_max_marks) *
                                                          100,
                                                      2
                                                  ) || 0
                                                : 0
                                        }%`}
                                    </span>
                                    <span className="marginLR5 dusty_gray_cl">
                                        {" - "}
                                    </span>
                                    <span className="dusty_gray_cl bold400">
                                        {`${
                                            formatFloat(
                                                ai_score?.data?.scores?.[id]
                                                    ?.category_score,
                                                2
                                            ) > -1
                                                ? formatFloat(
                                                      ai_score?.data?.scores?.[
                                                          id
                                                      ]?.category_score,
                                                      2
                                                  ) || 0
                                                : 0
                                        }/${
                                            formatFloat(
                                                ai_score?.data?.scores?.[id]
                                                    ?.category_max_marks,
                                                2
                                            ) || 0
                                        } pts`}
                                    </span>
                                </div>
                            ) : (
                                <div className="bold600 flex font12 alignCenter justifyCenter  categoryScore">
                                    <span className=" primary ">
                                        {`${
                                            formatFloat(
                                                (scores?.[id]?.category_score /
                                                    scores?.[id]
                                                        ?.category_max_marks) *
                                                    100,
                                                2
                                            ) > -1
                                                ? formatFloat(
                                                      (scores?.[id]
                                                          ?.category_score /
                                                          scores?.[id]
                                                              ?.category_max_marks) *
                                                          100,
                                                      2
                                                  )
                                                : 0
                                        }%`}
                                    </span>
                                    <span className="marginLR5 dusty_gray_cl">
                                        {" - "}
                                    </span>
                                    <span className="dusty_gray_cl bold400">
                                        {`${
                                            formatFloat(
                                                scores?.[id]?.category_score,
                                                2
                                            ) > -1
                                                ? formatFloat(
                                                      scores?.[id]
                                                          ?.category_score,
                                                      2
                                                  )
                                                : 0
                                        }/${formatFloat(
                                            scores?.[id]?.category_max_marks,
                                            2
                                        )} pts`}
                                    </span>
                                </div>
                            )}
                        </div>
                    </>
                }
                className={`${
                    collActive
                        ? "ai__category__accordian_open"
                        : "ai__category__accordian"
                } manual__audit__accordian`}
                extra={
                    is_Auditor(role?.code_names) ? (
                        <div className="category__score marginR16">
                            {scores?.[id]
                                ? scores[id].category_ques_audited
                                : 0}
                            /{enabledQuestions?.length}
                        </div>
                    ) : (
                        <></>
                    )
                }
            >
                {enabledQuestions.map((question, index) => {
                    const ai_question = ai_score?.data?.scored
                        ?.find((e) => e.category_id === id)
                        ?.questions?.find((e) => e.question_id === question.id);
                    return (
                        <AuditQuestion
                            qKey={question.id}
                            key={question.id}
                            question={{
                                ...question,
                                sub_filters: ai_question?.sub_filters || [],
                                ai_recommendation:
                                    ai_question?.ai_recommendation ||
                                    "No ai Recommendation",
                            }}
                            question_no={
                                index < 9 ? "0" + (index + 1) : index + 1
                            }
                            callId={callId}
                            seekToPoint={seekToPoint}
                            aiQuestions={aiQuestions}
                            activeTemplate={activeTemplate}
                            auditor={auditor}
                            showIsDependent={
                                Boolean(
                                    violations.template_question_with_violation
                                        .length &&
                                        !!!violations.template_question_with_violation.find(
                                            (e) => e.id === question.id
                                        )
                                ) ||
                                Boolean(
                                    violations.category_question_with_violation
                                        .length &&
                                        !!!violations.category_question_with_violation.find(
                                            (e) => e.id === question.id
                                        ) &&
                                        !!violations.category_question_with_violation.find(
                                            (e) => e.category === id
                                        )
                                )
                            }
                            showZeroScore={
                                Boolean(
                                    violations.template_question_with_violation
                                        .length &&
                                        !!!violations.template_question_with_violation.find(
                                            (e) => e.id === question.id
                                        )
                                ) ||
                                Boolean(
                                    violations.category_question_with_violation
                                        .length &&
                                        !!violations.category_question_with_violation.find(
                                            (e) => e.category === id
                                        )
                                )
                            }
                            audit_status={audit_status}
                        />
                    );
                })}
                {/* <Spinner loading={showLoader}>
                        <QuestionsList
                            id={id}
                            handleClick={handleClick}
                            loading={showLoader}
                        />
                    </Spinner> */}
            </Panel>
        </Collapse>
    );
};

export default CallAudit;
