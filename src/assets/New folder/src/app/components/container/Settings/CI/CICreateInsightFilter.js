import React, { useContext, useEffect, useState } from "react";
import auditConfig from "@constants/Audit";

import { Input, Row, Col, Button, Popconfirm } from "antd";
import { uid } from "@tools/helpers";

import { useDispatch, useSelector } from "react-redux";
import {
    createQuestionSubFiltersRequest,
    editQuestionSubFiltersRequest,
    restoreSubFilterRequest,
} from "@store/call_audit/actions";

import SubFilter from "./SubFilters";
import TemplateLayout from "../Audit Manager/Layout/TemplateLayout";
import { useHistory, useParams } from "react-router-dom";
import {
    createCIInsightFilter,
    deleteCIFilter,
    deleteCISubFilter,
    getCIInsightsFilterById,
    updateCIInsightFilter,
} from "@store/cutsomerIntelligence/internalCiDashboardSlice";
import apiErrors from "@apis/common/errors";
import routes from "@constants/Routes/index";
import Spinner from "@presentational/reusables/Spinner";
const { TextArea } = Input;

function CICreateInsightFilter({
    handleActiveTab,
    questionToEdit,
    editEnable,
    activeTab,
}) {
    const { insight_id, create_insight_id } = useParams();
    const [errorCmdVisible, setErrorCmdVisible] = useState(false);
    const { EDIT_FILTERS_TAB, DELETED_FILTERS_TAB, CATEGORY_LIST_TAB } =
        auditConfig;
    const [subfilters, setSubfilters] = useState([]);
    const [deletedSubfilters, setDeletedSubfilters] = useState([]);
    const dispatch = useDispatch();
    const [filterId, setFilterId] = useState(null);
    const [pyCode, setPyCode] = useState("");
    const [filterName, setFilterName] = useState("");
    const [filterVariableName, setFilterVariableName] = useState("");

    const {
        InternalCiDashboardSlice: { insightsLoading },
    } = useSelector((state) => state);

    const history = useHistory();

    useEffect(() => {
        if (insight_id) {
            dispatch(getCIInsightsFilterById(insight_id)).then(
                ({ payload }) => {
                    if (payload?.status !== apiErrors.AXIOSERRORSTATUS) {
                        setFilterId(payload.id);
                        setSubfilters(payload.sub_filters);
                        setFilterName(payload.display_name);
                        setFilterVariableName(payload.variable_name);
                        setPyCode(payload.py_code);
                    }
                }
            );
        }
    }, []);

    const subFilterToEdit = (id) => {
        const newSubFilters = subfilters.map((subfilter) => {
            if (subfilter.id === id) {
                return {
                    ...subfilter,
                    edit: true,
                };
            }
            return subfilter;
        });

        setSubfilters(newSubFilters);
    };

    const restoreFilter = (id) => {
        dispatch(restoreSubFilterRequest(id));
    };

    const handleAddSubFilter = () => {
        setSubfilters([
            {
                edit: true,
                id: uid(),
                display_name: "",
                variable_name: "",
                phrase: "",
                spoken_by: ["owner", "client", "participant"],
                search_sliding_window: 1,
                search_start_seq: "__result__ = 0",
                search_end_seq: "__result__ = max_sentence_seq",
                search_start_time: "__result__ = talk_start_time",
                search_end_time: "__result__ = talk_end_time",
            },
            ...subfilters,
        ]);
    };

    const createSubFilters = () => {
        const temp = subfilters.map((subfilter) => {
            return { ...subfilter };
        });
        for (let subfilter of temp) {
            delete subfilter.id;
            delete subfilter.edit;
        }

        dispatch(
            createCIInsightFilter({
                payload: {
                    sub_filters: temp,
                    display_name: filterName,
                    py_code: pyCode,
                    variable_name: filterVariableName,
                    insight_id: create_insight_id,
                },
            })
        ).then(({ payload }) => {
            if (payload?.status !== apiErrors.AXIOSERRORSTATUS) {
                history.push(routes.settings.ci);
            }
        });
    };

    const saveSubfilters = (id) => {
        const temp = subfilters.map((subfilter) => {
            return { ...subfilter };
        });
        for (let subfilter of temp) {
            typeof subfilter.id !== "number" && delete subfilter.id;
            delete subfilter.edit;
        }

        dispatch(
            updateCIInsightFilter({
                payload: {
                    sub_filters: temp,
                    display_name: filterName,
                    py_code: pyCode,
                    variable_name: filterVariableName,
                    deleted_sub_filters: deletedSubfilters,
                },
                id: insight_id,
            })
        ).catch((err) => {});
    };

    const removeFilter = () => {
        dispatch(deleteCIFilter(filterId)).then((res) => {
            if (res?.status === apiErrors.AXIOSERRORSTATUS || !res.status)
                return;
            history.push("/settings/ci");
        });
    };

    const removeSubFilters = (id) => {
        const newSubFilters = subfilters.filter(
            (subfilter, pos) => subfilter.id !== id
        );
        if (typeof id === "number") {
            dispatch(deleteCISubFilter(id)).then((res) => {
                if (res?.status === apiErrors.AXIOSERRORSTATUS) return;
                setSubfilters([...newSubFilters]);
            });
        } else {
            setSubfilters([...newSubFilters]);
        }

        if (typeof id === "number")
            setDeletedSubfilters([...deletedSubfilters, { id }]);
    };

    return (
        <div className="height100p flex column">
            <TemplateLayout
                name={
                    insight_id ? "Edit Insight Filter" : "Create Insight Filter"
                }
                showFooter={true}
                save_text={insight_id ? "SAVE" : "CREATE"}
                goBack={() => history?.goBack()}
                save={() => {
                    insight_id ? saveSubfilters() : createSubFilters();
                }}
                header_btn_text="ADD SUBFILTER"
                header_btn_click={() => {
                    handleAddSubFilter();
                }}
                show_header_btn={true}
                headerChildren={
                    filterId ? (
                        <Popconfirm
                            title="Are you sure to delete this filter?"
                            onConfirm={() => {
                                removeFilter(filterId);
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger className="marginL16">
                                Delete
                            </Button>
                        </Popconfirm>
                    ) : (
                        <></>
                    )
                }
            >
                <Spinner loading={insightsLoading}>
                    <div className="paddingTB24 paddingR24">
                        <div className="input_container  marginB30">
                            <Row
                                gutter={[12, 12]}
                                className="alignCenter paddingB20"
                            >
                                {filterId ? (
                                    <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                        <div className="colorFilterGrey paddingB8">
                                            ID
                                        </div>
                                        <div className="font14">{filterId}</div>
                                    </Col>
                                ) : (
                                    <></>
                                )}

                                <Col xs={24} sm={24} md={24} lg={11} xl={11}>
                                    <div className="colorFilterGrey paddingB8">
                                        Filter Display Name
                                    </div>
                                    <Input
                                        required
                                        value={filterName}
                                        placeholder={
                                            "Enter filter display name"
                                        }
                                        onChange={(e) => {
                                            setFilterName(e.target.value);
                                        }}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={11} xl={11}>
                                    <div className="colorFilterGrey paddingB8">
                                        Variable Name
                                    </div>
                                    <Input
                                        required
                                        value={filterVariableName}
                                        placeholder={
                                            "Enter filter variable name"
                                        }
                                        onChange={(e) => {
                                            setFilterVariableName(
                                                e.target.value
                                            );
                                        }}
                                    />
                                </Col>
                            </Row>
                        </div>
                        <div className="input_container  marginB30">
                            <h3 className="heading_1 marginB15">
                                Python Expression
                            </h3>
                            <TextArea
                                className="audit__input__bg resize_vertical"
                                placeholder="Enter python expression"
                                autoSize={{ minRows: 6 }}
                                onChange={(e) => {
                                    setPyCode(e.target.value);
                                }}
                                value={pyCode}
                            />
                        </div>

                        <h3 className="heading_1 marginB15">Subfilters</h3>
                        {subfilters?.map((subfilter, index) => {
                            return (
                                <SubFilter
                                    {...subfilter}
                                    key={subfilter.id}
                                    subfilters={subfilters}
                                    subfilter={subfilter}
                                    setSubfilters={setSubfilters}
                                    removeSubFilters={removeSubFilters}
                                    editEnable={editEnable}
                                    subFilterToEdit={subFilterToEdit}
                                    showRestore={
                                        activeTab === DELETED_FILTERS_TAB
                                    }
                                    restoreFilter={restoreFilter}
                                />
                            );
                        })}
                    </div>
                </Spinner>
            </TemplateLayout>
        </div>
    );
}

export default CICreateInsightFilter;
