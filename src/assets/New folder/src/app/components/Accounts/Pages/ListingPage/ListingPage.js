import { Button, Checkbox, Collapse, Drawer, Input, Row, Select } from "antd";
import React, { useCallback, useContext, useEffect, useState } from "react";
import AccountCard from "./Components/AccountCard";
import ReactVirtualCard from "@reusables/ReactVirtualCard";
import ListPageHeader from "./Components/ListPageHeader";
import CardHeadings from "./Components/CardHeadings";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAuditTemplateQuestionsAccounts,
    getAuditTemplatesForAccounts,
    setActiveAccountAuditTemplate,
    setActiveFilterQuestions,
    setActiveStage,
    setActiveFilters,
    setActiveInteractions,
    setActiveDealSize,
    setActiveCloseDate,
    setActiveLastContact,
    resetAccountFilters,
    setActiveFilterLeadScoreQuestions,
    setActiveLeadScorePercent,
    setActiveAuditType,
    getAccountTags,
    setActiveAccountTags,
} from "@store/accounts/actions";
import { AccountsContext } from "../../Accounts";
import NoAccountsSvg from "app/static/svg/NoAccountsSvg";
import PlusSvg from "app/static/svg/PlusSvg";
import MinusSvg from "app/static/svg/MinusSvg";
import TopbarConfig from "@constants/Topbar/index";

import CalendarSvg from "app/static/svg/CalendarSvg";
import { flattenTeams, getLocaleDate, uid } from "@tools/helpers";
import Icon from "@presentational/reusables/Icon";
import auditConfig from "@constants/Audit/index";
import Spinner from "@presentational/reusables/Spinner";
import FiltersUI from "../DetailsPage/Components/FiltersUI";
import { accountListFiltersPayload } from "@tools/searchFactory";
import { setAccountListSearchText } from "@store/accounts/actions";
import CloseSvg from "app/static/svg/CloseSvg";
import CustomDateRangePicker from "app/components/Resuable/CustomDateRangePicker";
import {
    changeActiveTeam,
    clearFilters,
    setActiveCallDuration,
    setActiveFilterDate,
    setActiveRep,
} from "@store/common/actions";
import AuditType from "app/components/Resuable/AuditType/AuditType";
import {
    getAccountList,
    getNextAccountList,
} from "@store/accountListSlice/accountListSlice";
import { setSearchFilters } from "@store/search/actions";
import { useGetLeadScoreConfigQuery } from "@convin/redux/services/settings/scoreSense.service";

const { Panel } = Collapse;
const { Option } = Select;

function ListingPage(props) {
    const {
        filterTeams,
        filterDates,
        filterReps,
        filterCallDuration,
        accountListSlice: { results, next },
        searchText,
        sortKey,
        filters,
        loaders,
        activeFilters,
    } = useContext(AccountsContext);
    const dispatch = useDispatch();
    const [visible, setVisible] = useState(false);
    const openFilters = () => setVisible(true);
    const closeFilters = () => setVisible(false);
    const [aiData, setAiData] = useState({});
    const [leadScoreQuestions, setLeadScoreQuestions] = useState({});
    const [dealSize, setDealSize] = useState([null, null]);
    const [interactionCount, setInteractionCount] = useState(null);
    const [leadScorePercent, setLeadScorePercent] = useState(null);
    const [stage, setStage] = useState(null);
    const [closeDateRange, setCloseDateRange] = useState([null, null]);
    const [lastConnectDateRange, setLastConnectDateRange] = useState([
        null,
        null,
    ]);
    const [auditType, setAuditType] = useState(filters.audit_filter);
    const [accountTags, setAccountTags] = useState(filters.activeAccountTags);
    const [leadFilters, setLeadFilters] = useState({
        is_hot: false,
        is_warm: false,
        is_cold: false,
    });

    const versionData = useSelector((state) => state.common.versionData);

    const getPayload = useCallback(() => {
        let payload = {
            search_data: accountListFiltersPayload({
                owner_id: filterReps.active,
                start_date_gte: new Date(
                    filterDates?.dates?.[filterDates.active].dateRange[0]
                ).getTime(),
                start_date_lte: new Date(
                    filterDates?.dates?.[filterDates.active].dateRange[1]
                ).getTime(),
                team_id: filterTeams.active,
                stage: filters.activeStage,
                dealSize: filters.dealSize,
                last_contacted_gte: filters.lastContacted[0],
                last_contacted_lte: filters.lastContacted[1],
                close_date_gte: filters.closeDate[0],
                close_date_lte: filters.closeDate[1],
                searchText,
                aiQuestions: filters.activeQuestions,
                leadScoreQuestions: filters.activeLeadScoreQuestions,
                leadScorePercent: filters.activeLeadScorePercent,
                duration_gte: filterCallDuration.active
                    ? filterCallDuration.options[filterCallDuration.active]
                          .value?.[0] * 60
                    : null,
                duration_lte: filterCallDuration.active
                    ? filterCallDuration.options[filterCallDuration.active]
                          .value?.[1]
                        ? filterCallDuration.options[filterCallDuration.active]
                              .value?.[1] * 60
                        : null
                    : null,
                template_id: filters.activeTemplate,
                audit_filter: auditType,
                stats_threshold: versionData.stats_threshold,
                accountTags: filters.activeAccountTags,
                lead_config: {
                    ...leadFilters,
                },
            }),
        };

        // if (filterCallDuration.active) {
        //     payload.duration_gte =
        //         +filterCallDuration.options[filterCallDuration.active].value *
        //         60;
        // }

        if (searchText) {
            payload.query = searchText;
        }

        if (sortKey) {
            payload.order_by = sortKey;
        }

        if (filters.activeInteractions) {
            payload.interaction_count = +filters.activeInteractions;
        }

        return payload;
    }, [
        filterDates.active,
        filterTeams.active,
        filterReps.active,
        searchText,
        filterCallDuration.active,
        sortKey,
        activeFilters,
    ]);

    const getAccountLostTopFilters = useCallback(() => {
        const data = [];
        if (filterDates.active !== versionData?.filters?.defaultDate) {
            data.push({
                id: uid(),
                type: "Start Date",
                name:
                    getLocaleDate(
                        filterDates?.dates?.[filterDates?.active]
                            ?.dateRange?.[0]
                    ) +
                    " All " +
                    getLocaleDate(
                        filterDates?.dates?.[filterDates?.active]
                            ?.dateRange?.[1]
                    ),
            });
        }
        if (filterTeams.active.length) {
            const teams = flattenTeams(filterTeams.teams);
            filterTeams.active.forEach((id) =>
                data.push({
                    id: `team.${id}`,
                    type: "Team",
                    name: teams?.find((team) => team?.id === id)?.name,
                })
            );
        }
        // if (filterReps.active) {
        //     data.push({
        //         id: uid(),
        //         type: 'Owner',
        //         name: filterReps?.reps?.find(
        //             (rep) => rep?.id === filterReps?.active
        //         )?.name,
        //     });
        // }

        if (!!filterReps.active.length) {
            filterReps.active.forEach((id) => {
                data.push({
                    id: `rep.${id}`,
                    type: "Owner",
                    name: filterReps?.reps?.find((rep) => rep?.id === id)?.name,
                });
            });
        }

        if (
            filterCallDuration.active !== Number(TopbarConfig.defaultDuration)
        ) {
            data.push({
                id: uid(),
                type: "Duration",
                name: filterCallDuration?.options?.[filterCallDuration.active]
                    ?.text,
            });
        }

        return data;
    }, [
        filterDates.active,
        filterTeams.active,
        filterReps.active,
        filterCallDuration.active,
    ]);

    useEffect(() => {
        const {
            activeStage,
            activeQuestions,
            activeLeadScoreQuestions,
            activeInteractions,
            dealSize,
            closeDate,
            lastContacted,
            activeLeadScorePercent,
            audit_filter,
            activeAccountTags,
        } = filters;

        setStage(activeStage);
        setAiData(activeQuestions);
        setLeadScoreQuestions(activeLeadScoreQuestions);
        setLeadScorePercent(activeLeadScorePercent);
        setInteractionCount(activeInteractions);
        setDealSize(dealSize);
        setCloseDateRange(closeDate);
        setLastConnectDateRange(lastContacted);
        setAuditType(audit_filter);
        setAccountTags(activeAccountTags);
    }, [filters]);

    // useEffect(() => {applyFilters()},[])

    useEffect(() => {
        const api = dispatch(getAccountList(getPayload()));
        return () => api && api?.abort?.();
    }, [
        filterDates.active,
        filterTeams.active,
        filterReps.active,
        searchText,
        filterCallDuration.active,
        sortKey,
        activeFilters,
    ]);

    // useEffect(() => {
    //     dispatch(getRepByTeamForAccounts(filterTeams.active));
    // }, [filterTeams.active]);

    const onLoadMore = () => {
        dispatch(getNextAccountList({ payload: getPayload(), next }));
    };

    useEffect(() => {
        filters?.templates?.length || dispatch(getAuditTemplatesForAccounts());

        // if (!versionData?.noLeadScore) {
        //     dispatch(getAccountLeadScoreObjects());
        // }
    }, []);

    useEffect(() => {
        if (filters.activeTemplate) {
            dispatch(
                fetchAuditTemplateQuestionsAccounts(filters.activeTemplate)
            );
        }
    }, [filters.activeTemplate]);

    useEffect(() => {
        if (!filters.accountTags) {
            dispatch(getAccountTags());
        }
    }, []);

    const {
        BOOLEAN_TYPE,
        RATING_TYPE,

        CUSTOM_TYPE,
    } = auditConfig;

    const handleCheck = (id, ans, question, type, isChecked, isAi = true) => {
        const obj = isAi ? { ...aiData } : { ...leadScoreQuestions };

        if (isChecked) {
            obj[id] = {
                checked: ans,
                question,
                type,
            };
        } else {
            delete obj[id];
        }

        isAi ? setAiData({ ...obj }) : setLeadScoreQuestions({ ...obj });
    };

    const applyFilters = () => {
        dispatch(setActiveStage(stage));
        dispatch(setActiveFilterQuestions(aiData));
        dispatch(setActiveFilterLeadScoreQuestions(leadScoreQuestions));

        dispatch(setActiveInteractions(interactionCount));

        dispatch(setActiveDealSize(dealSize));
        dispatch(setActiveLeadScorePercent(leadScorePercent));
        dispatch(setActiveCloseDate(closeDateRange));
        dispatch(setActiveLastContact(lastConnectDateRange));
        dispatch(
            setActiveAuditType({
                audit_type: auditType?.audit_type,
            })
        );
        dispatch(setActiveAccountTags(accountTags));

        const auditQuetionKeys = Object.keys(aiData);
        const leadQuetionKeys = Object.keys(leadScoreQuestions);
        let data = [];

        auditType?.audit_type &&
            data.push({
                id: uid(),
                type: "Audit Type",
                name: auditType?.audit_type,
            });

        if (searchText) {
            data.push({
                id: uid(),
                type: "search_text",
                name: `${searchText}`,
            });
        }

        if (interactionCount) {
            data.push({
                id: uid(),
                type: "Min No. of Interactions",
                name: interactionCount,
            });
        }

        if (stage) {
            data.push({
                id: uid(),
                type: "Status/Stage",
                name: filters.stage.find(({ id }) => stage === id).stage,
            });
        }

        if (auditQuetionKeys.length) {
            const questions = auditQuetionKeys.map((key) => {
                return {
                    name:
                        key === "AI Score"
                            ? aiData[key]?.checked === 1
                                ? "Good"
                                : aiData[key]?.checked === 0
                                ? "Average"
                                : "Need Attention"
                            : aiData[key].question,
                    type: "Account Scoring",
                    id: key,
                };
            });

            data = [...data, ...questions];
        }

        if (leadQuetionKeys.length) {
            const questions = leadQuetionKeys.map((key) => {
                return {
                    name: leadScoreQuestions[key].question,
                    type: "Lead Scoring",
                    id: key,
                };
            });

            data = [...data, ...questions];
        }

        if (dealSize[0] || dealSize[1]) {
            data.push({
                id: uid(),
                type: "Deal Size",
                name: `${dealSize[0] ? "$" + dealSize[0] : ""} - ${
                    dealSize[1] ? "$" + dealSize[1] : ""
                }`,
            });
        }

        if (closeDateRange[0]) {
            data.push({
                id: uid(),
                type: "Close Date",
                name: `${getLocaleDate(closeDateRange[0])}-${getLocaleDate(
                    closeDateRange[1]
                )}`,
            });
        }

        if (lastConnectDateRange[0]) {
            data.push({
                id: uid(),
                type: "Last Connected",
                name: `${getLocaleDate(
                    lastConnectDateRange[0]
                )}-${getLocaleDate(lastConnectDateRange[1])}`,
            });
        }

        if (leadScorePercent !== null) {
            data.push({
                id: uid(),
                type: "Minimum Lead Score",
                name: `${leadScorePercent}%`,
            });
        }
        if (accountTags?.length) {
            const tagObject = {};
            filters.accountTags.forEach(({ id, tag }) => {
                tagObject[id] = tag;
            });
            accountTags.forEach((tag) =>
                data.push({
                    id: tag,
                    type: "Account Tag",
                    name: tagObject[tag],
                })
            );
        }

        if (Object.values(leadFilters).includes(true)) {
            data.push({
                id: uid(),
                type: "Lead Score",
                name: leadFilters.is_hot
                    ? "Hot"
                    : leadFilters.is_warm
                    ? "Warm"
                    : "Cold",
            });
        }

        dispatch(setActiveFilters(data));
        closeFilters();
    };

    const handleRemove = ({ type, id }) => {
        dispatch(
            setActiveFilters(activeFilters.filter((filter) => filter.id !== id))
        );

        switch (type) {
            case "Account Scoring":
                let questions = { ...filters.activeQuestions };

                delete questions[id];

                dispatch(setActiveFilterQuestions(questions));
                break;
            case "Audit Type":
                dispatch(
                    setActiveAuditType({
                        audit_type: null,
                    })
                );
                break;
            case "Lead Scoring":
                let leadQuestions = { ...filters.activeLeadScoreQuestions };
                delete leadQuestions[id];
                dispatch(setActiveFilterLeadScoreQuestions(leadQuestions));
                break;
            case "Minimum Lead Score":
                dispatch(setActiveLeadScorePercent(null));
                break;
            case "Status/Stage":
                dispatch(setActiveStage(null));
                break;
            case "Deal Size":
                dispatch(setActiveDealSize([null, null]));
                break;
            case "Close Date":
                dispatch(setActiveCloseDate([null, null]));
                break;
            case "Last Connected":
                dispatch(setActiveLastContact([null, null]));
                break;
            case "Min No. of Interactions":
                dispatch(setActiveInteractions(null));
                break;
            case "Team":
                const toRemove = Number(id.split(".")?.[1]);
                return dispatch(
                    changeActiveTeam(
                        filterTeams.active?.filter(
                            (team_id) => team_id !== toRemove
                        )
                    )
                );
            case "Owner":
                const repToRemove = Number(id.split(".")?.[1]);
                return dispatch(
                    setActiveRep(
                        filterReps.active?.filter(
                            (rep_id) => rep_id !== repToRemove
                        )
                    )
                );
            // dispatch(setActiveRep([]));
            // break;
            case "Start Date":
                dispatch(setActiveFilterDate("all"));
                break;
            case "Duration":
                dispatch(setActiveCallDuration("2"));
                break;
            case "search_text":
                dispatch(setAccountListSearchText(""));
                break;
            case "Account Tag":
                const newTags = filters?.activeAccountTags?.filter(
                    (tag_id) => tag_id !== id
                );
                dispatch(setActiveAccountTags(newTags));
                break;
            case "Lead Score":
                setLeadFilters({
                    is_hot: false,
                    is_warm: false,
                    is_cold: false,
                });
                break;
            default:
        }
    };

    const clearAll = () => {
        dispatch(clearFilters());

        dispatch(resetAccountFilters());
        dispatch(setAccountListSearchText(""));
    };

    const AccountFilterFooter = () => (
        <div className="filter_footer">
            <Button className="footer_button clear__button" onClick={clearAll}>
                Clear
            </Button>
            <Button
                type="primary"
                className="footer_button"
                onClick={() => {
                    applyFilters();
                }}
            >
                Apply Filter
            </Button>
        </div>
    );

    // useEffect(() => {
    //     dispatch(getRepByTeam(filterTeams.active));
    //     return () => {
    //         dispatch(setActiveRep([]));
    //         clearAll();
    //     };
    // }, []);

    return (
        <div className="accounts__listpage flex column">
            <ListPageHeader openFilters={openFilters} />
            <div className="marginT15">
                <FiltersUI
                    data={[...activeFilters, ...getAccountLostTopFilters()]}
                    blockWidth={200}
                    maxCount={6}
                    removeFilter={handleRemove}
                    clearAll={clearAll}
                />
            </div>
            {results?.length ? (
                <>
                    <Row className="mine_shaft_cl flexShrink marginT54 marginB18 ">
                        <CardHeadings />
                    </Row>

                    <ReactVirtualCard
                        hasNextPage={next || null}
                        data={results || []}
                        onLoadMore={onLoadMore}
                        Component={AccountCard}
                        className="mine_shaft_cl accounts__listpage__card__container flex1 overflowYscroll "
                    />
                </>
            ) : (
                <div className="flex1 flex column alignCenter justifyCenter">
                    <NoAccountsSvg />

                    <div className="marginT10 bolder font20">
                        No Accounts Found!
                    </div>
                </div>
            )}
            <Drawer
                title={<div className="bold700 font24">Filters</div>}
                placement="right"
                width={"480px"}
                onClose={closeFilters}
                visible={visible}
                className="account__list__filters drawer__filters"
                footer={<AccountFilterFooter />}
                extra={
                    <>
                        <span className="curPoint" onClick={closeFilters}>
                            <CloseSvg />
                        </span>
                    </>
                }
            >
                <Collapse
                    expandIconPosition="right"
                    bordered={false}
                    defaultActiveKey={["transcripts", "topics"]}
                    expandIcon={({ isActive }) =>
                        isActive ? (
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
                        )
                    }
                >
                    {versionData?.domain_type === "b2c" && (
                        <Panel header={"Account Scoring"} className="white_bg">
                            <Spinner loading={loaders.aiDataLoader}>
                                <div>
                                    <div className="mine_shaft_cl bold700 marginB20">
                                        CHOOSE AN AUDIT TEMPLATE
                                    </div>
                                    <Select
                                        value={filters.activeTemplate}
                                        onChange={(value) => {
                                            dispatch(
                                                setActiveAccountAuditTemplate(
                                                    value
                                                )
                                            );
                                        }}
                                        optionFilterProp="children"
                                        className="custom__select filter__select"
                                        suffixIcon={
                                            <Icon className="fas fa-chevron-down dove_gray_cl" />
                                        }
                                        popupClassName={
                                            "account_select_dropdown"
                                        }
                                        placeholder={"Choose an audit template"}
                                        showSearch
                                    >
                                        {filters.templates.map(
                                            ({ id, name }, idx) => (
                                                <Option value={id} key={idx}>
                                                    {name}
                                                </Option>
                                            )
                                        )}
                                    </Select>
                                    <AuditType
                                        value={auditType?.audit_type}
                                        onChange={(e) => {
                                            setAuditType({
                                                audit_type: e.target.value,
                                            });
                                        }}
                                    />
                                    <div>
                                        {filters.questions.map(
                                            (
                                                {
                                                    id,
                                                    question_text,
                                                    question_type,
                                                    settings,
                                                },
                                                idx
                                            ) => {
                                                return (
                                                    <div
                                                        key={id}
                                                        className={`paddingT22 paddingB20 ${
                                                            filters.questions
                                                                .length -
                                                                1 ===
                                                            idx
                                                                ? ""
                                                                : "borderBottom"
                                                        }`}
                                                    >
                                                        <div className="flex alignStart bold600 mine_shaft_cl">
                                                            <div className="marginR16">
                                                                {idx < 9
                                                                    ? `0${
                                                                          idx +
                                                                          1
                                                                      }`
                                                                    : idx + 1}
                                                                .
                                                            </div>
                                                            <div className="flex1 flex column">
                                                                <div
                                                                    style={{
                                                                        borderLeft:
                                                                            "1px solid #99999933",
                                                                    }}
                                                                    className="paddingL8"
                                                                >
                                                                    {
                                                                        question_text
                                                                    }
                                                                </div>

                                                                <div className="paddingL8 paddingT13 bold600">
                                                                    {question_type ===
                                                                    BOOLEAN_TYPE ? (
                                                                        <div>
                                                                            <Checkbox
                                                                                onClick={(
                                                                                    e
                                                                                ) =>
                                                                                    e.stopPropagation()
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    handleCheck(
                                                                                        id,
                                                                                        1,
                                                                                        question_text,
                                                                                        question_type,
                                                                                        e
                                                                                            .target
                                                                                            .checked
                                                                                    )
                                                                                }
                                                                                checked={
                                                                                    aiData?.[
                                                                                        id
                                                                                    ]
                                                                                        ?.checked ===
                                                                                    1
                                                                                }
                                                                            >
                                                                                {idx ===
                                                                                0
                                                                                    ? "Good Score"
                                                                                    : "Yes"}
                                                                            </Checkbox>
                                                                            <Checkbox
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    handleCheck(
                                                                                        id,
                                                                                        0,
                                                                                        question_text,
                                                                                        question_type,
                                                                                        e
                                                                                            .target
                                                                                            .checked
                                                                                    )
                                                                                }
                                                                                checked={
                                                                                    aiData?.[
                                                                                        id
                                                                                    ]
                                                                                        ?.checked ===
                                                                                    0
                                                                                }
                                                                            >
                                                                                {idx ===
                                                                                0
                                                                                    ? "Average Score"
                                                                                    : "No"}
                                                                            </Checkbox>
                                                                            <Checkbox
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    handleCheck(
                                                                                        id,
                                                                                        -1,
                                                                                        question_text,
                                                                                        question_type,
                                                                                        e
                                                                                            .target
                                                                                            .checked
                                                                                    )
                                                                                }
                                                                                checked={
                                                                                    aiData?.[
                                                                                        id
                                                                                    ]
                                                                                        ?.checked ===
                                                                                    -1
                                                                                }
                                                                            >
                                                                                {idx ===
                                                                                0
                                                                                    ? "Need Attention"
                                                                                    : "Na"}
                                                                            </Checkbox>
                                                                        </div>
                                                                    ) : question_type ===
                                                                      CUSTOM_TYPE ? (
                                                                        <div>
                                                                            {settings?.custom.map(
                                                                                ({
                                                                                    id: custom_id,
                                                                                    name,
                                                                                }) => (
                                                                                    <Checkbox
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            handleCheck(
                                                                                                id,
                                                                                                custom_id,
                                                                                                question_text,
                                                                                                question_type,
                                                                                                e
                                                                                                    .target
                                                                                                    .checked
                                                                                            )
                                                                                        }
                                                                                        checked={
                                                                                            aiData?.[
                                                                                                id
                                                                                            ]
                                                                                                ?.checked ===
                                                                                            custom_id
                                                                                        }
                                                                                        key={
                                                                                            custom_id
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            name
                                                                                        }
                                                                                    </Checkbox>
                                                                                )
                                                                            )}
                                                                        </div>
                                                                    ) : question_type ===
                                                                      RATING_TYPE ? (
                                                                        <div>
                                                                            <Button
                                                                                onClick={() =>
                                                                                    handleCheck(
                                                                                        id,
                                                                                        "5<",
                                                                                        question_text,
                                                                                        question_type,
                                                                                        !(
                                                                                            aiData?.[
                                                                                                id
                                                                                            ]
                                                                                                ?.checked ===
                                                                                            "5<"
                                                                                        )
                                                                                    )
                                                                                }
                                                                                className={`rating_button ${
                                                                                    aiData?.[
                                                                                        id
                                                                                    ]
                                                                                        ?.checked ===
                                                                                    "5<"
                                                                                        ? "active_button"
                                                                                        : ""
                                                                                }`}
                                                                            >
                                                                                {5 +
                                                                                    " <"}
                                                                            </Button>
                                                                            <Button
                                                                                onClick={() =>
                                                                                    handleCheck(
                                                                                        id,
                                                                                        "7<",
                                                                                        question_text,
                                                                                        question_type,
                                                                                        !(
                                                                                            aiData?.[
                                                                                                id
                                                                                            ]
                                                                                                ?.checked ===
                                                                                            "7<"
                                                                                        )
                                                                                    )
                                                                                }
                                                                                className={`rating_button ${
                                                                                    aiData?.[
                                                                                        id
                                                                                    ]
                                                                                        ?.checked ===
                                                                                    "7<"
                                                                                        ? "active_button"
                                                                                        : ""
                                                                                }`}
                                                                            >
                                                                                {7 +
                                                                                    " <"}
                                                                            </Button>
                                                                            <Button
                                                                                onClick={() =>
                                                                                    handleCheck(
                                                                                        id,
                                                                                        "7>",
                                                                                        question_text,
                                                                                        question_type,
                                                                                        !(
                                                                                            aiData?.[
                                                                                                id
                                                                                            ]
                                                                                                ?.checked ===
                                                                                            "7>"
                                                                                        )
                                                                                    )
                                                                                }
                                                                                className={`rating_button ${
                                                                                    aiData?.[
                                                                                        id
                                                                                    ]
                                                                                        ?.checked ===
                                                                                    "7>"
                                                                                        ? "active_button"
                                                                                        : ""
                                                                                }`}
                                                                            >
                                                                                {7 +
                                                                                    " >"}
                                                                            </Button>
                                                                            <Button
                                                                                onClick={() =>
                                                                                    handleCheck(
                                                                                        id,
                                                                                        -1,
                                                                                        question_text,
                                                                                        question_type,
                                                                                        !(
                                                                                            aiData?.[
                                                                                                id
                                                                                            ]
                                                                                                ?.checked ===
                                                                                            -1
                                                                                        )
                                                                                    )
                                                                                }
                                                                                className={`rating_button ${
                                                                                    aiData?.[
                                                                                        id
                                                                                    ]
                                                                                        ?.checked ===
                                                                                    -1
                                                                                        ? "active_button"
                                                                                        : ""
                                                                                }`}
                                                                            >
                                                                                NA
                                                                            </Button>
                                                                        </div>
                                                                    ) : (
                                                                        <></>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            </Spinner>
                        </Panel>
                    )}
                    {versionData?.feature_access?.lead_score && (
                        <Panel
                            header={"Minimum Lead Score"}
                            className="white_bg"
                        >
                            <div className="flex1 paddingR8">
                                <Input
                                    className="input__filter marginR8"
                                    placeholder="Enter minnimum lead score"
                                    value={leadScorePercent}
                                    onChange={(e) =>
                                        setLeadScorePercent(e.target.value)
                                    }
                                />
                            </div>
                        </Panel>
                    )}
                    <Panel
                        header={"Lead Score"}
                        key="lead_config"
                        id="lead_config"
                        className="white_bg"
                    >
                        <Checkbox
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                                setLeadFilters({
                                    is_hot: e.target.checked,
                                    is_warm: false,
                                    is_cold: false,
                                });
                            }}
                            checked={leadFilters.is_hot}
                        >
                            Hot
                        </Checkbox>
                        <Checkbox
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                                setLeadFilters({
                                    is_hot: false,
                                    is_cold: false,
                                    is_warm: e.target.checked,
                                });
                            }}
                            checked={leadFilters.is_warm}
                        >
                            Warm
                        </Checkbox>
                        <Checkbox
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                                setLeadFilters({
                                    is_hot: false,
                                    is_warm: false,
                                    is_cold: e.target.checked,
                                });
                            }}
                            checked={leadFilters.is_cold}
                        >
                            Cold
                        </Checkbox>
                    </Panel>
                    <Panel header={"Deal Size"} className="white_bg">
                        <div className="flex">
                            <div className="flex1 paddingR8">
                                <Input
                                    className="input__filter marginR8"
                                    placeholder="Enter min"
                                    value={dealSize[0]}
                                    onChange={(e) =>
                                        setDealSize([
                                            e.target.value,
                                            dealSize[1],
                                        ])
                                    }
                                />
                            </div>
                            <div className="flex1 paddingL8">
                                <Input
                                    className="input__filter"
                                    placeholder="Enter max"
                                    value={dealSize[1]}
                                    onChange={(e) =>
                                        setDealSize([
                                            dealSize[0],
                                            e.target.value,
                                        ])
                                    }
                                />
                            </div>
                        </div>
                    </Panel>
                    <Panel
                        header={"Minimum Number of Interactions"}
                        className="white_bg"
                    >
                        <Input
                            className="input__filter"
                            placeholder={"Enter the interaction count"}
                            onChange={(e) =>
                                setInteractionCount(e.target.value)
                            }
                            value={interactionCount}
                        />
                    </Panel>
                    <Panel header={"Status/Stage"} className="white_bg">
                        <Select
                            value={stage}
                            onChange={(value) => {
                                setStage(value);
                            }}
                            optionFilterProp="children"
                            className="custom__select filter__select"
                            suffixIcon={
                                <Icon className="fas fa-chevron-down dove_gray_cl" />
                            }
                            popupClassName={"account_select_dropdown"}
                            placeholder={"Choose Status/Stage"}
                            showSearch
                        >
                            {filters.stage.map(({ id, stage }, idx) => (
                                <Option value={id} key={idx}>
                                    {stage}
                                </Option>
                            ))}
                        </Select>
                    </Panel>
                    <Panel header={"Close Date"} className="white_bg">
                        <div>
                            <CustomDateRangePicker
                                range={closeDateRange}
                                setRange={setCloseDateRange}
                            />
                        </div>
                    </Panel>
                    <Panel header={"Last Contacted"} className="white_bg">
                        <div>
                            <CustomDateRangePicker
                                range={lastConnectDateRange}
                                setRange={setLastConnectDateRange}
                            />
                        </div>
                    </Panel>
                    <Panel header={"Account Tags"} className="white_bg">
                        <Select
                            mode="multiple"
                            placeholder={"Enter the account tags"}
                            optionFilterProp="children"
                            onChange={(value) => {
                                setAccountTags([...value]);
                            }}
                            value={accountTags}
                            className="multiple__select filter__select"
                            suffixIcon={
                                <Icon className="fas fa-chevron-down dove_gray_cl" />
                            }
                            popupClassName={"account_select_dropdown"}
                        >
                            {filters?.accountTags?.map(({ id, tag }) => (
                                <Option value={id} key={id}>
                                    {tag}
                                </Option>
                            ))}
                        </Select>
                    </Panel>
                </Collapse>
            </Drawer>
        </div>
    );
}

const DateFilterPlaceHolder = ({ startDate, endDate }) => {
    return (
        <div className="flex">
            <div className="flex1 marginR18">
                <div className="bold600 mine_shaft_cl">From Date</div>
                <div className="date__container">
                    <CalendarSvg
                        style={{
                            color: "#999999",
                        }}
                        className="marginR14"
                    />

                    {startDate ? (
                        <span className="bold600 dove_gray_cl">
                            {getLocaleDate(startDate)}
                        </span>
                    ) : (
                        <span className="placeholder">Select Date</span>
                    )}
                </div>
            </div>
            <div className="flex1 bold600">
                <div className="bold600 mine_shaft_cl">To Date</div>
                <div className="date__container">
                    <CalendarSvg
                        style={{
                            color: "#999999",
                        }}
                        className="marginR14"
                    />
                    {endDate ? (
                        <span className="bold600 dove_gray_cl">
                            {getLocaleDate(endDate)}
                        </span>
                    ) : (
                        <span className="placeholder">Select Date</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListingPage;
