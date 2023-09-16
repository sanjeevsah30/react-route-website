import React, { useEffect, useState } from "react";
import "./style.scss";
import { Table, Select, Button } from "antd";
import {
    CheckCircleFilled,
    CloseCircleFilled,
    ReloadOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { getAuditTemplateRequestForFilterSettings } from "@store/call_audit/actions";
import {
    downloadReport,
    fetchCalibration,
    reCalibration,
    singleCalibration,
} from "@apis/call_audit/index";
import Spinner from "@presentational/reusables/Spinner";
import apiErrors from "@apis/common/errors";
import { openNotification } from "@store/common/actions";
import DownloadCloudIcon from "app/static/svg/DownloadCloudIcon";

const { Option } = Select;

const AuditCalibration = () => {
    const dispatch = useDispatch();
    const domain = useSelector((state) => state.common.domain);

    const {
        filtersSettings: { categories },
    } = useSelector((state) => state.callAudit);
    const [questions, setQuestions] = useState([]);
    const filterId = window.location.href.split("/")[6];
    useEffect(() => {
        dispatch(getAuditTemplateRequestForFilterSettings(filterId));
    }, [filterId]);

    useEffect(() => {
        //set questions
        if (categories.length > 0) {
            categories.map((category) => {
                category.questions.map((question) => {
                    setQuestions((prev) => [...prev, question]);
                });
                // setting question id on initial page load to first question id
            });
        }
    }, [categories]);

    // question id
    const [questionId, setQuestionId] = useState(null);
    const [calibrationId, setCalibrationId] = useState(1);
    const [loading, setLoading] = useState(false);
    const [reCalibrate, setReCalibrate] = useState(false);

    const handleChange = (id) => {
        setQuestionId(id);
        setLoading(true);
    };

    // setting calls
    const [data, setData] = useState({});

    const getCalibrationData = () => {
        fetchCalibration(domain, calibrationId, questionId).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
                setLoading(false);
            } else {
                if (res) {
                    setData(res);
                    setLoading(false);
                }
            }
        });
    };
    useEffect(() => {
        if (questionId) getCalibrationData();
    }, [questionId]);

    // set pagination number from localStorage on page load
    const [pagination, setPagination] = useState({});
    useEffect(() => {
        const pagination = JSON.parse(localStorage.getItem("table_page"));
        setPagination(pagination);
    });

    useEffect(() => {
        let cid = window.location.href.split("/").slice(-1);
        setCalibrationId(+cid);
    }, [calibrationId]);

    useEffect(() => {
        if (questions.length) {
            handleChange(questions[0]?.id);
        }
    }, [questions]);

    const columns = [
        {
            title: "Call ID",
            dataIndex: "callid",
            render: (callid) => {
                // map data.report and get link of call
                const temp = data?.report?.find((x) => callid === x?.callid);
                return (
                    <a
                        style={{
                            color: "#437FF4",
                            textDecoration: "underline",
                        }}
                        target="_blank"
                        href={temp?.call_link}
                    >
                        {callid}
                    </a>
                );
            },
        },
        {
            title: "CALL Score",
            dataIndex: "ai_score",
        },
        {
            title: "Manual Score",
            dataIndex: "manual_score",
        },
        {
            title: "Matching",
            dataIndex: "matching",

            render: (val) => {
                return val ? (
                    <CheckCircleFilled
                        style={{ fontSize: 20, color: "green" }}
                    />
                ) : (
                    <CloseCircleFilled style={{ fontSize: 20, color: "red" }} />
                );
            },
        },
        {
            title: "Refresh",
            dataIndex: "refresh",
        },
    ];

    // single recalibrate function
    const singleReCalibrate = (callid) => {
        setReCalibrate(true);
        singleCalibration(domain, callid).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
                setReCalibrate(false);
            } else {
                if (res.status === "success") {
                    openNotification(
                        "success",
                        "Success",
                        "Recalibration Request Successfull"
                    );
                    setReCalibrate(false);
                    getCalibrationData();
                }
            }
        });
    };

    const [singleCallId, setSingleCallId] = useState("");

    if (data) {
        data?.report?.length > 0 &&
            data?.report?.map((el) => {
                el.refresh = (
                    <Button
                        type="primary"
                        onClick={() => {
                            singleReCalibrate(el.callid);
                            setSingleCallId(el.callid);
                        }}
                    >
                        <ReloadOutlined />
                    </Button>
                );
            });
    }

    return (
        <div className="audit_calibration">
            <div className="audit_calibration_header">
                <h1>Calibration Report</h1>
                <Button type="primary">
                    <a
                        href={reCalibration(domain, calibrationId)}
                        target="_blank"
                    >
                        <ReloadOutlined />
                    </a>
                </Button>
                <Button type="primary">
                    <a
                        href={downloadReport(domain, calibrationId)}
                        target="_blank"
                    >
                        <DownloadCloudIcon />
                    </a>
                </Button>
            </div>
            {questions.length > 0 ? (
                <div className="grid">
                    <div className="grid_left">
                        <div className="grid_left_top">
                            <p>Question:</p>
                        </div>
                        <div className="question">
                            <Select
                                style={{ width: "100%" }}
                                onChange={handleChange}
                                placeholder="Select a question"
                                className="capitalize"
                                value={questionId}
                            >
                                {questions?.map((question) => (
                                    <Option
                                        value={question?.id}
                                        className="capitalize"
                                    >
                                        {question?.question_text}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        <div className="other_details">
                            {loading ? (
                                <Spinner />
                            ) : (
                                <>
                                    <p>
                                        Total:{" "}
                                        <span>
                                            {data?.total ? data?.total : "n.a"}
                                        </span>
                                    </p>
                                    <p>
                                        Matching:{" "}
                                        <span>
                                            {data?.matching
                                                ? data?.matching
                                                : "n.a"}
                                        </span>
                                    </p>
                                    <p>
                                        Percentage:{" "}
                                        <span>
                                            {data?.percent
                                                ? Math.floor(data?.percent)
                                                : "n.a"}
                                        </span>
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="grid_right">
                        {loading ? (
                            <Spinner />
                        ) : data?.report?.length > 0 ? (
                            <Table
                                dataSource={data?.report}
                                columns={columns}
                                loading={reCalibrate}
                                pagination={pagination}
                                onChange={
                                    // set page number to localStorage
                                    (pagination) => {
                                        localStorage.setItem(
                                            "table_page",
                                            pagination.current
                                        );
                                    }
                                }
                            />
                        ) : (
                            <p>No Data Avaialable</p>
                        )}
                    </div>
                </div>
            ) : (
                <Spinner />
            )}
        </div>
    );
};

export default AuditCalibration;
