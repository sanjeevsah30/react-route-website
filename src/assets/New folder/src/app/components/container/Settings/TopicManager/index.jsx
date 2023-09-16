import React, { useEffect, useState, useRef } from "react";

import "./styles.scss";

// apis
import {
    getAllTopics,
    getTopicCategories,
    createNewTopic,
    deleteTopic,
    updateTopic,
} from "@apis/topics";
import { openNotification } from "@store/common/actions";
import apiErrors from "@apis/common/errors";
import { flattenTeams } from "@tools/helpers";
import Icon from "@presentational/reusables/Icon";

//redux
import { useDispatch, useSelector } from "react-redux";

// components and antd imports
import {
    Button,
    Input,
    Modal,
    Row,
    Col,
    Select,
    Radio,
    Typography,
    Divider,
    Space,
    Checkbox,
    Popover,
    Collapse,
} from "antd";

import { CloseOutlined, PlusOutlined } from "@ant-design/icons";

import TopicTable from "./Table";
import InfoSVG from "./infosvg";
import ArrowSVG from "./arrowsvg";
import CloseSvg from "app/static/svg/CloseSvg";
import ChevronDownSvg from "app/static/svg/ChevronDownSvg";
import ChevronUpSvg from "app/static/svg/ChevronUpSvg";

import { CustomMultipleSelect } from "app/components/Resuable/index";

const { Search } = Input;
const { Option } = Select;
const { Panel } = Collapse;

const CheckboxGroup = Checkbox.Group;

const TopicManagerLatest = () => {
    // modal props
    const [visible, setVisible] = useState(false);

    // loader states
    const [confirmLoading, setConfirmLoading] = useState(false);
    // update modal button according to state
    const [isUpdate, setIsUpdate] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);

        setNewTopicData({
            name: "",
            category: "",
            phrases: [],
            exact_phrases: [],
            ignore_phrases: [],
            description: "",
            said_by: "anyone",
            intent: "neutral",
            teams: [],
        });

        setPhrase("");
        setExactPhrase("");
        setIgnorePhrase("");
    };

    // Redux essentials (state)
    // API essentials
    const domain = useSelector((state) => state.common.domain);
    // get all teams
    const all_teams = useSelector((state) => state.common.teams);

    // fetch all topics
    const [topics, setTopics] = useState([]);
    const [topic_categories, setTopicCategories] = useState([]);

    // state to check deleted topic

    const [isDeleting, setIsDeleting] = useState(false);
    //state to check updated topic
    const [updated_topic, setUpdatedTopic] = useState(false);
    useEffect(() => {
        getAllTopics(domain).then((topics) => {
            if (topics.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", topics.message);
            } else {
                setTopics(topics);
            }
        });
    }, [confirmLoading, isDeleting, updated_topic]);
    useEffect(() => {
        getTopicCategories(domain).then((categories) => {
            if (categories.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", categories.message);
            } else {
                let c =
                    categories.length > 0
                        ? categories.map((el) => el.name)
                        : [];
                setTopicCategories(c);
            }
        });
    }, [confirmLoading, isDeleting, updated_topic]);

    // Form handler for create topic
    const [newTopicData, setNewTopicData] = useState({
        name: "",
        category: "",
        phrases: [],
        exact_phrases: [],
        ignore_phrases: [],
        description: "",
        said_by: "anyone",
        intent: "neutral",
        teams: [],
    });

    const {
        phrases,
        exact_phrases,
        ignore_phrases,
        said_by,
        intent,
        name,
        category,
        description,
    } = newTopicData;

    function checkEmptiness() {
        if (
            name.length > 0 &&
            (phrases.length > 0 || exact_phrases.length > 0)
        ) {
            return false;
        } else {
            return true;
        }
    }
    let x = checkEmptiness();

    const [phrase, setPhrase] = useState("");
    const [exactPhrase, setExactPhrase] = useState("");
    const [ignorePhrase, setIgnorePhrase] = useState("");
    const [category_name, setCategoryName] = useState("");

    // fn to add category

    const addItem = (e) => {
        e.preventDefault();
        setTopicCategories([...topic_categories, category_name]);
        setNewTopicData({
            ...newTopicData,
            category: category_name,
        });
        setCategoryName("");
    };
    const onCategoryChange = (e) => {
        setCategoryName(e.target.value);
    };

    //------------- UPDATED CODE FOR SUB-TEAMS ----------------------------------------//
    const {
        common: { teams, versionData },
    } = useSelector((state) => state);

    const team_selector_id = "team__selector";
    const [showTeamOptions, setShowTeamOptions] = useState(false);
    const [teamSelection, setTeamSelection] = useState([]);
    const calRef = useRef(null);

    const handleTeamSelection = (id) => {
        if (id === 0) {
            setTeamSelection([]);
            return setShowTeamOptions(false);
        }
        if (teamSelection?.includes(id)) {
            return setTeamSelection((prev) => prev.filter((e) => e !== id));
        }
        setNewTopicData({
            ...newTopicData,
            teams: teamSelection?.concat(id),
        });
        return setTeamSelection([...teamSelection, id]);
    };

    // handle form submission
    const [createdTopicId, setCreatedTopicId] = useState("");
    const createTopicHandler = () => {
        setConfirmLoading(true);
        if (description === "") {
            // delete the description key from object
            delete newTopicData.description;
        } else if (category === "") {
            delete newTopicData.category;
        } else if (phrases.length === 0) {
            delete newTopicData.phrases;
        } else if (exact_phrases.length === 0) {
            delete newTopicData.exact_phrases;
        }

        createNewTopic(domain, newTopicData).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
                setConfirmLoading(false);
            } else {
                setCreatedTopicId(res?.id);
                setVisible(false);
                setConfirmLoading(false);
                setNewTopicData({
                    name: "",
                    category: "",
                    phrases: [],
                    exact_phrases: [],
                    ignore_phrases: [],
                    description: "",
                    said_by: "anyone",
                    intent: "neutral",
                    teams: [],
                });
                openNotification(
                    "success",
                    "Success",
                    "Topic created successfully"
                );
                setPhrase("");
                setExactPhrase("");
                setIgnorePhrase("");
                setTeamSelection([]);
                setShowTeamOptions(false);
            }
        });
    };

    // handler for deleting a topic
    // fixed fe-224

    const deleteTopicHandler = (id) => {
        setIsDeleting(true);
        deleteTopic(domain, id).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
                setIsDeleting(false);
            } else {
                setIsDeleting(false);
            }
        });
    };

    // handler for updaing topic
    const [topicId, setTopicId] = useState("");
    const editTopicHandler = (id) => {
        setVisible(true);
        setIsUpdate(true);
        setTopicId(id);
        let t = topics.find((el) => el.id === id);

        setNewTopicData({
            name: t?.name,
            category: t?.category?.name,
            phrases: t?.phrases.length ? t?.phrases.map((el) => el.phrase) : [],
            exact_phrases: t?.exact_phrases.length ? t?.exact_phrases : [],
            ignore_phrases: t?.ignore_phrases.length
                ? t?.ignore_phrases.map((el) => el.phrase)
                : [],
            description: t?.description,
            said_by: t?.said_by,
            intent: t?.intent,
            teams: teamSelection,
        });

        setTeamSelection(t?.teams.map((el) => el.id));
    };

    const topic_updater = (id) => {
        setConfirmLoading(true);
        if (description === "") {
            // delete the description key from object
            delete newTopicData.description;
        } else if (category === "") {
            delete newTopicData.category;
        }

        updateTopic(
            domain,
            { ...newTopicData, teams: teamSelection },
            +id
        ).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
                setConfirmLoading(false);
            } else {
                setVisible(false);
                setConfirmLoading(false);
                setUpdatedTopic(true);
                setNewTopicData({
                    name: "",
                    category: "",
                    phrases: [],
                    exact_phrases: [],
                    ignore_phrases: [],
                    description: "",
                    said_by: "anyone",
                    intent: "neutral",
                    teams: [],
                });
                openNotification(
                    "success",
                    "Success",
                    "Topic updated successfully"
                );
                setPhrase("");
                setExactPhrase("");
                setIgnorePhrase("");
                setTeamSelection([]);
                setShowTeamOptions(false);
            }
        });
        setTopicId("");
    };
    // function to remove pill if deleted
    const pillRemover = (title, type, id) => {
        switch (type) {
            case "phrases":
                setNewTopicData({
                    ...newTopicData,
                    phrases: newTopicData.phrases.filter((el) => el !== title),
                });
                break;
            case "exact_phrases":
                setNewTopicData({
                    ...newTopicData,
                    exact_phrases: newTopicData.exact_phrases?.filter(
                        (el) => el !== title
                    ),
                });
                break;
            case "ignore_phrases":
                setNewTopicData({
                    ...newTopicData,
                    ignore_phrases: newTopicData.ignore_phrases.filter(
                        (el) => el !== title
                    ),
                });
                break;
            case "teams":
                setTeamSelection(teamSelection.filter((el) => el !== id));
            default:
                break;
        }
    };

    // search for a topic or phrase
    const [searchText, setSearchText] = useState("");
    const onSearch = (value) => {};
    const searchHandler = (e) => {
        setSearchText(e.target.value);
    };

    let modifiedTopics = topics.map((topic) => {
        return (topic = {
            ...topic,
            phrases: topic.phrases.map((el) => el.phrase),
            ignore_phrases: topic.ignore_phrases.map((el) => el.phrase),
        });
    });
    let filteredTopics = modifiedTopics.filter((el) => {
        return Object.values(el).some((val) => {
            if (val) {
                return val
                    .toString()
                    .toLowerCase()
                    .includes(searchText.toLowerCase());
            }
        });
    });

    const handleTeamOptionsClose = (e) => {
        if (e.target.closest(`#${team_selector_id}`)) {
            return;
        }
        if (e.target.closest(".team_selector_popover")) {
            return;
        }
        setShowTeamOptions(false);
    };

    useEffect(() => {
        document.body.addEventListener("click", handleTeamOptionsClose);

        return () => {
            document.body.removeEventListener("click", handleTeamOptionsClose);
        };
    }, []);

    const RenderTeamOptions = () => {
        return (
            <div>
                <div
                    className="placeholder flex justifySpaceBetween"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowTeamOptions(false);
                    }}
                >
                    <span>Select Teams and Sub-teams</span>
                    <span className="curPoint">
                        <CloseSvg
                            style={{
                                transform: "scale(0.8)",
                            }}
                        />
                    </span>
                </div>

                <div className="options_container paddingT10">
                    {teams.length > 0 &&
                        teams.map((team, idx) => {
                            return team?.subteams?.length ? (
                                <TeamOption
                                    team={team}
                                    key={idx}
                                    teamSelection={teamSelection}
                                    handleTeamSelection={handleTeamSelection}
                                />
                            ) : (
                                <div
                                    className="team_option paddingL10 paddingTB10 curPoint"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTeamSelection(team.id);
                                    }}
                                    key={idx}
                                >
                                    <span className="capitalize">
                                        <Checkbox
                                            checked={
                                                team.id === 0
                                                    ? teamSelection.length === 0
                                                        ? true
                                                        : false
                                                    : teamSelection?.includes(
                                                          team.id
                                                      )
                                            }
                                            className="marginR9"
                                        />
                                        <span className="mine_shaft_cl ">
                                            {team.name}
                                        </span>
                                    </span>
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    };
    return (
        <div className="topic_container">
            <div className="topic_container_header">
                <h2>Topic Manager</h2>
                <p style={{ color: "#666666" }}>
                    These are keyword phrases you setup to find anything in your
                    meetings. They are useful to track competitors and any topic
                    of interest.
                </p>
                <div className="_div1">
                    <Search
                        placeholder="Search Topic by phrase, text or Keyword"
                        onSearch={onSearch}
                        onChange={(e) => searchHandler(e)}
                        style={{ width: 300 }}
                    />
                    <Button
                        className="ant-btn ant-btn-primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            showModal();
                            setIsUpdate(false);
                        }}
                    >
                        Create Topic
                    </Button>
                    <Modal
                        className="topic_modal"
                        title={isUpdate ? "Update Topic" : "Create Topic"}
                        visible={visible}
                        // onOk={handleOk}
                        confirmLoading={confirmLoading}
                        onCancel={handleCancel}
                        closeIcon={
                            <CloseSvg
                                style={{
                                    color: "#666666",
                                }}
                            />
                        }
                        footer={
                            <div className="modal_footer">
                                <a
                                    target="_blank"
                                    href={
                                        versionData?.contact_us_url ||
                                        "https://convin.ai/"
                                    }
                                    rel="noreferrer"
                                >
                                    To create advanced topics, Please drop a
                                    note to us
                                    <ArrowSVG />
                                </a>
                                <Button
                                    type="primary"
                                    loading={confirmLoading}
                                    onClick={() =>
                                        !isUpdate
                                            ? createTopicHandler()
                                            : topic_updater(topicId)
                                    }
                                    // disabled={
                                    //     !isUpdate
                                    //         ? x
                                    //         : category === undefined ||
                                    //           category === ''
                                    // }
                                    disabled={x}
                                >
                                    {isUpdate ? "Update Topic" : "Create Topic"}
                                </Button>
                            </div>
                        }
                        style={{ marginTop: "-50px" }}
                        width="950px"
                        height="700px"
                    >
                        <Row gutter={[32, 0]}>
                            <Col span={12}>
                                <div className="input_wrapper">
                                    <p className="input_label">
                                        Add Keywords / Phrases{" "}
                                        {/* <span style={{ color: '#999999' }}>
                                            (Required)
                                        </span> */}
                                    </p>

                                    {/* handle input */}
                                    <div className="input_bar">
                                        <Input
                                            value={phrase}
                                            placeholder="Keywords or phrases"
                                            onChange={(e) =>
                                                setPhrase(e.target.value)
                                            }
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                    if (
                                                        newTopicData.phrases.includes(
                                                            phrase
                                                        )
                                                    ) {
                                                        openNotification(
                                                            "error",
                                                            "Error",
                                                            "Phrase already exists"
                                                        );
                                                        setPhrase("");
                                                    } else {
                                                        setNewTopicData({
                                                            ...newTopicData,
                                                            phrases: [
                                                                ...newTopicData.phrases,
                                                                phrase,
                                                            ],
                                                        });
                                                        setPhrase("");
                                                    }
                                                }
                                            }}
                                        />
                                        <Button
                                            className="ibtn"
                                            disabled={!phrase.length}
                                            type="primary"
                                            onClick={() => {
                                                // check if phrase is already in the phrases array
                                                if (
                                                    newTopicData.phrases.includes(
                                                        phrase
                                                    )
                                                ) {
                                                    openNotification(
                                                        "error",
                                                        "Error",
                                                        "Phrase already exists"
                                                    );
                                                    setPhrase("");
                                                } else {
                                                    setNewTopicData({
                                                        ...newTopicData,
                                                        phrases: [
                                                            ...newTopicData.phrases,
                                                            phrase,
                                                        ],
                                                    });
                                                    setPhrase("");
                                                }
                                            }}
                                        >
                                            Add
                                        </Button>
                                    </div>

                                    <p
                                        style={{
                                            color: "#999999",

                                            fontSize: "12px",
                                            fontStyle: "italic",
                                        }}
                                    >
                                        *Special Characters are not supported
                                    </p>
                                </div>

                                <div className="pill_wrapper">
                                    {phrases.map((el) => (
                                        <Pill
                                            key={el}
                                            id={el}
                                            title={el}
                                            pillRemover={pillRemover}
                                            type="phrases"
                                        />
                                    ))}
                                </div>

                                <div className="input_wrapper marginT15">
                                    <p className="input_label">
                                        Exact Phrases / Words{" "}
                                        {/* <span style={{ color: '#999999' }}>
                                            (Required)
                                        </span> */}
                                    </p>
                                    {/* input handling */}
                                    <div className="input_bar">
                                        <Input
                                            value={exactPhrase}
                                            placeholder="Keywords or phrases"
                                            onChange={(e) =>
                                                setExactPhrase(e.target.value)
                                            }
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                    if (
                                                        newTopicData.exact_phrases.includes(
                                                            exactPhrase
                                                        )
                                                    ) {
                                                        openNotification(
                                                            "error",
                                                            "Error",
                                                            "Phrase already exists"
                                                        );
                                                        setExactPhrase("");
                                                    } else {
                                                        setNewTopicData({
                                                            ...newTopicData,
                                                            exact_phrases: [
                                                                ...newTopicData.exact_phrases,
                                                                exactPhrase,
                                                            ],
                                                        });
                                                        setExactPhrase("");
                                                    }
                                                }
                                            }}
                                        />
                                        <Button
                                            disabled={!exactPhrase.length}
                                            type="primary"
                                            className="ibtn"
                                            onClick={() => {
                                                if (
                                                    newTopicData.exact_phrases.includes(
                                                        exactPhrase
                                                    )
                                                ) {
                                                    openNotification(
                                                        "error",
                                                        "Error",
                                                        "Phrase already exists"
                                                    );
                                                    setExactPhrase("");
                                                } else {
                                                    setNewTopicData({
                                                        ...newTopicData,
                                                        exact_phrases: [
                                                            ...newTopicData.exact_phrases,
                                                            exactPhrase,
                                                        ],
                                                    });
                                                    setExactPhrase("");
                                                }
                                            }}
                                        >
                                            Add
                                        </Button>
                                    </div>

                                    <p
                                        style={{
                                            color: "#999999",
                                            fontSize: "12px",
                                            fontStyle: "italic",
                                        }}
                                    >
                                        *Special Characters are not supported
                                    </p>
                                </div>

                                <div className="pill_wrapper">
                                    {exact_phrases?.map((el) => (
                                        <Pill
                                            key={el}
                                            id={el}
                                            title={el}
                                            pillRemover={pillRemover}
                                            type="exact_phrases"
                                        />
                                    ))}
                                </div>

                                <div className="input_wrapper marginT15">
                                    <p className="input_label">
                                        Ignore this Keyword / Phrases{" "}
                                    </p>
                                    <div className="input_bar">
                                        <Input
                                            value={ignorePhrase}
                                            placeholder="Keywords or phrases"
                                            onChange={(e) =>
                                                setIgnorePhrase(e.target.value)
                                            }
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                    if (
                                                        newTopicData.ignore_phrases.includes(
                                                            ignorePhrase
                                                        )
                                                    ) {
                                                        openNotification(
                                                            "error",
                                                            "Error",
                                                            "Phrase already exists"
                                                        );
                                                        setIgnorePhrase("");
                                                    } else {
                                                        setNewTopicData({
                                                            ...newTopicData,
                                                            ignore_phrases: [
                                                                ...newTopicData.ignore_phrases,
                                                                ignorePhrase,
                                                            ],
                                                        });
                                                        setIgnorePhrase("");
                                                    }
                                                }
                                            }}
                                        />
                                        <Button
                                            disabled={!ignorePhrase.length}
                                            type="primary"
                                            className="ibtn"
                                            onClick={() => {
                                                if (
                                                    newTopicData.ignore_phrases.includes(
                                                        ignorePhrase
                                                    )
                                                ) {
                                                    openNotification(
                                                        "error",
                                                        "Error",
                                                        "Phrase already exists"
                                                    );
                                                    setIgnorePhrase("");
                                                } else {
                                                    setNewTopicData({
                                                        ...newTopicData,
                                                        ignore_phrases: [
                                                            ...newTopicData.ignore_phrases,
                                                            ignorePhrase,
                                                        ],
                                                    });
                                                    setIgnorePhrase("");
                                                }
                                            }}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </div>

                                <div className="pill_wrapper marginT10">
                                    {ignore_phrases.map((el) => (
                                        <Pill
                                            key={el}
                                            id={el}
                                            title={el}
                                            pillRemover={pillRemover}
                                            type="ignore_phrases"
                                        />
                                    ))}
                                </div>
                            </Col>
                            {/* Column 2 */}
                            <Col span={12}>
                                <div className="input_wrapper">
                                    <p className="input_label">
                                        Topic Name{" "}
                                        <span style={{ color: "#999999" }}>
                                            (Required)
                                        </span>
                                    </p>
                                    {/* <InputBar /> */}
                                    <div className="input_bar">
                                        <Input
                                            placeholder="Topic Name"
                                            value={name}
                                            onChange={(e) => {
                                                setNewTopicData({
                                                    ...newTopicData,
                                                    name: e.target.value,
                                                });
                                            }}
                                            // disabled={isUpdate}
                                        />
                                    </div>
                                </div>
                                <div className="input_wrapper marginT25">
                                    <p className="input_label">
                                        Topic Description{" "}
                                        {/* <span style={{ color: '#999999' }}>
                                            (Required)
                                        </span> */}
                                    </p>
                                    {/* <InputBar /> */}
                                    <div className="input_bar">
                                        <Input
                                            placeholder="Topic Description..."
                                            value={description}
                                            onChange={(e) => {
                                                setNewTopicData({
                                                    ...newTopicData,
                                                    description: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="input_wrapper marginT30">
                                    <p className="input_label">
                                        Category{" "}
                                        {/* <span style={{ color: '#999999' }}>
                                            {isUpdate && '(Required)'}
                                        </span> */}
                                    </p>

                                    <Select
                                        style={{
                                            width: "100%",
                                            textTransform: "none",
                                        }}
                                        value={category}
                                        onChange={(value) => {
                                            setNewTopicData({
                                                ...newTopicData,
                                                category: value,
                                            });
                                        }}
                                        suffixIcon={
                                            <i className="fa fas fa-chevron-down dove_gray_cl"></i>
                                        }
                                        placeholder="Choose Category"
                                        dropdownRender={(menu) => (
                                            <>
                                                {menu}
                                                <Divider
                                                    style={{ margin: "8px 0" }}
                                                />
                                                <Space
                                                    align="center"
                                                    style={{
                                                        padding: "0 8px 4px",
                                                    }}
                                                >
                                                    <Input
                                                        placeholder="Please enter category name"
                                                        value={category_name}
                                                        onChange={
                                                            onCategoryChange
                                                        }
                                                    />
                                                    <Typography.Link
                                                        onClick={addItem}
                                                        disabled={
                                                            !category_name.length
                                                        }
                                                        style={{
                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        <PlusOutlined /> Add New
                                                        Category
                                                    </Typography.Link>
                                                </Space>
                                            </>
                                        )}
                                    >
                                        {topic_categories.length > 0 ? (
                                            topic_categories.map((el) => (
                                                <Option
                                                    style={{
                                                        textTransform: "none",
                                                    }}
                                                    key={el}
                                                    value={el}
                                                >
                                                    {el}
                                                </Option>
                                            ))
                                        ) : (
                                            <Option disabled={true}>
                                                No Categories
                                            </Option>
                                        )}
                                    </Select>
                                </div>

                                <div className="input_wrapper marginT20">
                                    <p className="input_label">Said By</p>
                                    <Radio.Group
                                        onChange={(e) => {
                                            setNewTopicData({
                                                ...newTopicData,
                                                said_by: e.target.value,
                                            });
                                        }}
                                        value={said_by}
                                        size="large"
                                    >
                                        <Radio value={"anyone"}>Anyone</Radio>
                                        <Radio value={"rep"}>Rep</Radio>
                                        <Radio value={"prospect"}>
                                            Prospect
                                        </Radio>
                                    </Radio.Group>
                                </div>
                                <div className="input_wrapper marginT20">
                                    <p className="input_label">Intent</p>
                                    {/* <div className="info_tag">
                                        <InfoSVG />
                                        <p>
                                            Lorem ipsum dolor, sit amet
                                            consectetur adipisicing elit.
                                            Impedit saepe quos aut,
                                            exercitationem non atque.
                                        </p>
                                    </div> */}
                                    <Radio.Group
                                        onChange={(e) => {
                                            setNewTopicData({
                                                ...newTopicData,
                                                intent: e.target.value,
                                            });
                                        }}
                                        value={intent}
                                        size="large"
                                    >
                                        <Radio value={"neutral"}>Neutral</Radio>
                                        <Radio value={"positive"}>
                                            Positive
                                        </Radio>
                                        <Radio value={"negative"}>
                                            Negative
                                        </Radio>
                                    </Radio.Group>
                                </div>
                                {/* new feature to add Teams  */}
                                <div className="input_wrapper marginT30">
                                    <p className="input_label">
                                        Applicable Teams/Sub-teams{" "}
                                    </p>

                                    <div
                                        id={team_selector_id}
                                        onClick={() =>
                                            setShowTeamOptions((prev) => !prev)
                                        }
                                        ref={calRef}
                                    >
                                        <Popover
                                            placement="bottomRight"
                                            overlayClassName="team_selector_popover custom_team"
                                            content={RenderTeamOptions()}
                                            trigger="click"
                                            getPopupContainer={() => {
                                                return document.getElementById(
                                                    team_selector_id
                                                );
                                            }}
                                            visible={showTeamOptions}
                                        >
                                            <Select
                                                className={"custom__select"}
                                                style={{
                                                    width: "100%",
                                                }}
                                                dropdownClassName={
                                                    "hide_dropdown"
                                                }
                                                suffixIcon={
                                                    <Icon className="fas fa-chevron-down dove_gray_cl" />
                                                }
                                                value={
                                                    teamSelection.length === 0
                                                        ? null
                                                        : teamSelection.length ===
                                                          1
                                                        ? `${teamSelection.length} Team Selected`
                                                        : `${teamSelection.length} Teams Selected`
                                                }
                                            ></Select>
                                        </Popover>
                                    </div>
                                    <p className="input_label">
                                        Selected Teams &amp; Sub-teams
                                    </p>
                                    <div className="pill_wrapper marginT10">
                                        {teamSelection.length > 0 &&
                                            teamSelection.map((id) => (
                                                <Pill
                                                    key={id}
                                                    id={id}
                                                    title={
                                                        teams.find(
                                                            (el) => el.id === id
                                                        )?.name.length > 0
                                                            ? teams.find(
                                                                  (el) =>
                                                                      el.id ===
                                                                      id
                                                              )?.name
                                                            : teams.map(
                                                                  (el) =>
                                                                      el.subteams.find(
                                                                          (
                                                                              sub
                                                                          ) =>
                                                                              sub.id ===
                                                                              id
                                                                      )?.name
                                                              )
                                                    }
                                                    pillRemover={pillRemover}
                                                    type="teams"
                                                />
                                            ))}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Modal>
                </div>
            </div>
            <TopicTable
                topics={filteredTopics}
                deleteTopicHandler={deleteTopicHandler}
                editTopicHandler={editTopicHandler}
                loading={confirmLoading}
                createdTopicId={createdTopicId}
                isDeleting={isDeleting}
            />
        </div>
    );
};

const Pill = ({ title, total, pillRemover, type, id }) => {
    return (
        <div className="pill">
            <span style={{ color: "#1A62F2" }}>
                {title ? title : total ? "+" + total : ""}
            </span>
            {title && (
                <CloseOutlined
                    style={{
                        color: "#1A62F2",
                        marginLeft: 10,
                        cursor: "pointer",
                    }}
                    onClick={() => pillRemover(title, type, id)}
                />
            )}
        </div>
    );
};
const TeamOption = ({ team, handleTeamSelection, teamSelection }) => {
    return (
        <div className="team_option" onClick={(e) => e.stopPropagation()}>
            <Collapse
                expandIconPosition={"right"}
                bordered={false}
                expandIcon={({ isActive }) =>
                    isActive ? <ChevronUpSvg /> : <ChevronDownSvg />
                }
                accordion={true}
                defaultActiveKey={team.id}
            >
                <Panel
                    header={
                        <span className="capitalize" onClick={(e) => {}}>
                            <span className="mine_shaft_cl ">{team.name}</span>
                        </span>
                    }
                    key={team.id}
                >
                    {team?.subteams?.map(({ name, id }) => (
                        <div
                            key={id}
                            className="paddingL16 marginB10 curPoint"
                            onClick={(e) => {
                                handleTeamSelection(id);
                            }}
                        >
                            <Checkbox
                                checked={teamSelection?.includes(id)}
                                className="marginR9"
                            />
                            <span className="font12 dove_gray_cl">{name}</span>
                        </div>
                    ))}
                </Panel>
            </Collapse>
        </div>
    );
};

export default TopicManagerLatest;
