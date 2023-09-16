import React, { Fragment, useContext, useEffect, useState } from "react";
import TemplateLayout from "../Layout/TemplateLayout";
import NoTemplate from "../NoTemplate";
import AuditQuestions from "app/static/svg/AuditQuestions";
import {
    Input,
    Select,
    Drawer,
    Button,
    Checkbox,
    Row,
    Col,
    InputNumber,
    Tooltip,
} from "antd";

import "../auditManager.scss";

import QuestionCard from "./QuestionCard";
import { AuditContext } from "../AuditManager";
import { useDispatch, useSelector } from "react-redux";
import {
    createCategoryQuestionRequest,
    fetchCategoryQuestionsRequest,
    storeQuestions,
    storeQuestionsObj,
    updateCategotyQuestionRequest,
} from "@store/call_audit/actions";
import { checkArray, uid } from "@tools/helpers";
import CustomResponse from "./CustomResponse";
import SortableFuctionComponent from "../Categories/SortableFuctionComponent";
import { bulkUpdateQuestions } from "@apis/call_audit/index";
import Icon from "@presentational/reusables/Icon";
import { CustomMultipleSelect } from "app/components/Resuable/index";
import { DeleteSvg } from "app/static/svg/indexSvg";

const { TextArea } = Input;
const { Option } = Select;

function QuestionSettings(props) {
    const {
        setActiveTab,
        VIEW_CATEGORIES,
        currentCategory,
        questions,
        BOOLEAN_TYPE,
        RATING_TYPE,
        CUSTOM_TYPE,
        CRITICAL,
        NONE,
        FATAL,
        visible,
        setVisible,
        showDrawer,
        onClose,
    } = useContext(AuditContext);
    const [question_id, setQuestion_id] = useState("");
    const [questionText, setQuestionText] = useState("");
    const [questionType, setQuestionType] = useState(BOOLEAN_TYPE);
    const [booleanWeight, setBoolenWeight] = useState({
        yes_weight: 0,
        no_weight: 0,
    });
    const [isMandatory, setIsMandatory] = useState(false);
    const [intent, setIntent] = useState("neutral");
    const [boolean_violation, set_boolean_violation] = useState({
        yes_weight: [],
        no_weight: [],
    });

    const [reasons, setReasons] = useState([]);

    const [rating_violation, set_rating_violation] = useState({
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
    });

    const [ratingWeight, setRatingWeight] = useState({
        weight: 0,
    });
    const [isDisabled, setIsDisabled] = useState(false);
    const [editClicked, setEditClicked] = useState(false);
    const [applicableTags, setApplicableTags] = useState([]);
    const [customResponse, setCustomResponce] = useState([
        {
            name: "",
            weight: 0,
            id: uid(),
        },
    ]);

    const [default_response, set_default_response] = useState(-1);
    const [questionDescription, setQuestionDescription] = useState("");

    const dispatch = useDispatch();

    useEffect(() => {
        const { id } = currentCategory;
        id && dispatch(fetchCategoryQuestionsRequest(id));
    }, [currentCategory]);

    const resetQuestionState = () => {
        setVisible(false);
        setQuestionText("");
        setQuestionDescription("");
        setQuestionType(BOOLEAN_TYPE);
        setEditClicked(false);
        setIsDisabled(false);
        setApplicableTags([]);
        setBoolenWeight({
            yes_weight: 0,
            no_weight: 0,
        });
        setRatingWeight({
            weight: 0,
        });
        setQuestion_id("");
        setCustomResponce([
            {
                name: "",
                weight: 0,
                id: uid(),
            },
        ]);
        set_rating_violation({
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: [],
            8: [],
            9: [],
            10: [],
        });
        set_boolean_violation({ yes_weight: [], no_weight: [] });
        set_default_response(-1);
        setIntent("neutral");
        setReasons([]);
    };

    const { violations } = useSelector((state) => state.violation_manager);

    const [none_notes_mandate, set_none_notes_mandate] = useState(false);

    const [boolean_notes_mandate, set_boolean_notes_mandate] = useState({
        1: false,
        0: false,
        "-1": false,
    });
    const [rating_notes_mandate, set_rating_notes_mandate] = useState({
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
        "-1": false,
    });

    const [valType, setValType] = useState("absolute");
    const [appliedLevel, setAppliedLevel] = useState("template");

    /*
    Function used at two places.One to get the checkboxes at add question drawer param is the tag field of the template
    Second to display violations in the question card - param is the applicable_tag field of the question
    */
    const getApplicableTags = (tags) => {
        let array = [...checkArray(tags)];

        //logic to send critical field to the last
        const critical_tag = array.find(
            ({ tag_name }) => tag_name === CRITICAL
        );
        const fatal_tag = array.find(({ tag_name }) => tag_name === FATAL);
        array = array.filter(
            ({ tag_name }) => tag_name !== CRITICAL && tag_name !== FATAL
        );
        if (critical_tag) array = [...array, critical_tag];
        if (fatal_tag) array = [...array, fatal_tag];
        array = array.filter(({ is_disabled }) => !is_disabled);

        return array;
    };

    const addCustom = () => {
        setCustomResponce([
            ...customResponse,
            {
                id: uid(),
                name: "",
                weight: 0,
                mandate_notes: false,
            },
        ]);
    };

    const removeCustom = (id) => {
        const temp = customResponse.filter((res) => res.id !== id);
        setCustomResponce(temp);
    };

    //removes id's
    const formatCustom = (customResponse, reasons) => {
        for (let res of customResponse) {
            res.reasons = reasons
                .filter(({ option_id }) => option_id === res.id)
                .map((res) => {
                    delete res.option_id;
                    if (typeof res.id === "string") {
                        delete res.id;
                    }

                    return res;
                });
        }
        for (let res of customResponse) {
            typeof res.id !== "number" && delete res.id;
            delete res.appliedViolations;
        }
        return customResponse;
    };

    const getViolationsForCustom = (customResponse) => {
        const violation = {};
        for (let res of customResponse) {
            const { name, appliedViolations } = res;
            violation[name] = appliedViolations
                ? appliedViolations?.map((id) => +id)
                : [];
        }
        return violation;
    };

    const getApplicableViolations = (response, ch) => {
        let ids = [];
        switch (ch) {
            case CUSTOM_TYPE:
                for (let res of response) {
                    const { appliedViolations = [] } = res;

                    ids = [...ids, ...appliedViolations?.map(Number)];
                }
                return [...new Set(ids)];
            case BOOLEAN_TYPE:
                const { yes_weight = [], no_weight = [] } = response;

                ids = [
                    ...ids,
                    ...yes_weight?.map(Number),
                    ...no_weight?.map(Number),
                ];
                return ids;
            case RATING_TYPE:
                Object.keys(response).forEach((key) => {
                    ids = [...ids, ...response[key]?.map(Number)];
                });
                return [...new Set(ids)];
            default:
                return [];
        }
    };

    // useEffect(() => {
    //     let newCustomResponce = customResponse.map((res) => {
    //         if (res.id === default_response && !res.name) {
    //             set_default_response(undefined);
    //             return {
    //                 ...res,
    //                 default: false,
    //             };
    //         } else if (res.id === default_response && res.name)
    //             return {
    //                 ...res,
    //                 default: true,
    //             };
    //         else
    //             return {
    //                 ...res,
    //                 default: false,
    //             };
    //     });
    //     setCustomResponce(newCustomResponce);
    // }, [customResponse]);

    const handleAddReason = (option_id) => {
        setReasons([
            ...reasons,
            {
                reason_text: "",
                option_id,
                id: uid(),
            },
        ]);
    };

    const removeReason = (id) => {
        setReasons(reasons.filter((res, idx) => id !== res.id));
    };

    const setReasonText = (id, value) => {
        setReasons(
            reasons?.map((res, idx) =>
                res.id === id
                    ? {
                          ...res,
                          reason_text: value,
                      }
                    : res
            )
        );
    };

    return (
        <TemplateLayout
            name={currentCategory.name}
            header_btn_text={"ADD QUESTION"}
            header_btn_click={showDrawer}
            show_header_btn={!!questions.length}
            goBack={() => {
                setActiveTab(VIEW_CATEGORIES);
                dispatch(storeQuestions([]));
            }}
            headerName={
                <Tooltip
                    destroyTooltipOnHide
                    title={<div>{currentCategory.id}</div>}
                    placement="topLeft"
                >
                    {currentCategory.name}
                </Tooltip>
            }
        >
            <div
                style={{
                    height: "calc(100vh - 128px)",
                }}
            >
                {questions.length ? (
                    <div>
                        <Row
                            className="teamplate__list__container padding24"
                            gutter={[0, 10]}
                        >
                            <Col
                                span={24}
                                className=" gutter-row template__list__card questions_header auditColorGrey"
                            >
                                <Row className="width100p" gutter={[0, 24]}>
                                    <Col lg={10} md={24} sm={24} xs={24}>
                                        <div>QUESTIONS</div>
                                    </Col>
                                    <Col lg={4} md={24} sm={24} xs={24}>
                                        <div>RESPONSE TYPE</div>
                                    </Col>
                                    <Col lg={2} md={24} sm={24} xs={24}>
                                        <div>VIOLATIONS</div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <div className="paddingLR24 paddingB24">
                            <SortableFuctionComponent
                                data={questions}
                                Component={QuestionCard}
                                gutter={[0, 24]}
                                setEditClicked={setEditClicked}
                                setVisible={setVisible}
                                setQuestionText={setQuestionText}
                                setQuestionDescription={setQuestionDescription}
                                setQuestionType={setQuestionType}
                                setBoolenWeight={setBoolenWeight}
                                setRatingWeight={setRatingWeight}
                                setApplicableTags={setApplicableTags}
                                setQuestion_id={setQuestion_id}
                                getApplicableTags={getApplicableTags}
                                setCustomResponce={setCustomResponce}
                                save={bulkUpdateQuestions}
                                action={storeQuestions}
                                set_boolean_violation={set_boolean_violation}
                                set_rating_violation={set_rating_violation}
                                set_boolean_notes_mandate={
                                    set_boolean_notes_mandate
                                }
                                set_rating_notes_mandate={
                                    set_rating_notes_mandate
                                }
                                set_default_response={set_default_response}
                                setIntent={setIntent}
                                setReasons={setReasons}
                                setValType={setValType}
                                setAppliedLevel={setAppliedLevel}
                                set_none_notes_mandate={set_none_notes_mandate}
                                setIsMandatory={setIsMandatory}
                            />
                        </div>
                    </div>
                ) : (
                    <NoTemplate
                        Svg={AuditQuestions}
                        heading="No Questions here"
                        text="Try adding some questions"
                        button_text="Add Questions"
                        onClick={showDrawer}
                    />
                )}
            </div>
            <Drawer
                title={editClicked ? "EDIT QUESTION" : "ADD QUESTION"}
                placement="right"
                closable={true}
                onClose={() => {
                    if (editClicked) {
                        resetQuestionState();
                    } else onClose();
                }}
                visible={visible}
                width={750}
                footer={
                    <div className="paddingTB10 flex row-reverse">
                        <Button
                            onClick={() => {
                                let question = {
                                    question_text: questionText,
                                    question_type: questionType,
                                    intent,
                                    category: currentCategory.id,
                                    question_desc: questionDescription,
                                    is_mandatory: isMandatory,
                                };

                                if (questionType !== CUSTOM_TYPE) {
                                    question.reasons = reasons?.map((res) => {
                                        if (typeof res.id === "string") {
                                            delete res.id;
                                        }
                                        return res;
                                    });
                                }

                                if (questionType !== NONE) {
                                    // if (
                                    //     questionType === BOOLEAN_TYPE ||
                                    //     questionType === RATING_TYPE
                                    // ) {
                                    //     question.default_option_id =
                                    //         default_response;
                                    // }
                                    question = {
                                        ...question,
                                        applicable_violation:
                                            getApplicableViolations(
                                                questionType === CUSTOM_TYPE
                                                    ? customResponse
                                                    : questionType ===
                                                      BOOLEAN_TYPE
                                                    ? boolean_violation
                                                    : questionType ===
                                                      RATING_TYPE
                                                    ? rating_violation
                                                    : [],
                                                questionType
                                            ),
                                        settings:
                                            questionType === BOOLEAN_TYPE
                                                ? {
                                                      ...booleanWeight,
                                                      default: default_response,
                                                      violation:
                                                          boolean_violation,
                                                      mandate_notes_on:
                                                          Object.keys(
                                                              boolean_notes_mandate
                                                          )
                                                              .filter(
                                                                  (key) =>
                                                                      boolean_notes_mandate[
                                                                          key
                                                                      ]
                                                              )
                                                              .map(Number),
                                                  }
                                                : questionType === RATING_TYPE
                                                ? {
                                                      ...ratingWeight,
                                                      default: default_response,
                                                      violation:
                                                          rating_violation,
                                                      mandate_notes_on:
                                                          Object.keys(
                                                              rating_notes_mandate
                                                          ).filter(
                                                              (key) =>
                                                                  rating_notes_mandate[
                                                                      key
                                                                  ]
                                                          ),
                                                  }
                                                : {
                                                      violation:
                                                          getViolationsForCustom(
                                                              customResponse
                                                          ),
                                                      custom: formatCustom(
                                                          customResponse,
                                                          reasons
                                                      ),
                                                  },
                                    };
                                } else {
                                    question = {
                                        ...question,
                                        is_mandatory: none_notes_mandate,
                                        settings: {},
                                    };
                                }

                                //Checks weather user has eneterd na. If so prevents submit. Also adds is_deduction parameter if 'Type' option is percentage
                                if (questionType === CUSTOM_TYPE) {
                                    for (let res of customResponse) {
                                        if (
                                            typeof res.id !== "number" &&
                                            res.name.toLowerCase() === "na"
                                        )
                                            return;
                                    }
                                    if (valType) {
                                        question.settings = {
                                            is_deduction:
                                                valType === "percentage",
                                            ...question.settings,
                                        };
                                    }
                                    if (appliedLevel) {
                                        question.settings = {
                                            is_template_level:
                                                appliedLevel === "template",
                                            ...question.settings,
                                        };
                                    }
                                }

                                editClicked
                                    ? dispatch(
                                          updateCategotyQuestionRequest(
                                              question_id,
                                              question
                                          )
                                      )
                                    : dispatch(
                                          createCategoryQuestionRequest({
                                              ...question,
                                              seq_no: questions.length + 1,
                                          })
                                      );
                                resetQuestionState();
                            }}
                            type="primary"
                        >
                            {editClicked ? "Save" : "Add"}
                        </Button>
                    </div>
                }
            >
                <div className="marginB30">
                    <div className="dove_gray_cl font12 marginB10">
                        QUESTION
                    </div>
                    <TextArea
                        className="audit__input__bg"
                        placeholder="Enter Question"
                        autoSize={{ minRows: 6, maxRows: 8 }}
                        onChange={(e) => setQuestionText(e.target.value)}
                        value={questionText}
                    />
                    <div className="dove_gray_cl font12 marginT30 marginB10">
                        QUESTION DESCRIPTION
                    </div>
                    <TextArea
                        className="audit__input__bg"
                        placeholder="Enter description"
                        autoSize={{ minRows: 6, maxRows: 8 }}
                        value={questionDescription}
                        onChange={(e) => setQuestionDescription(e.target.value)}
                    />
                </div>
                <div className="marginB24">
                    <div className="dove_gray_cl font12 marginB10">INTENT</div>
                    <div className="flex alignCenter justifySpaceBetween">
                        <Select
                            value={intent}
                            style={{ width: 150 }}
                            onChange={(value) => {
                                setIntent(value);
                            }}
                        >
                            <Option value={"positive"}>Positive</Option>
                            <Option value={"neutral"}>Neutral</Option>
                            <Option value={"negative"}>Negative</Option>
                        </Select>
                    </div>
                </div>
                <div className="marginB24">
                    <div className="adove_gray_cl font12 marginB10">
                        RESPONSE TYPE
                    </div>
                    <div className="flex alignCenter justifySpaceBetween">
                        <Select
                            value={questionType}
                            style={{ width: 150 }}
                            onChange={(value) => {
                                set_default_response(-1);
                                setReasons([]);
                                setQuestionType(value);
                            }}
                        >
                            <Option value={BOOLEAN_TYPE}>Yes or No</Option>
                            <Option value={RATING_TYPE}>Scale 1-10</Option>
                            <Option value={CUSTOM_TYPE}>Custom</Option>
                            <Option value={NONE}>None</Option>
                        </Select>
                        {questionType === CUSTOM_TYPE && (
                            <Button onClick={() => addCustom()}>
                                Add Custom
                            </Button>
                        )}
                    </div>
                    {questionType !== NONE ? (
                        <Checkbox
                            checked={isMandatory}
                            onChange={(e) => {
                                setIsMandatory(e.target.checked);
                            }}
                            className="marginT8 marginL2"
                        >
                            Make the response mandatory for this question
                        </Checkbox>
                    ) : null}
                </div>
                {questionType === NONE && (
                    <Checkbox
                        onChange={(e) =>
                            set_none_notes_mandate(e.target.checked)
                        }
                        checked={none_notes_mandate}
                        className="marginB10"
                    >
                        Notes Must
                    </Checkbox>
                )}
                {questionType === CUSTOM_TYPE && (
                    <div className="marginB24 flex alignCenter justifySpaceBetween">
                        <div>
                            <div className="dove_gray_cl font12 marginB10">
                                Type
                            </div>
                            <div className="flex alignCenter justifySpaceBetween">
                                <Select
                                    value={valType}
                                    style={{
                                        width: 284,
                                        textTransform: "none",
                                    }}
                                    onChange={(value) => {
                                        setValType(value);
                                    }}
                                >
                                    <Option value={"absolute"}>Absolute</Option>
                                    <Option value={"percentage"}>
                                        Percentage
                                    </Option>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <div className="dove_gray_cl font12 marginB10">
                                Applied Level
                            </div>
                            <div className="flex alignCenter justifySpaceBetween">
                                <Select
                                    value={appliedLevel}
                                    style={{
                                        width: 284,
                                        textTransform: "none",
                                    }}
                                    onChange={(value) => {
                                        setAppliedLevel(value);
                                    }}
                                >
                                    <Option value={"template"}>Template</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                )}
                {questionType !== NONE && (
                    <div className="marginB24">
                        <div className="dove_gray_cl font12 marginB10">
                            Default Response
                        </div>
                        <div className="flex alignCenter justifySpaceBetween">
                            <Select
                                value={default_response}
                                style={{ width: 150 }}
                                onChange={(value) => {
                                    set_default_response(value);
                                    set_boolean_notes_mandate({
                                        ...boolean_notes_mandate,
                                        [value]: false,
                                    });
                                    set_rating_notes_mandate({
                                        ...rating_notes_mandate,
                                        [value]: false,
                                    });
                                }}
                            >
                                {questionType === BOOLEAN_TYPE ? (
                                    <>
                                        <Option value={1}>Yes</Option>
                                        <Option value={0}>No</Option>
                                        <Option value={-1}>Na</Option>
                                    </>
                                ) : questionType === RATING_TYPE ? (
                                    <>
                                        {new Array(11).fill(0).map((_, idx) => (
                                            <Option value={idx} key={idx}>
                                                {idx}
                                            </Option>
                                        ))}
                                        <Option value={-1}>Na</Option>
                                    </>
                                ) : (
                                    <>
                                        {customResponse.map(({ name, id }) =>
                                            name ? (
                                                <Option value={id} key={id}>
                                                    {name}
                                                </Option>
                                            ) : (
                                                <></>
                                            )
                                        )}
                                    </>
                                )}
                            </Select>
                        </div>
                    </div>
                )}

                {questionType !== NONE && (
                    <>
                        <div
                            className="marginB30 paddingT21 paddingB26"
                            style={{
                                borderBottom:
                                    "1px solid rgba(153, 153, 153, 0.2)",
                                borderTop: "1px solid rgba(153, 153, 153, 0.2)",
                            }}
                        >
                            {questionType === BOOLEAN_TYPE ? (
                                <div>
                                    <div
                                        style={{
                                            border: "1px solid #99999933",
                                        }}
                                        className="marginB24 borderRadius8 padding8"
                                    >
                                        <div className="dove_gray_cl bold400 font16">
                                            <span>{`Response |`}</span>
                                            <span className="marginL5 bold600 font18">
                                                {`YES`}
                                            </span>
                                        </div>

                                        <Row
                                            gutter={[24, 0]}
                                            className="marginB24"
                                        >
                                            <Col lg={4} md={4} sm={4} xs={4}>
                                                <div className="marginB18">
                                                    <div className="dove_gray_cl font12">
                                                        WEIGHT
                                                    </div>
                                                    <InputNumber
                                                        className="audit__input__bg"
                                                        onChange={(e) => {
                                                            setBoolenWeight({
                                                                ...booleanWeight,
                                                                yes_weight: e,
                                                            });
                                                        }}
                                                        value={
                                                            booleanWeight.yes_weight
                                                        }
                                                    />
                                                </div>
                                            </Col>

                                            <Col flex={"auto"}>
                                                <div className="marginB18">
                                                    <div className="dove_gray_cl font12">
                                                        VIOLATION
                                                    </div>

                                                    <CustomMultipleSelect
                                                        data={violations.data}
                                                        className=" multiple__select"
                                                        option_name="name"
                                                        select_placeholder={
                                                            "Select Violation"
                                                        }
                                                        placeholder={
                                                            "Select Violation"
                                                        }
                                                        style={{
                                                            width: "100%",
                                                            height: "auto",
                                                            padding: "0",
                                                        }}
                                                        onChange={(ids) => {
                                                            set_boolean_violation(
                                                                {
                                                                    ...boolean_violation,
                                                                    yes_weight:
                                                                        ids.map(
                                                                            Number
                                                                        ),
                                                                }
                                                            );
                                                        }}
                                                        value={boolean_violation?.yes_weight?.map(
                                                            String
                                                        )}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>

                                        <Checkbox
                                            onChange={(e) =>
                                                set_boolean_notes_mandate({
                                                    ...boolean_notes_mandate,
                                                    1:
                                                        default_response !== 1
                                                            ? e.target.checked
                                                            : false,
                                                })
                                            }
                                            checked={boolean_notes_mandate[1]}
                                            className="marginB10"
                                        >
                                            Notes Must
                                        </Checkbox>

                                        <ReasonSection
                                            option_id={1}
                                            reasons={reasons}
                                            handleAddReason={handleAddReason}
                                            removeReason={removeReason}
                                            setReasonText={setReasonText}
                                            default_response={default_response}
                                            dissable_id={1}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            border: "1px solid #99999933",
                                        }}
                                        className="marginB24 borderRadius8 padding8"
                                    >
                                        <div className="dove_gray_cl bold400 font16">
                                            <span>{`Response |`}</span>
                                            <span className="marginL5 bold600 font18">
                                                {`NO`}
                                            </span>
                                        </div>

                                        <Row
                                            gutter={[24, 0]}
                                            className="marginB10"
                                        >
                                            <Col lg={4} md={4} sm={4} xs={4}>
                                                <div className="marginB18">
                                                    <div className="dove_gray_cl font12">
                                                        WEIGHT
                                                    </div>
                                                    <InputNumber
                                                        className="audit__input__bg"
                                                        onChange={(e) => {
                                                            setBoolenWeight({
                                                                ...booleanWeight,
                                                                no_weight: e,
                                                            });
                                                        }}
                                                        value={
                                                            booleanWeight.no_weight
                                                        }
                                                    />
                                                </div>
                                            </Col>

                                            <Col flex={"auto"}>
                                                <div className="marginB18">
                                                    <div className="dove_gray_cl font12">
                                                        VIOLATION
                                                    </div>

                                                    <CustomMultipleSelect
                                                        data={violations.data}
                                                        className=" multiple__select"
                                                        option_name="name"
                                                        select_placeholder={
                                                            "Select Violation"
                                                        }
                                                        placeholder={
                                                            "Select Violation"
                                                        }
                                                        style={{
                                                            width: "100%",
                                                            height: "auto",
                                                            padding: "0",
                                                        }}
                                                        onChange={(ids) => {
                                                            set_boolean_violation(
                                                                {
                                                                    ...boolean_violation,
                                                                    no_weight:
                                                                        ids.map(
                                                                            Number
                                                                        ),
                                                                }
                                                            );
                                                        }}
                                                        value={boolean_violation?.no_weight?.map(
                                                            String
                                                        )}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Checkbox
                                            onChange={(e) =>
                                                set_boolean_notes_mandate({
                                                    ...boolean_notes_mandate,
                                                    0:
                                                        default_response !== 0
                                                            ? e.target.checked
                                                            : false,
                                                })
                                            }
                                            checked={boolean_notes_mandate[0]}
                                            className="marginB10"
                                        >
                                            Notes Must
                                        </Checkbox>

                                        <ReasonSection
                                            option_id={0}
                                            reasons={reasons}
                                            handleAddReason={handleAddReason}
                                            removeReason={removeReason}
                                            setReasonText={setReasonText}
                                            default_response={default_response}
                                            dissable_id={0}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            border: "1px solid #99999933",
                                        }}
                                        className="marginB24 borderRadius8 padding8"
                                    >
                                        <div className="dove_gray_cl bold400 font16">
                                            <span>{`Response |`}</span>
                                            <span className="marginL5 bold600 font18">
                                                {`NA`}
                                            </span>
                                        </div>
                                        <Checkbox
                                            onChange={(e) =>
                                                set_boolean_notes_mandate({
                                                    ...boolean_notes_mandate,
                                                    "-1":
                                                        default_response !== -1
                                                            ? e.target.checked
                                                            : false,
                                                })
                                            }
                                            checked={
                                                boolean_notes_mandate["-1"]
                                            }
                                            className="marginB10"
                                        >
                                            Notes Must
                                        </Checkbox>
                                    </div>
                                </div>
                            ) : questionType === RATING_TYPE ? (
                                <>
                                    <div className="dove_gray_cl font12">
                                        WEIGHT
                                    </div>
                                    <InputNumber
                                        className="audit__input__bg marginB20"
                                        onChange={(e) => {
                                            setRatingWeight({
                                                ...ratingWeight,
                                                weight: e,
                                            });
                                        }}
                                        value={ratingWeight.weight}
                                    />
                                    <div>
                                        {new Array(11).fill(0).map((_, id) => (
                                            <Row
                                                gutter={[24, 0]}
                                                style={{
                                                    border: "1px solid #99999933",
                                                }}
                                                className="marginB24 borderRadius8 padding8"
                                            >
                                                <Col
                                                    span={24}
                                                    className="flex marginB10"
                                                    style={{
                                                        gap: "16px",
                                                    }}
                                                    key={id}
                                                >
                                                    <div>
                                                        <div className="dove_gray_cl font12">
                                                            RESPONSE
                                                        </div>
                                                        <div>{id}</div>
                                                    </div>

                                                    <div className="flex1">
                                                        <div className="dove_gray_cl font12">
                                                            VIOLATION
                                                        </div>

                                                        <CustomMultipleSelect
                                                            data={
                                                                violations.data
                                                            }
                                                            className=" multiple__select"
                                                            option_name="name"
                                                            select_placeholder={
                                                                "Select Violation"
                                                            }
                                                            placeholder={
                                                                "Select Violation"
                                                            }
                                                            style={{
                                                                width: "100%",
                                                                height: "auto",
                                                                padding: "0",
                                                            }}
                                                            onChange={(ids) => {
                                                                set_rating_violation(
                                                                    {
                                                                        ...rating_violation,
                                                                        [id]: ids?.map?.(
                                                                            Number
                                                                        ),
                                                                    }
                                                                );
                                                            }}
                                                            value={rating_violation[
                                                                id
                                                            ]?.map?.(String)}
                                                        />
                                                    </div>
                                                    <div className="flex alignCenter">
                                                        <Checkbox
                                                            onChange={(e) =>
                                                                set_rating_notes_mandate(
                                                                    {
                                                                        ...rating_notes_mandate,
                                                                        [id]:
                                                                            default_response !==
                                                                            id
                                                                                ? e
                                                                                      .target
                                                                                      .checked
                                                                                : false,
                                                                    }
                                                                )
                                                            }
                                                            checked={
                                                                rating_notes_mandate[
                                                                    id
                                                                ]
                                                            }
                                                        >
                                                            Notes Must
                                                        </Checkbox>
                                                    </div>
                                                </Col>
                                                <Col span={24}>
                                                    <ReasonSection
                                                        option_id={id}
                                                        reasons={reasons}
                                                        handleAddReason={
                                                            handleAddReason
                                                        }
                                                        removeReason={
                                                            removeReason
                                                        }
                                                        setReasonText={
                                                            setReasonText
                                                        }
                                                        default_response={
                                                            default_response
                                                        }
                                                        dissable_id={id}
                                                    />
                                                </Col>
                                            </Row>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                customResponse.map((res, index) => {
                                    return (
                                        <CustomResponse
                                            key={res.id}
                                            {...res}
                                            customResponse={customResponse}
                                            setCustomResponce={
                                                setCustomResponce
                                            }
                                            removeCustom={removeCustom}
                                            index={index}
                                            default_response={default_response}
                                            reasons={reasons}
                                            handleAddReason={handleAddReason}
                                            removeReason={removeReason}
                                            setReasonText={setReasonText}
                                            valType={valType}
                                        />
                                    );
                                })
                            )}
                        </div>

                        {/* <div>
                            <div className="auditColorGrey marginB10">
                                APPLICABLE VIOLATIONS
                            </div>
                            <Checkbox.Group
                                className="flex row"
                                onChange={(values) => {
                                    setApplicableTags([...values]);
                                }}
                                value={applicableTags}
                            >
                                {checkArray(violations).map(
                                    ({ id, tag_name }) => {
                                        return (
                                            <div
                                                key={id}
                                                className={'col-12  paddingB28'}
                                            >
                                                <Checkbox value={Number(id)}>
                                                    {tag_name === CRITICAL
                                                        ? `Mark question as critical`
                                                        : tag_name === FATAL
                                                        ? 'Mark question as fatal'
                                                        : tag_name}
                                                </Checkbox>
                                            </div>
                                        );
                                    }
                                )}
                            </Checkbox.Group>
                        </div> */}
                    </>
                )}
            </Drawer>
        </TemplateLayout>
    );
}

export const ReasonSection = ({
    option_id,
    handleAddReason = () => {},
    reasons,
    removeReason,
    setReasonText,
    default_response,
    dissable_id,
}) => {
    return (
        <>
            <div className="flex justifySpaceBetween alignCenter marginT24">
                <div className="font18 bold600">Reasons</div>
                <Tooltip
                    title={
                        default_response === dissable_id
                            ? "Can't add reasons as this is your default response"
                            : ""
                    }
                >
                    <Button
                        className="capitalize"
                        onClick={() => handleAddReason(option_id)}
                        disabled={default_response === dissable_id}
                    >
                        Add Reason
                    </Button>
                </Tooltip>
            </div>

            <div>
                {reasons
                    ?.filter((res) => option_id === res.option_id)
                    .map(({ id, reason_text }, idx) => (
                        <Row gutter={[24, 0]} key={idx} className="marginTB24">
                            <Col span={20}>
                                <Input
                                    value={reason_text}
                                    placeholder="Enter Reason"
                                    onChange={(e) =>
                                        setReasonText(id, e.target.value)
                                    }
                                />
                            </Col>
                            <Col span={4} onClick={() => removeReason(id)}>
                                <div
                                    className="curPoint"
                                    onClick={() => removeReason(id)}
                                >
                                    <DeleteSvg />
                                </div>
                            </Col>
                        </Row>
                    ))}
            </div>
        </>
    );
};

export default QuestionSettings;
