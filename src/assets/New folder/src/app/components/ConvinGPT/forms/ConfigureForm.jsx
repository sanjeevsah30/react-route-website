import { Form, Input, Radio } from "antd";
import { useContext } from "react";
import { DatasetModalContext } from "../DatasetModalContext";

const ConfigureForm = () => {
    const { dispatch, ...state } = useContext(DatasetModalContext);

    return (
        <Form layout="vertical" requiredMark={false}>
            <Form.Item
                label={
                    <span>
                        Dataset Name<span style={{ color: "#FF6365" }}>*</span>
                    </span>
                }
            >
                <Input
                    placeholder="Enter Dataset Name"
                    value={state?.name}
                    onChange={({ target: { value } }) => {
                        dispatch({ type: "SET_DATASET_NAME", payload: value });
                    }}
                />
            </Form.Item>
            <Form.Item label="Description">
                <Input.TextArea
                    style={{ resize: "none", height: 80 }}
                    value={state?.description}
                    onChange={({ target: { value } }) => {
                        dispatch({
                            type: "SET_DATASET_DESCRIPTION",
                            payload: value,
                        });
                    }}
                    placeholder="Enter Description"
                />
            </Form.Item>
        </Form>
    );
};

export default ConfigureForm;
