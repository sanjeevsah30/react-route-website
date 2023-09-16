import React, { useCallback, useContext, useEffect, useState } from "react";
import { Tabs, Layout, Input, Row, Drawer, Button } from "antd";
import GeneralSettings from "../Create Template/GeneralSettings";
import TemplateLayout from "../Layout/TemplateLayout";
import NoTemplate from "../NoTemplate";
import AuditCategories from "app/static/svg/AuditCategories";
import "../auditManager.scss";
import "./categorySettings.scss";
import CategoryCard from "./CategoryCard";
import { AuditContext } from "../AuditManager";
import { checkArray, toSentenceCase } from "@tools/helpers";
import { useDispatch, useSelector } from "react-redux";
import {
    createTemplateCategoryRequest,
    fetchSingleAuditTemplateRequest,
    fetchTemplateCategoriesRequest,
    storeCategories,
    updateAuditTemplateRequest,
    updateTemplateCategotyRequest,
} from "@store/call_audit/actions";
import { constructTags } from "@store/call_audit/util";
import auditConfig from "@constants/Audit";
import Teams from "../Teams";
import SortableFuctionComponent from "./SortableFuctionComponent";
import { bulkUpdateCategories } from "@apis/call_audit/index";

const { RED_ALERT, ZERO_TOLERANCE } = auditConfig;
const { Sider, Content } = Layout;
const { TabPane } = Tabs;
const { TextArea } = Input;

function CategorySettings(props) {
    /*
        tab
        1 - Audit Categories
        2-  Genereal settings
    */
    const [tab, setTab] = useState("1");
    const [saveClicked, setSaveClicked] = useState(false);
    const {
        setActiveTab,
        VIEW_TEMAPLATES,
        templates,
        categories,
        currentTemplate,
        setCurrentTemplate,
        visible,
        setVisible,
        showDrawer,
        onClose,
    } = useContext(AuditContext);

    //Template fields
    const [name, setName] = useState("");
    const [teams_id, setTeams_id] = useState([]);
    const dispatch = useDispatch();
    const [tags, setTags] = useState({
        red_alert: false,
        zero_tolerance: false,
    });

    //category fields
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [editClicked, setEditClicked] = useState(false);
    const [category_id, setCategory_id] = useState("");

    const [callTags, setCallTags] = useState([]);
    const [callType, setCallType] = useState([]);
    const [meetingType, setMeetingType] = useState(null);

    const [notifyOnAudit, setNotifyOnAudit] = useState(true);
    const [isDefaultTemplate, setIsDefaultTemplate] = useState(true);

    const { tags: all_tags, call_types } = useSelector((state) => state.common);
    const versionData = useSelector((state) => state.common.versionData);

    const findName = (idToFind) => {
        const find = all_tags?.find(({ id }) => id === idToFind);
        if (find) {
            return find.tag_name;
        }
        return "";
    };
    const findType = (idToFind) => {
        const find = call_types?.find(({ id }) => id === idToFind);
        if (find) {
            return find.type;
        }
        return "";
    };

    const CreateTemplate = (
        <div className="marginR20">
            <Button type="primary" onClick={() => setVisible(true)}>
                Create Category
            </Button>
        </div>
    );

    useEffect(() => {
        if (tab === "1") {
            dispatch(fetchTemplateCategoriesRequest(currentTemplate.id));
        }
        if (tab === "2") {
            dispatch(fetchSingleAuditTemplateRequest(currentTemplate.id));
        }
    }, [tab]);

    useEffect(() => {
        const template = templates.find(
            ({ id }) => +currentTemplate.id === +id
        );
        template && setCurrentTemplate(template);
    }, [templates]);

    useEffect(() => {
        if (saveClicked) {
            handleTabChange("1");
            setSaveClicked(false);
            return;
        }

        const {
            name,
            teams,
            tags: templateTags,
            notify_on_audit,
            is_default,
        } = currentTemplate;

        setName(name);
        setTeams_id(checkArray(teams).map(({ id }) => id));
        const tagsObj = {};
        if (templateTags?.length) {
            templateTags.forEach(({ tag_name, is_disabled }) => {
                if (tag_name === RED_ALERT && !is_disabled) {
                    tagsObj.red_alert = true;
                }
                if (tag_name === ZERO_TOLERANCE && !is_disabled) {
                    tagsObj.zero_tolerance = true;
                }
            });
            setTags(tagsObj);
        }
        const { parameters } = currentTemplate;

        if (parameters?.call_types?.length) {
            setCallType(
                parameters?.call_types.map((id) => ({
                    id,
                    value: findType(id),
                }))
            );
        }
        if (parameters?.call_tags?.length) {
            setCallTags(
                parameters?.call_tags.map((id) => ({ id, value: findName(id) }))
            );
        }

        if (parameters?.meeting_type) {
            setMeetingType(toSentenceCase(parameters?.meeting_type));
        } else {
            setMeetingType("None");
        }

        setNotifyOnAudit(notify_on_audit);
        setIsDefaultTemplate(is_default);
    }, [currentTemplate]);

    const resetCategoryState = () => {
        setVisible(false);
        setCategoryName("");
        setCategoryDescription("");
        setEditClicked(false);
        setCategory_id("");
    };

    const createCategory = () => {
        dispatch(
            createTemplateCategoryRequest({
                name: categoryName,
                description: categoryDescription,
                template: currentTemplate.id,
                seq_no: categories.length + 1,
            })
        );
        resetCategoryState();
    };

    const updateCategory = () => {
        dispatch(
            updateTemplateCategotyRequest(category_id, {
                name: categoryName,
                description: categoryDescription,
                template: currentTemplate.id,
            })
        );
        resetCategoryState();
    };

    const handleDisable = useCallback((id, is_disabled) => {
        dispatch(
            updateTemplateCategotyRequest(
                id,
                {
                    is_disabled,
                },
                false
            )
        );
    });

    function handleTabChange(key) {
        setTab(key);
    }

    return (
        <TemplateLayout
            name={currentTemplate.name}
            showFooter={tab === "2"}
            save_text={"SAVE"}
            goBack={() => {
                setActiveTab(VIEW_TEMAPLATES);
                dispatch(storeCategories([]));
            }}
            save={() => {
                dispatch(
                    updateAuditTemplateRequest(currentTemplate.id, {
                        name,
                        teams: teams_id,
                        tags: constructTags(tags),
                        parameters: {
                            call_tags: callTags.map(({ value, id }) => id),
                            call_types: callType.map(({ value, id }) => id),
                            ...(meetingType !== "None"
                                ? {
                                      meeting_type: meetingType.toLowerCase(),
                                  }
                                : {}),
                        },
                        notify_on_audit: notifyOnAudit,
                        is_default: isDefaultTemplate,
                    })
                );
                setSaveClicked(true);
            }}
        >
            <Content className="bgWhite">
                <Tabs
                    size="large"
                    defaultActiveKey="1"
                    activeKey={tab}
                    onChange={handleTabChange}
                    tabBarExtraContent={
                        tab === "1" && !!categories.length ? (
                            CreateTemplate
                        ) : (
                            <></>
                        )
                    }
                >
                    <TabPane
                        tab={
                            versionData?.domain_type !== "b2c"
                                ? "Score card Categories"
                                : "Audit Categories"
                        }
                        key="1"
                        className="overflowYscroll"
                        style={{
                            height: "calc(100vh - 215px)",
                        }}
                    >
                        <div className="paddingLR16 paddingB20">
                            {!!categories?.length ? (
                                <SortableFuctionComponent
                                    data={categories}
                                    setEditClicked={setEditClicked}
                                    setCategoryName={setCategoryName}
                                    setCategoryDescription={
                                        setCategoryDescription
                                    }
                                    setVisible={setVisible}
                                    setCategory_id={setCategory_id}
                                    Component={CategoryCard}
                                    gutter={[24, 24]}
                                    save={bulkUpdateCategories}
                                    action={storeCategories}
                                    handleDisable={handleDisable}
                                />
                            ) : (
                                <NoTemplate
                                    Svg={AuditCategories}
                                    heading="No Categories here"
                                    text="Try creating some categories"
                                    button_text="Create Categories"
                                    onClick={showDrawer}
                                />
                            )}
                        </div>
                    </TabPane>
                    <TabPane tab="General Settings" key="2">
                        <GeneralSettings
                            name={name}
                            setName={setName}
                            tags={tags}
                            setTags={setTags}
                        />
                    </TabPane>
                </Tabs>
            </Content>
            {tab === "2" && (
                <Sider
                    className="create__template__teams overflowYscroll"
                    breakpoint={"md"}
                    theme="light"
                    collapsedWidth={0}
                    trigger={null}
                    width={358}
                >
                    <Teams
                        setTeams_id={setTeams_id}
                        teams_id={teams_id}
                        callTags={callTags}
                        setCallTags={setCallTags}
                        callType={callType}
                        setCallType={setCallType}
                        notifyOnAudit={notifyOnAudit}
                        isDefaultTemplate={isDefaultTemplate}
                        setNotifyOnAudit={setNotifyOnAudit}
                        setIsDefaultTemplate={setIsDefaultTemplate}
                        setMeetingType={setMeetingType}
                        meetingType={meetingType}
                    />
                </Sider>
            )}
            <Drawer
                title={
                    editClicked
                        ? "EDIT DETAILS"
                        : `${
                              versionData?.domain_type === "b2c"
                                  ? "CREATE SCORECARD CATEGORY"
                                  : "CREATE AUDIT CATEGORY"
                          }`
                }
                placement="right"
                closable={true}
                onClose={() => {
                    if (editClicked) {
                        resetCategoryState();
                    } else onClose();
                }}
                visible={visible}
                width={500}
                footer={
                    <div className="paddingTB10 flex row-reverse">
                        {editClicked ? (
                            <Button type="primary" onClick={updateCategory}>
                                Save
                            </Button>
                        ) : (
                            <Button type="primary" onClick={createCategory}>
                                Add
                            </Button>
                        )}
                    </div>
                }
            >
                <div className="marginB30">
                    <div className="auditColorGrey marginB8">TITLE</div>
                    <Input
                        placeholder="Enter title"
                        className="audit__input__bg"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                    />
                </div>
                <div>
                    <div className="auditColorGrey marginB8">DESCRIPTION</div>
                    <TextArea
                        className="audit__input__bg"
                        placeholder="Enter description"
                        autoSize={{ minRows: 6, maxRows: 8 }}
                        value={categoryDescription}
                        onChange={(e) => setCategoryDescription(e.target.value)}
                    />
                </div>
            </Drawer>
        </TemplateLayout>
    );
}

export default CategorySettings;
