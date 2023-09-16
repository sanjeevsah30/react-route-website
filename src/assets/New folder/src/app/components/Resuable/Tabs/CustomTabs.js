import { Popover } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation, useParams } from "react-router-dom";
import {
    AllReportSvg,
    ChevronDownSvg,
    ChevronRightSvg,
    ChevronUpSvg,
} from "app/static/svg/indexSvg";
import {
    AnalyticsTab,
    CoachingTab,
    dashboardRoutes,
    getCustomTab,
    tabIds,
} from "../../AnalyticsDashboard/Constants/dashboard.constants";
import "./style.scss";
import { Button } from "@mui/material";
// import Button from "@convin/theme/overrides/Button";
import { HomeContext } from "app/components/container/Home/Home";
import { useGetDashboardListQuery } from "@convin/redux/services/home/customDashboard.service";

function CustomTabs({
    activeTab,
    handleActiveTab,
    activeSubTab,
    navlink = true,
    tabsList = [],
}) {
    let id = "analysis_options";

    const {
        common: { versionData },
        callAudit: { isAccountLevel },
    } = useSelector((state) => state);
    const { data } = useGetDashboardListQuery(undefined, {
        skip: !versionData?.feature_access?.custom_dashboard,
    });
    const { canAccess } = useContext(HomeContext);
    const tabs = AnalyticsTab.filter((e) => {
        return e.id === tabIds.custom
            ? versionData?.feature_access?.custom_dashboard
            : e.id !== tabIds.audit_report
            ? true
            : canAccess("Audit Manager");
    });
    const [clicked, setClicked] = useState(false);
    const isCoachingPermissionEnable = useSelector(
        (state) =>
            state.auth?.role?.code_names?.find(
                (obj) => obj?.heading === "Coaching"
            )?.is_visible
    );

    const location = useLocation();

    const [primaryTab, setPrimaryTab] = useState(
        tabs.find((e) => e.path === location.pathname) || tabs[0]
    );

    const [subTab, setSubTabs] = useState([]);

    useEffect(() => {
        if (location.pathname === CoachingTab.path) {
            setSubTabs(tabs.filter((e) => true));
            return;
        }
        if (location.pathname.includes("custom") && data?.length) {
            const [id] = location.pathname.split("/")?.reverse();
            const tab = data.find((e) => e.id === +id);
            if (tab)
                setPrimaryTab(
                    getCustomTab({
                        name: tab.dashboard_name,
                        id: tab.id,
                    })
                );
            return;
        }
        const currentTab = tabs?.find((e) => e.path === location.pathname);
        if (currentTab && currentTab?.path !== primaryTab?.path) {
            setPrimaryTab(currentTab);
        }
        setSubTabs(
            tabs.filter((e) =>
                e.path === dashboardRoutes.lead
                    ? versionData.feature_access?.lead_score
                    : true
            )
        );
    }, [location.pathname, data]);

    const handleSubTabsClose = (e) => {
        if (e.target.closest(`#${id}`)) {
            return;
        }
        if (e.target.closest(".team_selector_popover")) {
            return;
        }
    };

    const handleClickEvent = (e) => {
        handleSubTabsClose(e);
    };

    useEffect(() => {
        document.body.addEventListener("click", handleClickEvent);

        return () => {
            document.body.removeEventListener("click", handleClickEvent);
        };
    }, []);

    useEffect(() => {
        setClicked(false);
    }, [location.pathname]);

    return (
        <>
            {navlink ? (
                <div
                    className="custom__tabs overide__tabs"
                    style={{
                        height: "54px",
                    }}
                >
                    <div
                        style={{
                            minWidth: "180px",
                        }}
                        className="flex alignCenter justifySpaceBetween"
                    >
                        <NavLink
                            to={primaryTab?.path}
                            className={`dashboard_link analytics_link`}
                        >
                            <span className="font16 containerx">
                                {primaryTab?.value}
                            </span>
                        </NavLink>
                        <Popover
                            placement="bottomRight"
                            content={
                                subTab.length ? (
                                    Tabs(
                                        subTab,
                                        activeTab,
                                        handleActiveTab,
                                        setClicked
                                    )
                                ) : (
                                    <></>
                                )
                            }
                            trigger="click"
                            visible={clicked}
                            onVisibleChange={(visible) => setClicked(visible)}
                            style={{ width: "213" }}
                        >
                            {
                                clicked ? (
                                    <ChevronUpSvg
                                        className="marginL10 paddingLR7 paddingTB10"
                                        style={{
                                            borderRadius: "4px",
                                            border: "0.4px solid #1A62F2",
                                        }}
                                    />
                                ) : (
                                    <ChevronDownSvg
                                        className="marginL10 bold600 paddingLR7 paddingTB10"
                                        style={{
                                            borderRadius: "4px",
                                            border: "0.4px solid #1A62F2",
                                        }}
                                    />
                                )
                                // <ChevronDownSvg className="marginL10" />
                            }
                        </Popover>
                    </div>
                    {isCoachingPermissionEnable ? (
                        <>
                            <div
                                style={{
                                    minWidth: "180px",
                                    marginLeft: "20px",
                                }}
                                className="pl-3 flex alignCenter justifySpaceBetween"
                            >
                                <NavLink
                                    to={CoachingTab.path}
                                    className={`dashboard_link coaching_link`}
                                >
                                    {CoachingTab?.value}
                                </NavLink>
                            </div>
                        </>
                    ) : null}
                </div>
            ) : (
                <ul className="custom__tabs">
                    {tabsList.map((item) => (
                        <li
                            key={item.id}
                            className="active marginL10"
                            style={{ background: "none" }}
                        >
                            {/* ChevronUpSvgChevronUpSvg */}
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}

const Tabs = (tab, activeTab, handleActiveTab) => {
    return tab.map((subtab) =>
        subtab.id === "custom" ? (
            <CustomDashPopover
                subtab={subtab}
                activeTab={activeTab}
                handleActiveTab={handleActiveTab}
            />
        ) : (
            <NavLink
                className="dashboard_link curPoint no_border marginB20 marginT16 flex alignCenter justifySpaceBetween min_width_0_flex_child"
                style={{
                    color: "#333",
                }}
                to={subtab.path}
                key={subtab.to}
            >
                <span className="elipse_text font16">{subtab.value}</span>
            </NavLink>
        )
    );
};

const CustomDashPopover = ({ subtab, activeTab, handleActiveTab }) => {
    const [clicked, setClicked] = useState(false);
    const { data: customDashboards } = useGetDashboardListQuery();

    const customDashTab = customDashboards?.map(({ dashboard_name, id }) => {
        return {
            id: id,
            value: (
                <div className="flex alignCenter">
                    <div
                        className="flex alignCenter justifyCenter"
                        style={{ width: "45px" }}
                    >
                        <AllReportSvg />
                    </div>
                    <div className="flex alignCenter justifyCenter">
                        <span>{dashboard_name}</span>
                    </div>
                </div>
            ),
            path: `${dashboardRoutes.custom}/${id}`,
        };
    });
    return (
        <Popover
            placement="right"
            content={
                <>
                    {customDashTab?.length ? (
                        <div onClick={() => setClicked((prev) => !prev)}>
                            {Tabs(customDashTab, activeTab, handleActiveTab)}
                        </div>
                    ) : (
                        <></>
                    )}
                    <NavLink
                        className="dashboard_link curPoint no_border marginB20 marginT16 flex alignCenter justifySpaceBetween min_width_0_flex_child"
                        style={{
                            color: "#333",
                        }}
                        to={dashboardRoutes.custom}
                        key={1}
                    >
                        <Button
                            className="elipse_text font16"
                            variant="outlined"
                            onClick={() => {
                                setClicked(false);
                            }}
                        >
                            + CUSTOM DASHBOARD
                        </Button>
                    </NavLink>
                </>
            }
            trigger="click"
            visible={clicked}
            onVisibleChange={(visible) => setClicked(visible)}
            style={{ width: "213" }}
        >
            <div
                className="dashboard_link curPoint no_border marginB20 marginT16 flex alignCenter justifySpaceBetween min_width_0_flex_child"
                style={{
                    color: "#333",
                }}
                key={subtab.to}
            >
                <span className="elipse_text font16">{subtab.value}</span>
                {clicked ? (
                    <ChevronRightSvg
                        style={{
                            transform: "scale(1.3)",
                        }}
                    />
                ) : (
                    <ChevronDownSvg />
                )}
            </div>
        </Popover>
    );
};

export default React.memo(CustomTabs, () => true);
