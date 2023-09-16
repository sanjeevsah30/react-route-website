import React, { createContext, useContext, useEffect, useState } from "react";
import "./customerIntelligence.scss";
import { useDispatch, useSelector } from "react-redux";
import { deleteTab, fetchGetTabsRequest } from "@store/ci/actions";
import CompareGraph from "../CI/components/CITracking/CustomTrackingDashboard";
import { useHistory, useLocation } from "react-router-dom";
import { getAllUsers } from "@store/common/actions";
import Spinner from "@presentational/reusables/Spinner";
import withErrorCollector from "hoc/withErrorCollector";
import CITabs from "../CI/components/CITracking/CITabs/CITabs";
import PageFilters from "@presentational/PageFilters/PageFilters";
import { Select } from "antd";

import Icon from "@presentational/reusables/Icon";
import { CustomSelect } from "../Resuable/index";
import { HomeContext } from "../container/Home/Home";

const { Option } = Select;
export const CiContext = createContext();

function CustomerIntelligence({ domain, setIsCallActive }) {
    const dispatch = useDispatch();
    const { meetingType } = useContext(HomeContext);

    const {
        common: { users, showLoader, activeCallTag },
        ci: { loading_tabs, tabs, loading_phrases, loading_editing_phrase },
    } = useSelector((state) => state);
    const [ActiveComponent, setActiveComponent] = useState(null);

    const { filters } = useSelector((state) => state.accounts);

    const [activeTab, setActiveTab] = useState("competition");

    React.useEffect(() => {
        // Get the users.
        if (!users.length) {
            dispatch(getAllUsers());
        }
    }, []);

    const { filterTeams, filterReps, filterDates, filterCallDuration } =
        useSelector((state) => state.common);

    useEffect(() => {
        if (!tabs.length) {
            dispatch(
                fetchGetTabsRequest(domain, getTopBarData(), {
                    stage: activeStage,
                })
            );
        }
    }, [
        filterTeams.active,
        filterReps.active,
        filterCallDuration.active,
        filterDates.active,
        activeCallTag,
        meetingType,
    ]);

    // React.useEffect(() => {
    //     const [last] = location?.pathname?.split('/')?.reverse();
    //     if (last === 'ci_dashboard') {
    //         return setActiveTab('competition');
    //     }
    //     if (last) {
    //         setActiveTab(last);
    //         setIsCallActive(false);
    //     }
    // }, [location]);

    const getTopBarData = () => {
        let data = {
            callDuration:
                filterCallDuration.options[filterCallDuration.active].value,
            activeReps: filterReps.active,
            activeTeam: filterTeams.active,
            activeDateRange: filterDates.dates[filterDates.active].dateRange,
        };
        return {
            callType: data.callType,
            callDuration: data.callDuration,
            repId: data.activeReps,
            teamId: data.activeTeam,
            startDate: data.activeDateRange[0],
            endDate: data.activeDateRange[1],
            activeCallTag,
            meetingType,
        };
    };

    // useEffect(() => {
    //     if (!tabs.length) {
    //         return;
    //     }
    //     history.replace(`/ci_dashboard/${activeTab}`);
    // }, [activeTab]);

    React.useEffect(() => {
        let ActiveComponent = tabs?.find(
            (tab) => tab?.slug?.toLowerCase() === activeTab?.toLowerCase()
        );

        if (!tabs.length) {
            return;
        }
        if (tabs.length)
            if (!ActiveComponent) {
                setActiveTab(tabs[0].slug);
            } else {
                setActiveComponent({
                    ...ActiveComponent,
                    Component: CompareGraph,
                });
            }
    }, [tabs, activeTab]);

    const handleActiveTab = (item) => {
        setActiveTab(item);
    };

    const deleteDashboard = (evt, id, slug) => {
        evt.stopPropagation();
        if (slug === activeTab) {
            setActiveTab(tabs[0].slug);
        }
        dispatch(deleteTab({ domain, id }));
    };

    const [activeStage, setActiveStage] = useState(null);
    return (
        <CiContext.Provider
            value={{
                filterTeams,
                filterReps,
                filterDates,
                filterCallDuration,
                getTopBarData,
                loading_phrases,
                loading_editing_phrase,
                tabs,
                activeCallTag,
            }}
        >
            <Spinner loading={loading_tabs}>
                <div className="ci_dashboard">
                    <div className="width100p paddingR18">
                        <div className="flex justifyEnd width100p paddingTB18">
                            <PageFilters
                                showTagsFilter={true}
                                showChat={true}
                            />
                            <CustomSelect
                                data={[
                                    { id: null, stage: "All" },
                                    { id: 0, stage: "None" },
                                    ...filters.stage,
                                ]}
                                option_name={"stage"}
                                select_placeholder={"Status/Stage"}
                                placeholder={"Status/Stage"}
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
                            />
                        </div>

                        <div
                            className="ci_header width100p alignCenter"
                            style={{
                                display: "inline-flex",
                            }}
                        >
                            <CITabs
                                tabs={tabs}
                                handleActiveTab={handleActiveTab}
                                activeTab={activeTab}
                                onTabDelete={deleteDashboard}
                            />
                        </div>
                    </div>

                    {ActiveComponent && (
                        <CompareGraph
                            {...ActiveComponent}
                            tabId={activeTab}
                            domain={domain}
                            onNewTab={handleActiveTab}
                            stage={activeStage}
                        />
                    )}
                </div>
            </Spinner>
        </CiContext.Provider>
    );
}

export default withErrorCollector(CustomerIntelligence);
