import auditConfig from "@constants/Audit/index";
import Icon from "@presentational/reusables/Icon";
import NoData from "@presentational/reusables/NoData";
import Spinner from "@presentational/reusables/Spinner";
import {
    createGlobalExpressionRequest,
    deleteGlobalExpressionRequest,
    deleteQuestionFiltersRequest,
    fetchCategoryQuestionsForSettingsRequest,
    getGlobalExpressionRequest,
    getWordCloudForInternalDashboard,
    runCommand,
    storeFilterSettingsAuditTemplate,
    updateGlobalExpressionRequest,
} from "@store/call_audit/actions";

import { getNextCalls, searchCalls } from "@store/search/actions";
import {
    Col,
    Collapse,
    Row,
    Button,
    Input,
    Drawer,
    Skeleton,
    Popconfirm,
    Modal,
    Select,
    InputNumber,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import DebounceTextArea from "app/components/IndividualCall/DebounceTextArea";
import useDebounce from "hooks/useDebounce";
import useResizeWidth from "hooks/useResizeWidth";
import TemplateLayout from "../Layout/TemplateLayout";
import { FilterSettingsContext } from "./AuditFiltersSettings";
import QuestionsList from "./QuestionsList";
import ReactVirtualCard from "./ReactVirtualCard";

import { Popover } from "antd";
import { PlayCircleOutlined, CloseOutlined } from "@ant-design/icons";
import MonologuePlayer from "@presentational/reusables/MonologuePlayer";
import {
    getDateTime,
    getDuration,
    goToTranscriptTab,
    secondsToTime,
} from "@tools/helpers";
import ReactVirtualSnippets from "app/components/CustomerIntelligence/SnippetsDrawer/ReactVirtualSnippets";

const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;

function CategoryList({ handleClick, getQuestionSubFilters, question }) {
    const dispatch = useDispatch();
    const {
        callAudit: {
            filtersSettings: { template, categories },
            globalExpressions,
            loading,
            runCommandLoading,
            word_cloud,
        },
        common: { domain },
        search: { defaultSearchFilters, calls, next_url, fetchingCalls },
    } = useSelector((state) => state);

    const fetchQuestions = ([id]) => {
        if (id) {
            dispatch(fetchCategoryQuestionsForSettingsRequest(id));
        }
    };

    const { setErrorCmdVisible, template_id } = useContext(
        FilterSettingsContext
    );

    const handleDelete = (id) => {
        dispatch(deleteGlobalExpressionRequest(id));
    };

    const history = useHistory();
    //Create expression drawer
    const [visible, setVisible] = useState(false);
    const [wcloudVisible, setwcloudVisible] = useState(false);
    //View expression drawer
    const [viewVisible, setViewVisible] = useState(false);
    const [cmdVisible, setCmdVisible] = useState(false);
    const [wcVisible, setWcVisible] = useState(false);
    const [variableName, setVariableName] = useState("");
    const [pyCode, setPyCode] = useState("");
    const [width] = useResizeWidth(500);

    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        setQuestions(
            categories
                .map(({ questions }) => {
                    return questions;
                })
                .reduce((acc, curVal) => {
                    return acc.concat(curVal);
                }, [])
        );
    }, [categories]);

    const handleCreate = () => {
        if (template_id) {
            dispatch(
                createGlobalExpressionRequest({
                    template: template_id,
                    variable_name: variableName,
                    py_code: pyCode,
                })
            );
            setVisible(false);
            setVariableName("");
            setPyCode("");
        }
    };

    useEffect(() => {
        if (viewVisible && !globalExpressions?.results)
            dispatch(getGlobalExpressionRequest(template_id));
    }, [viewVisible]);

    const [api, setApi] = useState(`/audit/template/run`);
    const [wordcloudApi, wordcloudSetapi] = useState(`/audit/wordcloud/`);

    const [st, setSt] = useState("");
    const [et, setEt] = useState("");
    const [type, setType] = useState(null);
    const [gb, setGb] = useState("team");
    const [level, setLevel] = useState("account");
    const [qid, setQid] = useState(null);
    const [ngram, setNgram] = useState(1);
    const [displayLabel, setDisplayLabel] = useState([]);
    const [label, setLabel] = useState("");

    useEffect(() => {}, []);

    useEffect(() => {
        let query = [];

        type && query.push(`type=${type}`);

        gb && query.push(`group_by=${gb}`);

        level && query.push(`level=${level}`);

        st && query.push(`start_time=${st}`);

        et && query.push(`end_time=${et}`);

        query.length && setApi(`/audit/template/run?${query.join("&")}`);
    }, [st, et, type, gb, level]);

    useEffect(() => {
        let wc_query = [];

        qid && wc_query.push(`question_id=${qid}`);

        label && wc_query.push(`label=${label}`);

        ngram && wc_query.push(`ngram=${ngram}`);

        st && wc_query.push(`start_time=${st}`);

        et && wc_query.push(`end_time=${et}`);

        wc_query.length &&
            wordcloudSetapi(`/audit/wordcloud/?${wc_query.join("&")}`);
    }, [st, et, ngram, label, qid]);

    useEffect(() => {}, [wcVisible]);

    const wc_reset = () => {
        setSt("");
        setEt("");
        setQid("");
        setNgram(1);
        setLabel("");
    };

    const reset = () => {
        setSt("");
        setEt("");
        setType(null);
        setGb("team");
        setLevel("account");
    };

    const [wordToSearch, setWordToSearch] = useState("");

    const handleSearch = ({ word, fetchNext = false }) => {
        const question = questions.find(({ id }) => id === qid);

        const checked = displayLabel.find(({ name }) => name === label).id;
        const obj = {};

        obj[qid] = {
            ...question,
            checked,
        };

        let data = {
            searchKeywords: {
                keywords: [word],
                isInCall: true,
                saidByOwner: true,
                saidByClient: true,
            },
            activeReps: 0,
            activeTeam: 0,
            callDuration: [null, null],

            activeDateRange:
                st && et
                    ? [new Date(st), new Date(et)]
                    : st
                    ? [new Date(st), null]
                    : et
                    ? [null, new Date(et)]
                    : [null, null],

            processingStatus: null,
            auditQuestions: obj,
            template: template_id,

            filterTags: defaultSearchFilters?.call_tags,
            questions: {
                byOwner: defaultSearchFilters?.no_of_questions_by_rep,
                byClient: defaultSearchFilters?.no_of_questions_by_others,
            },
            topics: {
                topic: defaultSearchFilters?.topic,
                inCall: defaultSearchFilters?.topic_in_call,
            },
            interactivity: defaultSearchFilters?.interactivity,
            callTypes: defaultSearchFilters?.call_types,

            conferenceMedium: defaultSearchFilters?.recording_medium,

            audit_filter: defaultSearchFilters.audit_filter,
            min_aiscore: defaultSearchFilters.min_aiscore,
            max_aiscore: defaultSearchFilters.max_aiscore,
        };

        setShowSnippets(true);
        fetchNext || setWordToSearch(word);
        fetchNext
            ? dispatch(getNextCalls({}, data, true))
            : dispatch(searchCalls({}, data, true));
    };

    const searchNext = () => {
        handleSearch({ word: wordToSearch, fetchNext: true });
    };

    const deleteQuestionFilter = (questionId, categoryId) => {
        const newCategories = [...categories];
        const currentCategoryIndex = newCategories.findIndex(
            (category) => category.id === categoryId
        );
        const newQuestions = [...newCategories[currentCategoryIndex].questions];
        const index = newQuestions.findIndex(
            (question) => question.id === questionId
        );
        const newData = {
            ...newQuestions[index],
            has_filters: false,
        };
        newQuestions[index] = newData;
        newCategories[currentCategoryIndex] = {
            ...newCategories[currentCategoryIndex],
            questions: newQuestions,
        };
        dispatch(
            storeFilterSettingsAuditTemplate({ categories: newCategories })
        );
        getQuestionSubFilters(questionId, handleFilterDelete);
    };

    const handleFilterDelete = (filterId) => {
        dispatch(deleteQuestionFiltersRequest(filterId));
    };

    const {
        BOOLEAN_TYPE,
        RATING_TYPE,

        CUSTOM_TYPE,
    } = auditConfig;

    const [showSnippets, setShowSnippets] = useState(false);

    return (
        <TemplateLayout
            name={template?.name || "Template Does Not Exist"}
            goBack={() => history.push("/settings/audit_manager/")}
            headerChildren={
                template?.id ? (
                    <>
                        <Button
                            type="primary"
                            onClick={() => setCmdVisible(true)}
                        >
                            Commands
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => setWcVisible(true)}
                        >
                            Wordcloud
                        </Button>
                        <Button
                            type="danger"
                            onClick={() => setErrorCmdVisible(true)}
                        >
                            Error Check
                        </Button>
                        <Button type="primary" onClick={() => setVisible(true)}>
                            Create Global Expression
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => setViewVisible(true)}
                        >
                            View Global Expressions
                        </Button>
                    </>
                ) : (
                    <></>
                )
            }
        >
            <Row
                className="marginTB20"
                gutter={[0, 24]}
                data-testid="component-category-list"
            >
                <Col
                    span={24}
                    className=" gutter-row template__list__card questions_header auditColorGrey"
                >
                    <Row className="width100p" gutter={[0, 24]}>
                        <Col lg={16} md={24} sm={24} xs={24}>
                            <div>Categories</div>
                        </Col>
                    </Row>
                </Col>
                {categories.map((category) => (
                    <CategoryCard
                        {...category}
                        key={category.id}
                        deleteQuestionFilter={deleteQuestionFilter}
                        fetchQuestions={fetchQuestions}
                        handleClick={handleClick}
                    />
                ))}
            </Row>
            {!categories?.length ? (
                <div className="marginT10">
                    <NoData description={"No Categories Available"} />
                </div>
            ) : (
                <></>
            )}
            <Drawer
                title={"CREATE GLOBAL EXPRESSION"}
                placement="right"
                closable={true}
                onClose={() => {
                    setVisible(false);
                    setVariableName("");
                    setPyCode("");
                }}
                visible={visible}
                width={500}
                footer={
                    <div className="paddingTB10 flex row-reverse">
                        <Button type="primary" onClick={handleCreate}>
                            Create
                        </Button>
                    </div>
                }
            >
                <div className="marginB30">
                    <div className="auditColorGrey marginB8">VARIABLE NAME</div>
                    <Input
                        placeholder={auditConfig.VARIABLE_NAME_PLACEHOLDER}
                        className="audit__input__bg"
                        value={variableName}
                        onChange={(e) => setVariableName(e.target.value)}
                    />
                </div>
                <div>
                    <div className="auditColorGrey marginB8">PYTHON CODE</div>
                    <TextArea
                        className="audit__input__bg resize_vertical"
                        placeholder={auditConfig.PYTHON_CODE_PLACEHOLDER}
                        autoSize={{ minRows: 6 }}
                        value={pyCode}
                        onChange={(e) => setPyCode(e.target.value)}
                    />
                </div>
            </Drawer>
            <Drawer
                title={"WORD CLOUD"}
                placement="right"
                closable={true}
                onClose={() => {
                    setwcloudVisible(false);
                    setVariableName("");
                    setPyCode("");
                }}
                visible={wcloudVisible}
                width={1290}
                footer={<div className="paddingTB10 flex row-reverse"></div>}
            >
                <Skeleton active loading={runCommandLoading}>
                    <div className="word__cloud">
                        <div className="word__cloud__container paddingLR24">
                            {Object.keys(word_cloud).map((key) => {
                                return (
                                    <div
                                        key={key}
                                        onClick={() => {
                                            handleSearch({ word: key });
                                        }}
                                        className="word_container "
                                    >
                                        <span className="word">{key} | </span>{" "}
                                        <span className="count">
                                            {word_cloud[key]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <Drawer
                        title="Snippets"
                        width={500}
                        closable={false}
                        onClose={() => setShowSnippets(false)}
                        visible={showSnippets}
                        bodyStyle={{
                            padding: "0",
                        }}
                        className="word_cloud_snippets"
                    >
                        <Skeleton active loading={fetchingCalls}>
                            <ReactVirtualSnippets
                                Component={MonologueCard}
                                data={calls}
                                nextSnippetsUrl={next_url}
                                loading={fetchingCalls}
                                visible={showSnippets}
                                snippetLoading={fetchingCalls}
                                isSample={false}
                                getNext={() => {
                                    searchNext();
                                }}
                            />
                        </Skeleton>
                    </Drawer>
                </Skeleton>
            </Drawer>
            <Drawer
                title={"VIEW GLOBAL EXPRESSION"}
                placement="right"
                closable={true}
                onClose={() => {
                    setViewVisible(false);
                }}
                visible={viewVisible}
                getContainer={false}
                width={width}
                bodyStyle={{
                    padding: "0",
                    overflow: "hidden",
                }}
            >
                <Skeleton
                    active
                    loading={!globalExpressions?.results && loading}
                >
                    {globalExpressions?.results && (
                        <ReactVirtualCard
                            Component={ExpressionCard}
                            data={globalExpressions?.results}
                            nextUrl={globalExpressions?.next || null}
                            visible={viewVisible}
                            id={template_id}
                            loading={loading}
                            handleDelete={handleDelete}
                        />
                    )}
                </Skeleton>
            </Drawer>
            <Modal
                title="Criteria commands"
                visible={cmdVisible}
                onCancel={() => setCmdVisible(false)}
                width={1000}
                className="commands_modal"
                footer={[
                    <Button
                        onClick={() => {
                            reset();
                        }}
                        key={"reset_btn"}
                    >
                        Reset
                    </Button>,
                    <Button
                        type="primary"
                        onClick={() => {
                            !runCommandLoading && dispatch(runCommand(api));
                        }}
                        loading={runCommandLoading}
                        key={"run_btn"}
                    >
                        {runCommandLoading ? "...Running" : "Run"}
                    </Button>,
                ]}
            >
                <div className="paddingLR16">
                    <div className="font16 bold600">{api}</div>
                    <div className="options_container ">
                        <Select
                            className="custom__select"
                            onChange={(val) => {
                                setType(val);
                            }}
                            value={type}
                            dropdownRender={(menu) => (
                                <div>
                                    <span className={"topbar-label"}>
                                        Select Type
                                    </span>
                                    {menu}
                                </div>
                            )}
                            placeholder={"Select Type"}
                            suffixIcon={
                                <Icon className="fas fa-chevron-down dove_gray_cl" />
                            }
                            style={{
                                height: "36px",
                            }}
                            dropdownClassName={"account_select_dropdown"}
                        >
                            <Option value={"report"}>Report</Option>
                            <Option value={"calibration"}>Calibration</Option>
                            <Option value={null}>None</Option>
                        </Select>
                        <Select
                            className="custom__select"
                            onChange={(val) => {
                                setGb(val);
                            }}
                            value={gb}
                            dropdownRender={(menu) => (
                                <div>
                                    <span className={"topbar-label"}>
                                        Group by
                                    </span>
                                    {menu}
                                </div>
                            )}
                            placeholder={"Group by"}
                            suffixIcon={
                                <Icon className="fas fa-chevron-down dove_gray_cl" />
                            }
                            style={{
                                height: "36px",
                            }}
                            dropdownClassName={"account_select_dropdown"}
                        >
                            <Option value={"team"}>Team</Option>
                            <Option value={"template"}>Template</Option>
                        </Select>
                        <Select
                            className="custom__select"
                            onChange={(val) => {
                                setLevel(val);
                            }}
                            value={level}
                            dropdownRender={(menu) => (
                                <div>
                                    <span className={"topbar-label"}>
                                        Select level
                                    </span>
                                    {menu}
                                </div>
                            )}
                            placeholder={"Select level"}
                            suffixIcon={
                                <Icon className="fas fa-chevron-down dove_gray_cl" />
                            }
                            style={{
                                height: "36px",
                            }}
                            dropdownClassName={"account_select_dropdown"}
                        >
                            <Option value={"account"}>Account</Option>
                            <Option value={"meeting"}>Meeting</Option>
                        </Select>

                        <Input
                            onChange={(e) => {
                                setSt(e.target.value);
                            }}
                            style={{
                                width: "30%",
                            }}
                            value={st}
                            placeholder="Enter Start Time"
                        />
                        <Input
                            onChange={(e) => {
                                setEt(e.target.value);
                            }}
                            style={{
                                width: "30%",
                            }}
                            value={et}
                            placeholder="Enter End Time"
                        />
                    </div>
                </div>
            </Modal>

            <Modal
                title="Word Cloud"
                visible={wcVisible}
                onCancel={() => setWcVisible(false)}
                width={1000}
                className="commands_modal"
                footer={[
                    <Button
                        onClick={() => {
                            wc_reset();
                        }}
                        key={"wc_reset_btn"}
                    >
                        Reset
                    </Button>,
                    <Button
                        type="primary"
                        onClick={() => {
                            dispatch(
                                getWordCloudForInternalDashboard(wordcloudApi)
                            );
                            setwcloudVisible(true);
                        }}
                        key={"wc_go_btn"}
                    >
                        Go
                    </Button>,
                ]}
            >
                <div className="paddingLR16">
                    <div className="font16 bold600">{wordcloudApi}</div>

                    <div className="options_container ">
                        <Select
                            className="custom__select marginT4"
                            onChange={(val) => {
                                const question = questions.find(
                                    ({ id }) => id === val
                                );
                                let options = [];

                                if (question.question_type === BOOLEAN_TYPE) {
                                    options = [
                                        {
                                            id: 1,
                                            name: "Yes",
                                        },
                                        {
                                            id: 0,
                                            name: "No",
                                        },
                                    ];
                                }

                                if (question.question_type === RATING_TYPE) {
                                    options = new Array(11)
                                        .fill(0)
                                        .map((_, id) => ({ id, name: id }));
                                }
                                if (question.question_type === CUSTOM_TYPE) {
                                    options = question.settings?.custom || [];
                                }
                                setDisplayLabel(options);
                                setQid(val);
                            }}
                            value={qid}
                            dropdownRender={(menu) => (
                                <div>
                                    <span className={"topbar-label"}>
                                        Questions
                                    </span>
                                    {menu}
                                </div>
                            )}
                            placeholder={"Questions"}
                            suffixIcon={
                                <Icon className="fas fa-chevron-down dove_gray_cl" />
                            }
                            style={{
                                height: "36px",
                                width: "20%",
                            }}
                            dropdownClassName={"account_select_dropdown"}
                            showSearch
                            optionFilterProp="children"
                        >
                            {questions.map(({ id, question_text }) => {
                                return (
                                    <Option key={id} value={id}>
                                        {question_text}
                                    </Option>
                                );
                            })}
                        </Select>
                        <Select
                            className="custom__select marginT4"
                            onChange={(val) => {
                                setLabel(val);
                            }}
                            value={label}
                            dropdownRender={(menu) => (
                                <div>
                                    <span className={"topbar-label"}>
                                        Label
                                    </span>
                                    {menu}
                                </div>
                            )}
                            placeholder={"Select Label"}
                            suffixIcon={
                                <Icon className="fas fa-chevron-down dove_gray_cl" />
                            }
                            style={{
                                height: "36px",
                                width: "15%",
                            }}
                            dropdownClassName={"account_select_dropdown"}
                        >
                            {displayLabel.map(({ id, name }) => {
                                return (
                                    <Option key={id} value={name}>
                                        {name}
                                    </Option>
                                );
                            })}
                        </Select>

                        <Input
                            onChange={(e) => {
                                setNgram(e.target.value);
                            }}
                            style={{
                                width: "10%",
                            }}
                            value={ngram}
                            placeholder="Ngram"
                        />
                        <Input
                            onChange={(e) => {
                                setSt(e.target.value);
                            }}
                            style={{
                                width: "25%",
                            }}
                            value={st}
                            placeholder="Enter Start Time"
                        />
                        <Input
                            onChange={(e) => {
                                setEt(e.target.value);
                            }}
                            style={{
                                width: "25%",
                            }}
                            value={et}
                            placeholder="Enter End Time"
                        />
                    </div>
                </div>
            </Modal>
        </TemplateLayout>
    );
}

const CategoryCard = ({
    name,
    id,
    handleClick,
    deleteQuestionFilter,
    questions,
}) => {
    const { showLoader } = useSelector((state) => state.common);
    return (
        <Col span={24} className="template__list__card column">
            <div className="marginB10 bold">{name}</div>
            <Collapse defaultActiveKey={id}>
                <Panel header="Questions" key={id}>
                    <Spinner loading={showLoader}>
                        <QuestionsList
                            id={id}
                            handleClick={handleClick}
                            deleteQuestionFilter={deleteQuestionFilter}
                            questionList={questions}
                        />
                    </Spinner>
                </Panel>
            </Collapse>
        </Col>
    );
};

const ExpressionCard = ({
    id,
    variable_name,
    py_code,
    loading,
    handleDelete,
}) => {
    const [name, setName] = useState(variable_name);
    const [code, setCode] = useState(py_code);
    const [interact, setInteract] = useState(false);
    const debounceName = useDebounce(name, 500);
    const debounceCode = useDebounce(code, 500);

    const dispatch = useDispatch();

    useEffect(() => {
        if (interact) {
            dispatch(
                updateGlobalExpressionRequest(id, {
                    variable_name: name,
                    py_code: code,
                    id,
                })
            );
        }
    }, [debounceName, debounceCode]);

    return (
        <div key={id} className="padding20">
            <Row className="gutter-row template__list__card alignCenter">
                <Col xl={2} lg={2} md={2} sm={2} xs={2}>
                    <div className="colorFilterGrey">ID</div>
                    <div>{id}</div>
                </Col>
                <Col xl={22} lg={22} md={22} sm={22} xs={22}>
                    <div className="colorFilterGrey">Variable Name</div>
                    <Input
                        placeholder={auditConfig.VARIABLE_NAME_PLACEHOLDER}
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (!interact) {
                                setInteract(true);
                            }
                        }}
                    />
                </Col>
                <Col
                    xl={24}
                    lg={24}
                    md={24}
                    sm={24}
                    xs={24}
                    className="marginT10"
                >
                    <div className="colorFilterGrey marginB8">Python Code</div>
                    <DebounceTextArea
                        onChange={(e) => {
                            setCode(e.target.value);
                            if (!interact) {
                                setInteract(true);
                            }
                        }}
                        className={"resize_vertical"}
                        value={code}
                        placeholder={auditConfig.PYTHON_CODE_PLACEHOLDER}
                        condition={loading}
                    />
                </Col>
                <Col
                    className="row-reverse flex marginT10"
                    xl={24}
                    lg={24}
                    md={24}
                    sm={24}
                    xs={24}
                >
                    <Popconfirm
                        title="Are you sure to delete this filter?"
                        onConfirm={() => {
                            handleDelete(id);
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </Col>
            </Row>
        </div>
    );
};
export default CategoryList;

const MonologueCard = ({
    id,
    title,
    search_context,
    start_time,
    end_time,
    isSample,
}) => {
    return (
        <div className="borderBottom" key={id}>
            <a href={`${window.location.origin}/call/${id}`} target={"_target"}>
                <button className="ant-btn ant-btn-link ant-btn-round font14 text-bolder margin0 paddingL12">
                    <span>{title}</span>
                </button>
            </a>
            <p className="greyText font12 margin0 paddingL21">
                {getDateTime(start_time)} | {getDuration(start_time, end_time)}
            </p>
            {search_context.map((snippet, index) => {
                return (
                    <div key={index}>
                        <Monologue
                            {...snippet}
                            meeting_id={id}
                            isSample={isSample}
                        />
                    </div>
                );
            })}
        </div>
    );
};

const Monologue = ({
    id,
    meeting_title,
    meeting_id,
    start_time,
    end_time,
    headline,
    speaker_name,
    style,
    isSample,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const { domain } = useSelector((state) => state.common);
    return (
        <div>
            <Popover
                overlayClassName={
                    "minWidth30 maxWidth30 maxHeight20 userMonologuePlyer"
                }
                destroyTooltipOnHide={{ keepParent: false }}
                content={
                    <div className="flex column posRel">
                        <Button
                            icon={<CloseOutlined />}
                            className="alignSelfEnd closeBtn"
                            type="link"
                            onClick={() => setIsVisible(false)}
                        />
                        <MonologuePlayer
                            id={meeting_id}
                            start_time={start_time}
                            end_time={end_time}
                            autoPlay={true}
                        />
                    </div>
                }
                placement={"left"}
                trigger="click"
                visible={isVisible}
                onVisibleChange={(status) => setIsVisible(status)}
            >
                <div className="flex padding6">
                    <div className="col-2">
                        <Button
                            className="margin0 text-center"
                            icon={<PlayCircleOutlined />}
                            type="link"
                            disabled={isSample}
                        />
                    </div>
                    <div
                        className="col-22 marginTop4"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isSample) {
                                return;
                            }
                            goToTranscriptTab({
                                event: e,
                                start_time,
                                end_time,
                                headline,
                                meeting_id,
                                domain,
                            });
                        }}
                    >
                        <span className="greyText">
                            {secondsToTime(start_time)}{" "}
                        </span>
                        <span className="labelSpan">{speaker_name} : </span>
                        <span
                            className="srchCallCard__monologue"
                            dangerouslySetInnerHTML={{
                                __html: headline,
                            }}
                        />
                    </div>
                </div>
            </Popover>
        </div>
    );
};
