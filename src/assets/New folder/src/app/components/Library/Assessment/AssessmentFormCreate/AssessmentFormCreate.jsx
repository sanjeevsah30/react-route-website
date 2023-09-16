import React, { Suspense, useEffect, useReducer, useState } from "react";
import "./style.scss";
import { Button, Checkbox, Input, Radio, Select, Switch } from "antd";
import Icon from "@presentational/reusables/Icon";
import DeleteSvg from "app/static/svg/DeleteSvg";
import { uid } from "@tools/helpers";
import CloseSvg from "app/static/svg/CloseSvg";
import { dispatch } from "d3";
import {
    RadioSvg,
    CheckboxSvg,
    TitleSvg,
    NoDataSvg,
} from "app/static/svg/indexSvg";
import { useDispatch, useSelector } from "react-redux";
import {
    createGoogleForm,
    createUpdateQuestion,
    deleteQuestion,
    getGoogleForm,
    setInitialState,
} from "@store/library/librarySlice";
import FallbackUI from "@presentational/reusables/FallbackUI";
import Spinner from "@presentational/reusables/Spinner";
import { useHistory } from "react-router-dom";
const { TextArea } = Input;
const { Option } = Select;

const actionTypes = { toggle_index: "toggle_index" };

function accordionReducer(openIndexes, action) {
    switch (action.type) {
        case actionTypes.toggle_index: {
            const closing = openIndexes.includes(action.index);
            return closing
                ? openIndexes.filter((i) => i !== action.index)
                : [...openIndexes, action.index];
        }
        default: {
            throw new Error(
                `Unhandled type in accordionReducer: ${action.type}`
            );
        }
    }
}
function singleReducer(openIndexes, action) {
    if (action.type === actionTypes.toggle_index) {
        const closing = openIndexes.includes(action.index);
        if (!closing) {
            return [action.index];
        }
    }
}
function combineReducers(...reducers) {
    return (state, action) => {
        for (const reducer of reducers) {
            const result = reducer(state, action);
            if (result) return result;
        }
    };
}
function useAccordion({ reducer = accordionReducer } = {}) {
    const [openIndexes, dispatch] = useReducer(reducer, [0]);
    const toggleIndex = (index) =>
        dispatch({ type: actionTypes.toggle_index, index });
    return { openIndexes, toggleIndex };
}

const FormReducer = (state, action) => {
    let newstate;
    if (state?.items) {
        newstate = [...state.items];
    }
    switch (action?.type) {
        case "set_form_data":
            return action.payload;
        case "form_title":
            return { ...state, info: { ...state.info, title: action.payload } };
        case "form_description":
            return {
                ...state,
                info: { ...state.info, description: action.payload },
            };
        case "set_options_value":
            return {
                ...state,
                items: state.items.map((item) => {
                    if (item.itemId === action.payload.itemId) {
                        if (
                            item.questionItem.question.hasOwnProperty(
                                "grading"
                            ) &&
                            item.questionItem.question.grading !== undefined
                        )
                            return {
                                ...item,
                                questionItem: {
                                    ...item.questionItem,
                                    question: {
                                        ...item.questionItem.question,
                                        grading: {
                                            ...item.questionItem.question
                                                .grading,
                                            correctAnswers: {
                                                ...item.questionItem.question
                                                    .grading.correctAnswers,
                                                answers:
                                                    item.questionItem.question.grading.correctAnswers.answers.map(
                                                        (ans) => {
                                                            if (
                                                                item.questionItem.question.choiceQuestion.options.find(
                                                                    (_, idx) =>
                                                                        idx ===
                                                                        action
                                                                            .payload
                                                                            .opIdx
                                                                ).value ===
                                                                ans.value
                                                            ) {
                                                                return {
                                                                    value: action
                                                                        .payload
                                                                        .value,
                                                                };
                                                            } else return ans;
                                                        }
                                                    ),
                                            },
                                        },
                                        choiceQuestion: {
                                            ...item.questionItem.question
                                                .choiceQuestion,
                                            options:
                                                item.questionItem.question.choiceQuestion.options.map(
                                                    (option, idx) => {
                                                        if (
                                                            idx ===
                                                            action.payload.opIdx
                                                        ) {
                                                            return {
                                                                ...option,
                                                                value: action
                                                                    .payload
                                                                    .value,
                                                            };
                                                        } else return option;
                                                    }
                                                ),
                                        },
                                    },
                                },
                            };
                        else
                            return {
                                ...item,
                                questionItem: {
                                    ...item.questionItem,
                                    question: {
                                        ...item.questionItem.question,
                                        choiceQuestion: {
                                            ...item.questionItem.question
                                                .choiceQuestion,
                                            options:
                                                item.questionItem.question.choiceQuestion.options.map(
                                                    (option, idx) => {
                                                        if (
                                                            idx ===
                                                            action.payload.opIdx
                                                        ) {
                                                            return {
                                                                ...option,
                                                                value: action
                                                                    .payload
                                                                    .value,
                                                            };
                                                        } else return option;
                                                    }
                                                ),
                                        },
                                    },
                                },
                            };
                    } else return item;
                }),
            };
        case "set_low_scale":
            return {
                ...state,
                items: state.items.map((item) => {
                    if (item.itemId === action.payload.itemId) {
                        return {
                            ...item,
                            questionItem: {
                                ...item.questionItem,
                                question: {
                                    ...item.questionItem.question,
                                    scaleQuestion: {
                                        ...item.questionItem.question
                                            .scaleQuestion,
                                        low: action.payload.value,
                                    },
                                },
                            },
                        };
                    } else return item;
                }),
            };
        case "set_high_scale":
            return {
                ...state,
                items: state.items.map((item) => {
                    if (item.itemId === action.payload.itemId) {
                        return {
                            ...item,
                            questionItem: {
                                ...item.questionItem,
                                question: {
                                    ...item.questionItem.question,
                                    scaleQuestion: {
                                        ...item.questionItem.question
                                            .scaleQuestion,
                                        high: action.payload.value,
                                    },
                                },
                            },
                        };
                    } else return item;
                }),
            };
        case "set_low_scale_lable":
            return {
                ...state,
                items: state.items.map((item) => {
                    if (item.itemId === action.payload.itemId) {
                        return {
                            ...item,
                            questionItem: {
                                ...item.questionItem,
                                question: {
                                    ...item.questionItem.question,
                                    scaleQuestion: {
                                        ...item.questionItem.question
                                            .scaleQuestion,
                                        lowLabel: action.payload.value,
                                    },
                                },
                            },
                        };
                    } else return item;
                }),
            };
        case "set_high_scale_lable":
            return {
                ...state,
                items: state.items.map((item) => {
                    if (item.itemId === action.payload.itemId) {
                        return {
                            ...item,
                            questionItem: {
                                ...item.questionItem,
                                question: {
                                    ...item.questionItem.question,
                                    scaleQuestion: {
                                        ...item.questionItem.question
                                            .scaleQuestion,
                                        highLabel: action.payload.value,
                                    },
                                },
                            },
                        };
                    } else return item;
                }),
            };
        case "set_question_value":
            return {
                ...state,
                items: state.items.map((item) => {
                    if (item.itemId === action.payload.id) {
                        return { ...item, title: action.payload.value };
                    } else return item;
                }),
            };
        case "set_question_marks":
            return {
                ...state,
                items: state.items.map((item) => {
                    if (item.itemId === action.payload.id) {
                        return {
                            ...item,
                            questionItem: {
                                ...item.questionItem,
                                question: {
                                    ...item.questionItem.question,
                                    grading: {
                                        ...item.questionItem.question.grading,
                                        pointValue: +action.payload.value,
                                    },
                                },
                            },
                        };
                    } else return item;
                }),
            };
        case "set_question_answers":
            return {
                ...state,
                items: state?.items?.map((item) => {
                    if (item.itemId === action.payload.id) {
                        if (!!action?.payload?.value.length)
                            return {
                                ...item,
                                questionItem: {
                                    ...item.questionItem,
                                    question: {
                                        ...item.questionItem.question,
                                        grading: {
                                            ...item?.questionItem?.question
                                                ?.grading,
                                            correctAnswers: {
                                                ...item?.questionItem?.question
                                                    ?.grading?.correctAnswers,
                                                answers: action?.payload?.value,
                                            },
                                        },
                                    },
                                },
                            };
                        else
                            return {
                                ...item,
                                questionItem: {
                                    ...item.questionItem,
                                    question: {
                                        ...item.questionItem.question,
                                        grading: undefined,
                                    },
                                },
                            };
                    } else return item;
                }),
            };
        case "set_isQuestion_required":
            return {
                ...state,
                items: state.items.map((item) => {
                    if (item.itemId === action.payload.id) {
                        return {
                            ...item,
                            questionItem: {
                                ...item.questionItem,
                                question: {
                                    ...item.questionItem.question,
                                    required: action.payload.value
                                        ? action.payload.value
                                        : undefined,
                                },
                            },
                        };
                    } else return item;
                }),
            };
        case "add_options":
            return {
                ...state,
                items: state.items.map((item) => {
                    if (item.itemId === action.payload.itemId) {
                        return {
                            ...item,
                            questionItem: {
                                ...item.questionItem,
                                question: {
                                    ...item.questionItem.question,
                                    choiceQuestion: {
                                        ...item.questionItem.question
                                            .choiceQuestion,
                                        options: [
                                            ...item.questionItem.question
                                                .choiceQuestion.options,
                                            {
                                                value: `Option ${
                                                    item.questionItem.question
                                                        .choiceQuestion.options
                                                        .length + 1
                                                }`,
                                            },
                                        ],
                                    },
                                },
                            },
                        };
                    } else return item;
                }),
            };
        case "remove_options":
            return {
                ...state,
                items: state.items.map((item) => {
                    if (item.itemId === action.payload.itemId) {
                        if (
                            item.questionItem.question.hasOwnProperty("grading")
                        ) {
                            const temp = {
                                ...item,
                                questionItem: {
                                    ...item.questionItem,
                                    question: {
                                        ...item.questionItem.question,
                                        choiceQuestion: {
                                            ...item.questionItem.question
                                                .choiceQuestion,
                                            options:
                                                item.questionItem.question.choiceQuestion.options.filter(
                                                    (_, idx) =>
                                                        idx !==
                                                        action.payload.opIdx
                                                ),
                                        },
                                        grading: {
                                            ...item.questionItem.question
                                                .grading,
                                            correctAnswers: {
                                                ...item.questionItem.question
                                                    .grading.correctAnswers,
                                                answers:
                                                    item.questionItem.question.grading.correctAnswers.answers.filter(
                                                        (opt) => {
                                                            return item.questionItem.question.choiceQuestion.options
                                                                .filter(
                                                                    (_, idx) =>
                                                                        idx !==
                                                                        action
                                                                            .payload
                                                                            .opIdx
                                                                )
                                                                .find(
                                                                    (
                                                                        option
                                                                    ) => {
                                                                        // console.log(option)
                                                                        return (
                                                                            option.value ===
                                                                            opt.value
                                                                        );
                                                                    }
                                                                );
                                                        }
                                                    ),
                                            },
                                        },
                                    },
                                },
                            };
                            if (
                                temp.questionItem.question.grading
                                    .correctAnswers.answers.length
                            )
                                return temp;
                            else
                                return {
                                    ...temp,
                                    questionItem: {
                                        ...temp.questionItem,
                                        question: {
                                            ...temp.questionItem.question,
                                            grading: undefined,
                                        },
                                    },
                                };
                        } else
                            return {
                                ...item,
                                questionItem: {
                                    ...item.questionItem,
                                    question: {
                                        ...item.questionItem.question,
                                        choiceQuestion: {
                                            ...item.questionItem.question
                                                .choiceQuestion,
                                            options:
                                                item.questionItem.question.choiceQuestion.options.filter(
                                                    (_, idx) =>
                                                        idx !==
                                                        action.payload.opIdx
                                                ),
                                        },
                                    },
                                },
                            };
                    } else return item;
                }),
            };
        case "title_heading":
            return {
                ...state,
                items: state.items.map((item) => {
                    if (item.itemId === action.payload.itemId) {
                        return {
                            ...item,
                            title: action.payload.value,
                        };
                    } else return item;
                }),
            };
        case "title_description":
            return {
                ...state,
                items: state.items.map((item) => {
                    if (item.itemId === action.payload.itemId) {
                        return {
                            ...item,
                            description: action.payload.value,
                        };
                    } else return item;
                }),
            };
        case "set_titlecard_heading":
            return "";
        case "set_titlecard_description":
            return "";
        case "delete_card":
            return {
                ...state,
                items: state.items.filter(
                    (item) => item.itemId !== action.payload
                ),
            };
        case "RADIO":
            return {
                ...state,
                items: state.items.map((item) => {
                    if (item.itemId === action.payload) {
                        if (
                            item.questionItem.question.hasOwnProperty(
                                "scaleQuestion"
                            )
                        )
                            return {
                                ...item,
                                questionItem: {
                                    question: {
                                        questionId:
                                            item.questionItem.question
                                                .questionId,
                                        choiceQuestion: {
                                            type: "RADIO",
                                            options: [
                                                {
                                                    value: "option 1",
                                                },
                                            ],
                                        },
                                    },
                                },
                            };
                        else
                            return {
                                ...item,
                                questionItem: {
                                    ...item.questionItem,
                                    question: {
                                        ...item.questionItem.question,
                                        choiceQuestion: {
                                            ...item.questionItem.question
                                                .choiceQuestion,
                                            type: "RADIO",
                                        },
                                    },
                                },
                            };
                    } else return item;
                }),
            };
        case "CHECKBOX":
            return {
                ...state,
                items: state.items.map((item) => {
                    if (item.itemId === action.payload) {
                        if (
                            item.questionItem.question.hasOwnProperty(
                                "scaleQuestion"
                            )
                        )
                            return {
                                ...item,
                                questionItem: {
                                    question: {
                                        questionId:
                                            item.questionItem.question
                                                .questionId,
                                        choiceQuestion: {
                                            type: "CHECKBOX",
                                            options: [
                                                {
                                                    value: "option 1",
                                                },
                                            ],
                                        },
                                    },
                                },
                            };
                        else
                            return {
                                ...item,
                                questionItem: {
                                    ...item.questionItem,
                                    question: {
                                        ...item.questionItem.question,
                                        choiceQuestion: {
                                            ...item.questionItem.question
                                                .choiceQuestion,
                                            type: "CHECKBOX",
                                        },
                                    },
                                },
                            };
                    } else return item;
                }),
            };
        case "LINEAR":
            return {
                ...state,
                items: state.items.map((item) => {
                    if (item.itemId === action.payload) {
                        return {
                            ...item,
                            questionItem: {
                                ...item.questionItem,
                                question: {
                                    questionId:
                                        item.questionItem.question.questionId,
                                    scaleQuestion: {
                                        low: 1,
                                        high: 5,
                                        lowLabel: "",
                                        highLabel: "",
                                    },
                                },
                            },
                        };
                    } else return item;
                }),
            };
        default:
            return state;
    }
};

function AssessmentFormCreate() {
    const { openIndexes, toggleIndex } = useAccordion({
        reducer: combineReducers(singleReducer, accordionReducer),
    });

    const { form_data, id, form_id } = useSelector(
        (state) => state.librarySlice.assessment.formData
    );
    const { loader } = useSelector((state) => state.librarySlice.assessment);
    const dispatchAction = useDispatch();
    const history = useHistory();

    const [formState, dispatch] = useReducer(FormReducer, form_data);
    const addQuestion = (index) => {
        dispatch({ type: "add_question_card", payload: index });
    };
    const addTitle = (index) => {
        dispatch({ type: "add_title_card", payload: index });
    };
    const deleteQuesTitleCard = (idx) => {
        const payload = {
            assessment_id: id,
            data: {
                form_id: form_id,
                form_data: {
                    requests: [
                        ...getUpdatePayload().data.form_data.requests,
                        {
                            deleteItem: {
                                location: {
                                    index: idx,
                                },
                            },
                        },
                    ],
                    includeFormInResponse: true,
                },
            },
        };
        dispatchAction(deleteQuestion(payload));
    };
    const setQuesType = (value) => {
        dispatch(value);
    };
    const length = formState?.items?.length;

    useEffect(() => {
        let activeAssessment = window.location.pathname.split("/")[4];
        if (!!activeAssessment && !form_data) {
            dispatchAction(getGoogleForm({ assessment_id: activeAssessment }));
        }
        // dispatchAction(createGoogleForm())
    }, []);

    useEffect(() => {
        if (form_data) {
            history.push(`/library/assessment/create/${id}`);
            dispatch({ type: "set_form_data", payload: form_data });
        }
        return () => {
            dispatch({ type: "set_form_data", payload: {} });
            // dispatchAction(setInitialState({}))
        };
    }, [form_data]);

    const getPayload = (index) => {
        return {
            assessment_id: id,
            data: {
                form_id: form_id,
                form_data: {
                    requests: [
                        ...getUpdatePayload().data.form_data.requests,
                        {
                            createItem: {
                                item: {
                                    title: "",
                                    questionItem: {
                                        question: {
                                            choiceQuestion: {
                                                type: "RADIO",
                                                options: [
                                                    { value: "Option 1" },
                                                ],
                                                shuffle: true,
                                            },
                                            required: true,
                                        },
                                    },
                                },
                                location: {
                                    index: index + 1,
                                },
                            },
                        },
                    ],
                    includeFormInResponse: true,
                },
            },
        };
    };

    const getUpdatePayload = () => {
        let temArr = [
            {
                updateFormInfo: {
                    info: {
                        description: formState?.info?.description,
                        title: formState?.info?.title,
                    },
                    updateMask: "title, description",
                },
            },
        ];
        formState.items.forEach((item, index) => {
            if (!item.questionItem.question.textQuestion)
                temArr.push({
                    updateItem: {
                        item: {
                            ...item,
                        },
                        location: {
                            index: index,
                        },
                        updateMask:
                            "title,questionItem.question,questionItem.question.choiceQuestion.options,questionItem.question.choiceQuestion.type,questionItem.question.grading.correctAnswers.answers,questionItem.question.grading.pointValue,questionItem.question.required",
                    },
                });
        });
        return {
            assessment_id: id,
            data: {
                form_id: form_id,
                form_data: {
                    requests: temArr,
                    includeFormInResponse: true,
                },
            },
        };
    };

    // console.log(formState)
    return (
        <Spinner loading={loader}>
            <Suspense fallback={<FallbackUI />}>
                {formState ? (
                    <div className="form_container overflowYscroll">
                        <TitleCard formState={formState} dispatch={dispatch} />
                        {formState?.items?.map((item, index) =>
                            item.hasOwnProperty("questionItem") ? (
                                <>
                                    {item.questionItem.question.hasOwnProperty(
                                        "textQuestion"
                                    ) && formState?.items.length === 1 ? (
                                        <div
                                            className="card_container_assess"
                                            style={{
                                                background: "none",
                                                height: "161px",
                                                boxShadow: "none",
                                            }}
                                        >
                                            {
                                                <div
                                                    className="create_icon_container"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <div
                                                        className="add_icon paddingTB9 paddingLR15 curPoint"
                                                        onClick={(e) => {
                                                            dispatchAction(
                                                                createUpdateQuestion(
                                                                    getPayload(
                                                                        index
                                                                    )
                                                                )
                                                            );
                                                        }}
                                                    >
                                                        {" "}
                                                        +{" "}
                                                    </div>
                                                    {false && (
                                                        <div
                                                            className="add_icon_title curPoint"
                                                            onClick={(e) => {}}
                                                        >
                                                            <TitleSvg />
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                        </div>
                                    ) : (
                                        <>
                                            {item.questionItem.question.hasOwnProperty(
                                                "textQuestion"
                                            ) ? (
                                                <></>
                                            ) : (
                                                <QuestionCard
                                                    isActive={openIndexes.includes(
                                                        index
                                                    )}
                                                    onClick={() =>
                                                        toggleIndex(index)
                                                    }
                                                    addQuestion={addQuestion}
                                                    addTitle={addTitle}
                                                    quesObjData={{
                                                        item,
                                                        index,
                                                    }}
                                                    deleteQuesTitleCard={
                                                        deleteQuesTitleCard
                                                    }
                                                    length={length}
                                                    setQuesType={setQuesType}
                                                    dispatch={dispatch}
                                                    getPayload={getPayload}
                                                />
                                            )}
                                        </>
                                    )}
                                </>
                            ) : (
                                <div
                                    className="card_container_assess"
                                    onClick={() => toggleIndex(index)}
                                    style={
                                        openIndexes.includes(index)
                                            ? {
                                                  borderLeft:
                                                      "6px solid #1A62F2",
                                              }
                                            : {}
                                    }
                                >
                                    <div className="title_body flex alignCenter padding16">
                                        <input
                                            type="text"
                                            className="title_input"
                                            placeholder="Enter your Title"
                                            onChange={(e) =>
                                                dispatch({
                                                    type: "title_heading",
                                                    payload: {
                                                        itemId: item.itemId,
                                                        value: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                        {/* <span className='marginL15 curPoint' onClick={() => deleteQuesTitleCard(item.itemId)}> */}
                                        <span
                                            className="marginL15 curPoint"
                                            onClick={() =>
                                                deleteQuesTitleCard(index)
                                            }
                                        >
                                            <DeleteSvg />
                                        </span>
                                    </div>
                                    <div className="padding16">
                                        <input
                                            type="text "
                                            className="input_element"
                                            placeholder="Discription (Optional)"
                                            onChange={(e) =>
                                                dispatch({
                                                    type: "title_description",
                                                    payload: {
                                                        itemId: item.itemId,
                                                        value: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>
                                    {openIndexes.includes(index) && (
                                        <div
                                            className="create_icon_container"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div
                                                className="add_icon paddingTB9 paddingLR15 curPoint"
                                                onClick={(e) => {
                                                    // addQuestion(index);
                                                    dispatchAction(
                                                        createUpdateQuestion(
                                                            getPayload(index)
                                                        )
                                                    );
                                                }}
                                            >
                                                {" "}
                                                +{" "}
                                            </div>
                                            {false && (
                                                <div
                                                    className="add_icon_title curPoint"
                                                    onClick={(e) => {
                                                        // addTitle(index);
                                                    }}
                                                >
                                                    <TitleSvg />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )
                        )}
                        <div className="save_btn">
                            <Button
                                onClick={() => {
                                    dispatchAction(
                                        createUpdateQuestion(getUpdatePayload())
                                    );
                                }}
                                type="primary"
                                // disabled={formState.items.length === 1}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="form_container"
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <NoDataSvg />
                    </div>
                )}
            </Suspense>
        </Spinner>
    );
}

const TitleCard = ({ formState, dispatch }) => {
    return (
        <div className="title_card_container">
            <div className="main_hadding_container">
                <input
                    type="text"
                    placeholder="Form heading"
                    className="form_heading"
                    onChange={(e) =>
                        dispatch({
                            type: "form_title",
                            payload: e.target.value,
                        })
                    }
                    value={formState?.info?.title}
                />
                <TextArea
                    onChange={(e) =>
                        dispatch({
                            type: "form_description",
                            payload: e.target.value,
                        })
                    }
                    value={formState?.info?.description}
                    autoSize={{ minRows: 1 }}
                    placeholder="Form description"
                    bordered={false}
                    className="form_discription"
                />
                {/* <textarea
                    type="text"
                    placeholder="Form discription"
                    className="form_discription dusty_gray_cl"
                    onChange={(e) =>
                        dispatch({
                            type: 'form_description',
                            payload: e.target.value,
                        })
                    }
                    value={formState?.info?.description}
                /> */}
            </div>
        </div>
    );
};

const QuestionCard = ({
    isActive,
    onClick,
    addQuestion,
    addTitle,
    quesObjData,
    deleteQuesTitleCard,
    length,
    setQuesType,
    dispatch,
    getPayload,
}) => {
    // const [activeCategoryTypes, setActiveCategoryTypes] = useState(1);
    // const [activeCategories, setActiveCategories] = useState(1);
    const dispatchAction = useDispatch();
    const [activeOptions, setActiveOptions] = useState([
        {
            id: uid(),
            value: "",
            cheacked: false,
        },
    ]);
    const [activeAnswerKeys, setActiveAnswerKeys] = useState(false);

    const addOptionValue = (e, idx) => {
        // activeOptions.find((item) => item.id === id).value = e.target.value;
        dispatch({
            type: "set_options_value",
            payload: {
                opIdx: idx,
                value: e.target.value,
                itemId: quesObjData?.item?.itemId,
            },
        });
    };

    const addOptionsHandler = (e) => {
        e.stopPropagation();
        // setActiveOptions([...activeOptions, { id: uid() }]);
        dispatch({
            type: "add_options",
            payload: { itemId: quesObjData?.item?.itemId },
        });
    };

    const removeOptionsHandler = (id) => {
        setActiveOptions(activeOptions.filter((item) => item.id !== id));
    };

    const catogories = [
        {
            key: 1,
            value: (
                <div className="select_item">
                    <span
                        style={{
                            padding: "12px 12px 12px 0",
                            display: "flex",
                        }}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="8" cy="8" r="7.5" stroke="#333333" />
                            <circle
                                cx="7.99984"
                                cy="8.00033"
                                r="5.33333"
                                fill="#333333"
                            />
                        </svg>
                    </span>
                    <span>{"Multiple"}</span>
                </div>
            ),
        },
        {
            key: 2,
            value: (
                <div className="select_item">
                    <span
                        style={{
                            padding: "12px 12px 12px 0",
                            display: "flex",
                        }}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M14.2222 0H1.77778C0.791111 0 0 0.8 0 1.77778V14.2222C0 15.2 0.791111 16 1.77778 16H14.2222C15.2089 16 16 15.2 16 14.2222V1.77778C16 0.8 15.2089 0 14.2222 0ZM6.22222 12.4444L1.77778 8L3.03111 6.74667L6.22222 9.92889L12.9689 3.18222L14.2222 4.44444L6.22222 12.4444Z"
                                fill="#333333"
                            />
                        </svg>
                    </span>
                    <span>{"Checkbox"}</span>
                </div>
            ),
        },
        {
            key: 3,
            value: (
                <div className="select_item">
                    <span
                        style={{
                            padding: "12px 12px 12px 0",
                            display: "flex",
                        }}
                    >
                        <svg
                            width="16"
                            height="4"
                            viewBox="0 0 16 4"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect
                                x="1"
                                y="1.5"
                                width="14"
                                height="1"
                                fill="#333333"
                            />
                            <circle cx="2" cy="2" r="2" fill="#333333" />
                            <circle cx="8" cy="2" r="2" fill="#333333" />
                            <circle cx="14" cy="2" r="2" fill="#333333" />
                        </svg>
                    </span>
                    <span>{"Linear"}</span>
                </div>
            ),
        },
    ];

    const onChange = (value) => {
        const temp =
            value === 1
                ? "RADIO"
                : value === 2
                ? "CHECKBOX"
                : value === 3
                ? "LINEAR"
                : "RADIO";
        setQuesType({ type: temp, payload: quesObjData?.item?.itemId });
    };

    const isRequired = ({ checked, itemId }) => {
        dispatch({
            type: "set_isQuestion_required",
            payload: { id: itemId, value: checked },
        });
    };

    return (
        <div
            className="card_container_assess"
            onClick={onClick}
            style={isActive ? { borderLeft: "6px solid #1A62F2" } : {}}
        >
            {!activeAnswerKeys ? (
                <>
                    {isActive ? (
                        <QuestionEditUI
                            // activeCategoryTypes={activeCategoryTypes}
                            setActiveAnswerKeys={setActiveAnswerKeys}
                            onChange={onChange}
                            catogories={catogories}
                            activeOptions={activeOptions}
                            addOptionValue={addOptionValue}
                            addOptionsHandler={addOptionsHandler}
                            removeOptionsHandler={removeOptionsHandler}
                            isRequired={isRequired}
                            deleteQuesTitleCard={deleteQuesTitleCard}
                            quesObjData={quesObjData}
                            dispatch={dispatch}
                        />
                    ) : (
                        <QuestionUI
                            activeOptions={activeOptions}
                            // activeCategoryTypes={activeCategoryTypes}
                            quesObjData={quesObjData}
                        />
                    )}
                </>
            ) : (
                <AnswerKeysUI
                    // activeCategoryTypes={activeCategoryTypes}
                    activeOptions={activeOptions}
                    setActiveAnswerKeys={setActiveAnswerKeys}
                    isActive={isActive}
                    quesObjData={quesObjData}
                    dispatch={dispatch}
                />
            )}
            {isActive && (
                <div
                    className="create_icon_container"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        className="add_icon paddingTB9 paddingLR15 curPoint"
                        onClick={(e) => {
                            e.stopPropagation();
                            // addQuestion(quesObjData.index);
                            dispatchAction(
                                createUpdateQuestion(
                                    getPayload(quesObjData.index)
                                )
                            );
                        }}
                    >
                        {" "}
                        +{" "}
                    </div>
                    {false && (
                        <div
                            className="add_icon_title curPoint"
                            onClick={(e) => {
                                e.stopPropagation();
                                // addTitle(quesObjData.index);
                            }}
                        >
                            <TitleSvg />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const QuestionUI = ({
    activeCategoryTypes,
    activeOptions,
    // onClick,
    quesObjData,
}) => {
    const [optionArr, setOptionArr] = useState([]);
    let high = quesObjData?.item?.questionItem?.question?.scaleQuestion?.high;
    let low = quesObjData?.item?.questionItem?.question?.scaleQuestion?.low
        ? quesObjData?.item?.questionItem?.question?.scaleQuestion?.low
        : 0;

    const getArr = () => {
        let arr = [];
        for (let i = low; i <= high; i++) {
            arr.push(i);
        }

        setOptionArr(arr);
    };

    useEffect(() => {
        getArr();
    }, [high, low]);

    return (
        // <div className="card_container" onClick={onClick}>
        <div className="card_body_multiselect" key={quesObjData?.item?.itemId}>
            <div className="font18 bold600 marginB15">
                {!!quesObjData.item.title ? quesObjData.item.title : "Question"}
            </div>
            {quesObjData.item.questionItem.question.hasOwnProperty(
                "scaleQuestion"
            ) ? (
                <div
                    className="flex alignCenter"
                    style={{ justifyContent: "space-around" }}
                >
                    <div className="alignSelfEnd marginR10">
                        {
                            quesObjData?.item?.questionItem?.question
                                ?.scaleQuestion?.lowLabel
                        }
                    </div>
                    {optionArr.map((item) => (
                        <div
                            className="paddingLR10 flex alignCenter"
                            style={{ flexDirection: "column" }}
                        >
                            <div className="marginB15">{item}</div>
                            <div>
                                <RadioSvg />
                            </div>
                        </div>
                    ))}
                    <div className="alignSelfEnd marginL10">
                        {
                            quesObjData?.item?.questionItem?.question
                                ?.scaleQuestion?.highLabel
                        }
                    </div>
                </div>
            ) : (
                quesObjData?.item?.questionItem?.question?.choiceQuestion?.options?.map(
                    (item, idx) => (
                        <div key={item.key} className="padding10">
                            {quesObjData?.item?.questionItem?.question
                                ?.choiceQuestion?.type === "RADIO" ? (
                                <Radio className="font16">
                                    {item.value
                                        ? item.value
                                        : `Option ${idx + 1}`}
                                </Radio>
                            ) : quesObjData?.item?.questionItem?.question
                                  ?.choiceQuestion?.type === "CHECKBOX" ? (
                                <Checkbox className="font16">
                                    {item.value
                                        ? item.value
                                        : `Option ${idx + 1}`}
                                </Checkbox>
                            ) : (
                                <></>
                            )}
                        </div>
                    )
                )
            )}
        </div>
        // </div>
    );
};

const QuestionEditUI = ({
    activeCategoryTypes,
    onChange,
    catogories,
    activeOptions,
    addOptionValue,
    addOptionsHandler,
    removeOptionsHandler,
    isRequired,
    // onClick,
    setActiveAnswerKeys,
    deleteQuesTitleCard,
    quesObjData,
    dispatch,
    // isActive,
}) => (
    // <div className="card_container"
    //     style={isActive ? { borderLeft: '6px solid #1A62F2' } : {}}
    //     onClick={onClick}>
    <>
        <div className="card_content" onClick={(e) => e.stopPropagation()}>
            <div className="card_header">
                <input
                    type="text"
                    placeholder="Your Question ?"
                    className="ques_input"
                    // onChange={(e) =>
                    //     dispatch({ type: 'set_question_value', payload: { value: e.target.value, id: quesObjData?.item?.itemId } })
                    // }
                    onChange={(e) =>
                        dispatch({
                            type: "set_question_value",
                            payload: {
                                value: e.target.value,
                                id: quesObjData?.item?.itemId,
                            },
                        })
                    }
                    value={quesObjData.item.title}
                />
                <Select
                    value={
                        quesObjData?.item?.questionItem?.question?.hasOwnProperty(
                            "scaleQuestion"
                        )
                            ? 3
                            : quesObjData?.item?.questionItem?.question
                                  ?.choiceQuestion?.type === "RADIO"
                            ? 1
                            : quesObjData?.item?.questionItem?.question
                                  ?.choiceQuestion?.type === "CHECKBOX"
                            ? 2
                            : 1
                    }
                    suffixIcon={
                        <svg
                            width="15"
                            height="8"
                            viewBox="0 0 15 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1.00928 1L7.01847 7L13.0277 1"
                                stroke="#666666"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    }
                    className="select_category"
                    style={{ width: 226 }}
                    onChange={onChange}
                >
                    {catogories.map((item, idx) => (
                        <Option value={item.key} key={item.idx}>
                            {item.value}
                        </Option>
                    ))}
                </Select>
            </div>
        </div>

        {quesObjData?.item?.questionItem?.question?.hasOwnProperty(
            "scaleQuestion"
        ) ? (
            <div
                className="card_body_multiselect flex"
                style={{ lineHeight: "normal" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div>
                    <Select
                        className="range_selecter marginR10"
                        options={[
                            {
                                value: 0,
                                key: 0,
                            },
                            {
                                value: 1,
                                key: 1,
                            },
                        ]}
                        defaultValue={
                            quesObjData.item.questionItem.question.scaleQuestion
                                .low
                                ? quesObjData.item.questionItem.question
                                      .scaleQuestion.low
                                : 0
                        }
                        suffixIcon={
                            <Icon className="fas fa-chevron-down dove_gray_cl" />
                        }
                        onChange={(value) =>
                            dispatch({
                                type: "set_low_scale",
                                payload: {
                                    itemId: quesObjData?.item?.itemId,
                                    value: value,
                                },
                            })
                        }
                    />
                    <Select
                        className="range_selecter"
                        options={[
                            {
                                value: 2,
                                key: 2,
                            },
                            {
                                value: 3,
                                key: 3,
                            },
                            {
                                value: 4,
                                key: 4,
                            },
                            {
                                value: 5,
                                key: 5,
                            },
                            {
                                value: 6,
                                key: 6,
                            },
                            {
                                value: 7,
                                key: 7,
                            },
                            {
                                value: 8,
                                key: 8,
                            },
                            {
                                value: 9,
                                key: 9,
                            },
                        ]}
                        defaultValue={
                            quesObjData.item.questionItem.question.scaleQuestion
                                .high
                        }
                        onChange={(value) =>
                            dispatch({
                                type: "set_high_scale",
                                payload: {
                                    itemId: quesObjData?.item?.itemId,
                                    value: value,
                                },
                            })
                        }
                        suffixIcon={
                            <Icon className="fas fa-chevron-down dove_gray_cl" />
                        }
                    />
                </div>
                <div className="marginT20">
                    <span className="marginR15">
                        {quesObjData.item.questionItem.question.scaleQuestion
                            .low
                            ? quesObjData.item.questionItem.question
                                  .scaleQuestion.low
                            : 0}
                    </span>
                    <input
                        type="text"
                        className="liner_scale_input"
                        placeholder="Label (optional)"
                        onChange={(e) =>
                            dispatch({
                                type: "set_low_scale_lable",
                                payload: {
                                    itemId: quesObjData?.item?.itemId,
                                    value: e.target.value,
                                },
                            })
                        }
                        value={
                            quesObjData.item.questionItem.question.scaleQuestion
                                .lowLabel
                        }
                    />
                </div>
                <div className="marginT20">
                    <span className="marginR15">
                        {
                            quesObjData.item.questionItem.question.scaleQuestion
                                .high
                        }
                    </span>
                    <input
                        type="text"
                        className="liner_scale_input"
                        placeholder="Label (optional)"
                        onChange={(e) =>
                            dispatch({
                                type: "set_high_scale_lable",
                                payload: {
                                    itemId: quesObjData?.item?.itemId,
                                    value: e.target.value,
                                },
                            })
                        }
                        value={
                            quesObjData.item.questionItem.question.scaleQuestion
                                .highLabel
                        }
                    />
                </div>
            </div>
        ) : (
            <>
                {quesObjData?.item?.questionItem?.question?.choiceQuestion
                    ?.type === "RADIO" && (
                    <div
                        className="card_body_multiselect font16 flex"
                        style={{ lineHeight: "normal" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {quesObjData?.item?.questionItem?.question
                            ?.choiceQuestion?.options?.length > 1
                            ? quesObjData?.item?.questionItem?.question?.choiceQuestion?.options?.map(
                                  ({ value }, idx) => {
                                      return (
                                          <span
                                              className="paddingTB8"
                                              key={idx}
                                          >
                                              <RadioSvg />
                                              <input
                                                  type="text"
                                                  placeholder={`Option ${
                                                      idx + 1
                                                  }`}
                                                  className="input_element marginL12"
                                                  value={value}
                                                  onChange={
                                                      (e) =>
                                                          addOptionValue(e, idx)
                                                      // dispatch({ type: 'set_options_value', payload: { opIdx: idx, value: e.target.value, itemId: quesObjData?.item?.itemId } })
                                                  }
                                              />
                                              <CloseSvg
                                                  className="curPoint"
                                                  onClick={() =>
                                                      // removeOptionsHandler(idx)
                                                      dispatch({
                                                          type: "remove_options",
                                                          payload: {
                                                              itemId: quesObjData
                                                                  ?.item
                                                                  ?.itemId,
                                                              opIdx: idx,
                                                          },
                                                      })
                                                  }
                                                  style={{
                                                      color: "#666666",
                                                      transform: "scale(0.6)",
                                                  }}
                                              />
                                          </span>
                                      );
                                  }
                              )
                            : quesObjData?.item?.questionItem?.question?.choiceQuestion?.options?.map(
                                  ({ value }, idx) => (
                                      <span className="paddingTB8" key={idx}>
                                          <RadioSvg />
                                          <input
                                              type="text"
                                              placeholder={`Option ${idx + 1}`}
                                              className="input_element marginL12"
                                              onChange={
                                                  (e) => addOptionValue(e, idx)
                                                  // dispatch({ type: 'set_options_value', payload: { opIdx: idx, value: e.target.value, itemId: quesObjData?.item?.itemId } })
                                              }
                                              value={value}
                                          />
                                      </span>
                                  )
                              )}
                        <span className="paddingTB8">
                            <RadioSvg />
                            {/* <span className='dusty_gray_cl marginL12'>Add option</span> or <span className='primary bold600'>Add “Other”</span> */}
                            <span
                                className="primary bold600 marginL12 curPoint"
                                onClick={
                                    (e) => addOptionsHandler(e)
                                    // dispatch({ type: 'add_options', payload: { itemId: quesObjData?.item?.itemId } })
                                }
                            >
                                Add option
                            </span>
                        </span>
                    </div>
                )}
                {quesObjData?.item?.questionItem?.question?.choiceQuestion
                    ?.type === "CHECKBOX" && (
                    <div
                        className="card_body_multiselect font16 flex"
                        style={{ lineHeight: "normal" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {quesObjData?.item?.questionItem?.question
                            ?.choiceQuestion?.options?.length > 1
                            ? quesObjData?.item?.questionItem?.question?.choiceQuestion?.options?.map(
                                  ({ value }, idx) => {
                                      return (
                                          <div className="paddingTB8" key={idx}>
                                              <CheckboxSvg />
                                              <input
                                                  type="text"
                                                  placeholder={`Option ${
                                                      idx + 1
                                                  }`}
                                                  className="input_element marginL12"
                                                  onChange={(e) => {
                                                      e.stopPropagation();
                                                      addOptionValue(e, idx);
                                                      // dispatch({ type: 'set_options_value', payload: { opIdx: idx, value: e.target.value, itemId: quesObjData?.item?.itemId } })
                                                  }}
                                                  value={value}
                                              />
                                              <CloseSvg
                                                  className="curPoint"
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      // removeOptionsHandler(idx)
                                                      dispatch({
                                                          type: "remove_options",
                                                          payload: {
                                                              itemId: quesObjData
                                                                  ?.item
                                                                  ?.itemId,
                                                              opIdx: idx,
                                                          },
                                                      });
                                                  }}
                                                  style={{
                                                      color: "#666666",
                                                      transform: "scale(0.6)",
                                                  }}
                                              />
                                          </div>
                                      );
                                  }
                              )
                            : quesObjData?.item?.questionItem?.question?.choiceQuestion?.options?.map(
                                  ({ value }, idx) => (
                                      <div className="paddingTB8" key={idx}>
                                          <CheckboxSvg />
                                          <input
                                              type="text"
                                              placeholder={`Option ${idx + 1}`}
                                              className="input_element marginL12"
                                              onChange={(e) => {
                                                  e.stopPropagation();
                                                  addOptionValue(e, idx);
                                                  // dispatch({ type: 'set_options_value', payload: { opIdx: idx, value: e.target.value, itemId: quesObjData?.item?.itemId } })
                                              }}
                                              value={value}
                                          />
                                      </div>
                                  )
                              )}
                        <span className="paddingTB8">
                            <CheckboxSvg />
                            <span
                                className="primary bold600 marginL12 curPoint"
                                onClick={(e) => addOptionsHandler(e)}
                            >
                                Add option
                            </span>
                        </span>
                    </div>
                )}
            </>
        )}
        <div
            className="card_footer flex justifySpaceBetween"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="left flex">
                <span className="flex">
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12.2483 5.72445C11.3027 4.83009 10.0266 4.37133 8.72817 4.45881C7.37002 4.5496 6.11785 5.22447 5.29515 6.30896C4.47251 7.39347 4.16029 8.7813 4.43906 10.1136C4.71784 11.4458 5.56025 12.5921 6.74867 13.256V14.4184C6.74867 14.6976 6.85957 14.9654 7.05703 15.1628C7.2545 15.3602 7.5222 15.4711 7.80144 15.4711H10.2573C10.5366 15.4711 10.8043 15.3602 11.0018 15.1628C11.1992 14.9654 11.3101 14.6976 11.3101 14.4184V13.256C12.6205 12.5268 13.5046 11.2163 13.69 9.72823C13.8753 8.24012 13.3398 6.75277 12.2483 5.72451V5.72445ZM10.5029 12.3832C10.4042 12.4299 10.3209 12.504 10.2629 12.5965C10.205 12.689 10.1747 12.7962 10.1755 12.9054V14.3249H7.89473V12.9054C7.89564 12.7961 7.86526 12.689 7.80725 12.5965C7.74923 12.504 7.66597 12.4299 7.5673 12.3832C6.57414 11.9309 5.84369 11.0479 5.58558 9.98768C5.32747 8.92748 5.57051 7.80747 6.24467 6.94936C6.91884 6.09126 7.94966 5.59043 9.04081 5.59043C10.1321 5.59043 11.1628 6.09134 11.8371 6.94936C12.5112 7.80741 12.7542 8.92742 12.4962 9.98768C12.2381 11.0479 11.5075 11.9309 10.5144 12.3832H10.5029Z"
                            fill="#1A62F2"
                            stroke="#1A62F2"
                            stroke-width="0.2"
                        />
                        <path
                            d="M11.377 16.9997C11.5816 16.9997 11.7709 16.8904 11.8732 16.7132C11.9757 16.5358 11.9757 16.3174 11.8732 16.1401C11.7709 15.9628 11.5817 15.8535 11.377 15.8535H6.68123C6.47657 15.8535 6.28732 15.9628 6.18499 16.1401C6.08254 16.3174 6.08254 16.5358 6.18499 16.7132C6.28732 16.8904 6.47656 16.9997 6.68123 16.9997H11.377Z"
                            fill="#1A62F2"
                            stroke="#1A62F2"
                            stroke-width="0.2"
                        />
                        <path
                            d="M9.6025 3.57546V1.57307C9.6025 1.3683 9.4932 1.17916 9.31595 1.07683C9.13859 0.974389 8.92023 0.974389 8.74285 1.07683C8.5656 1.17916 8.4563 1.36829 8.4563 1.57307V3.57546C8.4563 3.78012 8.5656 3.96937 8.74285 4.0717C8.92021 4.17414 9.13857 4.17414 9.31595 4.0717C9.4932 3.96937 9.6025 3.78013 9.6025 3.57546Z"
                            fill="#1A62F2"
                            stroke="#1A62F2"
                            stroke-width="0.2"
                        />
                        <path
                            d="M4.14846 9.02914C4.14846 8.87713 4.08816 8.73139 3.98069 8.62394C3.87322 8.51647 3.72749 8.45605 3.57549 8.45605H1.5731C1.36833 8.45605 1.17919 8.56535 1.07675 8.7426C0.974418 8.91996 0.974418 9.13832 1.07675 9.31571C1.17919 9.49295 1.36832 9.60225 1.5731 9.60225H3.57549C3.7275 9.60225 3.87324 9.54184 3.98069 9.43437C4.08816 9.3269 4.14846 9.18117 4.14846 9.02917V9.02914Z"
                            fill="#1A62F2"
                            stroke="#1A62F2"
                            stroke-width="0.2"
                        />
                        <path
                            d="M16.4853 8.45605H14.4829C14.2782 8.45605 14.089 8.56535 13.9867 8.7426C13.8843 8.91996 13.8843 9.13832 13.9867 9.31571C14.089 9.49295 14.2782 9.60225 14.4829 9.60225H16.4853C16.6901 9.60225 16.8792 9.49295 16.9816 9.31571C17.084 9.13834 17.084 8.91998 16.9816 8.7426C16.8792 8.56535 16.6901 8.45605 16.4853 8.45605Z"
                            fill="#1A62F2"
                            stroke="#1A62F2"
                            stroke-width="0.2"
                        />
                        <path
                            d="M5.57799 5.57698C5.68546 5.46951 5.74587 5.32367 5.74587 5.17178C5.74587 5.01977 5.68546 4.87392 5.57799 4.76647L4.1633 3.35029C4.01711 3.20547 3.80479 3.14974 3.60618 3.20399C3.40769 3.25824 3.25329 3.41424 3.20099 3.61331C3.14879 3.81237 3.2067 4.02412 3.35288 4.16893L4.77237 5.57698C4.87984 5.68445 5.02568 5.74487 5.17768 5.74487C5.32958 5.74487 5.47543 5.68445 5.58288 5.57698L5.57799 5.57698Z"
                            fill="#1A62F2"
                            stroke="#1A62F2"
                            stroke-width="0.2"
                        />
                        <path
                            d="M14.7058 3.35148C14.5983 3.24401 14.4526 3.18359 14.3006 3.18359C14.1486 3.18359 14.0028 3.24401 13.8954 3.35148L12.4791 4.76605C12.3329 4.91087 12.275 5.1226 12.3272 5.32167C12.3795 5.52074 12.5339 5.67676 12.7324 5.73099C12.9309 5.78523 13.1433 5.72951 13.2895 5.58469L14.7058 4.17012C14.8158 4.06231 14.8778 3.91475 14.8778 3.7608C14.8778 3.60674 14.8158 3.45931 14.7058 3.35148L14.7058 3.35148Z"
                            fill="#1A62F2"
                            stroke="#1A62F2"
                            stroke-width="0.2"
                        />
                    </svg>
                </span>
                <span
                    className="primary bold600 marginL10 curPoint"
                    onClick={(e) => {
                        e.stopPropagation();
                        setActiveAnswerKeys(true);
                    }}
                >
                    Answer Keys
                </span>
                <span className="dusty_gray_cl marginL8">{`(${
                    quesObjData?.item?.questionItem?.question?.grading
                        ?.pointValue
                        ? quesObjData?.item?.questionItem?.question?.grading
                              ?.pointValue
                        : 0
                } Point)`}</span>
            </div>
            <div className="right curPoint flex alignCenter">
                <span className="marginR16">
                    Required{" "}
                    <Switch
                        onChange={(checked) =>
                            isRequired({
                                checked,
                                itemId: quesObjData?.item?.itemId,
                            })
                        }
                        checked={
                            quesObjData?.item?.questionItem?.question?.required
                                ? quesObjData?.item?.questionItem?.question
                                      ?.required
                                : false
                        }
                    />
                </span>
                {/* <span onClick={() => deleteQuesTitleCard(quesObjData?.item?.itemId)}> */}
                <span onClick={() => deleteQuesTitleCard(quesObjData.index)}>
                    <DeleteSvg />
                </span>
            </div>
        </div>
    </>
);
// </div>

const AnswerKeysUI = ({
    activeCategoryTypes,
    activeOptions,
    setActiveAnswerKeys,
    isActive,
    quesObjData,
    dispatch,
}) => {
    const [activeAnswers, setActiveAnswers] = useState(
        quesObjData?.item?.questionItem?.question?.hasOwnProperty(
            "scaleQuestion"
        )
            ? []
            : quesObjData?.item?.questionItem?.question?.grading?.correctAnswers
                  ?.answers?.length
            ? quesObjData?.item?.questionItem?.question?.grading?.correctAnswers?.answers?.map(
                  (item) => item
              )
            : []
    );
    const setAnswerHandler = (item) => {
        // if (activeAnswers) {
        if (activeAnswers?.map((item) => item.value)?.includes(item.value)) {
            setActiveAnswers(
                activeAnswers.filter((obj) => obj.value !== item.value)
            );
        } else setActiveAnswers([...activeAnswers, item]);
        // }
        // else
        //     setActiveAnswers([item])
    };
    useEffect(() => {
        if (
            !quesObjData.item.questionItem.question.hasOwnProperty(
                "scaleQuestion"
            )
        ) {
            dispatch({
                type: "set_question_answers",
                payload: {
                    value: activeAnswers,
                    id: quesObjData?.item?.itemId,
                },
            });
        }
    }, [activeAnswers]);

    // <div className='card_container' style={isActive ? { borderLeft: '6px solid #1A62F2' } : {}}>
    return (
        <>
            {
                <div
                    className="card_content"
                    onClick={
                        isActive
                            ? (e) => {
                                  e.stopPropagation();
                              }
                            : setActiveAnswerKeys(false)
                    }
                >
                    <div className="ans_key_header">
                        <span>
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12.2483 5.72445C11.3027 4.83009 10.0266 4.37133 8.72817 4.45881C7.37002 4.5496 6.11785 5.22447 5.29515 6.30896C4.47251 7.39347 4.16029 8.7813 4.43906 10.1136C4.71784 11.4458 5.56025 12.5921 6.74867 13.256V14.4184C6.74867 14.6976 6.85957 14.9654 7.05703 15.1628C7.2545 15.3602 7.5222 15.4711 7.80144 15.4711H10.2573C10.5366 15.4711 10.8043 15.3602 11.0018 15.1628C11.1992 14.9654 11.3101 14.6976 11.3101 14.4184V13.256C12.6205 12.5268 13.5046 11.2163 13.69 9.72823C13.8753 8.24012 13.3398 6.75277 12.2483 5.72451V5.72445ZM10.5029 12.3832C10.4042 12.4299 10.3209 12.504 10.2629 12.5965C10.205 12.689 10.1747 12.7962 10.1755 12.9054V14.3249H7.89473V12.9054C7.89564 12.7961 7.86526 12.689 7.80725 12.5965C7.74923 12.504 7.66597 12.4299 7.5673 12.3832C6.57414 11.9309 5.84369 11.0479 5.58558 9.98768C5.32747 8.92748 5.57051 7.80747 6.24467 6.94936C6.91884 6.09126 7.94966 5.59043 9.04081 5.59043C10.1321 5.59043 11.1628 6.09134 11.8371 6.94936C12.5112 7.80741 12.7542 8.92742 12.4962 9.98768C12.2381 11.0479 11.5075 11.9309 10.5144 12.3832H10.5029Z"
                                    fill="#1A62F2"
                                    stroke="#1A62F2"
                                    stroke-width="0.2"
                                />
                                <path
                                    d="M11.377 16.9997C11.5816 16.9997 11.7709 16.8904 11.8732 16.7132C11.9757 16.5358 11.9757 16.3174 11.8732 16.1401C11.7709 15.9628 11.5817 15.8535 11.377 15.8535H6.68123C6.47657 15.8535 6.28732 15.9628 6.18499 16.1401C6.08254 16.3174 6.08254 16.5358 6.18499 16.7132C6.28732 16.8904 6.47656 16.9997 6.68123 16.9997H11.377Z"
                                    fill="#1A62F2"
                                    stroke="#1A62F2"
                                    stroke-width="0.2"
                                />
                                <path
                                    d="M9.6025 3.57546V1.57307C9.6025 1.3683 9.4932 1.17916 9.31595 1.07683C9.13859 0.974389 8.92023 0.974389 8.74285 1.07683C8.5656 1.17916 8.4563 1.36829 8.4563 1.57307V3.57546C8.4563 3.78012 8.5656 3.96937 8.74285 4.0717C8.92021 4.17414 9.13857 4.17414 9.31595 4.0717C9.4932 3.96937 9.6025 3.78013 9.6025 3.57546Z"
                                    fill="#1A62F2"
                                    stroke="#1A62F2"
                                    stroke-width="0.2"
                                />
                                <path
                                    d="M4.14846 9.02914C4.14846 8.87713 4.08816 8.73139 3.98069 8.62394C3.87322 8.51647 3.72749 8.45605 3.57549 8.45605H1.5731C1.36833 8.45605 1.17919 8.56535 1.07675 8.7426C0.974418 8.91996 0.974418 9.13832 1.07675 9.31571C1.17919 9.49295 1.36832 9.60225 1.5731 9.60225H3.57549C3.7275 9.60225 3.87324 9.54184 3.98069 9.43437C4.08816 9.3269 4.14846 9.18117 4.14846 9.02917V9.02914Z"
                                    fill="#1A62F2"
                                    stroke="#1A62F2"
                                    stroke-width="0.2"
                                />
                                <path
                                    d="M16.4853 8.45605H14.4829C14.2782 8.45605 14.089 8.56535 13.9867 8.7426C13.8843 8.91996 13.8843 9.13832 13.9867 9.31571C14.089 9.49295 14.2782 9.60225 14.4829 9.60225H16.4853C16.6901 9.60225 16.8792 9.49295 16.9816 9.31571C17.084 9.13834 17.084 8.91998 16.9816 8.7426C16.8792 8.56535 16.6901 8.45605 16.4853 8.45605Z"
                                    fill="#1A62F2"
                                    stroke="#1A62F2"
                                    stroke-width="0.2"
                                />
                                <path
                                    d="M5.57799 5.57698C5.68546 5.46951 5.74587 5.32367 5.74587 5.17178C5.74587 5.01977 5.68546 4.87392 5.57799 4.76647L4.1633 3.35029C4.01711 3.20547 3.80479 3.14974 3.60618 3.20399C3.40769 3.25824 3.25329 3.41424 3.20099 3.61331C3.14879 3.81237 3.2067 4.02412 3.35288 4.16893L4.77237 5.57698C4.87984 5.68445 5.02568 5.74487 5.17768 5.74487C5.32958 5.74487 5.47543 5.68445 5.58288 5.57698L5.57799 5.57698Z"
                                    fill="#1A62F2"
                                    stroke="#1A62F2"
                                    stroke-width="0.2"
                                />
                                <path
                                    d="M14.7058 3.35148C14.5983 3.24401 14.4526 3.18359 14.3006 3.18359C14.1486 3.18359 14.0028 3.24401 13.8954 3.35148L12.4791 4.76605C12.3329 4.91087 12.275 5.1226 12.3272 5.32167C12.3795 5.52074 12.5339 5.67676 12.7324 5.73099C12.9309 5.78523 13.1433 5.72951 13.2895 5.58469L14.7058 4.17012C14.8158 4.06231 14.8778 3.91475 14.8778 3.7608C14.8778 3.60674 14.8158 3.45931 14.7058 3.35148L14.7058 3.35148Z"
                                    fill="#1A62F2"
                                    stroke="#1A62F2"
                                    stroke-width="0.2"
                                />
                            </svg>
                        </span>
                        <span className="title bold600 font16 marginL10">
                            Choose correct answers
                        </span>
                    </div>
                    <div className="ans_key_body">
                        <div className="ans_key_body_title">
                            <div className="left">
                                {quesObjData?.item?.title
                                    ? quesObjData?.item?.title
                                    : "Question"}
                            </div>
                            <div className="right">
                                <input
                                    type="number"
                                    className="input_element"
                                    style={{
                                        borderBottom:
                                            "1px solid rgba(153, 153, 153, 0.2)",
                                        width: "49px",
                                    }}
                                    value={
                                        quesObjData?.item?.questionItem
                                            ?.question?.grading?.pointValue
                                            ? quesObjData?.item?.questionItem
                                                  ?.question?.grading
                                                  ?.pointValue
                                            : 0
                                    }
                                    // onChange={(e) => addQuestionPoint(e , id)}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "set_question_marks",
                                            payload: {
                                                value: e.target.value,
                                                id: quesObjData?.item?.itemId,
                                            },
                                        })
                                    }
                                />{" "}
                                Point
                            </div>
                        </div>
                        {quesObjData.item.questionItem.question.hasOwnProperty(
                            "scaleQuestion"
                        ) ? (
                            <></>
                        ) : (
                            <div className="content">
                                {quesObjData?.item?.questionItem?.question?.choiceQuestion?.options?.map(
                                    (item, idx) => {
                                        const temp = activeAnswers
                                            ?.map((opt) => opt.value)
                                            ?.includes(item.value);
                                        // console.log(activeAnswers?.map(opt => {
                                        //     console.log(opt.value, item.value)
                                        //     return opt.value

                                        // })?.includes(item.value))
                                        return (
                                            <div
                                                className="padding8 marginT5 borderRadius6 flex alignCenter justifySpaceBetween curPoint"
                                                key={idx}
                                                // onClick={() => setAnswerHandler(item)}
                                                style={
                                                    temp
                                                        ? {
                                                              background:
                                                                  "rgba(26, 98, 242, 0.1)",
                                                          }
                                                        : {}
                                                }
                                            >
                                                {quesObjData?.item?.questionItem
                                                    ?.question?.choiceQuestion
                                                    ?.type === "RADIO" && (
                                                    <Radio
                                                        checked={temp}
                                                        onClick={() =>
                                                            setAnswerHandler(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        {!!item.value
                                                            ? item.value
                                                            : `Option ${
                                                                  idx + 1
                                                              }`}
                                                    </Radio>
                                                )}
                                                {quesObjData?.item?.questionItem
                                                    ?.question?.choiceQuestion
                                                    ?.type === "CHECKBOX" && (
                                                    <Checkbox
                                                        checked={temp}
                                                        onClick={() =>
                                                            setAnswerHandler(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        {!!item.value
                                                            ? item.value
                                                            : `Option ${
                                                                  idx + 1
                                                              }`}
                                                    </Checkbox>
                                                )}
                                                {temp &&
                                                    quesObjData?.item
                                                        ?.questionItem?.question
                                                        ?.choiceQuestion
                                                        ?.type !== "LINEAR" && (
                                                        <span>
                                                            <svg
                                                                width="26"
                                                                height="26"
                                                                viewBox="0 0 26 26"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M12.1108 17.0007L12.1116 16.9999L18.5007 10.4607C18.5009 10.4605 18.501 10.4603 18.5012 10.4601C18.8997 10.0611 18.8995 9.398 18.5007 8.99918C18.1017 8.60019 17.4684 8.60019 17.0694 8.99918L17.0687 8.99992L11.3806 14.8065L8.90192 12.2404L8.90194 12.2404L8.90071 12.2391C8.50171 11.8401 7.86839 11.8401 7.4694 12.2391C7.07058 12.638 7.07041 13.3011 7.46889 13.7001C7.46906 13.7003 7.46923 13.7004 7.4694 13.7006L10.6785 16.9997L10.6785 16.9997L10.6795 17.0007C11.0785 17.3997 11.7118 17.3997 12.1108 17.0007ZM0.9 13C0.9 19.6852 6.31477 25.1 13 25.1C19.6852 25.1 25.1 19.6852 25.1 13C25.1 6.31477 19.6852 0.9 13 0.9C6.31477 0.9 0.9 6.31477 0.9 13ZM2.9 13C2.9 7.41528 7.41523 2.9 13 2.9C18.5849 2.9 23.1002 7.41523 23.1 13C23.1 18.5847 18.5848 23.1 13 23.1C7.41528 23.1 2.9 18.5848 2.9 13Z"
                                                                    fill="#1A62F2"
                                                                    stroke="#1A62F2"
                                                                    stroke-width="0.2"
                                                                />
                                                            </svg>
                                                        </span>
                                                    )}
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        )}
                        {/* <div className="feedback">
                        {
                            false &&
                            <>
                                <span>
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 14 14"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M11.8802 0H1.32002C0.594009 0 0.00660009 0.594009 0.00660009 1.32002L0 13.2002L2.64004 10.5602H11.8802C12.6062 10.5602 13.2002 9.96615 13.2002 9.24014V1.32002C13.2002 0.594009 12.6062 0 11.8802 0ZM11.8802 9.24014H2.09223L1.70283 9.62954L1.32002 10.0123V1.32002H11.8802V9.24014ZM5.94009 6.6001H7.26011V7.92012H5.94009V6.6001ZM5.94009 2.64004H7.26011V5.28008H5.94009V2.64004Z"
                                            fill="#1A62F2"
                                        />
                                    </svg>
                                </span>
                                <span className="primary bold600 font16 marginL13 curPoint">
                                    Add Answer Feedback{' '}
                                </span>
                            </>
                        }

                    </div> */}
                        <div
                            className="footer marginT16"
                            style={{
                                borderTop: "1px solid rgba(153, 153, 153, 0.2)",
                            }}
                        >
                            <span
                                className="done_btn"
                                onClick={() => {
                                    setActiveAnswerKeys(false);
                                    setActiveAnswers([]);
                                }}
                            >
                                Done
                            </span>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default AssessmentFormCreate;
