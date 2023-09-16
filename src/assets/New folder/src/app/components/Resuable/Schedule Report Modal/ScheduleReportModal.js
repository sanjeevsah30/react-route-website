import {
    createScheduleReport,
    getAllReports,
    updateScheduleReport,
} from "@store/scheduledReports/scheduledReports";
import { Button, Drawer, Radio, Select, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CloseSvg from "app/static/svg/CloseSvg";
import { flattenTeams } from "@tools/helpers";
import { CustomMultipleSelect, CustomSelect } from "../index";
import "./style.scss";
import { MeetingTypeConst } from "@container/Home/Home";
import { openNotification } from "@store/common/actions";
import CustomTreeMultipleSelect from "../Select/CustomTreeMultipleSelect";

function ScheduleReportModal({
    showScheduleModal,
    setShowScheduelModal,
    state = {},
}) {
    const {
        common: { teams, users, versionData },
        dashboard: {
            templates_data: { templates },
        },
        scheduled_reports: { updating_report, all_reports },
    } = useSelector((state) => state);
    const dispatch = useDispatch();

    const dateRangeOptions = {
        daily: [
            { value: "yesterday", label: "Yesterday" },
            { value: "last_7_days", label: "Last 7 Days (Rolling)" },
            { value: "last_15_days", label: "Last 14 Days (Rolling)" },
            { value: "last_30_days", label: "Last 30 Days (Rolling)" },
            { value: "week_to_date", label: "Week to Date" },
            { value: "month_to_date", label: "Month to Date" },
        ],
        weekly: [
            { value: "last_7_days", label: "Last 7 Days (Rolling)" },
            { value: "last_15_days", label: "Last 14 Days (Rolling)" },
            { value: "last_30_days", label: "Last 30 Days (Rolling)" },
            { value: "week_to_date", label: "Week to Date" },
            { value: "month_to_date", label: "Month to Date" },
        ],
        monthly: [
            { value: "last_30_days", label: "Last 30 Days (Rolling)" },
            { value: "month_to_date", label: "Month to Date" },
        ],
    };

    const [userIds, setUserIds] = useState(state.userIds || []);
    const [type, setType] = useState(state.type || null);
    const [interval, setInterval] = useState(state.intervals || []);
    const [teamIds, setTeamIds] = useState(state.teamIds || []);
    const [isManual, setIsManual] = useState(state.is_manual || false);
    const [templateIds, setTemplateIds] = useState(state.templateIds || []);
    const [dateRange, setDateRange] = useState(state.data_range || null);
    const [meetingType, setMeetingType] = useState(
        !versionData.has_chat
            ? "call"
            : state.meeting_type
            ? state.meeting_type
            : null
    );
    const [isMultipleInterval, setIsMultipleInterval] = useState(false);

    const resetStates = () => {
        setUserIds([]);
        setIsManual(false);
        setTeamIds([]);
        setTemplateIds([]);
        setType(null);
        setInterval([]);
        setDateRange(null);
        setMeetingType(null);
    };

    useEffect(() => {
        dispatch(getAllReports());
    }, []);

    useEffect(() => {
        if (showScheduleModal) {
            state.type && setType(state.type);
            state.id && interval?.length > 1 && setIsMultipleInterval(true);
            state.id &&
                state.intervals?.length === 1 &&
                !state.data_range &&
                setDateRange(dateRangeOptions[state.intervals?.[0]]?.[0].value);
        }
    }, [showScheduleModal]);

    useEffect(() => {
        return () => {
            resetStates();
        };
    }, []);

    const handleCreate = () => {
        let payload = {
            type,
            owners: userIds,
            intervals: [...interval],
            extra_options: {
                meeting_type: meetingType,
                team: teamIds,
                template: templateIds,
                is_manual: isManual,
                data_range: dateRange,
            },
        };

        dispatch(createScheduleReport(payload))
            .then((res) => {
                resetStates();
                setShowScheduelModal(false);
            })
            .catch((err) => {});
    };

    const handleUpdate = () => {
        let payload = {
            type,
            owners: userIds,
            intervals: [...interval],
            extra_options: {
                meeting_type: meetingType,
                team: teamIds,
                template: templateIds,
                is_manual: isManual,
                data_range: dateRange,
            },
        };
        if (!isMultipleInterval) {
            payload = {
                ...payload,
                extra_options: {
                    ...payload.extra_options,
                    data_range: dateRange,
                },
            };
        }
        dispatch(
            updateScheduleReport({
                id: state.id,
                data: payload,
            })
        )
            .then((res) => {
                resetStates();
                setShowScheduelModal(false);
            })
            .catch((err) => {});
    };

    return (
        <Drawer
            title="Schedule Automatic Report"
            visible={showScheduleModal}
            onClose={() => setShowScheduelModal(false)}
            closeIcon={<CloseSvg />}
            width={624}
            footer={
                <>
                    <Button
                        type="primary"
                        className="capitalize"
                        onClick={() => {
                            if (!interval)
                                return openNotification(
                                    "error",
                                    "Error",
                                    "Select a valid frequency"
                                );
                            if (!isMultipleInterval && !dateRange)
                                return openNotification(
                                    "error",
                                    "Error",
                                    "Select a valid date range"
                                );
                            state.id ? handleUpdate() : handleCreate();
                        }}
                        loading={updating_report}
                    >
                        {!state.id ? "Schedule Now" : "Update Now"}
                    </Button>
                </>
            }
            destroyOnClose={true}
            className="report_drawer"
        >
            <div className="report__selector--container">
                <div className="flex1">
                    <div className="bold600 font16 marginB14">
                        Type of Report
                    </div>
                    <CustomSelect
                        data={all_reports?.data}
                        option_key={"type"}
                        option_name={"name"}
                        select_placeholder={"Type of Report"}
                        placeholder={"Select a report"}
                        style={{
                            width: "100%",
                            height: "36px",
                        }}
                        value={type}
                        onChange={(value) => {
                            setInterval([]);
                            setType(value);
                        }}
                        loading={all_reports?.loading}
                        className="report__selector--select"
                        disabled={isMultipleInterval}
                    />
                </div>
                {isMultipleInterval ? (
                    <div className="flex1">
                        <div className="mine_shaft_cl marginB14">Frequency</div>
                        <CustomMultipleSelect
                            data={all_reports.data
                                ?.find((data) => data.type === type)
                                ?.interval?.map((interval) => {
                                    return {
                                        id: interval,
                                        name: interval,
                                    };
                                })}
                            className=" multiple__select"
                            option_name="name"
                            select_placeholder={"Select duration"}
                            placeholder={"Select duration"}
                            style={{
                                width: "100%",
                                height: "auto",
                                padding: "0",
                            }}
                            value={interval}
                            onChange={(value) => {}}
                            disabled={true}
                            filter_type="frequency_filter"
                        />
                    </div>
                ) : (
                    <div className="flex1">
                        <div className="bold600 font16 marginB14">
                            Frequency
                        </div>
                        <Select
                            options={all_reports.data
                                ?.find((data) => data.type === type)
                                ?.interval?.map((interval) => {
                                    return {
                                        value: interval,
                                        label:
                                            interval.charAt(0).toUpperCase() +
                                            interval.slice(1),
                                    };
                                })}
                            className="report__selector--select"
                            placeholder={"Select Frequency of the Report"}
                            style={{
                                width: "100%",
                                height: "auto",
                                padding: "0",
                            }}
                            value={interval}
                            onChange={(value) => {
                                setInterval([value]);
                                if (!isMultipleInterval) {
                                    setDateRange(
                                        value
                                            ? dateRangeOptions[value]?.[0].value
                                            : null
                                    );
                                }
                            }}
                            allowClear
                        />
                    </div>
                )}
            </div>
            <div className="report__selector--container">
                <div className="flex1">
                    <div className="bold600 font16 marginB14">Date Range</div>
                    <Select
                        options={dateRangeOptions[interval] || []}
                        placeholder={"Select Date Range"}
                        style={{
                            width: "100%",
                            height: "36px",
                        }}
                        value={dateRange}
                        onChange={(value) => {
                            setDateRange(value);
                        }}
                        className="report__selector--select"
                        disabled={!interval || isMultipleInterval}
                    />
                </div>
                {versionData?.has_chat && (
                    <div className="flex1">
                        <div className="bold600 font16 marginB14">
                            Meeting Type
                        </div>
                        <Select
                            options={[
                                {
                                    value: MeetingTypeConst.calls,
                                    label: "Call",
                                },
                                { value: MeetingTypeConst.chat, label: "Chat" },
                                {
                                    value: MeetingTypeConst.email,
                                    label: "Email",
                                },
                            ]}
                            className="report__selector--select"
                            placeholder={"Select Meeting Type"}
                            style={{
                                width: "100%",
                                height: "auto",
                                padding: "0",
                            }}
                            value={meetingType}
                            onChange={(value) => setMeetingType(value)}
                            allowClear
                        />
                    </div>
                )}
            </div>
            <div className="report__selector--container">
                <div className="flex1">
                    <div className="bold600 font16 marginB14">Template</div>
                    <CustomMultipleSelect
                        data={templates}
                        value={templateIds}
                        onChange={(templateIds) => setTemplateIds(templateIds)}
                        placeholder={"Select a template"}
                        select_placeholder={"Select a template"}
                        style={{
                            width: "100%",
                            height: "auto",
                            padding: "0",
                        }}
                        className=" multiple__select report__selector--select"
                        type={""}
                        option_name="name"
                        filter_type="template_filter"
                    />
                </div>
            </div>
            <div className="report__selector--container">
                <div className="flex1">
                    <div className="bold600 font16 marginB14">Teams</div>
                    <CustomTreeMultipleSelect
                        data={teams}
                        value={teamIds}
                        onChange={(values) => {
                            setTeamIds([...values]);
                        }}
                        placeholder="Select Teams"
                        select_placeholder="Select Teams"
                        style={{
                            width: "100%",

                            height: "auto",
                            padding: "0",
                        }}
                        className=" multiple__select"
                        fieldNames={{
                            label: "name",
                            value: "id",
                            children: "subteams",
                        }}
                        option_name="name"
                        type="team"
                        treeNodeFilterProp="name"
                    />
                </div>
            </div>

            <div className="audit_type_container paddingTB16 paddingLR8 marginB14">
                <div className="bold600 font16 marginB14">Audit Type</div>
                <Radio.Group
                    onChange={(event) => {
                        setIsManual(event.target.value);
                    }}
                    value={isManual}
                >
                    <Radio value={true}>Manual</Radio>
                    <Radio value={false}>AI</Radio>
                </Radio.Group>
            </div>
            <div className="paddingLR8 paddingT8">
                <div className="bold600 font16 marginB14">
                    Select Recipients
                </div>
                <CustomMultipleSelect
                    data={[{ first_name: "All Users", id: "0" }, ...users]}
                    value={userIds}
                    onChange={(userIds) => {
                        if (userIds.includes("0")) {
                            setUserIds(users.map((user) => String(user.id)));
                        } else {
                            setUserIds(userIds);
                        }
                    }}
                    placeholder={"Select Recipients"}
                    select_placeholder={"Select Recipients"}
                    style={{
                        width: "100%",
                        height: "auto",
                        padding: "0",
                    }}
                    className=" multiple__select report__selector--select"
                    type={"user"}
                    filter_type="email_filter"
                    allowClear
                />
            </div>
        </Drawer>
    );
}

export default ScheduleReportModal;
