import React, { useState } from "react";
import ThumbsUpAltSvg from "../../static/svg/ThumbsUpAltSvg";
import ThumbsDownSvg from "../../static/svg/ThumbsDownSvg";

import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Modal } from "antd";

const Summary = ({ meeting_summary }) => {
    const [feedback, setFeedback] = useState({
        open: false,
        message_id: null,
        type: null,
    });
    return (
        <div
            className="height100p padding20"
            style={{
                border: "1px solid rgba(153, 153, 153, 0.2)",
                borderTop: 0,
            }}
        >
            <div className="title mine_shaft_cl font18 bold600 marginB12">
                Conversation Summary
            </div>
            <div
                className={`summary_container paddingTB12 paddingL12 borderRadius5 ${
                    typeof meeting_summary !== "string" && "overflowYscroll"
                }`}
                style={{
                    border: "1px solid rgba(153, 153, 153, 0.2)",
                    height: "75%",
                }}
            >
                <div className="dove_gray_cl marginB10">
                    Below is the brief summary of the conversation :
                </div>
                {typeof meeting_summary === "string" ? (
                    <pre
                        className="marginR10 paddingL20 paddingR10 height100p overflowYscroll"
                        style={{
                            whiteSpace: "pre-wrap",
                            marginBottom: "2px",
                        }}
                    >
                        {meeting_summary}
                    </pre>
                ) : (
                    <ul className="paddingL5 marginL15">
                        {meeting_summary?.map((item, index) => (
                            <li
                                key={index}
                                style={{
                                    listStyleType: "disc",
                                    color: "black",
                                }}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {/* <div className="chat_message--button">
                <ThumbsDownSvg
                    onClick={() => {
                        setFeedback({
                            open: true,
                            type: 'NEGATIVE',
                            meeting_id: 174123,
                        });
                    }}
                />
                <ThumbsUpAltSvg
                    onClick={() => {
                        setFeedback({
                            open: true,
                            type: 'POSITIVE',
                            message_id: 174216,
                        });
                    }}
                />
            </div> */}
            <GptResponseModal {...{ feedback, setFeedback }} />
        </div>
    );
};

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
                    // onClick={() => {
                    //     if (is_submitting_feedback) {
                    //         return;
                    //     }
                    //     if (!response)
                    //         return openNotification(
                    //             'error',
                    //             'Error',
                    //             'Enter a message'
                    //         );
                    //     dispatch(
                    //         gptGiveFeedback({
                    //             type,
                    //             message_id,
                    //             content: {
                    //                 response,
                    //                 checklist: checkedOptions,
                    //             },
                    //         })
                    //     ).then((payload) => {
                    //         if (
                    //             payload?.status !== apiErrors.AXIOSCOMMONERROR
                    //         ) {
                    //             setFeedback({
                    //                 type: null,
                    //                 message_id: null,
                    //                 open: false,
                    //             });
                    //             setResponse('');
                    //         }
                    //     });
                    //     setResponse(null);
                    //     setCheckedOptions([]);
                    // }}
                    // loading={is_submitting_feedback}
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
            {/* {type === 'NEGATIVE' ? (
                <Checkbox.Group
                    value={checkedOptions}
                    options={convinGptConfig.badResponseOptions}
                    onChange={(checked) => {
                        setCheckedOptions(checked);
                    }}
                />
            ) : null} */}
        </Modal>
    );
};

export default Summary;
