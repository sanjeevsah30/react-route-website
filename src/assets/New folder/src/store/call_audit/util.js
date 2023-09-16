import auditConfig from "@constants/Audit";
const { CRITICAL, RED_ALERT, ZERO_TOLERANCE, FATAL } = auditConfig;

export const constructTags = (tagsState) => {
    const tags = [
        {
            tag_name: CRITICAL,
            tag_type: "scoring tag",
            rules: ["score_p_no_c_no"],
        },
        {
            tag_name: FATAL,
            tag_type: "scoring tag",
            rules: ["score_p_no_c_no"],
        },
    ];

    if (tagsState.red_alert) {
        tags.push({
            tag_name: RED_ALERT,
            tag_type: "alerts tag",
            rules: ["alert_manager_eod"],
        });
    }
    if (tagsState.zero_tolerance) {
        tags.push({
            tag_name: ZERO_TOLERANCE,
            tag_type: "alerts tag",
            rules: ["alert_manager_immediate"],
        });
    }

    return tags;
};
