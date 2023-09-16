import { Form, Input, Radio } from "antd";
import { useContext } from "react";
import { RuleModalContext } from "../RuleModalContext";

const ConfigureForm = () => {
    const {
        auditOptions,
        auditType,
        scheduling,
        schedulingOptions,
        name,
        description,
        dispatch,
    } = useContext(RuleModalContext);

    return (
        <Form layout="vertical" requiredMark={false}>
            <Form.Item label="Sampling Rule Name*">
                <Input
                    placeholder="Enter Rule Name"
                    value={name}
                    onChange={({ target: { value } }) =>
                        dispatch({ type: "SET_RULE_NAME", payload: value })
                    }
                />
            </Form.Item>
            <Form.Item label="Description">
                <Input.TextArea
                    style={{ resize: "none", height: 80 }}
                    value={description}
                    onChange={({ target: { value } }) => {
                        dispatch({
                            type: "SET_RULE_DESCRIPTION",
                            payload: value,
                        });
                    }}
                    placeholder="Enter description"
                />
            </Form.Item>
            <Form.Item label="Audit Type">
                <Radio.Group
                    options={auditOptions}
                    value={auditType}
                    onChange={({ target: { value } }) => {
                        dispatch({ type: "SET_AUDIT_TYPE", payload: value });
                        if (value === "manual") {
                            dispatch({
                                type: "SET_DATES",
                                payload: "yesterday",
                            });
                        } else {
                            dispatch({ type: "SET_DATES", payload: null });
                        }
                        if (value === "ai") {
                            dispatch({
                                type: "SET_TARGET_AGGREGATE",
                                payload: null,
                            });
                            dispatch({
                                type: "SET_SCHEDULING",
                                payload: "recurring",
                            });
                        } else {
                            dispatch({
                                type: "SET_TARGET_AGGREGATE",
                                payload: { value: "max", label: "Max" },
                            });
                        }
                    }}
                />
            </Form.Item>
            <Form.Item label="Scheduling">
                <Radio.Group
                    value={scheduling}
                    onChange={({ target: { value } }) => {
                        dispatch({
                            type: "SET_SCHEDULING",
                            payload: value,
                        });
                    }}
                >
                    {schedulingOptions.map(({ value, label }) => (
                        <Radio
                            value={value}
                            disabled={
                                auditType === "ai" && value === "one_time"
                            }
                            key={value}
                        >
                            {label}
                        </Radio>
                    ))}
                </Radio.Group>
            </Form.Item>
        </Form>
    );
};

export default ConfigureForm;
