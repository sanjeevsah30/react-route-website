import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import FeedbackManagerUI from "@presentational/Settings/FeedbackManagerUI";
import {
    getQuestions,
    createQuestion,
    deleteFeedback,
    editQuestion,
    setActiveCategory,
} from "@store/feedback/actions";
import { notification } from "antd";
import withReactTour from "hoc/withReactTour";
import { useLocation } from "react-router-dom";
import FeedbackCategories from "../FeedbackCategories/FeedbackCategories";
import { Spinner } from "@presentational/reusables/index";

const FeedbackManager = (props) => {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.common.showLoader);
    const loading = useSelector((state) => state.feedback.loading);
    const feedbacks = useSelector((state) => state.feedback.questions);
    const feedbackError = useSelector((state) => state.feedback.error);
    const responseTypes = useSelector((state) => state.feedback.responseTypes);
    const active_category = useSelector(
        (state) => state.feedback.active_category
    );
    const [showAddModal, setshowAddModal] = useState(false);
    const [showEditFeedback, setshowEditFeedback] = useState(false);
    const [newFeedbackQuestion, setnewFeedbackQuestion] = useState("");
    const [newResponseType, setnewResponseType] = useState(1);
    const [activeFeedback, setactiveFeedback] = useState("");

    useEffect(() => {
        if (active_category) {
            dispatch(getQuestions());
        }
    }, [active_category]);

    useEffect(() => {
        return () => {
            dispatch(setActiveCategory(0));
        };
    }, []);

    useEffect(() => {
        if (!isLoading && !feedbackError.status) {
            setshowEditFeedback(false);
            setshowAddModal(false);
        }
    }, [isLoading]);

    useEffect(() => {
        if (feedbackError.status) {
            notification["error"]({
                message: "Error",
                description: feedbackError.message,
            });
        }
    }, [feedbackError]);

    let location = useLocation();
    React.useEffect(() => {
        if (!location.hash) {
            dispatch(setActiveCategory(0));
        }
    }, [location]);

    const handleChange = (event) => {
        if (event?.target?.name === "newFeebackQuestion")
            setnewFeedbackQuestion(event.target.value);
        else if (event?.target?.name === "editFeedbackQuestion")
            setactiveFeedback({
                ...activeFeedback,
                statement: event?.target?.value,
            });
        else setnewResponseType(event);
    };

    const handleAddfeedback = (event) => {
        event.preventDefault();
        dispatch(createQuestion(newResponseType, newFeedbackQuestion));
    };

    const handleRemoveFeedback = (id) => {
        dispatch(deleteFeedback(id));
    };

    const handleNewFeedbackModal = () => {
        setnewFeedbackQuestion("");
        setnewResponseType(1);
        setshowAddModal(!showAddModal);
    };

    const handleEditFeedBack = (idx) => {
        dispatch(editQuestion(activeFeedback, idx));
    };

    const handleEditModal = (feedback, idx) => {
        setactiveFeedback({
            ...feedback,
            idx: idx,
        });
        setshowEditFeedback(!showEditFeedback);
    };

    return (
        <>
            {active_category ? (
                <Spinner loading={loading}>
                    <FeedbackManagerUI
                        isLoading={isLoading || loading}
                        feedbacks={feedbacks}
                        newResponseType={newResponseType}
                        showAddModal={showAddModal}
                        handleNewFeedbackModal={handleNewFeedbackModal}
                        showEditFeedback={showEditFeedback}
                        handleEditModal={handleEditModal}
                        handleEditFeedBack={handleEditFeedBack}
                        activeFeedback={activeFeedback}
                        responseTypes={responseTypes}
                        handleChange={handleChange}
                        newFeedbackQuestion={newFeedbackQuestion}
                        handleAddfeedback={handleAddfeedback}
                        handleRemoveFeedback={handleRemoveFeedback}
                    />
                </Spinner>
            ) : (
                <div className="boxShadow borderRadius8 margin20 maxWidth70 minHeight20">
                    <FeedbackCategories showEdit />
                </div>
            )}
        </>
    );
};

export default withReactTour(FeedbackManager);
