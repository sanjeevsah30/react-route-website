import React, { useContext } from "react";
import sidebarConfig from "@constants/Sidebar";
import { Menu, Layout } from "antd";
import { Link } from "react-router-dom";
import routes from "@constants/Routes/index";
import ReportSvg from "app/static/svg/ReportSvg";
import { useSelector } from "react-redux";
import MeetingsSvg from "app/static/svg/sidebar/MeetingsSvg";
import StatsSvg from "app/static/svg/sidebar/StatsSvg";
import LibrarySvg from "app/static/svg/sidebar/LibrarySvg";
import CiSvg from "app/static/svg/sidebar/CiSvg";
import AiAuditSvg from "app/static/svg/sidebar/AiAuditSvg";
import AccountSvg from "app/static/svg/sidebar/AccountSvg";
import SettingsSvg from "app/static/svg/SettingsSvg";
import NotificationSvg from "app/static/svg/sidebar/NotificationSvg";
import LogoutSvg from "app/static/svg/sidebar/LogoutSvg";
import ConvinLogoSvg from "app/static/svg/ConvinLogoSvg";
import { HomeContext } from "@container/Home/Home";
import ConvinGptSvg from "../../../static/svg/sidebar/ConvinGptSvg";

const { Sider } = Layout;

/*
The icons are hidden in the tooltip by overriding the 
.ant-tooltip-inner class avaialble in _sidebar.scss
*/

export default function SidebarUI(props) {
    const onboardingData = useSelector(
        (state) => state.auth.onboarding_progress
    );
    const versionData = useSelector((state) => state.common.versionData);
    const {
        auth: { role },
    } = useSelector((state) => state);

    const { is_Auditor, canAccess } = useContext(HomeContext);
    return (
        <Sider
            collapsible={false}
            defaultCollapsed
            className="app_sidebar_navigation"
            theme="light"
        >
            <div className="appHome-left-top-logo ">
                <Link className="flex alignCenter" to={routes.HOME}>
                    {versionData?.logo ? (
                        <img src={versionData.logo} alt="convin" />
                    ) : (
                        <ConvinLogoSvg />
                    )}

                    {/* <img
                        src={
                            require('../../../static/images/logo-shape.png')
                                .default
                        }
                        alt="convin"
                    /> */}
                </Link>
            </div>
            <Menu
                className="app-sidebar"
                // theme="dark"
                selectedKeys={[props.activeKey]}
                mode="inline"
                onClick={(item) => {
                    props.handleClick(item.key);
                }}
            >
                {versionData?.domain_type === "b2c" && (
                    <Menu.Item
                        key={sidebarConfig.BTNTYPE_AI_AUDIT_DASHBOARD}
                        className="call-filters-view"
                        icon={
                            <div>
                                <AiAuditSvg
                                    isActive={
                                        props.activeKey === "home" ||
                                        props.activeKey === "audit_report"
                                    }
                                />
                            </div>
                        }
                    >
                        <span>{sidebarConfig.AI_AUDIT_DASHBOARD_TITLE}</span>
                        {/* <p className="persuasion__wrapper">
                            <PersuasionTag label="New" />
                        </p> */}
                    </Menu.Item>
                )}
                <Menu.Item
                    key={sidebarConfig.BTNTYPE_PHONE}
                    className="calls-view"
                    icon={
                        <div>
                            <MeetingsSvg
                                isActive={props.activeKey === "calls"}
                            />
                        </div>
                    }
                >
                    <span>{sidebarConfig.PHONE_TITLE}</span>
                </Menu.Item>
                {/* <Menu.Item
                    key={sidebarConfig.BTNTYPE_COACHING}
                    className="coaching-view"
                    icon={
                        <div className="active_menu">
                            <MeetingsSvg />
                        </div>
                    }
                >
                    <span>{sidebarConfig.COACHING_TITLE}</span>
                </Menu.Item> */}
                {versionData?.domain_type === "b2b" && (
                    <Menu.Item
                        key={sidebarConfig.BTNTYPE_STATISTICS}
                        className="statistics-view"
                        icon={
                            <div>
                                <StatsSvg
                                    isActive={props.activeKey === "statistics"}
                                />
                            </div>
                        }
                    >
                        <span>{sidebarConfig.STATISTICS_TITLE}</span>
                    </Menu.Item>
                )}
                {canAccess("Customer Intelligence") ? (
                    <Menu.Item
                        key={sidebarConfig.BTNTYPE_CI}
                        className="ci-view"
                        icon={
                            <div>
                                <CiSvg
                                    isActive={
                                        props.activeKey === "ci_dashboard"
                                    }
                                />
                            </div>
                        }
                    >
                        <span>{sidebarConfig.CI_TITLE}</span>
                    </Menu.Item>
                ) : (
                    <></>
                )}
                {/* {
                    <Menu.Item
                        key={sidebarConfig.BTNTYPE_CONVIN_GPT}
                        className="convin-gpt-view"
                        icon={
                            <div>
                                <ConvinGptSvg
                                    isActive={props.activeKey === 'gpt'}
                                />
                            </div>
                        }
                    >
                        <span>{sidebarConfig.CONVINGPT_TITLE}</span>
                    </Menu.Item>
                } */}
                {canAccess("Accounts") ? (
                    <Menu.Item
                        key={sidebarConfig.BTNTYPE_ACCOUNTS}
                        className="accounts-view"
                        icon={
                            <div>
                                <AccountSvg
                                    isActive={props.activeKey === "accounts"}
                                />
                            </div>
                        }
                    >
                        <span>{sidebarConfig.ACCOUNTS_TITLE}</span>
                        {/* <p className="persuasion__wrapper">
                        <PersuasionTag label="New" />
                    </p> */}
                    </Menu.Item>
                ) : (
                    <></>
                )}
                {canAccess("Library") && (
                    <Menu.Item
                        key={sidebarConfig.BTNTYPE_LIBRARY}
                        className="library-view"
                        icon={
                            <div>
                                <LibrarySvg
                                    isActive={props.activeKey === "library"}
                                />
                            </div>
                        }
                    >
                        <span>{sidebarConfig.LIBRARY_TITLE}</span>
                    </Menu.Item>
                )}
                {is_Auditor(role?.code_names) &&
                    versionData.domain_type === "b2b" && (
                        <Menu.Item
                            key={sidebarConfig.BTNTYPE_AUDIT_REPORT}
                            className="report-view"
                            icon={
                                <div>
                                    <ReportSvg
                                        isActive={
                                            props.activeKey === "audit_report"
                                        }
                                    />
                                </div>
                            }
                        >
                            <span>{sidebarConfig.AUDIT_REPORT}</span>
                            {/* <p className="persuasion__wrapper">
                        <PersuasionTag label="New" />
                    </p> */}
                        </Menu.Item>
                    )}

                <Menu.Item
                    key={sidebarConfig.BTNTYPE_SETTINGS}
                    className="settings-view"
                    icon={
                        <div>
                            <SettingsSvg
                                isActive={props.activeKey === "settings"}
                            />
                        </div>
                    }
                >
                    <span>{sidebarConfig.SETTINGS_TITLE}</span>
                </Menu.Item>
                {/* {versionData?.logo ? (
                    <></>
                ) : (
                    <Menu.Item
                        key={sidebarConfig.BTNTYPE_HELP}
                        className="help-user"
                        icon={
                            <div className="active_menu">
                                <HelpSvg />
                            </div>
                        }
                    >
                        <span>{sidebarConfig.HELP_TITLE}</span>
                    </Menu.Item>
                )} */}

                {versionData?.domain_type === "b2c" ? (
                    <></>
                ) : onboardingData &&
                  onboardingData?.completed !== onboardingData.total &&
                  !versionData?.logo ? (
                    <Menu.Item
                        key={sidebarConfig.BTNTYPE_ONBOARDING}
                        className="onboard-user"
                        icon={
                            <div>
                                <NotificationSvg />
                            </div>
                        }
                    >
                        {/* <NotificationSvg /> */}
                        <span>{sidebarConfig.ONBOARDING_TITLE}</span>
                        <span className="onboard__pendingSteps">
                            {onboardingData.total - onboardingData.completed}
                        </span>
                    </Menu.Item>
                ) : (
                    <></>
                )}
                <Menu.Item
                    key={sidebarConfig.BTNTYPE_LOGOUT}
                    className="logout-user"
                    icon={
                        <div className="active_menu">
                            <LogoutSvg style={{ stroke: "#999" }} />
                        </div>
                    }
                >
                    <span>{sidebarConfig.LOGOUT_TITLE}</span>
                </Menu.Item>
            </Menu>
        </Sider>
    );
}
