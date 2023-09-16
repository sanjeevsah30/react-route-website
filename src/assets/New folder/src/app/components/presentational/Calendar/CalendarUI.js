import React from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import { Label, Logo, Error, CalenderLogoCard } from "@reusables";
import { Button } from "antd";
import calendarConfig from "@constants/Calendar/index";
import { uid } from "@tools/helpers";

const CalendarUI = (props) => {
    return (
        <>
            <div className="card-container calendar">
                <div className="card calendar-container">
                    <div className="calendar-logos card-logos">
                        <Logo logoAlt="convin" />
                        <h1>{props.orgName}</h1>
                    </div>
                    <div className="calendar-title-wrapper form-title-wrapper">
                        <h2 className="calendar-title form-title">
                            {props.calendarConfig.WELCOME}
                            {props.userName}!
                        </h2>
                        <img
                            src={
                                require("../../../static/images/icons/next.svg")
                                    .default
                            }
                            alt="convin"
                            className="calendar-card-title-arrow form-icon"
                        />
                    </div>
                    <div className="calendar-card-callout">
                        <p className="calendar-card-callout-text">
                            {!props.isIntegrating
                                ? props.calendarConfig.CHOOSE_CALLOUT
                                : props.calendarConfig.SYNC_CALLOUT}
                        </p>
                    </div>
                    <div className="calendar-card-sync-choose">
                        {!props.isIntegrating ? (
                            <div className="calendar-card-choose">
                                <Label
                                    labelClass="calendar-card-choose-label"
                                    label={props.calendarConfig.SYNC_LABEL}
                                />
                                <div className="calendar-card-choose-logocards">
                                    {Object.keys(props.calRefs).map(
                                        (cal, idx) => {
                                            return (
                                                <CalenderLogoCard
                                                    key={uid() + idx}
                                                    handleLogoClick={
                                                        props.handleLogoClick
                                                    }
                                                    dataCard={cal}
                                                    logoFileName={
                                                        props.calRefs[cal].logo
                                                    }
                                                    logoRef={props.calRefs[cal]}
                                                    isIntegrated={
                                                        props
                                                            .calendersIntegrated[
                                                            cal
                                                        ]
                                                    }
                                                    handleCalenderDisconnect={
                                                        props.handleCalenderDisconnect
                                                    }
                                                />
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="calendar-card-sync">
                                <div className="calendar-card-sync-logo">
                                    <i
                                        className="fa fa-calendar-check-o"
                                        aria-hidden="true"
                                    ></i>
                                </div>
                                <p className="calendar-card-sync-text">
                                    {props.calendarConfig.SYNC_TEXT}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="calendar-form flex justifySpaceBetween">
                        {/* {props.errors.common.status && (
                            <Error errorMessage={props.errors.common.message} />
                        )} */}
                        <div className="calendar-skip">
                            <Button
                                icon={<ArrowRightOutlined />}
                                className="calendar-skip-button"
                                type={"link"}
                                onClick={() =>
                                    props.skipStep(calendarConfig.SKIP_STEP)
                                }
                            >
                                {props.calendarConfig.SKIP}
                            </Button>
                        </div>
                        {!!Object.keys(props.calendersIntegrated).length && (
                            <Button
                                shape={"round"}
                                type={"primary"}
                                onClick={() =>
                                    props.skipStep(calendarConfig.SKIP_STEP)
                                }
                            >
                                {"NEXT"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
export default CalendarUI;
