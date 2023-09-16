import { Button, Select } from "antd";
import React, { useContext } from "react";
import { ReportContext } from "./AuditReport";
import Icon from "@presentational/reusables/Icon";
import TopbarConfig from "@constants/Topbar/index";
import RefreshSvg from "app/static/svg/RefreshSvg";

import { useDispatch } from "react-redux";

import {
    setReportActiveAgent,
    setReportActiveTeam,
} from "@store/audit_report/actions";
import SelectDate from "./SelectDate";
import SelectDuration from "./SelectDuration";
import PageFilters from "@presentational/PageFilters/PageFilters";
import FillterSvg from "app/static/svg/FillterSvg";
import { CustomSelect } from "../Resuable/index";
import { HomeContext } from "@container/Home/Home";

const { Option } = Select;

function ReportHeader({
    title,
    headline,
    showBackBtn,
    is_sales_header,
    is_agent_header,
    goBack,
    filterTeams,
    hideCallDurationFilter,
    hideRepSelect,
}) {
    const dispatch = useDispatch();
    const { setVisible, versionData } = useContext(ReportContext);
    const { setMeetingType, meetingType } = useContext(HomeContext);

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="flex alignCenter justifySpaceBetween posRel">
            <div className="flex">
                {showBackBtn && (
                    <span
                        onClick={goBack}
                        className={"curPoint marginR10 font22"}
                    >
                        <Icon className={TopbarConfig.BACKICON} />
                    </span>
                )}
                <div>
                    <div className="bold font22 text-bolder">{title}</div>
                    <div className="greyText">{headline}</div>
                </div>
            </div>

            {/* <div className="flex alignCenter">
                {versionData?.has_chat && (
                    <CustomSelect
                        data={[{ id: "call" }, { id: "chat" }, { id: "email" }]}
                        option_name={"id"}
                        option_key={"id"}
                        select_placeholder={"Choose Meeting type"}
                        placeholder={"Choose Meeting type"}
                        style={{
                            height: "36px",
                            width: "128px",
                        }}
                        value={meetingType}
                        onChange={(value) => {
                            setMeetingType(value);
                        }}
                        className={"custom__select marginR12"}
                        dropdownAlign={{ offset: [-90, 4] }}
                        showSearch={false}
                    />
                )}
                <PageFilters
                    hideDuration={hideCallDurationFilter}
                    hideRepSelect={hideRepSelect}
                />
                <div className="marginL8">
                    <Button
                        className="borderRadius4 capitalize flex alignCenter marginL10"
                        size={36}
                        onClick={() => {
                            setVisible(true);
                        }}
                        style={{
                            height: "36px",
                        }}
                    >
                        <FillterSvg
                            style={{
                                color: "#333333",
                            }}
                        />
                        <span>Filters</span>
                    </Button>
                </div>
                <div className="marginL10">
                    <Button
                        type="primary borderRadius5"
                        className="flex alingCenter"
                        icon={<RefreshSvg />}
                        onClick={handleRefresh}
                    >
                        Refresh
                    </Button>
                </div>
            </div> */}
        </div>
    );
}

ReportHeader.defaultProps = {
    hideCallDurationFilter: false,
};

export default ReportHeader;
