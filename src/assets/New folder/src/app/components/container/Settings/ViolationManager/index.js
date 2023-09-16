import Icon from "@presentational/reusables/Icon";
import Spinner from "@presentational/reusables/Spinner";

import {
    createViolation,
    deleteViolation,
    getViolations,
    updateViolation,
} from "@store/violation_manager/violation_manager";
import {
    Button,
    Col,
    Input,
    Modal,
    Popconfirm,
    Row,
    Select,
    message,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomMultipleSelect } from "app/components/Resuable/index";
import CloseSvg from "app/static/svg/CloseSvg";
import DeleteSvg from "app/static/svg/DeleteSvg";
import EditCommentSvg from "app/static/svg/EditCommentSvg";

import "./styles.scss";

const { Option } = Select;

const layoutClasses = {
    reportName: "col-7",
    template: "col-3",
    date: "col-3",
    duration: "col-3",
    time: "col-3",
    users: "col-2",
    actions: "col-3",
};

const levelConfig = {
    TEMPLATE: "template",
    CATEGORY: "category",
    QUESTION: "question",
};
export default function ViolationManager() {
    const {
        violations: { loading, data, creating_violation_loader },
    } = useSelector((state) => state.violation_manager);
    const dispatch = useDispatch();

    const { TEMPLATE, CATEGORY, QUESTION } = levelConfig;

    const [name, setName] = useState("");
    const [level, setLevel] = useState(TEMPLATE);
    const [userIds, setUserIds] = useState([]);
    const [violationToEdit, setViolationToEdit] = useState(null);

    const [openModal, setOpenModal] = useState(false);
    const users = useSelector((state) => state.common.users);

    const handleCreate = () => {
        violationToEdit
            ? dispatch(
                  updateViolation({
                      payload: {
                          name,
                          applicability: level,
                          action: userIds,
                          id: violationToEdit,
                      },
                      id: violationToEdit,
                  })
              )
            : dispatch(
                  createViolation({
                      name,
                      applicability: level,
                      action: userIds,
                  })
              );
    };

    const handleEditClick = ({ id, name, applicability, action }) => {
        setLevel(applicability);
        setUserIds(action.map(({ id }) => String(id)));
        setName(name);
        setViolationToEdit(id);
        setOpenModal(true);
    };

    useEffect(() => {
        resetModal();
        if (openModal) {
            setOpenModal(false);
        }
    }, [data]);

    const resetModal = () => {
        setName("");
        setLevel(TEMPLATE);
        setUserIds([]);
        setViolationToEdit(null);
    };

    return (
        <div className="app__scheduled">
            <div className="app_scheduled--header flex justifySpaceBetween alignCenter">
                <p className="font20 lineHeightN bold600">Violation Manager</p>
                <Button
                    type={"primary"}
                    className="create__btn"
                    onClick={() => {
                        if (data.length === 5) {
                            return message.error(
                                "You can define a maximum of five violations",
                                3
                            );
                        }
                        setOpenModal(true);
                    }}
                >
                    + Create
                </Button>
            </div>
            <div className="app__scheduled--table">
                <div className="app__scheduled--tableLabels flex">
                    <div className="row flex1">
                        <p
                            className={`app__scheduled--tableLabel ${layoutClasses.reportName}`}
                        >
                            Violation Name
                        </p>
                        <p
                            className={`app__scheduled--tableLabel ${layoutClasses.template}`}
                        >
                            Applied Level
                        </p>
                        <p
                            className={`app__scheduled--tableLabel ${layoutClasses.date}`}
                        >
                            Actions
                        </p>
                    </div>
                    <div
                        className={`font14 margin0 lineHeightN dove_gray_cl ${layoutClasses.users}`}
                        style={{
                            visibility: "hidden",
                        }}
                    >
                        <button className="app__scheduled--btn">
                            <EditCommentSvg />
                        </button>
                        <button className="app__scheduled--btn">
                            <DeleteSvg />
                        </button>
                    </div>
                </div>
                <div
                    className={`app__invoices--tableCard ${
                        loading ? "loading" : ""
                    }`}
                >
                    <Spinner loading={loading}>
                        {data?.map((item) => (
                            <div
                                className="app__invoices--tableCardItem flex alignCenter justifySpaceBetween"
                                key={item?.id}
                            >
                                <div className="row flex1">
                                    <p
                                        className={`font16 bold600 margin0 lineHeightN ${layoutClasses.reportName}`}
                                    >
                                        {item?.name}
                                    </p>
                                    <p
                                        className={`font14 margin0 lineHeightN dove_gray_cl ${layoutClasses.template}`}
                                    >
                                        {item?.applicability}
                                    </p>
                                    <p
                                        className={`font14 margin0 lineHeightN dove_gray_cl ${layoutClasses.date}`}
                                    >
                                        {item?.action?.length}
                                    </p>
                                </div>

                                <div
                                    className={`font14 margin0 lineHeightN dove_gray_cl ${layoutClasses.users}`}
                                >
                                    <button
                                        onClick={() => handleEditClick(item)}
                                        className="app__scheduled--btn"
                                    >
                                        <EditCommentSvg />
                                    </button>
                                    <Popconfirm
                                        title="Are you sure to delete this comment?"
                                        onConfirm={(e) => {
                                            e.stopPropagation();
                                            dispatch(deleteViolation(item.id));
                                        }}
                                        onCancel={(e) => e.stopPropagation()}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <button className="app__scheduled--btn">
                                            <DeleteSvg />
                                        </button>
                                    </Popconfirm>
                                </div>
                            </div>
                        ))}
                    </Spinner>
                </div>
            </div>
            <Modal
                title={<div className="capitalize">Create Violation</div>}
                visible={openModal}
                onOk={() => {}}
                onCancel={() => {
                    resetModal();
                    setOpenModal(false);
                }}
                className="settings__create--modal"
                width={1192}
                closeIcon={
                    <CloseSvg
                        style={{
                            color: "#666666",
                        }}
                    />
                }
                footer={
                    <div>
                        <Button
                            type={"primary"}
                            className="create__btn"
                            disabled={!name}
                            onClick={handleCreate}
                            loading={creating_violation_loader}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <Row gutter={[36, 12]}>
                    <Col span={12}>
                        <div className="marginB14 mine_shaft_cl">
                            Violation Name
                        </div>
                        <Input
                            name="name"
                            placeholder="Enter name"
                            value={name}
                            allowClear
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                            className="borderRadius5"
                            style={{
                                height: "48px",
                            }}
                        />
                    </Col>
                    <Col span={12}>
                        <div className="marginB14 mine_shaft_cl">
                            Applied Level
                        </div>
                        <Select
                            value={level}
                            onChange={(val) => {
                                setLevel(val);
                            }}
                            placeholder="Select Level"
                            dropdownRender={(menu) => (
                                <div>
                                    <span className={"topbar-label"}>
                                        Select Level
                                    </span>
                                    {menu}
                                </div>
                            )}
                            suffixIcon={
                                <Icon className="fas fa-chevron-down dove_gray_cl" />
                            }
                            dropdownClassName={"account_select_dropdown"}
                            style={{
                                width: "100%",
                            }}
                            className="violation_select violation_multiple_select"
                        >
                            <Option value={TEMPLATE}>Template</Option>
                            <Option value={CATEGORY}>Category</Option>
                            <Option value={QUESTION}>Question</Option>
                        </Select>
                    </Col>
                    <Col span={12}>
                        <div className="marginB14 mine_shaft_cl">Action</div>

                        <Select
                            name="tags"
                            mode="multiple"
                            placeholder={"Select Emails"}
                            onChange={(userIds) => {
                                setUserIds(userIds);
                            }}
                            value={userIds}
                            filterOption={(input, option) =>
                                option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                            suffixIcon={
                                <Icon className="fas fa-chevron-down dove_gray_cl" />
                            }
                            dropdownClassName={"account_select_dropdown"}
                            style={{
                                width: "100%",
                            }}
                            className="violation_multiple_select"
                        >
                            {users.map((user) => (
                                <Select.Option key={user.id}>
                                    {user?.first_name || user?.email}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
            </Modal>
        </div>
    );
}

const TooltipContent = ({ users }) => {
    if (!users.length) {
        return null;
    } else {
        return (
            <ul className="app__scheduled--users">
                {users.map((item) => (
                    <li
                        className="app__scheduled--usersName"
                        key={`app__scheduledUser${item.first_name}`}
                    >
                        {item.first_name}
                    </li>
                ))}
            </ul>
        );
    }
};
