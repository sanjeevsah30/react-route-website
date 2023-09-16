import React from "react";

function LeadScorePanel(props) {
    return (
        <div>
            {/* <Spinner loading={loaders.aiDataLoader}>
                                    <div>
                                        <div className="mine_shaft_cl bold700 marginB20">
                                            CHOOSE AN AUDIT TEMPLATE
                                        </div>
                                        <Select
                                            value={
                                                filters.activeLeadScoreTemplate
                                            }
                                            onChange={(value) => {
                                                dispatch(
                                                    setActiveAccountLeadScoreTemplate(
                                                        value
                                                    )
                                                );
                                            }}
                                            optionFilterProp="children"
                                            className="custom__select filter__select"
                                            suffixIcon={
                                                <Icon className="fas fa-chevron-down dove_gray_cl" />
                                            }
                                            dropdownClassName={'account_select'}
                                            placeholder={
                                                'Choose an audit template'
                                            }
                                            showSearch
                                        >
                                            {filters.templates.map(
                                                ({ id, name }, idx) => (
                                                    <Option
                                                        value={id}
                                                        key={idx}
                                                    >
                                                        {name}
                                                    </Option>
                                                )
                                            )}
                                        </Select>
                                        <div>
                                            {getLeadScoreQuestions().map(
                                                (
                                                    {
                                                        id,
                                                        question_text,
                                                        question_type,
                                                        settings,
                                                    },
                                                    idx
                                                ) => {
                                                    return (
                                                        <div
                                                            key={id}
                                                            className={`paddingT22 paddingB20 ${
                                                                filters
                                                                    .questions
                                                                    .length -
                                                                    1 ===
                                                                idx
                                                                    ? ''
                                                                    : 'borderBottom'
                                                            }`}
                                                        >
                                                            <div className="flex alignStart bold600 mine_shaft_cl">
                                                                <div className="marginR16">
                                                                    {idx < 9
                                                                        ? `0${
                                                                              idx +
                                                                              1
                                                                          }`
                                                                        : idx +
                                                                          1}
                                                                    .
                                                                </div>
                                                                <div className="flex1 flex column">
                                                                    <div
                                                                        style={{
                                                                            borderLeft:
                                                                                '1px solid #99999933',
                                                                        }}
                                                                        className="paddingL8"
                                                                    >
                                                                        {
                                                                            question_text
                                                                        }
                                                                    </div>

                                                                    <div className="paddingL8 paddingT13 bold600">
                                                                        <div>
                                                                            <Checkbox
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    handleCheck(
                                                                                        id,
                                                                                        1,
                                                                                        question_text,
                                                                                        question_type,
                                                                                        e
                                                                                            .target
                                                                                            .checked,
                                                                                        false
                                                                                    )
                                                                                }
                                                                                checked={
                                                                                    leadScoreQuestions?.[
                                                                                        id
                                                                                    ]
                                                                                        ?.checked ===
                                                                                    1
                                                                                }
                                                                            >
                                                                                Yes
                                                                            </Checkbox>
                                                                            <Checkbox
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    handleCheck(
                                                                                        id,
                                                                                        0,
                                                                                        question_text,
                                                                                        question_type,
                                                                                        e
                                                                                            .target
                                                                                            .checked,
                                                                                        false
                                                                                    )
                                                                                }
                                                                                checked={
                                                                                    leadScoreQuestions?.[
                                                                                        id
                                                                                    ]
                                                                                        ?.checked ===
                                                                                    0
                                                                                }
                                                                            >
                                                                                No
                                                                            </Checkbox>
                                                                            <Checkbox
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    handleCheck(
                                                                                        id,
                                                                                        -1,
                                                                                        question_text,
                                                                                        question_type,
                                                                                        e
                                                                                            .target
                                                                                            .checked,
                                                                                        false
                                                                                    )
                                                                                }
                                                                                checked={
                                                                                    leadScoreQuestions?.[
                                                                                        id
                                                                                    ]
                                                                                        ?.checked ===
                                                                                    -1
                                                                                }
                                                                            >
                                                                                Na
                                                                            </Checkbox>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                </Spinner> */}
        </div>
    );
}

export default LeadScorePanel;
