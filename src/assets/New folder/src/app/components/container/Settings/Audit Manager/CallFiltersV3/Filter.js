import React, { useContext, useEffect, useState } from "react";
import auditConfig from "@constants/Audit";

import { Input, Row, Col, Button } from "antd";
import { uid } from "@tools/helpers";

import TemplateLayout from "../Layout/TemplateLayout";
import { useDispatch, useSelector } from "react-redux";
import {
    createQuestionSubFiltersRequest,
    editQuestionSubFiltersRequest,
    restoreSubFilterRequest,
} from "@store/call_audit/actions";
import SubFilterV2 from "./SubFilterV2";
import { FilterSettingsContext } from "./AuditFiltersSettings";
const { TextArea } = Input;

function Filter({ handleActiveTab, questionToEdit, editEnable, activeTab }) {
    const { setErrorCmdVisible } = useContext(FilterSettingsContext);
    const { EDIT_FILTERS_TAB, DELETED_FILTERS_TAB, CATEGORY_LIST_TAB } =
        auditConfig;
    const [subfilters, setSubfilters] = useState([]);
    const [deletedSubfilters, setDeletedSubfilters] = useState([]);
    const dispatch = useDispatch();
    const { filter, deletedFilters } = useSelector((state) => state.callAudit);
    const [pyCode, setPyCode] = useState("");
    const [filterName, setFilterName] = useState("");
    const [filterVariableName, setFilterVariableName] = useState("");

    useEffect(() => {
        if (activeTab === EDIT_FILTERS_TAB && editEnable && filter) {
            setSubfilters(filter.sub_filters);
            setFilterName(filter.display_name);
            setFilterVariableName(filter.variable_name);
            setPyCode(filter.py_code);
        }
    }, [editEnable, filter]);

    useEffect(() => {
        if (activeTab === DELETED_FILTERS_TAB) {
            setSubfilters(deletedFilters);
        }
    }, [activeTab, deletedFilters]);

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
            createQuestionSubFiltersRequest(
                {
                    sub_filters: temp,
                    display_name: filterName,
                    py_code: pyCode,
                    question_id: questionToEdit.id,
                    variable_name: filterVariableName,
                },
                () => {
                    handleActiveTab(CATEGORY_LIST_TAB);
                }
            )
        );
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
            editQuestionSubFiltersRequest(
                {
                    sub_filters: temp,
                    display_name: filterName,
                    py_code: pyCode,
                    question_id: questionToEdit.id,
                    variable_name: filterVariableName,
                    deleted_sub_filters: deletedSubfilters,
                },
                questionToEdit.id
            )
        );
    };

    const removeSubFilters = (id) => {
        const newSubFilters = subfilters.filter(
            (subfilter, pos) => subfilter.id !== id
        );
        setSubfilters([...newSubFilters]);
        if (typeof id === "number")
            setDeletedSubfilters([...deletedSubfilters, { id }]);
    };

    return (
        <TemplateLayout
            name={
                questionToEdit?.question_text +
                `${
                    activeTab === DELETED_FILTERS_TAB
                        ? " (DELETED SUBFILTERS)"
                        : ""
                }`
            }
            showFooter={activeTab !== DELETED_FILTERS_TAB}
            save_text={editEnable ? "SAVE" : "CREATE"}
            goBack={() =>
                activeTab === DELETED_FILTERS_TAB
                    ? handleActiveTab(EDIT_FILTERS_TAB)
                    : handleActiveTab(CATEGORY_LIST_TAB)
            }
            save={() => {
                editEnable ? saveSubfilters() : createSubFilters();
            }}
            show_header_btn={activeTab !== DELETED_FILTERS_TAB}
            header_btn_text="ADD SUBFILTER"
            header_btn_click={() => {
                handleAddSubFilter();
            }}
            headerChildren={
                <Button
                    type="danger"
                    onClick={() => {
                        setErrorCmdVisible(true);
                    }}
                >
                    Error Check
                </Button>
            }
        >
            <div className="paddingTB24 paddingR24">
                <div className="input_container  marginB30">
                    <Row gutter={[12, 12]} className="alignCenter paddingB20">
                        {typeof filter?.id === "number" &&
                        activeTab === EDIT_FILTERS_TAB ? (
                            <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                <div className="colorFilterGrey paddingB8">
                                    ID
                                </div>
                                <div className="font14">{filter.id}</div>
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
                                placeholder={"Enter filter display name"}
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
                                placeholder={"Enter filter variable name"}
                                onChange={(e) => {
                                    setFilterVariableName(e.target.value);
                                }}
                            />
                        </Col>
                    </Row>
                </div>
                <div className="input_container  marginB30">
                    <h3 className="heading_1 marginB15">Python Expression</h3>
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
                        <SubFilterV2
                            {...subfilter}
                            key={subfilter.id}
                            subfilters={subfilters}
                            subfilter={subfilter}
                            setSubfilters={setSubfilters}
                            removeSubFilters={removeSubFilters}
                            editEnable={editEnable}
                            subFilterToEdit={subFilterToEdit}
                            showRestore={activeTab === DELETED_FILTERS_TAB}
                            restoreFilter={restoreFilter}
                        />
                    );
                })}
            </div>
        </TemplateLayout>
    );
}

export default Filter;
