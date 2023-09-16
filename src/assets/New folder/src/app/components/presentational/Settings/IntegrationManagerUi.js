import React, { useEffect, useState } from "react";
import { CalenderLogoCard } from "@reusables";
import { Spinner } from "@presentational/reusables/index";
import { Button, Checkbox } from "antd";
import { useSelector } from "react-redux";
import commonConfig from "@constants/common/index";
import { editCrmSettings, getCrmSettings } from "@apis/crm/crm";
import apiErrors from "@apis/common/errors";
import { openNotification } from "@store/common/actions";
import { uid } from "@tools/helpers";
import { USER_TYPES } from "@store/initialState";
import NoData from "@presentational/reusables/NoData";

export default function IntegrationManagerUI(props) {
    const user = useSelector((state) => state.auth);
    const domain = useSelector((state) => state.common.domain);
    const [crmPushEnabled, setCrmPushEnabled] = useState(false);
    const [allHidden, setAllHidden] = useState(false);

    useEffect(() => {
        getCrmSettings(domain).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                setCrmPushEnabled(res?.push_new_task);
            }
        });
    }, []);

    const handleUpdateCrmPush = (status) => {
        editCrmSettings(domain, status).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification("error", "Error", res.message);
            } else {
                setCrmPushEnabled(res?.push_new_task);
            }
        });
    };

    const renderCalCards = (refs, qs, type) => {
        let cards = Object.keys(refs).map((refName, idx) => {
            let isDisabled =
                type === "CRM" &&
                props.connectedCrmsCount >= 1 &&
                !props.calendersIntegrated[refName];
            const { role } = user;
            const hasAccessToAllIntegrations = role?.code_names?.find(
                (e) => e.heading === "Integrations"
            )?.permissions?.["Manage All Integrations"]?.view?.is_selected;

            return refs[refName].isPrivate &&
                !hasAccessToAllIntegrations ? null : (
                <CalenderLogoCard
                    key={idx}
                    handleLogoClick={props.handleLogoClick}
                    dataCard={refName}
                    logoFileName={refs[refName].logo}
                    showSettings={refs[refName].showSettings}
                    showSettingsClick={refs[refName].showSettingsClick}
                    logoRef={{
                        ...refs[refName],
                        isDisabled:
                            type === "CRM"
                                ? isDisabled
                                : refs[refName].isDisabled,
                    }}
                    isIntegrated={props.calendersIntegrated[refName]}
                    handleCalenderDisconnect={props.handleCalenderDisconnect}
                    noRedirect={refs[refName].noRedirect}
                />
            );
        });
        if (!cards.filter((t) => t).length && document.querySelector(qs)) {
            document.querySelector(qs).style.display = "none";
        }
        return cards;
    };
    useEffect(() => {
        if (!document.querySelectorAll(".logo-card").length) {
            setAllHidden(true);
        }
    }, []);

    return (
        <div
            className={`integration card ${
                props.isLoading ? "integration-active" : ""
            }`}
        >
            <Spinner
                loading={props.isLoading}
                tip={
                    props.isIntegrating ? (
                        <Button
                            className="cancel-loading"
                            type={"link"}
                            danger
                            shape={"round"}
                            onClick={props.onCancel}
                        >
                            Skip Integration
                        </Button>
                    ) : (
                        ""
                    )
                }
            >
                <div className="integration-title">
                    <h3>Manage Integrations</h3>
                </div>
                {allHidden && (
                    <div className="marginTB20 flex alignCenter justifyCenter">
                        <NoData description="No Integrations Available" />
                    </div>
                )}
                <div className="integration-cards">
                    {user?.user_type !== USER_TYPES.observer && (
                        <div className="integration-cards-calendar integration-cards--container">
                            <div className="integration-cards-title">
                                <h4>Calendar Integrations</h4>
                            </div>
                            <div className="integration-cards-calendar-int logos">
                                {renderCalCards(
                                    props.calRefs,
                                    ".integration-cards-calendar"
                                )}
                            </div>
                        </div>
                    )}
                    {true && (
                        <div
                            className="integration-cards-conference integration-cards--container"
                            // style={{ display: 'none' }}
                        >
                            <div className="integration-cards-title">
                                <h4>Conferencing Tools Integrations</h4>
                            </div>
                            <div className="integration-cards-calendar-int logos">
                                {renderCalCards(
                                    props.conferenceRef,
                                    ".integration-cards-conference"
                                )}
                            </div>
                        </div>
                    )}
                    <div className="integration-cards-crm integration-cards--container">
                        <div className="integration-cards-title">
                            <h4>CRM Integrations</h4>
                        </div>
                        <div className="marginTB8 paddingL4">
                            <Checkbox
                                onChange={(e) => {
                                    handleUpdateCrmPush(e.target.checked);
                                }}
                                checked={crmPushEnabled}
                            >
                                Automatically create a task after online
                                meetings and calls
                            </Checkbox>
                        </div>
                        <div className="integration-cards-tel-int logos">
                            {renderCalCards(
                                props.crmRefs,
                                ".integration-cards-crm",
                                "CRM"
                            )}
                        </div>
                    </div>
                    <div className="integration-cards-communication integration-cards--container">
                        <div className="integration-cards-title">
                            <h4>Communications Integrations</h4>
                        </div>
                        <div className="integration-cards-tel-int logos">
                            {renderCalCards(
                                props.communicationRefs,
                                ".integration-cards-communication",
                                "COM"
                            )}
                        </div>
                    </div>
                    <div className="integration-cards-tel integration-cards--container">
                        <div className="integration-cards-title">
                            <h4>Telephone Integrations</h4>
                        </div>
                        <div className="integration-cards-tel-int logos">
                            {renderCalCards(
                                props.telRefs,
                                ".integration-cards-tel"
                            )}
                        </div>
                    </div>
                </div>
            </Spinner>
        </div>
    );
}
