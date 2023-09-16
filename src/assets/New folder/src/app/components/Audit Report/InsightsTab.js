import reportConfig from "@constants/Report/index";
import NoData from "@presentational/reusables/NoData";
import Spinner from "@presentational/reusables/Spinner";
import { Table, Tabs, Layout, Menu } from "antd";
import React, { useContext, useState } from "react";
import { ReportContext } from "./AuditReport";

const { TabPane } = Tabs;
const { Header, Sider, Content } = Layout;

function InsightsTab() {
    const { TOP_INSIGHTS_TAB, CATEGORY_INSIGHTS_TAB } = reportConfig;

    const [insightTab, setInsightTab] = useState(TOP_INSIGHTS_TAB);

    const {
        insightsColumList,
        top_insights: { best_performance, worst_performance },
        category_insights,
        compareText,
        topInsightsLoading,
        categoryInsightsLoading,
    } = useContext(ReportContext);

    const [active_category, setActive_category] = useState("0");
    return (
        <Tabs
            activeKey={insightTab}
            onChange={(key) => setInsightTab(key)}
            className="insights_tab"
        >
            <TabPane tab={TOP_INSIGHTS_TAB} key={TOP_INSIGHTS_TAB}>
                <Spinner loading={topInsightsLoading}>
                    {!!!best_performance.length &&
                        !!!best_performance.length && (
                            <NoData description={"No Data Available"} />
                        )}
                    {!!best_performance.length && (
                        <div className="posRel insightsTable">
                            <div className="insights_banner_container flex alignCenter">
                                <div className="insights_banner flex alignCenter justifyCenter textWhite bgGreen">
                                    <div>BEST PERFORMING PARAMETERS</div>
                                </div>
                                <span className="greyText last_update_info fotn14">
                                    {compareText("Variations compared from ")}
                                </span>
                            </div>
                            <Table
                                pagination={false}
                                columns={insightsColumList}
                                dataSource={best_performance}
                                scroll={{ x: "max-content" }}
                                rowKey={"parameter"}
                                style={{
                                    marginBottom: "80px",
                                }}
                            />
                        </div>
                    )}
                    {!!worst_performance.length && (
                        <div className="posRel insightsTable">
                            <div className="insights_banner_container flex alignCenter">
                                <div className="insights_banner flex alignCenter justifyCenter textWhite bgRed">
                                    <div>WORST PERFORMING PARAMETERS</div>
                                </div>
                                <span className="greyText last_update_info fotn14">
                                    {compareText("Variations compared from ")}
                                </span>
                            </div>
                            <Table
                                pagination={false}
                                columns={insightsColumList}
                                dataSource={worst_performance}
                                scroll={{ x: "max-content" }}
                                rowKey={"parameter"}
                            />
                        </div>
                    )}
                </Spinner>
            </TabPane>
            <TabPane tab={CATEGORY_INSIGHTS_TAB} key={CATEGORY_INSIGHTS_TAB}>
                <Spinner loading={categoryInsightsLoading}>
                    <Layout className="category_insights_container bgWhite paddingTB3">
                        <Header className="bgWhite">
                            <div className="textBlack bold font16 paddingL8">
                                Categories
                            </div>
                        </Header>
                        <Layout>
                            <Sider className="bgWhite" width={293}>
                                <Menu
                                    style={{ width: 293 }}
                                    mode="inline"
                                    theme="light"
                                    onClick={(e) =>
                                        setActive_category(e.key.toString())
                                    }
                                    selectedKeys={[active_category]}
                                >
                                    {category_insights.map(
                                        ({ id, name }, idx) => (
                                            <Menu.Item key={idx}>
                                                <span>{name}</span>
                                            </Menu.Item>
                                        )
                                    )}
                                </Menu>
                            </Sider>
                            <Content className="bgWhite">
                                <div className="paddingLR16">
                                    <Table
                                        pagination={false}
                                        columns={insightsColumList.filter(
                                            ({ title }) => {
                                                return title !== "Categories";
                                            }
                                        )}
                                        dataSource={
                                            category_insights[+active_category]
                                                ?.insight
                                        }
                                        scroll={{
                                            x: "max-content",
                                        }}
                                        rowKey={"parameter"}
                                    />
                                </div>
                            </Content>
                        </Layout>
                    </Layout>
                </Spinner>
            </TabPane>
        </Tabs>
    );
}

export default InsightsTab;
