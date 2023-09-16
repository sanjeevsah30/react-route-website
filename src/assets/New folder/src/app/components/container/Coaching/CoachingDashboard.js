import React, { useState, useEffect } from "react";
import apiConfigs from "../../../ApiUtils/common/commonApiConfig";
import { getAuthHeader, getError } from "../../../ApiUtils/common";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
    fetchCoaching,
    fetchCoachingSessionSuccess,
} from "../../../../store/coaching/action";
import Spinner from "@presentational/reusables/Spinner";
import axios from "axios";
import "./styles.scss";
import { Button, Modal, Select } from "antd";
import {
    ClockSvg,
    PendingSvg,
    NoReportSvg,
    ChevronRightSvg,
    RightSvg,
    FilterLinesSvg,
    CompleteTickSvg,
} from "app/static/svg/indexSvg";
import Icon from "@presentational/reusables/Icon";
import { months } from "../../../../tools/helpers";
import AssesmentModal from "./AssesmentModal";
import {
    getStatusAssesment,
    storeCoachingSessions,
} from "@store/coaching/coaching.store";

function CoachingDashboard({ coaching_sessions }) {
    const dispatch = useDispatch();

    return (
        <>
            {coaching_sessions ? (
                <div className="coaching_dashboard">
                    <div className="all_coaching_session_container overflowYscroll width100p">
                        {Object.keys(coaching_sessions).map((year) =>
                            Object.keys(coaching_sessions[year]).map(
                                (month, idx) => (
                                    <div
                                        className="monthly_session_container paddingT30 width100p"
                                        key={idx}
                                    >
                                        <div className="month_heading bold600  dove_gray_cl">
                                            <p className="head line font14">
                                                {`${month} ${year}`}
                                            </p>
                                        </div>
                                        <div className="card_container paddingT24 paddingB20 width100p">
                                            {coaching_sessions[year][month].map(
                                                (sCard, idx) =>
                                                    sCard?.is_standalone_assessment ? (
                                                        <StandaloneAssessment
                                                            data={sCard}
                                                            month={month}
                                                            key={idx}
                                                        />
                                                    ) : (
                                                        <Link
                                                            to={
                                                                "/home/coaching/" +
                                                                sCard.id
                                                            }
                                                            className="router_link"
                                                            key={idx}
                                                        >
                                                            {/* <SessionCard data={sCard}/> */}
                                                            <FinalSessionCard
                                                                data={sCard}
                                                                month={month}
                                                            />
                                                        </Link>
                                                    )
                                            )}
                                        </div>
                                    </div>
                                )
                            )
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex alignCenter justifyCenter">
                    <div className="flex column alignCenter">
                        <NoReportSvg />
                        <div className="bold700 mine_shaft_cl font18">
                            No Data!
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const StandaloneAssessment = ({ data, month }) => {
    const date = new Date(data.created_at);
    const formatedDate = `${
        date.getDate() < 9 ? `0${date.getDate()}` : date.getDate()
    }`;
    const [showAssesmentModal, setShowAssesmentModal] = useState(false);
    const dispatch = useDispatch();

    const {
        coaching_dashboard: { coaching_sessions },
    } = useSelector((state) => state);

    return (
        <>
            <div
                onClick={() => setShowAssesmentModal(true)}
                className="finalSessionCard flex alignCenter justifySpaceBetween paddingLR24 paddingT32 paddingB20"
            >
                <div className="left_section">
                    <div className="marginB7">
                        <span className="bold600 font18 mine_shaft_cl">{`${formatedDate} ${month} | ${data?.title}`}</span>
                        <span></span>
                    </div>
                    {/* <div className='Completed_section flex alignCenter'>
          <RightSvg/> <span className='completeBtn bold600 font14 paddingLR16 paddingTB7 good_light_green_bg good_green_cl marginL10'>Completed</span>
        </div> */}
                    <div className=" font14 bold400 flex alignCenter">
                        <span className="primary_cl marginR8">
                            {"Assessment Session "}|
                        </span>
                        <>
                            {data?.assessment.status !== "Completed" ? (
                                <>
                                    <PendingSvg />
                                    <span className="pendingBtn bitter_sweet_cl marginL4">
                                        Pending
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="primary_cl marginR8">{`${data?.assessment.scored}/${data?.assessment.total} Points`}</span>
                                    <span className="flex alignCenter">
                                        <RightSvg />
                                    </span>
                                    <span className="good_green_cl marginL8">{`Completed`}</span>
                                </>
                            )}
                        </>
                    </div>
                </div>
                <div className="right_section bold600 font14">
                    {data?.assessment.status !== "Completed" ? (
                        <Button className="resumeBtn">Start</Button>
                    ) : (
                        <div
                            className="flex alignCenter justifyCenter solitude_bg"
                            style={{
                                height: "24px",
                                width: "24px",
                                borderRadius: "50%",
                            }}
                        >
                            <ChevronRightSvg
                                style={{
                                    color: "rgb(51,51,51)",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
            {data?.assessment.status !== "Completed" ? (
                <AssesmentModal
                    open={showAssesmentModal}
                    handleClose={() => {
                        if (data?.assessment.status !== "Completed") {
                            dispatch(getStatusAssesment(data?.id)).then(
                                (res) => {
                                    if (res.payload?.status === "Completed") {
                                        const newRes = coaching_sessions?.map(
                                            (e) => {
                                                if (data?.id === e.id) {
                                                    return {
                                                        ...data,
                                                        assessment: {
                                                            ...data?.assessment,
                                                            scored: res.payload
                                                                ?.scored,
                                                            status: "Completed",
                                                        },
                                                    };
                                                }
                                                return e;
                                            }
                                        );

                                        dispatch(storeCoachingSessions(newRes));
                                        setShowAssesmentModal(false);
                                    } else {
                                        setShowAssesmentModal(false);
                                    }
                                }
                            );
                        } else {
                            setShowAssesmentModal(false);
                        }
                    }}
                    urlId={data?.assessment?.responder_uri}
                />
            ) : data?.assessment.status === "Completed" ? (
                <Modal
                    centered
                    visible={showAssesmentModal}
                    onCancel={() => setShowAssesmentModal(false)}
                    footer={null}
                    width="584px"
                >
                    <div className="completion-card-container">
                        <div className="completion-card flex alignCenter column justifyCenter">
                            <div className="svg-icon">
                                <CompleteTickSvg />
                            </div>

                            <div className="bold700 font20">
                                Check your Convin registered mail id for your
                                scorecard
                            </div>
                        </div>
                    </div>
                </Modal>
            ) : (
                <></>
            )}
        </>
    );
};

const FinalSessionCard = ({ data, month }) => {
    const date = new Date(data.created_at);
    const formatedDate = `${
        date.getDate() < 9 ? `0${date.getDate()}` : date.getDate()
    }`;
    return (
        <div className="finalSessionCard flex alignCenter justifySpaceBetween paddingLR24 paddingT32 paddingB20">
            <div className="left_section">
                <div className="marginB7">
                    <span className="bold600 font18 mine_shaft_cl">{`${formatedDate} ${month} | ${data?.title}`}</span>
                    <span></span>
                </div>
                {/* <div className='Completed_section flex alignCenter'>
          <RightSvg/> <span className='completeBtn bold600 font14 paddingLR16 paddingTB7 good_light_green_bg good_green_cl marginL10'>Completed</span>
        </div> */}
                <div className="pending_section font14 bold400 flex alignCenter">
                    <span className="primary_cl marginR8">
                        {data?.assigned_by
                            ? "Assigned Session"
                            : "Daily Session"}{" "}
                        |
                    </span>
                    <>
                        {data?.completed_modules !== data?.total_modules ? (
                            <>
                                <PendingSvg />
                                <span className="pendingBtn bitter_sweet_cl marginL4">
                                    {`${
                                        data?.total_modules -
                                        data?.completed_modules
                                    }/${data?.total_modules}  Modules Pending`}
                                </span>
                            </>
                        ) : data.assessment &&
                          data.assessment?.status !== "Completed" ? (
                            <>
                                <PendingSvg />
                                <span className="pendingBtn bitter_sweet_cl marginL4">
                                    Assessment Pending
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="flex alignCenter">
                                    <RightSvg />
                                </span>
                                <span className="good_green_cl marginL8">{`Completed`}</span>
                            </>
                        )}
                    </>
                </div>
            </div>
            <div className="right_section bold600 font14">
                {data?.completed_modules !== data?.total_modules ? (
                    <Button className="resumeBtn">Resume</Button>
                ) : (
                    <div
                        className="flex alignCenter justifyCenter solitude_bg"
                        style={{
                            height: "24px",
                            width: "24px",
                            borderRadius: "50%",
                        }}
                    >
                        <ChevronRightSvg
                            style={{
                                color: "rgb(51,51,51)",
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoachingDashboard;
