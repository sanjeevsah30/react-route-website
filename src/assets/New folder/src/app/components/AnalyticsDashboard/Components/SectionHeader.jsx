import Dot from "@presentational/reusables/Dot";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import CalendarSvg from "app/static/svg/CalendarSvg";
import DownloadSvg from "app/static/svg/DownloadSvg";
import { Dropdown, Menu, Spin, Button } from "antd";
import ChartImg from "./svg/chart-growth.png";
import ExcelImg from "./svg/microsoft-excel.png";
import { Link } from "react-router-dom";
import { HomeDashboardContext } from "../Context/HomeDashboardContext";

const SectionHeader = ({
    showSeeDetails,
    showMoreDetails = true,
    duration,
    title,
    seeDetailsClick = () => {},
    report_type,
    downloadGraph = () => {},
    defaultHeader = true,
    to,
    isParametergraph,
    singleParameterLoader,
}) => {
    const { handleDownload, setShowScheduelModal, setReportType } =
        useContext(HomeDashboardContext);
    const {
        common: { filterDates, filterReps },
    } = useSelector((state) => state);

    // menu
    const onClick = ({ key }) => {
        if (+key === 2) {
            handleDownload(report_type);
        } else {
            downloadGraph();
        }
    };

    const menu = (
        <Menu
            onClick={onClick}
            items={[
                {
                    label: "GRAPH",
                    key: "1",
                    icon: (
                        <img
                            alt="graph"
                            style={{ width: 20, height: 20 }}
                            src={ChartImg}
                        />
                    ),
                },
                {
                    label: "REPORT",
                    key: "2",
                    icon: (
                        <img
                            alt="report"
                            style={{ width: 20, height: 20 }}
                            src={ExcelImg}
                        />
                    ),
                },
            ]}
        />
    );

    return (
        <div className="section__header marginTB16 flex justifySpaceBetween">
            {defaultHeader ? (
                <>
                    {" "}
                    <div className="flex alignCenter">
                        <Dot
                            width="12px"
                            height="12px"
                            className="primary_bg pointer_dot"
                        />
                        <span className="font16 marginL8 marginT2">
                            {title}
                        </span>
                        {isParametergraph ? (
                            <></>
                        ) : (
                            <>
                                <div className="divider" />
                                <span className="flex alignCenter dove_gray_cl">
                                    <CalendarSvg
                                        style={{
                                            marginRight: "10px",
                                        }}
                                    />{" "}
                                    {filterDates.dates[filterDates.active].name}
                                </span>
                            </>
                        )}
                    </div>
                    <div className="flex alignCenter">
                        {/* {((showSeeDetails && !filterReps.active) ||
                                title === 'Parameter Level Analytics') && ( */}
                        {showSeeDetails &&
                            (!filterReps.active.length ||
                                filterReps.active.length > 1) && (
                                <Link to={to}>
                                    {" "}
                                    {title === "Multi Team Level Analytics" ? (
                                        <button
                                            // onClick={seeDetailsClick}
                                            className="details__btn"
                                        >
                                            View Details
                                        </button>
                                    ) : (
                                        <button
                                            // onClick={seeDetailsClick}
                                            className="details__btn"
                                        >
                                            View Dashboard
                                        </button>
                                    )}
                                </Link>
                            )}
                        {showMoreDetails && (
                            <div
                                className="flex alignCenter"
                                style={{
                                    display: `${
                                        title === "Statistics" ? "none" : ""
                                    }`,
                                }}
                            >
                                {isParametergraph ? (
                                    <></>
                                ) : (
                                    <>
                                        {" "}
                                        <button
                                            type="button"
                                            className="ant-btn ant-btn-text borderRadius6"
                                            onClick={() => {
                                                setShowScheduelModal(true);
                                                report_type &&
                                                    setReportType(report_type);
                                            }}
                                        >
                                            <span
                                                role="img"
                                                className="anticon"
                                            >
                                                <svg
                                                    width="26"
                                                    height="26"
                                                    viewBox="0 0 26 26"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M17.0625 24.375C15.7769 24.375 14.5202 23.9938 13.4513 23.2796C12.3824 22.5653 11.5493 21.5502 11.0573 20.3624C10.5653 19.1747 10.4366 17.8678 10.6874 16.6069C10.9382 15.346 11.5573 14.1878 12.4663 13.2788C13.3753 12.3698 14.5335 11.7507 15.7944 11.4999C17.0553 11.2491 18.3622 11.3778 19.5499 11.8698C20.7377 12.3618 21.7528 13.1949 22.4671 14.2638C23.1813 15.3327 23.5625 16.5894 23.5625 17.875C23.5625 19.5989 22.8777 21.2522 21.6587 22.4712C20.4397 23.6902 18.7864 24.375 17.0625 24.375ZM17.0625 13C16.0983 13 15.1558 13.2859 14.3541 13.8216C13.5524 14.3573 12.9276 15.1186 12.5586 16.0094C12.1896 16.9002 12.0931 17.8804 12.2812 18.8261C12.4693 19.7717 12.9336 20.6404 13.6154 21.3221C14.2971 22.0039 15.1658 22.4682 16.1114 22.6563C17.0571 22.8444 18.0373 22.7479 18.9281 22.3789C19.8189 22.0099 20.5802 21.3851 21.1159 20.5834C21.6516 19.7817 21.9375 18.8392 21.9375 17.875C21.9375 16.5821 21.4239 15.3421 20.5096 14.4279C19.5954 13.5136 18.3554 13 17.0625 13Z"
                                                        fill="#333333"
                                                    ></path>
                                                    <path
                                                        d="M18.3544 20.3125L16.25 18.2081V14.625H17.875V17.5419L19.5 19.1669L18.3544 20.3125Z"
                                                        fill="#333333"
                                                    ></path>
                                                    <path
                                                        d="M22.75 4.875C22.75 4.44402 22.5788 4.0307 22.274 3.72595C21.9693 3.4212 21.556 3.25 21.125 3.25H17.875V1.625H16.25V3.25H9.75V1.625H8.125V3.25H4.875C4.44402 3.25 4.0307 3.4212 3.72595 3.72595C3.4212 4.0307 3.25 4.44402 3.25 4.875V21.125C3.25 21.556 3.4212 21.9693 3.72595 22.274C4.0307 22.5788 4.44402 22.75 4.875 22.75H8.125V21.125H4.875V4.875H8.125V6.5H9.75V4.875H16.25V6.5H17.875V4.875H21.125V9.75H22.75V4.875Z"
                                                        fill="#333333"
                                                    ></path>
                                                </svg>
                                            </span>
                                        </button>
                                    </>
                                )}

                                {isParametergraph ? (
                                    <>
                                        {" "}
                                        <div className="curPoint">
                                            <Button
                                                type="text"
                                                className="borderRadius6 paddingT8"
                                                onClick={() => {
                                                    downloadGraph();
                                                }}
                                                style={{
                                                    backgroundColor:
                                                        "transparent",
                                                    position: "relative",
                                                }}
                                                loading={singleParameterLoader}
                                            >
                                                <DownloadSvg />
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {" "}
                                        <Dropdown overlay={menu}>
                                            <div
                                                onClick={(e) =>
                                                    e.preventDefault()
                                                }
                                                style={{ paddingTop: "6px" }}
                                            >
                                                <DownloadSvg className="dove_gray_cl" />
                                            </div>
                                        </Dropdown>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="flex alignCenter">
                    <Dot
                        width="12px"
                        height="12px"
                        className="primary_bg pointer_dot"
                    />
                    <span>{title}</span>
                </div>
            )}
        </div>
    );
};

export default SectionHeader;
