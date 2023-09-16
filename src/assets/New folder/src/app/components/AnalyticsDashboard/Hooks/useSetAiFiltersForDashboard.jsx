import auditConfig from "@constants/Audit/index";
import { HomeContext } from "@container/Home/Home";
import {
    setActiveAccountAuditTemplate,
    setActiveAccountTags,
    setActiveAuditType,
    setActiveFilterQuestions,
    setActiveStage,
} from "@store/accounts/actions";
import { setActiveTemplateForFilters } from "@store/common/actions";
import { setActiveSearchView, setSearchFilters } from "@store/search/actions";
import { uid } from "@tools/helpers";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useSetAiFiltersForDashboard() {
    const dispatch = useDispatch();

    const [goToCalls, setGoToCalls] = useState(false);
    const [goToAccounts, setGoToAccounts] = useState(false);

    const {
        dashboard: {
            templates_data: { templates, template_active },
            dashboard_filters,
        },
        search: { searchFilters, defaultSearchFilters, defaultView },
        callAudit: { isAccountLevel },
        accounts,
    } = useSelector((state) => state);

    const { handleActiveComponent } = useContext(HomeContext);

    const toAccountPage = ({ id, question_text, type, checked }) => {
        let obj = {};

        obj[id] = {
            checked,
            question: question_text,
            type,
        };

        //Account Filters 1st dispatch is to keep the sidbarfilters checked with the particular question
        // Second dispatch is to set the question for api request paylod for account list
        dispatch(setActiveFilterQuestions(obj));
        const data = [
            {
                name:
                    id > 0
                        ? question_text
                        : checked === 1
                        ? "Good"
                        : checked === 0
                        ? "Average"
                        : "Need Attention",

                type: "Account Scoring",
                id,
            },
            {
                name: dashboard_filters?.audit_filter?.audit_type,
                type: "Audit Type",
                id: uid(),
            },
        ];

        if (dashboard_filters?.stage) {
            data.push({
                id: uid(),
                type: "Status/Stage",
                name: accounts.filters.stage.find(
                    ({ id }) => dashboard_filters.stage === id
                ).stage,
            });
        }

        dispatch(setActiveAccountAuditTemplate(template_active));
        dispatch(setActiveAuditType(dashboard_filters?.audit_filter));
        dispatch(setActiveStage(dashboard_filters?.stage));

        setGoToAccounts(true);
    };

    const { BOOLEAN_TYPE } = auditConfig;

    const handleCheck = (id, ans, rest, isChecked) => {
        const find =
            searchFilters.auditQuestions.find((q) => q.id === id) || {};
        const obj = {};

        if (isChecked) {
            obj[id] = {
                checked: ans,
                ...rest,
                ...find,
            };
        } else {
            delete obj[id];
        }

        dispatch(
            setSearchFilters({
                ...defaultSearchFilters,
                activeQuestions: obj,
                template: templates.find(({ id }) => id === template_active),
                activeTemplate: template_active,
                auditQuestions: searchFilters.auditQuestions,
                processing_status: null,
                audit_filter: dashboard_filters?.audit_filter,
                stage: dashboard_filters.stage,
            })
        );
        setGoToCalls(true);
        defaultView && dispatch(setActiveSearchView(0));
    };

    const applyAiFilter = (e) => {
        if (e.id === "good") {
            !isAccountLevel
                ? handleCheck(
                      0,
                      1,
                      {
                          id: 0,
                          question_text: "AI Call Score",
                      },
                      true
                  )
                : toAccountPage({
                      id: "AI Score",

                      type: BOOLEAN_TYPE,
                      checked: 1,
                  });
        } else if (e.id === "average") {
            !isAccountLevel
                ? handleCheck(
                      0,
                      0,
                      {
                          id: 0,
                          question_text: "AI Call Score",
                      },
                      true
                  )
                : toAccountPage({
                      id: "AI Score",

                      type: BOOLEAN_TYPE,
                      checked: 0,
                  });
        } else if (e.id === "bad") {
            !isAccountLevel
                ? handleCheck(
                      0,
                      -1,
                      {
                          id: 0,
                          question_text: "AI Call Score",
                      },
                      true
                  )
                : toAccountPage({
                      id: "AI Score",

                      type: BOOLEAN_TYPE,
                      checked: -1,
                  });
        } else {
            const checked =
                e.question_type === "rating"
                    ? e.checked < 5
                        ? "5<"
                        : e.checked < 7
                        ? "7<"
                        : e.checked > 7
                        ? "7>"
                        : "-1"
                    : e.checked;
            !isAccountLevel
                ? handleCheck(
                      e.id,
                      checked || null,
                      {
                          id: e.id,
                          question_text: e.name,
                      },
                      true
                  )
                : toAccountPage({
                      id: e.id,
                      question_text: e.name,
                      checked: checked || null,
                  });
        }

        dispatch(setActiveTemplateForFilters(template_active));
    };
    useEffect(() => {
        if (
            goToCalls &&
            Object.keys(searchFilters.activeQuestions).length === 1
        ) {
            handleActiveComponent("calls");
            if (dashboard_filters?.call_tags.length)
                dispatch(
                    setSearchFilters({
                        call_tags: dashboard_filters?.call_tags,
                    })
                );
        }
    }, [searchFilters.activeQuestions, goToCalls]);

    useEffect(() => {
        if (
            goToAccounts &&
            Object.keys(accounts?.filters?.activeQuestions).length === 1
        ) {
            handleActiveComponent("accounts");
            if (dashboard_filters?.acc_tags.length)
                dispatch(setActiveAccountTags(dashboard_filters?.acc_tags));
        }
    }, [accounts.activeQuestions, goToAccounts]);

    return { applyAiFilter };
}
