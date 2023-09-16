import auditConfig from "@constants/Audit/index";
import routes from "@constants/Routes/index";
import Dot from "@presentational/reusables/Dot";
import ProgressSvg from "@presentational/reusables/ProgressSvg";
import { formatFloat, getPercentage } from "@tools/helpers";
import {
    Button,
    Checkbox,
    Collapse,
    Input,
    message,
    Modal,
    Popover,
    Select,
    Tooltip,
} from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FlagSvg from "app/static/svg/FlagSvg";
import MinusSvg from "app/static/svg/MinusSvg";
import PlusSvg from "app/static/svg/PlusSvg";
import SettingsSvg from "app/static/svg/SettingsSvg";
import Icon from "@presentational/reusables/Icon";

import AuditNoteInput from "../IndividualCall/AuditNoteInput";
import { ErrorSnackBar } from "@store/common/actions";
import {
    createScoreObject,
    setMeetingAuditTemplate,
    updateScoreObject,
} from "@store/auditSlice/auditSlice";
import Spinner from "@presentational/reusables/Spinner";
import {
    deleteMeetingScoreNotesMedia,
    setDedctionScoreObject,
    updateMeetingScoreNotesMedia,
} from "../../../store/auditSlice/auditSlice";
import { QMSActiveCallContext } from "../IndividualCall/Qms/QmsView";
import { QmsCallAuditContext } from "../IndividualCall/Qms/QmsAuditSection";
import useDebounce from "hooks/useDebounce";
import CloseSvg from "app/static/svg/CloseSvg";
import ChevronDownSvg from "app/static/svg/ChevronDownSvg";

const { Option } = Select;
const { Panel } = Collapse;

function ManualCallAudit() {
    return (
        <>
            <AuditHeader />

            <div className="manual_audit_section paddingLR28 paddingTB20 flex1 flex column overflowYscroll">
                <AuditBody />
            </div>
        </>
    );
}

const AuditBody = () => {
    const { activeCategories } = useContext(QmsCallAuditContext);
    return (
        <div className="audit_body overflowYscroll flex1">
            {activeCategories
                ?.filter?.(
                    ({ questions }) =>
                        !!questions.filter(({ is_disabled }) => !is_disabled)
                            .length
                )
                .map((category, key) => (
                    <CategoryCard {...category} key={category.id} />
                ))}
        </div>
    );
};

const CategoryCard = ({
    name,
    id,
    fetchQuestions,
    handleClick,
    scores,
    questions,
    callId,
    saving,
    questions_count,
    seekToPoint,
    activeTemplate,
    auditor,
}) => {
    const [collActive, setCollActive] = useState(false);
    const enabledQuestions = questions.filter(
        ({ is_disabled }) => !is_disabled
    );

    const { violations } = useSelector((state) => state.auditSlice);

    return (
        <Collapse
            onChange={() => {}}
            expandIconPosition="right"
            bordered={false}
            defaultActiveKey={id}
            className="marginTB16 marginLR16"
            expandIcon={({ isActive }) => {
                setCollActive(!!isActive);
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
                    <span className="paddingR10 flex1 font16 bold600">
                        {name}
                    </span>
                }
                extra={
                    <></>
                    // is_Auditor(role?.code_names) ? (
                    //     <div className="category__score marginR16">
                    //         {scores?.[id]
                    //             ? scores[id].category_ques_audited
                    //             : 0}
                    //         /{enabledQuestions?.length}
                    //     </div>
                    // ) : (
                    //     <></>
                    // )
                }
            >
                {enabledQuestions.map((question, index) => (
                    <AuditQuestion1
                        qKey={question.id}
                        question={question}
                        question_no={index < 9 ? "0" + (index + 1) : index + 1}
                        activeTemplate={9}
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
                    />
                ))}
            </Panel>
        </Collapse>
    );
};

const AuditQuestion1 = ({
    question,
    question_no,
    saving,
    seekToPoint,
    // aiQuestions,
    qKey,
    activeTemplate,
    auditor,
    showIsDependent,
    showZeroScore,
}) => {
    const {
        id,
        question_text,
        question_type,
        settings,
        applicable_violation,
        reasons,
        question_desc,
        settings: { is_deduction },
        is_mandatory,
    } = question;

    const dispatch = useDispatch();
    const { trackAuditedTime } = useContext(QmsCallAuditContext);
    const { activeCall } = useContext(QMSActiveCallContext);
    const [scoreObj, setScoreObj] = useState(null);
    const [showMore, setShowMore] = useState(false);
    const {
        manual_score,
        audit_template,
        score_objects,
        saving_state,
        deduction_score_objects,
    } = useSelector((state) => state.auditSlice);

    // score related states
    const [score_given, setScore_given] = useState(null);
    const [is_in_draft, setIs_in_draft] = useState(true);
    const [applied_tags, setApplied_Tags] = useState([]);
    const [dependency_score, setDependency_score] = useState(null);
    const [calculated_score, setCalculated_score] = useState(0);
    const [notes, setNotes] = useState("");
    const [holdReasonsId, setHoldReasonsId] = useState([]);

    //Reasons related states
    const [response, setResponse] = useState();
    const [responseOptions, setResponseOptions] = useState([]);
    const [clicked, setClicked] = useState(false);

    const [saveNotes, setSaveNotes] = useState("");
    const debouncedNote = useDebounce(saveNotes, 500);
    const [feedbackModel, setFeedbackModal] = useState(false);

    const allowSave = useRef(null);

    const yesNoOptions = [
        {
            label: "Yes",
            value: 1,
        },
        {
            label: "No",
            value: 0,
        },
        {
            label: "NA",
            value: -1,
        },
    ];

    const ratingOptions = new Array(11)
        .fill(0)
        .map((_, idx) => ({ label: idx, value: idx }));

    const { BOOLEAN_TYPE, RATING_TYPE, NONE, CUSTOM_TYPE } = auditConfig;

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
            notes || setNotes(scoreObj.notes);
            setIs_in_draft(scoreObj.is_in_draft);
            setDependency_score(scoreObj.dependency_score);
            setCalculated_score(scoreObj.calculated_score);
            setHoldReasonsId(scoreObj.reasons);
        }

        // if (scoreObj?.notes?.length) {
        //     setShowNote(true);
        // }
    }, [scoreObj]);

    useEffect(() => {
        if (question_type === RATING_TYPE) {
            setResponseOptions(ratingOptions);
            return;
        }

        if (question_type === BOOLEAN_TYPE) {
            setResponseOptions(yesNoOptions);
        }
    }, []);

    useEffect(() => {
        let payload = {};
        if (allowSave.current)
            if (scoreObj) {
                payload = {
                    ...scoreObj,
                    notes: saveNotes,
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
                    meeting: activeCall.callId,
                    applied_tags,
                    notes: saveNotes,
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
    }, [debouncedNote]);

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

    const updateScore = ({
        score_given = null,
        applied_tags = [],
        is_in_draft = true,
        reasons = [],
    }) => {
        let payload = {};
        trackAuditedTime();
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
                !scoreObj.notes.length &&
                scoreObj.media_type === null &&
                scoreObj.media === null
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
                meeting: activeCall.callId,
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

    const [showNote, setShowNote] = useState(true);

    const toggleNote = () => setShowNote((prev) => !prev);

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
                    ).then((res) => {
                        message.success({
                            content: "Details have been saved successfully",
                            className: "toast-dark",
                        });
                    });
                } else {
                    payload = {
                        ...scoreObj,
                        notes: saveNotes,
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
                        meeting: activeCall.callId,
                        applied_tags,
                        notes: saveNotes,
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

    return (
        <Spinner
            loading={
                saving_state.savingMedia && saving_state.question_id === id
                    ? true
                    : false
            }
        >
            <div className="borderBottomBold paddingL24 paddingTB12">
                {!!applicable_violation.length && (
                    <div className="paddingB5">
                        {applicable_violation.map((violation) => (
                            <span
                                key={violation.id}
                                className="critical__tag font12 marginR5"
                            >
                                {violation.name}
                            </span>
                        ))}
                    </div>
                )}
                <div className="flex alignCenter">
                    <div className="flex1">
                        <div className="flex alignCenter justifySpaceBetween">
                            <div className="bold600 font14 marginR5">{`${question_no}. |`}</div>
                            <div className="question_text flex1 bold600 font16">
                                {question_text}
                                <span className="primary_cl">
                                    {is_deduction
                                        ? `(${
                                              formatFloat(
                                                  manual_score?.data?.scores
                                                      ?.template_score
                                              )
                                                  ? formatFloat(
                                                        manual_score?.data
                                                            ?.scores
                                                            ?.template_score
                                                    ) || 0
                                                  : 0
                                          } pts)`
                                        : `${
                                              question_type !== NONE && 1 !== -1
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
                                {score_given === null && is_mandatory ? (
                                    <span
                                        style={{
                                            color: "#FF6365",
                                            fontSize: "12px",
                                        }}
                                    >
                                        *Mandatory
                                    </span>
                                ) : null}
                            </div>
                        </div>
                        <>
                            {" "}
                            <div className="marginB4 dusty_gray_cl paddingL30">
                                {showIsDependent ? (
                                    <i>
                                        (This is a dependent question hence the
                                        score given to this question will not be
                                        included in the final score)
                                    </i>
                                ) : (
                                    <></>
                                )}
                            </div>
                            {question_desc && (
                                <div
                                    className="flex marginB4 dove_gray_cl paddingL33 font12"
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
                                                  question_desc?.split("\n")[0]
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
                        </>
                    </div>
                    <div className="left_audit_controls">
                        <div
                            className="controls_container flex"
                            style={{ gap: "10px" }}
                        >
                            <div className="outer_liner paddingLR16 marginTB12">
                                {question_type === CUSTOM_TYPE ? (
                                    <Select
                                        value={score_given}
                                        placeholder={"Response"}
                                        placement={"bottomRight"}
                                        suffixIcon={
                                            <Icon className="fas fa-chevron-down dove_gray_cl" />
                                        }
                                        onChange={(value) => {
                                            if (scoreObj) {
                                                updateScore({
                                                    ...scoreObj,
                                                    score_given: value,
                                                    reasons: [],
                                                });
                                            } else
                                                updateScore({
                                                    score_given: value,
                                                    reasons: [],
                                                });
                                        }}
                                        required={is_mandatory}
                                        optionFilterProp="children"
                                        showSearch
                                        dropdownClassName="custom_selector"
                                    >
                                        {settings.custom.map((item) => (
                                            <Option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                ) : (
                                    <Select
                                        value={score_given}
                                        placeholder={"Response"}
                                        placement={"bottomRight"}
                                        suffixIcon={
                                            <Icon className="fas fa-chevron-down dove_gray_cl" />
                                        }
                                        options={responseOptions}
                                        onChange={(value) => {
                                            if (scoreObj) {
                                                updateScore({
                                                    ...scoreObj,
                                                    score_given: value,
                                                    reasons: [],
                                                });
                                            } else
                                                updateScore({
                                                    score_given: value,
                                                    reasons: [],
                                                });
                                            setResponse(value);
                                        }}
                                        disabled={question_type === NONE}
                                        className={
                                            score_given === 1
                                                ? "positive"
                                                : score_given === 0
                                                ? "negative"
                                                : ""
                                        }
                                    />
                                )}
                            </div>
                            <div className="outer_liner reason_selector paddingLR16 marginTB12">
                                <Popover
                                    placement="bottomRight"
                                    overlayClassName="date_selector_popover team_selector_popover reasons_popover"
                                    visible={clicked}
                                    onVisibleChange={(visible) => {
                                        if (
                                            reasons?.filter(({ option_id }) => {
                                                return (
                                                    option_id === score_given
                                                );
                                            })?.length
                                        )
                                            setClicked(visible);
                                    }}
                                    trigger="click"
                                    content={() => {
                                        return (
                                            <>
                                                {!!reasons.length ? (
                                                    <Checkbox.Group
                                                        onChange={(values) => {
                                                            setHoldReasonsId([
                                                                ...values,
                                                            ]);
                                                            score_given !==
                                                                null &&
                                                                updateScore({
                                                                    ...scoreObj,
                                                                    reasons: [
                                                                        ...values,
                                                                    ],
                                                                });
                                                        }}
                                                        value={holdReasonsId}
                                                        className="flex column marginL8"
                                                    >
                                                        {reasons
                                                            ?.filter(
                                                                ({
                                                                    option_id,
                                                                }) => {
                                                                    return (
                                                                        option_id ===
                                                                        score_given
                                                                    );
                                                                }
                                                            )
                                                            ?.map((item) => (
                                                                <Checkbox
                                                                    value={
                                                                        item.id
                                                                    }
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    className="dusty_gray_cl font14 paddingTB10 curPoint"
                                                                >
                                                                    {
                                                                        item.reason_text
                                                                    }
                                                                </Checkbox>
                                                            ))}
                                                    </Checkbox.Group>
                                                ) : (
                                                    <div className="flex alignCenter dusty_gray_cl padding10">
                                                        No Reasons Avilable
                                                    </div>
                                                )}
                                            </>
                                        );
                                    }}
                                >
                                    <div className="flex column relative posRel">
                                        {reasons?.filter(({ option_id }) => {
                                            return option_id === score_given;
                                        })?.length ? (
                                            !!holdReasonsId?.length || (
                                                <span
                                                    className="bitter_sweet_cl posAbs"
                                                    style={{
                                                        top: "-25px",
                                                    }}
                                                >
                                                    * Required
                                                </span>
                                            )
                                        ) : (
                                            <></>
                                        )}

                                        <Select
                                            value={
                                                !!holdReasonsId?.length &&
                                                holdReasonsId?.length > 1
                                                    ? `+${holdReasonsId?.length} Reasons Selected`
                                                    : reasons.find(
                                                          (item) =>
                                                              item.id ===
                                                              holdReasonsId[0]
                                                      )?.reason_text
                                            }
                                            placeholder={"Reasons"}
                                            dropdownClassName={"hide_dropdown"}
                                            suffixIcon={
                                                <Icon className="fas fa-chevron-down dove_gray_cl" />
                                            }
                                            disabled={
                                                question_type === NONE ||
                                                !!!reasons?.filter(
                                                    ({ option_id }) => {
                                                        return (
                                                            option_id ===
                                                            score_given
                                                        );
                                                    }
                                                )?.length
                                            }
                                        />
                                    </div>
                                </Popover>
                            </div>
                            {notes || scoreObj?.media ? (
                                <div
                                    className="outer_liner paddingLR16 marginTB12"
                                    style={{ width: "261px" }}
                                >
                                    <div
                                        className="padding12"
                                        style={{
                                            border: "1px solid rgba(153, 153, 153, 0.2)",
                                            borderRadius: "6px",
                                            width: "100%",
                                        }}
                                    >
                                        {/* <div
                                            className="marginB7 font12"
                                            style={{
                                                display: '-webkit-box',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: '2',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {!!notes
                                                ? notes
                                                : 'Please check the media for feedback'}
                                        </div> */}
                                        <Input
                                            value={notes}
                                            placeholder={
                                                "Please check the media for feedback"
                                            }
                                            onChange={(e) => {
                                                allowSave.current = true;
                                                setNotes(e.target.value);
                                                setSaveNotes(e.target.value);
                                            }}
                                        />
                                        <div className="flex alignCenter justifySpaceBetween font12">
                                            <span className="bold600">
                                                {scoreObj?.media
                                                    ? "+1 Media"
                                                    : ""}
                                            </span>
                                            <span
                                                className="primary curPoint"
                                                onClick={() =>
                                                    setFeedbackModal(true)
                                                }
                                            >
                                                View Note
                                            </span>
                                            {/* <EditNoteSvg
                                                className="curPoint"
                                                onClick={() =>
                                                    setFeedbackModal(true)
                                                }
                                            /> */}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="outer_liner paddingLR16 marginTB12 primary curPoint font12"
                                    onClick={() => setFeedbackModal(true)}
                                    style={{
                                        width: "261px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    Add Note
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title="Add Note"
                open={feedbackModel}
                onCancel={() => setFeedbackModal(false)}
                closeIcon={<CloseSvg />}
                footer={null}
                width="558px"
                destroyOnClose={true}
            >
                <AuditNoteInput
                    onChange={(e) => {
                        allowSave.current = true;
                        setNotes(e.target.value);
                        setSaveNotes(e.target.value);
                    }}
                    mediaData={{
                        media: scoreObj?.media || null,
                        media_type: scoreObj?.media_type,
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
                    hideClose={true}
                    isQms={true}
                    setFeedbackModal={setFeedbackModal}
                />
            </Modal>
        </Spinner>
    );
};

const AuditHeader = () => {
    const {
        common: {
            versionData: { stats_threshold },
        },
        auditSlice: { manual_score },
    } = useSelector((state) => state);
    const { auth } = useSelector((state) => state);
    const { activeCall } = useContext(QMSActiveCallContext);
    const { stats, owner } = activeCall?.callDetails || {};

    const { trackAuditedTime, setShowDisputeModal } =
        useContext(QmsCallAuditContext);

    const score =
        ((formatFloat(manual_score?.data?.scores?.template_score, 2) || 0) /
            (formatFloat(
                manual_score?.data?.scores?.template_marks_audited,
                2
            ) || 0)) *
        100;

    const manualPercentage = getPercentage(
        manual_score?.data?.scores?.template_score,
        manual_score?.data?.scores?.template_marks_audited
    );

    return (
        <div className="header_section flexShrink0 paddingLR32 paddingT20">
            <div className="flex justifySpaceBetween">
                <div className="flex alignCenter marginB6">
                    <TemplateSelector1 />
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
                    {!!manual_score?.data?.auditor && owner?.id === auth.id && (
                        <Tooltip destroyTooltipOnHide title="Raise Dispute">
                            <div
                                className="curPoint close_btn marginR20"
                                onClick={() => setShowDisputeModal(true)}
                            >
                                <FlagSvg
                                    style={{
                                        color: "#666666",
                                    }}
                                />
                            </div>
                        </Tooltip>
                    )}
                    <Link to={routes.settings.audit_manager}>
                        <span className="marginR20">
                            <SettingsSvg />
                        </span>
                    </Link>
                </div>
            </div>
            <div className="dove_gray_cl flex alignCenter justifySpaceBetween width100p">
                <div className="flex alignCenter min_width_0_flex_child marginL10">
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
                        ) > -1
                            ? formatFloat(
                                  manual_score?.data?.scores?.template_score,
                                  2
                              ) || 0
                            : 0}
                        /
                        {formatFloat(
                            manual_score?.data?.scores?.template_marks_audited,
                            2
                        ) || 0}{" "}
                        {!manual_score?.data?.auditor
                            ? ` (${
                                  formatFloat(
                                      (manual_score?.data?.scores
                                          ?.template_score *
                                          100) /
                                          manual_score?.data?.scores
                                              ?.template_marks_audited,
                                      2
                                  ) > -1
                                      ? formatFloat(
                                            (manual_score?.data?.scores
                                                ?.template_score *
                                                100) /
                                                manual_score?.data?.scores
                                                    ?.template_marks_audited,
                                            2
                                        )
                                      : 0
                              }%)`
                            : ""}
                    </span>
                    {!!manual_score?.data?.auditor && (
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
                                        score >= stats_threshold.good
                                            ? "#52C41A"
                                            : score >= stats_threshold.average
                                            ? "#ECA51D"
                                            : "#FF6365",
                                }}
                                className={`bold600 font16`}
                            >
                                {`${
                                    manualPercentage > -1 ? manualPercentage : 0
                                }%`}
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const TemplateSelector1 = () => {
    const { meeting_templates, audit_template } = useSelector(
        (state) => state.auditSlice
    );
    const dispatch = useDispatch();
    const { setActiveCategories, setAuditStartTime } =
        useContext(QmsCallAuditContext);

    const onTemplateChange = (templateId) => {
        const temp = meeting_templates?.data?.find(
            ({ template: { id } }) => templateId === id
        );

        dispatch(setMeetingAuditTemplate(temp?.template));
        setActiveCategories(temp?.categories);
        setAuditStartTime(null);
    };

    return (
        <>
            <Tooltip
                destroyTooltipOnHide
                title={audit_template?.name}
                placement="right"
            >
                <Select
                    value={audit_template?.id}
                    style={{
                        width: 200,
                        textTransform: "inherit",
                        padding: 0,
                        fontSize: "1rem",
                        fontWeight: 600,
                    }}
                    onChange={onTemplateChange}
                    bordered={false}
                    dropdownClassName="template_option"
                    suffixIcon={<ChevronDownSvg />}
                >
                    {[
                        ...meeting_templates?.data?.filter(
                            (e) => e.template.id !== audit_template.id
                        ),
                        {
                            template: audit_template,
                        },
                    ].map(({ template }) => (
                        <Option value={template?.id} key={template?.id}>
                            {template?.name}
                        </Option>
                    ))}
                </Select>
            </Tooltip>
        </>
    );
};

export default ManualCallAudit;
