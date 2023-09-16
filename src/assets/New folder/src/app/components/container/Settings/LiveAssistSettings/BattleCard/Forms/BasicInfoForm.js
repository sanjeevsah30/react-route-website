import { Button, Divider, Form, Input, Select, Space } from "antd";
import { useContext, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import Chip from "../Chip";
import { BattleCardContext } from "../BattleCardContext";
import { useSelector } from "react-redux";
import Icon from "@presentational/reusables/Icon";
import { uid } from "@tools/helpers";
import { openNotification } from "@store/common/actions";
import CustomTreeMultipleSelect from "app/components/Resuable/Select/CustomTreeMultipleSelect";
const { Option } = Select;

const BasicInfoForm = ({ form }) => {
    const {
        modalState: { name, team_ids, category },
        modalDispatch,
    } = useContext(BattleCardContext);
    const {
        common: { teams },
        liveAssistSlice: { categories },
    } = useSelector((state) => state);

    const [localCategories, setLocalCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");

    const handleAdd = () => {
        if (
            categories?.data?.find(
                (e) => e?.name?.toLowerCase() === categoryName?.toLowerCase()
            )
        ) {
            return openNotification(
                "error",
                "Error",
                "Category already exists"
            );
        }
        setLocalCategories((prev) =>
            Array.from(new Set([...prev.map((e) => e.name), categoryName])).map(
                (e) => {
                    return { id: uid(), name: e };
                }
            )
        );
        modalDispatch({
            type: "UPDATE_MODAL_STATE",
            payload: {
                category: { id: categoryName, name: categoryName },
            },
        });
        setCategoryName("");
    };
    return (
        <Form layout="vertical" requiredMark={false} form={form}>
            <Form.Item label="Name of Battle Card*">
                <Input
                    value={name}
                    onChange={(e) =>
                        modalDispatch({
                            type: "UPDATE_MODAL_STATE",
                            payload: {
                                name: e.target.value,
                            },
                        })
                    }
                    placeholder="A unique name for the battle card"
                />
            </Form.Item>
            <Form.Item label="Choose/ Add a Category*">
                <Select
                    placeholder="Choose from existing or add a new one"
                    allowClear
                    suffixIcon={
                        <Icon className="fas fa-chevron-down dove_gray_cl" />
                    }
                    value={category?.id}
                    onChange={(e) => {
                        modalDispatch({
                            type: "UPDATE_MODAL_STATE",
                            payload: {
                                category: [
                                    ...categories.data,
                                    ...localCategories,
                                ].find((item) => item.id === e),
                            },
                        });
                    }}
                    dropdownRender={(menu) => (
                        <>
                            {menu}
                            <Divider style={{ margin: "8px 0" }} />
                            <Space style={{ padding: "0 8px 4px" }}>
                                <Input
                                    placeholder="Please enter item"
                                    value={categoryName}
                                    onChange={(e) =>
                                        setCategoryName(e.target.value)
                                    }
                                    onPressEnter={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (categoryName) {
                                            handleAdd();
                                        }
                                    }}
                                />
                                <Button
                                    type="text"
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                        if (categoryName) {
                                            handleAdd();
                                        }
                                    }}
                                >
                                    Add Category
                                </Button>
                            </Space>
                        </>
                    )}
                >
                    {categories.data.map(({ id, name }) => {
                        return (
                            <Option key={id} value={id}>
                                {name}
                            </Option>
                        );
                    })}
                    {localCategories.map(({ id, name }) => {
                        return (
                            <Option key={id} value={name}>
                                {name}
                            </Option>
                        );
                    })}
                </Select>
            </Form.Item>
            <Form.Item label="Applicable Teams & Subteams*">
                <CustomTreeMultipleSelect
                    data={teams}
                    value={team_ids}
                    onChange={(values) => {
                        modalDispatch({
                            type: "UPDATE_MODAL_STATE",
                            payload: { team_ids: [...values] },
                        });
                    }}
                    placeholder="Select Teams"
                    select_placeholder="Select Teams"
                    style={{
                        width: "100%",

                        height: "auto",
                        padding: "0",
                    }}
                    className=" multiple__select"
                    fieldNames={{
                        label: "name",
                        value: "id",
                        children: "subteams",
                    }}
                    option_name="name"
                    type="team"
                    treeNodeFilterProp="name"
                />
            </Form.Item>
        </Form>
    );
};

export default BasicInfoForm;
