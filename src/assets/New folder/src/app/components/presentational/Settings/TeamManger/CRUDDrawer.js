import {
    createTeam,
    handleSubteamDelete,
    updateTeam,
} from "@store/team_manager/team_manager";
import { uid } from "@tools/helpers";
import {
    Button,
    Col,
    Collapse,
    Drawer,
    Form,
    Input,
    Popconfirm,
    Row,
    Tooltip,
} from "antd";

import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomSelect } from "app/components/Resuable/index";
import ChevronDownSvg from "app/static/svg/ChevronDownSvg";
import ChevronUpSvg from "app/static/svg/ChevronUpSvg";
import CloseSvg from "app/static/svg/CloseSvg";
import DeleteSvg from "app/static/svg/DeleteSvg";
import LeftArrowSvg from "app/static/svg/LeftArrowSvg";
import { TeamManagerContext } from "../TeamManagerUI";
import "./style.scss";

import { useVirtual } from "react-virtual";
import { getAllTeams, openNotification } from "@store/common/actions";
import { getError } from "@apis/common/index";

const CONST = {
    TEAM_DETAILS: "Team Details",
    MEMBERS: "Members",
};

const { Panel } = Collapse;
function CRUDDrawer(props) {
    const { showDrawer, setShowDrawer, teamToEdit, setTeamToEdit } =
        useContext(TeamManagerContext);
    const {
        common: { domain },
        team_manager: { teams, loading },
    } = useSelector((state) => state);

    const dispatch = useDispatch();

    const [subTeamRefs, setSubTeamRefs] = useState([]);
    const [subMembers, setSubMembers] = useState([]);
    const teamformRefs = Form.useForm()[0];

    const [subTeams, setSubTeams] = useState([]);

    const [team, setTeam] = useState(null);

    const [activeTab, setActiveTab] = useState(CONST.TEAM_DETAILS);

    const closeDrawer = () => {
        setShowDrawer(false);
    };

    //Subteam Name
    const handleRemove = (idx) => {
        if (teamToEdit && typeof idx === "number") {
            handleSubteamDelete(idx, domain)
                .then(() => {
                    setSubMembers(
                        subMembers.filter(({ id }, index) => id !== idx)
                    );
                    setSubTeamRefs(
                        subTeamRefs.filter(({ id }, index) => id !== idx)
                    );
                    dispatch(getAllTeams());
                })
                .catch((err) => {
                    openNotification("error", "Error", getError(err).message);
                });
        } else {
            setSubMembers(subMembers.filter(({ id }, index) => id !== idx));
            setSubTeamRefs(subTeamRefs.filter(({ id }, index) => id !== idx));
        }
    };

    useEffect(() => {
        if (teamToEdit) {
            teamformRefs.setFieldsValue({ name: teamToEdit?.name });
            teamformRefs.setFieldsValue({ id: teamToEdit?.id });
            teamformRefs.setFieldsValue({ manager: teamToEdit?.manager?.id });
        }
        if (teamToEdit?.subteams?.length) {
            setSubMembers([...subMembers, ...teamToEdit?.subteams]);
        }
    }, [teamToEdit]);

    const handleRemoveMemberFromTeam = (member_id, team_id) => {
        setSubTeams(
            subTeams.map((e) => {
                if (e.id === team_id) {
                    return {
                        ...e,
                        members: e.members.filter(
                            (person) => person.id !== member_id
                        ),
                    };
                }
                return e;
            })
        );
        setTeam({
            ...team,
            members: team.members.filter((person) => person.id !== member_id),
        });
    };

    const handleRemoveMemeberFromSubTeam = (member_id, team_id) => {
        setSubTeams(
            subTeams.map((e) => {
                if (e.id === team_id) {
                    return {
                        ...e,
                        members: e.members.filter(
                            (person) => person.id !== member_id
                        ),
                    };
                }
                return e;
            })
        );
    };

    const handleUpdateUserDetails = (member_id, team_id, payload) => {
        setTeam({
            ...team,
            members: team.members.map((person) =>
                person.id === member_id ? { ...payload } : person
            ),
        });
    };

    const handleUpdateSubTeamUserDetails = (member_id, team_id, payload) => {
        setSubTeams(
            subTeams.map((e) => {
                if (e.id === team_id) {
                    return {
                        ...e,
                        members: e.members.map((person) =>
                            person.id === member_id ? { ...payload } : person
                        ),
                    };
                }
                return e;
            })
        );
    };

    const addMemmberToTeam = (add_id) => {
        setTeam({
            ...team,
            members: [
                {
                    id: uid(),
                    is_new: true,
                    name: "",
                    role: undefined,
                },
                ...team.members,
            ],
        });
    };

    const addMemmberToSubTeam = (add_id) => {
        setSubTeams(
            subTeams.map((e) => {
                if (e.id === add_id) {
                    return {
                        ...e,
                        members: [
                            ...e.members,
                            {
                                id: uid(),
                                is_new: true,
                                name: "",
                                role: undefined,
                            },
                        ],
                    };
                }
                return e;
            })
        );
    };

    const handleCreateTeam = () => {
        if (teamToEdit) {
            const payload = {
                ...team,
                about: "",
                id: teamToEdit.id,
                subteams: subTeams.map((e) => {
                    const temp = { ...e };

                    if (typeof temp.id !== "number") {
                        delete temp.id;
                    }
                    delete temp.is_new;
                    return { ...temp, about: "", group: teamToEdit.id };
                }),
            };
            dispatch(updateTeam({ payload, closeDrawer }));
            return;
        }

        const payload = {
            ...team,
            about: "",
            subteams: subTeams.map((e) => {
                const temp = { ...e };
                delete temp.id;
                delete temp.is_new;
                return { ...temp, about: "" };
            }),
        };

        dispatch(createTeam({ payload, closeDrawer }));
        return;
    };

    return (
        <Drawer
            title={
                <div className="flex alignCenter">
                    {activeTab === CONST.MEMBERS && (
                        <span
                            className="curPoint"
                            onClick={() => setActiveTab(CONST.TEAM_DETAILS)}
                        >
                            <LeftArrowSvg
                                style={{ fontSize: "14px", marginRight: "8px" }}
                            />
                        </span>
                    )}

                    <div className="bold700 font22">
                        {teamToEdit ? "Edit Team" : "Create Team"}
                    </div>
                </div>
            }
            placement="right"
            onClose={() => setShowDrawer(false)}
            visible={showDrawer}
            width={668}
            className="team__manager__drawer"
            destroyOnClose={true}
            footer={
                <div className="marginTB10 flex justifyCenter">
                    {activeTab === CONST.TEAM_DETAILS ? (
                        <Button
                            type="primary"
                            className="borderRadius5"
                            style={{
                                height: "44px",
                                width: "172px",
                            }}
                            onClick={async () => {
                                try {
                                    const sub_teams = await Promise.all(
                                        subTeamRefs.map((ref) =>
                                            ref.form.validateFields()
                                        )
                                    );

                                    const new_team =
                                        await teamformRefs.validateFields();
                                    setActiveTab(CONST.MEMBERS);
                                    setTeam({
                                        ...new_team,
                                        members: teamToEdit
                                            ? teamToEdit.members
                                            : [],
                                    });

                                    setSubTeams(sub_teams);
                                    setSubMembers(sub_teams);
                                } catch (err) {}
                            }}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            className="borderRadius5"
                            style={{
                                height: "44px",
                                width: "172px",
                            }}
                            onClick={() => {
                                handleCreateTeam();
                            }}
                            loading={loading}
                        >
                            {teamToEdit ? "Save Changes" : "Create Team"}
                        </Button>
                    )}
                </div>
            }
            closable={false}
            extra={
                <>
                    <span
                        className="curPoint"
                        onClick={() => setShowDrawer(false)}
                    >
                        <CloseSvg
                            style={{
                                color: "#666666",
                            }}
                        />
                    </span>
                </>
            }
        >
            <div className="height100p flex column">
                <div className="tm__tab">
                    <span
                        className={`${
                            activeTab === CONST.TEAM_DETAILS ? "active" : ""
                        }`}
                    >
                        Team Details
                    </span>
                    <span
                        className={`${
                            activeTab !== CONST.TEAM_DETAILS ? "active" : ""
                        }`}
                    >
                        Members
                    </span>
                </div>

                {activeTab === CONST.TEAM_DETAILS ? (
                    <TeamSettings
                        subTeamRefs={subTeamRefs}
                        setSubTeamRefs={setSubTeamRefs}
                        teamformRefs={teamformRefs}
                        subMembers={subMembers}
                        setSubMembers={setSubMembers}
                        handleRemove={handleRemove}
                    />
                ) : subTeams.length ? (
                    <SubTeamPannel
                        subTeams={subTeams}
                        addMemmberToTeam={addMemmberToSubTeam}
                        handleUpdateUserDetails={handleUpdateSubTeamUserDetails}
                        handleRemoveMemberFromTeam={
                            handleRemoveMemeberFromSubTeam
                        }
                    />
                ) : (
                    <TeamPanel
                        members={team?.members}
                        addMemmberToTeam={addMemmberToTeam}
                        handleUpdateUserDetails={handleUpdateUserDetails}
                        handleRemoveMemberFromTeam={handleRemoveMemberFromTeam}
                    />
                )}
            </div>
        </Drawer>
    );
}

const SubTeamPannel = ({
    subTeams,
    addMemmberToTeam,
    handleRemoveMemberFromTeam,
    handleUpdateUserDetails,
}) => {
    return (
        <div className="flex1 overflowYscroll">
            <div className="operations">
                <div className="mine_shaft_cl bold600 font18 marginB16">
                    Add Members
                </div>
                <div className="dusty_gray_cl marginB16">
                    Choose Sub-Team to Add Members.
                </div>
            </div>
            <div className="">
                {subTeams.map((e, idx) => {
                    return (
                        <SubTeamPanel
                            key={e.id}
                            {...e}
                            addMemmberToTeam={addMemmberToTeam}
                            handleRemoveMemberFromTeam={
                                handleRemoveMemberFromTeam
                            }
                            handleUpdateUserDetails={handleUpdateUserDetails}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const TeamPanel = ({
    name,
    members = [],
    addMemmberToTeam,
    id,
    handleRemoveMemberFromTeam,
    handleUpdateUserDetails,
}) => {
    const parentRef = React.useRef();
    const rowVirtualizer = useVirtual({
        size: members.length,
        parentRef,
        estimateSize: React.useCallback(() => 70, []),
        overscan: 5,
    });
    return (
        <>
            <div className="flexShrink flex alignCenter justifySpaceBetween paddingTB20 paddingLR36">
                <div className="mine_shaft_cl bold600 font18  ">
                    Add Members
                </div>

                <Button
                    onClick={() => addMemmberToTeam(id)}
                    type="text"
                    className="capitalize primary padding0 "
                >
                    + Add More
                </Button>
            </div>

            {!!members?.length && (
                <div
                    ref={parentRef}
                    className="List flex1 paddingLR36"
                    style={{
                        width: `100%`,
                        height: "100%",
                        overflowY: "scroll",
                    }}
                >
                    <div
                        style={{
                            height: `${rowVirtualizer.totalSize}px`,
                            width: "100%",
                            position: "relative",
                        }}
                    >
                        {rowVirtualizer.virtualItems.map((virtualRow) => (
                            <div
                                key={virtualRow.index}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                <User
                                    key={virtualRow.index}
                                    team_id={id}
                                    {...members[virtualRow.index]}
                                    handleRemoveMemberFromTeam={
                                        handleRemoveMemberFromTeam
                                    }
                                    handleUpdateUserDetails={
                                        handleUpdateUserDetails
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

const SubTeamPanel = ({
    name,
    members,
    addMemmberToTeam,
    id,
    handleRemoveMemberFromTeam,
    handleUpdateUserDetails,
}) => {
    return (
        <Collapse
            expandIconPosition={"right"}
            bordered={false}
            expandIcon={({ isActive }) =>
                isActive ? <ChevronUpSvg /> : <ChevronDownSvg />
            }
            className="subteam_create_accordian"
        >
            <Panel
                header={
                    <div className="bold600 foont16 mine_shaft_cl">{name}</div>
                }
                key="1"
            >
                {!!members?.length && (
                    <>
                        <Row gutter={[24, 0]} className="marginB20">
                            <Col span={11}>Name</Col>
                            <Col span={11}>Role</Col>
                        </Row>
                        {members.map((e, idx) => (
                            <User
                                key={idx}
                                team_id={id}
                                {...e}
                                handleRemoveMemberFromTeam={
                                    handleRemoveMemberFromTeam
                                }
                                handleUpdateUserDetails={
                                    handleUpdateUserDetails
                                }
                            />
                        ))}
                    </>
                )}

                <Button
                    onClick={() => addMemmberToTeam(id)}
                    type="text"
                    className="capitalize primary padding0 "
                >
                    + Add More
                </Button>
            </Panel>
        </Collapse>
    );
};

const User = ({
    handleRemoveMemberFromTeam,
    team_id,
    id,
    role,
    handleUpdateUserDetails,
}) => {
    const {
        common: { users },
    } = useSelector((state) => state);

    const allRoles = useSelector((state) => state.role_manager.roles);

    return (
        <Row gutter={[24, 0]} className="marginB20">
            <Col span={11}>
                <CustomSelect
                    data={users}
                    option_key="id"
                    type="user"
                    option_name="name"
                    select_placeholder="Choose User"
                    placeholder="Enter Name"
                    style={{
                        width: "100%",
                        height: "46px",
                    }}
                    value={typeof id === "number" ? id : undefined}
                    onChange={(value) => {
                        const user = users.find((user) => user.id === value);
                        handleUpdateUserDetails(id, team_id, {
                            id: value,
                            role: user?.role?.id || null,
                        });
                    }}
                    className="custom__select tm_select"
                />
            </Col>
            <Col span={11}>
                <CustomSelect
                    data={allRoles}
                    option_key="id"
                    option_name="name"
                    select_placeholder="Choose Role"
                    placeholder="Choose Role"
                    style={{
                        width: "100%",
                        height: "46px",
                    }}
                    value={role}
                    onChange={(value) => {
                        handleUpdateUserDetails(id, team_id, {
                            id: id,
                            role: value,
                        });
                    }}
                    className="custom__select tm_select"
                />
            </Col>
            <Col span={2}>
                <button
                    className="crud__btn marginT8 marginL8"
                    onClick={(e) => {
                        handleRemoveMemberFromTeam(id, team_id);
                    }}
                >
                    <DeleteSvg />
                </button>
            </Col>
        </Row>
    );
};

const TeamSettings = (props) => {
    const {
        common: { users },
    } = useSelector((state) => state);

    const validateMessages = {
        required: "${label} is required!",
    };

    useEffect(() => {
        return () => {
            props.setSubTeamRefs([]);
        };
    }, []);

    const { teamToEdit } = useContext(TeamManagerContext);

    return (
        <>
            <div className="flexShrink paddingLR36 marginT20">
                <div className="mine_shaft_cl bold600 font18 marginB16">
                    Add Team Details
                </div>

                <Row gutter={[24, 0]} className="">
                    <Col span={12}>
                        <div>Team Name*</div>
                    </Col>
                    <Col span={12}>
                        <div>Team Manager</div>
                    </Col>
                </Row>

                <Form
                    form={props.teamformRefs}
                    layout={"vertical"}
                    name=""
                    // onFinish={createUserHandler}
                    validateMessages={validateMessages}
                    initialValues={{ name: "", manager: null }}
                    className="tm__form"
                >
                    <Form.Item
                        name={"name"}
                        label=""
                        hasFeedback
                        rules={[{ required: true }]}
                    >
                        <Input
                            className="common_input"
                            placeholder="Enter Sub-team Name"
                            style={{
                                width: "100%",
                                height: "46px",
                            }}
                        />
                    </Form.Item>
                    <Form.Item name={"manager"} label="" hasFeedback>
                        <CustomSelect
                            data={users}
                            option_key="id"
                            type="user"
                            option_name="name"
                            select_placeholder="Choose Manager"
                            placeholder="Choose Manager"
                            style={{
                                width: "100%",
                                height: "46px",
                            }}
                            className="tm_select"
                        />
                    </Form.Item>
                </Form>

                <div className="flex alignCenter justifySpaceBetween marginB16">
                    <div className="mine_shaft_cl bold600 font18 marginB16">
                        Add Sub-team Details
                    </div>

                    <Button
                        type="text"
                        className="capitalize primary padding0"
                        onClick={() => {
                            props.setSubMembers([
                                { id: uid() },
                                ...props.subMembers,
                            ]);
                        }}
                    >
                        + Add Sub-Team
                    </Button>
                </div>

                <Row gutter={[24, 0]} className="marginB10">
                    <Col span={11}>
                        <div>Sub-team Name*</div>
                    </Col>
                    <Col span={11}>
                        <div>Sub-team Manager</div>
                    </Col>
                </Row>
            </div>

            <div className="flex1 overflowYscroll paddingLR36">
                {props.subMembers.map((e, idx) => (
                    <SubTeam {...props} key={e.id} team={e} />
                ))}
            </div>
        </>
    );
};

const SubTeam = ({ setSubTeamRefs, handleRemove, subTeamRefs, team }) => {
    const {
        common: { users },
    } = useSelector((state) => state);

    const validateMessages = {
        required: "${label} is required!",
    };

    const [form] = Form.useForm();

    useEffect(() => {
        setSubTeamRefs((prev) => [
            ...prev,
            {
                ...team,
                form,
            },
        ]);

        form.setFieldsValue({ name: team?.name });
        form.setFieldsValue({ id: team?.id });
        form.setFieldsValue({
            manager: team?.manager?.id || team?.manager,
        });
        form.setFieldsValue({ members: team?.members || [] });
    }, []);

    return (
        <div className="flex ">
            <Form
                form={form}
                layout={"vertical"}
                name=""
                // onFinish={createUserHandler}
                validateMessages={validateMessages}
                initialValues={{
                    name: "",
                    manager: null,
                    id: null,
                }}
                className="tm__form flex1"
            >
                <Form.Item label="id" name="id" noStyle>
                    <Input type="hidden" />
                </Form.Item>
                <Form.Item label="members" name="members" noStyle>
                    <Input type="hidden" />
                </Form.Item>
                <Form.Item
                    name={"name"}
                    label=""
                    hasFeedback
                    rules={[{ required: true }]}
                >
                    <Input
                        className="common_input"
                        placeholder="Enter Sub-team Name"
                        style={{
                            width: "100%",
                            height: "46px",
                        }}
                    />
                </Form.Item>
                <Form.Item name={"manager"} label="" hasFeedback>
                    <CustomSelect
                        data={users}
                        option_key="id"
                        type="user"
                        option_name="name"
                        select_placeholder="Choose Manager"
                        placeholder="Choose Manager"
                        style={{
                            width: "100%",
                            height: "46px",
                        }}
                        className="tm_select"
                    />
                </Form.Item>
            </Form>
            <Popconfirm
                title="Are you sure to delete this sub-team?"
                onConfirm={(e) => {
                    e.stopPropagation();
                    handleRemove(team?.id);
                }}
                onCancel={(e) => e.stopPropagation()}
                okText="Yes"
                cancelText="No"
            >
                <button className="crud__btn marginT8 marginL8">
                    <DeleteSvg />
                </button>
            </Popconfirm>
        </div>
    );
};

export default CRUDDrawer;
