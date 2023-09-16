import { Card, Col, Popconfirm, Popover, Row, Tag, Tooltip } from "antd";
import { useState } from "react";
import { uid } from "../../../../../tools/helpers";
import MoreSvg from "../../../../static/svg/MoreSvg";
import MultipleAvatars from "../../../presentational/reusables/MultipleAvatars";
import "./sampling_manager.style.scss";
import CreateRuleModal from "./CreateRuleModal";

const SamplingRuleCard = ({
    id,
    teams,
    auditors,
    reps,
    name,
    auditType,
    onDelete,
}) => {
    const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
    const colors = ["#E34A6F", "#9B8816"];
    const [editModalVisible, isEditModalVisible] = useState(false);
    const avatarColors = [
        "#3A70FD",
        "#F564A9",
        "#FE5F55",
        "#6622CC",
        "#1A62F2",
    ];
    return (
        <Col
            sm={24}
            md={24}
            lg={12}
            xl={8}
            xxl={6}
            xxxl={4}
            className="sampling_rule_card"
        >
            <Card
                title={<SamplingRuleCardTitle title={name} type={auditType} />}
                extra={
                    <Popover
                        content={
                            <div onClick={(e) => e.stopPropagation()}>
                                {/* <div onClick={() => {}} className="option">
                                    See Report
                                </div> */}
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMoreOptionsVisible(false);
                                        isEditModalVisible(true);
                                    }}
                                    className="option"
                                >
                                    Edit
                                </div>
                                <Popconfirm
                                    title="Are you sure to delete this rule?"
                                    onConfirm={(e) => {
                                        e.stopPropagation();
                                        onDelete(id);
                                    }}
                                    onCancel={(e) => e.stopPropagation()}
                                >
                                    <div className="option">Delete</div>
                                </Popconfirm>
                            </div>
                        }
                        title="Select Options"
                        trigger="click"
                        open={moreOptionsVisible}
                        onOpenChange={(visible) => {
                            setMoreOptionsVisible(visible);
                        }}
                        overlayClassName={"sampling_rule_more_options_popover"}
                        placement="bottomRight"
                    >
                        <MoreSvg />
                    </Popover>
                }
            >
                <Row justify="space-between">
                    <span className="rule_content">Auditors</span>
                    <div className="avatar_group">
                        <MultipleAvatars
                            isString={true}
                            participants={auditors}
                            size={30}
                            colors={avatarColors}
                        />
                    </div>
                </Row>
                <Row justify="space-between">
                    <span className="rule_content">Teams</span>
                    <div className="team_tags">
                        {teams.slice(0, 2).map((team, idx) => (
                            <Tooltip title={team}>
                                <Tag color={colors[idx]} key={uid()}>
                                    <span>{team}</span>
                                </Tag>
                            </Tooltip>
                        ))}
                        {teams.length > 2 && (
                            <Tooltip
                                title={teams.slice(2).reduce((prev, next) => {
                                    return prev + ", " + next;
                                })}
                            >
                                <Tag
                                    color="#1A62F21A"
                                    style={{ color: "#1A62F2" }}
                                >
                                    +{teams.length - 2}
                                </Tag>
                            </Tooltip>
                        )}
                    </div>
                </Row>
                <Row justify="space-between">
                    <span className="rule_content">Reps</span>
                    <div className="avatar_group">
                        <MultipleAvatars
                            isString={true}
                            participants={reps}
                            size={30}
                            colors={avatarColors}
                        />
                    </div>
                </Row>
            </Card>
            <CreateRuleModal
                visible={editModalVisible}
                onCancel={() => {
                    isEditModalVisible(false);
                }}
                ruleId={id}
                destroyOnClose
            />
        </Col>
    );
};

const SamplingRuleCardTitle = ({ type, title }) => {
    return (
        <span className="rule_title_div">
            <span className="rule_title">{title}</span>
            {Boolean(type) && (
                <Tag
                    color={type === "ai" ? "#1A62F21A" : "#99999933"}
                    style={{ color: type === "ai" ? "#1A62F2" : "#333333" }}
                >
                    {type === "ai" ? "AI" : "Manual"}
                </Tag>
            )}
        </span>
    );
};

SamplingRuleCard.defaultProps = {
    teams: [],
    auditors: [],
    reps: [],
    name: "",
    auditType: "",
};

export default SamplingRuleCard;
