import { Button } from "antd";
import React from "react";
import { RightOutlined } from "@ant-design/icons";

export default function FeedbackCategoryCard({
    id,
    name,
    description,
    total_feedback_question,
    feedback_given,
    onClick,
    showFeedbackGiven,
    showEdit,
    onEdit,
}) {
    return (
        <div className="boxShadow borderRadius6 flex column justifySpaceBetween marginB20">
            <div
                className="flex curPoint justifySpaceBetween padding12 flex1"
                onClick={() => onClick(id)}
            >
                <div className="marginR8 maxWidthp80 flex justifyCenter column">
                    <div className="flex column">
                        <span className="bold font16 capitalize lineHightN marginB4">
                            {name}
                        </span>
                        <span className="font14 lineHightN">{description}</span>
                    </div>
                    {showFeedbackGiven && (
                        <p className="font14 bold marginTopAutoImp">
                            <span className="bold">
                                {feedback_given}/{total_feedback_question}
                            </span>
                            <span>&nbsp;Feedbacks given</span>
                        </p>
                    )}
                </div>
                <div className="flex alignCenter maxWidthp20">
                    <Button type="link">
                        <RightOutlined />
                    </Button>
                </div>
            </div>
            {showEdit && (
                <div className="borderTop padding4 flex justifyCenter">
                    <Button type="link" onClick={onEdit}>
                        EDIT
                    </Button>
                </div>
            )}
        </div>
    );
}
