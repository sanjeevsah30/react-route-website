import auditConfig from "@constants/Audit/index";
import { HomeContext, MeetingTypeConst } from "@container/Home/Home";
import Icon from "@presentational/reusables/Icon";
import { setIsAccountLevel } from "@store/call_audit/actions";
import { setDashboardFilters } from "@store/dashboard/dashboard";
import { getAuditors } from "@store/userManagerSlice/userManagerSlice";
import { Button, Checkbox, Collapse, Drawer, Select } from "antd";
import { memo, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CloseSvg from "app/static/svg/CloseSvg";
import MinusSvg from "app/static/svg/MinusSvg";
import PlusSvg from "app/static/svg/PlusSvg";
import AuditType from "../../Resuable/AuditType/AuditType";
import CustomDateRangePicker from "../../Resuable/CustomDateRangePicker/CustomDateRangePicker";
import config from "@constants/Search/index";
import { useLocation } from "react-router-dom";
import { dashboardRoutes } from "../Constants/dashboard.constants";

const { Panel } = Collapse;
const { Option } = Select;
export const DashboardFiltersDrawer = memo(
    ({ visible, closeFilters, setVisible }) => {
        const location = useLocation();
        const dispatch = useDispatch();
        const { isAccountLevel } = useSelector((state) => state.callAudit);
        const [tempLevel, setTempLevel] = useState(isAccountLevel);

        const { dashboard_filters } = useSelector((state) => state.dashboard);
        const { filters } = useSelector((state) => state.accounts);

        const { meetingType, setCallTags, setAccTags, callTags, accTags } =
            useContext(HomeContext);

        const { auditors } = useSelector((state) => state.userManagerSlice);

        const {
            filterDates,

            tags: allTags,
            versionData: { isAccountLevelDashboard },
        } = useSelector((state) => state.common);
        const { accountTags } = useSelector((state) => state.accounts.filters);

        useEffect(() => {
            if (visible && !auditors?.length) dispatch(getAuditors());
        }, [visible]);

        useEffect(() => {
            setTempLevel(isAccountLevel);
        }, [isAccountLevel]);

        const CallFilterFooter = () => (
            <div className="filter_footer">
                <Button
                    type="primary"
                    className="footer_button"
                    onClick={() => {
                        setVisible(false);
                        dispatch(setIsAccountLevel(tempLevel));
                        if (tempLevel)
                            dispatch(
                                setDashboardFilters({
                                    ...dashboard_filters,
                                    call_tags: [],
                                    acc_tags: accTags,
                                })
                            );
                        if (!tempLevel)
                            dispatch(
                                setDashboardFilters({
                                    ...dashboard_filters,
                                    call_tags: callTags,
                                    acc_tags: [],
                                })
                            );
                        // setCallTags(dashboard_filters.call_tags);
                        // setAccTags(dashboard_filters.acc_tags);
                    }}
                >
                    Apply Filter
                </Button>
            </div>
        );
        return (
            <Drawer
                title={<div className="bold700 font24">Filters</div>}
                placement="right"
                width={480}
                visible={visible}
                onClose={() => {
                    setVisible(false);
                }}
                footer={<CallFilterFooter />}
                closable={false}
                bodyStyle={{ padding: 0 }}
                extra={
                    <>
                        <span
                            className="curPoint"
                            onClick={() => setVisible(false)}
                        >
                            <CloseSvg />
                        </span>
                    </>
                }
            >
                <Collapse
                    expandIconPosition="right"
                    bordered={false}
                    className="dashboard-drawer"
                    expandIcon={({ isActive }) =>
                        isActive ? (
                            <MinusSvg
                                style={{
                                    color: "#999999",
                                }}
                            />
                        ) : (
                            <PlusSvg
                                style={{
                                    color: "#999999",
                                }}
                            />
                        )
                    }
                >
                    {location.pathname == dashboardRoutes.audit && (
                        <Panel
                            header="Choose Meeting Date"
                            className="callFilter-panel font16"
                        >
                            <CustomDateRangePicker
                                range={
                                    dashboard_filters.audit_filter
                                        .manualAuditDateRange
                                }
                                setRange={(value) => {
                                    dispatch(
                                        setDashboardFilters({
                                            ...dashboard_filters,
                                            audit_filter: {
                                                ...dashboard_filters.audit_filter,

                                                manualAuditDateRange: value,
                                            },
                                        })
                                    );
                                }}
                            />
                        </Panel>
                    )}
                    <Panel
                        header={
                            location.pathname === dashboardRoutes.audit
                                ? "Choose Auditor"
                                : "Choose Audit Type"
                        }
                        key="1"
                        className="callFilter-panel font16"
                    >
                        {location.pathname !== dashboardRoutes.audit && (
                            <AuditType
                                value={
                                    dashboard_filters?.audit_filter
                                        ?.audit_type ||
                                    auditConfig.AI_AUDIT_TYPE
                                }
                                onChange={(e) => {
                                    dispatch(
                                        setDashboardFilters({
                                            ...dashboard_filters,
                                            audit_filter: {
                                                audit_type: e.target.value,
                                                auditors:
                                                    e.target.value ===
                                                    auditConfig.AI_AUDIT_TYPE
                                                        ? []
                                                        : [0],
                                                manualAuditDateRange: [
                                                    null,
                                                    null,
                                                ],
                                            },
                                        })
                                    );
                                }}
                            />
                        )}

                        {!tempLevel &&
                            (dashboard_filters.audit_filter.audit_type ===
                                auditConfig.MANUAL_AUDIT_TYPE ||
                                location.pathname ===
                                    dashboardRoutes.audit) && (
                                <>
                                    {isAccountLevel ||
                                        location.pathname ===
                                            dashboardRoutes.audit || (
                                            <div className="marginB10">
                                                <CustomDateRangePicker
                                                    range={
                                                        dashboard_filters
                                                            .audit_filter
                                                            .manualAuditDateRange
                                                    }
                                                    setRange={(value) => {
                                                        dispatch(
                                                            setDashboardFilters(
                                                                {
                                                                    ...dashboard_filters,
                                                                    audit_filter:
                                                                        {
                                                                            ...dashboard_filters.audit_filter,

                                                                            manualAuditDateRange:
                                                                                value,
                                                                        },
                                                                }
                                                            )
                                                        );
                                                    }}
                                                />
                                            </div>
                                        )}
                                    <>
                                        {location.pathname ===
                                            dashboardRoutes.audit || (
                                            <div className="bold600 font18 marginB16">
                                                Choose Auditor
                                            </div>
                                        )}

                                        <Checkbox.Group
                                            className="flex row"
                                            onChange={(values) => {
                                                const index = values.findIndex(
                                                    (val) => val === 0
                                                );

                                                const prevIndex =
                                                    dashboard_filters?.audit_filter?.auditors.findIndex(
                                                        (val) => val === 0
                                                    );

                                                /* If index has 0 and prevIndex has no zero - Select All - Remove others  
                                IF index has no 0 and previndex has zero - Unselect All - Add others
                    */

                                                dispatch(
                                                    setDashboardFilters({
                                                        ...dashboard_filters,
                                                        audit_filter: {
                                                            ...dashboard_filters.audit_filter,
                                                            auditors:
                                                                values.length ===
                                                                1
                                                                    ? values
                                                                    : index >
                                                                          -1 &&
                                                                      prevIndex ===
                                                                          -1 &&
                                                                      values.length >
                                                                          1
                                                                    ? [0]
                                                                    : values.filter(
                                                                          (
                                                                              val
                                                                          ) =>
                                                                              val !==
                                                                              0
                                                                      ),
                                                        },
                                                    })
                                                );
                                            }}
                                            value={
                                                dashboard_filters?.audit_filter
                                                    ?.auditors
                                            }
                                        >
                                            <span className={"marginB20"}>
                                                <Checkbox value={0}>
                                                    All
                                                </Checkbox>
                                            </span>
                                            {auditors.map((user) => {
                                                return (
                                                    <span
                                                        key={user.id}
                                                        className={"marginB20"}
                                                    >
                                                        <Checkbox
                                                            value={user.id}
                                                        >
                                                            {user.first_name}
                                                        </Checkbox>
                                                    </span>
                                                );
                                            })}
                                        </Checkbox.Group>
                                    </>
                                </>
                            )}
                    </Panel>
                    {!tempLevel && (
                        <Panel
                            header={config.CALL_TAGS_LABEL}
                            key="filterTags"
                            id="filterTags"
                            className="font16"
                        >
                            <Select
                                name="tags"
                                mode="multiple"
                                placeholder={config.CALL_TAGS_PLACEHOLDER}
                                onChange={(call_tags) => {
                                    // dispatch(
                                    //     setDashboardFilters({
                                    //         ...dashboard_filters,
                                    //         call_tags
                                    //     })
                                    // );
                                    setCallTags(call_tags);
                                    if (accTags) setAccTags([]);
                                }}
                                value={callTags}
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                className="custom__tags__select placeholder__none"
                                suffixIcon={
                                    <Icon className="fas fa-chevron-down dove_gray_cl" />
                                }
                                dropdownClassName={"account_select_dropdown"}
                                style={{
                                    width: "100%",
                                }}
                            >
                                {allTags.map((tag) => (
                                    <Option key={tag.id} value={tag.id}>
                                        {tag.tag_name}
                                    </Option>
                                ))}
                            </Select>
                        </Panel>
                    )}
                    {tempLevel && (
                        <Panel header={"Account Tags"}>
                            <Select
                                name="tags"
                                mode="multiple"
                                placeholder={"Enter the account tags"}
                                onChange={(acc_tags) => {
                                    // dispatch(
                                    //     setDashboardFilters({
                                    //         ...dashboard_filters,
                                    //         acc_tags
                                    //     })
                                    // );
                                    setAccTags(acc_tags);
                                    if (callTags) setCallTags([]);
                                }}
                                value={accTags}
                                filterOption={(input, option) =>
                                    option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                className="custom__tags__select placeholder__none"
                                suffixIcon={
                                    <Icon className="fas fa-chevron-down dove_gray_cl" />
                                }
                                dropdownClassName={"account_select_dropdown"}
                                style={{
                                    width: "100%",
                                }}
                            >
                                {accountTags?.map((tag) => (
                                    <Option key={tag.id} value={tag.id}>
                                        {tag.tag}
                                    </Option>
                                ))}
                            </Select>
                        </Panel>
                    )}
                    {location.pathname !== dashboardRoutes.audit && (
                        <>
                            <Panel
                                header={"Status/Stage"}
                                className="callFilter-panel font16"
                                key="2"
                            >
                                <Select
                                    value={dashboard_filters.stage}
                                    onChange={(value) => {
                                        dispatch(
                                            setDashboardFilters({
                                                ...dashboard_filters,
                                                stage: value,
                                            })
                                        );
                                    }}
                                    optionFilterProp="children"
                                    className="custom__select filter__select"
                                    suffixIcon={
                                        <Icon className="fas fa-chevron-down dove_gray_cl" />
                                    }
                                    dropdownClassName={
                                        "account_select_dropdown"
                                    }
                                    placeholder={"Choose Status/Stage"}
                                    showSearch
                                >
                                    {filters.stage.map(({ id, stage }, idx) => (
                                        <Option value={id} key={idx}>
                                            {stage}
                                        </Option>
                                    ))}
                                </Select>
                            </Panel>
                            <Panel
                                header={"Choose Level"}
                                className="callFilter-panel font16"
                                key="3"
                            >
                                <Select
                                    value={
                                        tempLevel
                                            ? "Account"
                                            : meetingType === MeetingTypeConst
                                            ? "Chat"
                                            : "Call"
                                    }
                                    onChange={(value) => {
                                        if (
                                            value === "Chat" ||
                                            value === "Call"
                                        ) {
                                            setTempLevel(false);
                                        } else {
                                            setTempLevel(true);
                                        }
                                    }}
                                    optionFilterProp="children"
                                    className="custom__select filter__select"
                                    suffixIcon={
                                        <Icon className="fas fa-chevron-down dove_gray_cl" />
                                    }
                                    dropdownClassName={
                                        "account_select_dropdown"
                                    }
                                    placeholder={"Choose Level"}
                                >
                                    {[
                                        {
                                            id:
                                                meetingType ===
                                                MeetingTypeConst.calls
                                                    ? "Call"
                                                    : "Chat",
                                        },
                                        { id: "Account" },
                                    ].map(({ id }, idx) => (
                                        <Option value={id} key={idx}>
                                            {id}
                                        </Option>
                                    ))}
                                </Select>
                            </Panel>
                        </>
                    )}
                </Collapse>
            </Drawer>
        );
    },
    (prev, next) => prev.visible === next.visible
);
