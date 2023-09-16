import NoData from "@presentational/reusables/NoData";
import TimeStamp from "@presentational/reusables/TimeStamp";
import { capitalizeFirstLetter, secondsToTime, uid } from "@tools/helpers";
import { Button, Col, Row, Tag } from "antd";
import React from "react";
import ClockSvg from "app/static/svg/ClockSvg";
import CloseSvg from "app/static/svg/CloseSvg";
import NoDataSvg from "app/static/svg/NoDataSvg";

function LeadScoreInsights({
    setShowLeadScoreSider,
    leadScoreInsights,
    seekToPoint,
}) {
    return (
        <div className="flex column height100p">
            <div className="individual_drawer_header">
                <div className="flex alignCenter justifySpaceBetween">
                    <div className="flex alignCenter">
                        <span className="font18 bold700">
                            Lead Score Insights &nbsp;
                        </span>
                    </div>
                    <div className="flex alignCenter">
                        <span
                            className="curPoint "
                            onClick={() => setShowLeadScoreSider(false)}
                        >
                            <CloseSvg />
                        </span>
                    </div>
                </div>
            </div>

            <div className="paddingLR24 flex1">
                {leadScoreInsights?.length ? (
                    leadScoreInsights?.map((data, index) => (
                        <Card
                            key={uid()}
                            {...data}
                            sl={index + 1}
                            seekToPoint={seekToPoint}
                            showBorder={index !== leadScoreInsights.length - 1}
                        />
                    ))
                ) : (
                    <div className="height100p flex alignCenter column justifyCenter  ">
                        <NoDataSvg />
                        <div className="bolder">No data to show !</div>
                    </div>
                )}
            </div>
        </div>
    );
}

const Card = ({
    question,
    sl,
    result,
    snippets,
    seekToPoint,
    weight,
    showBorder,
}) => (
    <div className={`question_container ${showBorder ? "border_bottom" : ""} `}>
        <div className="border_bottom">
            <div className="flex justifySpaceBetween paddingT18 paddingB17">
                <div className="paddingR20 flex  mine_shaft_cl">
                    <span className="font16 bold600 marginR8">{sl}.</span>
                    <div
                        className="flex1 paddingL8"
                        style={{
                            borderLeft: "1px solid #99999933",
                        }}
                    >
                        <div className=" question_text bold700">{question}</div>
                        <div className="marginTB10 font16  bold700 primary">
                            Weight : {weight}%{" "}
                        </div>
                        <div>
                            {snippets.map(({ start_time }, idx) => (
                                <TimeStamp
                                    onClick={() => seekToPoint(start_time)}
                                    start_time={start_time}
                                    key={start_time + idx}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div
                    className={`score_label ${
                        result ? "lima_cl" : "bitter_sweet_cl"
                    }`}
                >
                    {result ? "Yes" : "No"}
                </div>
            </div>
        </div>
    </div>
);

// const Card = ({ question, sl, result, snippets, seekToPoint, weight }) => (
//     <Row className="marginTB10 paddingTB16 borderBottom">
//         <Col span={20} className="flex">
//             <div className="marginR5">{sl}.</div>
//             <div className="bold paddingR16">{question}</div>
//         </Col>
//         <Col span={4}>
//             <div
//                 className={`primary font14  bold`}
//                 style={{
//                     color: result ? '#52C41A' : '#FF6365',
//                 }}
//             >
//                 {result ? 'YES' : 'NO'}
//             </div>
//         </Col>
//         {weight !== null && (
//             <Col span={24} className="marginTB10 paddingL16 bold primary">
//                 Weight : {weight}%
//             </Col>
//         )}
//         <Col span={24} className="marginTB10 paddingL16">
//             {snippets.map(({ start_time }) => (
//                 <Tag
//                     color="#1A62F233"
//                     className="bold primary curPoint"
//                     key={uid()}
//                     onClick={() => seekToPoint(start_time)}
//                 >
//                     <div className=" flex alignCenter">
//                         <ClockSvg />

//                         <span>&nbsp;{secondsToTime(start_time)}</span>
//                     </div>
//                 </Tag>
//             ))}
//         </Col>
//     </Row>
// );

export default LeadScoreInsights;
