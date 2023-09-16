import React, { createContext, useContext, useEffect, useState } from "react";
import { Popconfirm, Button, Row, Col } from "antd";
import { getName } from "@tools/helpers";
import "./style.scss";
import { Collapse } from "antd";
import ChevronUpSvg from "app/static/svg/ChevronUpSvg";
import ChevronDownSvg from "app/static/svg/ChevronDownSvg";
import EditCommentSvg from "app/static/svg/EditCommentSvg";
import DeleteSvg from "app/static/svg/DeleteSvg";
import CRUDDrawer from "./TeamManger/CRUDDrawer";
import { useDispatch, useSelector } from "react-redux";
import { deleteTeam } from "@store/team_manager/team_manager";

export const TeamManagerContext = createContext();

const { Panel } = Collapse;

const TeamManagerUI = (props) => {
    const [showDrawer, setShowDrawer] = useState(false);

    const {
        team_manager: { teams, loading },
    } = useSelector((state) => state);

    const dispatch = useDispatch();

    const [teamToEdit, setTeamToEdit] = useState(null);

    const handleEdit = (team) => {
        setTeamToEdit(team);
        setShowDrawer(true);
    };

    const handleDelete = (id) => {
        dispatch(deleteTeam(id));
    };

    useEffect(() => {
        if (!showDrawer) {
            setTeamToEdit(null);
        }
    }, [showDrawer]);

    return (
        <TeamManagerContext.Provider
            value={{
                showDrawer,
                setShowDrawer,
                handleEdit,
                teamToEdit,
                setTeamToEdit,
                handleDelete,
            }}
        >
            <div className="team__manager--container">
                <div className="marginTB40 flex alignCenter justifySpaceBetween">
                    <div className="bold600 font20 mine_shaft_cl">
                        Team Manager
                    </div>
                    <Button
                        onClick={() => {
                            setShowDrawer(true);
                        }}
                        type="primary"
                        className="borderRadius4 capitalize"
                    >
                        + Create Team
                    </Button>
                </div>

                <div className="team__cards--container">
                    {teams.map((team) => (
                        <TeamCard key={team.id} team={team} />
                    ))}
                </div>
            </div>
            {showDrawer && <CRUDDrawer />}
        </TeamManagerContext.Provider>
    );
};

const TeamCard = ({ team }) => {
    const { handleEdit, handleDelete } = useContext(TeamManagerContext);
    const { name, manager, subteams, members, id } = team;

    return (
        <div className="team--card">
            <Collapse
                expandIconPosition={"right"}
                bordered={false}
                expandIcon={({ isActive }) =>
                    isActive ? <ChevronUpSvg /> : <ChevronDownSvg />
                }
            >
                <Panel
                    header={
                        <div className="flex alignCenter justifySpaceBetween width100p">
                            <div className="font16 bold600 mine_shaft_cl capitalize">
                                {name}
                            </div>
                            <div className="flex alignCenter justifySpaceBetween marginR60">
                                <div className="marginR60">
                                    <span className="top__label">
                                        <span>Sub Team</span>
                                        <span>{subteams?.length}</span>
                                    </span>
                                    <span className="top__label">
                                        <span>Team Manager</span>
                                        <span>
                                            {manager ? getName(manager) : "-"}
                                        </span>
                                    </span>
                                    <span className="top__label">
                                        <span>Total Members</span>
                                        <span>
                                            {members?.length +
                                                subteams?.reduce(
                                                    (add, { members }) =>
                                                        add + members?.length,
                                                    0
                                                )}
                                        </span>
                                    </span>
                                </div>
                                <div className="font14 margin0 lineHeightN dove_gray_cl">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(team);
                                        }}
                                        className="crud__btn"
                                    >
                                        <EditCommentSvg />
                                    </button>
                                    <Popconfirm
                                        title="Are you sure to delete this team?"
                                        onConfirm={(e) => {
                                            e.stopPropagation();
                                            handleDelete(id);
                                        }}
                                        onCancel={(e) => e.stopPropagation()}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <button
                                            className="crud__btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                        >
                                            <DeleteSvg />
                                        </button>
                                    </Popconfirm>
                                </div>
                            </div>
                        </div>
                    }
                    key="1"
                >
                    {subteams?.length ? (
                        <>
                            <div className="subteam--labels">
                                <Row>
                                    <Col
                                        className="dove_gray_cl font12"
                                        span={14}
                                    >
                                        Sub Team
                                    </Col>
                                    <Col
                                        className="dove_gray_cl font12"
                                        span={5}
                                    >
                                        Sub Team Manager
                                    </Col>
                                    <Col
                                        className="dove_gray_cl font12 text-right"
                                        span={5}
                                    >
                                        Members Count
                                    </Col>
                                </Row>
                            </div>
                            {subteams.map((team) => (
                                <SubTeam key={team.id} {...team} />
                            ))}
                        </>
                    ) : (
                        <div className="subteam--labels bold600 dove_gray_cl text-center">
                            No Sub-teams available
                        </div>
                    )}
                </Panel>
            </Collapse>
        </div>
    );
};

const SubTeam = ({ name, manager, members }) => (
    <div className="subteam--card">
        <Row>
            <Col span={14} className="bold600">
                {name}
            </Col>
            <Col span={5} className="bold600">
                {manager ? getName(manager) : "-"}
            </Col>
            <Col span={5} className="bold600 text-right">
                {members?.length}
            </Col>
        </Row>
    </div>
);

export default TeamManagerUI;
