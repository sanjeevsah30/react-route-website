import auditConfig from "@constants/Audit/index";

import { Col, Collapse, Row, Button, Input, Modal, Popconfirm } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import DebounceTextArea from "app/components/IndividualCall/DebounceTextArea";
import useDebounce from "hooks/useDebounce";

import TemplateLayout from "../Audit Manager/Layout/TemplateLayout";
import routes from "@constants/Routes/index";
import {
    deleteCIInsightInternal,
    getCIInsightsInternal,
} from "@store/cutsomerIntelligence/internalCiDashboardSlice";

import { CustomSelect } from "app/components/Resuable/index";
import Spinner from "@presentational/reusables/Spinner";
import { runCommand } from "@store/call_audit/actions";
import { FilterSettingsContext } from "./CIFiltersSettings";

const { Panel } = Collapse;

function CIFiltersHome({ handleClick, getQuestionSubFilters, question }) {
    const dispatch = useDispatch();
    const { setErrorCmdVisible, errorCmdVisible } = useContext(
        FilterSettingsContext
    );
    const {
        callAudit: { runCommandLoading },
        common: { domain },
    } = useSelector((state) => state);

    //Create expression drawer
    const [cmdVisible, setCmdVisible] = useState(false);

    const [api, setApi] = useState(
        `https://${domain}.api.convin.ai/customer_intelligence/ci_insight_audit/`
    );

    const [st, setSt] = useState("");
    const [et, setEt] = useState("");

    useEffect(() => {
        let query = [];

        st && query.push(`start_time=${st}`);

        et && query.push(`end_time=${et}`);

        query.length &&
            setApi(
                `https://${domain}.api.convin.ai/customer_intelligence/ci_insight_audit/?${query.join(
                    "&"
                )}`
            );
    }, [st, et]);

    const reset = () => {
        setSt("");
        setEt("");
    };

    const {
        InternalCiDashboardSlice: { insights, insightsLoading },
    } = useSelector((state) => state);

    const history = useHistory();

    useEffect(() => {
        dispatch(getCIInsightsInternal());
    }, []);

    const [type, setType] = useState("reason");

    return (
        <Spinner loading={insightsLoading}>
            <TemplateLayout
                name={"CI FILTERS"}
                goBack={() => history.push("/settings/user_manager/")}
                headerChildren={
                    <>
                        <Button
                            type="primary"
                            onClick={() =>
                                history.push(
                                    `${routes.settings.ci}/insight/create`
                                )
                            }
                            className="marginR16"
                        >
                            Create Insight
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => setCmdVisible(true)}
                        >
                            Commands
                        </Button>
                        <Button
                            className="marginL16"
                            type="danger"
                            onClick={() => setErrorCmdVisible(true)}
                        >
                            Error Check
                        </Button>
                    </>
                }
            >
                <div className="marginB16">
                    <div className="colorFilterGrey paddingB8">Type</div>
                    <CustomSelect
                        data={[
                            { id: "reason", type: "reason" },
                            { id: "objection", type: "objection" },
                            { id: "feature", type: "feature" },
                            {
                                id: "competition",
                                type: "competition",
                            },
                            { id: "question", type: "question" },
                            { id: "sentiment", type: "sentiment" },
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
                </div>
                <div>
                    {insights
                        .filter(
                            (e) =>
                                e?.type?.toLowerCase() === type?.toLowerCase()
                        )
                        .map((insight) => (
                            <Card {...insight} key={insight.id} />
                        ))}
                </div>
                <Modal
                    title="Criteria commands"
                    visible={cmdVisible}
                    onCancel={() => setCmdVisible(false)}
                    width={1000}
                    className="commands_modal"
                    footer={[
                        <Button
                            onClick={() => {
                                reset();
                            }}
                            key={"reset_btn"}
                        >
                            Reset
                        </Button>,
                        <Button
                            type="primary"
                            onClick={() => {
                                !runCommandLoading &&
                                    dispatch(
                                        runCommand(api, () => {
                                            setCmdVisible(false);
                                        })
                                    );
                            }}
                            loading={runCommandLoading}
                            key={"run_btn"}
                        >
                            {runCommandLoading ? "...Running" : "Run"}
                        </Button>,
                    ]}
                >
                    <div className="paddingLR16">
                        <div className="font16 bold600">{api}</div>
                        <div className="options_container ">
                            <Input
                                onChange={(e) => {
                                    setSt(e.target.value);
                                }}
                                style={{
                                    width: "30%",
                                }}
                                value={st}
                                placeholder="Enter Start Time"
                            />
                            <Input
                                onChange={(e) => {
                                    setEt(e.target.value);
                                }}
                                style={{
                                    width: "30%",
                                }}
                                value={et}
                                placeholder="Enter End Time"
                            />
                        </div>
                    </div>
                </Modal>
            </TemplateLayout>
        </Spinner>
    );
}

const Card = ({ name, id: insight_id, sub_insight, has_filter }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    return (
        <Col span={24} className="marginTB16">
            <Collapse defaultActiveKey={insight_id}>
                <Panel
                    header={
                        <div className="flex justifySpaceBetween flex1 alignCenter">
                            <div>{name}</div>
                            <div>
                                <Button
                                    className="marginR10"
                                    onClick={() => {
                                        if (has_filter)
                                            history.push(
                                                `${routes.settings.ci}/filter/edit/${insight_id}`
                                            );
                                        else
                                            history.push(
                                                `${routes.settings.ci}/filter/create/${insight_id}`
                                            );
                                    }}
                                >
                                    {has_filter
                                        ? "Edit Filter"
                                        : "Create Filter"}
                                </Button>
                                <Button
                                    onClick={() =>
                                        history.push(
                                            `${routes.settings.ci}/insight/edit/${insight_id}`
                                        )
                                    }
                                >
                                    Edit Insight
                                </Button>
                                <Popconfirm
                                    title="Are you sure to delete this Insight?"
                                    onConfirm={() => {
                                        dispatch(
                                            deleteCIInsightInternal({
                                                id: insight_id,
                                                isSub: false,
                                            })
                                        );
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button danger className="marginL8">
                                        Delete Insight
                                    </Button>
                                </Popconfirm>
                            </div>
                        </div>
                    }
                    key={insight_id}
                >
                    {sub_insight.map(({ name, id, has_filter }) => {
                        return (
                            <div
                                className="flex justifySpaceBetween flex1 alignCenter marginTB16"
                                key={id}
                            >
                                <div>{name}</div>
                                <div>
                                    <Button
                                        className="marginR10"
                                        onClick={() => {
                                            if (has_filter)
                                                history.push(
                                                    `${routes.settings.ci}/filter/edit/${id}`
                                                );
                                            else
                                                history.push(
                                                    `${routes.settings.ci}/filter/create/${id}`
                                                );
                                        }}
                                    >
                                        {has_filter
                                            ? "Edit Filter"
                                            : "Create Filter"}
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            history.push(
                                                `${routes.settings.ci}/insight/edit/${id}`
                                            )
                                        }
                                    >
                                        Edit Sub Insight
                                    </Button>
                                    <Popconfirm
                                        title="Are you sure to delete this Insight?"
                                        onConfirm={() => {
                                            dispatch(
                                                deleteCIInsightInternal({
                                                    id,
                                                    isSub: true,
                                                    insight_id,
                                                })
                                            );
                                        }}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button danger className="marginL8">
                                            Delete Insight
                                        </Button>
                                    </Popconfirm>
                                </div>
                            </div>
                        );
                    })}
                </Panel>
            </Collapse>
        </Col>
    );
};

export default CIFiltersHome;
