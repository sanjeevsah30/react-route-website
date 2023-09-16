import React, { useState, useContext, useLayoutEffect } from "react";
import config from "@constants/IndividualCall";
import Processing from "./Processing";
// import IncompleteAuditBanner from './IncompleteAuditBanner';
import { formatFloat, getDateTime, getPercentage } from "@tools/helpers";
import { useSelector } from "react-redux";
import InfoCircleSvg from "app/static/svg/InfoCircleSvg";
import IndividualCallConfig from "@constants/IndividualCall/index";
import { CallContext } from "./IndividualCall";
import { Skeleton, Tooltip } from "antd";
import ConvinLogoSvg from "app/static/svg/ConvinLogoSvg";
import WordCloud from "./WordCloud";
import TemplateSelector from "./TemplateSelector";
import { HomeContext } from "@container/Home/Home";
import { useHistory } from "react-router-dom";
import ConversationLeadScore from "@convin/modules/conversationDetails/components/ConversationLeadScore";
import Entity from "./Entity";

const CallStats = (props) => {
    const {
        toggleAudit,
        sentiment,
        setActiveRightTab,
        word_cloud = {},
        template,
        callId,
        chat,
        audited_date,
        lead_analysis,
        notes,
    } = props;

    console.log(lead_analysis);

    const { ai_score, manual_score, audit_template, meeting_templates } =
        useSelector((state) => state.auditSlice);

    const versionData = useSelector((state) => state.common.versionData);

    const { setMomentFilterType } = useContext(CallContext);

    const {
        common: {
            versionData: { stats_threshold },
        },
    } = useSelector((state) => state);
    const RederSentiment = ({ overall_sentiment }) => {
        return (
            <div className="stat__score--card client__sentiment--card">
                <div className="marginB17 flex alignCenter">
                    <span className="font16 marginR15 bold600">
                        Customer Sentiment Analysis |
                    </span>
                    <span
                        className={`sentiment_type negative ${
                            overall_sentiment > 0
                                ? "positive"
                                : overall_sentiment < 0
                                ? "negative"
                                : "neutral"
                        }`}
                    >
                        {overall_sentiment > 0
                            ? "Positive"
                            : overall_sentiment < 0
                            ? "Negative"
                            : "Neutral"}
                    </span>
                </div>
                <div className="sentiment_analysis flex justifyCenter">
                    <div className="blue_dot_scale">
                        <div
                            style={{
                                left: `${((overall_sentiment + 1) / 2) * 100}%`,
                            }}
                            className="pointer"
                        ></div>
                    </div>
                    <div className="white_dot white_dot_left">
                        <div
                            className="font12 text flex alignCenter justifyCenter curPoint"
                            onClick={() => {
                                setMomentFilterType(
                                    IndividualCallConfig.NEGATIVE_MOMENTS
                                );
                                setActiveRightTab(
                                    IndividualCallConfig.RIGHT_TABS.moments
                                        .value
                                );
                            }}
                        >
                            <span className="marginT1">
                                <span>Negative |&nbsp;</span>
                                <strong>{sentiment?.negative || 0}</strong>
                            </span>
                            <svg
                                width="10"
                                height="10"
                                viewBox="0 0 10 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="marginL5"
                            >
                                <circle
                                    cx="5"
                                    cy="5"
                                    r="5"
                                    transform="rotate(-90 5 5)"
                                    fill="#1A62F2"
                                />
                                <path
                                    d="M3.75 7.5L6.25 5L3.75 2.5"
                                    stroke="white"
                                    strokeWidth="0.75"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="white_dot white_dot_center">
                        <div className="font12 text marginT4">Neutral</div>
                    </div>

                    <div className="white_dot white_dot_right">
                        <div
                            className="font12 text flex alignCenter justifyCenter curPoint"
                            onClick={() => {
                                setMomentFilterType(
                                    IndividualCallConfig.POSITIVE_MOMENTS
                                );
                                setActiveRightTab(
                                    IndividualCallConfig.RIGHT_TABS.moments
                                        .value
                                );
                            }}
                        >
                            <span className="marginT1">
                                <span>Positive |&nbsp;</span>
                                <strong>{sentiment?.positive || 0}</strong>
                            </span>
                            <svg
                                width="10"
                                height="10"
                                viewBox="0 0 10 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="marginL5"
                            >
                                <circle
                                    cx="5"
                                    cy="5"
                                    r="5"
                                    transform="rotate(-90 5 5)"
                                    fill="#1A62F2"
                                />
                                <path
                                    d="M3.75 7.5L6.25 5L3.75 2.5"
                                    stroke="white"
                                    strokeWidth="0.75"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        height: "10px",
                        position: "relative",
                        marginBottom: "14px",
                        width: "100%",
                    }}
                ></div>
            </div>
        );
    };

    const RenderAIAudit = () => {
        const aiPercentage = getPercentage(
            ai_score?.data?.scores?.template_score,
            ai_score?.data?.scores?.template_marks_audited
        );

        const manualPercentage = getPercentage(
            manual_score?.data?.scores?.template_score,
            manual_score?.data?.scores?.template_marks_audited
        );

        const aiCallScoreColor =
            aiPercentage >= stats_threshold.good
                ? "#52C41A"
                : aiPercentage >= stats_threshold.average
                ? "#ECA51D"
                : "#FF6365";

        const manualCallScoreColor =
            manualPercentage >= stats_threshold.good
                ? "#52C41A"
                : manualPercentage >= stats_threshold.average
                ? "#ECA51D"
                : "#FF6365";

        return (
            <div
                className="call_score_card flex alignCenter justifySpaceBetween width100p mine_shaft_cl bold600"
                style={{
                    position: "relative",
                    margin: `${
                        !manual_score?.data?.auditor ? "0 0 24px" : "0 0 48px"
                    }`,
                }}
            >
                <div className="font16">
                    <div className="">
                        <div className="flex alignCenter">
                            <span className="marginR8 ">
                                {chat ? "Chat" : "Call"} Score
                            </span>
                            <Tooltip
                                destroyTooltipOnHide
                                title={`Agent Scored 
                                ${
                                    !manual_score?.data?.auditor
                                        ? `${
                                              formatFloat(
                                                  ai_score?.data?.scores
                                                      ?.template_score,
                                                  2
                                              ) || 0
                                          }/${
                                              formatFloat(
                                                  ai_score?.data?.scores
                                                      ?.template_marks_audited,
                                                  2
                                              ) || 0
                                          }`
                                        : `${
                                              formatFloat(
                                                  manual_score?.data?.scores
                                                      ?.template_score,
                                                  2
                                              ) || 0
                                          }/${
                                              formatFloat(
                                                  manual_score?.data?.scores
                                                      ?.template_marks_audited,
                                                  2
                                              ) || 0
                                          }`
                                }
 
                                points with a score of ${
                                    !manual_score?.data?.auditor
                                        ? ai_score?.data?.scores
                                              ?.template_marks_audited
                                            ? aiPercentage
                                            : 0
                                        : manual_score?.data?.scores
                                              ?.template_marks_audited
                                        ? manualPercentage
                                        : 0
                                }%`}
                                placement="right"
                                overlayStyle={{
                                    width: "200px",
                                    borderRadius: "6px",
                                }}
                                overlayInnerStyle={{ fontSize: "12px" }}
                            >
                                <InfoCircleSvg
                                    style={{
                                        transform: "scale(0.75)",
                                    }}
                                />
                            </Tooltip>
                        </div>
                    </div>
                    <div className="template_container flex alignCenter">
                        <TemplateSelector
                            callId={callId}
                            template={template}
                            callApi={false}
                        />
                        {/* <span
                                    className="paddingLR9 paddingTB4 flex alignCenter"
                                    style={{
                                        backgroundColor: ' #9999991a',
                                        borderRadius: '100px',
                                    }}
                                >
                                    <Tooltip
                                        destroyTooltipOnHide
                                        title="Audit Score given by the AI"
                                    >
                                        <InfoCircleSvg
                                            style={{
                                                transform: 'scale(0.8)',
                                            }}
                                        />
                                    </Tooltip>
                                    <span className="marginL5 bold400">{`Score by Convin:`}</span>
                                    <span
                                        className="bold600 marginL5"
                                        style={{ color: `${callScoreColor}` }}
                                    >{`${aiPercentage || 0}%`}</span>
                                </span> */}
                    </div>
                    {manual_score?.data?.auditor?.id ? (
                        <div className="font12 flex alignCenter">
                            <span className="bold400 marginR5 dove_gray_cl">
                                Scored by
                            </span>
                            <span>{"|"}</span>
                            <span className="bold600 marginL5 primary_cl">
                                <span>
                                    {`${manual_score?.data.auditor?.first_name} ${manual_score?.data.auditor?.last_name}`}
                                    {audited_date &&
                                        ` - ${getDateTime(
                                            audited_date,
                                            undefined,
                                            undefined,
                                            "dd MMM"
                                        )}`}
                                </span>
                                {/* <Tooltip
                                        title={`Audited on: 6 mar`}
                                    >
                                        {`6 mar`}
                                    </Tooltip> */}
                            </span>
                        </div>
                    ) : (
                        <div className="flex alignCenter">
                            {ai_score?.data?.status ? (
                                <>
                                    <span className="font12 bold400 dove_gray_cl">
                                        Scored by
                                    </span>
                                    {versionData?.logo ? (
                                        <span className="marginL5">Ai</span>
                                    ) : (
                                        <ConvinLogoSvg
                                            style={{
                                                transform: "scale(0.5)",
                                            }}
                                        />
                                    )}
                                </>
                            ) : (
                                <></>
                            )}
                        </div>
                    )}
                </div>

                {(!!manual_score?.data?.scores?.non_fatal_template_score &&
                    manual_score?.data?.scores?.non_fatal_template_score !==
                        manual_score?.data?.scores?.template_score) ||
                (!!ai_score?.data?.scores?.non_fatal_template_score &&
                    ai_score?.data?.scores?.non_fatal_template_score !==
                        ai_score?.data?.scores?.template_score) ? (
                    <div className="flex alignCenter column justifyCenter">
                        <div
                            className="flex alignCenter curPoint white_cl"
                            onClick={toggleAudit}
                            style={{
                                borderRadius: "4px",
                                backgroundColor: `${
                                    !manual_score?.data?.auditor
                                        ? aiCallScoreColor
                                        : manualCallScoreColor
                                }`,
                                width: "fit-content",
                            }}
                        >
                            <div className="font24 paddingTB7 paddingL10 paddingR7">
                                {`${
                                    manual_score?.data?.auditor
                                        ? manualPercentage
                                        : aiPercentage
                                }%`}
                            </div>
                            <div
                                className="font14 bold400 paddingTB10 paddingL7 paddingR10"
                                style={{ textAlign: "center" }}
                            >
                                {manual_score?.data?.auditor
                                    ? `${
                                          formatFloat(
                                              manual_score?.data?.scores
                                                  ?.template_score,
                                              2
                                          ) || 0
                                      } / ${
                                          formatFloat(
                                              manual_score?.data?.scores
                                                  ?.template_marks_audited,
                                              2
                                          ) || 0
                                      }`
                                    : `${
                                          formatFloat(
                                              ai_score?.data?.scores
                                                  ?.template_score,
                                              2
                                          ) || 0
                                      } / ${
                                          formatFloat(
                                              ai_score?.data?.scores
                                                  ?.template_marks_audited,
                                              2
                                          ) || 0
                                      }`}
                            </div>
                        </div>
                        <div className="text-center">
                            <span className="dusty_gray_cl font12">
                                Non Violation Score
                            </span>
                            <span className="dusty_gray_cl">{" | "}</span>
                            {manual_score?.data?.auditor ? (
                                <span className="primary">{`${getPercentage(
                                    manual_score?.data?.scores
                                        ?.non_fatal_template_score,
                                    manual_score?.data?.scores
                                        ?.template_marks_audited
                                )}%`}</span>
                            ) : (
                                <span className="primary">{`${getPercentage(
                                    ai_score?.data?.scores
                                        ?.non_fatal_template_score,
                                    ai_score?.data?.scores
                                        ?.template_marks_audited
                                )}%`}</span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div
                        className="flex alignCnter column curPoint white_cl paddingLR23 paddingTB10"
                        onClick={toggleAudit}
                        style={{
                            borderRadius: "4px",
                            backgroundColor: `${
                                !manual_score?.data?.auditor
                                    ? aiCallScoreColor
                                    : manualCallScoreColor
                            }`,
                        }}
                    >
                        <div
                            className={
                                ai_score?.data?.status ||
                                manual_score?.data?.auditor
                                    ? "font28"
                                    : "font20"
                            }
                        >
                            {manual_score?.data?.auditor
                                ? `${manualPercentage}%`
                                : ai_score?.data?.status
                                ? `${aiPercentage}%`
                                : "Not Scored"}
                        </div>
                        <div
                            className="font14 bold400"
                            style={{ textAlign: "center" }}
                        >
                            {manual_score?.data?.auditor
                                ? `${
                                      formatFloat(
                                          manual_score?.data?.scores
                                              ?.template_score,
                                          2
                                      ) || 0
                                  } / ${
                                      formatFloat(
                                          manual_score?.data?.scores
                                              ?.template_marks_audited,
                                          2
                                      ) || 0
                                  }`
                                : `${
                                      formatFloat(
                                          ai_score?.data?.scores
                                              ?.template_score,
                                          2
                                      ) || 0
                                  } / ${
                                      formatFloat(
                                          ai_score?.data?.scores
                                              ?.template_marks_audited,
                                          2
                                      ) || 0
                                  }`}
                        </div>
                    </div>
                )}
                {!!manual_score?.data?.auditor && (
                    <div className="convin_score_card">
                        <span className="font12 bold400">
                            {versionData.logo ? "Ai Score:" : "Convin Score"}
                            <span className="bold600">
                                {` ${
                                    ai_score?.data?.scores
                                        ?.template_marks_audited
                                        ? aiPercentage
                                        : 0
                                }%`}
                            </span>
                            <span>{" | "}</span>
                            Agent Scored
                            <span className="bold600">
                                {` ${
                                    formatFloat(
                                        ai_score?.data?.scores?.template_score,
                                        2
                                    ) || 0
                                } `}
                            </span>
                            point out of
                            <span className="bold600">
                                {` ${
                                    formatFloat(
                                        ai_score?.data?.scores
                                            ?.template_marks_audited,
                                        2
                                    ) || 0
                                }`}
                            </span>
                        </span>
                    </div>
                )}
            </div>
        );
    };
    const history = useHistory();

    return (
        <>
            {props.isProcessing && !audit_template ? (
                <div className="height100p flex alignCenter justifyCenter">
                    <Processing />
                </div>
            ) : (
                <div className="flex column paddingLR24 paddingT24 font14 bold14 dusty_gray_cl">
                    {versionData?.domain_type === "b2c" ? (
                        ai_score?.data || manual_score?.data ? (
                            <>
                                {!!meeting_templates.data.length || template ? (
                                    manual_score.loading || ai_score.loading ? (
                                        <Skeleton
                                            active
                                            paragraph={{ rows: 2 }}
                                            title={false}
                                            style={{ padding: "10px" }}
                                        />
                                    ) : (
                                        <RenderAIAudit />
                                    )
                                ) : (
                                    meeting_templates.loading || (
                                        <div className="call_score_card text-center alignCenter alignCenter justifySpaceBetween width100p mine_shaft_cl bold400">
                                            <p className=" font16 ">
                                                There is no template associated
                                                with this call
                                            </p>
                                            <div
                                                className="font14 primary_cl curPoint"
                                                onClick={() =>
                                                    history.push(
                                                        "/settings/audit_manager"
                                                    )
                                                }
                                            >
                                                click here to confiure
                                            </div>
                                        </div>
                                    )
                                )}
                            </>
                        ) : (
                            <></>
                        )
                    ) : (
                        <></>
                    )}
                    {typeof props?.overall_sentiment == "number" && (
                        <RederSentiment
                            overall_sentiment={props.overall_sentiment}
                        />
                    )}
                    {typeof lead_analysis === "object" &&
                    Object.keys(lead_analysis || {})?.length ? (
                        <ConversationLeadScore {...lead_analysis} />
                    ) : (
                        <></>
                    )}
                    {<Entity notes={notes} />}
                    {chat || (
                        <>
                            <div className="grid_container1">
                                <div className="grid_item1 min_width_0_flex_child">
                                    <div className="flex alignCenter min_width_0_flex_child">
                                        <span className="marginR9 elipse_text">
                                            {config.TALKRATIO}
                                        </span>
                                        <Tooltip
                                            title={config.TALKRATIO_TOOLTIP}
                                        >
                                            <InfoCircleSvg
                                                style={{
                                                    transform: "scale(0.8)",
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div
                                        className="bold600 font16"
                                        style={{
                                            color:
                                                formatFloat(
                                                    props?.owner_talk_ratio *
                                                        100,
                                                    2
                                                ) >= 40 &&
                                                formatFloat(
                                                    props?.owner_talk_ratio *
                                                        100,
                                                    2
                                                ) <= 60
                                                    ? "#52C41A"
                                                    : "#FF6365",
                                        }}
                                    >
                                        {formatFloat(
                                            props?.owner_talk_ratio * 100,
                                            2
                                        )}
                                        %
                                    </div>
                                </div>
                                <div className="grid_item1 paddingL20 min_width_0_flex_child">
                                    <div className="flex alignCenter min_width_0_flex_child">
                                        <span className="marginR9 elipse_text">
                                            {config.FILLER_RATE}
                                        </span>
                                        <Tooltip
                                            title={config.FILLER_RATE_TOOLTIP}
                                        >
                                            <InfoCircleSvg
                                                style={{
                                                    transform: "scale(0.8)",
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div className="bold600 font16 paleyellow_cl">
                                        {formatFloat(
                                            props?.owner_filler_rate * 60
                                        )}{" "}
                                        WPM
                                    </div>
                                </div>
                                <div className="grid_item paddingL20 min_width_0_flex_child">
                                    <div className="flex alignCenter min_width_0_flex_child">
                                        <span className="marginR9 elipse_text">
                                            {config.TALK_SPEED}
                                        </span>
                                        <Tooltip
                                            title={config.TALK_SPEED_TOOLTIP}
                                        >
                                            <InfoCircleSvg
                                                style={{
                                                    transform: "scale(0.8)",
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div className="bold600 font16 newpurple_cl">
                                        {formatFloat(
                                            props?.owner_talk_speed * 60
                                        )}{" "}
                                        WPM
                                    </div>
                                </div>
                            </div>
                            <div className="grid_container2">
                                <div className="grid_item1 min_width_0_flex_child">
                                    <div className="flex alignCenter min_width_0_flex_child">
                                        <span className="marginR9 elipse_text">
                                            {config.OVERLAP_RATE}
                                        </span>
                                        <Tooltip
                                            title={config.OVERLAP_RATE_TOOLTIP}
                                        >
                                            <InfoCircleSvg
                                                style={{
                                                    transform: "scale(0.8)",
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div className="bold600 font16 magenta_cl">
                                        {formatFloat(props?.owner_overlap_rate)}
                                    </div>
                                </div>
                                <div className="grid_item1 paddingL20 min_width_0_flex_child">
                                    <div className="flex alignCenter min_width_0_flex_child">
                                        <span className="marginR9 elipse_text">
                                            {config.PATIENCE}
                                        </span>
                                        <Tooltip
                                            title={config.PATIENCE_TOOLTIP}
                                        >
                                            <InfoCircleSvg
                                                style={{
                                                    transform: "scale(0.8)",
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div className="bold600 font16 navyblue_cl">
                                        {formatFloat(props?.patience, 2)} Sec
                                    </div>
                                </div>
                                <div className="grid_item paddingL20 min_width_0_flex_child">
                                    <div className="flex alignCenter min_width_0_flex_child">
                                        <span className="marginR9 elipse_text">
                                            {config.INTERACTIVITY}
                                        </span>
                                        <Tooltip
                                            title={config.INTERACTIVITY_TOOLTIP}
                                        >
                                            <InfoCircleSvg
                                                style={{
                                                    transform: "scale(0.8)",
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div className="bold600 font16 newrobin_blue_cl">
                                        {formatFloat(
                                            props?.interactivity * 10,
                                            2
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="grid_container3">
                                <div className="grid_item1 min_width_0_flex_child">
                                    <div className="flex alignCenter min_width_0_flex_child">
                                        <span className="marginR9 elipse_text">
                                            {config.LONGESTMONO}
                                        </span>
                                        <Tooltip
                                            title={config.LONGESTMONO_TOOLTIP}
                                        >
                                            <InfoCircleSvg
                                                style={{
                                                    transform: "scale(0.8)",
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div className="bold600 font16 mine_shaft_cl">
                                        {formatFloat(
                                            props?.longest_monologue_owner / 60,
                                            2
                                        )}{" "}
                                        {config.STATS_UNIT}
                                    </div>
                                </div>
                                <div className="grid_item1 paddingL20 min_width_0_flex_child">
                                    <div className="flex alignCenter min_width_0_flex_child">
                                        <span className="marginR9 elipse_text">
                                            {config.LONGESTSTORY}
                                        </span>
                                        <Tooltip
                                            title={config.LONGESTSTORY_TOOLTIP}
                                        >
                                            <InfoCircleSvg
                                                style={{
                                                    transform: "scale(0.8)",
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div className="bold600 font16 mine_shaft_cl">
                                        {formatFloat(
                                            props?.longest_monologue_client /
                                                60,
                                            2
                                        )}{" "}
                                        {config.STATS_UNIT}
                                    </div>
                                    {/* <div
                                className="primary_cl curPoint"
                                onClick={() => {}}
                            >
                                {'View'}
                            </div> */}
                                </div>
                                <div className="grid_item paddingL20 min_width_0_flex_child">
                                    <div className="flex alignCenter min_width_0_flex_child">
                                        <span className="marginR9 elipse_text">
                                            {config.QUESTION_RATE}
                                        </span>
                                        <Tooltip
                                            title={config.QUESTION_RATE_TOOLTIP}
                                        >
                                            <InfoCircleSvg
                                                style={{
                                                    transform: "scale(0.8)",
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div
                                        className={`bold600 font16 mine_shaft_cl`}
                                    >
                                        {props.owner_question_count}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default CallStats;
