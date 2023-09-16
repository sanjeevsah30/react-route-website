import dashboardConfig from "@constants/Dashboard/index";
import Icon from "@presentational/reusables/Icon";
import {
    clearReports,
    getDashboardParameters,
    getViolationDistributionData,
    getViolationsAverage,
    getViolationsComposition,
    getViolationsForDashboard,
    getViolationsIdData,
} from "@store/dashboard/dashboard";
import {
    clearDefaultReports,
    getDefaultReports,
} from "@store/scheduledReports/scheduledReports";
import { getViolations } from "@store/violation_manager/violation_manager";
import { flattenTeams, StringToColor } from "@tools/helpers";
import { Select, Tabs } from "antd";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import exportAsImage from "utils/exportAsImage";
import BarGraph from "../Components/BarGraph";
import BarLineGraph from "../Components/BarLineGraph";
import GraphCard from "../Components/GraphCard";
import HorizontalStackedBarGraph from "../Components/HorizontalStackedBarGraph";
import LineGraph from "../Components/LineGraph";
import OverallViolationAnalytics from "../Components/OverallViolationAnalytics";
import SectionHeader from "../Components/SectionHeader";
import TemporaryComp from "../Components/TemporaryComp";
import ViolationsRepGraph from "../Components/ViolationsRepGraph";
import {
    dashboardRoutes,
    report_types,
} from "../Constants/dashboard.constants";
import { HomeDashboardContext } from "../Context/HomeDashboardContext";
import useGetDashboardPayload from "../Hooks/useGetDashboardPayload";
import useSetAiFiltersForDashboard from "../Hooks/useSetAiFiltersForDashboard";

const { TabPane } = Tabs;

const { OptGroup, Option } = Select;

export default function ViolationLevelAnalytics() {
    const dispatch = useDispatch();
    const [isMount, setIsMount] = useState(true);

    const history = useHistory();

    const { getDashboardPayload } = useGetDashboardPayload();

    const [violationId, setViolationId] = useState(null);

    const { filtersVisible } = useContext(HomeDashboardContext);

    const default_reports = useSelector(
        (state) => state.scheduled_reports.default_reports
    );

    const {
        dashboard: {
            violations,
            violations_data,
            loaders,
            templates_data: { template_active, templates },
            parameters,
        },
        common: {
            filterReps,
            filterTeams,
            versionData: { stats_threshold },
            teams,
            users,
        },
    } = useSelector((state) => state);

    useEffect(() => {
        if (!violations.data.length) {
            dispatch(getViolations());
        }
    }, []);

    /*Violations api's are triggered only when ther are violations set by the client
    Violations Section will not be visible if there are no violations configured
    */
    useEffect(() => {
        if (filtersVisible) {
            return;
        }
        if (template_active !== undefined && teams.length) {
            let api1, api2, api3, api4, api5;
            const payload = getDashboardPayload();
            dispatch(getDashboardParameters(template_active));
            api1 = dispatch(getViolationsAverage(payload));

            api2 = dispatch(
                getViolationsAverage({ ...payload, is_line_graph: true })
            );
            api3 = dispatch(getViolationsComposition(payload));
            api4 = dispatch(
                getViolationsComposition({ ...payload, is_line_graph: true })
            );
            api5 = dispatch(getViolationDistributionData(payload));
            setViolationId(
                filterTeams.active?.length
                    ? users.find((user) =>
                          filterTeams.active?.includes(user?.team?.id)
                      )?.id
                    : filterTeams.teams?.[1]?.id || null
            );

            return () => {
                api1 && api1?.abort();
                api2 && api2?.abort();
                api3 && api3?.abort();
                api4 && api4?.abort();
                api5 && api5?.abort();
            };
        }
    }, [template_active, getDashboardPayload, teams]);

    useEffect(() => {
        if (filterTeams.active?.length && !violationId) {
            setViolationId(filterReps.reps[1]?.id || undefined);
        }
        if (!filterTeams.active?.length && !violationId) {
            setViolationId(filterTeams.teams[1]?.id || undefined);
        }
    }, [filterTeams.teams, filterReps.reps]);

    useEffect(() => {
        let payload = { dashboard: "violations" };
        dispatch(getDefaultReports(payload));
        setIsMount(true);
        return () => {
            dispatch(clearDefaultReports());
            dispatch(clearReports());
            setIsMount(false);
        };
    }, []);

    const { get_dashboard_label } = useContext(HomeDashboardContext);

    const { labelsFunc } = dashboardConfig;
    const labels = labelsFunc(stats_threshold);

    const violationsAnalytics1 = useRef();

    const { applyAiFilter } = useSetAiFiltersForDashboard();

    const { labelsBasedOnThreshold } = useContext(HomeDashboardContext);

    useEffect(() => {
        if (!violations.data.length) {
        }
    }, []);

    const freqGetViolationsComposition = (freq) => {
        const payload = getDashboardPayload();
        const tempPayload = freq ? { ...payload, freq: freq } : payload;
        const newPayload = { ...tempPayload, is_line_graph: true };
        dispatch(getViolationsComposition(newPayload));
    };

    const freqGetViolationsIdData = (freq) => {
        const payload = getDashboardPayload();
        const tempPayload = freq ? { ...payload, freq: freq } : payload;
        const newPayload = { ...tempPayload, is_line_graph: true };

        if (violationId) {
            const violationPayload = { ...newPayload };
            if (filterTeams.active?.length)
                violationPayload.reps_id = [violationId];
            else violationPayload.teams_id = [violationId];
            dispatch(
                getViolationsIdData({
                    ...violationPayload,
                })
            );
        }
    };

    const freqGetViolationsAverage = (freq) => {
        const payload = getDashboardPayload();
        const tempPayload = freq ? { ...payload, freq: freq } : payload;
        const newPayload = { ...tempPayload, is_line_graph: true };
        dispatch(getViolationsAverage(newPayload));
    };

    useEffect(() => {
        if (filterTeams.active?.length && !violationId) {
            setViolationId(filterReps.reps[1]?.id || undefined);
        }
        if (!filterTeams.active?.length && !violationId) {
            setViolationId(filterTeams.teams[1]?.id || undefined);
        }
    }, [filterTeams.teams, filterReps.reps]);

    useEffect(() => {
        if (filtersVisible) {
            return;
        }
        let api20;
        if (violationId) {
            const violationPayload = { ...getDashboardPayload() };
            if (filterTeams.active?.length)
                violationPayload.reps_id = [violationId];
            else violationPayload.teams_id = [violationId];
            api20 = dispatch(
                getViolationsIdData({
                    ...violationPayload,
                })
            );
        }

        return () => {
            api20?.abort();
        };
    }, [getDashboardPayload]);

    useEffect(() => {
        if (filtersVisible) {
            return;
        }
        if (templates && violations.data.length) {
            let api1, api2, api3, api4, api5;
            const payload = getDashboardPayload();
            api1 = dispatch(getViolationsAverage(payload));

            api2 = dispatch(
                getViolationsAverage({ ...payload, is_line_graph: true })
            );
            api3 = dispatch(getViolationsComposition(payload));
            api4 = dispatch(
                getViolationsComposition({ ...payload, is_line_graph: true })
            );
            api5 = dispatch(getViolationDistributionData(payload));
            setViolationId(
                filterTeams.active?.length
                    ? users.find((user) =>
                          filterTeams.active?.includes(user?.team?.id)
                      )?.id
                    : filterTeams.teams?.[1]?.id || null
            );

            return () => {
                api1 && api1?.abort();
                api2 && api2?.abort();
                api3 && api3?.abort();
                api4 && api4?.abort();
                api5 && api5?.abort();
            };
        }
    }, [template_active, getDashboardPayload, templates, violations.data]);

    useEffect(() => {
        const payload = {};
        if (filterTeams.active?.length) payload.reps_id = [violationId];
        else payload.teams_id = [violationId];
        if (violationId) {
            dispatch(
                getViolationsIdData({
                    ...getDashboardPayload(),
                    ...payload,
                })
            );

            dispatch(
                getViolationsIdData({
                    ...getDashboardPayload(),
                    is_line_graph: true,
                    ...payload,
                })
            );
        }
    }, [violationId]);

    const ViolationSelect = () => {
        return (
            <Select
                className="custom__select"
                value={violationId}
                onChange={(val) => {
                    setViolationId(val);
                }}
                dropdownRender={(menu) => (
                    <div>
                        <span className={"topbar-label"}>
                            {filterTeams.active?.length
                                ? "Select Rep"
                                : "Select Team"}
                        </span>
                        {menu}
                    </div>
                )}
                placeholder={
                    filterTeams.active?.length ? "Select Rep" : "Select Team"
                }
                suffixIcon={
                    <Icon className="fas fa-chevron-down dove_gray_cl" />
                }
                style={{
                    height: "36px",
                    width: "192px",
                }}
                dropdownClassName={"account_select_dropdown"}
                optionFilterProp="children"
                showSearch
            >
                {filterTeams.active?.length
                    ? filterReps.reps.map((item, idx) =>
                          item.id === 0 ? null : (
                              <Option value={item.id} key={idx}>
                                  {item.name}
                              </Option>
                          )
                      )
                    : filterTeams.teams.map((item, idx) =>
                          item.id === 0 ? null : item?.subteams?.length ? (
                              <OptGroup key={idx} label={item.name}>
                                  {item.subteams.map((team) => (
                                      <Option key={team.id} value={team.id}>
                                          {team.name}
                                      </Option>
                                  ))}
                              </OptGroup>
                          ) : (
                              <Option value={item.id} key={idx}>
                                  {item.name}
                              </Option>
                          )
                      )}
            </Select>
        );
    };

    return (
        <div className="parameter_level analysis__dashboard">
            <div className="team__level__analytics marginTB16">
                <SectionHeader
                    downloadGraph={() => {
                        exportAsImage(
                            violationsAnalytics1.current,
                            "violation_occurrance_graph"
                        );
                    }}
                    title="Violations"
                    duration="Last 30 days"
                    showSeeDetails={false}
                    seeDetailsClick={() =>
                        history.push(dashboardRoutes.violation)
                    }
                    to={dashboardRoutes.violation}
                    report_type={report_types.violation_details}
                />

                {filterReps.active.length === 1 ? (
                    <div ref={violationsAnalytics1}>
                        <ViolationsRepGraph
                            graph_loading={
                                loaders.violations_graph_data_composition_loading
                            }
                            graph_data={violations_data.composition_graph_data?.slice(
                                0,
                                5
                            )}
                            type=""
                            labels={violations.data}
                            showTrend={true}
                            hideSummary={true}
                            barData={violations_data.average_data}
                            loading={loaders.violations_data_average_loading}
                            rest={{
                                onLabelClick: applyAiFilter,
                            }}
                        />
                    </div>
                ) : (
                    <div
                        className="cards_container"
                        style={{
                            gap: "16px",
                        }}
                        ref={violationsAnalytics1}
                    >
                        <GraphCard
                            heading={"Violation Occurrence"}
                            itext={"Violation Occurrence"}
                            is_info={true}
                            type={""}
                            Component={BarGraph}
                            LineComponent={LineGraph}
                            is_switch={true}
                            barData={violations_data.average_data}
                            lineData={violations_data.average_graph_data}
                            loading={loaders.violations_data_average_loading}
                            line_loading={
                                loaders.violations_data_average_graph_loading
                            }
                            rest={{
                                onLabelClick: applyAiFilter,
                            }}
                            onFreqClick={freqGetViolationsAverage}
                            // freqData={[defaultFreqViolAvg, freqDViolAvg, freqWViolAvg, freqMViolAvg]}
                        />

                        <GraphCard
                            heading={
                                filterTeams.active?.length
                                    ? "Rep Composition"
                                    : "Team Composition"
                            }
                            type=""
                            itext={
                                filterTeams.active?.length
                                    ? "Rep Composition"
                                    : "Team Composition"
                            }
                            is_info={true}
                            labels={
                                filterTeams.active?.length
                                    ? filterReps.reps
                                          ?.filter((rep) => rep.id)
                                          .map((rep) => ({
                                              label: rep.name,
                                              color: StringToColor.next(
                                                  rep.name
                                              ),
                                          }))
                                    : flattenTeams(filterTeams.teams)
                                          ?.filter((rep) => rep.id)
                                          ?.map((team) => ({
                                              label: team.name,
                                              color: StringToColor?.next(
                                                  team.name
                                              ),
                                          }))
                            }
                            Component={HorizontalStackedBarGraph}
                            rest={{
                                keys: filterTeams.active?.length
                                    ? filterReps.reps.map(
                                          (rep) => `${rep.name}<${rep.id}`
                                      )
                                    : flattenTeams(filterTeams.teams).map(
                                          (team) => team.name
                                      ),

                                first_key: Object.keys(
                                    violations_data?.composition_data?.[0] || {}
                                )?.filter(
                                    (key) =>
                                        !key.includes("name") &&
                                        !key.includes("id") &&
                                        !key.includes("change")
                                )?.[0],
                                onLabelClick: applyAiFilter,
                            }}
                            barData={violations_data.composition_data}
                            loading={
                                loaders.violations_data_composition_loading
                            }
                            onFreqClick={freqGetViolationsComposition}
                            // freqData={[defaultFreqViolComp, freqDViolComp, freqWViolComp, freqMViolComp]}
                        />

                        <GraphCard
                            heading={"Analytics"}
                            type={""}
                            Component={BarGraph}
                            LineComponent={LineGraph}
                            labels={labelsBasedOnThreshold}
                            barData={violations_data.id_data}
                            lineData={violations_data.id_graph_data}
                            is_select={true}
                            SelectComponent={ViolationSelect}
                            is_switch={true}
                            loading={loaders.violation_id_data_loading}
                            line_loading={
                                loaders.violation_id_graph_data_loading
                            }
                            rest={{
                                margin: {
                                    top: 10,
                                    bottom: 60,
                                },
                            }}
                            onFreqClick={freqGetViolationsIdData}
                            // freqData={[defaultFreqViolId, freqDViolId, freqWViolId, freqMViolId]}
                        />
                    </div>
                )}
            </div>
            <div className="see_deetails_section">
                <SectionHeader
                    title="Detailed Analysis"
                    defaultHeader={false}
                />
                <Tabs defaultActiveKey="1" onChange={() => {}}>
                    <TabPane tab="Violation Occurrence" key="1">
                        <BarLineGraph
                            type={get_dashboard_label()}
                            Component={BarGraph}
                            LineComponent={LineGraph}
                            is_switch={true}
                            rest={{
                                show_all: true,
                            }}
                            select_data={parameters.data}
                            barData={violations_data.average_data}
                            lineData={violations_data.average_graph_data}
                            loading={loaders.violations_data_average_loading}
                            line_loading={
                                loaders.violations_data_average_graph_loading
                            }
                            heading="Violation Occurrence"
                            select_placeholder="Select Parameter"
                            select_type="parameter"
                            option_key="question_text"
                            line_rest={{
                                generate_color: false,
                            }}
                        />
                    </TabPane>
                    <TabPane tab={"Violation Type Analysis"} key="2">
                        <BarLineGraph
                            Component={BarGraph}
                            LineComponent={LineGraph}
                            barData={violations_data.id_data}
                            lineData={violations_data.id_graph_data}
                            is_select={true}
                            SelectComponent={ViolationSelect}
                            is_switch={true}
                            loading={loaders.violation_id_data_loading}
                            line_loading={
                                loaders.violation_id_graph_data_loading
                            }
                            type={get_dashboard_label()}
                            rest={{
                                show_all: true,
                            }}
                            select_data={filterTeams.teams}
                            select_type="team"
                            select_placeholder="Select Team"
                            labels={labels}
                            heading={"Violation Type"}
                            hidePrimarySelect={true}
                            line_rest={{
                                generate_color: false,
                            }}
                        />
                    </TabPane>
                </Tabs>
            </div>

            {isMount && !!default_reports?.data?.length && (
                <div>
                    <SectionHeader title="Reports" defaultHeader={false} />
                    {
                        default_reports?.data?.map((item, index) => (
                            <TemporaryComp
                                item={item}
                                index={index}
                                key={index}
                            />
                        ))
                        // <ReportDashboard activeReportType={'agent_report'} />
                    }
                    {/* <ReportDashboard /> */}
                </div>
            )}
        </div>
    );
}
