import routes from "@constants/Routes/index";
import { createCITab, removeCITab } from "@store/cutsomerIntelligence/CISlice";
import { Popconfirm, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import CloseSvg from "app/static/svg/CloseSvg";
import PlusSvg from "app/static/svg/PlusSvg";
import AddTabModal from "../AddTabModal/AddTabModal";
import { Popover } from "antd";
import TwoRightChevronSVG from "app/static/svg/TwoRightChevronSVG";

export default function CITabs({
    tabs = [],
    activeTab,
    handleActiveTab,
    onTabDelete,
}) {
    const history = useHistory();
    const location = useLocation();
    const { slug } = useParams();
    const dispatch = useDispatch();
    const [showAddTab, setShowAddTab] = useState(false);
    const [newTabTitle, setNewTabTitle] = useState("");
    const [activeTabObj, setActiveTabObj] = useState({});
    const [isVisible, setIsVisible] = useState(false);
    const handleNewTab = (value) => {
        setNewTabTitle(value);
    };

    const handleSubmitNewTab = () => {
        if (newTabTitle) {
            dispatch(
                createCITab({
                    title: newTabTitle,
                })
            ).then(({ payload }) => {
                if (payload?.slug)
                    history.push(
                        `${routes.CI_DASHBOARD}/custom_tracking/${payload?.slug}`
                    );
                setNewTabTitle("");
            });
        }
        setShowAddTab(false);
        // onTabSelect({ key: newTab });
    };

    const handleDelete = (id) => {
        dispatch(removeCITab(id)).then(({ payload }) => {
            const newTabs = tabs.filter((e) => +e.id !== +id);
            if (newTabs.length)
                history.push(
                    `${routes.CI_DASHBOARD}/custom_tracking/${newTabs[0]?.slug}`
                );
            else {
                history.push(`${routes.CI_DASHBOARD}/custom_tracking`);
            }
        });
    };
    useEffect(() => {
        setActiveTabObj(
            slug
                ? tabs.find(
                      (e) => e?.slug?.toLowerCase() === slug?.toLowerCase()
                  ) !== undefined
                    ? tabs.find(
                          (e) => e?.slug?.toLowerCase() === slug?.toLowerCase()
                      )
                    : {}
                : {}
        );
    }, [location.pathname]);

    const tagCountToshow =
        tabs.slice(0, 5).find((e) => e.id === activeTabObj.id) === undefined
            ? 4
            : 5;

    return (
        <>
            <ul
                className="ci__tabs"
                style={{
                    minWidth: 0,
                }}
            >
                <>
                    {Object.keys(activeTabObj).length === 0 ? (
                        tabs
                            .slice(0, 5)
                            ?.map((tab) => (
                                <TabUI
                                    tab={tab}
                                    handleDelete={handleDelete}
                                    history={history}
                                    slug={slug}
                                />
                            ))
                    ) : (
                        <>
                            {tabs
                                .slice(0, 5)
                                .find((e) => e.id === activeTabObj.id) ===
                            undefined ? (
                                <>
                                    {tabs.slice(0, 4)?.map((tab) => (
                                        <TabUI
                                            tab={tab}
                                            handleDelete={handleDelete}
                                            history={history}
                                            slug={slug}
                                        />
                                    ))}
                                    <TabUI
                                        tab={activeTabObj}
                                        handleDelete={handleDelete}
                                        history={history}
                                        slug={slug}
                                    />
                                </>
                            ) : (
                                <>
                                    {tabs.slice(0, 5)?.map((tab) => (
                                        <TabUI
                                            tab={tab}
                                            handleDelete={handleDelete}
                                            history={history}
                                            slug={slug}
                                        />
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </>
            </ul>
            {tabs?.length !== 0 && tabs?.length > 5 ? (
                <Popover
                    placement="bottomRight"
                    open={isVisible}
                    visible={isVisible}
                    onVisibleChange={(status) => {
                        setIsVisible(status);
                    }}
                    content={tabs.slice(tagCountToshow)?.map((tab) => (
                        <Tooltip
                            title={
                                <div className="capitalize">{tab?.title}</div>
                            }
                            key={tab?.slug}
                            placement="left"
                        >
                            <div
                                key={tab?.id}
                                onClick={() => {
                                    history.push(
                                        `${routes.CI_DASHBOARD}/custom_tracking/${tab?.slug}`
                                    );
                                    setActiveTabObj(tab);
                                    setIsVisible(false);
                                }}
                                className={`min_width_0_flex_child paddingLR17 paddingTB13 ${
                                    slug?.toLowerCase() ===
                                    tab?.slug?.toLowerCase()
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <div className="curPoint elipse_text">
                                    {tab?.title}
                                </div>
                            </div>
                        </Tooltip>
                    ))}
                    trigger="click"
                    overlayClassName="ci_tag_list_wrapper"
                    style={{ height: "338px" }}
                >
                    <TwoRightChevronSVG
                        className="marginL33 marginR20"
                        onClick={() => setIsVisible(true)}
                    />
                </Popover>
            ) : (
                <></>
            )}
            <div className="marginL10 paddingL10 add_tab_parent">
                <div
                    className="add_tab curPoint "
                    onClick={() => setShowAddTab(true)}
                >
                    <PlusSvg />
                </div>
            </div>

            <AddTabModal
                onCancel={() => setShowAddTab(false)}
                onOk={() => handleSubmitNewTab()}
                isVisible={showAddTab}
                handleChange={handleNewTab}
                tabName={newTabTitle}
            />
        </>
    );
}

const TabUI = ({ tab, handleDelete, history, slug }) => (
    <Tooltip
        title={<div className="capitalize">{tab?.title}</div>}
        key={tab?.slug}
    >
        <li
            key={tab?.id}
            onClick={() => {
                history.push(
                    `${routes.CI_DASHBOARD}/custom_tracking/${tab?.slug}`
                );
            }}
            className={
                slug?.toLowerCase() === tab?.slug?.toLowerCase()
                    ? "active min_width_0_flex_child"
                    : "min_width_0_flex_child"
            }
        >
            <div className="min_width_0_flex_child elipse_text">
                {tab?.title}
            </div>
            {tab.is_removable && (
                <Popconfirm
                    title="Are you sure to delete this tab?"
                    onConfirm={(evt) => handleDelete(tab?.id)}
                    okText="Yes"
                    cancelText="No"
                    placement="bottom"
                >
                    <div
                        style={{
                            transform: "scale(0.6)",
                            paddingLeft: "25px",
                            borderLeft:
                                slug?.toLowerCase() === tab?.slug?.toLowerCase()
                                    ? "1px solid #1a62f2"
                                    : "1px solid #333",
                        }}
                        className={
                            slug?.toLowerCase() === tab?.slug?.toLowerCase()
                                ? "primary_cl flex alignCenter"
                                : "mine_shaft_cl flex alignCenter"
                        }
                    >
                        <CloseSvg />
                    </div>
                </Popconfirm>
            )}
        </li>
    </Tooltip>
);
