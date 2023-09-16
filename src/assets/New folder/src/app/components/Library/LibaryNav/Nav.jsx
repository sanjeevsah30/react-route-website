import { Button } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LeftArrowSvg from "app/static/svg/LeftArrowSvg";

function Nav({
    tabs,
    backButton = "",
    createLink = "",
    onClickHandler = () => {},
    activeTab,
    setActiveTab,
}) {
    const tabHandeler = (activetab_idx) => {
        setActiveTab(activetab_idx);
    };

    const { id } = useSelector(
        (state) => state.librarySlice.assessment.formData
    );

    const { versionData } = useSelector((state) => state.common);
    // tabs not need to show for b2b domains
    const tabDontShow = ["Assessment"];
    return (
        <>
            {
                <div className="navigation">
                    <ul className="custom__tabs">
                        {!!backButton && (
                            <Link to={backButton}>
                                <LeftArrowSvg />
                            </Link>
                        )}
                        {versionData.domain_type === "b2b" ? (
                            <>
                                {tabs
                                    .filter(
                                        (e) =>
                                            !tabDontShow.includes(e.tab_title)
                                    )
                                    .map((tab) => (
                                        <SubNav
                                            tab={tab}
                                            id={id}
                                            tabHandeler={tabHandeler}
                                            activeTab={activeTab}
                                        />
                                    ))}
                            </>
                        ) : (
                            <>
                                {tabs.map((tab) => (
                                    <SubNav
                                        tab={tab}
                                        id={id}
                                        tabHandeler={tabHandeler}
                                        activeTab={activeTab}
                                    />
                                ))}
                            </>
                        )}
                    </ul>
                    {createLink ? (
                        <Link to={createLink}>
                            <Button
                                className="create_assignment_btn"
                                type="primary borderRadius5"
                                onClick={onClickHandler}
                            >
                                CREATE
                            </Button>
                        </Link>
                    ) : (
                        <></>
                    )}
                </div>
            }
        </>
    );
}

const SubNav = ({ id, tab, tabHandeler, activeTab }) => (
    <Link
        to={
            window.location.pathname.includes("/library/assessment/analysis")
                ? `${tab?.link}/${id}`
                : tab?.link
        }
    >
        <li
            key={tab.id}
            onClick={() => {
                tabHandeler(tab.id);
            }}
            className={activeTab === tab.id ? "active" : ""}
        >
            {tab?.tab_title}
        </li>
    </Link>
);
export default Nav;
