import routes from "@constants/Routes/index";
import sidebarConfig from "@constants/Sidebar/index";
import { getCITabs } from "@store/cutsomerIntelligence/CISlice";
import React, { createContext, useState } from "react";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import CustomTrackingDashboard from "./CITracking/CustomTrackingDashboard";
import CITabs from "./CITracking/CITabs/CITabs";
import Spinner from "@presentational/reusables/Spinner";

export const CiContext = createContext();

export default function CICustomTracking() {
    const { tabs, tabsLoading } = useSelector((state) => state.CISlice);

    const dispatch = useDispatch();

    let history = useHistory();

    const [switchTab, setSwitchTab] = useState(false);

    useEffect(() => {
        dispatch(getCITabs()).then(({ payload }) => {
            setSwitchTab(true);
        });
    }, []);

    useEffect(() => {
        if (switchTab) {
            if (tabs.length) {
                const currentSlug = history?.location?.pathname
                    ?.split("/")
                    ?.reverse()?.[0];

                const currentSlugExits = tabs?.find(
                    ({ slug }) => slug === currentSlug
                );

                history.push(
                    `${routes.CI_DASHBOARD}/custom_tracking/${
                        currentSlugExits ? currentSlug : tabs[0]?.slug
                    }`
                );
            }
        }
    }, [switchTab, tabs]);

    return (
        <div className="ci_dashboard ">
            {/* {tabs.length === 0 && !tabsLoading ? (
                <CITabs
                    tabs={tabs}
                    handleActiveTab={() => {}}
                    activeTab={1}
                    onTabDelete={() => {}}
                />
            ) : (
                <></>
            )} */}
            <Switch>
                <Route
                    exact
                    path={`${routes.CI_DASHBOARD}/custom_tracking`}
                    render={() => (
                        <>
                            <Helmet>
                                <meta charSet="utf-8" />
                                <title>{sidebarConfig.CI_TITLE}</title>
                            </Helmet>
                            <Spinner loading={tabsLoading}>
                                <div
                                    className="ci_header width100p alignCenter"
                                    style={{
                                        display: "inline-flex",
                                    }}
                                >
                                    <CITabs
                                        tabs={tabs}
                                        handleActiveTab={() => {}}
                                        activeTab={1}
                                        onTabDelete={() => {}}
                                    />
                                </div>
                                <div className="flex1"></div>
                            </Spinner>
                        </>
                    )}
                />
                <Route
                    exact
                    path={`${routes.CI_DASHBOARD}/custom_tracking/:slug`}
                    render={() => (
                        <>
                            <Helmet>
                                <meta charSet="utf-8" />
                                <title>{sidebarConfig.CI_TITLE}</title>
                            </Helmet>
                            {tabsLoading ? (
                                <Spinner loading={tabsLoading}>
                                    <div
                                        className="ci_header width100p alignCenter"
                                        style={{
                                            display: "inline-flex",
                                        }}
                                    >
                                        <CITabs
                                            tabs={tabs}
                                            handleActiveTab={() => {}}
                                            activeTab={1}
                                            onTabDelete={() => {}}
                                        />
                                    </div>
                                    <div className="flex1 overflowYscroll">
                                        <CustomTrackingDashboard />
                                    </div>
                                </Spinner>
                            ) : (
                                <>
                                    <div
                                        className="ci_header width100p alignCenter"
                                        style={{
                                            display: "inline-flex",
                                        }}
                                    >
                                        <CITabs
                                            tabs={tabs}
                                            handleActiveTab={() => {}}
                                            activeTab={1}
                                            onTabDelete={() => {}}
                                        />
                                    </div>
                                    <div className="flex1 overflowYscroll">
                                        <CustomTrackingDashboard />
                                    </div>
                                </>
                            )}
                        </>
                    )}
                />
            </Switch>
        </div>
    );
}
