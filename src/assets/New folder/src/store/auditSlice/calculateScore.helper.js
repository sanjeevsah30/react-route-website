import auditConfig from "@constants/Audit/index";
import { formatFloat } from "@tools/helpers";
const { BOOLEAN_TYPE, RATING_TYPE, CUSTOM_TYPE } = auditConfig;

export function calculated_score_from_score_given({
    score_value,
    question,
    deduction_score_objects = [],
}) {
    deduction_score_objects = deduction_score_objects
        .filter((e) => e.score_given)
        .filter(
            (question) =>
                !!question.question_data?.settings?.custom.find(
                    (e) => e.id === question.score_given
                )?.weight
        );

    let score = 0;
    if (score_value === null || score_value === -1) {
        return 0;
    }

    if (question?.question_type === BOOLEAN_TYPE) {
        score =
            score_value === 1
                ? question?.settings?.yes_weight
                : score_value === 0
                ? question?.settings?.no_weight
                : 0;
    } else if (question?.question_type === RATING_TYPE) {
        const weight = question?.settings?.weight || 0;
        score = (weight * score_value) / 10;
    }

    if (question?.question_type === CUSTOM_TYPE) {
        const weight = question?.settings?.custom
            .filter((c) => c.id === score_value)
            .map((c) => c.weight);
        score = weight[0] || 0;
    }

    const [last, ...rest] = [...deduction_score_objects]?.sort(
        (a, b) => b.idx - a.idx
    );
    if (last) {
        const { question_data, score_given } = last;
        const deduction_to_apply = question_data?.settings?.custom.find(
            (e) => e.id === score_given
        );
        if (deduction_to_apply?.weight) {
            score = formatFloat(
                score - (score * deduction_to_apply.weight) / 100,
                2
            );
        }
    }
    return score;
}

export function get_violation_from_repr({
    score_obj: { score_given, question_data: question },
}) {
    const { violation } = question?.settings || {};
    if (!violation) return [];
    if (question.question_type === BOOLEAN_TYPE) {
        if (score_given === 1) {
            return violation.yes_weight || [];
        }
        if (score_given === 0) {
            return violation.no_weight || [];
        }

        return [];
    }
    if (question.question_type === RATING_TYPE) {
        return violation?.[score_given] || [];
    }

    if (question.question_type === CUSTOM_TYPE) {
        const score_repr = get_custom_score_display({ question, score_given });
        if (score_repr) return violation?.[score_repr] || [];
    }

    return [];
}

const get_custom_score_display = ({ question, score_given, type = "name" }) => {
    /*Returns custom question type display value for 
    the current score_given*/
    if (typeof question?.settings === "object") {
        for (let response of question?.settings?.custom) {
            //score_given can be null, compare with random integer to make condition False
            if (response.id !== null) {
                if (response.id === score_given) {
                    return response[type];
                }
            }
        }
    }
};

export function getScoreData({
    scoreQs,
    template_question_with_violation,
    category_question_with_violation,
}) {
    const isDependent = (category_id) => {
        if (template_question_with_violation?.length) return true;
        if (
            category_question_with_violation.find(
                (e) => e.category === category_id
            )
        )
            return true;
        return false;
    };

    let scores = {
        template_score: 0,
        template_ques_audited: 0,
        template_max_marks: 0,
        template_marks_audited: 0,
        non_fatal_template_score: 0,
    };

    for (let i = 0; i < scoreQs.length; i++) {
        let score = scoreQs[i];
        let categoryPk = score?.question_data?.category;
        if (!scores[categoryPk]) {
            scores[categoryPk] = {
                category_score: 0,
                category_ques_audited: 0,
                category_max_marks: 0,
                category_marks_audited: 0,
                category_non_fatal_score: 0,
            };
        }
        let weight = getMaximumScore(score);
        scores.template_max_marks += weight;
        scores[categoryPk].category_max_marks +=
            score.score_given === -1 ? 0 : weight;

        if (
            score.score_given !== null ||
            score.question_data?.question_type === "none"
        ) {
            scores[categoryPk].category_ques_audited++;
        }

        if (
            score.score_given === null &&
            isDependent(score?.question_data?.category)
        ) {
            scores.template_marks_audited += weight;
        }

        if (score.score_given !== null) {
            scores.template_ques_audited++;

            if (
                score.score_given !== -1 &&
                !score?.question_data?.settings?.is_deduction
            ) {
                const dependent = isDependent(score?.question_data?.category);
                scores.template_score += dependent
                    ? 0
                    : score.calculated_score || 0;
                scores.non_fatal_template_score += score.non_fatal_score || 0;
                scores[categoryPk].category_score += dependent
                    ? 0
                    : score.calculated_score || 0;
                scores[categoryPk].category_non_fatal_score +=
                    score.non_fatal_score || 0;
                scores.template_marks_audited += weight;
                scores[categoryPk].category_marks_audited += weight;
            }
        }
    }

    return scores;
}

function getMaximumScore(instance) {
    const settings = instance?.question_data?.settings;
    if (settings?.is_deduction) {
        return 0;
    }
    if (instance?.question_data?.question_type === BOOLEAN_TYPE) {
        return Math.max(settings.yes_weight, settings.no_weight);
    } else if (instance?.question_data?.question_type === CUSTOM_TYPE) {
        const weights = settings.custom.map((c) => c.weight);
        if (weights.length) {
            return Math.max(...weights);
        } else {
            return -1;
        }
    } else if (instance?.question_data?.question_type === RATING_TYPE) {
        return settings.weight;
    } else {
        return 0;
    }
}
