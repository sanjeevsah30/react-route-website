import { openNotification } from "@store/common/actions";
import {
    Button,
    Divider,
    Form,
    Input,
    Popconfirm,
    Radio,
    Select,
    Space,
} from "antd";
import { useContext, useRef, useState } from "react";
import PlusSvg from "app/static/svg/PlusSvg";
import "../battle_card.scss";
import { BattleCardContext } from "../BattleCardContext";
import DeleteSvg from "app/static/svg/DeleteSvg";
import { BattleCardTypeConfig } from "../BattleCardConfigModalReducer";
const { TextArea } = Input;

const ActionConfigurationForm = ({ form }) => {
    const {
        modalState: { type },
        modalDispatch,
    } = useContext(BattleCardContext);
    return (
        <Form layout="vertical" requiredMark={false} form={form}>
            <Form.Item label="Choose your input type">
                <Radio.Group
                    value={type}
                    onChange={(e) =>
                        modalDispatch({
                            type: "UPDATE_MODAL_STATE",
                            payload: {
                                type: e.target.value,
                            },
                        })
                    }
                >
                    <Radio value={BattleCardTypeConfig.HINT}>Hint</Radio>
                    <Radio
                        value={BattleCardTypeConfig.CHECKLIST}
                        style={{ marginLeft: "24px" }}
                    >
                        Checklist
                    </Radio>
                    <Radio
                        value={BattleCardTypeConfig.GUIDED_WORKFLOW}
                        style={{ marginLeft: "24px" }}
                    >
                        Guided Workflow
                    </Radio>
                </Radio.Group>
            </Form.Item>
            {type === BattleCardTypeConfig.HINT && <Hint />}
            {type === BattleCardTypeConfig.CHECKLIST && <Checklist />}
            {type === BattleCardTypeConfig.GUIDED_WORKFLOW && (
                <GuidedWorkflow />
            )}
        </Form>
    );
};

function Hint() {
    const {
        modalState: { hint },
        modalDispatch,
    } = useContext(BattleCardContext);
    return (
        <Form.Item label="Hint">
            <h5 className="form_item_desc">
                Give hints to your agents to help them on the call
            </h5>
            <TextArea
                value={hint}
                rows={6}
                onChange={(e) =>
                    modalDispatch({
                        type: "UPDATE_MODAL_STATE",
                        payload: {
                            hint:
                                e.target.value.length <= 500
                                    ? e.target.value
                                    : e.target.value.substring(0, 500),
                        },
                    })
                }
            />
            <h5 className="form_item_desc" style={{ float: "right" }}>
                {500 - hint.length} Characters
            </h5>
        </Form.Item>
    );
}

function Checklist() {
    const {
        modalState: { check_list },
        modalDispatch,
    } = useContext(BattleCardContext);
    return (
        <Form.Item label="Checklist">
            <h5 className="form_item_desc marginB8">
                Make sure agents never miss out on following certain procedure.
                <br></br>
                For Example: Processing Refund.
            </h5>

            {check_list.map((val, index) => (
                <div className="flex alignCenter marginB12" key={index}>
                    <h5
                        className="form_item_desc marginR12"
                        style={{ fontWeight: 500 }}
                    >
                        #{index + 1}
                    </h5>
                    <Input
                        value={check_list[index]}
                        onChange={(e) =>
                            modalDispatch({
                                type: "UPDATE_MODAL_STATE",
                                payload: {
                                    check_list: check_list.map((item, i) => {
                                        if (index === i) return e.target.value;
                                        return item;
                                    }),
                                },
                            })
                        }
                    />
                    <Popconfirm
                        title="Are you sure to delete this?"
                        onConfirm={() => {
                            modalDispatch({
                                type: "UPDATE_MODAL_STATE",
                                payload: {
                                    check_list: check_list.filter((item, i) => {
                                        return index !== i;
                                    }),
                                },
                            });
                        }}
                        okText="Yes"
                        cancelText="No"
                        disabled={index === 0}
                    >
                        <span className="dove_gray_cl curPoint marginL16">
                            <DeleteSvg />
                        </span>
                    </Popconfirm>
                </div>
            ))}
            <Button
                type="text"
                className="marginT4 padding0"
                style={{ color: "#1A62F2" }}
                onClick={() => {
                    modalDispatch({
                        type: "UPDATE_MODAL_STATE",
                        payload: {
                            check_list: [...check_list, ""],
                        },
                    });
                }}
            >
                <PlusSvg />
                Add more
            </Button>
        </Form.Item>
    );
}

function GuidedWorkflow() {
    const {
        modalState: { guided_workflow },
        modalDispatch,
    } = useContext(BattleCardContext);
    return (
        <Form.Item label="Guided Workflow">
            <h5 className="form_item_desc marginB8">
                Help agents follow protocols to make them overcome the
                situation.
            </h5>

            {guided_workflow.map((val, index) => (
                <div className="marginB12">
                    <h5
                        className="form_item_desc marginR12 block"
                        style={{ fontWeight: 500 }}
                    >
                        Step {index + 1}
                    </h5>
                    <div className="flex alignCenter">
                        <Input
                            value={guided_workflow[index]}
                            onChange={(e) =>
                                modalDispatch({
                                    type: "UPDATE_MODAL_STATE",
                                    payload: {
                                        guided_workflow: guided_workflow.map(
                                            (item, i) => {
                                                if (index === i)
                                                    return e.target.value;
                                                return item;
                                            }
                                        ),
                                    },
                                })
                            }
                        />
                        <Popconfirm
                            title="Are you sure to delete this?"
                            onConfirm={() => {
                                modalDispatch({
                                    type: "UPDATE_MODAL_STATE",
                                    payload: {
                                        guided_workflow: guided_workflow.filter(
                                            (item, i) => {
                                                return index !== i;
                                            }
                                        ),
                                    },
                                });
                            }}
                            okText="Yes"
                            cancelText="No"
                            disabled={index === 0}
                        >
                            <span className="dove_gray_cl curPoint marginL16">
                                <DeleteSvg />
                            </span>
                        </Popconfirm>
                    </div>
                </div>
            ))}

            <Button
                type="text"
                className="marginT4 padding0"
                style={{ color: "#1A62F2" }}
                onClick={() => {
                    modalDispatch({
                        type: "UPDATE_MODAL_STATE",
                        payload: {
                            guided_workflow: [...guided_workflow, ""],
                        },
                    });
                }}
            >
                <PlusSvg />
                Add more
            </Button>
        </Form.Item>
    );
}

export default ActionConfigurationForm;
