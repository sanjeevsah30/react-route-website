import { createGoogleForm, setInitialState } from "@store/library/librarySlice";
import { Button } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import LeftArrowSvg from "app/static/svg/LeftArrowSvg";
import CustomTabs from "../../Resuable/Tabs/CustomTabs";

function LibarayNav() {
    const [activeTab, setActiveTab] = useState(
        window.location.pathname.includes("/resources")
            ? 1
            : window.location.pathname.includes("/assessment")
            ? 2
            : 1
    );

    const tabHandeler = (activetab_id) => {
        setActiveTab(activetab_id);
    };
    const dispatch = useDispatch();

    return (
        <>
            {!window.location.pathname.includes("/create") ? (
                <div className="navigation">
                    <ul className="custom__tabs">
                        <Link to={"/library/resources"}>
                            <li
                                key={1}
                                onClick={() => {
                                    tabHandeler(1);
                                }}
                                className={activeTab === 1 ? "active" : ""}
                            >
                                {"Resource"}
                            </li>
                        </Link>
                        <Link to={"/library/assessment"}>
                            <li
                                key={2}
                                onClick={() => {
                                    tabHandeler(2);
                                }}
                                className={activeTab === 2 ? "active" : ""}
                            >
                                {"Assessment"}
                            </li>
                        </Link>
                    </ul>
                    {activeTab === 2 ? (
                        <Link to="/library/assessment/create">
                            <Button
                                className="create_assignment_btn"
                                type="primary borderRadius5"
                                onClick={() => {
                                    dispatch(setInitialState({}));
                                    dispatch(createGoogleForm());
                                }}
                            >
                                CREATE
                            </Button>
                        </Link>
                    ) : (
                        <></>
                    )}
                </div>
            ) : (
                <div className="navigation1">
                    <Link to="/library/assessment">
                        <LeftArrowSvg />
                    </Link>
                    <ul className="custom__tabs marginL35">
                        {/* <Link to={'/library/resources'}> */}
                        <li
                            key={1}
                            onClick={() => {
                                tabHandeler(1);
                            }}
                            // className={activeTab === 1 ? 'active' : ''}
                            className="active"
                        >
                            {"Questions"}
                        </li>
                        {/* </Link> */}
                        {/* <Link to={'/library/assessment'}> */}
                        {/* <li
                            key={2}
                            onClick={() => {
                                tabHandeler(2);
                            }}
                            className={activeTab === 2 ? 'active' : ''}
                        >
                            {'Responses'}
                        </li> */}
                        {/* </Link> */}
                        {/* <Link to={'/library/assessment'}> */}
                        {/* <li
                            key={3}
                            onClick={() => {
                                tabHandeler(3);
                            }}
                            className={activeTab === 3 ? 'active' : ''}
                        >
                            {'Settings'}
                        </li> */}
                        {/* </Link> */}
                    </ul>
                </div>
            )}
        </>
    );
}

export default LibarayNav;
