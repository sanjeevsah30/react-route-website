import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Label, DropdownSelect, Button as ButtonCustom } from "@reusables";
import config from "@constants/IndividualCall";
import { searchInArray } from "@helpers";
import { Button } from "antd";
import NoData from "@presentational/reusables/NoData";
import { useSelector } from "react-redux";

export default function GetFeedback(props) {
    const { isNotesLoading } = useSelector((state) => state.feedback);
    let [count, setCount] = useState(0);
    for (
        var i, scale = [(i = 1)];
        i < config.FEEDBACK.scaleNumber;
        scale[i++] = i
    );
    return (
        <div className="feedback-wrapper">
            <div className="feedback-by">
                <div className="feedback-by-title">
                    <h3>{config.FEEDBACK.feedbackByTitle}</h3>
                </div>
                <div className="feedback-by-dropdown">
                    <DropdownSelect
                        withIds={false}
                        options={props.users}
                        handleChange={props.feedbackHandlers.handleFeedbackBy}
                        selectName={config.FEEDBACK.feedbackBy}
                        selectTitle={config.FEEDBACK.feedbackBy}
                        selectValue={props.feedbackBy}
                        isIdLabelArray={true}
                    />
                </div>
            </div>
            {props.feedbackBy === 0 ? (
                <>
                    {!!props.allFeedbacks.length ? (
                        props.allFeedbacks.map((feedback, idx) => {
                            return (
                                <div key={idx} className="feedback-card">
                                    <div className="feedback-question">
                                        <Label
                                            label={
                                                config.FEEDBACK.question_label
                                            }
                                        />
                                        <p className="question font14">
                                            {feedback.question.statement}
                                        </p>
                                    </div>
                                    <div className="feedback-ratings">
                                        {feedback.question.question_type ===
                                        config.FEEDBACK.responseScale ? (
                                            <div className="feedback-ratings-scale all">
                                                <Label
                                                    label={
                                                        config.FEEDBACK.ratings
                                                    }
                                                />
                                                <p className="ratings">
                                                    {feedback.response
                                                        ? Number(
                                                              feedback.response
                                                                  .avg
                                                          ).toFixed(2)
                                                        : 0}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="feedback-ratings-boolean all">
                                                <div className="label-yes">
                                                    <Label
                                                        label={
                                                            config.FEEDBACK
                                                                .LABEL_YES
                                                        }
                                                    />
                                                    <ButtonCustom
                                                        btnClass={
                                                            "hollow feebackBtn showFeedback"
                                                        }
                                                        btnType="button"
                                                        btnLabel={
                                                            feedback.response
                                                                ? feedback
                                                                      .response
                                                                      .true
                                                                : 0
                                                        }
                                                    />
                                                </div>
                                                <div className="label-yes">
                                                    <Label
                                                        label={
                                                            config.FEEDBACK
                                                                .LABEL_NO
                                                        }
                                                    />
                                                    <ButtonCustom
                                                        btnClass={
                                                            "hollow feebackBtn showFeedback"
                                                        }
                                                        btnType="button"
                                                        btnLabel={
                                                            feedback.response
                                                                ? feedback
                                                                      .response
                                                                      .false
                                                                : 0
                                                        }
                                                    />
                                                </div>
                                                <div className="label-yes">
                                                    <Label
                                                        label={
                                                            config.FEEDBACK
                                                                .LABEL_NA
                                                        }
                                                    />
                                                    <ButtonCustom
                                                        btnClass={
                                                            "hollow feebackBtn showFeedback"
                                                        }
                                                        btnType="button"
                                                        btnLabel={
                                                            feedback.response
                                                                ? feedback
                                                                      .response
                                                                      .na
                                                                : 0
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div className="feedback-add-note">
                                            <Button
                                                icon={<PlusOutlined />}
                                                type={"primary"}
                                                shape={"round"}
                                                onClick={() =>
                                                    props.feedbackHandlers.showAllNotes(
                                                        feedback.question.id
                                                    )
                                                }
                                            >
                                                {config.FEEDBACK.SHOW_NOTES}
                                            </Button>
                                        </div>
                                        <div className="feedback-notes-wrapper">
                                            {props.activeNote.show &&
                                                props.activeNote.feedback ===
                                                    feedback.question.id && (
                                                    <>
                                                        <Label
                                                            labelClass={"title"}
                                                            label={
                                                                config.FEEDBACK
                                                                    .NOTES
                                                            }
                                                        />

                                                        {isNotesLoading ? (
                                                            <p className="loading text-center">
                                                                LOADING
                                                                <span>.</span>
                                                                <span>.</span>
                                                                <span>.</span>
                                                            </p>
                                                        ) : props.allNotes[
                                                              feedback.question
                                                                  .id
                                                          ] ? (
                                                            <>
                                                                {props.allNotes[
                                                                    feedback
                                                                        .question
                                                                        .id
                                                                ].map(
                                                                    (
                                                                        note,
                                                                        idx
                                                                    ) => {
                                                                        let owner =
                                                                            searchInArray(
                                                                                props.users,
                                                                                note.owner
                                                                            );
                                                                        note?.note ===
                                                                            "" &&
                                                                            count++;
                                                                        return owner &&
                                                                            note?.note ? (
                                                                            <div
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                className="feedback-notes all"
                                                                            >
                                                                                <Label
                                                                                    label={
                                                                                        Object.values(
                                                                                            owner
                                                                                        )[0]
                                                                                    }
                                                                                />
                                                                                <p className="note">
                                                                                    {
                                                                                        note.note
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        ) : (
                                                                            ""
                                                                        );
                                                                    }
                                                                )}
                                                                {count ===
                                                                props.allNotes[
                                                                    feedback
                                                                        .question
                                                                        .id
                                                                ].length ? (
                                                                    <p className="note">
                                                                        <Label
                                                                            labelClass="nonotes"
                                                                            label={
                                                                                config
                                                                                    .FEEDBACK
                                                                                    .NO_NOTES
                                                                            }
                                                                        />
                                                                    </p>
                                                                ) : (
                                                                    <></>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <NoData description={"No feedbacks found"} />
                    )}
                </>
            ) : (
                <>
                    {!!props?.userFeedbacks?.length ? (
                        <>
                            {props.userFeedbacks &&
                                props.userFeedbacks.map((feedback, idx) => {
                                    return (
                                        <div
                                            key={idx}
                                            className="feedback-card"
                                        >
                                            <div className="feedback-question">
                                                <Label
                                                    label={
                                                        config.FEEDBACK
                                                            .question_label
                                                    }
                                                />
                                                <p className="question font14">
                                                    {
                                                        feedback.question
                                                            .statement
                                                    }
                                                </p>
                                            </div>
                                            <div className="feedback-ratings">
                                                <Label
                                                    label={
                                                        config.FEEDBACK.response
                                                    }
                                                />
                                                {feedback.question
                                                    .question_type ===
                                                config.FEEDBACK
                                                    .responseScale ? (
                                                    <div className="feedback-ratings-scale">
                                                        {scale.map((rating) => {
                                                            return (
                                                                <ButtonCustom
                                                                    key={rating}
                                                                    btnClass={
                                                                        feedback.response &&
                                                                        feedback
                                                                            .response
                                                                            .response ===
                                                                            rating
                                                                            ? "active feebackBtn showFeedback"
                                                                            : "hollow feebackBtn showFeedback"
                                                                    }
                                                                    btnType="button"
                                                                    btnLabel={
                                                                        rating
                                                                    }
                                                                />
                                                            );
                                                        })}
                                                        <ButtonCustom
                                                            btnClass={
                                                                feedback.response &&
                                                                feedback
                                                                    .response
                                                                    .response ===
                                                                    -1
                                                                    ? "active feebackBtn showFeedback"
                                                                    : "hollow feebackBtn showFeedback"
                                                            }
                                                            btnType="button"
                                                            btnLabel={
                                                                config.FEEDBACK
                                                                    .scaleNA
                                                            }
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="feedback-ratings-boolean">
                                                        <ButtonCustom
                                                            btnClass={
                                                                feedback.response &&
                                                                feedback
                                                                    .response
                                                                    .response ===
                                                                    1
                                                                    ? "active feebackBtn showFeedback"
                                                                    : "hollow feebackBtn showFeedback"
                                                            }
                                                            btnType="button"
                                                            btnLabel={
                                                                config.FEEDBACK
                                                                    .scaleTrue
                                                            }
                                                        />
                                                        <ButtonCustom
                                                            btnClass={
                                                                feedback.response &&
                                                                feedback
                                                                    .response
                                                                    .response ===
                                                                    0
                                                                    ? "active feebackBtn showFeedback"
                                                                    : "hollow feebackBtn showFeedback"
                                                            }
                                                            btnType="button"
                                                            btnLabel={
                                                                config.FEEDBACK
                                                                    .scaleFalse
                                                            }
                                                        />
                                                        <ButtonCustom
                                                            btnClass={
                                                                feedback.response &&
                                                                feedback
                                                                    .response
                                                                    .response ===
                                                                    -1
                                                                    ? "active feebackBtn showFeedback"
                                                                    : "hollow feebackBtn showFeedback"
                                                            }
                                                            btnType="button"
                                                            btnLabel={
                                                                config.FEEDBACK
                                                                    .scaleNA
                                                            }
                                                        />
                                                    </div>
                                                )}
                                                <div className="feedback-notes">
                                                    <Label
                                                        label={
                                                            config.FEEDBACK
                                                                .NOTES
                                                        }
                                                    />
                                                    <p className="note">
                                                        {feedback.response &&
                                                        feedback.response
                                                            .note ? (
                                                            feedback.response
                                                                .note
                                                        ) : (
                                                            <Label
                                                                labelClass="nonotes"
                                                                label={
                                                                    config
                                                                        .FEEDBACK
                                                                        .NO_NOTES
                                                                }
                                                            />
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </>
                    ) : (
                        <NoData description={"No feedbacks found"} />
                    )}
                </>
            )}
        </div>
    );
}
