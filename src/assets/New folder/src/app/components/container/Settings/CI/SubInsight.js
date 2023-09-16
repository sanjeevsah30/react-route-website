import auditConfig from "@constants/Audit/index";
import { Col, Input, Row, Button, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import PharseFields from "./PharseFields";

function SubInsight({
    id,
    name,
    type,
    subInsights,
    setSubInsights,
    edit,
    removeSubInsight,
    subInsightToEdit,
}) {
    const [displayName, setDisplayName] = useState(name);

    useEffect(() => {
        let newFilters = subInsights.map((subfilter) => {
            if (subfilter.id === id)
                return {
                    ...subfilter,
                    name: displayName,
                };
            else return subfilter;
        });
        setSubInsights(newFilters);
    }, [displayName]);

    return (
        <div className="criteria_card marginB20">
            <Row gutter={[12, 12]} className="alignCenter paddingB20">
                {typeof id === "number" ? (
                    <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                        <div className="colorFilterGrey paddingB8">ID</div>
                        <div className="font14">{id}</div>
                    </Col>
                ) : (
                    <></>
                )}

                <Col xs={24} sm={24} md={24} lg={11} xl={11}>
                    <div className="colorFilterGrey paddingB8">Name</div>
                    {edit ? (
                        <Input
                            required
                            value={displayName}
                            placeholder={"Enter Name"}
                            onChange={(e) => {
                                setDisplayName(e.target.value);
                            }}
                        />
                    ) : (
                        <div>{displayName}</div>
                    )}
                </Col>
                <Col xs={24} sm={24} md={24} lg={11} xl={11}>
                    <div className="colorFilterGrey paddingB8">Type</div>
                    <div>{type}</div>
                </Col>
            </Row>

            <div className="marginTB10 flex row-reverse">
                <Popconfirm
                    title="Are you sure to delete this filter?"
                    onConfirm={() => {
                        removeSubInsight(id);
                    }}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger className="marginR16">
                        Delete
                    </Button>
                </Popconfirm>

                {!edit && (
                    <Button
                        type="primary"
                        className="marginR16"
                        onClick={() => subInsightToEdit(id)}
                    >
                        Edit
                    </Button>
                )}
            </div>
        </div>
    );
}

export default SubInsight;
