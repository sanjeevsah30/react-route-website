import { useEffect, useState } from "react";
import { Icon, Popconfirm, Select } from "antd";

import { CheckCircleFilled } from "@ant-design/icons";
import ChevronUpSvg from "app/static/svg/ChevronUpSvg";
import ChevronDownSvg from "app/static/svg/ChevronDownSvg";
import DeleteSvg from "app/static/svg/DeleteSvg";
import CloseSvg from "./CloseSvg";
import AuditTemplate from "app/static/svg/AuditTemplate";
import {
    sortableContainer,
    sortableElement,
    arrayMove,
} from "react-sortable-hoc";

// redux essentials
import { useDispatch, useSelector } from "react-redux";
import {
    getSlackChannels,
    updateMoment,
    updateOrder,
} from "@store/momentSettings/momentSettings";
import { CustomSelect } from "app/components/Resuable/index";
const { Option } = Select;
// icons

const flex = {
    display: "flex",
    alignItems: "center",
};

const SortableItem = sortableElement(
    ({
        id,
        value,
        colors,
        color_code,
        slack_id,
        deleteMomentHandler,
        slack_channels,
    }) => {
        const [showColorPicker, setShowColorPicker] = useState(false);
        const [color, setColor] = useState(
            color_code.length > 0 ? color_code : "#333333"
        );
        const [showDropdown, setShowDropdown] = useState(false);

        // get slack_channel name from id

        const [option, setOption] = useState("");

        const dispatch = useDispatch();

        function confirm(id) {
            deleteMomentHandler(id);
        }
        useEffect(() => {
            const ch = slack_channels.find((el) => el.channel_id === slack_id);

            if (ch) {
                setOption(ch.channel_name);
            }
        }, [slack_channels]);
        return (
            <div className="action_container">
                <div className="action_item">
                    <div className="action_icon">
                        <ChevronUpSvg />
                        <ChevronDownSvg />
                    </div>
                    <div className="action_item_content">
                        <p className="title">{value}</p>
                        <div style={{ ...flex, gap: 10 }}>
                            <div
                                className="color_box"
                                style={{
                                    backgroundColor: color,
                                }}
                            ></div>
                            <div
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                    setShowColorPicker(!showColorPicker)
                                }
                            >
                                {!showColorPicker ? (
                                    <ChevronDownSvg />
                                ) : (
                                    <ChevronUpSvg />
                                )}
                            </div>
                        </div>
                        <div
                            className="colorModal"
                            style={
                                showColorPicker
                                    ? { display: "block" }
                                    : { display: "none" }
                            }
                        >
                            <div
                                style={{
                                    ...flex,
                                    width: "100%",
                                    justifyContent: "space-between",
                                    fontSize: 12,
                                }}
                            >
                                Choose Color
                                <CloseSvg
                                    onClick={() =>
                                        setShowColorPicker(!showColorPicker)
                                    }
                                />
                            </div>
                            <div className="color_box_container">
                                {colors.map((color, idx) => (
                                    <div
                                        key={idx}
                                        className="color_box"
                                        style={{
                                            backgroundColor: color,
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            setColor(color);

                                            dispatch(
                                                updateMoment({
                                                    id,
                                                    color_code: color,
                                                })
                                            );
                                            setShowColorPicker(
                                                !showColorPicker
                                            );
                                        }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <Popconfirm
                        title="Are you sure to delete this moment?"
                        onConfirm={() => confirm(id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <div className="delete_icon">
                            <DeleteSvg />
                        </div>
                    </Popconfirm>
                </div>
                <div style={{ width: "40%" }}>
                    <CustomSelect
                        data={slack_channels}
                        option_key={"channel_id"}
                        option_name={"channel_name"}
                        select_placeholder={"Select"}
                        placeholder={"Select"}
                        style={{
                            width: "100%",
                            height: "36px",
                        }}
                        value={option.length > 0 ? option : ""}
                        onChange={(val) => {
                            setOption(val);
                            dispatch(
                                updateMoment({
                                    id,
                                    slack_channel: val,
                                })
                            );
                        }}
                        className={
                            option
                                ? "custom__select momment__select"
                                : "custom__select"
                        }
                        // dropdownAlign={{ offset: [-90, 4] }}
                    />
                    {/* <Select
                        className="custom__select_x"
                        onChange={(val) => {
                            setOption(val);
                            dispatch(
                                updateMoment({
                                    id,
                                    slack_channel: val,
                                })
                            );
                        }}
                        dropdownRender={(menu) => (
                            <div className="c_select">
                                <span className={'topbar-label'}>
                                    Select Channel
                                </span>
                                {menu}
                            </div>
                        )}
                        suffixIcon={
                            <Icon className="fas fa-chevron-down dove_gray_cl" />
                        }
                        style={{
                            height: '36px',
                            width: '226px',
                        }}
                        dropdownClassName={'account_select_dropdown_x'}
                        value={option.length > 0 ? option : ''}
                    >
                        {slack_channels.length > 0 ? (
                            slack_channels.map((el, idx) => (
                                <Option value={el.channel_id} key={idx}>
                                    {el.channel_name}
                                </Option>
                            ))
                        ) : (
                            <Option disabled={true} value={'No Channels Found'}>
                                No Channels Found
                            </Option>
                        )}
                    </Select> */}
                </div>
            </div>
        );
    }
);
const SortableContainer = sortableContainer(({ children }) => {
    return <div className="sortable_container">{children}</div>;
});

const MomentTypes = ({ colors, state, setState, deleteMomentHandler }) => {
    const [isChanged, setIsChanged] = useState(false);
    const onSortEnd = ({ oldIndex, newIndex }) => {
        setState(arrayMove(state, oldIndex, newIndex));
        setIsChanged(!isChanged);
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getSlackChannels());
    }, []);
    const { channel } = useSelector((state) => state.momentSettings);
    const [slack_channels, setslackChannels] = useState([]);

    useEffect(() => {
        if (channel?.slack_channels?.length > 0) {
            setslackChannels(channel.slack_channels);
        }
    }, [channel]);

    useEffect(() => {
        for (let i = 0; i < state.length; i++) {
            dispatch(
                updateOrder({
                    id: state[i].id,
                    index: state.indexOf(state[i]),
                })
            );
        }
    }, [isChanged]);
    return (
        <>
            {state.length > 0 ? (
                <SortableContainer
                    onSortEnd={onSortEnd}
                    distance={1}
                    lockAxis="y"
                >
                    {state.map((item, index) => (
                        <SortableItem
                            key={`item-${item.id}`}
                            index={index}
                            id={item.id}
                            value={item.name}
                            color_code={item.color_code}
                            slack_id={item.slack_channel}
                            colors={colors}
                            deleteMomentHandler={deleteMomentHandler}
                            slack_channels={slack_channels}
                        />
                    ))}
                </SortableContainer>
            ) : (
                <div className="empty_page">
                    <AuditTemplate />
                    <p>Create a new moment</p>
                </div>
            )}
        </>
    );
};

export default MomentTypes;
