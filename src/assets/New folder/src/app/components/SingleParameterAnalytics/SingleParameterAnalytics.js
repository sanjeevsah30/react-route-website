import React, { useContext, useEffect, useState } from "react";
import { Select } from "antd";
import { DownOutlined } from "@ant-design/icons";
// import LineGraph from '../AnalyticsDashboard/Components/LineGraph';

import LineGraph from "../AnalyticsDashboard/Components/LineGraph";
import EmptyDataState from "../AnalyticsDashboard/Components/EmptyDataState";
import useGetDashboardPayload from "../AnalyticsDashboard/Hooks/useGetDashboardPayload";

import Spinner from "@presentational/reusables/Spinner";
import { useDispatch, useSelector } from "react-redux";
import Icon from "@presentational/reusables/Icon";

import "./singleParameterAnalytics.scss";
import { HomeDashboardContext } from "../AnalyticsDashboard/Context/HomeDashboardContext";
import dashboardConfig from "app/constants/Dashboard";
import {
    getDashboardParameters,
    getParameterTrendData,
} from "@store/dashboard/dashboard";

const { Option } = Select;

const getFrequency = (value) => {
    return value.toUpperCase() === "DEFAULT"
        ? ""
        : value.toUpperCase() === "DAILY"
        ? "1D"
        : value.toUpperCase() === "WEEKLY"
        ? "1W"
        : value.toUpperCase() === "MONTHLY"
        ? "1M"
        : "";
};

const SingleParameterAnalytics = ({ parameterGraph, setIsParametergraph }) => {
    const dispatch = useDispatch();
    const { filtersVisible } = useContext(HomeDashboardContext);
    const { getDashboardPayload } = useGetDashboardPayload();
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [freq, setFreq] = useState("Default");
    const { colors } = dashboardConfig;

    const [question, setQuestion] = useState(null);

    const {
        common: { teams },
        dashboard: {
            callAuditOverallDetails: { result: call_results },
            loaders,
            templates_data: { template_active },
            parameter_data: { parameter_trend_graph },
            parameters,
        },
    } = useSelector((state) => state);

    const filterParameters = parameters?.data?.filter((item1) =>
        call_results?.some((item2) => item1?.id === item2?.id)
    );
    console.log(question?.id, filterParameters);
    const ParameterSelect = () => {
        return (
            <Select
                className="custom__select"
                value={question?.id}
                onChange={(val) => {
                    setQuestion(
                        parameters?.data?.find((q) => q?.id === val) || null
                    );
                }}
                dropdownRender={(menu) => (
                    <div>
                        <span className={"topbar-label"}>Select Parameter</span>
                        {menu}
                    </div>
                )}
                placeholder={"Select Parameter"}
                suffixIcon={
                    <Icon className="fas fa-chevron-down dove_gray_cl" />
                }
                style={{
                    height: "36px",
                    width: "192px",
                }}
                dropdownClassName={
                    "account_select_dropdown parameter_select_dropdown"
                }
                optionFilterProp="children"
                showSearch
            >
                {filterParameters?.map((item) => (
                    <Option value={item?.id} key={item?.id}>
                        {item?.question_text}
                    </Option>
                ))}
            </Select>
        );
    };

    useEffect(() => {
        if (filtersVisible) {
            return;
        }
        if (template_active === undefined || !teams?.length) return;
        let api12, api21;
        const payload = getDashboardPayload();

        if (template_active)
            api12 = dispatch(getDashboardParameters(template_active));
        const freq_value = getFrequency(freq);
        if (question?.id) {
            api21 = dispatch(
                getParameterTrendData({
                    ...payload,
                    ...(freq_value && {
                        freq: freq_value,
                    }),
                    question_id: question?.id,
                })
            );
        }
        return () => {
            api12?.abort();
            api21?.abort();
        };
    }, [getDashboardPayload, template_active, teams]);

    useEffect(() => {
        let api;
        if (question?.id) {
            const payload = getDashboardPayload();
            const freq_value = getFrequency(freq);
            api = dispatch(
                getParameterTrendData({
                    ...payload,
                    ...(freq_value && {
                        freq: freq_value,
                    }),
                    question_id: question?.id,
                })
            );
        }

        return () => {
            api?.abort();
        };
    }, [question?.id, freq]);

    useEffect(() => {
        if (template_active !== undefined && question?.id) {
            setQuestion(null);
        }
    }, [template_active]);

    /* If parameters changes and default question is not set in 
the parameter analysis sections third card then set the parameter
 to the first parameter in the parameters data array */
    useEffect(() => {
        if (parameters?.data?.length && !question?.id) {
            setQuestion(filterParameters[0]);
        }
    }, [parameters, filterParameters]);

    useEffect(() => {
        if (!question) return;
        if (question?.question_type === "yes_no") setSelectedResponse(1);
        if (question?.question_type === "custom")
            setSelectedResponse(question?.settings?.custom?.[0]?.id || -1);
        if (question.question_type === "rating") setSelectedResponse(10);
    }, [question]);

    const getData = () => {
        return (
            parameter_trend_graph?.find((e) => e.option_id === selectedResponse)
                ?.graph_data || []
        );
    };

    return (
        <Spinner loading={loaders?.parameter_trend_loading}>
            <div
                className="parameterGraphBox flex column"
                style={{ height: "400px" }}
            >
                {filterParameters?.length ? (
                    <>
                        <div
                            className="flex justifyEnd"
                            style={{
                                gap: "10px",
                            }}
                        >
                            <ParameterSelect />
                            <Select
                                placeholder="Select Response"
                                className="custom__select"
                                onChange={(value) => setSelectedResponse(value)}
                                disabled={loaders.parameter_trend_loading}
                                value={selectedResponse}
                            >
                                {question?.question_type === "custom" ? (
                                    <>
                                        {question.settings?.custom?.map((e) => {
                                            return (
                                                <Option key={e.id} value={e.id}>
                                                    {e.name}
                                                </Option>
                                            );
                                        })}
                                    </>
                                ) : question?.question_type === "rating" ? (
                                    <>
                                        {new Array(11)
                                            ?.fill(0)
                                            ?.map((e, idx) => {
                                                return (
                                                    <Option
                                                        key={idx}
                                                        value={idx}
                                                    >
                                                        {idx}
                                                    </Option>
                                                );
                                            })}
                                        <Option value={-1}>Na</Option>
                                    </>
                                ) : question?.question_type === "yes_no" ? (
                                    <>
                                        <Option value={1}>Yes</Option>{" "}
                                        <Option value={0}>No</Option>{" "}
                                        <Option value={-1}>Na</Option>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </Select>
                            <Select
                                defaultValue="Default"
                                className="custom__select"
                                suffixIcon={
                                    <Icon className="fas fa-chevron-down dove_gray_cl" />
                                }
                                dropdownRender={(menu) => (
                                    <div className="mine_shaft_cl">{menu}</div>
                                )}
                                dropdownClassName="freq_dropdown"
                                // dropdownStyle={{display: "none"}}
                                onChange={(value) => setFreq(value)}
                            >
                                <Option
                                    value="default"
                                    className="option__container bold400 font12"
                                >
                                    {" "}
                                    Default{" "}
                                </Option>
                                <Option
                                    value="daily"
                                    className="option__container bold400 font12"
                                >
                                    {" "}
                                    Daily{" "}
                                </Option>
                                <Option
                                    value="weekly"
                                    className="option__container bold400 font12"
                                >
                                    {" "}
                                    Weekly{" "}
                                </Option>
                                <Option
                                    value="monthly"
                                    className="option__container bold400 font12"
                                >
                                    {" "}
                                    Monthly{" "}
                                </Option>
                            </Select>
                        </div>

                        {question?.id && selectedResponse !== null && (
                            <div ref={parameterGraph} className="flex-1">
                                {getData()?.length ? (
                                    <LineGraph
                                        data={getData()}
                                        generate_color={false}
                                        type={true}
                                    />
                                ) : (
                                    <div className="flex justifyCenter alignCenter height100p">
                                        <EmptyDataState />
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="flex justifyCenter alignCenter flex-1">
                            <EmptyDataState />
                        </div>
                    </>
                )}
            </div>
        </Spinner>
    );
};

export default SingleParameterAnalytics;
