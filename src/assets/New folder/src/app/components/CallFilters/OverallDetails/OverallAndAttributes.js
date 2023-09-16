import {
    getTemplatesForFilter,
    getSearchAuditTemplateRequest,
    storeSearchAuditTemplate,
} from "@store/call_audit/actions";
import { Col, Collapse, Row } from "antd";
import React, { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import AttributeCard from "./AttributeCard";

import "./overallAndAttributes.scss";
import { checkArray, formatFloat, uid } from "@tools/helpers";
import { changeActiveTeam } from "@store/common/actions";

import {
    fetchAuditTemplateQuestionsAccounts,
    getAuditTemplatesForAccounts,
    setActiveAccountAuditTemplate,
    setActiveAuditType,
    setActiveFilterQuestions,
    setActiveFilters,
    setActiveStage,
} from "@store/accounts/actions";
import { setActiveSearchView, setSearchFilters } from "@store/search/actions";
import NoDashBoardDataSvg from "app/static/svg/NoDashBoardDataSvg";
import Dot from "@presentational/reusables/Dot";
import DisplayTrend from "../../AnalyticsDashboard/Components/DisplayTrend";
import auditConfig from "@constants/Audit/index";
import {
    getAccountAuditOverallDetailsRequest,
    getCallAuditOverallDetailsRequest,
} from "../../../../store/dashboard/dashboard";

const { Panel } = Collapse;

export const CallFiltersContext = createContext();

function OverallAndAttributes({
    handleActiveTab,
    handleActiveComponent,
    onBack,
    visible,
}) {
    const dispatch = useDispatch();
    const { active: team_active } = useSelector(
        (state) => state.common.filterTeams
    );

    const { isAccountLevel, searchAuditTemplate } = useSelector(
        (state) => state.callAudit
    );

    const { searchFilters, defaultView, defaultSearchFilters } = useSelector(
        (state) => state.search
    );
    const { template, questions } = searchAuditTemplate;

    const {
        common: { filterTeams, filterReps, filterCallDuration, filterDates },
        dashboard: {
            templates_data: { template_active },
            dashboard_filters,
        },
        accounts: { filters },
    } = useSelector((state) => state);

    const {
        callAuditOverallDetails: {
            result: call_results,
            scored_meetings_count,
        },
        accountAuditOverallDetails: {
            result: account_results,

            scored_accounts_count,
        },
    } = useSelector((state) => state.dashboard);

    const getTopBarData = () => {
        let data = {
            callDuration:
                filterCallDuration.options[filterCallDuration.active].value,
            activeReps: filterReps.active,
            activeTeam: filterTeams.active,
            activeDateRange: filterDates.dates[filterDates.active].dateRange,
        };
        return {
            callType: data.callType,
            callDuration: data.callDuration,
            repId: data.activeReps,
            teamId: data.activeTeam,
            startDate: data.activeDateRange[0],
            endDate: data.activeDateRange[1],
        };
    };

    const { teams: all_teams } = useSelector((state) => state.common);

    const [categories, setCategories] = useState({});
    const [categoriesScore, setCategoriesScore] = useState({});

    useEffect(() => {
        if (all_teams?.length < 1) {
            return;
        }
        const team_id = team_active;
        dispatch(getTemplatesForFilter(team_id));
    }, [team_active]);

    useEffect(() => {
        if (call_results?.length) {
            const categories = {};
            const category_score = {};
            checkArray(call_results).forEach((question) => {
                if (question.category_name)
                    if (categories[question.category_name])
                        categories[question.category_name].push(question);
                    else categories[question.category_name] = [question];

                category_score[question.category_name] = {
                    average: question.category_average,
                    trend: question.category_trend,
                };
            });
            setCategoriesScore(category_score);
            setCategories(categories);
        }
    }, [call_results]);

    useEffect(() => {
        if (account_results?.length) {
            const categories = {};
            const category_score = {};
            checkArray(account_results).forEach((question) => {
                if (question.category_name)
                    if (categories[question.category_name])
                        categories[question.category_name].push(question);
                    else categories[question.category_name] = [question];

                category_score[question.category_name] = {
                    average: question.category_average,
                    trend: question.category_trend,
                };
            });

            setCategories(categories);
        }
    }, [account_results]);

    useEffect(() => {
        if (all_teams.length <= 1 || template_active) {
            return;
        }

        const currentTeam = all_teams.find(({ id }) => id === team_active);

        if (currentTeam?.template_exists) {
            return dispatch(changeActiveTeam([currentTeam.id]));
        }

        const team_with_template = all_teams.find(
            ({ template_exists }) => template_exists
        );
        if (team_with_template) {
            return dispatch(changeActiveTeam([team_with_template.id]));
        }

        dispatch(changeActiveTeam([]));
    }, [all_teams.length]);

    useEffect(() => {
        if (visible) {
            return;
        }
        let api1 = null;
        let api2 = null;
        if (template_active !== undefined) {
            if (isAccountLevel) {
                api1 = dispatch(
                    getAccountAuditOverallDetailsRequest({
                        search_data: getTopBarData(),
                        template_id: template_active,
                        filters: dashboard_filters,
                    })
                );

                dispatch(setActiveAccountAuditTemplate(template_active));
                dispatch(fetchAuditTemplateQuestionsAccounts(template_active));
            } else {
                api2 = dispatch(
                    getCallAuditOverallDetailsRequest({
                        search_data: getTopBarData(),
                        template_id: template_active,
                        filters: dashboard_filters,
                    })
                );
                dispatch(getSearchAuditTemplateRequest(template_active));
            }
        }
        return () => {
            api1 && api1?.abort();
            api2 && api2.abort();
        };
    }, [
        template_active,
        filterReps.active,
        filterCallDuration.active,
        filterDates.active,
        isAccountLevel,
        filterTeams.active,
        dashboard_filters,
        visible,
    ]);

    const handleFilter = (index, value) => {
        if (!template && index > -1) {
            return;
        }

        const filters = [...checkArray(questions)];
        if (filters[index]) filters[index] = { ...filters[index], ...value };

        dispatch(
            storeSearchAuditTemplate({
                ...searchAuditTemplate,
                questions: filters,
                fromFiltersPage: true,
            })
        );
    };

    const [goToCalls, setGoToCalls] = useState(false);

    useEffect(() => {
        if (
            goToCalls &&
            Object.keys(searchFilters.activeQuestions).length === 1
        ) {
            handleActiveComponent("calls");
        }
    }, [searchFilters.activeQuestions, goToCalls]);

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
                template: searchFilters.template,
                activeTemplate: searchFilters.activeTemplate,
                auditQuestions: searchFilters.auditQuestions,
            })
        );
        setGoToCalls(true);
        defaultView && dispatch(setActiveSearchView(0));
    };

    const toCallPage = ({ id, checked, data }) => {
        const obj = {};

        obj[id] = {
            checked,
            ...data,
        };

        dispatch(
            setSearchFilters({
                ...defaultSearchFilters,
                activeQuestions: obj,
                template: searchFilters.template,
                activeTemplate: searchFilters.activeTemplate,
                auditQuestions: searchFilters.auditQuestions,
                audit_filter: dashboard_filters.audit_filter,
            })
        );
        setGoToCalls(true);
        defaultView && dispatch(setActiveSearchView(0));
    };

    // useEffect(() => {
    //     dispatch(getAuditTemplatesForAccounts(false));
    // }, []);

    useEffect(() => {
        dispatch(
            setSearchFilters({
                activeQuestions: {},
            })
        );
    }, []);

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
                    checked === 1
                        ? "Good"
                        : checked === 0
                        ? "Bad"
                        : "Need Attention",
                type: "Account Scoring",
                id,
            },
        ];

        if (
            dashboard_filters.audit_filter.audit_type &&
            dashboard_filters.audit_filter.audit_type !==
                auditConfig.AI_AUDIT_TYPE
        ) {
            data.push({
                name: dashboard_filters.audit_filter.audit_type,
                type: "Audit Type",
                id: uid(),
            });
        }

        if (dashboard_filters.stage) {
            data.push({
                id: uid(),
                type: "Status/Stage",
                name: filters.stage.find(
                    ({ id }) => dashboard_filters.stage === id
                ).stage,
            });
        }

        dispatch(setActiveFilters(data));

        dispatch(setActiveAccountAuditTemplate(template_active));
        dispatch(setActiveAuditType(dashboard_filters.audit_filter));
        dispatch(setActiveStage(dashboard_filters.stage));

        handleActiveComponent("accounts");
    };

    useEffect(() => {
        dispatch(getTemplatesForFilter());
    }, []);

    const {
        common: {
            versionData: { stats_threshold },
        },
    } = useSelector((state) => state);

    return (
        <CallFiltersContext.Provider
            value={{
                handleFilter,
                toCallPage,
                toAccountPage,
                handleCheck,
                scored_accounts_count,
                scored_meetings_count,
            }}
        >
            <div className="overview_attr-page  overflowYscroll">
                {(isAccountLevel && account_results?.length) ||
                (!isAccountLevel && call_results?.length) ? (
                    Object.keys(categories)?.map((name, index) => (
                        <Collapse
                            className="category__container"
                            expandIconPosition="right"
                            bordered={false}
                            key={name + index}
                            defaultActiveKey={index === 0 ? [name] : []}
                        >
                            <Panel
                                header={
                                    <div className="flex alignCenter">
                                        <div className="category_name uppercase marginR12">
                                            {name}
                                        </div>
                                        {typeof categoriesScore?.[name]
                                            ?.average === "number" && (
                                            <div className="flex alignCenter">
                                                <span className="bold600">
                                                    {formatFloat(
                                                        categoriesScore?.[name]
                                                            ?.average,
                                                        2
                                                    )}
                                                    %
                                                </span>
                                                <DisplayTrend
                                                    style={{
                                                        fontSize: "14px",
                                                    }}
                                                    trend={
                                                        categoriesScore?.[name]
                                                            ?.trend
                                                    }
                                                />
                                                <Dot
                                                    height="8px"
                                                    width="8px"
                                                    className="dusty_gray_bg marginLR12"
                                                />
                                                {categoriesScore?.[name]
                                                    ?.average >=
                                                stats_threshold.good ? (
                                                    <span className="perfomance_status top_performing">
                                                        Top Performing
                                                    </span>
                                                ) : categoriesScore?.[name]
                                                      ?.average <
                                                  stats_threshold.average ? (
                                                    <span className="perfomance_status need_attention">
                                                        Need Attention
                                                    </span>
                                                ) : null}
                                            </div>
                                        )}
                                    </div>
                                }
                                key={name}
                            >
                                <div>
                                    <Row
                                        className="teamplate__list__container"
                                        gutter={[24, 24]}
                                    >
                                        <Col
                                            xl={12}
                                            lg={12}
                                            md={12}
                                            sm={24}
                                            xs={24}
                                        >
                                            {categories[name]?.map(
                                                (data, index) =>
                                                    index % 2 === 0 ? (
                                                        <AttributeCard
                                                            data={data}
                                                            key={index}
                                                            q_no={index + 1}
                                                            isAccountLevel={
                                                                isAccountLevel
                                                            }
                                                        />
                                                    ) : null
                                            )}
                                        </Col>
                                        <Col
                                            xl={12}
                                            lg={12}
                                            md={12}
                                            sm={24}
                                            xs={24}
                                        >
                                            {categories[name]?.map(
                                                (data, index) =>
                                                    index % 2 !== 0 ? (
                                                        <AttributeCard
                                                            data={data}
                                                            key={index}
                                                            q_no={index + 1}
                                                            isAccountLevel={
                                                                isAccountLevel
                                                            }
                                                        />
                                                    ) : null
                                            )}
                                        </Col>
                                    </Row>
                                </div>
                            </Panel>
                        </Collapse>
                    ))
                ) : (
                    <div className="height100p flex alignCenter justifyCenter">
                        <EmptyDataState />
                    </div>
                )}
            </div>
        </CallFiltersContext.Provider>
    );
}

const EmptyDataState = () => (
    <div className="flex1 flex column alignCenter justifyCenter">
        <NoDashBoardDataSvg
            style={{
                transform: "scale(1.2)",
            }}
        />
        <div className="font16 bold600 marginT16">No Data !</div>
    </div>
);

export default OverallAndAttributes;
