import { AutoComplete, Button, Col, Skeleton, Tabs, Tag } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import AccCallsCard from "./AccCallsCard";
import AccCallDetails from "./AccCallDetails";

import { useDispatch } from "react-redux";
import { AccountsContext } from "../../../Accounts";
import { getTranscript } from "@store/individualcall/actions";
import { ALL, CALLS, EMAILS } from "@constants/Account";
import {
    fetchAccountCallsAndEmails,
    setAccountSearchFilter,
} from "@store/accounts/actions";
import { accountFiltersPayload } from "@tools/searchFactory";
import CardsLoading from "./CardsLoading";
import NoCallsSvg from "app/static/svg/NoCallsSvg";
import NoDataSvg from "app/static/svg/NoDataSvg";
import SearchSvg from "app/static/svg/SearchSvg";
import NoSearchResultsSvg from "app/static/svg/NoSearchResultsSvg";
import NoEmailsSvg from "app/static/svg/NoEmailsSvg";
import ReactVirtualCard from "@presentational/reusables/ReactVirtualCard";
import AntClose from "@presentational/reusables/AntClose";
import GraphCarouselTab from "app/components/Compound Components/Graph Carousel/GraphCarouselTab";
const { Option } = AutoComplete;

const { TabPane } = Tabs;

function RightSection({
    availableHeight,
    setShowResetForCalls,
    showResetForCalls,
    callsContainerRef,
}) {
    const graphContainer = useRef(null);

    const {
        state: { activeCall, currentAccountId },
        setActiveCall,
        setActiveTranscripts,
        accountCalls: { count, next, results },
        individualcall,
        graph,
        loaders,
        searchFilters,
    } = useContext(AccountsContext);

    const [searchOpen, setSearchOpen] = useState(false);
    const [toSearch, setToSearch] = useState("");
    const [searchActive, setSearchActive] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        /* Count never changes once you get it from api.It changes only if you filter the calls.
        This is to set the default call when the page is loaded */
        if (count) {
            setActiveCall(results[0]);
        } else {
            setActiveCall(null);
        }
    }, [count]);

    useEffect(() => {
        /* Check wheater you have stored the transcript data in redux. If not the make the request. 
        false flag is not to run the clubTranscript funtion as it is not needed */
        if (activeCall && !individualcall[activeCall.id]) {
            dispatch(getTranscript(activeCall.id, false));

            return;
        }

        if (activeCall && individualcall[activeCall.id]) {
            setActiveTranscripts(individualcall?.[activeCall?.id]);
            return;
        }
        setActiveTranscripts(null);
    }, [activeCall, individualcall]);

    const onLoadMore = () => {
        const { topics, clients, reps, keyword, aiDataFilter, date } =
            searchFilters;
        dispatch(
            fetchAccountCallsAndEmails({
                next,
                payload: accountFiltersPayload({
                    topics,
                    clients,
                    reps,
                    acc_id: currentAccountId,
                    keyword,
                    aiDataFilter,
                    date,
                }),
            })
        );
    };

    const resetCalls = (e) => {
        dispatch(
            setAccountSearchFilter({
                keyword: "",
            })
        );
        setToSearch("");
        setShowResetForCalls((prev) => !prev);
        setSearchActive((prev) => !prev);
    };

    return (
        <>
            <Col span={24} className="flex column graph_container upperHeight">
                <GraphCarouselTab
                    loading={loaders.graphLoader}
                    graph={graph}
                    graphContainer={graphContainer}
                    headerStyle={{}}
                    isAccountsGraph={true}
                />
            </Col>
            <Col
                className="border calls__container marginR10"
                ref={callsContainerRef}
                flex={"240px"}
            >
                {searchOpen && (
                    <div className="search_container show_search_container">
                        <div className="posRel">
                            <AutoComplete
                                placeholder="Search Keyword"
                                className="width100p"
                                style={{
                                    height: "30px",
                                }}
                                onSearch={(string) => {
                                    setToSearch(string);
                                }}
                                onSelect={(_, option) => {
                                    dispatch(
                                        setAccountSearchFilter({
                                            activeTab: option.value,
                                            keyword: toSearch,
                                        })
                                    );
                                    setSearchActive(true);
                                }}
                                value={toSearch}
                                defaultOpen={true}
                                autoFocus={true}
                                defaultActiveFirstOption={true}
                            >
                                {toSearch ? (
                                    [ALL, CALLS, EMAILS].map((tab) => (
                                        <Option key={tab} value={tab}>
                                            <div className="padding8 curPoint search__result--hover--active">
                                                <SearchSvg />{" "}
                                                <span className="bold mine_shaft_cl marginR textTansformNone">
                                                    {toSearch}
                                                </span>{" "}
                                                <Tag
                                                    color="#99999933"
                                                    className="dusty_gray_cl--important marginB10 textTansformNone"
                                                >
                                                    <span>
                                                        in:#
                                                        {tab.toLowerCase()}
                                                    </span>
                                                </Tag>
                                            </div>
                                        </Option>
                                    ))
                                ) : (
                                    <></>
                                )}
                            </AutoComplete>
                            <AntClose
                                onClick={() => {
                                    setSearchOpen(false);
                                    searchActive && resetCalls();
                                }}
                            />
                        </div>
                    </div>
                )}

                <Tabs
                    activeKey={searchFilters.activeTab}
                    onChange={(key) => {
                        dispatch(
                            setAccountSearchFilter({
                                activeTab: key,
                            })
                        );
                    }}
                    className="accounts__detailspage__body--tabs--container"
                    tabBarExtraContent={
                        <>
                            {searchOpen || (
                                <Button
                                    shape="circle"
                                    icon={<SearchSvg />}
                                    className="search_btn"
                                    onClick={() => setSearchOpen(true)}
                                />
                            )}
                        </>
                    }
                >
                    <TabPane tab={ALL} key={ALL}>
                        {loaders.callsLoader ? (
                            <CardsLoading />
                        ) : !!results?.length ? (
                            <ReactVirtualCard
                                hasNextPage={next || null}
                                data={results || []}
                                onLoadMore={onLoadMore}
                                Component={AccCallsCard}
                                activeCall={activeCall}
                                onClick={setActiveCall}
                                className="flex1 overflowYscroll"
                            />
                        ) : (
                            // <InfiniteLoader
                            //     hasNextPage={next || null}
                            //     data={results || []}
                            //     Component={AccCallsCard}
                            //     activeCall={activeCall}
                            //     onClick={setActiveCall}
                            //     onLoadMore={onLoadMore}
                            //     className="flex1 overflowYscroll"
                            // />
                            <div className="flex alignCenter justifyCenter column height100p ">
                                <NoCallsSvg />
                                <div className="bold700 font18 marginT10">
                                    No Results Found !
                                </div>
                            </div>
                        )}
                    </TabPane>
                    <TabPane tab={CALLS} key={CALLS}>
                        {loaders.callsLoader ? (
                            <CardsLoading />
                        ) : !!results?.length ? (
                            <ReactVirtualCard
                                hasNextPage={next || null}
                                data={results || []}
                                onLoadMore={onLoadMore}
                                Component={AccCallsCard}
                                activeCall={activeCall}
                                onClick={setActiveCall}
                                className="flex1 overflowYscroll"
                            />
                        ) : (
                            // <InfiniteLoader
                            //     hasNextPage={next || null}
                            //     data={results || []}
                            //     Component={AccCallsCard}
                            //     activeCall={activeCall}
                            //     onClick={setActiveCall}
                            //     onLoadMore={onLoadMore}
                            //     className="flex1 overflowYscroll"
                            // />
                            <div className="flex alignCenter justifyCenter column height100p">
                                {searchActive ? (
                                    <NoSearchResultsSvg />
                                ) : (
                                    <NoCallsSvg />
                                )}
                                <div className="bold700 font18 marginT10">
                                    {searchActive
                                        ? "No Search Results!"
                                        : " No Calls Found !"}
                                </div>
                            </div>
                        )}
                    </TabPane>
                    <TabPane tab={EMAILS} key={EMAILS}>
                        {loaders.callsLoader ? (
                            <CardsLoading />
                        ) : (
                            <div className="flex alignCenter justifyCenter column height100p">
                                {searchActive ? (
                                    <NoSearchResultsSvg />
                                ) : (
                                    <NoEmailsSvg />
                                )}
                                <div className="bold700 font18 marginT10">
                                    {searchActive
                                        ? "No Search Results!"
                                        : "No Emails Found!"}
                                </div>
                            </div>
                        )}
                    </TabPane>
                </Tabs>
            </Col>
            <Col flex={"auto"} className=" meeting__details__section">
                <div
                    className="posAbs width100p  border borderRadius5"
                    style={{
                        minHeight: "100%",
                    }}
                >
                    {loaders.callsLoader || loaders.mainLoader ? (
                        <Skeleton
                            className="padding16"
                            active
                            title={false}
                            paragraph={{
                                rows: 8,
                            }}
                        />
                    ) : activeCall && searchFilters.activeTab !== EMAILS ? (
                        <AccCallDetails
                            {...activeCall}
                            searchActive={searchActive}
                            calls={results}
                        />
                    ) : (
                        <div className="flex column alignCenter justifyCenter posAbsCenter">
                            <NoDataSvg />
                            <div className="bold700 font18 marginT10">
                                Nothing to show here !
                            </div>
                        </div>
                    )}
                </div>
            </Col>
            {/* <Col flex={'260px'}>Col 2</Col>
            <Col flex={'auto'}>Col 3</Col> */}
        </>
    );
}

RightSection.defaultProps = {
    setShowResetForCalls: () => {},
};

export default RightSection;
