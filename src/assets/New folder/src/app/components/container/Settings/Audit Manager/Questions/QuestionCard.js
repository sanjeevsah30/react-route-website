import { updateCategotyQuestionRequest } from "@store/call_audit/actions";
import { Col, Row, Button, Switch } from "antd";
import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import EditSvg from "app/static/svg/EditSvg";
import { AuditContext } from "../AuditManager";

function QuestionCard({
    item,
    question_no,
    setEditClicked,
    setVisible,
    setQuestionText,
    setQuestionDescription,
    setBoolenWeight,
    setRatingWeight,
    setApplicableTags,
    setQuestionType,
    setQuestion_id,
    getApplicableTags,
    setCustomResponce,
    index,
    set_boolean_violation,
    set_rating_violation,
    set_boolean_notes_mandate,
    set_rating_notes_mandate,
    set_default_response,
    default_response,
    setIntent,
    setReasons,
    setValType,
    setAppliedLevel,
    set_none_notes_mandate,
    setIsMandatory,
}) {
    const {
        BOOLEAN_TYPE,
        CRITICAL,
        disableLoading,
        RATING_TYPE,
        CUSTOM_TYPE,
        NONE,
    } = useContext(AuditContext);
    const dispatch = useDispatch();
    const question = item;
    const {
        question_text,
        question_type,
        applicable_violation,
        settings,
        id,
        is_disabled,
        question_desc,
        intent,
        reasons,
        is_mandatory,
    } = question;

    // const isCritical = () => {
    //     const tag = applicable_tags.find(
    //         ({ tag_name }) => tag_name === CRITICAL
    //     );

    //     if (tag) return true;

    //     return false;
    // };

    const setQuestionToEdit = () => {
        setEditClicked(true);
        setQuestionText(question_text);
        setQuestionDescription(question_desc);
        setIntent(intent);
        setReasons(reasons);
        setIsMandatory(is_mandatory);
        if (question_type === BOOLEAN_TYPE) {
            setBoolenWeight(settings);
            setQuestionType(BOOLEAN_TYPE);
            set_boolean_violation(settings.violation || {});
            set_boolean_notes_mandate({
                1: settings?.mandate_notes_on?.includes(1) || false,
                0: settings?.mandate_notes_on?.includes(0) || false,
                "-1": settings?.mandate_notes_on?.includes(-1) || false,
            });
        } else if (question_type === RATING_TYPE) {
            setQuestionType(RATING_TYPE);
            setRatingWeight(settings);
            set_rating_violation(settings.violation || {});
            set_rating_notes_mandate({
                1: settings?.mandate_notes_on?.includes(1) || false,
                0: settings?.mandate_notes_on?.includes(0) || false,
                2: settings?.mandate_notes_on?.includes(2) || false,
                3: settings?.mandate_notes_on?.includes(3) || false,
                4: settings?.mandate_notes_on?.includes(4) || false,
                5: settings?.mandate_notes_on?.includes(5) || false,
                6: settings?.mandate_notes_on?.includes(6) || false,
                7: settings?.mandate_notes_on?.includes(7) || false,
                8: settings?.mandate_notes_on?.includes(8) || false,
                9: settings?.mandate_notes_on?.includes(9) || false,
                10: settings?.mandate_notes_on?.includes(10) || false,
                "-1": settings?.mandate_notes_on?.includes(-1) || false,
            });
        } else if (question_type === CUSTOM_TYPE) {
            setQuestionType(CUSTOM_TYPE);

            setCustomResponce(
                settings.custom.map((item) => ({
                    ...item,
                    mandate_notes: settings?.mandate_notes_on?.includes(
                        item.id
                    ),
                    appliedViolations:
                        settings?.violation?.[item.name]?.map(String) || [],
                }))
            );
            setAppliedLevel(
                settings.is_template_level === undefined
                    ? null
                    : settings.is_template_level
                    ? "template"
                    : "category"
            );
            setValType(
                settings?.is_deduction === undefined
                    ? null
                    : settings?.is_deduction
                    ? "percentage"
                    : "absolute"
            );
        } else {
            setQuestionType(NONE);
            set_none_notes_mandate(is_mandatory);
        }

        setApplicableTags(applicable_violation.map(({ id }) => id));
        setQuestion_id(id);
        set_default_response(settings.default);
        setVisible(true);
    };

    const handleDisable = () => {
        dispatch(
            updateCategotyQuestionRequest(
                id,
                {
                    is_disabled: !is_disabled,
                },
                false
            )
        );
    };

    return (
        <Col span={24} className=" gutter-row template__list__card grabbable">
            <Row className="width100p" gutter={[0, 24]}>
                <Col
                    lg={10}
                    md={24}
                    sm={24}
                    xs={24}
                    className="flex alignCenter"
                >
                    <div className="bold paddingR10">{question_text}</div>
                </Col>
                <Col
                    lg={4}
                    md={24}
                    sm={24}
                    xs={24}
                    className="flex alignCenter"
                >
                    {question_type === RATING_TYPE
                        ? "Scale 1-10"
                        : question_type === BOOLEAN_TYPE
                        ? "Yes or No"
                        : question_type === NONE
                        ? "None"
                        : "Custom"}
                </Col>
                <Col
                    lg={4}
                    md={24}
                    sm={24}
                    xs={24}
                    className="flex alignCenter"
                >
                    {applicable_violation.length === 0 ? (
                        "None"
                    ) : applicable_violation.length === 1 ? (
                        applicable_violation[0].name
                    ) : (
                        <>
                            <span>{applicable_violation[0].name}</span>
                            <span className="primary">
                                ,+{applicable_violation.length - 1} more
                            </span>
                        </>
                    )}
                </Col>
                <Col lg={2} md={2} sm={24} xs={24} className="flex alignCenter">
                    <Button
                        type="primary"
                        onClick={setQuestionToEdit}
                        icon={<EditSvg />}
                    />
                </Col>
                <Col
                    lg={2}
                    md={24}
                    sm={24}
                    xs={24}
                    className="flex alignCenter"
                >
                    <Switch
                        loading={disableLoading}
                        checked={!is_disabled}
                        onChange={handleDisable}
                    />
                </Col>
            </Row>
        </Col>
    );
}

export default QuestionCard;
