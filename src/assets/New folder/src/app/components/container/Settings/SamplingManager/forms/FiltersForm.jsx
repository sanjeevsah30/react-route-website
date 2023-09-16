import * as callApis from "@apis/calls/index";
import * as caApi from "@apis/call_audit";
import auditConfig from "@constants/Audit/index";
import searchConfig from "@constants/Search/index";
import { Label } from "@reusables";
import { getLocaleDate, getName } from "@tools/helpers";
import {
    Button,
    Checkbox,
    Collapse,
    DatePicker,
    Divider,
    Form,
    InputNumber,
    Popover,
    Radio,
    Row,
    Select,
    Skeleton,
    Slider,
} from "antd";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getSalesTasks,
    openNotification,
    storeSalesTasks,
} from "../../../../../../store/common/actions";
import apiErrors from "../../../../../ApiUtils/common/errors";
import ChevronUpSvg from "../../../../../static/svg/ChevronUpSvg";
import MeetingsSvg from "../../../../../static/svg/sidebar/MeetingsSvg";
import Icon from "../../../../presentational/reusables/Icon";
import { CustomMultipleSelect } from "../../../../Resuable/index";
import CustomTreeMultipleSelect from "../../../../Resuable/Select/CustomTreeMultipleSelect";
import {
    RenderDateOptions,
    RenderDurationOptions,
} from "../../../../Resuable/Select/index";
import DebounceSelect from "../../../../Search/DebounceSelect";
import "../sampling_manager.style.scss";

const { Panel } = Collapse;
const { BOOLEAN_TYPE, RATING_TYPE, CUSTOM_TYPE } = auditConfig;
const conversationLabelsInput = new Set([
    "patience",
    "interruption_count",
    "talktime",
]);
const conversationLabels = {
    patience: "Patience (in seconds)",
    interruption_count: "Interruption count",
    talktime: "Talktime (in seconds)",
};

const FiltersForm = ({ context }) => {
    const {
        search: { confTools },
        accounts: {
            filters: { stage },
        },
        common: {
            filterAuditTemplates: { templates },
            call_types,
            filterCallDuration,
            filterDates,
            salesTasks,
            salesTaskNextLoading,
            nextSalesTaskUrl,
            domain,
            topics,
            versionData,
        },
    } = useSelector((state) => state);
    const reduxDispatch = useDispatch();

    const { dispatch, ...state } = useContext(context);

    const [advancedOptionsVisible, setAdvanedOptionsVisible] = useState(false);
    const [datePopupVisible, setDatePopupVisible] = useState(false);
    const [durationPopupVisible, setDurationPopupVisible] = useState(false);
    const [repJoinDatePopupVisible, setRepJoinDatePopupVisible] =
        useState(false);
    const [questionsLoading, setQuestionsLoading] = useState(false);

    useEffect(() => {
        if (state.activeTemplateKey) {
            setQuestionsLoading(true);
            caApi
                .getSearchAuditTemplate(domain, state.activeTemplateKey)
                .then((res) => {
                    if (res.status === apiErrors.AXIOSERRORSTATUS) {
                        openNotification("error", "Error", res.message);
                    } else {
                        if (res.template && res.categories) {
                            let questions = [];
                            const { categories } = res;
                            for (let i = 0; i < categories.length; i++) {
                                for (
                                    let j = 0;
                                    j < categories[i].questions.length;
                                    j++
                                ) {
                                    questions.push(categories[i].questions[j]);
                                }
                            }

                            const filters = [
                                // {
                                //     question_text: 'Call Score',
                                //     id: 0,
                                //     question_type: 'yes_no',
                                // },
                                ...questions.map((question) => ({
                                    ...question,
                                })),
                            ];

                            dispatch({
                                type: "SET_QUESTIONS",
                                payload: filters,
                            });
                        }
                    }
                    setQuestionsLoading(false);
                });
            // });
        } else {
            dispatch({
                type: "SET_QUESTIONS",
                payload: [],
            });
        }
    }, [state.activeTemplateKey]);

    async function fetchClientList(query) {
        return callApis.getSalesTask(domain, query).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                reduxDispatch(storeSalesTasks(res));
                return res.results.map((client) => ({
                    label: client.name || client.company,
                    value: client.id,
                }));
            }
        });
    }

    const handleCheck = (params) => {
        const { id, data, checked, isChecked } = params;

        const obj = { ...state.activeQuestions };

        if (isChecked) {
            obj[id] = {
                ...data,
                checked,
            };
        } else {
            delete obj[id];
        }

        dispatch({ type: "SET_ACTIVE_QUESTIONS", payload: obj });
    };

    return (
        <Form layout="vertical" requiredMark={false} className="filters_form">
            <Form.Item label="Teams">
                <CustomTreeMultipleSelect
                    data={state.teams}
                    value={state.selectedTeams?.map((id) => id)}
                    onChange={(values) => {
                        dispatch({
                            type: "SET_SELECTED_TEAMS",
                            payload: [...values],
                        });
                    }}
                    placeholder="Select Teams"
                    select_placeholder="Select Teams"
                    style={{
                        width: "100%",
                        height: "auto",
                        padding: "0",
                    }}
                    className=" multiple__select"
                    fieldNames={{
                        label: "name",
                        value: "id",
                        children: "subteams",
                    }}
                    option_name="name"
                    type="team"
                    treeNodeFilterProp="name"
                    allowClear
                />
            </Form.Item>
            <Form.Item label="Reps">
                <CustomTreeMultipleSelect
                    data={state?.filterReps?.map((rep) => {
                        return { id: rep.id, name: getName(rep) };
                    })}
                    value={state?.selectedReps?.map((id) => id)}
                    onChange={(values) => {
                        dispatch({
                            type: "SET_SELECTED_REPS",
                            payload: [...values],
                        });
                    }}
                    placeholder="Select Reps"
                    select_placeholder="Select Reps"
                    style={{
                        width: "100%",
                        height: "auto",
                        padding: "0",
                    }}
                    className=" multiple__select"
                    fieldNames={{
                        label: "name",
                        value: "id",
                    }}
                    option_name="name"
                    // type="team"
                    treeNodeFilterProp="name"
                    allowClear
                />
            </Form.Item>
            <Row className="form_row">
                <Form.Item label="Duration">
                    <Popover
                        placement="bottom"
                        overlayClassName="duration_selector_popover"
                        title={
                            <div className="paddingTB10 paddingLR6 dark_charcoal_cl flex alignCenter">
                                <MeetingsSvg
                                    style={{
                                        transform: "scasle(0.8)",
                                    }}
                                />
                                <span className="font16 marginL16 bold600 ">
                                    Duration Range
                                </span>
                            </div>
                        }
                        content={
                            <RenderDurationOptions
                                durationOptions={
                                    state.durationOptions ??
                                    filterCallDuration.options
                                }
                                activeKey={
                                    state.activeDurationKey ??
                                    filterCallDuration.active
                                }
                                setDuration={(payload) => {
                                    dispatch({
                                        type: "SET_DURATION",
                                        payload,
                                    });
                                }}
                                closePopover={() => {
                                    setDurationPopupVisible(false);
                                }}
                            />
                        }
                        trigger="click"
                        open={durationPopupVisible}
                        onOpenChange={(open) => {
                            setDurationPopupVisible(open);
                        }}
                    >
                        <Select
                            value={
                                state.durationOptions?.[state.activeDurationKey]
                                    ?.text
                            }
                            popupClassName={"hide_dropdown"}
                            suffixIcon={
                                <Icon className="fas fa-chevron-down dove_gray_cl" />
                            }
                            placeholder="Select Duration"
                            onClear={() => {
                                dispatch({
                                    type: "SET_DURATION",
                                    payload: null,
                                });
                            }}
                            allowClear
                        >
                            {" "}
                        </Select>
                    </Popover>
                </Form.Item>
                <Form.Item label="Meeting Date Range">
                    <Popover
                        placement="bottomRight"
                        overlayClassName="date_selector_popover"
                        content={
                            <RenderDateOptions
                                dateOptions={
                                    state.dateOptions || filterDates.dates
                                }
                                activeKey={state.activeDateRangeKey}
                                setDateRange={(payload) => {
                                    const { isCustom, isBefore, date } =
                                        payload;
                                    if (isCustom) {
                                        dispatch({
                                            type: "SET_CUSTOM_RANGE",
                                            payload: date,
                                        });
                                        setDatePopupVisible(false);
                                        return dispatch({
                                            type: "SET_CUSTOM_DATE_LABEL",
                                            payload: `Custom (${getLocaleDate(
                                                date[0]
                                            )} - ${getLocaleDate(date[1])})`,
                                        });
                                    } else if (isBefore !== undefined) {
                                        const key = `${
                                            isBefore ? "before" : "after"
                                        } ${getLocaleDate(date)}`;

                                        const label = `${
                                            isBefore ? "Before" : "After"
                                        } ${getLocaleDate(date)}`;

                                        const dateRange = isBefore
                                            ? [null, date.toString() || null]
                                            : [date.toString() || null, null];
                                        setDatePopupVisible(false);
                                        return dispatch({
                                            type: "ADD_CUSTOM_RANGE",
                                            payload: {
                                                key,
                                                name: label,
                                                dateRange,
                                            },
                                        });
                                    }
                                    dispatch({
                                        type: "SET_DATES",
                                        payload,
                                    });
                                    setDatePopupVisible(false);
                                }}
                            />
                        }
                        open={datePopupVisible}
                        trigger="click"
                        onOpenChange={(open) => {
                            if (
                                state.auditType === "manual" &&
                                state.scheduling === "one_time"
                            ) {
                                setDatePopupVisible(open);
                            }
                        }}
                    >
                        <Select
                            value={
                                state?.dateOptions[state.activeDateRangeKey]
                                    ?.name
                            }
                            popupClassName={"hide_dropdown"}
                            suffixIcon={
                                <Icon className="fas fa-chevron-down dove_gray_cl" />
                            }
                            disabled={
                                !(
                                    state.auditType === "manual" &&
                                    state.scheduling === "one_time"
                                )
                            }
                            placeholder="Select Dates"
                            allowClear
                            onClear={() => {
                                dispatch({
                                    type: "SET_DATES",
                                    payload: null,
                                });
                            }}
                        ></Select>
                    </Popover>
                </Form.Item>
                <Form.Item label=" Rep Joining Date">
                    <Popover
                        placement="bottomRight"
                        overlayClassName="date_selector_popover"
                        content={
                            <RenderDateOptions
                                isJoinedDatefilter={repJoinDatePopupVisible}
                                dateOptions={
                                    state.dateOptions || filterDates.dates
                                }
                                activeKey={state.activeJoinDateRangeKey}
                                setDateRange={(payload) => {
                                    const { isCustom, isBefore, date } =
                                        payload;
                                    if (isCustom) {
                                        dispatch({
                                            type: "SET_CUSTOM_JOIN_RANGE",
                                            payload: date,
                                        });
                                        setRepJoinDatePopupVisible(false);
                                        return dispatch({
                                            type: "SET_CUSTOM_JOIN_DATE_LABEL",
                                            payload: `Custom (${getLocaleDate(
                                                date[0]
                                            )} - ${getLocaleDate(date[1])})`,
                                        });
                                    } else if (isBefore !== undefined) {
                                        const key = `${
                                            isBefore ? "before" : "after"
                                        } ${getLocaleDate(date)}`;

                                        const label = `${
                                            isBefore ? "Before" : "After"
                                        } ${getLocaleDate(date)}`;

                                        const dateRange = isBefore
                                            ? [null, date.toString() || null]
                                            : [date.toString() || null, null];
                                        setRepJoinDatePopupVisible(false);
                                        return dispatch({
                                            type: "ADD_CUSTOM_JOIN_RANGE",
                                            payload: {
                                                key,
                                                name: label,
                                                dateRange,
                                            },
                                        });
                                    }
                                    dispatch({
                                        type: "SET_JOIN_DATES",
                                        payload,
                                    });
                                    setRepJoinDatePopupVisible(false);
                                }}
                            />
                        }
                        open={repJoinDatePopupVisible}
                        trigger="click"
                        onOpenChange={(open) => {
                            setRepJoinDatePopupVisible(open);
                        }}
                    >
                        <Select
                            value={
                                state?.dateOptions[state.activeJoinDateRangeKey]
                                    ?.name
                            }
                            popupClassName={"hide_dropdown"}
                            suffixIcon={
                                <Icon className="fas fa-chevron-down dove_gray_cl" />
                            }
                            // disabled={
                            //     state.auditType === "manual" &&
                            //     state.scheduling === "recurring"
                            // }
                            placeholder="Select Dates"
                            allowClear
                            onClear={() => {
                                dispatch({
                                    type: "SET_JOIN_DATES",
                                    payload: null,
                                });
                            }}
                        ></Select>
                    </Popover>
                </Form.Item>
            </Row>
            <Row className="form_row">
                <Form.Item label="Conversation Type">
                    <CustomTreeMultipleSelect
                        data={[
                            ...call_types.map((e) => ({
                                ...e,
                                name: e.type,
                            })),
                        ]}
                        value={state?.selectedCallTypes?.map((id) => id)}
                        onChange={(values) => {
                            dispatch({
                                type: "SET_CALL_TYPE",
                                payload: [...values],
                            });
                        }}
                        placeholder={"Select Conversation Type"}
                        select_placeholder={"Select Conversation Type"}
                        className=" multiple__select"
                        fieldNames={{
                            label: "name",
                            value: "id",
                        }}
                        option_name="name"
                        // type="team"
                        treeNodeFilterProp="name"
                        allowClear
                    />
                </Form.Item>
            </Row>

            <Form.Item label="Conversation Tags">
                <CustomTreeMultipleSelect
                    data={[
                        ...state.tags.map((e) => ({
                            ...e,
                            name: e.tag_name,
                        })),
                    ]}
                    value={state.selectedTags?.map((id) => id)}
                    onChange={(values) => {
                        dispatch({
                            type: "SET_SELECTED_TAGS",
                            payload: [...values],
                        });
                    }}
                    placeholder="Select Conversation Tags"
                    select_placeholder="Select Conversation Tags"
                    className=" multiple__select"
                    fieldNames={{
                        label: "name",
                        value: "id",
                    }}
                    option_name="name"
                    treeNodeFilterProp="name"
                    style={{
                        width: "100%",

                        height: "auto",
                        padding: "0",
                    }}
                />
            </Form.Item>
            <span
                className="advanced_options"
                onClick={() => setAdvanedOptionsVisible((prev) => !prev)}
            >
                Advanced Options
                {advancedOptionsVisible ? <ChevronUpSvg /> : null}
            </span>

            {advancedOptionsVisible && (
                <>
                    <Form.Item label="Advance Keyword Search">
                        <Select
                            mode="tags"
                            options={[]}
                            defaultValue={state.keywords}
                            values={state.keywords}
                            onChange={(values) => {
                                dispatch({
                                    type: "SET_KEYWORDS",
                                    payload: values,
                                });
                            }}
                            placeholder="Select Keywords"
                            select_placeholder="Select Keywords"
                            className=" multiple__select"
                            open={false}
                            allowClear
                        />
                    </Form.Item>
                    <Row className="form_row">
                        <Form.Item
                            label="Present in Call"
                            className="keyword_suboptions"
                        >
                            <Radio.Group
                                options={[
                                    { label: "Yes", value: true },
                                    { label: "No", value: false },
                                ]}
                                value={state.keywordPresent}
                                onChange={({ target: { value } }) => {
                                    dispatch({
                                        type: "SET_KEYWORD_PRESENT",
                                        payload: value,
                                    });
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Said By"
                            className="keyword_suboptions"
                        >
                            <Checkbox.Group
                                options={["Rep", "Others"]}
                                value={state.keywordSaidBy}
                                onChange={(checkedValues) => {
                                    dispatch({
                                        type: "SET_KEYWORD_SAIDBY",
                                        payload: checkedValues,
                                    });
                                }}
                            />
                        </Form.Item>
                    </Row>
                    <Row className="form_row">
                        <Form.Item label="Client Name">
                            <DebounceSelect
                                placeholder={"Select Client"}
                                fetchOptions={fetchClientList}
                                value={state.activeClientKey}
                                onChange={(value) => {
                                    dispatch({
                                        type: "SET_CLIENT",
                                        payload: value,
                                    });
                                }}
                                optionFilterProp="children"
                                optionsArr={
                                    salesTasks?.length
                                        ? salesTasks?.map((client) => ({
                                              label:
                                                  client.name || client.company,
                                              value: client.id,
                                              id: client.id,
                                          }))
                                        : []
                                }
                                nextLoading={salesTaskNextLoading}
                                loadMore={({ target }) => {
                                    if (
                                        nextSalesTaskUrl &&
                                        !salesTaskNextLoading &&
                                        target.scrollTop +
                                            target.offsetHeight ===
                                            target.scrollHeight
                                    ) {
                                        reduxDispatch(
                                            getSalesTasks({
                                                next_url: nextSalesTaskUrl,
                                            })
                                        );
                                    }
                                }}
                                onClear={() => reduxDispatch(getSalesTasks({}))}
                                NotFoundContent={"No Clients Found"}
                                className={"client__select"}
                                suffixIcon={
                                    <Icon className="fas fa-chevron-down dove_gray_cl" />
                                }
                                dropdownClassName={"account_select_dropdown"}
                            />
                        </Form.Item>
                        <Form.Item label="Conversation Recording Medium">
                            <Select
                                options={confTools?.map((tool) => {
                                    return {
                                        label: `${tool[0].toUpperCase()}${tool.substring(
                                            1
                                        )}`,
                                        value: tool,
                                    };
                                })}
                                value={state.activeRecMediumKey}
                                onChange={(value) => {
                                    dispatch({
                                        type: "SET_RECORDING_MEDIUM",
                                        payload: value,
                                    });
                                }}
                                placeholder={"Select Recording Medium"}
                                allowClear
                            />
                        </Form.Item>
                    </Row>
                    <Row className="form_row">
                        <Form.Item label="Status/Stage">
                            <Select
                                options={stage}
                                fieldNames={{ label: "stage", value: "id" }}
                                value={state.activeStageKey}
                                onChange={(value) => {
                                    dispatch({
                                        type: "SET_STAGE",
                                        payload: value,
                                    });
                                }}
                                placeholder={"Choose Status/Stage"}
                                allowClear
                            />
                        </Form.Item>
                        <Form.Item label="Processing Status">
                            <Select
                                options={searchConfig.PROCESSING_STATUS_FIELDS}
                                fieldNames={{ label: "name", value: "value" }}
                                value={state.activeProcStatusKey}
                                onChange={(value) => {
                                    dispatch({
                                        type: "SET_PROCESSING_STATUS",
                                        payload: value,
                                    });
                                }}
                                placeholder={"Choose Processing Status"}
                                allowClear
                            />
                        </Form.Item>
                    </Row>
                    <Row className="form_row">
                        <Form.Item label="Topics">
                            <Select
                                options={topics}
                                fieldNames={{ label: "name", value: "id" }}
                                value={state.activeTopicKey}
                                onChange={(value) => {
                                    dispatch({
                                        type: "SET_TOPIC",
                                        payload: value,
                                    });
                                }}
                                placeholder={"Choose Topic"}
                                allowClear
                            />
                        </Form.Item>
                        {versionData.has_chat ? (
                            <Form.Item label="Meeting Type">
                                <Select
                                    options={[
                                        { value: "call", label: "Call" },
                                        { value: "chat", label: "Chat" },
                                        { value: "email", label: "Email" },
                                    ]}
                                    value={state.meetingType}
                                    onChange={(value) => {
                                        dispatch({
                                            type: "SET_MEETING_TYPE",
                                            payload: value,
                                        });
                                    }}
                                    placeholder={"Choose Meeting Type"}
                                />
                            </Form.Item>
                        ) : null}
                    </Row>

                    <Row className="form_row">
                        <Form.Item label="Conversation Score">
                            <Collapse
                                ghost
                                expandIconPosition="end"
                                className="form_collapse"
                            >
                                <Panel
                                    header="Select Conversation Score"
                                    key="1"
                                >
                                    <Row className="template_row">
                                        <Select
                                            options={templates}
                                            fieldNames={{
                                                label: "name",
                                                value: "id",
                                            }}
                                            value={state.activeTemplateKey}
                                            onChange={(value) => {
                                                dispatch({
                                                    type: "SET_TEMPLATE",
                                                    payload: value,
                                                });
                                            }}
                                            placeholder="Select a Template"
                                            allowClear
                                        />
                                        <InputNumber
                                            placeholder="Min Score"
                                            value={state.minCallScore}
                                            onChange={(e) => {
                                                dispatch({
                                                    type: "SET_MIN_CALL_SCORE",
                                                    payload: e,
                                                });
                                            }}
                                            min={0}
                                            max={
                                                !state.maxCallScore
                                                    ? typeof state.maxCallScore ===
                                                      "number"
                                                        ? state.maxCallScore
                                                        : 100
                                                    : state.maxCallScore
                                            }
                                            disabled={!state.activeTemplateKey}
                                        />
                                        <InputNumber
                                            placeholder="Max Score"
                                            value={state.maxCallScore}
                                            onChange={(e) => {
                                                dispatch({
                                                    type: "SET_MAX_CALL_SCORE",
                                                    payload: e,
                                                });
                                            }}
                                            min={state.minCallScore || 0}
                                            max={100}
                                            disabled={!state.activeTemplateKey}
                                        />
                                    </Row>
                                    {questionsLoading ? (
                                        <span>
                                            <Skeleton paragraph={false} />
                                        </span>
                                    ) : state.questions.length ? (
                                        <Row className="question_row">
                                            <span className="question_row--title">
                                                Questions
                                            </span>
                                            <div className="question_row--container">
                                                {state.questions?.map(
                                                    (data, index) => {
                                                        const {
                                                            id,
                                                            question_text,
                                                            question_type,
                                                            settings,
                                                        } = data;
                                                        return (
                                                            <div
                                                                className="question_row--question"
                                                                key={id}
                                                            >
                                                                <span>
                                                                    {index + 1}
                                                                    {". "}
                                                                    {
                                                                        question_text
                                                                    }
                                                                </span>
                                                                <div className="paddingL16 paddingT8 paddingB24">
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
                                                                                ) => {
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
                                                                                    );
                                                                                }}
                                                                                checked={
                                                                                    state
                                                                                        ?.activeQuestions?.[
                                                                                        id
                                                                                    ]
                                                                                        ?.checked ===
                                                                                    1
                                                                                }
                                                                            >
                                                                                {index ===
                                                                                0
                                                                                    ? "Good Score"
                                                                                    : "Yes"}
                                                                            </Checkbox>
                                                                            <Checkbox
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
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
                                                                                    );
                                                                                }}
                                                                                checked={
                                                                                    state
                                                                                        ?.activeQuestions?.[
                                                                                        id
                                                                                    ]
                                                                                        ?.checked ===
                                                                                    0
                                                                                }
                                                                            >
                                                                                {index ===
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
                                                                                    state
                                                                                        ?.activeQuestions?.[
                                                                                        id
                                                                                    ]
                                                                                        ?.checked ===
                                                                                    -1
                                                                                }
                                                                            >
                                                                                {index ===
                                                                                0
                                                                                    ? "Need Attention"
                                                                                    : "Na"}
                                                                            </Checkbox>
                                                                        </div>
                                                                    ) : question_type ===
                                                                      CUSTOM_TYPE ? (
                                                                        <div>
                                                                            {settings?.custom?.map(
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
                                                                                            state
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
                                                                                                    state
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
                                                                                    state
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
                                                                                                    state
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
                                                                                    state
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
                                                                                                    state
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
                                                                                    state
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
                                                                                                    state
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
                                                                                    state
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
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </Row>
                                    ) : null}
                                </Panel>
                            </Collapse>
                        </Form.Item>
                    </Row>
                    <Row className="form_row">
                        <Form.Item label="Questions">
                            <Collapse
                                ghost
                                expandIconPosition="end"
                                className="form_collapse slider_option"
                            >
                                <Panel header="Select Questions" key="2">
                                    <div className="questions_slider">
                                        <div
                                            className={
                                                "filterinput columnfilter"
                                            }
                                        >
                                            <Label
                                                label={
                                                    searchConfig.QUESTIONSLABEL1
                                                }
                                            />
                                            <Label
                                                label={`${state.questionCountRep[0]} - ${state.questionCountRep[1]}`}
                                                labelClass={"rangelabel"}
                                            />
                                        </div>
                                        <Slider
                                            range
                                            onChange={(val) => {
                                                dispatch({
                                                    type: "SET_QUESTION_COUNT_REP",
                                                    payload: val,
                                                });
                                            }}
                                            value={state.questionCountRep}
                                        />
                                    </div>
                                    <Divider type="vertical" />
                                    <div className="questions_slider">
                                        <div
                                            className={
                                                "filterinput columnfilter"
                                            }
                                        >
                                            <Label
                                                label={
                                                    searchConfig.QUESTIONSLABEL2
                                                }
                                            />
                                            <Label
                                                label={`${state.questionCountOther[0]} - ${state.questionCountOther[1]}`}
                                                labelClass={"rangelabel"}
                                            />
                                        </div>
                                        <Slider
                                            range
                                            onChange={(val) => {
                                                dispatch({
                                                    type: "SET_QUESTION_COUNT_OTHER",
                                                    payload: val,
                                                });
                                            }}
                                            value={state.questionCountOther}
                                        />
                                    </div>
                                </Panel>
                            </Collapse>
                        </Form.Item>
                    </Row>
                    <Row className="form_row">
                        <Form.Item label="Conversation Skills">
                            <Collapse
                                ghost
                                expandIconPosition="end"
                                className="form_collapse slider_option"
                            >
                                <Panel
                                    header="Conversation Skills"
                                    key="interactivity"
                                    id="interactivity"
                                >
                                    {Object.keys(state.interactivity)?.map(
                                        (key, index) => {
                                            return (
                                                <>
                                                    {conversationLabelsInput.has(
                                                        key
                                                    ) ? (
                                                        <div
                                                            key={key}
                                                            className="questions_slider"
                                                        >
                                                            <div
                                                                className={
                                                                    "filterinput columnfilter"
                                                                }
                                                            >
                                                                <Label
                                                                    label={
                                                                        conversationLabels[
                                                                            key
                                                                        ]
                                                                    }
                                                                />
                                                                <div className="questions_input">
                                                                    <InputNumber
                                                                        placeholder="Min Value"
                                                                        value={
                                                                            state
                                                                                .interactivity?.[
                                                                                key
                                                                            ]?.[0]
                                                                        }
                                                                        onChange={(
                                                                            val
                                                                        ) => {
                                                                            const obj =
                                                                                {};
                                                                            obj[
                                                                                key
                                                                            ] =
                                                                                [
                                                                                    val,
                                                                                    state
                                                                                        .interactivity?.[
                                                                                        key
                                                                                    ]?.[1] ||
                                                                                        null,
                                                                                ];
                                                                            dispatch(
                                                                                {
                                                                                    type: "SET_INTERACTIVITY",
                                                                                    payload:
                                                                                        {
                                                                                            ...state.interactivity,
                                                                                            ...obj,
                                                                                        },
                                                                                }
                                                                            );
                                                                        }}
                                                                        min={0}
                                                                        max={
                                                                            !state
                                                                                .interactivity?.[
                                                                                key
                                                                            ]?.[1]
                                                                                ? typeof state
                                                                                      .interactivity?.[
                                                                                      key
                                                                                  ]?.[1] ===
                                                                                  "number"
                                                                                    ? state
                                                                                          .interactivity?.[
                                                                                          key
                                                                                      ]?.[1]
                                                                                    : 100
                                                                                : state
                                                                                      .interactivity?.[
                                                                                      key
                                                                                  ]?.[1]
                                                                        }
                                                                    />
                                                                    <InputNumber
                                                                        placeholder="Max Value"
                                                                        value={
                                                                            state
                                                                                .interactivity?.[
                                                                                key
                                                                            ]?.[1]
                                                                        }
                                                                        onChange={(
                                                                            val
                                                                        ) => {
                                                                            const obj =
                                                                                {};
                                                                            obj[
                                                                                key
                                                                            ] =
                                                                                [
                                                                                    state
                                                                                        .interactivity?.[
                                                                                        key
                                                                                    ]?.[0] ||
                                                                                        null,
                                                                                    val,
                                                                                ];
                                                                            dispatch(
                                                                                {
                                                                                    type: "SET_INTERACTIVITY",
                                                                                    payload:
                                                                                        {
                                                                                            ...state.interactivity,
                                                                                            ...obj,
                                                                                        },
                                                                                }
                                                                            );
                                                                        }}
                                                                        min={
                                                                            state
                                                                                .interactivity?.[
                                                                                key
                                                                            ]?.[0] ||
                                                                            0
                                                                        }
                                                                        max={
                                                                            100
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            key={key}
                                                            className="questions_slider"
                                                        >
                                                            <div
                                                                className={
                                                                    "filterinput columnfilter"
                                                                }
                                                            >
                                                                <Label
                                                                    label={
                                                                        searchConfig
                                                                            .INTERACTIVITY_LABELS[
                                                                            key
                                                                        ].label
                                                                    }
                                                                />
                                                                <Label
                                                                    label={`${
                                                                        state
                                                                            .interactivity[
                                                                            key
                                                                        ][0]
                                                                    } ${
                                                                        key ===
                                                                        "interactivity"
                                                                            ? "to"
                                                                            : "--"
                                                                    } ${
                                                                        state
                                                                            .interactivity[
                                                                            key
                                                                        ][1] +
                                                                        searchConfig
                                                                            .INTERACTIVITY_LABELS[
                                                                            key
                                                                        ].unit
                                                                    }`}
                                                                    labelClass={
                                                                        "rangelabel"
                                                                    }
                                                                />
                                                            </div>
                                                            <Slider
                                                                range
                                                                onChange={(
                                                                    val
                                                                ) => {
                                                                    const obj =
                                                                        {};
                                                                    obj[key] =
                                                                        val;
                                                                    dispatch({
                                                                        type: "SET_INTERACTIVITY",
                                                                        payload:
                                                                            {
                                                                                ...state.interactivity,
                                                                                ...obj,
                                                                            },
                                                                    });
                                                                }}
                                                                value={
                                                                    state
                                                                        .interactivity[
                                                                        key
                                                                    ]
                                                                }
                                                                min={
                                                                    searchConfig
                                                                        .FIELDS_INIT
                                                                        .interactivityMaxVal[
                                                                        key
                                                                    ][0]
                                                                }
                                                                max={
                                                                    searchConfig
                                                                        .FIELDS_INIT
                                                                        .interactivityMaxVal[
                                                                        key
                                                                    ][1]
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                    {index % 2 === 0 ? (
                                                        <Divider type="vertical" />
                                                    ) : null}
                                                </>
                                            );
                                        }
                                    )}
                                </Panel>
                            </Collapse>
                        </Form.Item>
                    </Row>
                </>
            )}
        </Form>
    );
};

export default FiltersForm;
