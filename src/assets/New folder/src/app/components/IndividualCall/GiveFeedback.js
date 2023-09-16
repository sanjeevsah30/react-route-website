import React from "react";
import config from "@constants/IndividualCall";
import NoData from "@presentational/reusables/NoData";
import FeedbackCard from "./FeedbackCard";

export default function GiveFeedback(props) {
    for (
        var i, scale = [(i = 1)];
        i < config.FEEDBACK.scaleNumber;
        scale[i++] = i
    );

    return (
        <div className="feedback-wrapper">
            {!!props.userFeedbacks?.length ? (
                props.userFeedbacks.map((feedback, idx) => {
                    return (
                        <FeedbackCard
                            key={idx}
                            feedback={feedback}
                            idx={idx}
                            scale={scale}
                            feedbackHandlers={props.feedbackHandlers}
                            userFeedbacks={props.userFeedbacks}
                            callId={props.callId}
                        />
                    );
                })
            ) : (
                <NoData description="No feedbacks found" />
            )}
        </div>
    );
}
