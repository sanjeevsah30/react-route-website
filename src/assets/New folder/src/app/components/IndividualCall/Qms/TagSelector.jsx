import CloseSvg from "@container/Settings/MomentsSettings/CloseSvg";
import Icon from "@presentational/reusables/Icon";
import { Checkbox, Popover, Select, Button } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchSvg from "app/static/svg/SearchSvg";

function TagSelector({
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
    callTypes,
    onUpdate = () => {},
    selectedTags,
    setSelectedTags,
    isDisabled,
    ...rest
}) {
    const {
        common: { tags },
    } = useSelector((state) => state);

    const tag_selector_id = "tag_selector";

    const [onSerchFilterTags, setOnSerchFilterTags] = useState(tags);
    const [tagToSearch, setTagToSearch] = useState("");

    const [showTagsOptions, setShowTagsOptions] = useState(false);
    const dispatch = useDispatch();

    const handleTagSelection = (id) => {
        if (selectedTags.includes(id))
            return setSelectedTags(
                selectedTags.filter((tagId) => tagId !== id)
            );
        setSelectedTags([...selectedTags, id]);
    };

    const tagFilterHandler = (e) => {
        setTagToSearch(e.target.value);
        setOnSerchFilterTags(
            tags.filter((item) =>
                item.tag_name
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
            )
        );
    };

    useEffect(() => {
        setOnSerchFilterTags(tags);
    }, [tags]);

    const RenderTagsOptions = () => {
        return (
            <div
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                {/* <div
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
                        Add Tags
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
                                transform: 'scale(0.8)',
                            }}
                        />
                    </span>
                </div> */}
                <div
                    className="placeholder flex justifySpaceBetween"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <span className="flex alignCenter">
                        <SearchSvg />
                        <input
                            placeholder="Search"
                            onChange={tagFilterHandler}
                            style={{
                                outline: "none",
                                border: "none",
                                width: "100%",
                            }}
                            className="marginL10"
                            value={tagToSearch}
                        />
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
                    {onSerchFilterTags.map((tag) => (
                        <div
                            className="team_option paddingL10 paddingTB10 curPoint"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleTagSelection(tag.id);
                            }}
                            key={tag.id}
                        >
                            <span className="capitalize flex calignCenter">
                                <Checkbox
                                    checked={selectedTags?.includes(tag.id)}
                                    className="marginR9"
                                />
                                <span className="mine_shaft_cl ">
                                    {tag.tag_name}
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

    const handleTagOptionsClose = (e) => {
        if (e.target.closest(`#${tag_selector_id}`)) {
            return;
        }
        if (e.target.closest(".tag_selector_popover")) {
            return;
        }
        setShowTagsOptions(false);
    };

    const handleClickEvent = (e) => {
        handleTagOptionsClose(e);
    };

    useEffect(() => {
        document.body.addEventListener("click", handleClickEvent);

        return () => {
            document.body.removeEventListener("click", handleClickEvent);
        };
    }, []);

    return (
        <Popover
            placement="bottomRight"
            overlayClassName="date_selector_popover team_selector_popover"
            content={RenderTagsOptions()}
            trigger="click"
            visible={showTagsOptions}
        >
            <Select
                style={{
                    height: "36px",
                    width: "100px",
                }}
                className={className}
                // value={
                //     selectedTags?.length === 0
                //         ? 'Select Tag'
                //         : `${selectedTags?.length} tags`}
                value={
                    selectedTags.length
                        ? `+${selectedTags.length} selected`
                        : isDisabled
                        ? "No Tags Applied"
                        : "Add Tags"
                }
                suffixIcon={
                    <Icon className="fas fa-chevron-down dove_gray_cl" />
                }
                dropdownClassName={"hide_dropdown"}
                onFocus={() => setShowTagsOptions((prev) => !prev)}
                onClick={(e) => {
                    e.stopPropagation();
                }}
                disabled={isDisabled}
            ></Select>
        </Popover>
    );
}

export default TagSelector;
