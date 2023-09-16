import React, { useRef, useState, useEffect } from "react";
import { axiosInstance } from "@apis/axiosInstance";
import { getError } from "@apis/common/index";
import authApiConfig from "../../../ApiUtils/authentication/config";
import IntegrationManagerUI from "@presentational/Settings/IntegrationManagerUi";
import { isCalIntegrated, getProviderLocation } from "@apis/authentication";
import apiErrors from "@apis/common/errors";
import { disconnectCalender, isTpIntegrated } from "@apis/authentication/index";
import { openNotification } from "@store/common/actions";
import calendarConfig from "@constants/Calendar/index";
import CrmLSPopup from "@presentational/Settings/CrmLSPopup";
import CrmATPopup from "@presentational/Settings/CrmATPopup";
import CrmPDPopup from "@presentational/Settings/CrmPDPopup";
import CrmClosePopup from "@presentational/Settings/CrmClosePopup";
import KnowlarityPopup from "@presentational/Settings/KnowlarityPopup";
import ZendeskPopup from "@presentational/Settings/ZendeskPopup";
import { submitCreds } from "@apis/crm/crm";
import { useDispatch, useSelector } from "react-redux";
import settingsConfig from "@constants/Settings/index";
import CrmFWPopup from "@presentational/Settings/CrmFWPopup";
import ResourceUriPopup from "@presentational/Settings/ResourceUriPopup";
import { checkAuth } from "@store/auth/actions";
import VonagePopup from "@presentational/Settings/VonagePopup";
import CrmSheetPopup from "@presentational/Settings/CrmSheetPopup";
import CrmETPopup from "@presentational/Settings/CrmETPopup";
import CrmOZPopup from "@presentational/Settings/CrmOZPopup";

function IntegrationManager(props) {
    const dispatch = useDispatch();
    const containerScroll = useRef(0);
    const [calendersIntegrated, setCalendersIntegrated] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiIntervalId, setApiIntervalId] = useState(null);
    const [calIntervalId, setCalIntervalId] = useState(null);
    const [isIntegrating, setIsIntegrating] = useState(false);
    const [showLSPopup, setShowLSPopup] = useState(false);
    const [showATPopup, setShowATPopup] = useState(false);
    const [showPDPopup, setShowPDPopup] = useState(false);
    const [showClosePopup, setShowClosePopup] = useState(false);
    const [showFWPopup, setShowFWPopup] = useState(false);
    const [showVonagePopup, setShowVonagePopup] = useState(false);
    const [showKnowlarityPopup, setShowKnowlarityPopup] = useState(false);
    const [connectedCrmsCount, setconnectedCrmsCount] = useState(0);
    const [popupResourceUri, setPopupResourceUri] = useState("");
    const [showResourceUriPopup, setShowResourceUriPopup] = useState(false);
    const [showCrmSheetModal, setShowCrmSheetModal] = useState(false);
    const [showZTPopup, setShowZTPopup] = useState(false);
    const [showETPopup, setShowETPopup] = useState(false);
    const [showOZPopup, setShowOZPopup] = useState(false);

    const domain = useSelector((state) => state.common.domain);

    useEffect(() => {
        updateIntegratedCalenders();
    }, []);

    useEffect(() => {
        return () => {
            clearInterval(apiIntervalId);
            clearInterval(calIntervalId);
        };
    }, [calIntervalId, apiIntervalId]);

    const handleIsIntegrating = (status) => {
        setIsIntegrating(status);
    };
    const handleIsLoading = (status) => {
        const container = document.querySelector(".content-container");
        if (status) {
            setIsLoading(true);
            containerScroll.current = container?.scrollTop
                ? container?.scrollTop
                : containerScroll.current;
            container?.scrollTo(0, 0);
        } else {
            setIsLoading(false);
            container?.scrollTo(0, containerScroll.current);
        }
    };

    const updateIntegratedCalenders = () => {
        handleIsLoading(true);
        isCalendarIntegrated().then((cals) => {
            isTpAuIntegrated().then((res) => {
                handleIsLoading(false);
                setIntegratedWebHooks([...(res || []), ...(cals ? cals : [])]);
            });
        });
    };

    const setIntegratedWebHooks = (res) => {
        let integratedWebhooks = {};
        let connectedCRMs = 0;
        if (res?.length) {
            for (const webhook of res) {
                if (crmRefs[webhook.provider]) {
                    connectedCRMs += 1;
                }
                integratedWebhooks[webhook.provider] = {
                    provider: webhook.provider,
                    id: webhook.id || webhook.provider,
                };
            }
        }
        setconnectedCrmsCount(connectedCRMs);
        setCalendersIntegrated(integratedWebhooks);
    };

    const startCheckingIntegration = (provider) => {
        handleIsIntegrating(true);
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
                handleIsLoading(false);
            }
        }, 1000);
        setApiIntervalId(apiCountdown);
        const calInterval = setInterval(() => {
            if (settingsConfig.TP_ARRAY.includes(provider)) {
                isTpAuIntegrated().then((res) => {
                    if (
                        res &&
                        !!res.filter((cal) => cal.provider === provider).length
                    ) {
                        clearInterval(apiCountdown);
                        clearInterval(calInterval);
                        openNotification(
                            "success",
                            "Synced Successfully",
                            "Integration added successfully"
                        );
                        updateIntegratedCalenders();
                        handleIsLoading(false);
                        dispatch(checkAuth());
                    }
                });
            } else {
                isCalendarIntegrated().then((res) => {
                    if (
                        res &&
                        !!res.filter((cal) => cal.provider === provider).length
                    ) {
                        clearInterval(apiCountdown);
                        clearInterval(calInterval);
                        openNotification(
                            "success",
                            "Synced Successfully",
                            "Integration added successfully"
                        );
                        updateIntegratedCalenders();
                        handleIsLoading(false);
                        dispatch(checkAuth());
                    }
                });
            }
        }, calendarConfig.CALL_AFTER_EVERY * 1000);
        setCalIntervalId(calInterval);
    };

    const openCrmSheetSelectionModal = () => {
        setShowCrmSheetModal(true);
    };

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

    let conferenceRef = {
        zoom: {
            isDisabled: false,
            logo: "zoom.png",
            webhook: "zoom",
            ref: useRef(null),
            isPrivate: true,
        },
    };

    let telRefs = {
        aircall: {
            isDisabled: false,
            logo: "aircall.svg",
            webhook: "aircall",
            ref: useRef(null),
            isPrivate: true,
        },
        outreach: {
            isDisabled: false,
            logo: "outreach.png",
            webhook: "outreach",
            ref: useRef(null),
            isPrivate: true,
        },
        zendesk_talk: {
            isDisabled: false,
            logo: "zendesktalk.png",
            webhook: "zendesktalk",
            ref: useRef(null),
            noRedirect: true,
            isPrivate: true,
        },
        dialpad: {
            isDisabled: false,
            logo: "dialpad.png",
            webhook: "dailpad",
            ref: useRef(null),
            isPrivate: true,
        },
        knowlarity: {
            isDisabled: false,
            logo: "knowlarity.png",
            webhook: "knowlarity",
            ref: useRef(null),
            isPrivate: true,
        },
        ameyo: {
            isDisabled: false,
            logo: "ameyo.png",
            webhook: "ameyo",
            ref: useRef(null),
            noRedirect: true,
            isPrivate: true,
        },
        mcube: {
            isDisabled: false,
            logo: "mcube.png",
            webhook: "mcube",
            ref: useRef(null),
            noRedirect: true,
            isPrivate: true,
        },
        ringover: {
            isDisabled: false,
            logo: "ringover.png",
            webhook: "ringover",
            ref: useRef(null),
            noRedirect: true,
            isPrivate: true,
        },
        vonage: {
            isDisabled: false,
            ref: useRef(null),
            logo: "vonage.png",
            isPrivate: true,
        },
        zoho_desk: {
            isDisabled: false,
            ref: useRef(null),
            logo: "zoho-desk.png",
            isPrivate: true,
        },
        ringcentral: {
            isDisabled: false,
            ref: useRef(null),
            logo: "ring-central.png",
            isPrivate: true,
        },
        ozonetel: {
            isDisabled: false,
            ref: useRef(null),
            logo: "ozonetel.png",
            isPrivate: true,
        },
        exotel: {
            isDisabled: false,
            ref: useRef(null),
            logo: "exotel.jpg",
            isPrivate: true,
        },
        niceincontact: {
            isDisabled: false,
            ref: useRef(null),
            logo: "nice_logo.png",
            isPrivate: true,
        },
    };

    const crmRefs = {
        salesforce: {
            isDisabled: false,
            ref: useRef(null),
            logo: "salesforce.svg",
            isPrivate: true,
        },
        leadsquared: {
            isDisabled: false,
            ref: useRef(null),
            logo: "leadsquare.svg",
            isPrivate: true,
        },
        pipedrive: {
            isDisabled: false,
            ref: useRef(null),
            logo: "pipedrive.svg",
            isPrivate: true,
        },
        zoho: {
            isDisabled: false,
            ref: useRef(null),
            logo: "zoho.png",
            isPrivate: true,
        },
        close: {
            isDisabled: false,
            ref: useRef(null),
            logo: "close.svg",
            isPrivate: true,
        },
        airtable: {
            isDisabled: false,
            ref: useRef(null),
            logo: "airtable.png",
            isPrivate: true,
        },
        freshworks: {
            isDisabled: false,
            ref: useRef(null),
            logo: "fwcrm.svg",
            isPrivate: true,
        },
        hubspot: {
            isDisabled: false,
            ref: useRef(null),
            logo: "hubspot.svg",
            isPrivate: true,
        },
        crm_sheet: {
            isDisabled: false,
            ref: useRef(null),
            logo: "google_sheet.png",
            isPrivate: true,
            showSettings: true,
            showSettingsClick: (evt) => {
                evt.stopPropagation();
                openCrmSheetSelectionModal();
            },
        },
    };
    let communicationRefs = {
        slack: {
            isDisabled: false,
            logo: "slack.png",
            webhook: "slack",
            ref: useRef(null),
            isPrivate: true,
        },
        twist: {
            isDisabled: false,
            logo: "twist.svg",
            webhook: "twist",
            ref: useRef(null),
            isPrivate: true,
        },
        intercom: {
            isDisabled: false,
            logo: "intercom.png",
            webhook: "intercom",
            ref: useRef(null),
            isPrivate: true,
        },
    };

    const handleLogoClick = (ref, noRedirect) => {
        const provider = ref.current.getAttribute("data-card");
        if (!!calendersIntegrated[provider]) {
            return;
        }
        if (provider === "leadsquared") {
            setShowLSPopup(true);
            return;
        }

        // ozonetel and exotel are working same as Leadsquared so using same Model for both
        if (provider === "ozonetel") {
            setShowOZPopup(true);
            return;
        }
        if (provider === "exotel") {
            setShowETPopup(true);
            return;
        }
        // if (provider === 'pipedrive') {
        //     setShowPDPopup(true);
        //     return;
        // }
        if (provider === "close") {
            setShowClosePopup(true);
            return;
        }
        if (provider === "airtable") {
            setShowATPopup(true);
            return;
        }
        if (provider === "knowlarity") {
            setShowKnowlarityPopup(true);
            return;
        }
        if (provider === "freshworks") {
            setShowFWPopup(true);
            return;
        }
        if (provider === "vonage") {
            setShowVonagePopup(true);
            return;
        }
        if (provider === "zendesk_talk") {
            setShowZTPopup(true);
            return;
        }

        handleIsLoading(true);
        isCalendarIntegrated(provider).then((res) => {
            if (!res) {
                getProviderLocation(props.domain, provider).then((res) => {
                    if (res?.message) {
                        openNotification("error", res.message);
                        handleIsLoading(false);
                    } else {
                        if (noRedirect) {
                            if (res?.resourceUri) {
                                setPopupResourceUri(res?.resourceUri);
                                setShowResourceUriPopup(true);
                            }
                        } else {
                            window.open(res.location, "_blank");
                        }
                        startCheckingIntegration(provider);
                    }
                });
            } else {
                handleIsLoading(false);
            }
        });
    };

    const isTpAuIntegrated = (provider) => {
        return isTpIntegrated(props.domain).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                return false;
            } else if (provider) {
                return !!res.filter((cal) => cal.provider === provider).length;
            } else {
                return res;
            }
        });
    };

    const isCalendarIntegrated = (provider) => {
        if (settingsConfig.TP_ARRAY.includes(provider)) {
            return isTpAuIntegrated(provider);
        }
        return isCalIntegrated(props.domain).then((res) => {
            if (
                res.status === apiErrors.AXIOSERRORSTATUS ||
                !res.results.length
            ) {
                return false;
            } else if (provider) {
                return !!res.results.filter((cal) => cal.provider === provider)
                    .length;
            } else {
                return res.results;
            }
        });
    };

    const handleCalenderDisconnect = (event, provider) => {
        event.stopPropagation();
        handleIsLoading(true);
        disconnectCalender(
            props.domain,
            calendersIntegrated[provider].provider,
            calendersIntegrated[provider].id
        ).then((res) => {
            if (res.status === apiErrors.AXIOSERRORSTATUS) {
                openNotification(
                    "error",
                    "Error",
                    "We were unable to disconnect your integration this time. Please try again later"
                );
                handleIsLoading(false);
            } else {
                openNotification(
                    "success",
                    "Success",
                    "Integration disconnected successfully!"
                );
                updateIntegratedCalenders();
                dispatch(checkAuth());
            }
        });
    };

    const submitCredsZT = (domain, queryString, provider) => {
        return axiosInstance
            .get(
                `/${
                    settingsConfig.TP_ARRAY.includes(provider)
                        ? authApiConfig.TP_INIT
                        : authApiConfig.CALENDER_WEBHOOK
                }${provider}${
                    settingsConfig.TP_ARRAY.includes(provider)
                        ? "/"
                        : `/${authApiConfig.PROVIDER_LOCATION}`
                }${queryString ? `?${queryString}` : ""}`
            )
            .then((res) => {
                window.open(res.data?.location, "_blank");
                // return res.data;
            })
            .catch((error) => {
                return getError(error);
            });
    };

    const onCancel = () => {
        handleIsIntegrating(false);
        handleIsLoading(false);
        clearInterval(apiIntervalId);
        clearInterval(calIntervalId);
    };

    const leadSquareCrmSubmit = (data) => {
        submitCreds(domain, data, "leadsquared").then((res) => {
            setShowLSPopup(false);
            updateIntegratedCalenders();
            dispatch(checkAuth());
        });
    };
    const exotelCrmSubmit = (data) => {
        submitCreds(domain, data, "exotel").then((res) => {
            setShowETPopup(false);
            updateIntegratedCalenders();
            dispatch(checkAuth());
        });
    };
    const ozonetelCrmSubmit = (data) => {
        submitCreds(domain, data, "ozonetel").then((res) => {
            setShowOZPopup(false);
            updateIntegratedCalenders();
            dispatch(checkAuth());
        });
    };
    const handlePipeDriveSubmit = (data) => {
        submitCreds(domain, data, "pipedrive").then((res) => {
            setShowPDPopup(false);
            updateIntegratedCalenders();
        });
    };
    const handleCloseSubmit = (data) => {
        submitCreds(domain, data, "close").then((res) => {
            setShowClosePopup(false);
            updateIntegratedCalenders();
            dispatch(checkAuth());
        });
    };
    const handleAirtableSubmit = (data) => {
        submitCreds(domain, data, "airtable").then((res) => {
            setShowATPopup(false);
            updateIntegratedCalenders();
            dispatch(checkAuth());
        });
    };
    const handleKnowlaritySubmit = (data) => {
        submitCreds(domain, data, "knowlarity").then((res) => {
            setShowKnowlarityPopup(false);
            updateIntegratedCalenders();
            dispatch(checkAuth());
        });
    };
    const handleZendeskSubmit = ({ sub_domain }) => {
        submitCredsZT(domain, sub_domain, "zendesk_talk").then((res) => {
            setShowZTPopup(false);
            startCheckingIntegration("zendesk_talk");
            // updateIntegratedCalenders();
            // dispatch(checkAuth());
        });
    };
    const handleFWSubmit = (data) => {
        submitCreds(domain, data, "freshworks").then((res) => {
            setShowFWPopup(false);
            updateIntegratedCalenders();
            dispatch(checkAuth());
        });
    };
    const handleVonageSubmit = (data) => {
        submitCreds(domain, data, "vonage").then((res) => {
            setShowVonagePopup(false);
            updateIntegratedCalenders();
            dispatch(checkAuth());
        });
    };
    return (
        <>
            <IntegrationManagerUI
                calRefs={calRefs}
                crmRefs={crmRefs}
                telRefs={telRefs}
                conferenceRef={conferenceRef}
                communicationRefs={communicationRefs}
                handleLogoClick={handleLogoClick}
                calendersIntegrated={calendersIntegrated}
                isLoading={isLoading}
                handleCalenderDisconnect={handleCalenderDisconnect}
                onCancel={onCancel}
                isIntegrating={isIntegrating}
                connectedCrmsCount={connectedCrmsCount}
            />
            <CrmLSPopup
                onClose={() => setShowLSPopup(false)}
                visible={showLSPopup}
                label="Integrate LeadSquared"
                onSubmit={leadSquareCrmSubmit}
            />

            <CrmETPopup
                onClose={() => setShowETPopup(false)}
                visible={showETPopup}
                label="Integrate Exotel"
                onSubmit={exotelCrmSubmit}
            />
            <CrmOZPopup
                onClose={() => setShowOZPopup(false)}
                visible={showOZPopup}
                label="Integrate Ozonetel"
                onSubmit={ozonetelCrmSubmit}
            />
            {/* <CrmPDPopup
                onClose={() => setShowPDPopup(false)}
                visible={showPDPopup}
                label="Integrate Pipedrive"
                onSubmit={handlePipeDriveSubmit}
            /> */}
            <CrmClosePopup
                onClose={() => setShowClosePopup(false)}
                visible={showClosePopup}
                label="Integrate Close"
                onSubmit={handleCloseSubmit}
            />
            <CrmATPopup
                onClose={() => setShowATPopup(false)}
                visible={showATPopup}
                label="Integrate AirTable"
                onSubmit={handleAirtableSubmit}
            />
            <KnowlarityPopup
                onClose={() => setShowKnowlarityPopup(false)}
                visible={showKnowlarityPopup}
                label="Integrate Knowlarity"
                onSubmit={handleKnowlaritySubmit}
            />
            <ZendeskPopup
                onClose={() => setShowZTPopup(false)}
                visible={showZTPopup}
                label="Integrate Zendesk Talk"
                onSubmit={handleZendeskSubmit}
            />
            <CrmFWPopup
                onClose={() => setShowFWPopup(false)}
                visible={showFWPopup}
                label="Integrate FreshWorks CRM"
                onSubmit={handleFWSubmit}
            />
            <VonagePopup
                onClose={() => setShowVonagePopup(false)}
                visible={showVonagePopup}
                label="Integrate Vonage"
                onSubmit={handleVonageSubmit}
            />
            <ResourceUriPopup
                onClose={() => setShowResourceUriPopup(false)}
                visible={showResourceUriPopup}
                uri={popupResourceUri}
            />
            <CrmSheetPopup
                onClose={() => setShowCrmSheetModal(false)}
                visible={showCrmSheetModal}
                label={"Choose CRM Sheet"}
            />
        </>
    );
}

export default IntegrationManager;
