import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getScoreData,
    get_violation_from_repr,
} from "../../../../store/auditSlice/calculateScore.helper";
import {
    setActiveViolationState,
    setDedctionScoreObject,
    setMeetingManualScore,
} from "../../../../store/auditSlice/auditSlice";

export default function useHandleAuditCalculation() {
    const dispatch = useDispatch();

    const { manual_score, score_objects, violations } = useSelector(
        (state) => state.auditSlice
    );

    useEffect(() => {
        if (score_objects.data.length) {
            let deductionList = [];
            let violations_state = { ...violations };
            for (let score_obj of score_objects.data) {
                if (score_obj?.question_data?.settings?.is_deduction) {
                    deductionList.push(score_obj);
                }
                const violation_ids = get_violation_from_repr({
                    score_obj,
                });
                const list_of_applicable_violation = violations?.data?.filter(
                    ({ id }) => violation_ids?.includes(id)
                );
                const is_template_violation =
                    list_of_applicable_violation?.filter(
                        ({ applicability }) => applicability === "template"
                    ).length;
                const is_category_violation =
                    list_of_applicable_violation?.filter(
                        ({ applicability }) => applicability === "category"
                    ).length;
                if (is_template_violation) {
                    violations_state = {
                        ...violations_state,
                        template_question_with_violation: [
                            ...violations_state.template_question_with_violation.filter(
                                (e) => e.id !== score_obj?.question_data?.id
                            ),
                            score_obj?.question_data,
                        ],
                        category_question_with_violation: [
                            ...violations_state.category_question_with_violation.filter(
                                (e) => e.id !== score_obj?.question_data?.id
                            ),
                        ],
                    };
                } else if (is_category_violation) {
                    violations_state = {
                        ...violations_state,
                        category_question_with_violation: [
                            ...violations_state.category_question_with_violation.filter(
                                (e) => e.id !== score_obj?.question_data?.id
                            ),
                            score_obj?.question_data,
                        ],
                    };
                } else {
                    violations_state = {
                        ...violations_state,
                        category_question_with_violation: [
                            ...violations_state.category_question_with_violation.filter(
                                (e) => e.id !== score_obj?.question_data?.id
                            ),
                        ],
                        template_question_with_violation: [
                            ...violations_state.template_question_with_violation.filter(
                                (e) => e.id !== score_obj?.question_data?.id
                            ),
                        ],
                    };
                }
            }

            dispatch(setActiveViolationState(violations_state));
            dispatch(setDedctionScoreObject(deductionList));
            dispatch(
                setMeetingManualScore({
                    ...manual_score?.data,
                    scores: getScoreData({
                        scoreQs: score_objects?.data?.filter(
                            (e) => !e?.is_ai_rated
                        ),
                        ...violations_state,
                    }),
                })
            );
        }
    }, [score_objects.data, violations.data]);

    return [];
}
