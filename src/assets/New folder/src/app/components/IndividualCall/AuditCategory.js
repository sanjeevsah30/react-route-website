import Icon from "@presentational/reusables/Icon";
import { Col } from "antd";
import React from "react";

function AuditCategory({ onClick, category, scores }) {
    const { id, name, description, questions_count } = category;
    return (
        <Col
            span={24}
            className="borderBottomBold padding12 curPoint"
            onClick={onClick}
        >
            <div className="bold">{name}</div>
            <p className="greyText">{description}</p>
            <div className="flex justifySpaceBetween alignCenter">
                <div className="font12 primaryText">
                    <strong>
                        {scores?.[id] ? scores[id].category_ques_audited : 0}/
                        {questions_count} COMPLETED
                        <span>
                            {" "}
                            <Icon className={"fa-angle-right"} />
                        </span>
                    </strong>
                </div>
                <div className="primary">
                    <strong>
                        Points Earned :{" "}
                        {
                            <span>
                                {scores?.[id]?.category_score || 0}/
                                {scores?.[id]?.category_marks_audited || 0}
                            </span>
                        }
                    </strong>
                </div>
            </div>
        </Col>
    );
}

AuditCategory.defaultProps = {
    onClick: () => {},
};

export default AuditCategory;
