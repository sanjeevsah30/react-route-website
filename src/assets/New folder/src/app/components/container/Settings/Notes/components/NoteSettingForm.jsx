import { flattenTeams } from "@tools/helpers";
import { Button, Input, Modal, Select } from "antd";
import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { NotesCardContext } from "./NotesCardProvider";
import CustomTreeMultipleSelect from "app/components/Resuable/Select/CustomTreeMultipleSelect";

const NoteSettingForm = () => {
    const {
        common: { teams, tags, call_types },
    } = useSelector((state) => state);
    const {
        modalState: {
            name,
            team_ids,
            call_tags_ids,
            call_type_ids,
            meeting_type,
        },
        modalDispatch,
    } = useContext(NotesCardContext);
    return (
        <>
            <div className="font16  bold500 ">
                <span>Basic Info</span>
                <span className="font12 bold400 dove_gray_cl flex">
                    Names and other basic config.
                </span>
                <div className="marginT20">
                    <p>Name of Custom Field*</p>
                    <Input
                        className="borderRadius6 padding10"
                        style={{
                            width: "50%",
                        }}
                        value={name}
                        onChange={(e) => {
                            modalDispatch({
                                type: "UPDATE_MODAL_STATE",
                                payload: {
                                    name: e.target.value,
                                },
                            });
                        }}
                        placeholder="A unique name for the Custom Field"
                    />
                </div>
                <div className="marginT20">
                    <p>Applicable Teams & Sub teams</p>
                    <CustomTreeMultipleSelect
                        data={teams}
                        value={team_ids}
                        onChange={(values) => {
                            modalDispatch({
                                type: "UPDATE_MODAL_STATE",
                                payload: {
                                    team_ids: values,
                                },
                            });
                        }}
                        placeholder="Select Teams  or sub teams"
                        select_placeholder="Select Teams"
                        style={{
                            width: "50%",

                            height: "auto",
                            padding: "0",
                        }}
                        className=" multiple__select "
                        fieldNames={{
                            label: "name",
                            value: "id",
                            children: "subteams",
                        }}
                        option_name="name"
                        type="team"
                        treeNodeFilterProp="name"
                    />
                </div>
                <div className="marginT20">
                    <p> Call Tags</p>
                </div>
                <Select
                    mode="multiple"
                    allowClear
                    style={{
                        width: "50%",
                    }}
                    placeholder="Choose Call Tags"
                    className="custom__tags__select placeholder__none"
                    value={call_tags_ids}
                    onChange={(e) => {
                        modalDispatch({
                            type: "UPDATE_MODAL_STATE",
                            payload: {
                                call_tags_ids: e,
                            },
                        });
                    }}
                >
                    {tags.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                            {item.tag_name.slice(0, 30)}
                        </Select.Option>
                    ))}
                </Select>
                <div className="marginT20">
                    <p>Call Type</p>
                </div>
                <Select
                    mode="multiple"
                    allowClear
                    style={{
                        width: "50%",
                    }}
                    placeholder="Choose Call Type"
                    className="custom__tags__select placeholder__none"
                    value={call_type_ids}
                    onChange={(e) => {
                        modalDispatch({
                            type: "UPDATE_MODAL_STATE",
                            payload: {
                                call_type_ids: e,
                            },
                        });
                    }}
                >
                    {call_types.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                            {item?.type?.slice?.(0, 30)}
                        </Select.Option>
                    ))}
                </Select>
                <div className="marginT20 over">Meeting Types</div>
                <Select
                    placeholder="Choose Meeting Type"
                    defaultValue={"Call"}
                    options={[
                        { id: 1, value: "Call" },
                        { id: 2, value: "Chat" },
                        { id: 3, value: "Email" },
                    ]}
                    value={meeting_type}
                    onChange={(e) => {
                        modalDispatch({
                            type: "UPDATE_MODAL_STATE",
                            payload: {
                                meeting_type: e,
                            },
                        });
                    }}
                    style={{ textTransform: "initial", width: "50%" }}
                />
            </div>
        </>
    );
};

export default NoteSettingForm;
