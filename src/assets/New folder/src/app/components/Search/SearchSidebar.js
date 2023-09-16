import React, { useEffect, useState } from "react";
import {
    Collapse,
    Select,
    Slider,
    Radio,
    Button,
    Checkbox,
    Input,
    InputNumber,
} from "antd";
import { Label } from "@reusables";
import config from "@constants/Search/index";
import { useDispatch, useSelector } from "react-redux";
import DebounceSelect from "./DebounceSelect";
import * as callApis from "@apis/calls/index";
import apiErrors from "@apis/common/errors";
import {
    getSalesTasks,
    openNotification,
    setActiveTemplateForFilters,
    storeSalesTasks,
} from "@store/common/actions";
import { uid } from "@tools/helpers";
import { getConfTools, setSearchFilters } from "@store/search/actions";
import Icon from "@presentational/reusables/Icon";
import MinusSvg from "app/static/svg/MinusSvg";
import PlusSvg from "app/static/svg/PlusSvg";
import auditConfig from "@constants/Audit/index";
import { useContext } from "react";
import { HomeContext } from "@container/Home/Home";
import AuditType from "../Resuable/AuditType/AuditType";

import CustomDateRangePicker from "app/components/Resuable/CustomDateRangePicker";
import { getAuditors } from "@store/userManagerSlice/userManagerSlice";

const { Panel } = Collapse;
const { Option } = Select;

export default function SearchSidebar(props) {
    const [showAdvance, setShowAdvance] = useState(false);
    const {
        common: { domain, filterCallTypes, versionData, filterTeams },
        search: { confTools, searchFilters },
        accounts: { filters },
    } = useSelector((state) => state);

    const dispatch = useDispatch();

    const { auditors } = useSelector((state) => state.userManagerSlice);

    useEffect(() => {
        dispatch(getAuditors());
    }, []);

    useEffect(() => {
        if (props.trackerName) {
            setShowAdvance(true);
        }
    }, [props.trackerName]);

    useEffect(() => {
        if (!confTools.length) {
            dispatch(getConfTools());
        }
    }, []);

    const { nextSalesTaskUrl, salesTaskNextLoading } = useSelector(
        (state) => state.common
    );

    const NotFoundContent = () => {
        return <span>No Clients Found</span>;
    };

    async function fetchClientList(query) {
        return callApis.getSalesTask(domain, query).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                dispatch(storeSalesTasks(res));
                return res.results.map((client) => ({
                    label: client.name || client.company,
                    value: client.id,
                }));
            }
        });
    }

    const loadMore = (event) => {
        var target = event.target;
        if (
            nextSalesTaskUrl &&
            !salesTaskNextLoading &&
            target.scrollTop + target.offsetHeight === target.scrollHeight
        ) {
            dispatch(getSalesTasks({ next_url: nextSalesTaskUrl }));
        }
    };

    const { templates, active: templateActive } = useSelector(
        (state) => state.common.filterAuditTemplates
    );

    const handleCheck = (params) => {
        const { id, data, checked, isChecked } = params;

        const obj = { ...searchFilters.activeQuestions };

        if (isChecked) {
            obj[id] = {
                ...data,
                checked,
            };
        } else {
            delete obj[id];
        }

        dispatch(
            setSearchFilters({
                activeQuestions: obj,
            })
        );
    };

    const { BOOLEAN_TYPE, RATING_TYPE, CUSTOM_TYPE } = auditConfig;

    return (
        <>
            <Collapse
                defaultActiveKey={["client"]}
                expandIconPosition={"end"}
                // accordion={props.isAccordion}

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
                    <Panel header={"Call Score"} key="template" id="template">
                        <div>
                            <div className="mine_shaft_cl bold700 marginB20">
                                CHOOSE AN AUDIT TEMPLATE
                            </div>

                            <Select
                                value={templateActive}
                                onChange={(value) => {
                                    dispatch(
                                        setActiveTemplateForFilters(value)
                                    );
                                }}
                                style={{
                                    width: "100%",
                                }}
                                dropdownRender={(menu) => (
                                    <div>
                                        <span className={"topbar-label"}>
                                            {"Choose an audit template"}
                                        </span>
                                        {menu}
                                    </div>
                                )}
                                optionFilterProp="children"
                                className={"custom__select filter__select"}
                                suffixIcon={
                                    <Icon className="fas fa-chevron-down dove_gray_cl" />
                                }
                                dropdownClassName={"account_select_dropdown"}
                            >
                                {templates
                                    ?.filter(({ teams }) =>
                                        filterTeams.active.length === 0
                                            ? true
                                            : teams.find(({ id }) =>
                                                  filterTeams.active?.includes(
                                                      id
                                                  )
                                              )
                                            ? true
                                            : false
                                    )
                                    .map(({ id, name }, idx) => (
                                        <Option value={id} key={idx}>
                                            {name}
                                        </Option>
                                    ))}
                            </Select>

                            {!!templateActive && (
                                <>
                                    <div className="flex marginTB16">
                                        <div className="flex1 paddingR8">
                                            <InputNumber
                                                className="input__filter marginR8"
                                                placeholder="Enter Min Call Score"
                                                value={
                                                    searchFilters.min_aiscore
                                                }
                                                onChange={(e) => {
                                                    dispatch(
                                                        setSearchFilters({
                                                            min_aiscore: e,
                                                        })
                                                    );
                                                }}
                                                min={0}
                                                max={
                                                    !searchFilters.max_aiscore
                                                        ? typeof searchFilters.max_aiscore ===
                                                          "number"
                                                            ? searchFilters.max_aiscore
                                                            : 100
                                                        : searchFilters.max_aiscore
                                                }
                                            />
                                        </div>
                                        <div className="flex1 paddingL8">
                                            <InputNumber
                                                className="input__filter"
                                                placeholder="Enter Max Call score"
                                                value={
                                                    searchFilters.max_aiscore
                                                }
                                                onChange={(e) => {
                                                    dispatch(
                                                        setSearchFilters({
                                                            max_aiscore: e,
                                                        })
                                                    );
                                                }}
                                                min={
                                                    searchFilters.min_aiscore ||
                                                    0
                                                }
                                                max={100}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        {searchFilters?.auditQuestions?.map(
                                            (data, idx) => {
                                                const {
                                                    id,
                                                    question_text,
                                                    question_type,
                                                    settings,
                                                } = data;
                                                return (
                                                    <div
                                                        key={id}
                                                        className={`paddingT22 paddingB20 ${
                                                            searchFilters
                                                                ?.auditQuestions
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
                                                                                        {
                                                                                            id,
                                                                                            data,
                                                                                            checked: 1,
                                                                                            isChecked:
                                                                                                e
                                                                                                    .target
                                                                                                    .checked,
                                                                                        }
                                                                                    )
                                                                                }
                                                                                checked={
                                                                                    searchFilters
                                                                                        ?.activeQuestions?.[
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
                                                                                        {
                                                                                            id,
                                                                                            data,
                                                                                            checked: 0,
                                                                                            isChecked:
                                                                                                e
                                                                                                    .target
                                                                                                    .checked,
                                                                                        }
                                                                                    )
                                                                                }
                                                                                checked={
                                                                                    searchFilters
                                                                                        ?.activeQuestions?.[
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
                                                                                        {
                                                                                            id,
                                                                                            data,
                                                                                            checked:
                                                                                                -1,
                                                                                            isChecked:
                                                                                                e
                                                                                                    .target
                                                                                                    .checked,
                                                                                        }
                                                                                    )
                                                                                }
                                                                                checked={
                                                                                    searchFilters
                                                                                        ?.activeQuestions?.[
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
                                                                                                {
                                                                                                    id,
                                                                                                    data,
                                                                                                    checked:
                                                                                                        custom_id,
                                                                                                    isChecked:
                                                                                                        e
                                                                                                            .target
                                                                                                            .checked,
                                                                                                }
                                                                                            )
                                                                                        }
                                                                                        checked={
                                                                                            searchFilters
                                                                                                ?.activeQuestions?.[
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
                                                                                        {
                                                                                            id,
                                                                                            data,
                                                                                            checked:
                                                                                                "5<",
                                                                                            isChecked:
                                                                                                !(
                                                                                                    searchFilters
                                                                                                        ?.activeQuestions?.[
                                                                                                        id
                                                                                                    ]
                                                                                                        ?.checked ===
                                                                                                    "5<"
                                                                                                ),
                                                                                        }
                                                                                    )
                                                                                }
                                                                                className={`rating_button ${
                                                                                    searchFilters
                                                                                        ?.activeQuestions?.[
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
                                                                                        {
                                                                                            id,
                                                                                            data,
                                                                                            checked:
                                                                                                "7<",
                                                                                            isChecked:
                                                                                                !(
                                                                                                    searchFilters
                                                                                                        ?.activeQuestions?.[
                                                                                                        id
                                                                                                    ]
                                                                                                        ?.checked ===
                                                                                                    "7<"
                                                                                                ),
                                                                                        }
                                                                                    )
                                                                                }
                                                                                className={`rating_button ${
                                                                                    searchFilters
                                                                                        ?.activeQuestions?.[
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
                                                                                        {
                                                                                            id,
                                                                                            data,
                                                                                            checked:
                                                                                                "7>",
                                                                                            isChecked:
                                                                                                !(
                                                                                                    searchFilters
                                                                                                        ?.activeQuestions?.[
                                                                                                        id
                                                                                                    ]
                                                                                                        ?.checked ===
                                                                                                    "7>"
                                                                                                ),
                                                                                        }
                                                                                    )
                                                                                }
                                                                                className={`rating_button ${
                                                                                    searchFilters
                                                                                        ?.activeQuestions?.[
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
                                                                                        {
                                                                                            id,
                                                                                            data,
                                                                                            checked:
                                                                                                -1,
                                                                                            isChecked:
                                                                                                !(
                                                                                                    searchFilters
                                                                                                        ?.activeQuestions?.[
                                                                                                        id
                                                                                                    ]
                                                                                                        ?.checked ===
                                                                                                    -1
                                                                                                ),
                                                                                        }
                                                                                    )
                                                                                }
                                                                                className={`rating_button ${
                                                                                    searchFilters
                                                                                        ?.activeQuestions?.[
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
                                </>
                            )}
                        </div>
                    </Panel>
                )}
                {versionData?.domain_type !== "b2c" || (
                    <Panel
                        header={"Audit"}
                        key="team_member"
                        id="upcoming_meetings_member_filter"
                    >
                        <AuditType
                            value={
                                searchFilters?.audit_filter?.audit_type ||
                                auditConfig.AI_AUDIT_TYPE
                            }
                            onChange={(e) => {
                                dispatch(
                                    setSearchFilters({
                                        audit_filter: {
                                            audit_type: e.target.value,
                                            auditors:
                                                e.target.value ===
                                                auditConfig.AI_AUDIT_TYPE
                                                    ? []
                                                    : searchFilters.audit_filter
                                                          .auditors,
                                            manualAuditDateRange: [null, null],
                                        },
                                    })
                                );
                            }}
                        />
                        <div className="marginB10">
                            {searchFilters?.audit_filter?.audit_type ===
                                auditConfig.MANUAL_AUDIT_TYPE && (
                                <>
                                    {searchFilters?.audit_filter
                                        ?.audit_type && (
                                        <CustomDateRangePicker
                                            range={
                                                searchFilters?.audit_filter
                                                    ?.manualAuditDateRange
                                            }
                                            setRange={(value) => {
                                                dispatch(
                                                    setSearchFilters({
                                                        audit_filter: {
                                                            ...searchFilters?.audit_filter,
                                                            manualAuditDateRange:
                                                                value,
                                                        },
                                                    })
                                                );
                                            }}
                                        />
                                    )}
                                    <div className="bold600 font16 marginB16">
                                        Choose Auditor
                                    </div>
                                    <Checkbox.Group
                                        className="flex row"
                                        onChange={(values) => {
                                            const index = values.findIndex(
                                                (val) => val === 0
                                            );
                                            const prevIndex =
                                                searchFilters.audit_filter.auditors.findIndex(
                                                    (val) => val === 0
                                                );

                                            const indexN1 = values.findIndex(
                                                (val) => val === -1
                                            );
                                            const prevIndexN1 =
                                                searchFilters.audit_filter.auditors.findIndex(
                                                    (val) => val === -1
                                                );

                                            /* If index has 0 and prevIndex has no zero - Select All - Remove others  
                                               IF index has no 0 and previndex has zero - Unselect All - Add others
                                            */
                                            dispatch(
                                                setSearchFilters({
                                                    audit_filter: {
                                                        ...searchFilters.audit_filter,
                                                        auditors:
                                                            values.length === 1
                                                                ? values
                                                                : index > -1 &&
                                                                  prevIndex ===
                                                                      -1 &&
                                                                  values.length >
                                                                      1
                                                                ? [0]
                                                                : indexN1 >
                                                                      -1 &&
                                                                  prevIndexN1 ===
                                                                      -1 &&
                                                                  values.length >
                                                                      1
                                                                ? [-1]
                                                                : values.filter(
                                                                      (val) =>
                                                                          val !==
                                                                              0 &&
                                                                          val !==
                                                                              -1
                                                                  ),
                                                    },
                                                })
                                            );
                                        }}
                                        value={
                                            searchFilters?.audit_filter
                                                ?.auditors
                                        }
                                    >
                                        <span className={"marginB20"}>
                                            <Checkbox value={0}>All</Checkbox>
                                        </span>
                                        <span className={"marginB20"}>
                                            <Checkbox value={-1}>None</Checkbox>
                                        </span>
                                        {auditors.map((user) => {
                                            return (
                                                <span
                                                    key={user.id}
                                                    className={"marginB20"}
                                                >
                                                    <Checkbox value={user.id}>
                                                        {user.first_name}
                                                    </Checkbox>
                                                </span>
                                            );
                                        })}
                                    </Checkbox.Group>
                                </>
                            )}
                        </div>
                    </Panel>
                )}
                <Panel
                    header={"Audit Feedback Status"}
                    key="audit_feedback_status"
                    id="audit_feedback_status"
                >
                    <Select
                        placeholder={"Choose Feedback Status"}
                        onChange={(e) => {
                            dispatch(
                                setSearchFilters({
                                    audit_feedback_status: e,
                                    audit_filter: {
                                        audit_type:
                                            auditConfig.MANUAL_AUDIT_TYPE,
                                        auditors:
                                            searchFilters.audit_filter.auditors,
                                        manualAuditDateRange: [null, null],
                                    },
                                })
                            );
                        }}
                        name="audit_filter_status"
                        value={searchFilters.audit_feedback_status}
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        className={"custom__select filter__select"}
                        suffixIcon={
                            <Icon className="fas fa-chevron-down dove_gray_cl" />
                        }
                        dropdownClassName={"account_select_dropdown"}
                    >
                        <Option value={"acknowledge"}>Acknowledged</Option>
                        <Option value={"not_acknowledged"}>
                            Not Acknowledged
                        </Option>
                        <Option value={"dispute"}>Disputed</Option>
                    </Select>
                </Panel>
                <Panel header={config.CLIENT_LABEL} key="client" id="clients">
                    <DebounceSelect
                        value={searchFilters?.client}
                        placeholder={config.CLIENT_PLACEHOLDER}
                        fetchOptions={fetchClientList}
                        onChange={(client) => {
                            dispatch(setSearchFilters({ client }));
                        }}
                        optionFilterProp="children"
                        optionsArr={
                            props.salesTasks?.length
                                ? props.salesTasks.map((client) => ({
                                      label: client.name || client.company,
                                      value: client.id,
                                      id: client.id,
                                  }))
                                : []
                        }
                        nextLoading={salesTaskNextLoading}
                        loadMore={loadMore}
                        onClear={() => dispatch(getSalesTasks({}))}
                        NotFoundContent={NotFoundContent}
                        className={"custom__select filter__select"}
                        suffixIcon={
                            <Icon className="fas fa-chevron-down dove_gray_cl" />
                        }
                        dropdownClassName={"account_select_dropdown"}
                    />
                </Panel>
                <Panel header={"Lead Score"} key="lead_config" id="lead_config">
                    <Checkbox
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                            dispatch(
                                setSearchFilters({
                                    lead_config: {
                                        is_hot: e.target.checked,
                                        is_warm: false,
                                        is_cold: false,
                                    },
                                })
                            );
                        }}
                        checked={searchFilters.lead_config.is_hot}
                    >
                        Hot
                    </Checkbox>
                    <Checkbox
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                            dispatch(
                                setSearchFilters({
                                    lead_config: {
                                        is_hot: false,
                                        is_cold: false,
                                        is_warm: e.target.checked,
                                    },
                                })
                            );
                        }}
                        checked={searchFilters.lead_config.is_warm}
                    >
                        Warm
                    </Checkbox>
                    <Checkbox
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                            dispatch(
                                setSearchFilters({
                                    lead_config: {
                                        is_hot: false,
                                        is_warm: false,
                                        is_cold: e.target.checked,
                                    },
                                })
                            );
                        }}
                        checked={searchFilters.lead_config.is_cold}
                    >
                        Cold
                    </Checkbox>
                </Panel>
                <Panel
                    header={config.KEYWORDS_LABEL}
                    key="searchKeywords"
                    id="searchKeywords"
                >
                    <Select
                        dropdownStyle={{ display: "none" }}
                        name="keywords"
                        mode="tags"
                        className="custom__tags__select placeholder__none"
                        value={searchFilters.keywords}
                        placeholder={config.KEYWORDS_PLACEHOLDER}
                        onChange={(keywords) => {
                            dispatch(setSearchFilters({ keywords }));
                        }}
                        style={{
                            width: "100%",
                        }}
                    />
                    <div
                        className={"search-sidebar-advbtn uppercase"}
                        onClick={() => setShowAdvance((show) => !show)}
                    >
                        {showAdvance ? "Hide " : "Show "} {config.ADVANCEDLABEL}
                    </div>
                    <div
                        className={`advance-section ${
                            showAdvance ? "active" : ""
                        }`}
                    >
                        <div className="advance-section-row marginB20">
                            <div className="advance-section-row-label">
                                {config.PRESENTINCALL}
                            </div>

                            <Radio.Group
                                value={searchFilters.keyword_present_in_call}
                                onChange={({ target: { value } }) => {
                                    dispatch(
                                        setSearchFilters({
                                            keyword_present_in_call: value,
                                        })
                                    );
                                }}
                                className="marginR16"
                            >
                                <Radio value={true}>Yes</Radio>
                                <Radio className="marginL10" value={false}>
                                    No
                                </Radio>
                            </Radio.Group>
                        </div>
                        <div className="advance-section-row">
                            <div className="advance-section-row-label">
                                {config.SPEAKERLABEL}
                            </div>
                            <div className="ant-checkbox-group">
                                <Checkbox
                                    onChange={({ target: { checked } }) => {
                                        dispatch(
                                            setSearchFilters({
                                                keyword_said_by_rep: checked,
                                            })
                                        );
                                    }}
                                    checked={searchFilters.keyword_said_by_rep}
                                >
                                    {config.REPLABEL}
                                </Checkbox>

                                <Checkbox
                                    onChange={({ target: { checked } }) => {
                                        dispatch(
                                            setSearchFilters({
                                                keyword_said_by_others: checked,
                                            })
                                        );
                                    }}
                                    checked={
                                        searchFilters.keyword_said_by_others
                                    }
                                >
                                    {config.OTHERSLABEL}
                                </Checkbox>
                            </div>
                        </div>
                    </div>
                </Panel>

                <Panel
                    header={config.CALL_TAGS_LABEL}
                    key="filterTags"
                    id="filterTags"
                >
                    <Select
                        name="tags"
                        mode="multiple"
                        placeholder={config.CALL_TAGS_PLACEHOLDER}
                        onChange={(call_tags) => {
                            dispatch(
                                setSearchFilters({
                                    call_tags,
                                })
                            );
                        }}
                        value={searchFilters.call_tags}
                        filterOption={(input, option) =>
                            option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                        className="custom__tags__select placeholder__none"
                        suffixIcon={
                            <Icon className="fas fa-chevron-down dove_gray_cl" />
                        }
                        dropdownClassName={"account_select_dropdown"}
                        style={{
                            width: "100%",
                        }}
                    >
                        {props.allTags.map((tag) => (
                            <Option key={uid() + tag.id} value={tag.id}>
                                {tag.tag_name}
                            </Option>
                        ))}
                    </Select>
                </Panel>
                <Panel header="Call Type" key="callType" id="callType">
                    <Select
                        name="tags"
                        mode="multiple"
                        placeholder={config.CALL_TYPE_PLACEHOLDER}
                        onChange={(call_types) => {
                            dispatch(
                                setSearchFilters({
                                    call_types,
                                })
                            );
                        }}
                        value={searchFilters.call_types}
                        filterOption={(input, option) =>
                            option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                        className="custom__tags__select placeholder__none"
                        suffixIcon={
                            <Icon className="fas fa-chevron-down dove_gray_cl" />
                        }
                        dropdownClassName={"account_select_dropdown"}
                        style={{
                            width: "100%",
                        }}
                    >
                        {filterCallTypes.callTypes.map((e) => {
                            if (e.id)
                                return (
                                    <Option key={e.id} value={e.id}>
                                        {e.name}
                                    </Option>
                                );
                        })}
                    </Select>
                </Panel>
                <Panel header="Questions" key="questions" id="questions">
                    <div className={"filterinput columnfilter"}>
                        <Label label={config.QUESTIONSLABEL1} />
                        <Label
                            label={`${searchFilters.no_of_questions_by_rep[0]} - ${searchFilters.no_of_questions_by_rep[1]}`}
                            labelClass={"rangelabel"}
                        />
                    </div>
                    <Slider
                        range
                        onChange={(val) => {
                            dispatch(
                                setSearchFilters({
                                    no_of_questions_by_rep: val,
                                })
                            );
                        }}
                        value={searchFilters.no_of_questions_by_rep}
                    />

                    <div className={"filterinput columnfilter"}>
                        <Label label={config.QUESTIONSLABEL2} />
                        <Label
                            label={`${searchFilters.no_of_questions_by_others[0]} - ${searchFilters.no_of_questions_by_others[1]}`}
                            labelClass={"rangelabel"}
                        />
                    </div>
                    <Slider
                        range
                        onChange={(val) => {
                            dispatch(
                                setSearchFilters({
                                    no_of_questions_by_others: val,
                                })
                            );
                        }}
                        value={searchFilters.no_of_questions_by_others}
                    />
                </Panel>
                <Panel header="Topics" key="topics" id="topics">
                    <Select
                        placeholder="Select a topic"
                        onChange={(topic) => {
                            dispatch(
                                setSearchFilters({
                                    topic,
                                })
                            );
                        }}
                        name="topics"
                        value={searchFilters.topic}
                        allowClear
                        className={"custom__select filter__select"}
                        suffixIcon={
                            <Icon className="fas fa-chevron-down dove_gray_cl" />
                        }
                        dropdownClassName={"account_select_dropdown"}
                    >
                        {props.allTopics.map((topic) => (
                            <Option key={topic.id} value={topic.id}>
                                {topic.name}
                            </Option>
                        ))}
                    </Select>
                    <div
                        className={"search-sidebar-topics"}
                        title={config.TOPICPRESENTINCALLLABEL}
                    >
                        <Label label={config.TOPICPRESENTINCALLLABEL} />
                        <Radio.Group
                            value={searchFilters.topic_in_call}
                            onChange={({ target: { value } }) => {
                                dispatch(
                                    setSearchFilters({
                                        topic_in_call: value,
                                    })
                                );
                            }}
                        >
                            <Radio value={true}>Yes</Radio>
                            <Radio value={false}>No</Radio>
                        </Radio.Group>
                    </div>
                </Panel>
                <Panel
                    header="Conversation Skills"
                    key="interactivity"
                    id="interactivity"
                >
                    {Object.keys(searchFilters.interactivity).map((key) => {
                        // console.log(key)
                        return config?.INTERACTIVITY_LABELS[key]?.label ? (
                            <React.Fragment key={key}>
                                <div className={"filterinput columnfilter"}>
                                    <Label
                                        label={
                                            config.INTERACTIVITY_LABELS[key]
                                                .label
                                        }
                                    />
                                    <Label
                                        label={`${
                                            searchFilters.interactivity[key][0]
                                        } ${
                                            key === "interactivity"
                                                ? "to"
                                                : "--"
                                        } ${
                                            searchFilters.interactivity[
                                                key
                                            ][1] +
                                            config.INTERACTIVITY_LABELS[key]
                                                .unit
                                        }`}
                                        labelClass={"rangelabel"}
                                    />
                                </div>
                                <Slider
                                    range
                                    onChange={(val) => {
                                        const obj = {};
                                        obj[key] = val;
                                        dispatch(
                                            setSearchFilters({
                                                interactivity: {
                                                    ...searchFilters.interactivity,
                                                    ...obj,
                                                },
                                            })
                                        );
                                    }}
                                    value={searchFilters.interactivity[key]}
                                    min={
                                        config.FIELDS_INIT.interactivityMaxVal[
                                            key
                                        ][0]
                                    }
                                    max={
                                        config.FIELDS_INIT.interactivityMaxVal[
                                            key
                                        ][1]
                                    }
                                />
                            </React.Fragment>
                        ) : null;
                    })}

                    <div>
                        <div className="font14 bold600">INTERRUPTION COUNT</div>{" "}
                        <div className="flex marginTB16">
                            <div className="flex1 paddingR8">
                                <InputNumber
                                    className="input__filter marginR8"
                                    placeholder="Enter Min interruption count"
                                    value={searchFilters.min_interruption_count}
                                    onChange={(e) => {
                                        dispatch(
                                            setSearchFilters({
                                                min_interruption_count: e,
                                            })
                                        );
                                    }}
                                    min={0}
                                    max={
                                        !searchFilters.max_interruption_count
                                            ? typeof searchFilters.max_interruption_count ===
                                              "number"
                                                ? searchFilters.max_interruption_count
                                                : Number.MAX_SAFE_INTEGER
                                            : searchFilters.max_interruption_count
                                    }
                                />
                            </div>
                            <div className="flex1 paddingL8">
                                <InputNumber
                                    className="input__filter"
                                    placeholder="Enter Max Interruption count"
                                    value={searchFilters.max_interruption_count}
                                    onChange={(e) => {
                                        dispatch(
                                            setSearchFilters({
                                                max_interruption_count: e,
                                            })
                                        );
                                    }}
                                    min={
                                        searchFilters.min_interruption_count ||
                                        0
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="font14 bold600">PATIENCE</div>{" "}
                        <div className="flex marginTB16">
                            <div className="flex1 paddingR8">
                                <InputNumber
                                    className="input__filter marginR8"
                                    placeholder="Min patience (in sec)"
                                    value={searchFilters.min_patience}
                                    onChange={(e) => {
                                        dispatch(
                                            setSearchFilters({
                                                min_patience: e,
                                            })
                                        );
                                    }}
                                    min={0}
                                    max={
                                        !searchFilters.max_patience
                                            ? typeof searchFilters.max_patience ===
                                              "number"
                                                ? searchFilters.max_patience
                                                : Number.MAX_SAFE_INTEGER
                                            : searchFilters.max_patience
                                    }
                                />
                            </div>
                            <div className="flex1 paddingL8">
                                <InputNumber
                                    className="input__filter"
                                    placeholder="Max patience (in sec)"
                                    value={searchFilters.max_patience}
                                    onChange={(e) => {
                                        dispatch(
                                            setSearchFilters({
                                                max_patience: e,
                                            })
                                        );
                                    }}
                                    min={searchFilters.min_patience || 0}
                                    max={100}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="font14 bold600">TALKTIME</div>{" "}
                        <div className="flex marginTB16">
                            <div className="flex1 paddingR8">
                                <InputNumber
                                    className="input__filter marginR8"
                                    placeholder="Min Talktime (in sec)"
                                    value={searchFilters.min_talktime}
                                    onChange={(e) => {
                                        dispatch(
                                            setSearchFilters({
                                                min_talktime:
                                                    typeof e === "number"
                                                        ? Number(e)
                                                        : e,
                                            })
                                        );
                                    }}
                                    min={0}
                                    max={
                                        !searchFilters.max_talktime
                                            ? typeof searchFilters.max_talktime ===
                                              "number"
                                                ? searchFilters.max_talktime
                                                : Number.MAX_SAFE_INTEGER
                                            : searchFilters.max_talktime
                                    }
                                />
                            </div>
                            <div className="flex1 paddingL8">
                                <InputNumber
                                    className="input__filter"
                                    placeholder="Max Talktime (in sec)"
                                    value={searchFilters.max_talktime}
                                    onChange={(e) => {
                                        dispatch(
                                            setSearchFilters({
                                                max_talktime:
                                                    typeof e === "number"
                                                        ? Number(e)
                                                        : e,
                                            })
                                        );
                                    }}
                                    min={searchFilters.min_talktime || 0}
                                />
                            </div>
                        </div>
                    </div>
                </Panel>
                <Panel
                    header="Call Recording Medium"
                    key="conferenceMedium"
                    id="conferenceMedium"
                >
                    <Select
                        placeholder={config.CONFERENCE_PLACEHOLDER}
                        onChange={(recording_medium) => {
                            dispatch(
                                setSearchFilters({
                                    recording_medium,
                                })
                            );
                        }}
                        name="conferenceMedium"
                        value={searchFilters.recording_medium}
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        className={"custom__select filter__select"}
                        suffixIcon={
                            <Icon className="fas fa-chevron-down dove_gray_cl" />
                        }
                        dropdownClassName={"account_select_dropdown"}
                    >
                        {confTools.map((type) => (
                            <Option key={type} value={type}>
                                {type}
                            </Option>
                        ))}
                    </Select>
                </Panel>

                <Panel
                    header={"Status/Stage"}
                    key="status/stage"
                    id="status/stage"
                >
                    <Select
                        value={searchFilters.stage}
                        onChange={(stage) => {
                            dispatch(
                                setSearchFilters({
                                    stage,
                                })
                            );
                        }}
                        optionFilterProp="children"
                        className="custom__select filter__select"
                        suffixIcon={
                            <Icon className="fas fa-chevron-down dove_gray_cl" />
                        }
                        dropdownClassName={"account_select_dropdown"}
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

                <Panel
                    header="Processing Status"
                    key="processingStatus"
                    id="processingStatus"
                >
                    <Select
                        placeholder={config.PROCESSING_STATUS_LABEL}
                        name="processingStatus"
                        value={searchFilters.processing_status}
                        onChange={(processing_status) => {
                            dispatch(
                                setSearchFilters({
                                    processing_status,
                                })
                            );
                        }}
                        className={"custom__select filter__select"}
                        suffixIcon={
                            <Icon className="fas fa-chevron-down dove_gray_cl" />
                        }
                        dropdownClassName={"account_select_dropdown"}
                    >
                        {config.PROCESSING_STATUS_FIELDS.map(
                            ({ name, value }, idx) => (
                                <Option key={idx} value={value}>
                                    {name}
                                </Option>
                            )
                        )}

                        {versionData?.domain_type === "b2c" ? (
                            <Option value={"no_recording"}>NO RECORDING</Option>
                        ) : (
                            <></>
                        )}
                    </Select>
                </Panel>
            </Collapse>
        </>
    );
}
