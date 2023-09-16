import React, { useEffect, useState, useRef } from "react";
import settingsConfig from "@constants/Settings";
import { Input, Tag, Label, Icon } from "@reusables";
import { Button, Drawer } from "antd";
import { uid } from "@tools/helpers";

const TopicSidePane = (props) => {
    const sidePaneRef = useRef(null);
    const [isEditingKeywords, setisEditingKeywords] = useState(true);
    const [isEditingPhrases, setisEditingPhrases] = useState(true);

    const finishEditingKeywords = () => {
        setisEditingKeywords(false);
        // Now send the updated data to the parent component.
    };
    const finishEditingPhrases = () => {
        setisEditingPhrases(false);
    };

    return (
        <Drawer onClose={props.togglePane} visible={props.showTopicPane}>
            <div className={"topicsidepane"} ref={sidePaneRef}>
                <div className={"topicsidepane-top"}>
                    {settingsConfig.TOPICMANAGER.topic} :{" "}
                    {props.editingTopic && props.editingTopic.name
                        ? props.editingTopic.name
                        : ""}
                </div>
                <div className={"topicsidepane-contents"}>
                    <div className={"topicsidepane-contents-keywords"}>
                        <div className={"details"}>
                            <Label
                                label={
                                    settingsConfig.TOPICMANAGER
                                        .topicKeywordsLabel
                                }
                            />
                            {isEditingKeywords ? (
                                <div className={"inputcontainer"}>
                                    <Input
                                        inputPlaceholder={
                                            settingsConfig.TOPICMANAGER
                                                .addKeyword
                                        }
                                        inputValue={props.keywordToAdd}
                                        handleChange={(e) =>
                                            props.setkeywordToAdd(
                                                e.target.value
                                            )
                                        }
                                        handleKeyUp={(e) => {
                                            if (
                                                e.keyCode === 13 ||
                                                e.which === 13
                                            ) {
                                                props.addKeyword();
                                            }
                                        }}
                                    />
                                    <div
                                        title={
                                            settingsConfig.TOPICMANAGER
                                                .addKeyword
                                        }
                                        className={"addbutton"}
                                        onClick={props.addKeyword}
                                    >
                                        <Icon className={"fa-plus"} />
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                            <button
                                className={"accessibility"}
                                onClick={() =>
                                    !isEditingKeywords
                                        ? setisEditingKeywords(true)
                                        : finishEditingKeywords()
                                }
                                type={"button"}
                            >
                                {/* <label
                                    className={"editlabel"}
                                >
                                    {!isEditingKeywords
                                        ? settingsConfig.TOPICMANAGER.editLabel
                                        : settingsConfig.DONE_EDIT}
                                </label> */}
                            </button>
                        </div>
                        <div className={"keywordscontainer"}>
                            {props.editingTopic.keywords &&
                            props.editingTopic.keywords.length > 0
                                ? props.editingTopic.keywords.map(
                                      (keyword, index) => (
                                          <Tag
                                              label={keyword}
                                              isEditable={isEditingKeywords}
                                              key={uid() + index}
                                              tagId={index}
                                              handleRemoveTag={(keywordId) =>
                                                  props.removeKeyword(
                                                      props.editingTopic.id,
                                                      keywordId
                                                  )
                                              }
                                          />
                                      )
                                  )
                                : settingsConfig.TOPICMANAGER.noKeywords}
                        </div>
                    </div>
                    <div className={"topicsidepane-contents-phrases nphrases"}>
                        <div className={"details"}>
                            <Label
                                label={
                                    settingsConfig.TOPICMANAGER
                                        .topicPhrasesLabel
                                }
                            />
                            {isEditingPhrases ? (
                                <div className={"inputcontainer"}>
                                    <Input
                                        inputPlaceholder={
                                            settingsConfig.TOPICMANAGER
                                                .addPhrase
                                        }
                                        inputValue={props.phraseToAdd}
                                        handleChange={(e) =>
                                            props.setphraseToAdd(e.target.value)
                                        }
                                        handleKeyUp={(e) => {
                                            if (
                                                e.keyCode === 13 ||
                                                e.which === 13
                                            ) {
                                                props.addPhrase();
                                            }
                                        }}
                                    />
                                    <div
                                        title={
                                            settingsConfig.TOPICMANAGER
                                                .addPhrase
                                        }
                                        className={"addbutton"}
                                        onClick={props.addPhrase}
                                    >
                                        <Icon className={"fa-plus"} />
                                    </div>
                                </div>
                            ) : (
                                ""
                            )}
                            <button
                                className={"accessibility"}
                                onClick={() =>
                                    !isEditingPhrases
                                        ? setisEditingPhrases(true)
                                        : finishEditingPhrases()
                                }
                                type={"button"}
                            >
                                <label className={"editlabel"}>
                                    {!isEditingPhrases
                                        ? settingsConfig.TOPICMANAGER.editLabel
                                        : settingsConfig.DONE_EDIT}
                                </label>
                            </button>
                        </div>
                        <div className={"phrasescontainer"}>
                            {props.editingTopic.phrases &&
                            props.editingTopic.phrases.length > 0
                                ? props.editingTopic.phrases.map(
                                      (phrase, index) => (
                                          <Tag
                                              label={phrase}
                                              isEditable={isEditingPhrases}
                                              key={uid() + index}
                                              tagId={index}
                                              handleRemoveTag={() =>
                                                  props.removePhrase(
                                                      props.editingTopic.id,
                                                      index
                                                  )
                                              }
                                          />
                                      )
                                  )
                                : settingsConfig.TOPICMANAGER.noPhrases}
                        </div>
                    </div>
                </div>
                <div className={"topicsidepane-bottom"}>
                    <Button type="link" onClick={props.togglePane}>
                        {settingsConfig.CANCELTITLE}
                    </Button>

                    <Button
                        type="primary"
                        shape={"round"}
                        onClick={props.updateTopic}
                    >
                        {settingsConfig.TOPICMANAGER.updateTopic}
                    </Button>
                </div>
            </div>
        </Drawer>
    );
};

export default TopicSidePane;
