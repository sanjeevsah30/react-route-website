import { openNotification } from "@store/common/actions";
import { Button, Divider, Form, Input, Radio, Select, Space } from "antd";
import { useContext, useRef, useState } from "react";
import Chip from "../Chip";
import "../battle_card.scss";
import { BattleCardContext } from "../BattleCardContext";

const TriggerConfigurationForm = ({ form }) => {
    const [keyword, setKeyword] = useState("");
    const options = [];

    const {
        modalState: { phrases, mentioned_by },
        modalDispatch,
    } = useContext(BattleCardContext);

    for (let i = 10; i < 36; i++) {
        options.push({
            label: i.toString(36) + i,
            value: i.toString(36) + i,
        });
    }
    const handleChange = (e) => {
        const value = e.target.value;
        var accepted = /^[0-9a-zA-Z]+$/;
        if (value.match(accepted) || value === "") {
            setKeyword(value);
        } else {
            openNotification("error", "Special character not supported");
        }
    };

    const handleAdd = () => {
        if (phrases.includes(keyword)) {
            openNotification("error", `${keyword} already present`);
            return;
        }
        modalDispatch({
            type: "UPDATE_MODAL_STATE",
            payload: {
                phrases: [...phrases, keyword],
            },
        });
        setKeyword("");
    };

    const handleRemove = (value) => {
        modalDispatch({
            type: "UPDATE_MODAL_STATE",
            payload: {
                phrases: phrases.filter((item) => item !== value),
            },
        });
    };
    return (
        <Form layout="vertical" requiredMark={false} form={form}>
            <Form.Item label="Add Keywords / Phrases*">
                <Input
                    onChange={handleChange}
                    value={keyword}
                    placeholder="Add Keywords / Phrases"
                    suffix={
                        <Button type="primary" onClick={handleAdd}>
                            Add
                        </Button>
                    }
                    onPressEnter={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAdd();
                    }}
                />
                <p className="addtional_info">
                    *Special Characters are not supported
                </p>
                <div
                    className="card_details--teams--chips"
                    style={{ maxHeight: "8rem", overflow: "scroll" }}
                >
                    {phrases.map((item) => (
                        <Chip
                            key={item}
                            title={item}
                            handleRemove={handleRemove}
                        />
                    ))}
                </div>
            </Form.Item>

            <Form.Item label="Mentioned By">
                <Radio.Group
                    onChange={(e) => {
                        modalDispatch({
                            type: "UPDATE_MODAL_STATE",
                            payload: {
                                mentioned_by: e.target.value,
                            },
                        });
                    }}
                    value={mentioned_by}
                >
                    <Radio value="agent">Agent</Radio>
                    <Radio value="customer" style={{ marginLeft: "24px" }}>
                        Customer
                    </Radio>
                    <Radio value="both" style={{ marginLeft: "24px" }}>
                        Both
                    </Radio>
                </Radio.Group>
            </Form.Item>
        </Form>
    );
};

export default TriggerConfigurationForm;
