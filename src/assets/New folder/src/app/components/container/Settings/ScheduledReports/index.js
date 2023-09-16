import InfiniteLoader from "@presentational/reusables/InfiniteLoader";
import Spinner from "@presentational/reusables/Spinner";
import {
    deleteScheduleReport,
    getDefaultReports,
    getScheduledReports,
} from "@store/scheduledReports/scheduledReports";
import { Button, Popconfirm, Tooltip } from "antd";
import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScheduleReportModal from "app/components/Resuable/Schedule Report Modal/ScheduleReportModal";
import DeleteSvg from "app/static/svg/DeleteSvg";
import EditCommentSvg from "app/static/svg/EditCommentSvg";
import NoReportSvg from "app/static/svg/NoReportSvg";
import "./styles.scss";

const layoutClasses = {
    reportName: "col-7",
    template: "col-5",
    date: "col-3",
    duration: "col-3",
    time: "col-3",
    users: "col-2",
    actions: "col-3",
};
export default function ScheduledReports() {
    const {
        reports: { loading, data },
    } = useSelector((state) => state.scheduled_reports);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getScheduledReports());
        dispatch(getDefaultReports());
    }, []);

    const [reportToEdit, setReportToEdit] = useState(undefined);
    const [showScheduleModal, setShowScheduelModal] = useState(false);

    useEffect(() => {
        if (!showScheduleModal && setReportToEdit) setReportToEdit(undefined);
    }, [showScheduleModal]);

    const onLoadMore = () => {
        dispatch(getScheduledReports(data.next));
    };

    const deleteReport = (payload) => {
        dispatch(deleteScheduleReport(payload));
    };

    return (
        <div className="height100p flex column">
            {loading ? (
                <div className="loadingDiv">
                    <Spinner />
                </div>
            ) : data?.results?.length ? (
                <>
                    <div className="app_scheduled--header flexShrink marginT16">
                        <div className="font20 lineHeightN bold600">
                            Scheduled Reports
                        </div>
                    </div>
                    <div className="app__scheduled--table flex1 flex column">
                        <div className="app__scheduled--tableLabels marginB20 row flexShrink">
                            <div
                                className={`app__scheduled--tableLabel ${layoutClasses.reportName}`}
                            >
                                Report Name
                            </div>
                            <div
                                className={`app__scheduled--tableLabel ${layoutClasses.template}`}
                            >
                                Template
                            </div>
                            <div
                                className={`app__scheduled--tableLabel ${layoutClasses.date}`}
                            >
                                Team
                            </div>

                            <div
                                className={`app__scheduled--tableLabel ${layoutClasses.time}`}
                            >
                                Frequency
                            </div>
                            <div
                                className={`app__scheduled--tableLabel ${layoutClasses.users}`}
                            >
                                Users
                            </div>
                            <div
                                className={`app__scheduled--tableLabel ${layoutClasses.actions}`}
                            >
                                Actions
                            </div>
                        </div>
                        <div className={` flex1 ${loading ? "loading" : ""}`}>
                            <Spinner loading={loading}>
                                <InfiniteLoader
                                    Component={ReportCard}
                                    data={data.results || []}
                                    onLoadMore={onLoadMore}
                                    style={{
                                        height: "auto",
                                        maxHeight: "100%",
                                        overflowY: "scroll",
                                        boxShadow: "0px 4px 20px 0px #3333331a",
                                        background: "white",
                                        borderRadius: "6px",
                                    }}
                                    hasNextPage={data.next}
                                    deleteReport={deleteReport}
                                    setReportToEdit={setReportToEdit}
                                    setShowScheduelModal={setShowScheduelModal}
                                />
                                {/* {data?.results?.map((item) => (
                            <ReportCard
                                item={item}
                                key={item.id}
                                setReportToEdit={setReportToEdit}
                                setShowScheduelModal={setShowScheduelModal}
                                deleteReport={deleteReport}
                            />
                        ))} */}
                            </Spinner>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex alignCenter justifyCenter height100p">
                    <div className="flex column alignCenter">
                        <NoReportSvg />
                        <div className="bold700 mine_shaft_cl font18 marginB20">
                            No scheduled Reports Found
                        </div>
                        <Button
                            onClick={() => setShowScheduelModal(true)}
                            className="borderRadius6"
                            type="primary"
                        >
                            Create Report
                        </Button>
                    </div>
                </div>
            )}
            {showScheduleModal && (
                <ScheduleReportModal
                    setShowScheduelModal={setShowScheduelModal}
                    showScheduleModal={showScheduleModal}
                    state={reportToEdit}
                />
            )}
        </div>
    );
}

const ReportCard = ({
    data: item = {},
    setShowScheduelModal,
    setReportToEdit,
    deleteReport,
}) => {
    return (
        <div className="app__invoices--tableCardItem row" key={item?.id}>
            <div
                className={`font16 bold600 margin0 lineHeightN ${layoutClasses.reportName}`}
            >
                {item?.name || item?.event_name}
            </div>
            <div
                className={`font14 margin0 lineHeightN dove_gray_cl ${layoutClasses.template}`}
            >
                <MoreData
                    data={item?.templates?.map((template) => template.name)}
                />
            </div>
            <div
                className={`font14 margin0 lineHeightN dove_gray_cl ${layoutClasses.date}`}
            >
                <MoreData data={item?.teams?.map((team) => team.name)} />
            </div>
            <div
                className={`font14 margin0 lineHeightN dove_gray_cl ${layoutClasses.duration}`}
            >
                <MoreData data={item.intervals} />
            </div>
            {/* <div
            className={`font14 margin0 lineHeightN dove_gray_cl ${layoutClasses.time}`}
        >
            {item?.time}
        </div> */}
            <div
                className={`font14 margin0 lineHeightN dove_gray_cl ${layoutClasses.users}`}
            >
                <Tooltip
                    destroyTooltipOnHide
                    title={<TooltipContent users={item?.owners} />}
                >
                    {item?.owners?.length}
                </Tooltip>
            </div>
            <div
                className={`font14 margin0 lineHeightN dove_gray_cl ${layoutClasses.users}`}
            >
                <button
                    className="app__scheduled--btn"
                    onClick={() => {
                        setShowScheduelModal(true);
                        setReportToEdit({
                            id: item.id,
                            userIds: item.owners.map((item) => String(item.id)),
                            templateIds: item.templates.map((item) =>
                                String(item.id)
                            ),
                            teamIds: item.teams.map((item) => item.id),
                            intervals: item.intervals.map((item) => item),
                            type: item.event_type,
                            meeting_type: item.meeting_type,
                            data_range: item.data_range,
                            is_manual: item.is_manual,
                        });
                    }}
                >
                    <EditCommentSvg />
                </button>

                <Popconfirm
                    title="Are you sure to delete this report?"
                    onConfirm={(e) => {
                        e.stopPropagation();
                        deleteReport({
                            id: item.id,
                            payload: item,
                        });
                    }}
                    onCancel={(e) => e.stopPropagation()}
                    okText="Yes"
                    cancelText="No"
                >
                    <button className="app__scheduled--btn">
                        <DeleteSvg />
                    </button>
                </Popconfirm>
            </div>
        </div>
    );
};

const MoreData = memo(function ({ data = [] }) {
    const MAX_SHOWN = 1;
    const getSharedString = (users) => {
        return data
            .slice(MAX_SHOWN)
            .map((data) => data)
            .join(", ");
    };
    return (
        <>
            {!!data.length && (
                <div className="">
                    {data.length > MAX_SHOWN ? (
                        <>
                            <Tooltip
                                destroyTooltipOnHide={{
                                    keepParent: false,
                                }}
                                placement="topLeft"
                                title={() => getSharedString(data)}
                            >
                                {data.slice(0, MAX_SHOWN).map((item, idx) => (
                                    <span className="marginR3" key={idx}>
                                        {item}
                                    </span>
                                ))}
                                , +{data.length - MAX_SHOWN}
                            </Tooltip>
                        </>
                    ) : (
                        data.map((item, idx) => <span key={idx}>{item}</span>)
                    )}
                </div>
            )}
        </>
    );
});

const TooltipContent = ({ users }) => {
    if (!users.length) {
        return null;
    } else {
        return (
            <ul className="app__scheduled--users">
                {users.map((item) => (
                    <li
                        className="app__scheduled--usersName"
                        key={`app__scheduledUser${item.first_name}`}
                    >
                        {item.first_name}
                    </li>
                ))}
            </ul>
        );
    }
};
