import { uid } from "@tools/helpers";
import { Col, Input, Row, Button, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TemplateLayout from "../Audit Manager/Layout/TemplateLayout";
import SubInsight from "./SubInsight";
import CustomSelect from "app/components/Resuable/Select/CustomSelect";
import {
    clearInternalInsightData,
    createCIInsightInternal,
    deleteCIInsightInternal,
    getCIInsightsInternalById,
    updateCIInsightInternal,
} from "@store/cutsomerIntelligence/internalCiDashboardSlice";
import { useHistory, useParams } from "react-router-dom";
import apiErrors from "@apis/common/errors";
import Spinner from "@presentational/reusables/Spinner";
import routes from "@constants/Routes/index";
import { runCommand } from "@store/call_audit/actions";

const { TextArea } = Input;

export default function CICreateInsight() {
    const dispatch = useDispatch();

    const [subInsights, setSubInsights] = useState([]);
    const history = useHistory();
    const [display_name, setDisplayName] = useState("");
    const [isSub, setIsSub] = useState(false);
    const [type, setType] = useState("reason");
    const { insight_id } = useParams();
    const subInsightToEdit = (id) => {
        const newSubInsights = subInsights.map((subInsight) => {
            if (subInsight.id === id) {
                return {
                    ...subInsight,
                    edit: true,
                };
            }
            return subInsight;
        });

        setSubInsights(newSubInsights);
    };

    const {
        InternalCiDashboardSlice: { insightsLoading },
    } = useSelector((state) => state);

    const removeSubInsight = (id) => {
        if (insight_id) {
            dispatch(deleteCIInsightInternal(id)).then(({ payload }) => {
                if (payload?.status !== apiErrors.AXIOSERRORSTATUS) {
                    const newSubInsights = subInsights.filter(
                        (subInsight, pos) => subInsight.id !== id
                    );
                    setSubInsights([...newSubInsights]);
                }
            });
        } else {
            const newSubInsights = subInsights.filter(
                (subInsight, pos) => subInsight.id !== id
            );
            setSubInsights([...newSubInsights]);
        }
    };

    const handleAddSubFilter = () => {
        setSubInsights([
            {
                edit: true,
                id: uid(),
                name: "",
                type,
            },
            ...subInsights,
        ]);
    };

    useEffect(() => {
        const newSubInsights = subInsights.map((subInsight) => {
            return {
                ...subInsight,
                type,
            };
        });

        setSubInsights(newSubInsights);
    }, [type]);

    useEffect(() => {
        if (insight_id)
            dispatch(getCIInsightsInternalById(insight_id)).then(
                ({ payload }) => {
                    if (payload?.id) {
                        setDisplayName(payload.name);
                        setType(payload.type);
                        if (payload?.parent_insight) {
                            setIsSub(true);
                        }
                        setSubInsights(payload.sub_insight);
                    }
                }
            );
        return () => {
            dispatch(clearInternalInsightData());
        };
    }, []);

    return (
        <div className="height100p flex column">
            <TemplateLayout
                name={
                    insight_id
                        ? isSub
                            ? "Edit Subinsight"
                            : "Edit Insight"
                        : "Create Insight"
                }
                showFooter={true}
                save_text={insight_id ? "Save" : "Create"}
                goBack={() => {
                    history.goBack();
                }}
                save={() => {
                    if (insight_id) {
                        dispatch(
                            updateCIInsightInternal({
                                name: display_name,
                                type,
                                id: +insight_id,
                                sub_insight: subInsights.map(
                                    ({ name, type, id, ...rest }) => {
                                        return typeof id === "string"
                                            ? { name, type }
                                            : { name, type, id, ...rest };
                                    }
                                ),
                            })
                        ).then(({ payload }) => {
                            if (payload?.id) {
                                setDisplayName(payload.name);
                                setType(payload.type);
                                if (payload?.parent_insight) {
                                    setIsSub(true);
                                }
                                setSubInsights(payload.sub_insight);
                            }
                        });
                    } else
                        dispatch(
                            createCIInsightInternal({
                                name: display_name,
                                type,
                                sub_insight: subInsights.map(
                                    ({ name, type }) => {
                                        return { name, type };
                                    }
                                ),
                            })
                        ).then(({ payload }) => {
                            if (
                                payload?.status !== apiErrors.AXIOSERRORSTATUS
                            ) {
                                history.push(routes.settings.ci);
                            }
                        });
                }}
                show_header_btn={true}
                header_btn_text="Add Subinsight"
                header_btn_click={() => {
                    handleAddSubFilter();
                }}
                headerChildren={<></>}
            >
                <Spinner loading={insightsLoading}>
                    <div className="paddingTB24 paddingR24">
                        <div className="input_container  marginB30">
                            <Row
                                gutter={[12, 12]}
                                className="alignCenter paddingB20"
                            >
                                <Col xs={24} sm={24} md={24} lg={11} xl={11}>
                                    <div className="colorFilterGrey paddingB8">
                                        Name
                                    </div>
                                    <Input
                                        required
                                        value={display_name}
                                        placeholder={"Enter name"}
                                        onChange={(e) => {
                                            setDisplayName(e.target.value);
                                        }}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={11} xl={11}>
                                    <div className="colorFilterGrey paddingB8">
                                        Type
                                    </div>
                                    <CustomSelect
                                        disabled={isSub}
                                        data={[
                                            { id: "reason", type: "reason" },
                                            {
                                                id: "objection",
                                                type: "objection",
                                            },
                                            { id: "feature", type: "feature" },
                                            {
                                                id: "competition",
                                                type: "competition",
                                            },
                                            {
                                                id: "question",
                                                type: "question",
                                            },
                                            {
                                                id: "sentiment",
                                                type: "sentiment",
                                            },
                                        ]}
                                        option_name={"type"}
                                        option_key={"id"}
                                        select_placeholder={"type"}
                                        placeholder={"type"}
                                        style={{
                                            height: "36px",
                                            width: "128px",
                                        }}
                                        value={type}
                                        onChange={(value) => {
                                            setType(value);
                                        }}
                                        className={"custom__select marginL12"}
                                    />
                                </Col>
                            </Row>
                        </div>
                        {isSub || (
                            <h3 className="heading_1 marginB15">Sub Insight</h3>
                        )}
                        {subInsights?.map((subInsight, index) => {
                            return (
                                <SubInsight
                                    {...subInsight}
                                    key={subInsight.id}
                                    subInsights={subInsights}
                                    subInsight={subInsight}
                                    setSubInsights={setSubInsights}
                                    removeSubInsight={removeSubInsight}
                                    editEnable={() => {}}
                                    subInsightToEdit={subInsightToEdit}
                                    type={type}
                                />
                            );
                        })}
                    </div>
                </Spinner>
            </TemplateLayout>
        </div>
    );
}
