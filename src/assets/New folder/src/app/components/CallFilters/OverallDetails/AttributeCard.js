import auditConfig from "@constants/Audit/index";

import { formatFloat, numFormatter } from "@tools/helpers";
import { Col, Collapse, Row } from "antd";
import React, { useContext, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";

import ChevronRightSvg from "app/static/svg/ChevronRightSvg";
import DisplayTrend from "../../AnalyticsDashboard/Components/DisplayTrend";
import { HomeDashboardContext } from "../../AnalyticsDashboard/Context/HomeDashboardContext";

import { CallFiltersContext } from "./OverallAndAttributes";

const { Panel } = Collapse;

function AttributeCard({ data, q_no, isAccountLevel }) {
    const {
        question_text,
        stats,
        question_type,
        id,
        question_average,
        question_trend,
        intent,
    } = data;
    const { BOOLEAN_TYPE, RATING_TYPE, CUSTOM_TYPE } = auditConfig;
    const [statWithHighestWeight, setStatWithHighestWeight] =
        useState(undefined);
    const [statWithLowestWeight, setStatWithLowestWeight] = useState(undefined);

    const {
        handleFilter,
        toCallPage,
        toAccountPage,
        scored_accounts_count,
        scored_meetings_count,
    } = useContext(CallFiltersContext);

    /* if intent is ngative the stat id with lowest weight whould be treated as positive hence will have the blue color and one with highest weight will be negative henve will have red color
        if intent is  neutral or positive it will be reverse
        if Na i.e id is -1 it will be gray else neither highest nor lowest it will be orange
    */
    useLayoutEffect(() => {
        const largest = getLargest(stats);
        const smallest = getSmallest(stats);

        if (largest.weight === smallest.weight) {
            const max = Math.max(largest.stat, smallest.stat);
            const min = Math.min(largest.stat, smallest.stat);
            setStatWithHighestWeight(max);
            setStatWithLowestWeight(min);
        } else {
            setStatWithHighestWeight(largest.stat);
            setStatWithLowestWeight(smallest.stat);
        }
    }, []);

    /* Gives stat id whith highest weight */
    const getLargest = (stats) => {
        const keys = Object.keys(stats).sort((a, b) => a - b);
        let maxWeight = -Infinity;
        let stat = undefined;

        for (let i = 0; i < keys.length; i++) {
            if (maxWeight <= stats?.[keys[i]]?.weight && keys[i] !== "-1") {
                maxWeight = stats?.[keys[i]]?.weight;
                stat = keys[i];
            }
        }

        return { stat: +stat, weight: maxWeight };
    };

    /* Gives stat id whith highest weight */
    const getSmallest = (stats) => {
        const keys = Object.keys(stats).sort((a, b) => b - a);
        let minWeight = Infinity;
        let stat = undefined;

        for (let i = 0; i < keys.length; i++) {
            if (minWeight >= stats?.[keys[i]]?.weight && keys[i] !== "-1") {
                minWeight = stats?.[keys[i]]?.weight;
                stat = keys[i];
            }
        }

        return { stat: +stat, weight: minWeight };
    };

    const getFraction = (stats, type) => {
        let keys = [];
        switch (type) {
            case "5<":
                keys = Object.keys(stats).filter(
                    (key) => +key < 5 && +key > -1
                );
                break;
            case "7<":
                keys = Object.keys(stats).filter(
                    (key) => +key < 7 && +key > -1
                );
                break;
            case "7>":
                keys = Object.keys(stats).filter(
                    (key) => +key > 7 && +key <= 10
                );
                break;
            default:
                return 0;
        }

        let total = 0;
        for (let key of keys) {
            total += stats[key].count;
        }
        return formatFloat(
            (total /
                (isAccountLevel
                    ? scored_accounts_count
                    : scored_meetings_count)) *
                100,
            2
        );
    };
    const getRatingCount = (stats, type) => {
        let keys = [];
        switch (type) {
            case "5<":
                keys = Object.keys(stats).filter(
                    (key) => +key < 5 && +key > -1
                );
                break;
            case "7<":
                keys = Object.keys(stats).filter(
                    (key) => +key < 7 && +key > -1
                );
                break;
            case "7>":
                keys = Object.keys(stats).filter(
                    (key) => +key > 7 && +key <= 10
                );
                break;
            default:
                return 0;
        }

        let total = 0;
        for (let key of keys) {
            total += stats[key].count;
        }
        return total;
    };

    const {
        common: {
            versionData: { stats_threshold },
        },
    } = useSelector((state) => state);

    return (
        <Collapse
            className="category__container attr_card"
            expandIconPosition="right"
            bordered={false}
            // defaultActiveKey={q_no === 1 ? [question_text] : []}
        >
            <Panel
                key={question_text}
                header={
                    <div className="flex alignCenter justifySpaceBetween width100p">
                        <div className="flex alignStart flex1">
                            <div className="attr_card_question_no">
                                {q_no < 10 ? `0${q_no}.` : `${q_no}.`}
                            </div>
                            <div></div>
                            <div className="attr_card_question_text">
                                {intent === "negative" && (
                                    <div
                                        style={{
                                            transform: "scale(1.2)",
                                        }}
                                    >
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M14.1667 1.66681H16.3917C16.8633 1.65846 17.3216 1.82358 17.6795 2.13082C18.0375 2.43806 18.2701 2.86602 18.3334 3.33347V9.16681C18.2701 9.63426 18.0375 10.0622 17.6795 10.3695C17.3216 10.6767 16.8633 10.8418 16.3917 10.8335H14.1667M8.33336 12.5001V15.8335C8.33336 16.4965 8.59675 17.1324 9.06559 17.6012C9.53443 18.0701 10.1703 18.3335 10.8334 18.3335L14.1667 10.8335V1.66681H4.76669C4.36475 1.66226 3.97471 1.80313 3.66844 2.06347C3.36216 2.3238 3.16029 2.68605 3.10003 3.08347L1.95003 10.5835C1.91377 10.8223 1.92988 11.0662 1.99724 11.2983C2.0646 11.5303 2.18161 11.7449 2.34014 11.9272C2.49868 12.1095 2.69496 12.2552 2.91538 12.3541C3.13581 12.4531 3.3751 12.5029 3.61669 12.5001H8.33336Z"
                                                stroke="#FF6365"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                )}
                                <span>{question_text}</span>
                            </div>
                        </div>
                        <div className="flex alignCenter">
                            <div
                                className={`bold600 ${
                                    question_average >= stats_threshold.good
                                        ? "lima_cl"
                                        : question_average >=
                                          stats_threshold.average
                                        ? "average_orng_cl"
                                        : "bitter_sweet_cl"
                                }`}
                            >
                                {typeof question_average === "number"
                                    ? `${formatFloat(question_average, 2)}%`
                                    : ""}
                            </div>
                            {typeof question_trend === "number" &&
                                !!Number(question_trend) && (
                                    <div className="font12 flex alignCenter">
                                        <DisplayTrend
                                            style={{
                                                fontSize: "14px",
                                            }}
                                            trend={question_trend}
                                        />
                                    </div>
                                )}
                        </div>
                    </div>
                }
            >
                <div className="paddingL45">
                    <div>
                        <Row gutter={[10, 10]}>
                            {question_type === BOOLEAN_TYPE ? (
                                <>
                                    <MiniCard
                                        label="Yes"
                                        fraction={
                                            stats["1"]?.fraction
                                                ? formatFloat(
                                                      stats["1"]?.fraction *
                                                          100,
                                                      2
                                                  )
                                                : 0
                                        }
                                        count={stats[1]?.count}
                                        className={`${
                                            intent === "negative"
                                                ? statWithLowestWeight === 1
                                                    ? "yesCard"
                                                    : " noCard"
                                                : statWithHighestWeight === 1
                                                ? "yesCard"
                                                : "noCard"
                                        }`}
                                        handleFilter={handleFilter}
                                        onClick={() =>
                                            isAccountLevel
                                                ? toAccountPage({
                                                      id,
                                                      question_text,
                                                      type: BOOLEAN_TYPE,
                                                      checked: 1,
                                                  })
                                                : toCallPage({
                                                      id,
                                                      data,
                                                      checked: 1,
                                                  })
                                        }
                                        id={id}
                                    />
                                    <MiniCard
                                        label="No"
                                        count={stats["0"]?.count}
                                        fraction={
                                            stats["0"]?.fraction
                                                ? formatFloat(
                                                      stats["0"]?.fraction *
                                                          100,
                                                      2
                                                  )
                                                : 0
                                        }
                                        className={`${
                                            intent === "negative"
                                                ? statWithLowestWeight === 0
                                                    ? "yesCard"
                                                    : " noCard"
                                                : statWithHighestWeight === 0
                                                ? "yesCard"
                                                : "noCard"
                                        }`}
                                        onClick={() =>
                                            isAccountLevel
                                                ? toAccountPage({
                                                      id,
                                                      question_text,
                                                      type: BOOLEAN_TYPE,
                                                      checked: 0,
                                                  })
                                                : toCallPage({
                                                      id,
                                                      data,
                                                      checked: 0,
                                                  })
                                        }
                                        id={id}
                                    />
                                    <MiniCard
                                        label="NA"
                                        count={stats[-1]?.count}
                                        fraction={
                                            stats["-1"]?.fraction
                                                ? formatFloat(
                                                      stats["-1"]?.fraction *
                                                          100,
                                                      2
                                                  )
                                                : 0
                                        }
                                        onClick={() =>
                                            isAccountLevel
                                                ? toAccountPage({
                                                      id,
                                                      question_text,
                                                      type: BOOLEAN_TYPE,
                                                      checked: -1,
                                                  })
                                                : toCallPage({
                                                      id,
                                                      data,
                                                      checked: -1,
                                                  })
                                        }
                                        className="naCard"
                                        handleFilter={handleFilter}
                                        id={id}
                                    />
                                </>
                            ) : question_type === RATING_TYPE ? (
                                <>
                                    <MiniCard
                                        label="5 <"
                                        fraction={getFraction(stats, "5<")}
                                        count={getRatingCount(stats, "5<")}
                                        // className="noCard"
                                        className={`${
                                            intent === "negative"
                                                ? [0, 1, 2, 3, 4].includes(
                                                      +statWithLowestWeight
                                                  )
                                                    ? "yesCard"
                                                    : [0, 1, 2, 3, 4].includes(
                                                          +statWithHighestWeight
                                                      )
                                                    ? "noCard"
                                                    : "customCard"
                                                : [0, 1, 2, 3, 4].includes(
                                                      +statWithHighestWeight
                                                  )
                                                ? "yesCard"
                                                : [0, 1, 2, 3, 4].includes(
                                                      +statWithLowestWeight
                                                  )
                                                ? "noCard"
                                                : "customCard"
                                        }`}
                                        handleFilter={handleFilter}
                                        id={id}
                                        onClick={() =>
                                            isAccountLevel
                                                ? toAccountPage({
                                                      id,
                                                      question_text,
                                                      type: RATING_TYPE,
                                                      checked: "5<",
                                                  })
                                                : toCallPage({
                                                      id,
                                                      data,
                                                      checked: "5<",
                                                  })
                                        }
                                    />
                                    <MiniCard
                                        label="7 <"
                                        fraction={getFraction(stats, "7<")}
                                        count={getRatingCount(stats, "7<")}
                                        className={`${
                                            intent === "negative"
                                                ? [5, 6, 7].includes(
                                                      +statWithLowestWeight
                                                  )
                                                    ? "yesCard"
                                                    : [5, 6, 7].includes(
                                                          +statWithHighestWeight
                                                      )
                                                    ? "noCard"
                                                    : "customCard"
                                                : [5, 6, 7].includes(
                                                      +statWithHighestWeight
                                                  )
                                                ? "yesCard"
                                                : [5, 6, 7].includes(
                                                      +statWithLowestWeight
                                                  )
                                                ? "noCard"
                                                : "customCard"
                                        }`}
                                        handleFilter={handleFilter}
                                        id={id}
                                        onClick={() =>
                                            isAccountLevel
                                                ? toAccountPage({
                                                      id,
                                                      question_text,
                                                      type: RATING_TYPE,
                                                      checked: "7<",
                                                  })
                                                : toCallPage({
                                                      id,
                                                      data,
                                                      checked: "7<",
                                                  })
                                        }
                                    />
                                    <MiniCard
                                        label="7 >"
                                        fraction={getFraction(stats, "7>")}
                                        count={getRatingCount(stats, "7>")}
                                        className={`${
                                            intent === "negative"
                                                ? [8, 9, 10].includes(
                                                      +statWithLowestWeight
                                                  )
                                                    ? "yesCard"
                                                    : [8, 9, 10].includes(
                                                          +statWithHighestWeight
                                                      )
                                                    ? "noCard"
                                                    : "customCard"
                                                : [8, 9, 10].includes(
                                                      +statWithHighestWeight
                                                  )
                                                ? "yesCard"
                                                : [8, 9, 10].includes(
                                                      +statWithLowestWeight
                                                  )
                                                ? "noCard"
                                                : "customCard"
                                        }`}
                                        handleFilter={handleFilter}
                                        id={id}
                                        onClick={() =>
                                            isAccountLevel
                                                ? toAccountPage({
                                                      id,
                                                      question_text,
                                                      type: RATING_TYPE,
                                                      checked: "7>",
                                                  })
                                                : toCallPage({
                                                      id,
                                                      data,
                                                      checked: "7>",
                                                  })
                                        }
                                    />
                                    <MiniCard
                                        label="NA"
                                        fraction={
                                            stats["-1"]?.fraction
                                                ? formatFloat(
                                                      stats["-1"]?.fraction *
                                                          100,
                                                      2
                                                  )
                                                : 0
                                        }
                                        className="naCard"
                                        handleFilter={handleFilter}
                                        id={id}
                                        count={stats["-1"]?.count}
                                        onClick={() =>
                                            isAccountLevel
                                                ? toAccountPage({
                                                      id,
                                                      question_text,
                                                      type: RATING_TYPE,
                                                      checked: -1,
                                                  })
                                                : toCallPage({
                                                      id,
                                                      data,
                                                      checked: -1,
                                                  })
                                        }
                                    />
                                </>
                            ) : question_type === CUSTOM_TYPE ? (
                                <>
                                    {Object.keys(stats).map((key, index) => (
                                        <MiniCard
                                            label={stats[key]?.label || ""}
                                            fraction={
                                                stats[key]?.fraction
                                                    ? formatFloat(
                                                          stats[key]?.fraction *
                                                              100,
                                                          2
                                                      )
                                                    : 0
                                            }
                                            count={stats[key]?.count}
                                            // className={`customCard ${stats[
                                            //     key
                                            // ]?.label?.toLowerCase()}Card`}
                                            className={`${
                                                key === "-1"
                                                    ? "naCard"
                                                    : intent === "negative"
                                                    ? statWithLowestWeight ===
                                                      +key
                                                        ? "yesCard"
                                                        : statWithHighestWeight ===
                                                          +key
                                                        ? "noCard"
                                                        : "customCard"
                                                    : statWithHighestWeight ===
                                                      +key
                                                    ? "yesCard"
                                                    : statWithLowestWeight ===
                                                      +key
                                                    ? "noCard"
                                                    : "customCard"
                                            }`}
                                            onClick={() =>
                                                isAccountLevel
                                                    ? toAccountPage({
                                                          id,
                                                          question_text,
                                                          type: CUSTOM_TYPE,
                                                          checked: +key,
                                                      })
                                                    : toCallPage({
                                                          id,
                                                          data,
                                                          checked: +key,
                                                      })
                                            }
                                            id={id}
                                            key={index}
                                        />
                                    ))}
                                </>
                            ) : (
                                <></>
                            )}
                        </Row>
                    </div>
                </div>
            </Panel>
        </Collapse>
    );
}

const MiniCard = ({
    label,
    fraction,
    className,
    onClick,
    findIndex,
    id,
    count,
}) => {
    const { get_dashboard_label } = useContext(HomeDashboardContext);
    return (
        <Col span={12}>
            <div
                className={`${className} padding14 flex alignCenter justifySpaceBetween curPoint`}
                onClick={onClick}
            >
                <div className="bold600">{label}</div>

                <div className="bold700 flex alignCenter justifySpaceBetween">
                    <div className="marginR12 flex alignCenter">
                        {fraction}%{" "}
                        <span className="bold600 dove_gray_cl font18 marginLR4">
                            |
                        </span>{" "}
                        <span>
                            {numFormatter(count)} {get_dashboard_label()}
                        </span>{" "}
                    </div>
                    <div className="stats flex justifyCenter alignCenter">
                        <ChevronRightSvg
                            style={{
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                        />
                    </div>
                </div>
            </div>
        </Col>
    );
};

export default React.memo(
    AttributeCard,
    (prev, next) => prev?.data === next?.data
);
