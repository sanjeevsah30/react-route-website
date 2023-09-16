import routes from "@constants/Routes/index";
import sidebarConfig from "@constants/Sidebar/index";
import PageFilters from "@presentational/PageFilters/PageFilters";
import NotFound from "@presentational/reusables/NotFound";
import Spinner from "@presentational/reusables/Spinner";
import { toEpoch } from "@tools/helpers";
import React, { createContext, useCallback, useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import {
    NavLink,
    Route,
    Switch,
    useHistory,
    useLocation,
} from "react-router-dom";
import { CustomSelect } from "../../Resuable/index";
import CICustomTracking from "./CICustomTracking";
import CIDiscoverDashboard from "./CIDiscoverDashboard";
import CIInsightsDetalis from "./CIInsights/CIInsightsDetalis";
import CIInsightsDashborad from "./CIInsightsDashborad";
import "./styles.scss";
import {
    HomeContext,
    MeetingTypeConst,
} from "app/components/container/Home/Home";

export const CIMainContext = createContext();

export default function CIDashboard() {
    const { filters } = useSelector((state) => state.accounts);
    const [activeStage, setActiveStage] = useState(null);

    const history = useHistory();

    const location = useLocation();

    const { meetingType } = useContext(HomeContext);

    const {
        common: {
            filterReps,
            filterDates,
            filterCallDuration,
            filterTeams,
            activeCallTag,
            versionData,
        },
        CIInsightsSlice: { reasons },
    } = useSelector((state) => state);

    const getPayload = useCallback(() => {
        const payload = {
            min_duration:
                filterCallDuration.options?.[filterCallDuration.active]
                    ?.value?.[0] * 60,
            max_duration:
                filterCallDuration.options?.[filterCallDuration.active]
                    ?.value?.[1] * 60 || null,
            start_date: toEpoch(
                filterDates?.dates?.[filterDates?.active]?.dateRange[0]
            ),
            end_date: toEpoch(
                filterDates?.dates?.[filterDates?.active]?.dateRange[1]
            ),
        };
        if (activeCallTag?.length) payload.tags_id = activeCallTag;
        if (filterTeams.active?.length) payload.teams_id = filterTeams.active;
        if (filterReps.active.length) payload.reps_id = filterReps.active;
        if (+activeStage) payload.stages_id = [+activeStage];
        payload.meeting_type = meetingType;
        return payload;
    }, [
        filterTeams.active,
        filterReps.active,
        filterCallDuration.active,
        filterDates.active,
        activeStage,
        activeCallTag,
        meetingType,
    ]);

    return (
        <CIMainContext.Provider value={{ getPayload, activeStage }}>
            <div className="ci__dashboard__container">
                <div className="flex justifySpaceBetween alignCenter">
                    {history.location.pathname?.split("/")?.reverse()?.[0] ===
                    "insights" ? (
                        <div>
                            Showing insights for{" "}
                            <span className="bold600">
                                {reasons.total_calls || 0}
                            </span>{" "}
                            {meetingType === MeetingTypeConst.chat
                                ? "Chats"
                                : meetingType === MeetingTypeConst.email
                                ? "Emails"
                                : "Calls"}
                        </div>
                    ) : (
                        <div></div>
                    )}

                    <div
                        className="flex alignCenter"
                        style={{
                            gap: "4px",
                        }}
                    >
                        <PageFilters showTagsFilter={true} showChat={true} />
                        <CustomSelect
                            data={[
                                { id: null, stage: "All" },
                                { id: 0, stage: "None" },
                                ...filters.stage,
                            ]}
                            option_name={"stage"}
                            select_placeholder={"Select Status/Stage"}
                            placeholder={"Select Status/Stage"}
                            style={{
                                height: "36px",
                                width: "128px",
                            }}
                            value={activeStage}
                            onChange={(value) => {
                                setActiveStage(value);
                            }}
                            className={"custom__select marginL12"}
                            dropdownAlign={{ offset: [-90, 4] }}
                            option_key="id"
                        />
                    </div>
                </div>

                <div className="link_container">
                    {versionData?.noInsightTab === false ? (
                        <NavLink
                            className={(state) =>
                                state ? "active ci_link" : "ci_link"
                            }
                            to={`${routes.CI_DASHBOARD}/insights`}
                        >
                            <svg
                                width="20"
                                height="24"
                                viewBox="0 0 20 24"
                                fill="none"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M0.391602 9.27608C0.391602 6.81591 1.3689 4.4565 3.1085 2.7169C4.8481 0.977299 7.20751 4.86133e-08 9.66768 4.86133e-08H10.1357C11.9705 -0.000187757 13.7642 0.543784 15.2899 1.56311C16.8155 2.58244 18.0046 4.03133 18.7067 5.72653C19.4088 7.42172 19.5924 9.28706 19.2343 11.0866C18.8762 12.8862 17.9924 14.5391 16.6948 15.8363L16.183 16.3481C14.9292 17.6019 14.2247 19.3024 14.2245 21.0755C14.2245 22.6905 12.9149 24 11.3 24H8.50342C7.72779 24 6.98393 23.6919 6.43549 23.1434C5.88704 22.595 5.57892 21.8511 5.57892 21.0755C5.57866 19.3024 4.87419 17.6019 3.62042 16.3481L3.1086 15.8363C1.36899 14.0968 0.391656 11.7374 0.391602 9.27723V9.27608ZM9.66768 1.72911C8.17484 1.72885 6.71545 2.17133 5.47412 3.00058C4.23278 3.82984 3.26526 5.00861 2.69394 6.3878C2.12262 7.76699 1.97316 9.28464 2.26447 10.7488C2.55578 12.2129 3.27478 13.5578 4.33051 14.6133L4.84347 15.1251C5.72222 16.0039 6.3954 17.0664 6.81465 18.2363H12.9887C13.408 17.0664 14.0812 16.0039 14.9599 15.1251L15.4717 14.6133C16.5269 13.5576 17.2454 12.2128 17.5364 10.7488C17.8274 9.28484 17.6778 7.76748 17.1066 6.38851C16.5353 5.00955 15.5681 3.83089 14.3271 3.00155C13.0861 2.1722 11.6271 1.7294 10.1345 1.72911H9.66768ZM7.30803 21.0755C7.30795 20.7043 7.2833 20.3334 7.23425 19.9654H12.5691C12.5196 20.332 12.4953 20.7032 12.4953 21.0755C12.4953 21.736 11.9605 22.2709 11.3 22.2709H8.50342C8.34644 22.2709 8.19099 22.24 8.04596 22.1799C7.90093 22.1198 7.76915 22.0318 7.65815 21.9208C7.54715 21.8098 7.45909 21.678 7.39902 21.533C7.33895 21.3879 7.30803 21.2325 7.30803 21.0755ZM11.7576 6.34697C11.8268 6.25481 11.8768 6.14976 11.9048 6.03798C11.9328 5.9262 11.9381 5.80996 11.9205 5.69609C11.903 5.58221 11.8628 5.473 11.8024 5.37487C11.742 5.27674 11.6626 5.19167 11.5688 5.12467C11.4751 5.05767 11.3689 5.01008 11.2565 4.9847C11.1441 4.95933 11.0278 4.95667 10.9143 4.9769C10.8009 4.99713 10.6927 5.03983 10.596 5.10249C10.4993 5.16515 10.4161 5.24651 10.3513 5.34179L8.56336 7.84438C8.38123 8.09798 8.20601 8.34352 8.08728 8.55562C7.96855 8.76657 7.8014 9.11816 7.87056 9.5389C7.92013 9.83516 8.06077 10.1095 8.27402 10.3228C8.57604 10.6236 8.95875 10.6916 9.19967 10.717C9.44174 10.7435 9.74261 10.7435 10.055 10.7435H10.3605L10.191 10.9487L8.66134 12.7839C8.52105 12.9607 8.45547 13.1853 8.4786 13.4098C8.50173 13.6343 8.61174 13.8409 8.78513 13.9854C8.95852 14.1299 9.18153 14.2009 9.40654 14.1831C9.63154 14.1654 9.84069 14.0604 9.9893 13.8905L11.5455 12.0231C11.7463 11.7916 11.9356 11.5504 12.1126 11.3003C12.251 11.0928 12.4608 10.7343 12.4077 10.287C12.3712 9.9782 12.2357 9.68947 12.0216 9.46398C11.7115 9.1366 11.3034 9.06859 11.0556 9.04208C10.7985 9.01441 10.4769 9.01441 10.1368 9.01441H9.85327L9.99391 8.81729L11.7576 6.34697Z"
                                    fill="currentColor"
                                />
                            </svg>
                            <span>
                                {versionData?.logo
                                    ? "Insights"
                                    : "Insights by Convin"}
                            </span>
                        </NavLink>
                    ) : (
                        <></>
                    )}

                    {/* <NavLink
                    className={(state) =>
                        state ? 'active ci_link' : 'ci_link'
                    }
                    to={`${routes.CI_DASHBOARD}/discover_the_unknown`}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12 0C5.38105 0 0 5.38105 0 12C0 18.6189 5.38105 24 12 24C18.6189 24 24 18.6189 24 12C24 5.38105 18.6189 0 12 0ZM12 22.3326C6.31579 22.3326 1.66737 17.6842 1.66737 12C1.66737 6.31579 6.31579 1.66737 12 1.66737C17.6842 1.66737 22.3326 6.31579 22.3326 12C22.3326 17.6842 17.6842 22.3326 12 22.3326Z"
                            fill="currentColor"
                        />
                        <path
                            d="M15.9914 5.88636L9.65032 8.86733C9.32184 9.01888 9.04396 9.29678 8.89238 9.62527L5.88602 15.9916C5.60811 16.5979 5.70909 17.3053 6.21449 17.8105C6.5176 18.1136 6.92186 18.2906 7.32612 18.2906C7.55344 18.2906 7.78076 18.24 8.00827 18.139L14.3493 15.1581C14.6778 15.0065 14.9557 14.7286 15.1073 14.4001L18.0882 8.05907C18.3661 7.45271 18.2651 6.74534 17.7597 6.24012C17.3051 5.73472 16.5977 5.60836 15.9914 5.88626V5.88636ZM13.6418 13.6169L7.50286 16.4969L10.3576 10.3832L16.5219 7.50321L13.6418 13.6169Z"
                            fill="currentColor"
                        />
                    </svg>
                    <span>Discover The Unknown</span>
                </NavLink> */}
                    <NavLink
                        className={(state) =>
                            state ? "active ci_link" : "ci_link"
                        }
                        to={
                            location.pathname?.includes("/custom_tracking")
                                ? location.pathname
                                : `${routes.CI_DASHBOARD}/custom_tracking`
                        }
                    >
                        <svg
                            width="26"
                            height="26"
                            viewBox="0 0 26 26"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12.991 25.0015C12.9197 25.0003 12.8486 24.9851 12.7832 24.957C12.7178 24.9286 12.6579 24.8874 12.6083 24.8362C12.5587 24.7851 12.5191 24.7241 12.4927 24.6579C12.4663 24.5915 12.4532 24.5202 12.4541 24.4489V20.5228C12.44 20.4379 12.4467 20.3496 12.4729 20.2675C12.4992 20.1855 12.5454 20.1099 12.6062 20.049C12.6098 20.045 12.6136 20.041 12.6174 20.0372C12.6176 20.037 12.6176 20.037 12.618 20.0367C12.6781 19.9779 12.7519 19.9334 12.8317 19.9078C12.9116 19.8821 12.9975 19.8751 13.0804 19.8876C16.7169 19.8441 19.6417 16.8954 19.6417 13.2489C19.6417 13.2295 19.6396 13.1922 19.6393 13.1356L19.6387 13.1038C19.628 13.0483 19.6261 12.9913 19.633 12.9352C19.4704 9.43537 16.6135 6.64934 13.0809 6.60699C13.0269 6.61517 12.9716 6.61517 12.9176 6.60699C9.38717 6.64939 6.52954 9.43659 6.36842 12.9371C6.37546 12.9964 6.3728 13.0569 6.36044 13.1153C6.35987 13.1573 6.35968 13.201 6.35968 13.2486C6.35968 16.1806 8.2555 18.6626 10.8864 19.5461C10.9549 19.5681 11.0189 19.6039 11.0735 19.6506C11.1281 19.6974 11.1733 19.755 11.2058 19.8193C11.2382 19.8835 11.2577 19.9541 11.2629 20.026C11.268 20.0976 11.2587 20.1705 11.2359 20.2385C11.2131 20.3068 11.1764 20.3703 11.129 20.4243C11.0817 20.4783 11.0233 20.523 10.9589 20.5545C10.8942 20.5861 10.8235 20.6047 10.7516 20.6091C10.6797 20.6135 10.6073 20.6032 10.5394 20.5796C7.56307 19.5799 5.39939 16.8188 5.27575 13.5457H1.55196C1.48009 13.5457 1.40803 13.5331 1.34129 13.5061C1.27455 13.4791 1.21333 13.439 1.16218 13.3884C1.11104 13.3379 1.06997 13.2772 1.04221 13.2107C1.01445 13.1443 1 13.0724 1 13.0006C1 12.9287 1.01445 12.8566 1.04221 12.7903C1.06997 12.7239 1.11104 12.6631 1.16218 12.6125C1.21333 12.5619 1.27474 12.5216 1.34129 12.4948C1.40803 12.4678 1.48009 12.4545 1.55196 12.4553H5.31187C5.69157 8.74022 8.7094 5.79707 12.4549 5.53472V1.55197C12.4541 1.4801 12.4674 1.40804 12.4944 1.3413C12.5212 1.27457 12.5615 1.21334 12.6121 1.1622C12.6627 1.11105 12.7233 1.06998 12.7897 1.04222C12.856 1.01446 12.9279 1.00001 13 1.00001C13.0718 1.00001 13.1437 1.01446 13.2101 1.04222C13.2764 1.06998 13.3373 1.11105 13.3877 1.1622C13.4382 1.21334 13.4785 1.27476 13.5054 1.3413C13.5322 1.40804 13.5458 1.4801 13.5449 1.55197V5.53452C17.2928 5.79672 20.3111 8.73983 20.6908 12.4551H24.448C24.5199 12.4551 24.592 12.4676 24.6587 12.4946C24.7254 12.5216 24.7867 12.5617 24.8378 12.6123C24.889 12.6629 24.93 12.7235 24.9578 12.7901C24.9855 12.8564 25 12.9283 25 13.0004C25 13.0722 24.9855 13.1443 24.9578 13.2107C24.93 13.277 24.889 13.3379 24.8378 13.3884C24.7867 13.439 24.7253 13.4793 24.6587 13.5061C24.592 13.5331 24.5199 13.5466 24.448 13.5457H20.7265C20.5767 17.4902 17.457 20.6857 13.5451 20.9593V24.4487C13.5462 24.5213 13.5324 24.5941 13.505 24.6616C13.4776 24.7289 13.4365 24.7907 13.3852 24.8421C13.3339 24.8934 13.2719 24.9343 13.2046 24.9617C13.1373 24.989 13.0642 25.0025 12.9916 25.0014L12.991 25.0015Z"
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth="0.572102"
                            />
                            <path
                                d="M10.1812 13.0159C10.1812 14.5666 11.4503 15.8337 12.9992 15.8337C14.5499 15.8337 15.8171 14.5666 15.8171 13.0159C15.8171 11.465 14.5498 10.1978 12.9992 10.1978C11.4503 10.1978 10.1812 11.465 10.1812 13.0159Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                        </svg>

                        <span>Custom Tracking</span>
                    </NavLink>
                </div>

                <div className="flex1 overflowYscroll">
                    <Switch>
                        <Route
                            exact
                            path={`${routes.CI_DASHBOARD}/discover_the_unknown`}
                            render={() => (
                                <>
                                    <Helmet>
                                        <meta charSet="utf-8" />
                                        <title>{sidebarConfig.CI_TITLE}</title>
                                    </Helmet>
                                    <CIDiscoverDashboard />
                                </>
                            )}
                        />
                        <Route
                            path={`${routes.CI_DASHBOARD}/custom_tracking`}
                            render={() => (
                                <>
                                    <Helmet>
                                        <meta charSet="utf-8" />
                                        <title>{sidebarConfig.CI_TITLE}</title>
                                    </Helmet>
                                    <CICustomTracking />
                                </>
                            )}
                        />
                        {versionData?.noInsightTab === false ? (
                            <>
                                <Route
                                    exact
                                    path={`${routes.CI_DASHBOARD}/insights`}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>
                                                    {sidebarConfig.CI_TITLE}
                                                </title>
                                            </Helmet>
                                            <CIInsightsDashborad />
                                        </>
                                    )}
                                />
                                <Route
                                    path={`${routes.CI_DASHBOARD}/insights/:type/:id`}
                                    render={() => (
                                        <>
                                            <Helmet>
                                                <meta charSet="utf-8" />
                                                <title>
                                                    {sidebarConfig.CI_TITLE}
                                                </title>
                                            </Helmet>
                                            <CIInsightsDetalis />
                                        </>
                                    )}
                                />
                            </>
                        ) : null}
                        <Route
                            path={`*`}
                            render={() => (
                                <>
                                    <Helmet>
                                        <meta charSet="utf-8" />
                                        <title>{sidebarConfig.CI_TITLE}</title>
                                    </Helmet>
                                    <NotFound backLink={routes.HOME} />
                                </>
                            )}
                        />
                    </Switch>
                </div>
            </div>
        </CIMainContext.Provider>
    );
}
