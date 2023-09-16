import { Col, Row, Button, Popconfirm } from "antd";
import React from "react";
import auditConfig from "@constants/Audit";
import NoData from "@presentational/reusables/NoData";

function QuestionList({ questionList, id, handleClick, deleteQuestionFilter }) {
    const { EDIT_FILTERS_TAB, CREATE_FILTERS_TAB } = auditConfig;
    return (
        <>
            {questionList?.length ? (
                <></>
            ) : (
                <NoData description={"No Questions Available"} />
            )}

            <Row
                className="teamplate__list__container padding24"
                gutter={[0, 24]}
            >
                {questionList?.map((question, index) => (
                    <Col
                        span={24}
                        className=" gutter-row template__list__card"
                        key={index}
                    >
                        <Row className="width100p" gutter={[0, 24]}>
                            <Col
                                lg={question.has_filters ? 16 : 20}
                                md={24}
                                sm={24}
                                xs={24}
                                className="flex alignCenter"
                            >
                                <div className="bold paddingR10">
                                    {`${index + 1}. `}
                                    {question.question_text}
                                </div>
                            </Col>
                            {question.has_filters ? (
                                <>
                                    <Col
                                        lg={4}
                                        md={12}
                                        sm={24}
                                        xs={24}
                                        className="flex justifyEnd"
                                        onClick={(e) => {
                                            handleClick(
                                                EDIT_FILTERS_TAB,
                                                question
                                            );
                                        }}
                                    >
                                        <Button
                                            type="primary"
                                            style={{ width: "100%" }}
                                        >
                                            Edit Filter
                                        </Button>
                                    </Col>
                                    <Col
                                        lg={4}
                                        md={12}
                                        sm={24}
                                        xs={24}
                                        className="flex justifyEnd"
                                    >
                                        <Popconfirm
                                            title="Are you sure to delete this filter?"
                                            onConfirm={() => {
                                                deleteQuestionFilter(
                                                    question.id,
                                                    id
                                                );
                                            }}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button
                                                danger
                                                style={{
                                                    width: "100%",
                                                    marginLeft: "8px",
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </Popconfirm>
                                    </Col>
                                </>
                            ) : (
                                <Col
                                    lg={4}
                                    md={24}
                                    sm={24}
                                    xs={24}
                                    className="flex justifyEnd"
                                >
                                    <Button
                                        type="primary"
                                        onClick={(e) =>
                                            handleClick(
                                                CREATE_FILTERS_TAB,
                                                question
                                            )
                                        }
                                    >
                                        Create Filter
                                    </Button>
                                </Col>
                            )}
                        </Row>
                    </Col>
                ))}
            </Row>
        </>
    );
}

export default QuestionList;
