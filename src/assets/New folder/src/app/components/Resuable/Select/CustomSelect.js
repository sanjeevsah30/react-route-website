import CloseSvg from "@container/Settings/MomentsSettings/CloseSvg";
import Icon from "@presentational/reusables/Icon";
import { updateCallById } from "@store/callListSlice/callListSlice";
import { Checkbox, Popover, Select, Button } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./style.scss";
import { getName } from "@tools/helpers";

function CustomSelect({
    value,
    onChange,
    data = [],
    option_name,
    option_key = "value",
    select_placeholder,
    className = "custom__select",
    type,
    showSearch = true,
    style = {},
    call_id,
    mode = "single",
    callTypes,
    ...rest
}) {
    const [selectedTags, setSelectedTags] = useState(
        callTypes?.map((tag) => tag.id)
    );

    const [showTagsOptions, setShowTagsOptions] = useState(false);
    const dispatch = useDispatch();

    const handleTagSelection = (id) => {
        if (selectedTags.includes(id))
            return setSelectedTags(
                selectedTags.filter((tagId) => tagId !== id)
            );
        setSelectedTags([...selectedTags, id]);
    };

    const getPayload = () => {
        return {
            call_id: call_id,
            call_types: selectedTags,
        };
    };

    const RenderTagsOptions = () => {
        return (
            <div
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    className="placeholder flex justifySpaceBetween"
                >
                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        Add Types
                    </span>
                    <span
                        className="curPoint"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowTagsOptions(false);
                        }}
                    >
                        <CloseSvg
                            style={{
                                transform: "scale(0.8)",
                            }}
                        />
                    </span>
                </div>
                <div className="options_container paddingT10">
                    {data.map((tag) => (
                        <div
                            className="team_option paddingL10 paddingTB10 curPoint"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleTagSelection(tag.id);
                            }}
                            key={tag.id}
                        >
                            <span className="capitalize">
                                <Checkbox
                                    checked={selectedTags?.includes(tag.id)}
                                    className="marginR9"
                                />
                                <span className="mine_shaft_cl ">
                                    {tag.type}
                                </span>
                            </span>
                        </div>
                    ))}
                </div>
                <div className="footer paddingTB6 paddingLR16 flex justifySpaceBetween alignCenter">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTags([]);
                        }}
                        type="text"
                        className="capitalize dusty_gray_cl"
                    >
                        Clear All
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            dispatch(updateCallById(getPayload()));
                            setShowTagsOptions(false);
                        }}
                        type="primary"
                        className="borderRadius5 capitalize"
                    >
                        Apply
                    </Button>
                </div>
            </div>
        );
    };

    return mode.toLowerCase() === "multiple" ? (
        <Popover
            placement="bottomRight"
            overlayClassName="date_selector_popover team_selector_popover"
            content={RenderTagsOptions()}
            trigger="click"
            visible={showTagsOptions}
        >
            <Select
                className={className}
                // value={
                //     selectedTags?.length === 0
                //         ? 'Select Tag'
                //         : `${selectedTags?.length} tags`}
                value={"Add Types"}
                suffixIcon={
                    <Icon className="fas fa-chevron-down dove_gray_cl" />
                }
                style={{ ...style }}
                dropdownClassName={"hide_dropdown"}
                onFocus={() => setShowTagsOptions((prev) => !prev)}
                {...rest}
            ></Select>
        </Popover>
    ) : (
        <Select
            className={className}
            value={value}
            suffixIcon={<Icon className="fas fa-chevron-down dove_gray_cl" />}
            onChange={onChange}
            style={{ ...style }}
            dropdownRender={(menu) => (
                <div>
                    <div>
                        {select_placeholder ? (
                            <span className={"topbar-label"}>
                                {select_placeholder}
                            </span>
                        ) : (
                            <></>
                        )}
                        {menu}
                    </div>
                    {data.map((item, idx) => (
                        <Select.Option value={item[option_key]} key={idx}>
                            {item[option_name]}
                        </Select.Option>
                    ))}
                </div>
            )}
            optionFilterProp="children"
            dropdownClassName={"custom_select_dropdown"}
            showSearch={showSearch}
            {...rest}
        >
            {data.map((item, idx) => (
                <Select.Option value={item[option_key]} key={idx}>
                    {type === "user" ? getName(item) : `${item[option_name]}`}
                </Select.Option>
            ))}
        </Select>
    );
}

export default CustomSelect;
