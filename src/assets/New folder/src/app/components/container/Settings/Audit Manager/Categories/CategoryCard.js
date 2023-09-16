import Icon from "@presentational/reusables/Icon";
import { Col, Button, Switch } from "antd";
import React, { useContext } from "react";
import { AuditContext } from "../AuditManager";

function CategoryCard({
    item,
    setEditClicked,
    setCategoryName,
    setCategoryDescription,
    setVisible,
    setCategory_id,
    handleDisable,
}) {
    const {
        VIEW_QUESTIONS,
        setActiveTab,
        setCurrentCategory,
        showDrawer,
        disableLoading,
    } = useContext(AuditContext);
    const category = item;
    const { id, name, description, questions_count, is_disabled } = category;

    return (
        <Col
            xs={24}
            sm={24}
            md={12}
            lg={12}
            xl={8}
            xxl={6}
            className="gutter-row"
        >
            <div className="category__card padding16 borderRadius8 grabbable">
                <div className="flex justifySpaceBetween alignCenter  marginB10">
                    <div className="bold">{name}</div>
                    <Button
                        onClick={() => {
                            setEditClicked(true);
                            setCategoryName(name);
                            setCategoryDescription(description);
                            setVisible(true);
                            setCategory_id(id);
                        }}
                        type="link"
                    >
                        Edit
                    </Button>
                </div>
                <div className="auditColorGrey marginB10">{description}</div>
                <div className="flex alignCenter justifySpaceBetween">
                    <Button
                        style={{
                            padding: "0",
                            margin: "0",
                        }}
                        type="link"
                        onClick={() => {
                            setCurrentCategory(category);
                            setActiveTab(VIEW_QUESTIONS);
                            if (!!!questions_count) {
                                showDrawer();
                            }
                        }}
                    >
                        {!!questions_count ? "See Details" : "Add Question"}

                        <Icon
                            style={{
                                marginLeft: "10px",
                            }}
                            className={"fa-angle-right"}
                        />
                    </Button>

                    <Switch
                        loading={disableLoading}
                        checked={!is_disabled}
                        onChange={(e) => {
                            handleDisable(id, !is_disabled);
                        }}
                    />
                </div>
            </div>
        </Col>
    );
}

export default CategoryCard;
