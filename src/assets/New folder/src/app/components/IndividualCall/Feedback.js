import React, { useEffect } from "react";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeftOutlined } from "@ant-design/icons";
import FeedbackCategories from "../FeedbackCategories/FeedbackCategories";
import Spinner from "@presentational/reusables/Spinner";
import { getUserFeedbacks, setActiveCategory } from "@store/feedback/actions";
const GetFeedback = React.lazy(() => import("./GetFeedbacks"));
const GiveFeedback = React.lazy(() => import("./GiveFeedback"));

function Feedback({
    activeCall,
    user,
    feedbackHandlers,
    activeNote,
    userFeedbacks,
    allNotes,
    newNote,
    callId,
    users,
    feedbackBy,
    hideFeedbackDrawer,
}) {
    const active_category = useSelector(
        (state) => state.feedback.active_category
    );
    const active_category_name = useSelector(
        (state) => state.feedback.active_category_name
    );
    const allFeedbacks = useSelector((state) => state.feedback.all_feedbacks);
    const loading = useSelector((state) => state.feedback.loading);

    const dispatch = useDispatch();

    useEffect(() => {
        if (active_category) {
            if (feedbackBy !== 0) {
                dispatch(getUserFeedbacks(callId, feedbackBy));
            } else if (activeCall.callDetails.owner.id === user.id) {
                dispatch(getUserFeedbacks(callId));
            } else {
                dispatch(getUserFeedbacks(callId, user.id));
            }
        }
    }, [feedbackBy, active_category]);
    return (
        <>
            {active_category ? (
                <>
                    <div className="paddingLR12 paddingTB6 borderBottom feedbackHeader flex">
                        <Button
                            onClick={() => dispatch(setActiveCategory(0))}
                            type="link"
                        >
                            <ArrowLeftOutlined />
                            &nbsp;
                            <span className="capitalize font14">
                                {active_category_name}
                            </span>
                        </Button>
                        <Button
                            type="text"
                            className="header"
                            onClick={hideFeedbackDrawer}
                        >
                            &times;
                        </Button>
                    </div>
                    {loading ? (
                        <Spinner loading={loading}>
                            <div></div>
                        </Spinner>
                    ) : +activeCall.callDetails.owner.id === +user.id ? (
                        <GetFeedback
                            feedbackHandlers={feedbackHandlers}
                            feedbackBy={feedbackBy}
                            users={users}
                            activeNote={activeNote}
                            userFeedbacks={userFeedbacks[feedbackBy]}
                            allFeedbacks={allFeedbacks}
                            allNotes={allNotes}
                        />
                    ) : (
                        <GiveFeedback
                            userFeedbacks={userFeedbacks[user.id]}
                            feedbackHandlers={feedbackHandlers}
                            newNote={newNote}
                            activeNote={activeNote}
                            userId={user.id}
                            callId={callId}
                        />
                    )}
                </>
            ) : (
                <div className="feedback-wrapper">
                    <div className="borderBottomBold paddingLR20 paddingTB6 flex justifySpaceBetween alignCenter">
                        <Button
                            type="text"
                            className="header"
                            onClick={hideFeedbackDrawer}
                        >
                            &times;
                        </Button>
                    </div>
                    <div className="feedback-wrapper--inner">
                        <FeedbackCategories
                            showCreate={false}
                            showFeedbackGiven={true}
                            setHash={false}
                            meetingId={callId}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default Feedback;
