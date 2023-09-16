import Icon from "@presentational/reusables/Icon";
import { getSearchAuditTemplateRequest } from "@store/call_audit/actions";
import { setActiveTemplateForFilters } from "@store/common/actions";
import {
    getInternalCochingThread,
    getTreaad,
} from "@store/internalCoachingSlice/internalCoachingSlice";
import { flattenTeams } from "@tools/helpers";
import { Button, Modal, Select, Input } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { CustomMultipleSelect } from "app/components/Resuable/index";

const { Option } = Select;

export default function InternalCoaching() {
    const dispatch = useDispatch();
    const teams = useSelector((state) => state.common.filterTeams.teams);
    const [cmdVisible, setCmdVisible] = useState(false);
    const [statusVisible, setStatusVisible] = useState(false);
    const [type, setType] = useState("");
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [st, setSt] = useState("");
    const [et, setEt] = useState("");
    const [id, setId] = useState("");
    const [inputId, setInputId] = useState("");
    const [status, setStatus] = useState("");

    const reset = () => {
        setSt("");
        setEt("");
        setType(null);
        setSelectedTeams([]);
        setId("");
    };

    const getPayload = () => {
        return {
            start_time: st,
            end_time: et,
            type: type,
            teams: selectedTeams,
        };
    };

    const {
        search: { searchFilters },
    } = useSelector((state) => state);

    const { thread, thread_status, loading } = useSelector(
        (state) => state.internalCoachingSlice
    );

    const { templates, active: templateActive } = useSelector(
        (state) => state.common.filterAuditTemplates
    );

    useEffect(() => {
        setId(thread?.thread_id);
        setStatus(thread_status.status);
    }, [loading]);
    useEffect(() => {
        if (!templateActive && templates?.length) {
            dispatch(setActiveTemplateForFilters(templates[0]?.id));
        }
    }, [templates]);

    useEffect(() => {
        templateActive &&
            dispatch(getSearchAuditTemplateRequest(templateActive));
    }, [templateActive]);

    const history = useHistory();

    return (
        <>
            <div className="paddingLR16 marginT20">
                <div className="flex alignCenter justifySpaceBetween mine_shaft_cl bold700 marginB20">
                    <span>CHOOSE AN AUDIT TEMPLATE</span>
                    <div>
                        <Button
                            type="primary"
                            onClick={() => setStatusVisible(true)}
                            className="marginR10"
                        >
                            Check Status
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => setCmdVisible(true)}
                        >
                            Genarate Session/Clips
                        </Button>
                    </div>
                </div>

                <Select
                    value={templateActive}
                    onChange={(value) => {
                        dispatch(setActiveTemplateForFilters(value));
                    }}
                    style={{
                        width: "100%",
                    }}
                    dropdownRender={(menu) => (
                        <div>
                            <span className={"topbar-label"}>
                                {"Choose an audit template"}
                            </span>
                            {menu}
                        </div>
                    )}
                    optionFilterProp="children"
                    className={"custom__select filter__select"}
                    suffixIcon={
                        <Icon className="fas fa-chevron-down dove_gray_cl" />
                    }
                    dropdownClassName={"account_select_dropdown"}
                >
                    {templates.map(({ id, name }, idx) => (
                        <Option value={id} key={idx}>
                            {name}
                        </Option>
                    ))}
                </Select>

                {!!templateActive && (
                    <>
                        <div>
                            {searchFilters?.auditQuestions
                                ?.filter((_, idx) => idx !== 0)
                                .map((data, idx) => {
                                    const {
                                        id,
                                        question_text,
                                        question_type,
                                        settings,
                                    } = data;
                                    return (
                                        <div
                                            key={id}
                                            className={`paddingT22 paddingB20 ${
                                                searchFilters?.auditQuestions
                                                    .length -
                                                    1 ===
                                                idx
                                                    ? ""
                                                    : "borderBottom"
                                            }`}
                                        >
                                            <div className="flex alignStart bold600 mine_shaft_cl">
                                                <div className="marginR16">
                                                    {idx < 9
                                                        ? `0${idx + 1}`
                                                        : idx + 1}
                                                    .
                                                </div>
                                                <div className="flex1 flex row justifySpaceBetween">
                                                    <div
                                                        style={{
                                                            borderLeft:
                                                                "1px solid #99999933",
                                                        }}
                                                        className="paddingL8"
                                                    >
                                                        {question_text}
                                                    </div>
                                                    <Button
                                                        type="primary"
                                                        onClick={() =>
                                                            history.push({
                                                                pathname: `coaching/${id}`,
                                                                question_text,
                                                            })
                                                        }
                                                    >
                                                        View
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </>
                )}
            </div>
            <Modal
                title="Criteria commands"
                visible={cmdVisible}
                onCancel={() => {
                    setCmdVisible(false);
                    setId("");
                }}
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
                            if (st && et && type) {
                                !loading &&
                                    dispatch(
                                        getInternalCochingThread(getPayload())
                                    );
                            } else {
                                setShowAlert(true);
                                setTimeout(() => {
                                    setShowAlert(false);
                                }, 3000);
                            }
                        }}
                        key={"run_btn"}
                        disabled={showAlert}
                    >
                        {loading ? "...Running" : "Run"}
                    </Button>,
                ]}
            >
                <div
                    className="paddingLR16 flex alignCenter"
                    style={{ gap: 16 }}
                >
                    {/* <div className="font16 bold600">{api}</div> */}
                    <div style={{ width: "400px" }}>
                        <span>
                            {`Select type`}
                            <span style={{ color: "red" }}>*</span>
                        </span>
                        <Select
                            className="custom__select"
                            onChange={(val) => {
                                setType(val);
                            }}
                            value={type}
                            dropdownRender={(menu) => (
                                <div>
                                    <span className={"topbar-label"}>
                                        Select Type
                                    </span>
                                    {menu}
                                </div>
                            )}
                            placeholder={"Select Type"}
                            suffixIcon={
                                <Icon className="fas fa-chevron-down dove_gray_cl" />
                            }
                            style={{
                                height: "36px",
                            }}
                            dropdownClassName={"account_select_dropdown"}
                        >
                            <Option value={"session"}>Session</Option>
                            <Option value={"clips"}>Clips</Option>
                        </Select>
                    </div>
                    <div className="marginT" style={{ width: "400px" }}>
                        <span>{`Select team/teams`}</span>
                        <CustomMultipleSelect
                            data={teams}
                            value={selectedTeams.map((id) => `${id}`)}
                            onChange={(teamIds) => {
                                if (teamIds.includes("0")) {
                                    setSelectedTeams(
                                        flattenTeams(teams)
                                            .map((team) => `${team.id}`)
                                            .filter((id) => id !== "0")
                                    );
                                } else {
                                    setSelectedTeams(teamIds);
                                }
                            }}
                            placeholder="Select Teams"
                            select_placeholder="Select Teams"
                            style={{
                                width: "100%",

                                height: "auto",
                                padding: "0",
                            }}
                            className=" multiple__select"
                            option_name="name"
                            type="team"
                            filter_type="team_filter"
                            allowClear
                        />
                    </div>
                    <div className="flex alignCenter" style={{ gap: 16 }}>
                        <div>
                            <span style={{ color: "red" }}>*</span>
                            <Input
                                onChange={(e) => {
                                    setSt(e.target.value);
                                }}
                                // style={{
                                //     width: '50%',
                                // }}
                                value={st}
                                placeholder="Enter Start Time"
                            />
                        </div>
                        <div>
                            <span style={{ color: "red" }}>*</span>
                            <Input
                                onChange={(e) => {
                                    setEt(e.target.value);
                                }}
                                // style={{
                                //     width: '50%',
                                // }}
                                value={et}
                                placeholder="Enter End Time"
                            />
                        </div>
                    </div>
                </div>
                {showAlert && (
                    <div className="paddingLR16" style={{ color: "red" }}>
                        * fileds are mandatory
                    </div>
                )}
                {!!id && (
                    <div className="paddingLR16 bold600 dusty_gray_cl">{`Please Note Down the Thread Id to check Status: ''${thread?.thread_id}''`}</div>
                )}
            </Modal>
            <Modal
                title="Criteria commands"
                visible={statusVisible}
                onCancel={() => {
                    setStatusVisible(false);
                    setInputId("");
                    setStatus("");
                }}
                width={1000}
                className="commands_modal"
                footer={
                    <Button
                        onClick={() => {
                            dispatch(getTreaad({ thread_id: inputId }));
                        }}
                        type="primary"
                        key={"reset_btn"}
                    >
                        {loading ? "Fetching..." : "Get Status"}
                    </Button>
                }
            >
                <Input
                    onChange={(e) => {
                        setInputId(e.target.value);
                    }}
                    style={{ width: "50%" }}
                    value={inputId}
                    placeholder="Enter Thread Id"
                />
                {!!status && (
                    <span
                        className="primary_cl marginL15 bold600 paddingtB5 paddingLR10"
                        style={{ background: "rgba(153, 153, 153, 0.2)" }}
                    >
                        {status}
                    </span>
                )}
            </Modal>
        </>
    );
}
