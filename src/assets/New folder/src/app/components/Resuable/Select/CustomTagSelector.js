import { updateCallById } from "@store/callListSlice/callListSlice";
import { Button } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchSvg from "app/static/svg/SearchSvg";
import "./style.scss";
import CustomTreeMultipleSelect from "./CustomTreeMultipleSelect";

function CustomTagSelector({
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
    ...rest
}) {
    const {
        common: { tags },
    } = useSelector((state) => state);
    const [selectedTags, setSelectedTags] = useState(value ? value : []);

    const [onSerchFilterTags, setOnSerchFilterTags] = useState(tags);
    const [tagToSearch, setTagToSearch] = useState("");
    const [loading, setIsLoading] = useState(false);
    const [showTagsOptions, setShowTagsOptions] = useState(false);
    const dispatch = useDispatch();

    const handleTagSelection = (values) => {
        setSelectedTags([...values]);
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

    const getPayload = () => {
        return {
            call_id: call_id,
            tags: selectedTags,
        };
    };

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
            }}
            className="flex-1 relative"
        >
            <div
                className="absolute font12"
                style={{
                    top: "50%",
                    transform: "translate(20%,-50%)",
                    zIndex: 1,
                    pointerEvents: "none",
                }}
            >
                Add Tags
            </div>
            <CustomTreeMultipleSelect
                data={onSerchFilterTags?.map((e) => ({
                    ...e,
                    name: e.tag_name,
                }))}
                value={selectedTags}
                onChange={(values) => {
                    handleTagSelection(values);
                }}
                placeholder="Select Tags"
                select_placeholder="Select Tags"
                style={{
                    width: "100px",
                    height: "auto",
                    padding: "0",
                }}
                className="multiple__select tree_tag_selector"
                fieldNames={{
                    label: "name",
                    value: "id",
                }}
                option_name="name"
                type="tags"
                treeNodeFilterProp="name"
                popupClassName={"tree_tag_selector_dropdown"}
                alowClear={false}
                maxTagCount={0}
                dropdownRender={(menu) => {
                    return (
                        <>
                            <div
                                className="placeholder flex justifySpaceBetween"
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <div
                                    className="flex alignCenter paddingTB16 paddingLR12 width100p"
                                    style={{
                                        borderBottom: "1px solid #1A62F2",
                                    }}
                                >
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
                                </div>
                            </div>
                            {menu}
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
                                        setIsLoading(true);
                                        dispatch(
                                            updateCallById(getPayload())
                                        ).then((res) => {
                                            setIsLoading(false);
                                            if (res?.payload?.result?.id) {
                                                onUpdate(res?.payload?.result);
                                            }
                                        });
                                        setShowTagsOptions(false);
                                    }}
                                    type="primary"
                                    className="borderRadius5 capitalize"
                                    loading={loading}
                                >
                                    Apply
                                </Button>
                            </div>
                        </>
                    );
                }}
            />
        </div>
    );
}

export default CustomTagSelector;
