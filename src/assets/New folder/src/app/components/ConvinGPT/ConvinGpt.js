import {
    Avatar,
    Button,
    Checkbox,
    Divider,
    Input,
    Modal,
    Popconfirm,
    Skeleton,
} from "antd";

import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { openNotification } from "../../../store/common/actions";
import QAndASvg from "../../static/svg/QAndASvg";
import SendCommentOutlinedSvg from "../../static/svg/SendCommentOutlinedSvg";
import "./styles.scss";
import convinGptConfig from "../../constants/ConvinGpt/index";
import ConvinLogoSvg from "../../static/svg/ConvinLogoSvg";
import {
    NavLink,
    Route,
    Switch,
    useHistory,
    useParams,
} from "react-router-dom";
import { Helmet } from "react-helmet";
import routes from "@constants/Routes/index";
import {
    createChatQueryById,
    createNewChat,
    deleteChatHistoryById,
    getActiveChatHistoryById,
    getGptChatList,
    gptGiveFeedback,
    resetGptChatHistory,
} from "@store/gpt/gptSlice";
import apiErrors from "@apis/common/errors";
import PlusSvg from "app/static/svg/PlusSvg";
import ReactVirtualCard from "@presentational/reusables/ReactVirtualCard";
import DeleteSvg from "app/static/svg/DeleteSvg";
import ThumbsUpAltSvg from "../../static/svg/ThumbsUpAltSvg";
import ThumbsDownSvg from "../../static/svg/ThumbsDownSvg";

const ConvinGpt = () => {
    return (
        <>
            <Switch>
                <Route
                    exact
                    path={[`${routes.GPT}`, `${routes.GPT}/:id`]}
                    render={() => (
                        <>
                            <Helmet>
                                <meta charSet="utf-8" />
                                <title>GPT</title>
                            </Helmet>
                            <ContainerContent />
                        </>
                    )}
                />
            </Switch>
        </>
    );
};

const SampleQuestions = ({ title, ...props }) => {
    return (
        <div className="sample_question_card" {...props}>
            {title}
        </div>
    );
};

const Message = ({
    data: { query, response, isLoadingResponse },
    id,
    setFeedback,
}) => {
    const { first_name } = useSelector((state) => state.auth);
    return (
        <>
            <div className={`chat_message_container`}>
                {!!query?.length && (
                    <div className="chat_message user_chat">
                        <Avatar
                            style={{
                                backgroundColor: "#1a62f2",
                                verticalAlign: "middle",
                            }}
                            className="bold font18 "
                            size={40}
                        >
                            {first_name[0].toUpperCase()}
                        </Avatar>
                        <span className="chat_message--title">{query}</span>
                    </div>
                )}
                {(!!response?.length || isLoadingResponse) && (
                    <div className="chat_message flex bot_chat">
                        <Avatar
                            size={40}
                            icon={<ConvinLogoSvg />}
                            style={{
                                backgroundColor: "#fff",
                                verticalAlign: "middle",
                            }}
                        />
                        <div
                            className="chat_message--content"
                            dangerouslySetInnerHTML={{
                                __html: isLoadingResponse
                                    ? "Typing..."
                                    : response,
                            }}
                        />

                        <div className="chat_message--button">
                            <ThumbsDownSvg
                                onClick={() => {
                                    setFeedback({
                                        open: true,
                                        type: "NEGATIVE",
                                        message_id: +id,
                                    });
                                }}
                            />
                            <ThumbsUpAltSvg
                                onClick={() => {
                                    setFeedback({
                                        open: true,
                                        type: "POSITIVE",
                                        message_id: id,
                                    });
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

const ContainerContent = ({ activeDataset, setActiveDataset }) => {
    const bottomRef = useRef(null);
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [selectVisible, setSelectVisible] = useState(false);

    const scrollToBottom = useCallback(() => {
        if (bottomRef.current)
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const [feedback, setFeedback] = useState({
        open: false,
        message_id: null,
        type: null,
    });

    const {
        gptSlice: {
            is_loading_response,
            gptChat: { data: chatList, loading: chatListLoading, next },
            activeGptChat: { data, loading: loadingChatById },
        },
    } = useSelector((state) => state);

    const dispatch = useDispatch();

    const loadMoreChatList = useCallback(() => {
        if (next) {
            dispatch(getGptChatList({ next }));
        }
    }, [next]);

    const { id } = useParams();
    const history = useHistory();

    const queryRef = useRef(null);

    useEffect(() => {
        dispatch(getGptChatList({ next: null }));
    }, []);

    useEffect(() => {
        if (id && +id !== data?.id) {
            dispatch(getActiveChatHistoryById(id));
        }
    }, [id]);

    useEffect(() => {
        if (data?.messages?.length) {
            scrollToBottom();
        }
    }, [data.messages]);

    const handleDelete = (id_to_delete) => {
        id_to_delete &&
            dispatch(deleteChatHistoryById(id_to_delete)).then(
                ({ payload }) => {
                    if (payload?.status !== apiErrors.AXIOSCOMMONERROR) {
                        if (+id !== +id_to_delete) {
                            return;
                        }
                        const filtered = chatList.filter(
                            (e) => e.id !== id_to_delete
                        );
                        history.push(
                            filtered?.[0]
                                ? `${routes.GPT}/${filtered[0].id}`
                                : `${routes.GPT}`
                        );
                    }
                }
            );
    };

    return (
        <div
            className="gpt_container"
            style={{
                gap: "24px",
            }}
        >
            <div className="gpt_content_container chat--list flex column">
                <div className="gpt_container--header paddingB20 flexShrink0">
                    <div className="gpt_container--header_left paddingT20 paddingLR20">
                        <span className="gpt_container--header_title">
                            All List
                        </span>
                    </div>
                </div>
                <div className="marginT16 flex1 paddingLR20 flex column">
                    <div
                        style={{
                            background: "#1A62F21A",
                            cursor: "pointer",
                        }}
                        className="borderRadius6 bold600 paddingLR8 paddingTB8 primary_cl font16 flex alignCenter justifySpaceBetween marginB20"
                        onClick={() => {
                            dispatch(resetGptChatHistory());
                            history.push(`${routes.GPT}`);
                        }}
                    >
                        <div>New Chat</div>
                        <div
                            style={{
                                background: "#1A62F21A",
                            }}
                            className="borderRadius6 paddingLR8 paddingTB4"
                        >
                            <PlusSvg />
                        </div>
                    </div>
                    {chatListLoading ? (
                        <Skeleton />
                    ) : (
                        <ReactVirtualCard
                            hasNextPage={next}
                            data={chatList || []}
                            onLoadMore={loadMoreChatList}
                            Component={({ id, title }) => {
                                return (
                                    <div className="flex justifySpaceBetween alignCenter">
                                        <NavLink
                                            className="font16 paddingLR8 dove_gray_cl chat_NavLink"
                                            key={id}
                                            to={`${routes.GPT}/${id}`}
                                        >
                                            <span>{title || "New Chat"}</span>
                                        </NavLink>
                                        <Popconfirm
                                            title="Are you sure to delete this Chat?"
                                            onConfirm={() => {
                                                handleDelete(id);
                                            }}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <span className="dove_gray_cl curPoint marginR8">
                                                <DeleteSvg />
                                            </span>
                                        </Popconfirm>{" "}
                                    </div>
                                );
                            }}
                            onClick={() => {}}
                            className="flex1 overflowYscroll"
                        />
                    )}
                </div>
            </div>
            <div className="flex1 gpt_content_container flex column">
                <div className="gpt_container--header padding20">
                    <div className="gpt_container--header_left">
                        <QAndASvg />
                        <span className="gpt_container--header_title primary_cl marginL12">
                            Q&A
                        </span>
                    </div>
                </div>
                <div className="gpt_container--content flex1">
                    {loadingChatById ? (
                        <Skeleton
                            active
                            paragraph={{ rows: 4 }}
                            title={false}
                            className="padding20"
                        />
                    ) : id && data?.messages?.length ? (
                        <>
                            {data?.messages.map((e, idx) => (
                                <Message
                                    data={{
                                        ...e.content,
                                        isLoadingResponse: is_loading_response
                                            ? e.content.response
                                                ? false
                                                : true
                                            : false,
                                    }}
                                    id={e.id}
                                    key={e.id}
                                    setFeedback={setFeedback}
                                />
                            ))}
                            <div ref={bottomRef} className="marginT20"></div>
                            <GptResponseModal {...{ feedback, setFeedback }} />
                        </>
                    ) : (
                        <div className="gpt_container--content_container">
                            <div className="gpt_container--content_title marginT16">
                                Introducing Convin Q&A
                            </div>
                            <div className="gpt_container--content_subtitle">
                                Now ask questions directly and get your
                                insights.
                            </div>
                            <div className="gpt_container--content_question_cards">
                                <div className="gpt_container--content_question_cards_row">
                                    {[].map((e, idx) => {
                                        return (
                                            <SampleQuestions
                                                key={idx}
                                                title={`Ask “${e}”`}
                                                onClick={() => {
                                                    queryRef?.current?.setTextToSearch(
                                                        e
                                                    );
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="gpt_container--footer paddingB20">
                    {/* {messages?.length ? null : (
                            <span>
                                Click on the questions or start typing to start
                                with Q&A
                            </span>
                        )} */}
                    {is_loading_response ? (
                        <p className="loading text-center marginB5">
                            Generating Response
                            <span>.</span>
                            <span>.</span>
                            <span>.</span>
                        </p>
                    ) : (
                        <></>
                    )}
                    <InputQuery {...{ id, activeDataset }} ref={queryRef} />
                </div>
            </div>
        </div>
    );
};

const InputQuery = forwardRef(({ id }, ref) => {
    const dispatch = useDispatch();
    const [query, setQuery] = useState("");
    const {
        gptSlice: { is_loading_response },
    } = useSelector((state) => state);

    const history = useHistory();

    const handleCreate = () => {
        if (!query.length) {
            return;
        }
        if (is_loading_response) {
            return;
        }
        if (id)
            dispatch(
                createChatQueryById({
                    payload: {
                        query: query,
                        chat_id: +id,
                    },
                })
            ).then(({ payload }) => {
                if (payload?.status !== apiErrors.AXIOSCOMMONERROR) {
                    setQuery("");
                }
            });
        else {
            dispatch(
                createNewChat({
                    query,
                })
            ).then(({ payload }) => {
                if (payload?.status !== apiErrors.AXIOSCOMMONERROR) {
                    if (payload.data.id) {
                        history.push(`${routes.GPT}/${payload.data.id}`);
                        setQuery("");
                    }
                }
            });
        }
    };
    useImperativeHandle(
        ref,
        () => {
            return {
                setTextToSearch(e) {
                    setQuery(e);
                },
            };
        },
        []
    );
    return (
        <div className="gpt_container--footer_chatbox">
            <Input
                onChange={(e) => {
                    setQuery(e.target.value);
                }}
                placeholder="Type something here"
                value={query}
                onPressEnter={handleCreate}
            />
            <Divider type="vertical" />

            <Button
                disabled={is_loading_response}
                onClick={() => {
                    handleCreate();
                }}
                icon={<SendCommentOutlinedSvg />}
            />
        </div>
    );
}, []);

const GptResponseModal = ({
    feedback: { type, message_id, open },
    setFeedback,
}) => {
    const [response, setResponse] = useState(null);
    const [checkedOptions, setCheckedOptions] = useState([]);
    const dispatch = useDispatch();

    const {
        gptSlice: { is_submitting_feedback },
    } = useSelector((state) => state);
    return (
        <Modal
            visible={open}
            onCancel={() => {
                setFeedback({ type: null, message_id: null, open: false });
            }}
            title={
                <div className="gpt_response_modal--header">
                    <div
                        className="svg_container"
                        style={{
                            backgroundColor:
                                type === "POSITIVE" ? "#1A62F21A" : "#FF60581A",
                        }}
                    >
                        {type === "POSITIVE" ? (
                            <ThumbsUpAltSvg stroke="#1a62f2" />
                        ) : (
                            <ThumbsDownSvg stroke="#FF6058" />
                        )}
                    </div>
                    <span className="title">Provide Additional Feedback</span>
                </div>
            }
            footer={
                <Button
                    onClick={() => {
                        if (is_submitting_feedback) {
                            return;
                        }
                        if (!response)
                            return openNotification(
                                "error",
                                "Error",
                                "Enter a message"
                            );
                        dispatch(
                            gptGiveFeedback({
                                type,
                                message_id,
                                content: {
                                    response,
                                    checklist: checkedOptions,
                                },
                            })
                        ).then((payload) => {
                            if (
                                payload?.status !== apiErrors.AXIOSCOMMONERROR
                            ) {
                                setFeedback({
                                    type: null,
                                    message_id: null,
                                    open: false,
                                });
                                setResponse("");
                            }
                        });
                        setResponse(null);
                        setCheckedOptions([]);
                    }}
                    loading={is_submitting_feedback}
                    type="primary"
                >
                    Submit Feedback
                </Button>
            }
            wrapClassName={`gpt_response_modal ${type}_response`}
            width="780px"
        >
            <Input.TextArea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="What do you like about the response?"
            />
            {type === "NEGATIVE" ? (
                <Checkbox.Group
                    value={checkedOptions}
                    options={convinGptConfig.badResponseOptions}
                    onChange={(checked) => {
                        setCheckedOptions(checked);
                    }}
                />
            ) : null}
        </Modal>
    );
};

export default ConvinGpt;
