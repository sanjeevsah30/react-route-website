// Presentational Top navigation component.

import React, { useEffect, useRef, useState } from "react";
import { FilterFilled } from "@ant-design/icons";
import { Icon } from "@reusables";
import TopbarConfig from "@constants/Topbar";
import { Layout, Button, Drawer, Popover } from "antd";
import TopbarFilters from "./TopbarFilters";
import UploadCall from "../../UploadCall/index";
import JoinCall from "../../JoinCall/JoinCall";
import CallName from "../../MyMeetings/CallName";
import { useDispatch, useSelector } from "react-redux";
import commonConfig from "@constants/common/index";
import { useLocation } from "react-router";
import GlobalSearch from "../../GlobalSearch/GlobalSearch";
import { changeActiveTeam } from "@store/common/actions";
import sidebarConfig from "@constants/Sidebar/index";
import { Input } from "antd";
import PageFilters from "@presentational/PageFilters/PageFilters";
import UploadSvg from "app/static/svg/UploadSvg";
import BulkUploadQmsModal from "../../UploadCall/BulkUploadQmsModal";
import { permissions_manager } from "tools/helpers";
const { Header } = Layout;

const { Search } = Input;

const TopbarUI = (props) => {
    // const user = useSelector((state) => state.auth);
    const isFilterActive = props.activePageConfig
        ? props.activePageConfig.isFilterActive
        : false;
    const isCallActive = props.isCallActive;
    const showButtons =
        props.activePageConfig &&
        props.activePageConfig.title === TopbarConfig.CALLPAGETITLE
            ? true
            : false; // Show the Buttons only on the My Calls page.
    // const showTrackersButton =
    //     props.activePageConfig &&
    //     props.activePageConfig.title === TopbarConfig.SEARCHTITLE
    //         ? true
    //         : false; // Show the tracker button on Search Page.

    const location = useLocation();
    const search = location.search;
    const widget = new URLSearchParams(search).get("widget");

    const { auth } = useSelector((state) => state);

    return (
        <Header className="app__main--header" theme="light">
            {widget && (
                <div className="no_menu--logo">
                    <img
                        src={
                            require("../../../static/images/convin-black.png")
                                .default
                        }
                        alt="convin"
                    />
                </div>
            )}
            {/* <div className={`header__container ${widget ? 'no_menu' : ''}`}> */}
            <div
                className={
                    isCallActive ? "call-active topbar-title" : "topbar-title"
                }
            >
                {/* {isCallActive ? (
                    <button
                        className={'accessibility'}
                        type={'button'}
                        onClick={props.removeActiveCall}
                    >
                        <Icon className={TopbarConfig.BACKICON} />
                    </button>
                ) : (
                    ''
                )} */}
                {isCallActive ? (
                    // <span>{props.activeCall['callName']}</span>
                    // <CallName
                    //     title={props.activeCall['callName']}
                    //     callId={props.activeCall['callId']}
                    //     showOwnerActions={userHasAccess}
                    // />
                    <></>
                ) : props?.activePageConfig?.title === "Library" &&
                  location?.pathname?.split("/").length === 3 ? (
                    <></>
                ) : (
                    <span className="font18 marginL11 bold600 mine_shaft_cl">
                        {props?.activePageConfig &&
                        props?.activePageConfig?.hideTitle
                            ? ""
                            : props?.activePageConfig?.title}
                    </span>
                )}
            </div>
            <div
                className="flex row flex1"
                style={{
                    justifyContent: "flex-end",
                }}
            >
                <div className="flex alignCenter">
                    {isFilterActive && !isCallActive && (
                        <div>
                            <PageFilters
                                showTagsFilter={
                                    props?.activePageConfig.title ===
                                        "Statistics" ||
                                    props?.activePageConfig.title ===
                                        "Customer Intelligence"
                                }
                            />
                            <div className="drawer">
                                <Button
                                    className="filterbtn"
                                    type={"link"}
                                    icon={<FilterFilled />}
                                    onClick={() => props.handleDrawer(true)}
                                >
                                    Filter
                                </Button>
                                <Drawer
                                    title={TopbarConfig.DRAWERTITLE}
                                    placement="right"
                                    closable={true}
                                    onClose={() => props.handleDrawer(false)}
                                    visible={props.showSideDrawer}
                                    width={window.innerWidth}
                                >
                                    <TopbarFilters {...props} />
                                </Drawer>
                            </div>
                        </div>
                    )}
                </div>
                <div
                    className="col-7 flexImp"
                    style={{
                        justifyContent: "flex-end",
                    }}
                >
                    {(!props?.activePageConfig?.hideSearch || isCallActive) &&
                        window.location.href.split("/").pop() !==
                            "user_manager" && (
                            <div className="maxWidthp100 flex alignCenter">
                                <GlobalSearch
                                    activePageConfig={props.activePageConfig}
                                />
                            </div>
                        )}
                </div>
                <div className="col-3 flexImp alignCenter justifyCenter">
                    {showButtons && !widget ? (
                        <div
                            className={`btn-section flex ${
                                isCallActive ? "hidden" : ""
                            }`}
                        >
                            {auth.user_type !== 0 ? <MoreOptions /> : <></>}
                            <JoinCall />
                        </div>
                    ) : null}
                </div>
                {/* <div className="col-3 flexImp alignCenter justifyCenter">
                    <Button type="primary" onClick={() => {}}>
                        Submit Audit
                    </Button>
                </div> */}
            </div>
        </Header>
    );
};

function MoreOptions() {
    const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);
    // const [qmsPermissions, setQmsPermissions] = useState({});
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const { code_names } = useSelector((state) => state.auth);
    // useEffect(() => {
    //     setQmsPermissions(permissions_manager(code_names, "QMS"));
    // }, [code_names]);
    return (
        <>
            <Popover
                content={
                    <div onClick={(e) => e.stopPropagation()}>
                        <div
                            className="option"
                            onClick={() => {
                                ref1?.current?.openUpladCallModal?.();
                                setMoreOptionsVisible(false);
                            }}
                        >
                            Upload Call
                        </div>

                        <div
                            className="option"
                            onClick={() => {
                                ref2?.current?.openBulkUpladQmsModal?.();
                                setMoreOptionsVisible(false);
                            }}
                        >
                            Upload QMS Data
                        </div>
                    </div>
                }
                title=""
                trigger="click"
                visible={moreOptionsVisible}
                onVisibleChange={(visible) => setMoreOptionsVisible(visible)}
                overlayClassName={"completed_card_more_options_popover"}
                placement="bottom"
            >
                <Button
                    className="upload-call"
                    shape="round"
                    icon={<UploadSvg />}
                    type="link"
                    onClick={() => {}}
                />
            </Popover>
            <UploadCall ref={ref1} />
            <BulkUploadQmsModal ref={ref2} />
        </>
    );
}

export default TopbarUI;
