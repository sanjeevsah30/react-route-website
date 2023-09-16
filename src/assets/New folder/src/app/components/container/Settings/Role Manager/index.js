import MultipleAvatars from "@presentational/reusables/MultipleAvatars";
import Spinner from "@presentational/reusables/Spinner";
import {
    createRolePermissions,
    deleteRolePermissions,
    getRolePermissions,
    getRoles,
    updateRolePermissions,
} from "@store/roleManager/role_manager.store";
import {
    Button,
    Checkbox,
    Col,
    Collapse,
    Form,
    Input,
    Popconfirm,
    Radio,
    Row,
    Switch,
    Tooltip,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomMultipleSelect } from "app/components/Resuable/index";
import ChevronDownSvg from "app/static/svg/ChevronDownSvg";
import ChevronUpSvg from "app/static/svg/ChevronUpSvg";
import DeleteSvg from "app/static/svg/DeleteSvg";
import EditCommentSvg from "app/static/svg/EditCommentSvg";
import LeftArrowSvg from "app/static/svg/LeftArrowSvg";
import "./role_manager.style.scss";

const { Panel } = Collapse;

const RoleManagerContext = createContext();

export default function RoleManager() {
    const dispatch = useDispatch();
    const {
        role_manager: { roles, role_permissions, loading },
    } = useSelector((state) => state);
    useEffect(() => {
        dispatch(getRolePermissions());
    }, []);

    const [roleToEdit, setRoleToEdit] = useState(null);

    const [createRoleView, setCreateRoleView] = useState(false);

    //Created role successfully then change view to view roles section
    useEffect(() => {
        setCreateRoleView(false);
    }, [roles.length]);
    return (
        <RoleManagerContext.Provider
            value={{
                roleToEdit,
                setRoleToEdit,
                createRoleView,
                setCreateRoleView,
                role_permissions,
                roles,
            }}
        >
            <div className="role__manager height100p">
                {createRoleView ? (
                    <EditRoleView />
                ) : (
                    <Spinner loading={loading}>
                        <RolesListView
                            roles={roles}
                            setCreateRoleView={setCreateRoleView}
                            setRoleToEdit={setRoleToEdit}
                        />
                    </Spinner>
                )}
            </div>
        </RoleManagerContext.Provider>
    );
}

const RolesListView = () => {
    const { roles, setCreateRoleView } = useContext(RoleManagerContext);
    return (
        <>
            <div className="flex justifySpaceBetween alignCenter marginB40">
                <div className="bold600 font20">Role Manager</div>
                <Button
                    type="primary"
                    className="borderRadius6 capitalize"
                    onClick={() => setCreateRoleView(true)}
                >
                    + Create Role
                </Button>
            </div>
            <div className="role__manager--cards--container">
                <Row gutter={[40, 40]}>
                    {roles?.map((role) => (
                        <RoleManagerCard role={role} key={role.id} />
                    ))}
                </Row>
            </div>
        </>
    );
};

const EditRoleView = ({}) => {
    const {
        common: { teams },
        role_manager: { crud_loading },
    } = useSelector((state) => state);

    const { setCreateRoleView, role_permissions, roleToEdit, setRoleToEdit } =
        useContext(RoleManagerContext);
    const [teamIds, setTeamIds] = useState([]);
    const [form] = Form.useForm();
    const [codeNames, setCodeNames] = useState([]);
    const ref = useRef();
    const validateMessages = {
        required: "${label} is required!",
        types: {
            email: "${label} is not valid email!",
        },
        string: {
            max: "${label} can't exceed ${max} characters",
        },
    };

    const dispatch = useDispatch();

    const constructPermissions = (name, key, to_replace) => {
        setPerm(
            perm.map((e) => {
                if (e.heading === name) {
                    return {
                        ...e,
                        permissions: { ...to_replace },
                    };
                }
                return e;
            })
        );
    };

    const setDefaultPermissionsOnVisibilityChange = (
        is_visible,
        permissions
    ) => {
        let permissions_clone = { ...permissions };

        const is_one_key = Object.keys(permissions_clone).length === 1;

        Object.keys(permissions_clone)?.forEach((key) => {
            let view = permissions_clone[key]?.view
                ? { ...permissions_clone[key]?.view }
                : {};
            let edit = permissions_clone[key]?.view
                ? [...permissions_clone[key]?.edit]
                : [];
            let del = permissions_clone[key]?.delete
                ? [...permissions_clone[key]?.delete]
                : [];

            view = is_visible
                ? is_one_key || (view?.is_default && !is_one_key)
                    ? { ...view, is_selected: true }
                    : { ...view, is_selected: false }
                : { ...view, is_selected: false };
            edit = is_visible
                ? is_one_key || (view?.is_default && !is_one_key)
                    ? edit.map((e) =>
                          e.is_default
                              ? { ...e, is_selected: true }
                              : { ...e, is_selected: false }
                      )
                    : edit
                : edit.map((e) => ({ ...e, is_selected: false }));
            del = is_visible
                ? is_one_key || (view?.is_default && !is_one_key)
                    ? del.map((e) =>
                          e.is_default
                              ? { ...e, is_selected: true }
                              : { ...e, is_selected: false }
                      )
                    : del
                : del.map((e) => ({ ...e, is_selected: false }));

            permissions_clone[key] = {
                view,
                edit,
                delete: del,
            };
        });

        return permissions_clone;
    };

    const handleVisbelity = (name, is_visible) => {
        setPerm(
            perm.map((e) => {
                if (e.heading === name) {
                    return {
                        ...e,
                        permissions: setDefaultPermissionsOnVisibilityChange(
                            is_visible,
                            e.permissions
                        ),
                        is_visible,
                    };
                }
                return e;
            })
        );
    };

    const [perm, setPerm] = useState([]);
    const [def, setDef] = useState([]);

    const handleCreate = async () => {
        try {
            let role_data = await form.validateFields();
            if (roleToEdit) {
                dispatch(
                    updateRolePermissions({
                        id: roleToEdit.id,
                        ...role_data,
                        code_names: perm,
                        allowed_teams: teamIds.map(Number),
                    })
                );
            } else
                dispatch(
                    createRolePermissions({
                        ...role_data,
                        code_names: perm,
                        allowed_teams: teamIds.map(Number),
                    })
                );
        } catch (err) {
            ref.current.scrollTo(0, 0);
        }
    };

    useEffect(() => {
        if (roleToEdit) {
            setPerm(roleToEdit.code_names);
            form.setFieldsValue({ name: roleToEdit.name });
            form.setFieldsValue({ description: roleToEdit.description });
            setTeamIds(roleToEdit.allowed_teams.map(String));
        } else {
            //Set Default values
            const new_role_permission = [];

            for (let i = 0; i < role_permissions.length; i++) {
                let role = { ...role_permissions[i] };
                const { permissions } = role;
                let permissions_clone = { ...permissions };
                if (!permissions) {
                    return;
                }

                Object.keys(permissions_clone)?.forEach((key) => {
                    let view = permissions_clone[key]?.view
                        ? { ...permissions_clone[key]?.view }
                        : {};
                    let edit = permissions_clone[key]?.view
                        ? [...permissions_clone[key]?.edit]
                        : [];
                    let del = permissions_clone[key]?.delete
                        ? [...permissions_clone[key]?.delete]
                        : [];

                    view = view?.is_default
                        ? { ...view, is_selected: true }
                        : { ...view };
                    edit = view.is_default
                        ? edit.map((e) =>
                              e.is_default ? { ...e, is_selected: true } : e
                          )
                        : edit;
                    del = view.is_default
                        ? del.map((e) =>
                              e.is_default ? { ...e, is_selected: true } : e
                          )
                        : del;

                    permissions_clone[key] = {
                        view,
                        edit,
                        delete: del,
                    };
                });
                role = { ...role, permissions: permissions_clone };

                new_role_permission.push(role);
            }

            setPerm(new_role_permission);
        }
        setDef(role_permissions);
    }, [role_permissions]);

    const [desc, setDesc] = useState("");

    return (
        <div className="role_edit_page height100p flex column">
            <div
                className="flex1 "
                style={{
                    flex: 1,

                    overflow: "scroll",
                }}
                ref={ref}
            >
                <div className="flex  alignCenter marginB40">
                    <div
                        className={"curPoint marginR12"}
                        onClick={() => {
                            setRoleToEdit(null);
                            setCreateRoleView(false);
                        }}
                    >
                        <LeftArrowSvg
                            style={{
                                fontSize: "10px",
                                marginTop: "8px",
                                transform: "scale(0.8)",
                            }}
                        />
                    </div>
                    <div className="bold600 font20 paddingT8">
                        Roles and Permissions
                    </div>
                </div>

                <div>
                    <Form
                        form={form}
                        layout={"vertical"}
                        validateMessages={validateMessages}
                        className="role_form"
                    >
                        <Form.Item
                            name={"name"}
                            label="Role Name*"
                            rules={[{ type: "string", required: true }]}
                            hasFeedback
                        >
                            <Input placeholder={"Enter Role Name"} allowClear />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item
                                name={"description"}
                                label="Role Description"
                                rules={[{ type: "string", max: 80 }]}
                                hasFeedback
                            >
                                <Input
                                    placeholder={
                                        "Enter a short description of this role"
                                    }
                                    onChange={(e) => {
                                        setDesc(e.target.value);
                                    }}
                                />
                            </Form.Item>
                            <div className="dove_gray_cl marginL6 marginT18">
                                {!!desc.length &&
                                    desc.length <= 80 &&
                                    `You have ${
                                        80 - desc.length
                                    } charectars left`}
                            </div>
                        </Form.Item>
                    </Form>
                </div>

                <div className="role__team__selector">
                    <div className="bold600 mine_shaft_cl font18">
                        Select Teams/ Sub-teams
                    </div>
                    <div className="dusty_gray_cl marginB14">
                        The role and permissions will be set to the selected
                        teams.
                    </div>
                </div>

                <div className="flex alignCenter marginB40">
                    <span className="dove_gray_cl">List of Teams</span>
                    <CustomMultipleSelect
                        data={teams}
                        value={teamIds.map((id) => `${id}`)}
                        onChange={(teamIds) => setTeamIds(teamIds)}
                        placeholder="Select Teams or Subteams"
                        select_placeholder="Select Teams"
                        style={{
                            width: "267px",
                            padding: "0",
                            flex: "0.8",
                        }}
                        className=" multiple__select marginL35"
                        option_name="name"
                        type="team"
                    />
                </div>

                <div className="marginB24">
                    <div className="bold600 mine_shaft_cl font18">
                        Permissions
                    </div>
                    <div className="dusty_gray_cl">
                        These permissions will be applied to each teammate with
                        this role.
                    </div>
                </div>
                {perm.map((per, idx) => {
                    return (
                        <RoleCollapseCard
                            name={per.heading}
                            {...per}
                            key={idx}
                            constructPermissions={constructPermissions}
                            handleVisbelity={handleVisbelity}
                            codeNames={codeNames}
                            perm={perm[idx]}
                            def={def[idx]}
                        />
                    );
                })}
            </div>

            <div className="flexShrink padding20 flex row-reverse">
                <Button
                    type="primary"
                    onClick={async () => {
                        // console.log(role_data);
                        // console.log(teamIds);
                        handleCreate();
                    }}
                    className="borderRadius6 capitalize"
                    loading={crud_loading}
                >
                    {roleToEdit ? "Update Role" : "Create Role"}
                </Button>
            </div>
        </div>
    );
};

const RoleCollapseCard = ({
    name,
    permissions,
    constructPermissions,
    codeNames,
    perm,
    def,
    is_switch,
    is_visible,
    handleVisbelity,
}) => {
    const [radioType, setRadioType] = useState(null);
    const is_one_key = Object.keys(perm?.permissions).length === 1;

    useEffect(() => {
        if (!radioType || is_one_key) {
            setRadioType(
                Object.keys(perm?.permissions || {})?.find(
                    (e) => is_one_key || perm?.permissions[e]?.view?.is_selected
                )
            );
        }
    }, [radioType]);

    return (
        <div className="role_collapse_card">
            <Collapse
                expandIconPosition={"right"}
                bordered={false}
                expandIcon={({ isActive }) =>
                    isActive ? <ChevronUpSvg /> : <ChevronDownSvg />
                }
            >
                <Panel
                    //  .ant-collapse-no-arrow class is used to hide collapse content in the styles js file of this component
                    showArrow={
                        is_one_key
                            ? radioType &&
                              (!!perm?.permissions?.[radioType]?.edit?.length ||
                                  !!perm?.permissions?.[radioType]?.delete
                                      ?.length)
                            : !is_one_key
                    }
                    header={
                        <div className="flex alignCenter justifySpaceBetween width100p paddingR40">
                            <div className="bold600 font16 mine_shaft_cl">
                                {name}
                            </div>
                            {is_switch && (
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <Switch
                                        onChange={(e) =>
                                            handleVisbelity(name, e)
                                        }
                                        checked={is_visible}
                                    />
                                </div>
                            )}
                        </div>
                    }
                    key="1"
                    onClick={(e) => {
                        // e.stopPropagation();
                    }}
                >
                    <div className="content__settings">
                        <div>
                            {!is_one_key && (
                                <Row className="marginB20">
                                    <Col span={4} className="dove_gray_cl">
                                        Can access
                                    </Col>

                                    <Col span={20}>
                                        <div className="flex">
                                            <Radio.Group
                                                onChange={(e) => {
                                                    setRadioType(
                                                        e.target.value
                                                    );

                                                    const prev_key =
                                                        Object.keys(
                                                            perm?.permissions ||
                                                                {}
                                                        )?.find(
                                                            (e) =>
                                                                perm
                                                                    ?.permissions[
                                                                    e
                                                                ]?.view
                                                                    ?.is_selected
                                                        );

                                                    constructPermissions(
                                                        name,
                                                        e.target.value,
                                                        prev_key
                                                            ? {
                                                                  ...def?.permissions,
                                                                  [prev_key]: {
                                                                      ...def
                                                                          ?.permissions[
                                                                          prev_key
                                                                      ],
                                                                      view: {
                                                                          ...def
                                                                              ?.permissions[
                                                                              prev_key
                                                                          ]
                                                                              .view,
                                                                          is_selected: false,
                                                                      },
                                                                  },
                                                                  [e.target
                                                                      .value]: {
                                                                      ...def
                                                                          ?.permissions[
                                                                          e
                                                                              .target
                                                                              .value
                                                                      ],
                                                                      view: {
                                                                          ...def
                                                                              ?.permissions[
                                                                              e
                                                                                  .target
                                                                                  .value
                                                                          ]
                                                                              .view,
                                                                          is_selected: true,
                                                                      },
                                                                  },
                                                              }
                                                            : {
                                                                  ...def?.permissions,

                                                                  [e.target
                                                                      .value]: {
                                                                      ...def
                                                                          ?.permissions[
                                                                          e
                                                                              .target
                                                                              .value
                                                                      ],
                                                                      view: {
                                                                          ...def
                                                                              ?.permissions[
                                                                              e
                                                                                  .target
                                                                                  .value
                                                                          ]
                                                                              .view,
                                                                          is_selected: true,
                                                                      },
                                                                  },
                                                              }
                                                    );
                                                }}
                                                value={Object.keys(
                                                    perm?.permissions || {}
                                                )?.find(
                                                    (e) =>
                                                        perm?.permissions[e]
                                                            ?.view?.is_selected
                                                )}
                                            >
                                                {Object.keys(permissions).map(
                                                    (key) => (
                                                        <Radio
                                                            value={key}
                                                            key={key}
                                                        >
                                                            {key}
                                                        </Radio>
                                                    )
                                                )}
                                            </Radio.Group>
                                        </div>
                                    </Col>
                                </Row>
                            )}

                            {radioType &&
                                (!!perm?.permissions?.[radioType]?.edit
                                    ?.length ||
                                    !!perm?.permissions?.[radioType]?.delete
                                        ?.length) && (
                                    <>
                                        <Row>
                                            <Col
                                                span={4}
                                                className="dove_gray_cl"
                                            >
                                                Grant
                                            </Col>
                                            <Col span={20}>
                                                <div className="flex">
                                                    {perm?.permissions[
                                                        radioType
                                                    ]?.edit.map(
                                                        ({
                                                            display_name,
                                                            code_name,
                                                            is_selected,
                                                        }) => (
                                                            <Checkbox
                                                                key={code_name}
                                                                checked={
                                                                    is_selected
                                                                }
                                                                onChange={(
                                                                    checked
                                                                ) =>
                                                                    constructPermissions(
                                                                        name,
                                                                        radioType,
                                                                        {
                                                                            ...perm?.permissions,
                                                                            [radioType]:
                                                                                {
                                                                                    ...perm
                                                                                        ?.permissions[
                                                                                        radioType
                                                                                    ],
                                                                                    edit: perm?.permissions[
                                                                                        radioType
                                                                                    ].edit.map(
                                                                                        (
                                                                                            e
                                                                                        ) => {
                                                                                            if (
                                                                                                e.display_name ===
                                                                                                display_name
                                                                                            ) {
                                                                                                return {
                                                                                                    ...e,
                                                                                                    is_selected:
                                                                                                        checked
                                                                                                            .target
                                                                                                            .checked,
                                                                                                };
                                                                                            }
                                                                                            return e;
                                                                                        }
                                                                                    ),
                                                                                },
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                {display_name}
                                                            </Checkbox>
                                                        )
                                                    )}
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col
                                                span={4}
                                                className="dove_gray_cl"
                                            ></Col>
                                            <Col span={20}>
                                                <div className="flex">
                                                    {perm?.permissions?.[
                                                        radioType
                                                    ]?.delete.map(
                                                        ({
                                                            display_name,
                                                            code_name,
                                                            is_selected,
                                                        }) => (
                                                            <Checkbox
                                                                key={code_name}
                                                                checked={
                                                                    is_selected
                                                                }
                                                                onChange={(
                                                                    checked
                                                                ) =>
                                                                    constructPermissions(
                                                                        name,
                                                                        radioType,
                                                                        {
                                                                            ...perm?.permissions,
                                                                            [radioType]:
                                                                                {
                                                                                    ...perm
                                                                                        ?.permissions[
                                                                                        radioType
                                                                                    ],
                                                                                    delete: perm?.permissions[
                                                                                        radioType
                                                                                    ].delete.map(
                                                                                        (
                                                                                            e
                                                                                        ) => {
                                                                                            if (
                                                                                                e.display_name ===
                                                                                                display_name
                                                                                            ) {
                                                                                                return {
                                                                                                    ...e,
                                                                                                    is_selected:
                                                                                                        checked
                                                                                                            .target
                                                                                                            .checked,
                                                                                                };
                                                                                            }
                                                                                            return e;
                                                                                        }
                                                                                    ),
                                                                                },
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                {display_name}
                                                            </Checkbox>
                                                        )
                                                    )}
                                                </div>
                                            </Col>
                                        </Row>
                                    </>
                                )}
                        </div>
                    </div>
                </Panel>
            </Collapse>
        </div>
    );
};

const RoleManagerCard = ({ role }) => {
    const { setRoleToEdit, setCreateRoleView } = useContext(RoleManagerContext);
    const {
        name,
        id,
        users,
        can_be_edited,
        description,
        is_default,
        permissions_count,
    } = role;
    const dispatch = useDispatch();
    return (
        <Col sm={24} md={12} lg={8} xl={8}>
            <div className="role__manager--card">
                <div className="bold600 mine_shaft_cl font20">{name}</div>
                <div className="mid--section">
                    <span className="permision">
                        <span className="font12 dove_gray_cl marginR6">
                            Permissions
                        </span>
                        <span className="bold600 mine_shaft_cl font16">
                            {permissions_count}
                        </span>
                    </span>
                    <span className="total_users">
                        <span className="font12 dove_gray_cl marginR6">
                            Total Users
                        </span>
                        <span className="bold600 mine_shaft_cl font16">
                            {users?.length}
                        </span>
                    </span>
                </div>

                <Tooltip title={description}>
                    <div className="description">
                        {description.length ? description : "No description"}
                    </div>
                </Tooltip>

                <div className="bottom--section">
                    {!!users.length ? (
                        <MultipleAvatars
                            isString={true}
                            participants={users}
                            size={30}
                            max={4}
                            className={"individual_call_participants"}
                        />
                    ) : (
                        <div />
                    )}

                    {can_be_edited && (
                        <div className="font14 margin0 lineHeightN dove_gray_cl">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setRoleToEdit(role);
                                    setCreateRoleView(true);
                                }}
                                className="crud__btn"
                            >
                                <EditCommentSvg />
                            </button>
                            <Popconfirm
                                title="Are you sure to delete this team?"
                                onConfirm={(e) => {
                                    e.stopPropagation();
                                    dispatch(deleteRolePermissions(role));
                                }}
                                onCancel={(e) => e.stopPropagation()}
                                okText="Yes"
                                cancelText="No"
                            >
                                {is_default || (
                                    <button
                                        className="crud__btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <DeleteSvg />
                                    </button>
                                )}
                            </Popconfirm>
                        </div>
                    )}
                </div>
            </div>
        </Col>
    );
};
