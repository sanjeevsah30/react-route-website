import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import CalendarUI from "@presentational/Calendar/CalendarUI";
import commonConfig from "@constants/common";
import calendarConfig from "@constants/Calendar";
import { getProviderLocation, isCalIntegrated } from "@apis/authentication";
import apiErrors from "@apis/common/errors";
import { withRouter } from "react-router-dom";
import { openNotification } from "@store/common/actions";
import { Spinner } from "@presentational/reusables/index";
import { Button } from "antd";
import { disconnectCalender } from "@apis/authentication/index";

const Calendar = (props) => {
    const userData = useSelector((state) => state.auth);
    const domain = useSelector((state) => state.common.domain);
    const [calendersIntegrated, setCalendersIntegrated] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiIntervalId, setApiIntervalId] = useState(null);
    const [calIntervalId, setCalIntervalId] = useState(null);
    const [isIntegrating, setIsIntegrating] = useState(false);
    const labels = {
        calendarBtn: commonConfig.CTA_CALLOUT,
    };

    useEffect(() => {
        return () => {
            clearInterval(apiIntervalId);
            clearInterval(calIntervalId);
        };
    }, [calIntervalId, apiIntervalId]);

    let calRefs = {
        google: {
            isDisabled: false,
            logo: "google.png",
            webhook: "google",
            ref: useRef(null),
        },
        outlook: {
            isDisabled: false,
            logo: "outlook.png",
            isComingSoon: false,
            webhook: "outlook",
            ref: useRef(null),
        },
    };

    const startCheckingIntegration = (provider) => {
        setIsIntegrating(true);
        var timer = calendarConfig.API_TIMER;
        const apiCountdown = setInterval(function () {
            timer--;
            if (timer === 0) {
                clearInterval(apiCountdown);
                clearInterval(calInterval);
                openNotification(
                    "error",
                    "Error",
                    "Unable to integrate at the moment. Please try again!"
                );
                setIsLoading(false);
                setIsIntegrating(false);
            }
        }, 1000);
        setApiIntervalId(apiCountdown);
        const calInterval = setInterval(() => {
            isCalendarIntegrated().then((res) => {
                if (
                    res &&
                    res.results.length &&
                    !!res.results.filter((cal) => cal.provider === provider)
                        .length
                ) {
                    clearInterval(apiCountdown);
                    clearInterval(calInterval);
                    openNotification(
                        "success",
                        "Synced Successfully",
                        "Calender integrated successfully"
                    );
                    setIntegratedWebHooks(res);
                    setIsLoading(false);
                    setIsIntegrating(false);
                }
            });
        }, calendarConfig.CALL_AFTER_EVERY * 1000);
        setCalIntervalId(calInterval);
    };

    const handleLogoClick = (ref) => {
        const provider = ref.current.getAttribute("data-card");
        isCalendarIntegrated(provider).then((res) => {
            if (!res) {
                getProviderLocation(domain, provider).then((res) => {
                    window.open(res.location, "_blank");
                    setIsLoading(true);
                    startCheckingIntegration(provider);
                });
            } else {
                console.log(ref);
            }
        });
    };

    const isCalendarIntegrated = (provider) => {
        return isCalIntegrated(domain).then((res) => {
            if (
                res.status === apiErrors.AXIOSERRORSTATUS ||
                !res.results.length
            ) {
                return false;
            } else if (provider) {
                return !!res.results.filter((cal) => cal.provider === provider)
                    .length;
            } else {
                return res;
            }
        });
    };

    const onCancel = () => {
        setIsIntegrating(false);
        setIsLoading(false);
        clearInterval(apiIntervalId);
        clearInterval(calIntervalId);
    };

    useEffect(() => {
        updateIntegratedCalenders();
    }, []);

    const updateIntegratedCalenders = () => {
        setIsLoading(true);
        isCalendarIntegrated().then((res) => {
            setIsLoading(false);
            setIntegratedWebHooks(res);
        });
    };

    const setIntegratedWebHooks = (res) => {
        let integratedWebhooks = {};
        if (res && res.results.length) {
            for (const webhook of res.results) {
                integratedWebhooks[webhook.provider] = {
                    provider: webhook.provider,
                    id: webhook.id,
                };
            }
        }
        setCalendersIntegrated(integratedWebhooks);
    };

    const handleCalenderDisconnect = (event, provider) => {
        event.stopPropagation();
        setIsLoading(true);
        disconnectCalender(
            domain,
            calendersIntegrated[provider].provider,
            calendersIntegrated[provider].id
        ).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification(
                    "error",
                    "Error",
                    "We were unable to disconnect your calender this time. Please try again later"
                );
                setIsLoading(false);
            } else {
                openNotification(
                    "success",
                    "Success",
                    "Calender disconnected successfully!"
                );
                updateIntegratedCalenders();
            }
        });
    };

    return (
        <Spinner
            loading={isLoading}
            tip={
                isIntegrating ? (
                    <Button
                        className="cancel-loading"
                        type={"link"}
                        danger
                        shape={"round"}
                        onClick={onCancel}
                    >
                        Skip Integration
                    </Button>
                ) : (
                    ""
                )
            }
        >
            <CalendarUI
                userName={userData.first_name}
                orgName={domain}
                labels={labels}
                calRefs={calRefs}
                calendarConfig={calendarConfig}
                handleLogoClick={handleLogoClick}
                skipStep={props.skipStep}
                isIntegrating={isIntegrating}
                calendersIntegrated={calendersIntegrated}
                handleCalenderDisconnect={handleCalenderDisconnect}
            />
        </Spinner>
    );
};
export default withRouter(Calendar);
