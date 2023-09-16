import React from "react";
import settingsConfig from "@constants/Settings";
import { Input, Tag, Label, Icon, Error, Success, NoData } from "@reusables";
import { Popconfirm, Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { uid } from "@tools/helpers";

const TopicManagerUI = (props) => {
    const getTagString = (topic) => {
        return topic.keywords
            .slice(settingsConfig.TOPICMANAGER.maxKeywords)
            .map((keyword) => keyword)
            .join(", ");
    };

    const topicsTable = props.topics
        .slice(
            (props.pageNo - 1) * settingsConfig.TOPICMANAGER.topicsPerPage,
            props.pageNo * settingsConfig.TOPICMANAGER.topicsPerPage
        )
        .map((topic, index) => {
            return (
                <div className={"topicstable-row"} key={uid() + index}>
                    <div className={"topicstable-row-field topicname"}>
                        {topic.name}
                    </div>
                    <div className={"topicstable-row-field keywords"}>
                        {topic.keywords && topic.keywords.length > 0
                            ? topic.keywords
                                  .slice(
                                      0,
                                      settingsConfig.TOPICMANAGER.maxKeywords
                                  )
                                  .map((keyword, idx) => (
                                      <Tag
                                          label={keyword}
                                          tagClass={`keyword`}
                                          key={uid() + idx}
                                      />
                                  ))
                            : "No Keywords"}
                        {topic.keywords.length >
                        settingsConfig.TOPICMANAGER.maxKeywords ? (
                            <Tag
                                label={`+${
                                    topic.keywords.length -
                                    settingsConfig.TOPICMANAGER.maxKeywords
                                }`}
                                tagClass={`keyword`}
                                tooltip={getTagString(topic)}
                                position={"right"}
                            />
                        ) : (
                            ""
                        )}
                    </div>
                    <div className={"topicstable-row-field nphrases"}>
                        <div
                            className={`${
                                index % 2 !== 0 ? "tealcircle" : "primarycircle"
                            }`}
                        >
                            {topic.phrases && topic.phrases.length > 0
                                ? topic.phrases.length
                                : 0}
                        </div>
                    </div>
                    <div className={"topicstable-row-field actions"}>
                        <button
                            type={"button"}
                            className={"accessibility"}
                            onClick={() => props.activateTopic(topic)}
                        >
                            <span className={"topicstable-row-field-edittopic"}>
                                Edit
                            </span>
                        </button>
                        <Popconfirm
                            placement="top"
                            title={"Are you sure to delete this topic?"}
                            onConfirm={() => props.removeTopic(topic.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                danger
                                type="link"
                                className="danger"
                                shape="round"
                            >
                                Remove
                            </Button>
                        </Popconfirm>
                    </div>
                </div>
            );
        });

    return (
        <div className={"user-settings"}>
            <div className="card user-settings-container topicmanager">
                <div className={"user-settings-topsection"}>
                    <div className={"name"}>
                        {settingsConfig.TOPICMANAGER.tabTitle}
                    </div>
                    <div className={"button"}>
                        <Button
                            type={"primary"}
                            shape={"round"}
                            onClick={props.toggleCreator}
                        >
                            {settingsConfig.TOPICMANAGER.btnLabel}
                        </Button>
                    </div>
                </div>
                <div className={"horizontalline"} />
                <div className={"user-settings-searchsection"}>
                    <div className={"searchbar"}>
                        <Input
                            inputName={settingsConfig.TOPICMANAGER.searchName}
                            inputTitle={
                                settingsConfig.TOPICMANAGER.searchPlaceholder
                            }
                            handleChange={(event) =>
                                props.searchTopic(event.target.value)
                            }
                            inputClass={"searchbar-input"}
                            inputPlaceholder={
                                settingsConfig.TOPICMANAGER.searchPlaceholder
                            }
                        />
                    </div>
                    <div className={"options"}>
                        {/* Displaying the count of the topics till the current page. */}

                        <div className={"options-counters"}>
                            {(props.pageNo - 1) *
                                settingsConfig.TOPICMANAGER.topicsPerPage +
                                (props.topics.length > 0 ? 1 : 0) +
                                " "}
                            -{" "}
                            {props.topics.length >=
                            settingsConfig.TOPICMANAGER.topicsPerPage
                                ? props.pageNo *
                                      settingsConfig.TOPICMANAGER
                                          .topicsPerPage +
                                  " "
                                : props.topics.length + " "}
                            OF
                            {" " + props.topics.length}
                        </div>

                        {/* Displaying the page change icons. */}
                        <Icon
                            className={`fa-chevron-left ${
                                props.pageNo <= 1
                                    ? "disabledicon"
                                    : "clickableicon"
                            }`}
                            iconTitle={settingsConfig.PREVLABEL}
                            handleClick={() =>
                                props.pageNo <= 1
                                    ? null
                                    : props.changePage(props.pageNo, false)
                            }
                        />
                        <Icon
                            className={`fa-chevron-right ${
                                props.topics.length >
                                props.pageNo *
                                    settingsConfig.TOPICMANAGER.topicsPerPage
                                    ? "clickableicon"
                                    : "disabledicon"
                            }`}
                            iconTitle={settingsConfig.NEXTLABEL}
                            handleClick={() =>
                                props.topics.length >
                                props.pageNo *
                                    settingsConfig.TOPICMANAGER.topicsPerPage
                                    ? props.changePage(props.pageNo, true)
                                    : null
                            }
                        />
                    </div>
                </div>

                {props.topics.length > 0 ? (
                    <div className={"topicstable"}>
                        <div className={"topicstable-row"}>
                            <div
                                className={
                                    "topicstable-row-field heading topicname"
                                }
                            >
                                {settingsConfig.TOPICMANAGER.nameLabel}
                            </div>
                            <div
                                className={
                                    "topicstable-row-field heading keywords"
                                }
                            >
                                {settingsConfig.TOPICMANAGER.keywordsLabel}
                            </div>
                            <div
                                className={
                                    "topicstable-row-field heading nphrases"
                                }
                            >
                                {settingsConfig.TOPICMANAGER.phrasesLabel}
                            </div>
                            <div
                                className={
                                    "topicstable-row-field heading actions"
                                }
                            >
                                {settingsConfig.TOPICMANAGER.actionsLabel}
                            </div>
                        </div>
                        {topicsTable}
                    </div>
                ) : (
                    <div className={"no-topics"}>
                        <NoData description={"No topics found"} />
                        <Button
                            type={"primary"}
                            shape={"round"}
                            onClick={props.toggleCreator}
                            icon={<PlusOutlined />}
                        >
                            Create a new topic
                        </Button>
                    </div>
                )}
            </div>
            <Modal
                visible={props.showCreator}
                title={settingsConfig.TOPICMANAGER.modalLabel}
                className="modal"
                onOk={props.toggleCreator}
                onCancel={props.toggleCreator}
                footer={[
                    <Button
                        className={"cancel"}
                        key="back"
                        onClick={props.toggleCreator}
                        shape={"round"}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            props.createTopic();
                        }}
                        shape={"round"}
                    >
                        {settingsConfig.TOPICMANAGER.submitLabel}
                    </Button>,
                ]}
            >
                <div className={"modal-contents"}>
                    <form className={"modal-contents-form"}>
                        <div className={"modal-contents-inputfield"}>
                            <Label
                                label={settingsConfig.TOPICMANAGER.nameLabel}
                            />
                            <Input
                                inputRequired={true}
                                inputName={
                                    settingsConfig.TOPICMANAGER.topicName
                                }
                                inputPlaceholder={
                                    settingsConfig.TOPICMANAGER.topicPlaceholder
                                }
                                inputValue={
                                    props.topicToCreate[
                                        settingsConfig.TOPICMANAGER.topicName
                                    ]
                                }
                                handleChange={props.updateTopicToCreate}
                            />
                        </div>
                        <div className={"modal-contents-inputfield"}>
                            <Label
                                label={
                                    settingsConfig.TOPICMANAGER.addKeywordsLabel
                                }
                            />
                            <Input
                                inputRequired={true}
                                inputName={
                                    settingsConfig.TOPICMANAGER.keywordsName
                                }
                                inputPlaceholder={
                                    settingsConfig.TOPICMANAGER
                                        .keywordsPlaceholder
                                }
                                inputValue={
                                    props.topicToCreate[
                                        settingsConfig.TOPICMANAGER.keywordsName
                                    ]
                                }
                                handleChange={props.updateTopicToCreate}
                            />
                            <div className={"alignright"}>
                                {settingsConfig.TOPICMANAGER.minKeywordsLabel}
                            </div>
                        </div>
                        {
                            // Show success and error messages here.
                            props.errorMessage ? (
                                <Error errorMessage={props.errorMessage} />
                            ) : (
                                ""
                            )
                        }
                        {props.successMessage ? (
                            <Success successMessage={props.successMessage} />
                        ) : (
                            ""
                        )}
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default TopicManagerUI;
