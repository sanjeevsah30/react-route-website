import React, { useEffect, useState } from "react";
import { Label, Button as ButtonCustom } from "@reusables";
import config from "@constants/IndividualCall";
import useDebounce from "hooks/useDebounce";
import IndividualCallConfig from "@constants/IndividualCall/index";
import { useDispatch, useSelector } from "react-redux";
import { addFeedback } from "@store/feedback/actions";

function FeedCard({
    feedback,
    idx,
    scale,
    feedbackHandlers,
    userFeedbacks,
    callId,
}) {
    const [newNote, setNewNote] = useState(
        feedback.response ? feedback.response.note : ""
    );
    const debouncedNote = useDebounce(
        newNote,
        IndividualCallConfig.FEEDBACK.AUTOSAVE_DURATION
    );
    const [noteSave, setNoteSave] = useState(false);
    const dispatch = useDispatch();
    const isSavingNote = useSelector((state) => state.common.showLoader);

    useEffect(() => {
        if (debouncedNote) {
            dispatch(
                addFeedback(
                    callId,
                    userFeedbacks[idx],
                    idx,
                    null,
                    debouncedNote
                )
            );
        }
    }, [debouncedNote]);

    useEffect(() => {
        if (isSavingNote) {
            setNoteSave(true);
        }
    }, [isSavingNote]);
    return (
        <div key={feedback.question.id} className="feedback-card">
            <div className="feedback-question">
                <Label label={config.FEEDBACK.question_label} />
                <p className="question font14">{feedback.question.statement}</p>
            </div>
            <div className="feedback-ratings">
                <Label label={config.FEEDBACK.your_response} />
                {feedback.question.question_type ===
                config.FEEDBACK.responseScale ? (
                    <div className="feedback-ratings-scale">
                        {scale.map((rating) => {
                            return (
                                <ButtonCustom
                                    key={rating}
                                    btnClass={
                                        feedback.response &&
                                        feedback.response.response >= rating
                                            ? "active feebackBtn"
                                            : "hollow feebackBtn"
                                    }
                                    btnType="ButtonCustom"
                                    btnLabel={rating}
                                    handleClick={() =>
                                        feedbackHandlers.setRating(
                                            rating,
                                            feedback,
                                            idx
                                        )
                                    }
                                />
                            );
                        })}
                        <ButtonCustom
                            btnClass={
                                feedback.response &&
                                feedback.response.response === -1
                                    ? "active feebackBtn"
                                    : "hollow feebackBtn"
                            }
                            btnType="ButtonCustom"
                            btnLabel={config.FEEDBACK.scaleNA}
                            handleClick={() =>
                                feedbackHandlers.setRating(-1, feedback, idx)
                            }
                        />
                    </div>
                ) : (
                    <div className="feedback-ratings-boolean">
                        <ButtonCustom
                            btnClass={
                                feedback.response &&
                                feedback.response.response === 1
                                    ? "active_yes feebackBtn"
                                    : "hollow feebackBtn"
                            }
                            btnType="ButtonCustom"
                            btnLabel={config.FEEDBACK.scaleTrue}
                            handleClick={() =>
                                feedbackHandlers.setRating(1, feedback, idx)
                            }
                        />
                        <ButtonCustom
                            btnClass={
                                feedback.response &&
                                feedback.response.response === 0
                                    ? "active_no feebackBtn"
                                    : "hollow feebackBtn"
                            }
                            btnType="ButtonCustom"
                            btnLabel={config.FEEDBACK.scaleFalse}
                            handleClick={() =>
                                feedbackHandlers.setRating(0, feedback, idx)
                            }
                        />
                        <ButtonCustom
                            btnClass={
                                feedback.response &&
                                feedback.response.response === -1
                                    ? "active feebackBtn"
                                    : "hollow feebackBtn"
                            }
                            btnType="ButtonCustom"
                            btnLabel={config.FEEDBACK.scaleNA}
                            handleClick={() =>
                                feedbackHandlers.setRating(-1, feedback, idx)
                            }
                        />
                    </div>
                )}
                {/* <div className="feedback-add-note">
            <Button
                icon={<PlusOutlined />}
                type={'primary'}
                shape={'round'}
                onClick={() =>
                    feedbackHandlers.addNote(
                        feedback,
                        idx
                    )
                }
            >
                {config.FEEDBACK.addNoteBtn}
            </Button>
        </div> */}
            </div>
            {
                <div className="feedback-writenote">
                    <textarea
                        name={config.FEEDBACK.NOTES_NAME}
                        placeholder={config.FEEDBACK.NOTES_PLACEHOLDER}
                        value={newNote ? newNote : ""}
                        onChange={(e) => {
                            setNewNote(e.target.value);
                        }}
                    />
                    {isSavingNote ? (
                        <span className="feedback-writeNotesave saving">
                            {config.FEEDBACK.IS_SAVING}
                        </span>
                    ) : (
                        <i
                            className="fa fa-check-circle feedback-writeNotesave"
                            aria-hidden="true"
                        ></i>
                    )}
                </div>
            }
        </div>
    );
}

export default FeedCard;
