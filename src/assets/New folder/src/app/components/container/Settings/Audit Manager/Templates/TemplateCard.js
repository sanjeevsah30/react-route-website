import React, { useContext } from "react";
import { Button, Col, Row, Tooltip } from "antd";
import EditSvg from "app/static/svg/EditSvg";
import { AuditContext } from "../AuditManager";
import { getRandomColors } from "@tools/helpers";
import { useDispatch } from "react-redux";
import { deleteAuditTemplateRequest } from "@store/call_audit/actions";
import Icon from "@presentational/reusables/Icon";
import { formatFloat } from "../../../../../../tools/helpers";

function TemplateCard({ template }) {
    const { VIEW_CATEGORIES, setActiveTab, setCurrentTemplate, showDrawer } =
        useContext(AuditContext);

    const { name, teams, categories_count, overall_score, id } = template;
    const dispatch = useDispatch();
    const handleDelete = (id) => {
        dispatch(deleteAuditTemplateRequest(id));
    };
    const viewCategories = () => {
        setCurrentTemplate(template);
        setActiveTab(VIEW_CATEGORIES);
    };

    return (
        <Col
            span={24}
            className=" gutter-row template__list__card borderRadius4"
        >
            <Row className="width100p" gutter={[0, 24]}>
                <Col
                    lg={10}
                    md={10}
                    sm={24}
                    xs={24}
                    className="bold font17 flex alignCenter"
                >
                    <div>
                        <div>
                            <Tooltip
                                destroyTooltipOnHide
                                title={<div>{id}</div>}
                                placement="topLeft"
                            >
                                {name}
                            </Tooltip>
                        </div>
                        {!!!categories_count && (
                            <div
                                className="font12 primaryText curPoint"
                                onClick={() => {
                                    viewCategories();
                                    showDrawer();
                                }}
                            >
                                CREATE CATEGORY
                                <span className="marginL5">
                                    <Icon className={"fa-angle-right"} />
                                </span>
                            </div>
                        )}
                    </div>
                </Col>
                <Col lg={3} md={3} sm={24} xs={24}>
                    <div className="auditColorGrey marginB5">Total Score</div>
                    <div className="colorPrimary bolder font18 textCenter">
                        {formatFloat(+overall_score, 2) || 0}
                    </div>
                </Col>
                <Col lg={6} md={6} sm={24} xs={24}>
                    <div className="auditColorGrey marginB5">Applied Teams</div>
                    {teams.length ? (
                        <Row gutter={[12, 12]} className="paddingL6">
                            {!!teams.length &&
                                teams?.slice(0, 3).map(({ id, name }) => (
                                    <Col
                                        style={{
                                            backgroundColor:
                                                getRandomColors(name) + "80",
                                        }}
                                        key={id}
                                        className="marginR10 paddingLR4 paddingTB2 borderRadius4 paddingTB2 capitalize"
                                    >
                                        {name}
                                    </Col>
                                ))}
                            {teams.length > 3 && (
                                <Col
                                    className="marginR10 paddingLR4 paddingTB2 curPoint primary bold"
                                    onClick={() => {
                                        setCurrentTemplate(template);
                                        showDrawer();
                                    }}
                                >
                                    SEE ALL
                                </Col>
                            )}
                        </Row>
                    ) : (
                        <div>None</div>
                    )}
                </Col>
                <Col
                    lg={2}
                    md={2}
                    sm={24}
                    xs={24}
                    className="flex justifyCenter alignCenter"
                >
                    <Button
                        onClick={viewCategories}
                        type="primary"
                        icon={<EditSvg />}
                    />
                </Col>
                {/* <Col
                    lg={2}
                    md={2}
                    sm={24}
                    xs={24}
                    className="flex justifyCenter alignCenter"
                >
                    <Popconfirm
                        title="Are you sure to delete this Criteria?"
                        onConfirm={() => {
                            handleDelete(id);
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger type="link" icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Col> */}
            </Row>
        </Col>
    );
}

export default TemplateCard;
