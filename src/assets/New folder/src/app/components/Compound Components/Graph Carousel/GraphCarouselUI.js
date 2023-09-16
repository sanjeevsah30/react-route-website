import { GRAPH_DIVISION } from "@constants/Account/index";
import { formatDateForAccounts, goToAccount } from "@tools/helpers";
import { Skeleton, Tooltip } from "antd";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ChevronLeftSvg from "app/static/svg/ChevronLeftSvg";
import ChevronRightSvg from "app/static/svg/ChevronRightSvg";
import NoDataSvg from "app/static/svg/NoDataSvg";
import GraphCarousel from "./GraphCarousel";
import GraphCarouselContext from "./GraphCarouselContext";
import "./style.scss";

function GraphCarouselUI(props) {
    const {
        graph,
        graphContainer,
        loading,
        headerStyle,
        sales_task,
        isAccountsGraph,
    } = useContext(GraphCarouselContext);
    const [graphDateIndex, setGraphDateIndex] = useState({
        start_index: -1,
        end_index: -1,
    });
    const isSameYear = (y1, y2) => y1 === y2;

    const formatDate = (epoch, showYear = true) => {
        const date = new Date(epoch * 1000);

        const dd = date.getUTCDate();
        const mm = date.getUTCMonth() + 1;
        const yy = date.getUTCFullYear();

        return formatDateForAccounts([yy, mm, dd], showYear);
    };

    useEffect(() => {
        if (graph.length) {
            goToEnd();
        }
    }, [graph]);

    const goToEnd = () => {
        const carouselCount = Math.ceil(graph.length / GRAPH_DIVISION);
        const default_start_index = (carouselCount - 1) * GRAPH_DIVISION;
        const default_end_index = graph.length - 1;
        setGraphDateIndex({
            start_index: default_start_index,
            end_index: default_end_index,
        });
    };
    const goToStart = () => {
        setGraphDateIndex({
            start_index: 0,
            end_index: GRAPH_DIVISION - 1,
        });
    };

    const handlePrev = useCallback(() => {
        if (graphDateIndex.start_index - GRAPH_DIVISION < 0) {
            return goToEnd();
        }
        setGraphDateIndex({
            start_index: graphDateIndex.start_index - GRAPH_DIVISION,
            end_index: graphDateIndex.start_index - 1,
        });
    }, [graphDateIndex]);

    const handleNext = useCallback(() => {
        const carouselCount = Math.ceil(graph.length / GRAPH_DIVISION);
        const default_start_index = (carouselCount - 1) * GRAPH_DIVISION;
        if (
            graphDateIndex.start_index + GRAPH_DIVISION ===
            default_start_index
        ) {
            return goToEnd();
        }
        if (graphDateIndex.start_index + GRAPH_DIVISION >= graph.length) {
            return goToStart();
        }

        setGraphDateIndex({
            start_index: graphDateIndex.end_index + 1,
            end_index: graphDateIndex.end_index + GRAPH_DIVISION,
        });
    }, [graphDateIndex]);

    const getYear = (epoch) => {
        const yy = new Date(epoch * 1000).getFullYear();
        return yy;
    };
    const { domain } = useSelector(({ common }) => common);

    return (
        <>
            <div
                className="flexShrink flex alignCenter"
                style={{
                    ...headerStyle,
                }}
            >
                {!isAccountsGraph && sales_task?.id && (
                    <Tooltip title={"Account Name"}>
                        <div
                            className="bold700 curPoint marginR20 primary_hover"
                            onClick={() => {
                                goToAccount({
                                    domain,
                                    id: sales_task.id,
                                });
                            }}
                        >
                            {sales_task?.name || sales_task?.id}
                        </div>
                    </Tooltip>
                )}
                <div
                    className="borderRadius5 padding8 white_bg font14 bold600  flex alignCenter "
                    style={{
                        background: "#DFEAFF66",
                    }}
                >
                    {graph.length ? (
                        <>
                            <div>
                                <span className="font12">
                                    {/* {start_date &&
                        formatDateForAccounts(
                            start_date?.split(['-']),
                            !isSameYear(
                                start_date?.split(['-'])[0],
                                close_date?.split(['-'])[0]
                            )
                        )} */}
                                    {graphDateIndex.start_index !== -1 &&
                                        formatDate(
                                            graph[graphDateIndex.start_index]
                                                .epoch,
                                            !isSameYear(
                                                getYear(
                                                    graph[
                                                        graphDateIndex
                                                            .start_index
                                                    ].epoch
                                                ),
                                                getYear(
                                                    graph[
                                                        graphDateIndex.end_index
                                                    ].epoch
                                                )
                                            )
                                        )}
                                    {" - "}
                                    {/* {close_date &&
                        formatDateForAccounts(
                            close_date?.split(['-'])
                        )} */}
                                    {graphDateIndex.end_index !== -1 &&
                                        formatDate(
                                            graph[graphDateIndex.end_index]
                                                .epoch
                                        )}
                                </span>
                            </div>
                            <span
                                className="curPoint marginL10 marginR14"
                                onClick={() => {
                                    const left =
                                        document.querySelector(".slick-prev");
                                    left && left.click();
                                }}
                            >
                                <ChevronLeftSvg />
                            </span>
                            <span
                                className="curPoint"
                                onClick={() => {
                                    const left =
                                        document.querySelector(".slick-next");
                                    left && left.click();
                                }}
                            >
                                <ChevronRightSvg />
                            </span>
                        </>
                    ) : (
                        <span>No date found</span>
                    )}
                </div>
                <div className=" marginL40 flex">
                    <div className=" marginR16  flex alignCenter">
                        <CallMark className="call__mark primary_bg" />
                        <div className=" graph__types">Inbound Email</div>
                    </div>
                    <div className=" marginR16  flex alignCenter">
                        <CallMark className="call__mark sunshade_bg" />
                        <div className=" graph__types">Calls</div>
                    </div>
                    <div className=" marginR16  flex alignCenter">
                        <CallMark className="call__mark robin_egg_blue_bg" />
                        <div className=" graph__types">Outbound Email</div>
                    </div>
                </div>
            </div>
            <div
                className="marginT10 custom--graph borderRadius5 border flex1 white_bg posRel"
                ref={graphContainer}
            >
                {loading ? (
                    <div className="flex alignCenter justifyCenter height100p paddingLR16">
                        <Skeleton active />
                    </div>
                ) : graph?.length ? (
                    <GraphCarousel
                        data={graph}
                        setGraphDateIndex={setGraphDateIndex}
                        graphDateIndex={graphDateIndex}
                        handlePrev={handlePrev}
                        handleNext={handleNext}
                    />
                ) : (
                    <div className="flex height100p column alignCenter justifyCenter">
                        <NoDataSvg />
                        <div className="bold700 font18 marginT10">
                            Nothing to show here!
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function CallMark({ className }) {
    return <div className={`inlineBlock ${className}`} />;
}

GraphCarouselUI.defaultProps = {
    headerStyle: {},
};
export default GraphCarouselUI;
