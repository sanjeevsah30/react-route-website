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
        common: { call_types },
    } = useSelector((state) => state);
    const [selectedType, setSelectedType] = useState(value ? value : []);
    const [onSerchFilterType, setOnSerchFilterType] = useState(call_types);
    const [typeToSearch, setTypeToSearch] = useState("");
    const [loading, setIsLoading] = useState(false);
    const [showTagsOptions, setShowTagsOptions] = useState(false);
    const dispatch = useDispatch();

    const handleTagSelection = (values) => {
        setSelectedType([...values]);
    };

    const tagFilterHandler = (e) => {
        setTypeToSearch(e.target.value);
        setOnSerchFilterType(
            call_types.filter((item) =>
                item.type.toLowerCase().includes(e.target.value.toLowerCase())
            )
        );
    };

    const getPayload = () => {
        return {
            call_id: call_id,
            call_types: selectedType,
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
                Add Type
            </div>
            <CustomTreeMultipleSelect
                data={onSerchFilterType?.map((e) => ({ ...e, name: e.type }))}
                value={selectedType}
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
                                        value={typeToSearch}
                                    />
                                </div>
                            </div>
                            {menu}
                            <div className="footer paddingTB6 paddingLR16 flex justifySpaceBetween alignCenter">
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedType([]);
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
