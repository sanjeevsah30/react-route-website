import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import config from "@constants/Settings";
import TopicManagerUI from "@presentational/Settings/TopicManagerUI";
import TopicSidePane from "@presentational/Settings/TopicSidePane";
import {
    getAllTopics,
    createNewTopic,
    deleteTopic,
    updateTopic,
} from "@apis/topics";
import apiErrors from "@apis/common/errors";
import settingsConfig from "@constants/Settings";
import { openNotification } from "@store/common/actions";
import withReactTour from "hoc/withReactTour";

const TopicManager = (props) => {
    const domain = useSelector((state) => state.common.domain);
    const [topics, settopics] = useState([]);
    const [showCreator, setshowCreator] = useState(false);
    const [pageno, setpageno] = useState(1);
    const [showPopup, setshowPopup] = useState(false); // The popup for confirming whether the user wants to delete a topic.
    const [topicToRemove, settopicToRemove] = useState(-1);
    const [searchSpec, setsearchSpec] = useState({
        active: false,
        searchText: "",
    });
    const [showTopicPane, setshowTopicPane] = useState(false);
    // const [searchedTopics, setsearchedTopics] = useState([]);
    const [editingTopic, seteditingTopic] = useState({}); // Copy of the active topic in order to mutate it locally and then update the topics accordingly.
    const [keywordToAdd, setkeywordToAdd] = useState("");
    const [phraseToAdd, setphraseToAdd] = useState("");
    const [topicToCreate, settopicToCreate] = useState({
        [config.TOPICMANAGER.topicName]: "",
        [config.TOPICMANAGER.keywordsName]: "",
        [config.TOPICMANAGER.phrasesName]: "",
    });
    const [errorMessage, seterrorMessage] = useState("");
    const [successMessage, setsuccessMessage] = useState("");

    const toggleCreator = () => {
        if (!showCreator) {
            seterrorMessage("");
        }
        setshowCreator(!showCreator);
    };
    const togglePane = () => setshowTopicPane(!showTopicPane);
    const togglePopup = (topicIndex = -1) => {
        settopicToRemove(topicIndex);
        setshowPopup(!showPopup);
    };
    const activateTopic = (topic) => {
        seteditingTopic(topic);
        setshowTopicPane(true);
    };
    const searchTopic = (searchText = "") => {
        // Activating search for the topics.
        if (searchText) {
            setsearchSpec({ active: true, searchText });
            setpageno(1);
        } else setsearchSpec({ active: false, searchText: "" });
    };
    const changePage = (currentPage = 1, next = true) => {
        // Function to change page.
        if (next === true) {
            // If the next page button is clicked.

            if (
                currentPage * settingsConfig.TOPICMANAGER.topicsPerPage <
                topics.length
            )
                setpageno(currentPage + 1); // Only update the page no if there are more topics to show.
        } else {
            // If the previous page button is clicked.

            if (pageno > 1) setpageno(pageno - 1);
        }
    };
    const removeTopic = (topicId) => {
        setshowTopicPane(false);
        seteditingTopic({});
        setshowPopup(false);
        deleteTopic(domain, topicId).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                let topicToRemoveIdx;
                for (let index = 0; index < topics.length; index++) {
                    if (topics[index].id == topicId) {
                        topicToRemoveIdx = index;
                        break;
                    }
                }
                let newtopics = new Array(...topics);
                newtopics.splice(topicToRemoveIdx, 1);
                settopics(newtopics);
            }
        });
    };
    const editingHandlers = {
        updateTopic: () => {
            let topicId = editingTopic.id;
            updateTopic(
                domain,
                {
                    name: editingTopic.name,
                    phrases: editingTopic.keywords,
                },
                topicId
            ).then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    seterrorMessage(res.message);
                } else {
                    let newtopics = new Array(...topics);
                    let topictoUpdate = newtopics
                        .map((topic, idx) => {
                            if (topic.id === res.id) return idx;
                        })
                        .filter((x) => x !== undefined)[0];
                    newtopics.splice(topictoUpdate, 1);
                    newtopics = [
                        {
                            id: res.id,
                            name: res.name,
                            keywords:
                                res.phrases.length > 0
                                    ? res.phrases.map((key) => key.phrase)
                                    : [],
                        },
                        ...newtopics,
                    ];
                    settopics(newtopics);
                }
            });
            togglePane();

            // Now update the topics in the frontend for now.
            seteditingTopic({});
        },
        removePhrase: (topicid, phraseIndex) => {
            let allphrases = editingTopic.phrases;
            allphrases.splice(editingTopic.phrases[phraseIndex], 1);
            seteditingTopic({
                ...editingTopic,
                phrases: allphrases,
            });
        },
        removeKeyword: (topicId, keywordIndex) => {
            let allKeywords = editingTopic.keywords;
            allKeywords.splice(keywordIndex, 1);
            seteditingTopic({
                ...editingTopic,
                keywords: allKeywords,
            });
        },
        addPhrase: () => {
            if (phraseToAdd) {
                seteditingTopic({
                    ...editingTopic,
                    phrases: [phraseToAdd, ...editingTopic.phrases],
                });
                setphraseToAdd("");
            }
        },
        addKeyword: () => {
            if (keywordToAdd) {
                seteditingTopic({
                    ...editingTopic,
                    keywords: [...editingTopic.keywords, keywordToAdd],
                });
                setkeywordToAdd("");
            }
        },
    };
    const creatorHandlers = {
        // Functions for the create topic modal box.
        updateTopicToCreate: (event) => {
            settopicToCreate({
                ...topicToCreate,
                [event.target.name]: event.target.value,
            });
        },
        createTopic: () => {
            if (topicToCreate[config.TOPICMANAGER.topicName]) {
                // Getting the array of keywords.
                let keywordsToCreate = topicToCreate[
                    config.TOPICMANAGER.keywordsName
                ].replace(/,+/g, ",");
                keywordsToCreate = keywordsToCreate
                    .replace(/^\s+|\s+$/g, "")
                    .split(",")
                    .filter(function (e) {
                        return e.length;
                    });

                let phrasesToCreate = topicToCreate[
                    config.TOPICMANAGER.phrasesName
                ]
                    .split(",")
                    .map((phrase) => phrase.trim());

                // Now check if the keywords count to more than 3.
                // And that Phrases are at least one.
                if (
                    keywordsToCreate.length < config.TOPICMANAGER.minKeywords ||
                    phrasesToCreate.length < config.TOPICMANAGER.minPhrases
                ) {
                    seterrorMessage("Please check keywords count");
                    setTimeout(() => seterrorMessage(""), 2000);
                } else {
                    let newTopic = {
                        name: topicToCreate[config.TOPICMANAGER.topicName],
                        [config.TOPICMANAGER.keywordsName]: keywordsToCreate,
                        [config.TOPICMANAGER.phrasesName]: phrasesToCreate,
                    };

                    // Clear the topic to create object.
                    createNewTopic(domain, {
                        ...newTopic,
                        [config.TOPICMANAGER.keywordsName]: keywordsToCreate,
                    }).then((res) => {
                        if (
                            res.status &&
                            res.status === apiErrors.AXIOSERRORSTATUS
                        ) {
                            seterrorMessage(res.message);
                        } else {
                            settopics([
                                {
                                    id: res.id,
                                    name: res.name,
                                    keywords: res.phrases.map(
                                        (key) => key.phrase
                                    ),
                                },
                                ...topics,
                            ]);
                            setsuccessMessage("Successfully Created Topic.");
                            settopicToCreate({
                                [config.TOPICMANAGER.keywordsName]: "",
                                [config.TOPICMANAGER.topicName]: "",
                                [config.TOPICMANAGER.phrasesName]: "",
                            });

                            setTimeout(() => {
                                setsuccessMessage("");
                                setshowCreator(false);
                            }, 2000);
                        }
                    });
                }
            } else {
                seterrorMessage("Please enter topic name");
                setTimeout(() => {
                    seterrorMessage("");
                }, 2000);
            }
        },
    };
    const getTopics = () => {
        // Get the Topics using the searchText. Here, make an API call and set the topics.
        // For now, filter the topics by their names.
        if (searchSpec.active && searchSpec.searchText) {
            let topicRegex = new RegExp(searchSpec.searchText, "gi");
            let foundTopics = [];
            for (let i = 0; i < topics.length; i++) {
                if (
                    topicRegex.test(topics[i].name) ||
                    topics[i].keywords.includes(searchSpec.searchText)
                )
                    foundTopics.push(topics[i]);
            }
            return foundTopics;
        }
        return topics;
    };

    useEffect(() => {
        getAllTopics(domain).then((topics) => {
            if (topics.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", topics.message);
            } else {
                let topicData =
                    topics.hasOwnProperty("results") &&
                    topics.results.length > 0
                        ? topics.results
                        : topics;
                let newtopics = topicData.map((topic) => {
                    return (topic = {
                        id: topic.id,
                        name: topic.name,
                        keywords: topic.phrases.map((key) => key.phrase),
                    });
                });
                settopics(newtopics);
            }
        });
    }, []);

    return (
        <>
            <TopicManagerUI
                toggleCreator={toggleCreator}
                togglePane={togglePane}
                togglePopup={togglePopup}
                activateTopic={activateTopic}
                searchTopic={searchTopic}
                removeTopic={removeTopic}
                changePage={changePage}
                showCreator={showCreator}
                showPopup={showPopup}
                topics={
                    searchSpec.active && searchSpec.searchText
                        ? getTopics()
                        : topics
                }
                pageNo={pageno}
                // Topic Creator Handlers
                topicToCreate={topicToCreate}
                topicToRemove={topicToRemove}
                {...creatorHandlers}
                errorMessage={errorMessage}
                successMessage={successMessage}
            />

            {showTopicPane ? (
                <TopicSidePane
                    editingTopic={editingTopic}
                    togglePane={togglePane}
                    phraseToAdd={phraseToAdd}
                    setphraseToAdd={setphraseToAdd}
                    keywordToAdd={keywordToAdd}
                    setkeywordToAdd={setkeywordToAdd}
                    {...editingHandlers}
                    showTopicPane={showTopicPane}
                />
            ) : (
                ""
            )}
        </>
    );
};
export default withReactTour(TopicManager);
