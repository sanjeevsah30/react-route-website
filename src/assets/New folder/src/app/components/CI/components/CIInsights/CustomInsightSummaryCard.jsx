import { formatFloat, getColor, numFormatter } from "@tools/helpers";
import { Col, Row, Tooltip } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";
import SnippetPlaySvg from "app/static/svg/SnippetPlaySvg";
import CIDonutChartV2 from "./CIDonutChartV2";
import EmptyDataState from "app/components/AnalyticsDashboard/Components/EmptyDataState";

// Stats is HOC to make indivisual stats
const Stat = ({
    name,
    handleSnippetClick,
    num,
    per,
    color,
    snippet_type,
    type,
    showBorder,
}) => {
    const { id } = useParams();
    return (
        <div
            className="flex alignCenter min_width_0_flex_child paddingTB8 justifySpaceBetween"
            style={
                showBorder
                    ? {
                          borderBottom: "0.4px solid #99999966",
                      }
                    : {}
            }
        >
            <div>
                <Tooltip title={name}>
                    <span className="dove_gray_cl font12 elipse_text flex1">
                        {name}
                    </span>
                </Tooltip>
            </div>
            <div
                className="flex alignCenter"
                style={{
                    gap: "5px",
                }}
            >
                <span className="font16 bold600 marginR4 flex1 mine_shaft_cl">
                    {num}
                </span>
                <span
                    className="font12 bold600 padding2 dusty_gray_1a_bg dove_gray_cl"
                    style={{ borderRadius: "4px" }}
                >{`${formatFloat(Number(per))}%`}</span>
                <span
                    className="primary_cl curPoint flex1"
                    onClick={() =>
                        handleSnippetClick({
                            is_type: true,
                            snippet_type,
                            type,
                            id,
                        })
                    }
                >
                    <SnippetPlaySvg />
                </span>
            </div>
        </div>
    );
};

const DealsSummary = ({ data, handleSnippetClick }) => {
    return (
        <div
            style={{
                background: "#F9F9F9",
                borderRadius: "6px",
            }}
            className="paddingLR4"
        >
            {data.map(({ count, value, color, label, id }, i) => (
                <Stat
                    name={label}
                    color={color}
                    num={numFormatter(count)}
                    per={value}
                    {...{ handleSnippetClick }}
                    snippet_type="account"
                    type={id}
                    key={id}
                    showBorder={
                        (data.length === 4 && i % 4 !== 3) ||
                        (data.length < 4 && i !== data.length - 1)
                    }
                />
            ))}
        </div>
    );
};

//InsightSummaryCard is Layout HOC to make each insight Cards
export const CustomInsightSummaryCard = ({
    title = "Deals Summary",
    total,
    data = [],
    handleSnippetClick,
}) => {
    const [currentSlide, setCurrentslide] = useState(0);
    return (
        <div
            className="padding16 marginB20 marginT16 borderRadius8"
            style={{
                boxShadow: "0px 4px 20px rgba(21, 21, 21, 0.10)",
                background: "#ffffff",
            }}
        >
            <div className="dove_gray_cl bold600 font14">{title}</div>
            {data.length ? (
                <>
                    <div className="flex alignCenter">
                        <div className="flex1">
                            <DealsSummary
                                data={data
                                    .slice(
                                        currentSlide * 4,
                                        currentSlide * 4 + 4
                                    )
                                    .map((e) => {
                                        return {
                                            id: e.stage,
                                            label: e.stage_name,
                                            count: e.account_count,
                                            value: formatFloat(
                                                (e.account_count / total) * 100,
                                                1
                                            ),
                                            color: getColor(e.stage_name),
                                        };
                                    })}
                                {...{ handleSnippetClick }}
                            />
                            {data.length <= 4 ? (
                                <></>
                            ) : (
                                <div className="flex alignCenter marginT10">
                                    <div
                                        onClick={() => {
                                            setCurrentslide(
                                                currentSlide === 0
                                                    ? Math.ceil(data.length / 4)
                                                    : (prev) => prev - 1
                                            );
                                        }}
                                        className="curPoint"
                                    >
                                        <svg
                                            width="8"
                                            height="12"
                                            viewBox="0 0 8 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M6.25 1.5L1.75 6L6.25 10.5"
                                                stroke="#999999"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        className="flex1 flex paddingLR10"
                                        style={{
                                            gap: "5px",
                                        }}
                                    >
                                        {new Array(Math.ceil(data.length / 4))
                                            .fill(0)
                                            .map((_, i) => (
                                                <div
                                                    className="inlineBlock flex1 borderRadius6"
                                                    style={{
                                                        background:
                                                            currentSlide === i
                                                                ? "#666"
                                                                : "#99999933",
                                                        height: "4px",
                                                    }}
                                                    key={i}
                                                ></div>
                                            ))}
                                    </div>
                                    <div
                                        className="curPoint"
                                        onClick={() => {
                                            setCurrentslide(
                                                currentSlide + 1 ===
                                                    Math.ceil(data.length / 4)
                                                    ? 0
                                                    : (prev) => prev + 1
                                            );
                                        }}
                                    >
                                        <svg
                                            width="8"
                                            height="12"
                                            viewBox="0 0 8 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M1.75 10.5L6.25 6L1.75 1.5"
                                                stroke="#999999"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="paddingTB20">
                    <EmptyDataState />
                </div>
            )}
        </div>
    );
};
