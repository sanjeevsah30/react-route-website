import { Input, Select } from "antd";
import { useContext } from "react";
import { getName, uid } from "../../../../../../tools/helpers";
import DeleteSvg from "../../../../../static/svg/DeleteSvg";
import { RuleModalContext } from "../RuleModalContext";
import CustomTreeMultipleSelect from "./../../../../Resuable/Select/CustomTreeMultipleSelect";

const AssignForm = () => {
    const targetFrequencies = [
        { value: "calls", label: "Calls" },
        { value: "hours", label: "Hours" },
        { value: "percentage", label: "Percentage" },
    ];
    const targetIntervals = [
        { value: "day", label: "Day" },
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
    ];
    const filters = [
        { value: "agent", label: "Agent" },
        { value: "team", label: "Team" },
        { value: "selected_call_tags", label: "Selected Call Tags" },
        { value: "selected_call_types", label: "Selected Call Types" },
        { value: "status", label: "Status" },
    ];
    const distributions = [
        { value: "equally", label: "equally" },
        { value: "weighted", label: "by weighted ratio" },
    ];
    const aggregates = [
        { value: "max", label: "Max" },
        // { value: 'min', label: 'Min' },
    ];

    const { dispatch, ...state } = useContext(RuleModalContext);

    return (
        <div className="assign_form">
            <div className="assign_form--option">
                <span>Target</span>
                <div className="assign_form--content">
                    {state.auditType === "ai" ? (
                        "Auto QA in total"
                    ) : (
                        <>
                            <span>Every QA will audit</span>
                            <Select
                                className="assign_select"
                                options={aggregates}
                                onChange={(_, option) =>
                                    dispatch({
                                        type: "SET_TARGET_AGGREGATE",
                                        payload: option,
                                    })
                                }
                                value={state.target?.aggregate?.value}
                                popupClassName="assign_select_dropdown"
                            />
                        </>
                    )}
                    <Input
                        placeholder="Enter Value"
                        value={state.target?.quantity}
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
                        className="assign_select"
                        options={targetFrequencies}
                        onChange={(value) =>
                            dispatch({
                                type: "SET_TARGET_FREQ",
                                payload: value,
                            })
                        }
                        value={state.target?.frequency}
                        popupClassName="assign_select_dropdown"
                    />
                    per
                    <Select
                        className="assign_select"
                        options={targetIntervals}
                        onChange={(value) =>
                            dispatch({
                                type: "SET_TARGET_INTERVAL",
                                payload: value,
                            })
                        }
                        value={state.target?.interval}
                        popupClassName="assign_select_dropdown"
                    />
                </div>
            </div>

            <div className="assign_form--option">
                <span>Allocation</span>
                {Array(state.allocationLength || 0)
                    .fill(0)
                    .map((_, idx) => (
                        <div
                            className="assign_form--content allocate"
                            key={idx}
                        >
                            <span>
                                Allocate
                                <span className="disabled_text">
                                    {state.target?.frequency?.label}
                                </span>
                                per
                                <Select
                                    className="assign_select"
                                    options={filters}
                                    onChange={(value) =>
                                        dispatch({
                                            type: "SET_ALLOCATION_FILTER",
                                            payload: { value, idx },
                                        })
                                    }
                                    value={state.allocation?.[idx]?.filter}
                                    popupClassName="assign_select_dropdown"
                                />
                                {state.auditType === "manual" ? (
                                    <>
                                        <span>to</span>

                                        <span className="auditors_option">
                                            {/* <Select
                                                bordered={false}
                                                placement="bottomLeft"
                                                mode="multiple"
                                                showSearch={false}
                                                options={[
                                                    // {
                                                    //     id: 0,
                                                    //     first_name: 'All',
                                                    // },
                                                    ...state.auditors,
                                                ]}
                                                fieldNames={{
                                                    label: 'first_name',
                                                    value: 'id',
                                                }}
                                                value={
                                                    state.allocation[idx]
                                                        ?.auditors || null
                                                }
                                                onChange={(values) => {
                                                    dispatch({
                                                        type: 'SET_ALLOCATION_AUDITORS',
                                                        payload: {
                                                            auditors: [
                                                                ...values,
                                                            ],
                                                            idx,
                                                        },
                                                    });
                                                }}
                                                className="multiple__select auditor_select"
                                            /> */}
                                            <CustomTreeMultipleSelect
                                                maxTagCount={1}
                                                bordered={false}
                                                data={state.auditors.map(
                                                    (e) => {
                                                        return {
                                                            ...e,
                                                            name: getName(e),
                                                        };
                                                    }
                                                )}
                                                value={
                                                    state.allocation[idx]
                                                        ?.auditors
                                                }
                                                onChange={(values) => {
                                                    dispatch({
                                                        type: "SET_ALLOCATION_AUDITORS",
                                                        payload: {
                                                            auditors: [
                                                                ...values,
                                                            ],
                                                            idx,
                                                        },
                                                    });
                                                }}
                                                className=" multiple__select auditor_select"
                                                fieldNames={{
                                                    label: "name",
                                                    value: "id",
                                                    children: "",
                                                }}
                                                option_name="name"
                                                treeNodeFilterProp="name"
                                                type="user"
                                                allowClear={false}
                                                showArrow={false}
                                            />
                                            {state.allocation?.[idx]?.auditors
                                                ?.length === 0 ? (
                                                <span className="placeholder">
                                                    Select Auditors
                                                </span>
                                            ) : state.allocation?.[idx]
                                                  ?.auditors.length > 1 ? (
                                                `${
                                                    state.auditors?.filter(
                                                        ({ id }) =>
                                                            id ===
                                                            state.allocation?.[
                                                                idx
                                                            ]?.auditors[0]
                                                    )[0]?.first_name
                                                } + ${
                                                    state.allocation?.[idx]
                                                        ?.auditors.length - 1
                                                }`
                                            ) : (
                                                `${
                                                    state.auditors?.filter(
                                                        ({ id }) =>
                                                            id ===
                                                            state.allocation?.[
                                                                idx
                                                            ]?.auditors[0]
                                                    )[0]?.first_name
                                                }`
                                            )}
                                        </span>
                                        <span>auditors</span>
                                    </>
                                ) : (
                                    "/"
                                )}
                                <Select
                                    className="assign_select"
                                    options={distributions}
                                    onChange={(value) =>
                                        dispatch({
                                            type: "SET_ALLOCATION_DISTRIBUTION",
                                            payload: { value, idx },
                                        })
                                    }
                                    value={
                                        state.allocation?.[idx]?.dist_frequency
                                    }
                                    popupClassName="assign_select_dropdown"
                                />
                            </span>
                            <span
                                onClick={() => {
                                    dispatch({
                                        type: "DEL_ALLOCATION",
                                        payload: idx,
                                    });
                                }}
                            >
                                <DeleteSvg />
                            </span>
                        </div>
                    ))}
                <div
                    className="add_alloc_option"
                    onClick={() => {
                        dispatch({ type: "ADD_ALLOCATION" });
                    }}
                >
                    Add +
                </div>
            </div>
        </div>
    );
};

export default AssignForm;
