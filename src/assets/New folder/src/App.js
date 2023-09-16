import React, { useEffect, Suspense, useState } from "react";
import { Result, Spin } from "antd";
import { SmileOutlined, LoadingOutlined } from "@ant-design/icons";
import { withRouter, Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./app/static/styles/main.scss";
import routes from "@constants/Routes/index";
import authFormConfig from "@constants/AuthForm";
import { setDomain, storeVersionData } from "@store/common/actions";
import { FallbackUI, NotFound } from "@reusables";
import commonConfig from "@constants/common/index";
import { Helmet } from "react-helmet";
import NetworkHeader from "./app/components/NetworkHeader/NetworkHeader";
import { Button } from "antd";
import useTimer from "hooks/useTimer";
import {
    emptyCache,
    getDisplayName,
    getDomain,
    getDomainMappingName,
} from "@tools/helpers";
import { getAppVersion } from "@apis/common/index";
import apiErrors from "@apis/common/errors";
import { showUpdateNotification } from "@store/serviceworker/actions";
import SuccessInvitation from "./pages/Success/SuccessInvitation";
import SettingUpAccount from "./pages/SettingUpAccount/SettingUpAccount";
import SpeakerSvg from "./app/static/svg/SpeakerSvg";
import CloseSvg from "./app/static/svg/CloseSvg";
import { IntercomProvider, useIntercom } from "react-use-intercom";
import { checkAuth } from "@store/auth/actions";
import ChangePassword from "app/components/container/Authentication/ChangePassword";
import VerifyCode from "app/components/container/Authentication/VerifyCode";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const ForgetPassword = React.lazy(() =>
    import("@container/Authentication/ForgetPassword")
);
const ResetPassword = React.lazy(() =>
    import("@container/Authentication/ResetPassword")
);
const Home = React.lazy(() => import("@container/Home/Home"));
const InitialSetup = React.lazy(() =>
    import("@container/InitialSetup/InitialSetup")
);
const ProtectedRoute = React.lazy(() =>
    import("@container/Authentication/ProtectedRoute")
);
const Authentication = React.lazy(() =>
    import("@container/Authentication/Authentication")
);
const Landing = React.lazy(() => import("@container/Authentication/Landing"));
const PreviewCall = React.lazy(() => import("@container/PreviewCall"));

function App() {
    const [versionCheckDone, setVersionCheckDone] = useState(false);
    const [versionText, setVersionText] = useState("Checking for updates...");
    const isServiceWorkerUpdated = useSelector(
        (state) => state.serviceWorker.serviceWorkerUpdated
    );
    const serviceWorkerRegistration = useSelector(
        (state) => state.serviceWorker.serviceWorkerRegistration
    );

    const {
        common: { domain, versionData },
        auth,
    } = useSelector((state) => state);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setDomain(window.location.host));
        let tourJson = localStorage.getItem(commonConfig.TOUR_KEY);
        if (!tourJson) {
            localStorage.setItem(commonConfig.TOUR_KEY, JSON.stringify({}));
        }
    }, [domain]);

    useEffect(() => {
        let appDomain = getDomainMappingName(getDomain(window.location.host));
        if (!versionData || appDomain) {
            getAppVersion(appDomain).then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    setVersionText("Skipping version check.");
                } else {
                    dispatch(
                        storeVersionData(
                            res.stats_threshold
                                ? { ...res }
                                : {
                                      ...res,
                                      stats_threshold: {
                                          good: 75,
                                          average: 50,
                                          bad: 50,
                                      },
                                  }
                        )
                    );
                    let appVersion = localStorage.getItem("av");
                    if (!appVersion || +appVersion !== res.version) {
                        setVersionText(
                            "Found new update. Updating please wait..."
                        );
                        localStorage.setItem("av", res.version);
                        // window.location.href = '/update.html';
                        emptyCache();
                    }
                }
                setVersionCheckDone(true);
            });
        }
    }, []);

    const updateServiceWorker = () => {
        dispatch(showUpdateNotification(false));
        const registrationWaiting = serviceWorkerRegistration.waiting;
        if (registrationWaiting) {
            registrationWaiting.postMessage({ type: "SKIP_WAITING" });
        }
    };

    // useEffect(() => {
    //     let timer;
    //     if (isServiceWorkerUpdated) {
    //         timer = setTimeout(() => {
    //             updateServiceWorker();
    //         }, 30000);
    //     }

    //     return () => {
    //         timer && clearTimeout(timer);
    //     };
    // }, [isServiceWorkerUpdated]);

    useEffect(() => {
        dispatch(checkAuth());
    }, []);

    return (
        <IntercomWrapper
            appId={process.env.REACT_APP_INTERCOM_APP_ID}
            autoBoot
            autoBootProps={{
                backgroundColor: "#1a62f2",
                actionColor: "#1a62f2",
                alignment: "left",
            }}
        >
            <Helmet>
                <meta charSet="utf-8" />
                <title>{getDomain(window.location.host)}</title>
                {Object.keys(versionData || {}).length ? (
                    <link
                        rel="icon"
                        type="image/png"
                        href={
                            versionData.logo ||
                            require("./app/static/images/favicon.png").default
                        }
                        sizes="16x16"
                    />
                ) : null}
            </Helmet>
            <Suspense fallback={<FallbackUI />}>
                {versionCheckDone && <SubscriptionExpireBanner />}
                {versionCheckDone && <ObserverBanner />}
                {versionCheckDone && isServiceWorkerUpdated && (
                    <div className="update_notification flex alignCenter justifyCenter bolder">
                        {/* <MyTimer /> */}
                        <span>New update available!. Click on</span>
                        <Button type="link" onClick={updateServiceWorker}>
                            Update Now!
                        </Button>
                    </div>
                )}
                <NetworkHeader />
                {versionCheckDone ? (
                    <>
                        {process.env.REACT_APP_APP_DOMAIN.split(" ").includes(
                            domain
                        ) &&
                        process.env.REACT_APP_DISABLE_APP_DOMAIN === "true" ? (
                            <Switch>
                                <Route
                                    exact
                                    path={routes.HOME}
                                    render={() => (
                                        <Landing
                                            renderForm={
                                                authFormConfig.AUTHFORM_REG
                                            }
                                        />
                                    )}
                                />
                                <Route
                                    render={() => {
                                        return (
                                            <NotFound backLink={routes.HOME} />
                                        );
                                    }}
                                />
                            </Switch>
                        ) : (
                            <Switch>
                                <Route
                                    exact
                                    path={routes.FORGET_PASSWORD}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>
                                                    {"Forgot Password"}
                                                </title>
                                            </Helmet>
                                            <ForgetPassword />
                                        </>
                                    )}
                                />
                                <Route
                                    exact
                                    path={routes.RESET_PASSWORD}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>
                                                    {"Reset Password"}
                                                </title>
                                            </Helmet>
                                            <ResetPassword />
                                        </>
                                    )}
                                />
                                <Route
                                    exact
                                    path={routes.SIGNIN}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>{"SignIn"}</title>
                                            </Helmet>
                                            <Authentication
                                                renderForm={
                                                    authFormConfig.AUTHFORM_SIGNIN
                                                }
                                            />
                                        </>
                                    )}
                                />
                                <Route
                                    exact
                                    path={routes.PREVIEW}
                                    component={PreviewCall}
                                />
                                <Route
                                    exact
                                    path={routes.SUCCESS_MAIL}
                                    component={SuccessInvitation}
                                />
                                <Route
                                    exact
                                    path={routes.CREATING_ORG}
                                    component={SettingUpAccount}
                                />
                                <Route
                                    exact
                                    path={routes.SIGNUP}
                                    render={() => (
                                        <Authentication
                                            renderForm={
                                                authFormConfig.AUTHFORM_REG
                                            }
                                        />
                                    )}
                                />
                                <Route
                                    exact
                                    path={routes.CHANGE_PASSWORD}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>
                                                    {"Change Password"}
                                                </title>
                                            </Helmet>
                                            <ChangePassword />
                                        </>
                                    )}
                                />
                                <Route
                                    exact
                                    path={routes.VERIFY_CODE}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>{"Verify Code"}</title>
                                            </Helmet>
                                            <VerifyCode />
                                        </>
                                    )}
                                />
                                <ProtectedRoute
                                    exact
                                    path={routes.SETUP}
                                    component={InitialSetup}
                                />
                                <ProtectedRoute
                                    path={routes.HOME}
                                    component={Home}
                                />
                                <Route
                                    render={() => {
                                        return (
                                            <NotFound backLink={routes.HOME} />
                                        );
                                    }}
                                />
                            </Switch>
                        )}
                    </>
                ) : (
                    <div className="convin_checkingUpdate">
                        <Result
                            icon={<SmileOutlined />}
                            title={versionText}
                            extra={<Spin indicator={antIcon} />}
                        />
                    </div>
                )}
            </Suspense>
        </IntercomWrapper>
    );
}

const IntercomWrapper = ({ children }) => {
    const {
        auth,
        common: { domain, versionData },
    } = useSelector((state) => state);

    return auth.id && Object.keys(versionData)?.length && !versionData?.logo ? (
        <IntercomProvider
            appId={process.env.REACT_APP_INTERCOM_APP_ID}
            autoBoot={true}
            autoBootProps={{
                backgroundColor: "#1a62f2",
                actionColor: "#1a62f2",
                alignment: "left",
                email: auth.email,
                owner: getDisplayName(auth),
                name: getDisplayName(auth),
                phone: auth.primary_phone,
                domain,
            }}
        >
            {children}
        </IntercomProvider>
    ) : (
        <>{children}</>
    );
};

const MyTimer = React.memo(
    () => {
        const time = new Date();
        const expiryTimestamp = time.setSeconds(time.getSeconds() + 30);
        const { seconds } = useTimer({
            expiryTimestamp,
            onExpire: () => {},
        });

        return (
            <span>New update available!. Page will update in {seconds} s</span>
        );
    },
    () => true
);

const SubscriptionExpireBanner = React.memo(
    () => {
        const {
            common: { versionData },
        } = useSelector((state) => state);
        const [hideBanner, setHideBanner] = useState(false);

        return versionData?.banner ? (
            <div
                style={{
                    background:
                        versionData?.banner?.level === "error"
                            ? "linear-gradient(92.16deg, #FD586B 1.18%, #F93F78 99.49%)"
                            : "linear-gradient(113.24deg, #195EE7 -4.43%, #968ADF 85.5%)",
                }}
                className={`expire_banner ${hideBanner ? "" : "active"}`}
            >
                <SpeakerSvg />
                <div
                    dangerouslySetInnerHTML={{
                        __html: versionData?.banner?.text,
                    }}
                />
                <span className="closeSvg" onClick={() => setHideBanner(true)}>
                    <CloseSvg />
                </span>
            </div>
        ) : (
            <></>
        );
    },
    () => true
);

const ObserverBanner = React.memo(
    () => {
        const [showObservorBanner, setShowObservorBanner] = useState(false);
        const { auth } = useSelector((state) => state);

        useEffect(() => {
            const flag = localStorage.getItem("has_seen_observer_banner");
            if (auth.user_type === 0 && !flag) {
                setShowObservorBanner(true);
            }
        }, [auth]);

        return showObservorBanner ? (
            <div
                style={{
                    background:
                        "linear-gradient(113.24deg, #195EE7 -4.43%, #968ADF 85.5%)",
                }}
                className={`expire_banner ${
                    showObservorBanner ? "active" : ""
                }`}
            >
                <SpeakerSvg />
                <div>
                    Observer type users will not be able to record meetings
                </div>
                <span
                    className="closeSvg"
                    onClick={() => {
                        localStorage.setItem("has_seen_observer_banner", true);

                        setShowObservorBanner(false);
                    }}
                >
                    <CloseSvg />
                </span>
            </div>
        ) : (
            <></>
        );
    },
    () => true
);
export default withRouter(App);
