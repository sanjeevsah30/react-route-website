import { Input, Select } from "antd";
import { useContext } from "react";
import convinGptConfig from "../../../constants/ConvinGpt/index";
import { DatasetModalContext } from "../DatasetModalContext";
import "./styles.scss";

const TargetForm = () => {
    const { targetAggregates, targetFrequencies } = convinGptConfig;

    const { dispatch, ...state } = useContext(DatasetModalContext);

    return (
        <div className="target_form">
            <div className="target_form--option">
                <div className="target_form--content">
                    <span>Dataset will contain</span>
                    <Select
                        className="target_select"
                        options={targetAggregates}
                        onChange={(value) => {
                            dispatch({
                                type: "SET_TARGET_AGGREGATE",
                                payload: value,
                            });
                        }}
                        value={state?.target?.aggregate}
                        popupClassName="target_select_dropdown"
                    />
                    <Input
                        placeholder="Enter Value"
                        value={state?.target?.quantity}
                        onChange={({ target: { value } }) => {
                            if (!isNaN(Number(value))) {
                                dispatch({
                                    type: "SET_TARGET_QTY",
                                    payload: value,
                                });
                            }
                        }}
                    />
                    <Select
                        className="target_select"
                        options={targetFrequencies}
                        onChange={(value) => {
                            dispatch({
                                type: "SET_TARGET_FREQ",
                                payload: value,
                            });
                        }}
                        value={state?.target?.frequency}
                        popupClassName="target_select_dropdown"
                    />
                    <span>to analyse</span>
                </div>
            </div>
        </div>
    );
};

export default TargetForm;
