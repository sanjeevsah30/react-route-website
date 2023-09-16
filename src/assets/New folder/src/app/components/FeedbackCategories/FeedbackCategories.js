import {
    createFbCategory,
    editFbCategory,
    fetchFbCategories,
    setActiveCategory,
} from "@store/feedback/actions";
import { Button, Form } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";

import "./FeedbackCategories.scss";
import { NoData, Spinner } from "@presentational/reusables/index";
import FeedbackCreateModal from "./FeedbackCreateModal";
import FeedbackCategoryCard from "./FeedbackCategoryCard";
export default function FeedbackCategories({
    showCreate,
    showFeedbackGiven,
    setHash,
    showEdit,
    meetingId,
}) {
    const dispatch = useDispatch();
    const all_categories = useSelector(
        (state) => state.feedback.all_categories
    );
    const loading = useSelector((state) => state.feedback.loading);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form] = Form.useForm();
    useEffect(() => {
        dispatch(fetchFbCategories(meetingId));
    }, []);

    const handleCreateNewCard = (values) => {
        dispatch(createFbCategory(values.title, values.description));
        setShowCreateModal(false);
    };

    const handleEditCard = (values) => {
        dispatch(
            editFbCategory(
                values.title,
                values.description,
                editingCategory?.id,
                () => setEditingCategory(null)
            )
        );
    };

    const handleActiveCategory = (id) => {
        dispatch(setActiveCategory(id));
        if (setHash) {
            window.location.hash = `fb_${id}`;
        }
    };

    const CreateModalButton = () => (
        <Button
            type="primary"
            shape="round"
            onClick={() => setShowCreateModal(true)}
        >
            <PlusOutlined />
            &nbsp;Create Scorecard
        </Button>
    );
    return (
        <Spinner loading={loading}>
            <div>
                {showCreate && (
                    <div className="flex justifySpaceBetween borderBottom paddingTB8 paddingLR12">
                        <p className="bold font18">Feedback Manager</p>
                        <CreateModalButton />
                    </div>
                )}
                {!!all_categories.length ? (
                    <div
                        className={`fb__category--cards flex1 paddingTB12 ${
                            showCreate ? "onSettings" : ""
                        }`}
                    >
                        {all_categories.map((category) => (
                            <FeedbackCategoryCard
                                {...category}
                                key={category.id}
                                onClick={handleActiveCategory}
                                showFeedbackGiven={showFeedbackGiven}
                                showEdit={showEdit}
                                onEdit={() => setEditingCategory(category)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex alignCenter justifyCenter flex1">
                        {showCreate ? (
                            <div className="padding20">
                                <NoData
                                    description={
                                        "No Scorecards Available. Please use create a new scorecard"
                                    }
                                />
                            </div>
                        ) : (
                            <NoData description={"No Scorecards Available"} />
                        )}
                    </div>
                )}
                <FeedbackCreateModal
                    form={form}
                    onCancel={() => setShowCreateModal(false)}
                    onCreate={handleCreateNewCard}
                    visible={showCreateModal}
                />
                {editingCategory && (
                    <FeedbackCreateModal
                        form={form}
                        onCancel={() => setEditingCategory(null)}
                        onCreate={handleEditCard}
                        visible={editingCategory}
                        initialValues={{
                            title: editingCategory?.name,
                            description: editingCategory?.description,
                        }}
                        okBtnLabel="update"
                    />
                )}
            </div>
        </Spinner>
    );
}

FeedbackCategories.defaultProps = {
    showCreate: true,
    showFeedbackGiven: false,
    setHash: true,
};
