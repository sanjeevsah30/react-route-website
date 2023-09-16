import React, { useContext, useEffect, useState } from "react";
import { Col, Checkbox, Tooltip, Radio, Button, Row, Select } from "antd";
import auditConfig from "@constants/Audit";
import config from "@constants/IndividualCall";
import { formatFloat } from "@tools/helpers";
import { useDispatch, useSelector } from "react-redux";
import useDebounce from "hooks/useDebounce";
import DebounceTextArea from "./DebounceTextArea";
import {
    AddNoteSvg,
    AttachSvg,
    ConvinLogoBWSvg,
} from "app/static/svg/indexSvg";

import { ErrorSnackBar } from "@store/common/actions";

import { CallContext } from "./IndividualCall";
import { HomeContext } from "@container/Home/Home";
import { QuestionBlock } from "../Compound Components/AI Audit Sider/AiSiderUI";
import Icon from "@presentational/reusables/Icon";
import AuditNoteInput from "./AuditNoteInput";
import Spinner from "@presentational/reusables/Spinner";
import {
    createScoreObject,
    deleteMeetingScoreNotesMedia,
    setDedctionScoreObject,
    updateMeetingScoreNotesMedia,
    updateScoreObject,
} from "@store/auditSlice/auditSlice";
const { Option } = Select;

function AuditQuestion({
    question,
    question_no,
    callId,
    seekToPoint,
    aiQuestions,
    qKey,
    auditor,
    showIsDependent,
    showZeroScore,
    audit_status,
}) {
    const {
        manual_score,
        audit_template,
        score_objects,
        saving_state,
        deduction_score_objects,
    } = useSelector((state) => state.auditSlice);

    const {
        id,
        question_text,
        question_type,
        has_filters,
        settings,
        ai_recommendation,
        applicable_violation,
        reasons,
        question_desc,
        settings: { is_deduction },
        is_mandatory,
    } = question;

    console.log(ai_recommendation);

    const { BOOLEAN_TYPE, SCALE_NO, RATING_TYPE, NONE, CUSTOM_TYPE } =
        auditConfig;
    const [scoreObj, setScoreObj] = useState(null);

    const [score_given, setScore_given] = useState(null);
    const [is_in_draft, setIs_in_draft] = useState(true);
    const [applied_tags, setApplied_Tags] = useState([]);
    const [dependency_score, setDependency_score] = useState(null);
    const [calculated_score, setCalculated_score] = useState(0);
    const [notes, setNotes] = useState(
        score_objects?.data?.find(
            (score) => +score.question === +id && !score.is_ai_rated
        )?.notes || ""
    );
    const [saveNotes, setSaveNotes] = useState(undefined);
    if (saveNotes?.length) {
        // console.log(saveNotes);
        // console.log(notes);
    }
    const debouncedNote = useDebounce(saveNotes, 500);
    const [showNote, setShowNote] = useState(false);
    const dispatch = useDispatch();

    const getOnlyScoredQuestions = (data) =>
        data?.filter((item) => item.score_given !== null);
    const filteredQuestions = getOnlyScoredQuestions(aiQuestions);

    const toggleNote = () => setShowNote((prev) => !prev);

    const [holdReasonsId, setHoldReasonsId] = useState([]);

    const addMedia = (type = "text", media = undefined) => {
        let payload = {};

        if (showNote) {
            if (scoreObj) {
                if (type === "audio" || type === "video") {
                    dispatch(
                        updateMeetingScoreNotesMedia({
                            id: scoreObj.id,
                            media,
                            question_id: id,
                        })
                    );
                } else {
                    payload = {
                        ...scoreObj,
                        notes: saveNotes || "",
                    };
                    dispatch(
                        updateScoreObject({
                            id: scoreObj.id,
                            payload: {
                                ...payload,
                                template_id: audit_template?.id,
                            },
                        })
                    );
                }
            } else {
                if (type === "audio") {
                } else {
                    payload = {
                        score_given,
                        is_in_draft,
                        question: id,
                        meeting: +callId,
                        applied_tags,
                        notes: saveNotes || "",
                    };

                    dispatch(
                        createScoreObject({
                            payload: {
                                ...payload,
                                template_id: audit_template?.id,
                            },
                        })
                    );
                }
            }
        }
    };

    const deleteNotesMedia = () => {
        dispatch(deleteMeetingScoreNotesMedia({ id: scoreObj.id }));
    };

    const questionWeight = () => {
        if (question_type === RATING_TYPE) {
            return settings?.weight;
        }

        if (question_type === CUSTOM_TYPE) {
            let temp = 0;
            settings?.custom?.forEach(({ weight }) => {
                if (temp < weight) temp = weight;
            });
            return temp;
        }

        if (question_type === BOOLEAN_TYPE) {
            return Math.max(settings?.yes_weight, settings?.no_weight);
        }

        if (question_type === "none") return "";
    };

    useEffect(() => {
        let payload = {};
        if (showNote) {
            if (scoreObj) {
                payload = {
                    ...scoreObj,
                    notes: saveNotes || "",
                };
                dispatch(
                    updateScoreObject({
                        id: scoreObj.id,
                        type: "note",
                        payload: {
                            ...payload,
                            template_id: audit_template?.id,
                        },
                    })
                );
            } else {
                payload = {
                    score_given,
                    is_in_draft,
                    question: id,
                    meeting: +callId,
                    applied_tags,
                    notes: saveNotes || "",
                };

                dispatch(
                    createScoreObject({
                        type: "note",
                        payload: {
                            ...payload,
                            template_id: audit_template?.id,
                        },
                    })
                );
            }
        }
    }, [debouncedNote]);

    useEffect(() => {
        const findScore = score_objects?.data?.find(
            (score) => +score.question === +id && !score.is_ai_rated
        );
        if (scoreObj && findScore) {
            return setScoreObj({
                ...findScore,
                // score_given: scoreObj.score_given,
                reasons: holdReasonsId,
            });
        }

        findScore && setScoreObj(findScore);
        !findScore && setScoreObj(null);
    }, [score_objects?.data]);

    useEffect(() => {
        if (scoreObj) {
            setScore_given(scoreObj.score_given);
            setApplied_Tags(scoreObj.applied_tags);
            if (!notes) setNotes(scoreObj.notes);
            setIs_in_draft(scoreObj.is_in_draft);
            setDependency_score(scoreObj.dependency_score);
            setCalculated_score(scoreObj.calculated_score);
            setHoldReasonsId(scoreObj.reasons);
        }

        if (scoreObj?.notes?.length) {
            setShowNote(true);
        }
    }, [scoreObj]);

    const updateScore = ({
        score_given = null,
        applied_tags = [],
        is_in_draft = true,
        reasons = [],
    }) => {
        let payload = {};

        if (scoreObj) {
            payload = {
                ...scoreObj,
                score_given,
                is_in_draft,
                applied_tags,
                reasons,
            };
            if (
                settings?.mandate_notes_on?.includes(score_given) &&
                !scoreObj.notes.length
            ) {
                ErrorSnackBar("Note is mandatory for this response", 3);
                return;
            }

            setScoreObj(payload);
            const deduction_score_list = is_deduction
                ? [
                      ...deduction_score_objects.filter(
                          (e) => e.id !== payload.id
                      ),
                      payload,
                  ]
                : deduction_score_objects;
            if (is_deduction) {
                dispatch(setDedctionScoreObject(deduction_score_list));
            }
            dispatch(
                updateScoreObject({
                    id: scoreObj.id,
                    payload: { ...payload, template_id: audit_template?.id },
                    deduction_score_list,
                })
            );
        } else {
            payload = {
                score_given,
                is_in_draft,
                question: id,
                meeting: +callId,
                applied_tags,
                reasons,
            };

            const deduction_score_list = is_deduction
                ? [...deduction_score_objects, payload]
                : deduction_score_objects;

            dispatch(
                createScoreObject({
                    payload: {
                        ...payload,
                        template_id: audit_template?.id,
                    },
                    deduction_score_list,
                })
            );
        }

        setHoldReasonsId(reasons);
    };

    const {
        setShowTagTranscripts,
        scoreToTag,
        setScoreToTag,
        original_transcripts,
        setSelectedTagTranscripts,
        trackAuditedTime,
    } = useContext(CallContext);

    const { auth } = useSelector((state) => state);
    const { role } = auth;

    const { is_Auditor, auditor_permissions } = useContext(HomeContext);
    const [hideAiRecomdation, setHideAiRecomdation] = useState(true);
    const [showMore, setShowMore] = useState(false);

    const { chat } = useContext(CallContext);
    const audit_permission = auditor_permissions(role.code_names);

    return (
        <Spinner
            loading={
                saving_state.savingMedia && saving_state.question_id === id
                    ? true
                    : false
            }
        >
            {/* <div>
                {scoreObj.id},{question.id}
            </div> */}
            <div className="borderBottomBold paddingLR24 paddingTB5">
                <div className="paddingB5 marginT12">
                    {applicable_violation.map((violation) => (
                        <span
                            key={violation.id}
                            className="critical__tag font12 marginR5"
                        >
                            {violation.name}
                        </span>
                    ))}
                </div>
                <div className="flex alignCenter justifySpaceBetween">
                    <div className="flex1">
                        <div className="flex alignCenter justifySpaceBetween">
                            <div className="bold600 font14">{`${question_no}. `}</div>
                            <div className="question_text flex1">
                                {question_text}{" "}
                                {(
                                    !!manual_score?.data?.auditor?.id
                                        ? is_Auditor(role.code_names)
                                            ? audit_permission.can_reaudit
                                                ? true
                                                : audit_permission.can_reaudit_dispute_cases
                                                ? audit_status === "dispute"
                                                : false
                                            : false
                                        : is_Auditor(role.code_names)
                                ) ? (
                                    <span className="primary_cl">
                                        {is_deduction
                                            ? `(${
                                                  formatFloat(
                                                      manual_score?.data?.scores
                                                          ?.template_score,
                                                      2
                                                  )
                                                      ? formatFloat(
                                                            manual_score?.data
                                                                ?.scores
                                                                ?.template_score,
                                                            2
                                                        ) || 0
                                                      : 0
                                              } pts)`
                                            : `${
                                                  question_type !== NONE &&
                                                  calculated_score !== -1
                                                      ? `(${
                                                            formatFloat(
                                                                showZeroScore
                                                                    ? 0
                                                                    : calculated_score,
                                                                2
                                                            ) > -1
                                                                ? formatFloat(
                                                                      showZeroScore
                                                                          ? 0
                                                                          : calculated_score,
                                                                      2
                                                                  )
                                                                : 0
                                                        }/${questionWeight()} pts)`
                                                      : ""
                                              }`}
                                    </span>
                                ) : (
                                    <></>
                                )}
                                {is_mandatory ? (
                                    question_type === "none" &&
                                    !notes.length &&
                                    !scoreObj?.media?.length ? (
                                        <span
                                            style={{
                                                color: "#FF6365",
                                                fontSize: "12px",
                                            }}
                                        >
                                            *Mandatory
                                        </span>
                                    ) : score_given === null &&
                                      question_type !== "none" ? (
                                        <span
                                            style={{
                                                color: "#FF6365",
                                                fontSize: "12px",
                                            }}
                                        >
                                            *Mandatory
                                        </span>
                                    ) : null
                                ) : null}
                            </div>
                        </div>

                        {(
                            !!manual_score?.data?.auditor?.id
                                ? is_Auditor(role.code_names)
                                    ? audit_permission.can_reaudit
                                        ? true
                                        : audit_permission.can_reaudit_dispute_cases
                                        ? audit_status === "dispute"
                                        : false
                                    : false
                                : is_Auditor(role.code_names)
                        ) ? (
                            <>
                                {" "}
                                <div className="marginB4 dusty_gray_cl paddingL16">
                                    {showIsDependent ? (
                                        <i>
                                            (This is a dependent question hence
                                            the score given to this question
                                            will not be included in the final
                                            score)
                                        </i>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                {question_desc && (
                                    <div
                                        className="flex marginB4 dove_gray_cl paddingL40 font12"
                                        style={{
                                            lineHeight: "14px",
                                        }}
                                    >
                                        <pre
                                            style={{
                                                whiteSpace: "pre-wrap",
                                                marginBottom: "2px",
                                            }}
                                        >
                                            {!showMore
                                                ? `${
                                                      question_desc?.split(
                                                          "\n"
                                                      )[0]
                                                  }... `
                                                : question_desc}
                                            <span
                                                onClick={() =>
                                                    setShowMore((prev) => !prev)
                                                }
                                                className="curPoint primary_cl marginL5"
                                            >
                                                {!showMore
                                                    ? "Show more"
                                                    : "Show Less"}
                                            </span>
                                        </pre>
                                    </div>
                                )}
                                <div className="">
                                    <div className="flex alignCenter paddingL17">
                                        {has_filters !== false ? (
                                            <div
                                                className="font14 dusty_gray_cl"
                                                style={{
                                                    display: "inline-flex",
                                                    background: "#9999991A",
                                                    color: "#1a62f2",
                                                    padding: "2px 6px",
                                                    marginBottom: "5px",
                                                    alignItems: "center",
                                                    borderRadius: "4px",
                                                    cursor: "pointer",
                                                    marginRight: "10px",
                                                    minWidth: 155,
                                                }}
                                                onClick={() => {
                                                    setHideAiRecomdation(
                                                        (prev) => !prev
                                                    );
                                                }}
                                            >
                                                <span className="paddingR8 dusty_gray_cl">
                                                    <ConvinLogoBWSvg />
                                                    <span className="marginL5">
                                                        {`Recommendation: `}
                                                    </span>
                                                    <span className="bold400 dove_gray_cl">
                                                        {`"${
                                                            ai_recommendation ===
                                                            -1
                                                                ? "Na"
                                                                : ai_recommendation
                                                        }"`}
                                                    </span>
                                                </span>

                                                {!!filteredQuestions?.filter(
                                                    ({ question_id }) =>
                                                        qKey === question_id
                                                )?.length && (
                                                    <span
                                                        className="marginL10 paddingL5 dove_gray_cl bold400"
                                                        style={{
                                                            borderLeft:
                                                                "1px solid rgba(26, 98, 242, 0.2)",
                                                        }}
                                                    >
                                                        {hideAiRecomdation ? (
                                                            <Icon className="fas fa-chevron-down" />
                                                        ) : (
                                                            <Icon className="fas fa-chevron-up" />
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <i
                                                className="font14 dusty_gray_cl"
                                                style={{
                                                    background: "#9999991A",
                                                    padding: "2px 6px",
                                                    borderRadius: "4px",
                                                    marginRight: "10px",
                                                    minWidth: 155,
                                                    textAlign: "center",
                                                }}
                                            >
                                                {`No AI Recommendation`}
                                            </i>
                                        )}
                                        {(
                                            !!manual_score?.data?.auditor?.id
                                                ? is_Auditor(role.code_names)
                                                    ? audit_permission.can_reaudit
                                                        ? true
                                                        : audit_permission.can_reaudit_dispute_cases
                                                        ? audit_status ===
                                                          "dispute"
                                                        : false
                                                    : false
                                                : is_Auditor(role.code_names)
                                        ) ? (
                                            <span className="flex alignCenter">
                                                <Tooltip
                                                    destroyTooltipOnHide
                                                    title={`Add Note`}
                                                >
                                                    <span
                                                        onClick={toggleNote}
                                                        style={{
                                                            cursor: "pointer",
                                                            fontSize: "0px",
                                                        }}
                                                    >
                                                        <AttachSvg />
                                                    </span>
                                                </Tooltip>
                                                {chat || (
                                                    <span className="marginL8">
                                                        {!!original_transcripts?.length && (
                                                            <Tooltip
                                                                destroyTooltipOnHide
                                                                title={`Now improve the “Convin” recommendation by adding relatable snippets to questions.`}
                                                                placement="right"
                                                            >
                                                                <button
                                                                    className={`borderRadius6 tag_snippets_btn ${
                                                                        scoreToTag ===
                                                                        scoreObj?.id
                                                                            ? "active"
                                                                            : ""
                                                                    }`}
                                                                    onClick={() => {
                                                                        setShowTagTranscripts(
                                                                            true
                                                                        );
                                                                        setScoreToTag(
                                                                            scoreObj?.id
                                                                        );
                                                                        setSelectedTagTranscripts(
                                                                            []
                                                                        );
                                                                    }}
                                                                >
                                                                    <AddNoteSvg />
                                                                </button>
                                                            </Tooltip>
                                                        )}
                                                    </span>
                                                )}
                                            </span>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div
                                    className="marginB5 dove_gray_cl paddingL24 font12"
                                    style={{
                                        lineHeight: "14px",
                                    }}
                                >
                                    <pre>{question_desc}</pre>
                                </div>
                                <div className="paddingL40 marginT10">
                                    <div>
                                        <span className="dove_gray_cl">
                                            Response :{" "}
                                        </span>
                                        {!auditor?.id ? (
                                            <span
                                                style={{
                                                    color:
                                                        ai_recommendation ===
                                                        -1 ? (
                                                            "#1a62f2"
                                                        ) : question_type ===
                                                          BOOLEAN_TYPE ? (
                                                            ai_recommendation?.toLowerCase() ===
                                                            "yes" ? (
                                                                "#52c41a"
                                                            ) : (
                                                                "#ff4d4f"
                                                            )
                                                        ) : question_type ===
                                                          RATING_TYPE ? (
                                                            "#1a62f2"
                                                        ) : question_type ===
                                                          CUSTOM_TYPE ? (
                                                            ai_recommendation?.toLowerCase() ===
                                                            "yes" ? (
                                                                "#52c41a"
                                                            ) : ai_recommendation?.toLowerCase() ===
                                                              "no" ? (
                                                                "#ff4d4f"
                                                            ) : ai_recommendation?.toLowerCase() ===
                                                              "na" ? (
                                                                "#1a62f2"
                                                            ) : (
                                                                "#eca51d"
                                                            )
                                                        ) : (
                                                            <></>
                                                        ),
                                                }}
                                                className="bold400 dove_gray_cl"
                                            >
                                                {has_filters !== false
                                                    ? `${
                                                          ai_recommendation ===
                                                          -1
                                                              ? "Na"
                                                              : ai_recommendation
                                                      }`
                                                    : "No AI Recommendation"}
                                            </span>
                                        ) : (
                                            <span
                                                style={{
                                                    color:
                                                        score_given === -1 ? (
                                                            "#1a62f2"
                                                        ) : question_type ===
                                                          BOOLEAN_TYPE ? (
                                                            score_given ===
                                                            1 ? (
                                                                "#52c41a"
                                                            ) : (
                                                                "#ff4d4f"
                                                            )
                                                        ) : question_type ===
                                                          RATING_TYPE ? (
                                                            "#1a62f2"
                                                        ) : question_type ===
                                                          CUSTOM_TYPE ? (
                                                            "#eca51d"
                                                        ) : (
                                                            <></>
                                                        ),
                                                }}
                                            >
                                                {question_type ===
                                                BOOLEAN_TYPE ? (
                                                    score_given === 1 ? (
                                                        <>Yes</>
                                                    ) : score_given === 0 ? (
                                                        <>No</>
                                                    ) : (
                                                        <>NA</>
                                                    )
                                                ) : question_type ===
                                                  RATING_TYPE ? (
                                                    score_given !== -1 ? (
                                                        <>{score_given}</>
                                                    ) : (
                                                        <>NA</>
                                                    )
                                                ) : question_type ===
                                                  CUSTOM_TYPE ? (
                                                    <>
                                                        {
                                                            settings?.custom?.find(
                                                                ({ id }) =>
                                                                    id ===
                                                                    score_given
                                                            )?.name
                                                        }
                                                    </>
                                                ) : (
                                                    <></>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    {!!notes.length && (
                                        <div className="flex alignCenter">
                                            <div className="font12 dove_gray_cl marginR5">
                                                Notes :{" "}
                                            </div>
                                            <span className="dove_gray_cl font12">
                                                {notes}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    {(
                        !!manual_score?.data?.auditor?.id
                            ? is_Auditor(role.code_names)
                                ? audit_permission.can_reaudit
                                    ? true
                                    : audit_permission.can_reaudit_dispute_cases
                                    ? audit_status === "dispute"
                                    : false
                                : false
                            : is_Auditor(role.code_names)
                    ) ? (
                        <div
                            className="paddingL17"
                            style={{
                                borderLeft:
                                    "1px solid rgba(153, 153, 153, 0.2)",
                                width: 116,
                            }}
                            onClick={() => trackAuditedTime()}
                        >
                            {question_type === BOOLEAN_TYPE ? (
                                <div className="boolean_btn_container">
                                    <button
                                        className={
                                            score_given === 1
                                                ? "active_yes  button"
                                                : "button"
                                        }
                                        onClick={() => {
                                            if (scoreObj) {
                                                updateScore({
                                                    ...scoreObj,
                                                    score_given: 1,
                                                    reasons: [],
                                                });
                                            } else
                                                updateScore({
                                                    score_given: 1,
                                                    reasons: [],
                                                });
                                        }}
                                    >
                                        {config.FEEDBACK.scaleTrue}
                                    </button>
                                    <button
                                        className={
                                            score_given === 0
                                                ? "active_no  button"
                                                : "button"
                                        }
                                        onClick={() => {
                                            if (scoreObj) {
                                                updateScore({
                                                    ...scoreObj,
                                                    score_given: 0,
                                                    reasons: [],
                                                });
                                            } else
                                                updateScore({
                                                    score_given: 0,
                                                    reasons: [],
                                                });
                                        }}
                                    >
                                        {config.FEEDBACK.scaleFalse}
                                    </button>
                                    <button
                                        className={
                                            score_given === -1
                                                ? "active_na  button"
                                                : "button"
                                        }
                                        onClick={() => {
                                            if (scoreObj) {
                                                updateScore({
                                                    ...scoreObj,
                                                    score_given: -1,
                                                    reasons: [],
                                                });
                                            } else
                                                updateScore({
                                                    score_given: -1,
                                                    reasons: [],
                                                });
                                        }}
                                    >
                                        {config.FEEDBACK.scaleNA}
                                    </button>
                                </div>
                            ) : question_type === RATING_TYPE ? (
                                <div className="boolean_btn_container rating_btn_container ">
                                    {new Array(SCALE_NO)
                                        .fill(0)
                                        .map((_, rating) => {
                                            return (
                                                <button
                                                    key={rating}
                                                    className={
                                                        rating === score_given
                                                            ? "active_rating button"
                                                            : "button"
                                                    }
                                                    onClick={() => {
                                                        if (scoreObj) {
                                                            updateScore({
                                                                ...scoreObj,
                                                                score_given:
                                                                    rating,
                                                                reasons: [],
                                                            });
                                                        } else
                                                            updateScore({
                                                                score_given:
                                                                    rating,
                                                                reasons: [],
                                                            });
                                                    }}
                                                >
                                                    {rating}
                                                </button>
                                            );
                                        })}
                                    <button
                                        className={
                                            score_given === -1
                                                ? "active_rating button"
                                                : "button"
                                        }
                                        onClick={() => {
                                            if (scoreObj) {
                                                updateScore({
                                                    ...scoreObj,
                                                    score_given: -1,
                                                    reasons: [],
                                                });
                                            } else
                                                updateScore({
                                                    score_given: -1,
                                                    reasons: [],
                                                });
                                        }}
                                    >
                                        {config.FEEDBACK.scaleNA}
                                    </button>
                                </div>
                            ) : question_type === CUSTOM_TYPE ? (
                                <div className="boolean_btn_container custom_btn_container">
                                    <Select
                                        suffixIcon={
                                            <Icon
                                                className="fas fa-chevron-down dove_gray_cl paddingL5"
                                                style={{
                                                    borderLeft:
                                                        "1px solid rgba(153, 153, 153, 0.2)",
                                                }}
                                            />
                                        }
                                        // className="custom_select dove_gray_cl"
                                        dropdownClassName="Select_dropdown_lable"
                                        onChange={(id) => {
                                            if (scoreObj) {
                                                updateScore({
                                                    ...scoreObj,
                                                    score_given: id,
                                                    reasons: [],
                                                });
                                            } else
                                                updateScore({
                                                    score_given: id,
                                                    reasons: [],
                                                });
                                        }}
                                        value={score_given}
                                        placeholder="Select"
                                        placement="bottomRight"
                                        showSearch
                                        optionFilterProp="children"
                                        style={{
                                            maxWidth: "100px",
                                        }}
                                    >
                                        {settings?.custom?.map(
                                            ({ name, id }) => (
                                                <Option
                                                    key={id}
                                                    // className={
                                                    //     score_given === id
                                                    //         ? 'active_custom button'
                                                    //         : 'button'
                                                    // }
                                                    value={id}
                                                >
                                                    {name}
                                                </Option>
                                            )
                                        )}
                                    </Select>
                                    {/* <Select
                                    className="custom__select active_hover active_focus br4"
                                    suffixIcon={
                                        <Icon className="fas fa-chevron-down dove_gray_cl" />
                                    }
                                    onChange={(id) => {
                                        if (scoreObj) {
                                            updateScore({
                                                ...scoreObj,
                                                score_given: id,
                                                reasons: [],
                                            });
                                        } else
                                            updateScore({
                                                score_given: id,
                                                reasons: [],
                                            });
                                    }}
                                    value={score_given}
                                    showSearch
                                    optionFilterProp="children"
                                    dropdownClassName="Select_dropdown_lable"
                                    dropdownAlign={{ offset: [-200, 4] }}
                                >
                                    {settings?.custom?.map(({ name, id }) => (
                                        <Option
                                            key={id}
                                            // className={
                                            //     score_given === id
                                            //         ? 'active_custom button'
                                            //         : 'button'
                                            // }
                                            value={id}
                                        >
                                            {name}
                                        </Option>
                                    ))}
                                </Select> */}
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
                {(
                    !!manual_score?.data?.auditor?.id
                        ? is_Auditor(role.code_names)
                            ? audit_permission.can_reaudit
                                ? true
                                : audit_permission.can_reaudit_dispute_cases
                                ? audit_status === "dispute"
                                : false
                            : false
                        : is_Auditor(role.code_names)
                ) ? (
                    <div className="flex1">
                        <div className="paddingL17 marginT5">
                            <div className="">
                                {hideAiRecomdation ||
                                    filteredQuestions?.map(
                                        (question, index) => {
                                            if (qKey === question.question_id)
                                                return (
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
                                                        // onClick={
                                                        //     filterCallsOnViewOfAi
                                                        // }
                                                        showBorder={
                                                            index !==
                                                            filteredQuestions.length -
                                                                1
                                                        }
                                                        seekToPoint={
                                                            seekToPoint
                                                        }
                                                    />
                                                );
                                        }
                                    )}
                            </div>
                            {reasons?.filter(({ option_id }) => {
                                return option_id === score_given;
                            })?.length ? (
                                <div
                                    className="width100p marginT10 padding16"
                                    style={{
                                        background: "rgba(153, 153, 153, 0.05)",
                                        borderRadius: "2px",
                                        lineHeight: "normal",
                                    }}
                                >
                                    <div className="flex alignCenter justifySpaceBetween">
                                        <div className="flex alignCenter marginR10 marginB4">
                                            <span className="font16 bold600">
                                                Reasons &nbsp;
                                            </span>
                                            {!!holdReasonsId.length || (
                                                <span className="bitter_sweet_cl">
                                                    (* Required )
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <Checkbox.Group
                                            onChange={(values) => {
                                                setHoldReasonsId([...values]);
                                                score_given !== null &&
                                                    updateScore({
                                                        ...scoreObj,
                                                        reasons: [...values],
                                                    });
                                            }}
                                            value={holdReasonsId}
                                        >
                                            {reasons
                                                ?.filter(({ option_id }) => {
                                                    return (
                                                        option_id ===
                                                        score_given
                                                    );
                                                })
                                                ?.map((item) => (
                                                    <Row key={item.id}>
                                                        <Col span={24}>
                                                            <Checkbox
                                                                value={item.id}
                                                                className="dusty_gray_cl font14"
                                                            >
                                                                {
                                                                    item.reason_text
                                                                }
                                                            </Checkbox>
                                                        </Col>
                                                    </Row>
                                                ))}
                                        </Checkbox.Group>
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}

                            {/* <div
                                    className={` ${
                                        snippets?.length ? 'paddingB8' : ''
                                    } `}
                                >
                                    {snippets?.map(({ start_time }, index) => {
                                        let doReturn =
                                            index === 0
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
                                                    seekToPoint(start_time)
                                                }
                                                start_time={start_time}
                                                key={start_time}
                                            />
                                        ) : null;
                                    })}
                                </div> */}
                            <>
                                {/* <div
                                        className="add_note marginR10"
                                        onClick={toggleNote}
                                    >
                                        {showNote
                                            ? ''
                                            : notes?.trim()?.length
                                                ? 'SHOW NOTE'
                                                : 'ADD NOTE'}
                                    </div> */}
                                {/* {!!original_transcripts?.length && (
                                        <Tooltip
                                            destroyTooltipOnHide
                                            title={`Now improve the “AI” recommendation by adding relatable snippets to questions.`}
                                        >
                                            <button
                                                className={`borderRadius6 tag_snippets_btn ${scoreToTag === scoreObj?.id
                                                    ? 'active'
                                                    : ''
                                                    }`}
                                                onClick={() => {
                                                    setShowTagTranscripts(true);
                                                    setScoreToTag(scoreObj?.id);
                                                    setSelectedTagTranscripts(
                                                        []
                                                    );
                                                }}
                                            >
                                                Tag Snippets
                                            </button>
                                        </Tooltip>
                                    )} */}

                                {/*-------------------------------------------- work in progress *----------------------------------------------------*/}
                                <>
                                    {/* {
                                            !showNote ? (
                                                <CornerFoldedCard
                                                    title='Seems like you disagree with us. Tell us why?'
                                                    defaultValue="Category1"
                                                    options={
                                                        [
                                                            {
                                                                label: 'Category1',
                                                                value: 'Category1',
                                                            },
                                                            {
                                                                label: 'Category2',
                                                                value: 'Category2',
                                                            },
                                                            {
                                                                label: 'Category3',
                                                                value: 'Category3',
                                                            },
                                                        ]
                                                    }
                                                >
                                                    <div className="font12 bold600 marginB13">Chosse a Catogary</div>
                                                </CornerFoldedCard>
                                            ) : <></>
                                        }
                                        {
                                            true ? (
                                                <div
                                                    className='flex alignCenter newgreen_bg padding10 marginT8'
                                                    style={{
                                                        borderRadius : "6px",
                                                    }}
                                                >
                                                    <span>
                                                        <ThumbsUpGreenSvg />
                                                    </span>
                                                    <span className='marginL10 font14 bold600'>Thanks for the feedback!</span>
                                                </div>
                                            ) : <></>
                                        } */}
                                </>

                                {showNote ? (
                                    <>
                                        <AuditNoteInput
                                            onChange={(e) => {
                                                setNotes(e.target.value);
                                                setSaveNotes(e.target.value);
                                            }}
                                            mediaData={{
                                                media: scoreObj?.media || null,
                                                media_type:
                                                    scoreObj?.media_type,
                                            }}
                                            condition={
                                                saving_state.savingNote &&
                                                saving_state.question_id === id
                                            }
                                            value={notes}
                                            placeholder="Type or Record your Notes here"
                                            toggleClose={toggleNote}
                                            addMedia={addMedia}
                                            deleteNotesMedia={deleteNotesMedia}
                                            className={"notes_textarea flex1"}
                                            showFeedbackIcon={true}
                                            minRow={2.5}
                                            maxRow={2.5}
                                        />
                                    </>
                                ) : (
                                    <></>
                                )}
                            </>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </Spinner>
    );
}

const Arrow = ({ active, isOpen }) => (
    <span className={`arrow ${isOpen ? "up" : "down"}`}>
        <span
            style={{
                background: "#1a62f2",
            }}
        ></span>
        <span
            style={{
                background: "#1a62f2",
            }}
        ></span>
    </span>
);

const CornerFoldedCard = ({ title = "", defaultValue, options, children }) => {
    const [value, setValue] = useState((defaultValue = options[0].value));
    const [notes, setNotes] = useState("");
    const onChangeHandler = ({ target: { value } }) => {
        setValue(value);
    };
    return (
        <div className="box">
            <div className="box_card">
                <div className="font14 bold600" style={{ width: "80%" }}>
                    {title}
                </div>
            </div>
            <div className="body_container paddingLR16 paddingTB16">
                {children}
                <Radio.Group
                    options={options}
                    onChange={onChangeHandler}
                    value={value}
                />
                <DebounceTextArea
                    onChange={(e) => {
                        setNotes(e.target.value);
                    }}
                    value={notes}
                    placeholder="your feedback*"
                    condition={false}
                    className={"notes_textarea"}
                    showClose={false}
                    showFeedbackIcon={false}
                    minRow={3}
                    maxRow={3}
                />
                <div className="flex alignCenter justifyEnd marginT16">
                    <span className="marginR18">Cancel</span>
                    <Button
                        type="primary"
                        onclick={() => {}}
                        style={{ borderRadius: "4px" }}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AuditQuestion;
