import React, { useContext, useState } from "react";
import { Carousel, Popover } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import { formatDateForAccounts, uid } from "@tools/helpers";
import { useDispatch, useSelector } from "react-redux";
import { setAccountSearchFilter } from "@store/accounts/actions";
import { GRAPH_DIVISION } from "@constants/Account/index";
import GraphPhoneSvg from "app/static/svg/GraphPhoneSvg";
import ChevronRightSvg from "app/static/svg/ChevronRightSvg";
import { getActiveUrl } from "@apis/common/index";
import GraphCarouselContext from "./GraphCarouselContext";
import CloseSvg from "app/static/svg/CloseSvg";
import { message } from "antd";
import { useParams } from "react-router-dom";

const arrowStyle = {
    color: "#1A62F2",
    fontSize: "12px",
    background: "#DFEAFF",
    height: "40px",
    width: "12px",
    display: "flex",
    alignItems: "center",
    borderRadius: "0 5px 5px 0",
};

// from https://react-slick.neostack.com/docs/example/custom-arrows

const GraphCarousel = ({
    height,
    data = [],
    setGraphDateIndex,
    graphDateIndex,
    handlePrev,
    handleNext,
}) => {
    const contentStyle = {
        width: "100%",
        textAlign: "center",
        height: `100%`,
    };

    const SampleNextArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{
                    ...style,
                    ...arrowStyle,
                    borderRadius: "5px 0 0 5px",
                }}
                onClick={onClick}
            >
                <RightOutlined />
            </div>
        );
    };

    const SamplePrevArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{
                    ...style,
                    ...arrowStyle,
                }}
                onClick={onClick}
            >
                <div>
                    <LeftOutlined />
                </div>
            </div>
        );
    };
    const division = GRAPH_DIVISION;
    const carouselCount = Math.ceil(data.length / division);

    const settings = {
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,

        initialSlide: carouselCount - 1,
        afterChange: (current) => {},
        beforeChange: (current, next) => {
            if (next === 0 && current === carouselCount - 1) {
                return handleNext();
            }
            if (next === carouselCount - 1 && current === 0) {
                return handlePrev();
            }
            if (current < next) {
                handleNext();
            } else {
                handlePrev();
            }
        },
    };

    return (
        <>
            {!!data.length && (
                <Carousel arrows {...settings} dots={false}>
                    {new Array(carouselCount).fill(0).map((_, idx) => (
                        <GraphBloack
                            contentStyle={contentStyle}
                            key={idx}
                            start_index={idx * division}
                            end_index={idx * division + division - 1}
                            data={data}
                            division={division}
                        />
                    ))}
                </Carousel>
            )}
        </>
    );
};

const GraphBloack = ({
    contentStyle,
    start_index,
    end_index,
    data,
    division,
}) => {
    const graphData = data.slice(start_index, end_index + 1);
    const dispatch = useDispatch();
    const setDateFilter = (epoch, meetings_detail) => {
        dispatch(
            setAccountSearchFilter({
                date: epoch,
                meeting_ids: meetings_detail.map(({ id }) => id),
            })
        );
    };

    return (
        <div
            style={contentStyle}
            className="flex column justifyEnd paddingLR15"
        >
            <table className="graphTable">
                <tbody className="posRel">
                    <tr className="line_tr">
                        {graphData.map(
                            ({ epoch, meetings, ...rest }, index) => (
                                <PhoneBlock
                                    key={epoch}
                                    count={0}
                                    epoch={epoch}
                                    onClick={() => {}}
                                    index={0}
                                    hide={true}
                                    {...rest}
                                />
                            )
                        )}
                    </tr>
                    <tr className="line_tr">
                        {graphData.map(
                            ({ epoch, meetings, ...rest }, index) => (
                                <PhoneBlock
                                    key={epoch}
                                    count={meetings}
                                    epoch={epoch}
                                    onClick={setDateFilter}
                                    index={0}
                                    {...rest}
                                />
                            )
                        )}
                    </tr>
                    <tr className="line_tr">
                        {graphData.map(
                            ({ epoch, meetings, ...rest }, index) => (
                                <PhoneBlock
                                    key={epoch}
                                    count={0}
                                    epoch={epoch}
                                    onClick={() => {}}
                                    index={0}
                                    hide={true}
                                    {...rest}
                                />
                            )
                        )}
                    </tr>

                    <tr className="line_tr">
                        {graphData.map(({ epoch }) => (
                            <DateBlock key={epoch} epoch={epoch} />
                        ))}
                        {graphData.length < division
                            ? new Array(division - graphData.length)
                                  .fill(0)
                                  .map((_, idx) => <td key={uid()}>&nbsp;</td>)
                            : null}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

const PhoneBlock = ({
    count,
    onClick,
    epoch,
    index,
    hide,
    meetings_detail,
}) => {
    const { isAccountsGraph } = useContext(GraphCarouselContext);
    const [visible, setVisible] = useState(false);
    const { domain } = useSelector(({ common }) => common);
    const { id: callId } = useParams();
    return (
        <PopoverParent
            show={count > 1 && !isAccountsGraph}
            meetings_detail={meetings_detail}
            count={count}
            visible={visible}
            setVisible={setVisible}
        >
            <td className="posRel">
                <div
                    style={{
                        visibility: hide ? "hidden" : "visible",
                        // visibility: count ? 'inherit' : 'hidden',
                    }}
                    className={`${
                        count ? "sunshade_bg call_block curPoint" : ""
                    }    white_cl paddingTB4 posRel`}
                    onClick={() => {
                        if (isAccountsGraph && count) {
                            return onClick(epoch, meetings_detail);
                        }
                        if (!isAccountsGraph && +callId && count === 1) {
                            if (+callId === meetings_detail?.[0]?.id) {
                                message.info(
                                    "You are currently viewing this meeting"
                                );
                                return;
                            }
                            const win = window.open(
                                `${getActiveUrl(domain)}/call/${
                                    meetings_detail?.[0]?.id
                                }`
                            );
                            win.focus();
                        }
                    }}
                >
                    <GraphPhoneSvg
                        style={{
                            visibility: count ? "inherit" : "hidden",
                        }}
                    />
                    <span className="marginL5 font12 bold600">
                        {count || ""}
                    </span>
                </div>
            </td>
        </PopoverParent>
    );
};

const PopoverParent = ({
    meetings_detail,
    show,
    count,
    visible,
    setVisible,
    children,
}) => {
    const { domain } = useSelector(({ common }) => common);
    const { callId } = useContext(GraphCarouselContext);
    return show ? (
        <Popover
            placement="bottom"
            trigger={"click"}
            visible={visible}
            onVisibleChange={() => setVisible((prev) => !prev)}
            overlayClassName="graph_date_popover"
            content={
                <div className="call_info_container posRel">
                    {meetings_detail?.map(({ id, title }) => (
                        <div
                            className="flex alignCenter call_info"
                            onClick={() => {
                                if (callId === id) {
                                    message.info(
                                        "You are currently viewing this meeting"
                                    );
                                    return;
                                }
                                const win = window.open(
                                    `${getActiveUrl(domain)}/call/${id}`
                                );
                                win.focus();
                            }}
                            key={id}
                        >
                            <GraphPhoneSvg
                                style={{
                                    color: "#FFA82F",
                                    transform: "scale(1.3)",
                                }}
                            />
                            <span className="paddingLR10 text_ellipsis">
                                {title}
                            </span>
                            <div
                                className="posAbs rightArrow"
                                style={{
                                    right: "10px",
                                }}
                            >
                                <div className="flex alignCenter justifyCenter chevron">
                                    <ChevronRightSvg
                                        style={{
                                            marginLeft: "auto",
                                            marginRight: "auto",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            }
            title={
                <div
                    style={{
                        fontWeight: "400",
                    }}
                    className="mine_shaft_cl flex alignCenter justifySpaceBetween curPoint"
                >
                    <span>
                        You have <span className="bold600">{count}</span>{" "}
                        conversations
                    </span>
                    <span onClick={() => setVisible((prev) => !prev)}>
                        <CloseSvg
                            style={{
                                transform: "scale(0.8)",
                            }}
                        />
                    </span>
                </div>
            }
        >
            {children}
        </Popover>
    ) : (
        <>{children}</>
    );
};

const DateBlock = ({ epoch }) => {
    const date = new Date(epoch * 1000);
    const today = new Date();

    const dd = date.getUTCDate();
    const mm = date.getUTCMonth() + 1;
    const yy = date.getUTCFullYear();

    const td = today.getDate();
    const tm = today.getMonth() + 1;
    const ty = today.getFullYear();

    const isToday = dd === td && mm === tm && yy === ty;
    return (
        <td className={`font12 dove_gray_cl posRel ${isToday ? "today" : ""}`}>
            <div
                className="posAbs font10 graphTick"
                style={{
                    top: "-4px",
                    left: "50%",
                }}
            >
                |
            </div>
            <p className="font10 bold600">
                {formatDateForAccounts([yy, mm, dd], false)}
                {/* {isToday && <span>, Today</span>} */}
            </p>
        </td>
    );
};

export default GraphCarousel;
