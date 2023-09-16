import React, { useCallback, useContext, useEffect, useState } from "react";
import Dot from "@presentational/reusables/Dot";
import LeftArrowSvg from "app/static/svg/LeftArrowSvg";

import { Button, Tooltip } from "antd";
import { CommentOutlined } from "@ant-design/icons";
import { AccountsContext } from "../../../Accounts";
import { useHistory } from "react-router";
import {
    formatDateForAccounts,
    formatFloat,
    getDisplayName,
} from "@tools/helpers";

import { AI_ACCOUNTS_SCORE } from "@constants/Account/index";
import UpRightArrowSvg from "app/static/svg/UpRightArrowSvg";

import FiltersUI from "./FiltersUI";
import { useDispatch, useSelector } from "react-redux";
import { setAccountSearchFilter } from "@store/accounts/actions";
import ChevronRightSvg from "app/static/svg/ChevronRightSvg";
import { getDateTime } from "@tools/helpers";
import { capitalize } from "lodash";

function DetailsPageHeader(props) {
    const {
        state: { aiScoreCollpase, commentsCollapse, leadScoreCollpase },
        setState,
        setListPage,
        loaders,
        searchFilters: {
            topics,
            clients,
            reps,
            aiDataFilter,
            date: epoch,
            leadScoreFilter,
        },
        accountDetails: {
            stage,
            lead_score,
            currency,
            ai_score,
            sales_task,
            crm_url,
            account_size,
            lead_classification,
        },
    } = useContext(AccountsContext);

    const [filters, setFilters] = useState([]);
    const versionData = useSelector((state) => state.common.versionData);

    const { stats_threshold } = versionData;

    useEffect(() => {
        const data = [...topics, ...clients, ...reps];
        if (leadScoreFilter?.type_id) {
            data.push(leadScoreFilter);
        }
        if (aiDataFilter.question_id || aiDataFilter.sub_filter_id) {
            data.push(aiDataFilter);
        }
        if (epoch) {
            const date = new Date(epoch * 1000);

            const dd = date.getUTCDate();
            const mm = date.getUTCMonth() + 1;
            const yy = date.getUTCFullYear();

            data.push({
                type: "Date",
                id: date,
                name: formatDateForAccounts([yy, mm, dd], true),
            });
        }
        setFilters(data);
    }, [topics, clients, reps, aiDataFilter, epoch, leadScoreFilter]);

    const dispatch = useDispatch();

    const removeFilter = useCallback(
        ({ id, type, name }) => {
            switch (type) {
                case "topic":
                    dispatch(
                        setAccountSearchFilter({
                            topics: topics.filter((topic) => topic.id !== id),
                        })
                    );

                    break;
                case "client":
                    dispatch(
                        setAccountSearchFilter({
                            clients: clients.filter(
                                (client) => client.id !== id
                            ),
                        })
                    );

                    break;
                case "owner":
                case "reps":
                    dispatch(
                        setAccountSearchFilter({
                            reps: reps.filter((rep) => rep.id !== id),
                        })
                    );

                    break;
                case "Account Scoring":
                    dispatch(
                        setAccountSearchFilter({
                            aiDataFilter: {},
                        })
                    );

                    break;
                case "Date":
                    dispatch(
                        setAccountSearchFilter({
                            date: "",
                            meeting_ids: [],
                        })
                    );

                    break;
                case "Lead Score":
                    dispatch(
                        setAccountSearchFilter({
                            leadScoreFilter: {},
                        })
                    );

                    break;
                default:
            }
        },
        [topics, clients, reps, aiDataFilter]
    );

    const clearAll = () => {
        dispatch(
            setAccountSearchFilter({
                topics: [],
                clients: [],
                reps: [],
                aiDataFilter: {},
                date: "",
                leadScoreFilter: {},
                meeting_ids: [],
            })
        );
    };

    const history = useHistory();
    return (
        <div className="paddingT16 paddingB16 paddingL37 paddingR30 paddingLR30 white_bg mine_shaft_cl accounts__detailspage__header border flex">
            {loaders.mainLoader || (
                <>
                    <div className="flex flex1 bolder alignStart">
                        <div
                            className={"curPoint marginR22"}
                            onClick={() => {
                                history.push("/accounts");
                                setListPage();
                            }}
                        >
                            <LeftArrowSvg
                                style={{ fontSize: "14px", marginTop: "8px" }}
                            />
                        </div>
                        <div className="width100p">
                            <span className="font24 bold700 marginB12">
                                {sales_task?.name}
                                <span
                                    className={`lead_score_type ${lead_classification}`}
                                >
                                    {capitalize(lead_classification)}
                                </span>
                            </span>
                            <div className="flex alignCenter justifySpaceBetween width100p">
                                <div className="flex  alignCenter marginR25">
                                    <div className="flex alignCenter marginR25 font14 bold600">
                                        <Tooltip
                                            destroyTooltipOnHide
                                            title={"Owner"}
                                        >
                                            <div>
                                                {sales_task?.owner
                                                    ? getDisplayName({
                                                          ...sales_task?.owner,
                                                      })
                                                    : "No owner assigned"}
                                            </div>
                                        </Tooltip>
                                        <Dot
                                            height="5px"
                                            width="5px"
                                            className="silver_bg marginLR10"
                                        />
                                        <Tooltip
                                            destroyTooltipOnHide
                                            title={"Deal Size"}
                                        >
                                            <span>
                                                {account_size
                                                    ? `${
                                                          currency || "$"
                                                      } ${account_size}`
                                                    : "No ticket size"}
                                            </span>
                                        </Tooltip>
                                        <Dot
                                            height="5px"
                                            width="5px"
                                            className="silver_bg marginLR10"
                                        />
                                        <Tooltip
                                            destroyTooltipOnHide
                                            title={"Stage"}
                                        >
                                            <span>{stage || "No stage"}</span>
                                        </Tooltip>
                                        <Dot
                                            height="5px"
                                            width="5px"
                                            className="silver_bg marginLR10"
                                        />
                                        <Tooltip
                                            destroyTooltipOnHide
                                            title={"Created Date"}
                                        >
                                            <span>
                                                {sales_task?.created
                                                    ? getDateTime(
                                                          sales_task?.created,
                                                          undefined,
                                                          undefined,
                                                          "dd MM, YY"
                                                      )
                                                    : "No created date"}
                                            </span>
                                        </Tooltip>
                                    </div>
                                    <Tooltip
                                        destroyTooltipOnHide
                                        title={
                                            crm_url
                                                ? ""
                                                : "Complete your CRM integration in settings"
                                        }
                                    >
                                        <Button
                                            type="primary"
                                            ghost
                                            className={`button_primary ${
                                                crm_url
                                                    ? ""
                                                    : "crm_button_dissabled"
                                            }`}
                                            disabled={crm_url ? false : true}
                                            onClick={() => {
                                                crm_url && window.open(crm_url);
                                            }}
                                        >
                                            VIEW IN CRM
                                            <UpRightArrowSvg />
                                        </Button>
                                    </Tooltip>
                                </div>

                                <div className="flex alignCenter">
                                    {versionData?.domain_type === "b2c" &&
                                        typeof ai_score === "number" && (
                                            <Button
                                                type="primary"
                                                className={
                                                    aiScoreCollpase
                                                        ? `${
                                                              ai_score >=
                                                              stats_threshold?.good
                                                                  ? "good"
                                                                  : ai_score >=
                                                                    stats_threshold?.bad
                                                                  ? "avg"
                                                                  : "bad"
                                                          } `
                                                        : "button_primary--active"
                                                }
                                                onClick={() => {
                                                    setState({
                                                        type: "SET_AI_SIDER_COLLAPSE",
                                                    });
                                                    if (!commentsCollapse) {
                                                        setState({
                                                            type: "SET_COMMENTS_SIDER_COLLAPSE",
                                                        });
                                                    }
                                                    if (!leadScoreCollpase) {
                                                        setState({
                                                            type: "SET_LEAD_SCORE_SIDER_COLLAPSE",
                                                        });
                                                    }
                                                }}
                                            >
                                                <span className="white_cl bold600 font12 ">
                                                    {AI_ACCOUNTS_SCORE}
                                                </span>
                                                <span className="bold700 marginL8 marginR12 white_cl">
                                                    {formatFloat(ai_score)}%
                                                </span>
                                                <span className="bolder white_cl font12">
                                                    <ChevronRightSvg />
                                                </span>
                                            </Button>
                                        )}
                                    {/* {!versionData?.noLeadScore && (
                                        <Button
                                            type="primary"
                                            ghost={leadScoreCollpase}
                                            className={
                                                leadScoreCollpase
                                                    ? ""
                                                    : "button_primary--active"
                                            }
                                            onClick={() => {
                                                setState({
                                                    type: "SET_LEAD_SCORE_SIDER_COLLAPSE",
                                                });
                                                if (!aiScoreCollpase) {
                                                    setState({
                                                        type: "SET_AI_SIDER_COLLAPSE",
                                                    });
                                                }
                                                if (!commentsCollapse) {
                                                    setState({
                                                        type: "SET_COMMENTS_SIDER_COLLAPSE",
                                                    });
                                                }
                                            }}
                                        >
                                            <div className="flex alignCenter">
                                                <span className="mine_shaft_cl bold600 font12 marginLR6">
                                                    LEAD SCORE{" "}
                                                </span>
                                                <span className='="bold700 primary_cl marginR10'>
                                                    {formatFloat(lead_score, 2)}
                                                    %
                                                </span>
                                                <span className="bolder mine_shaft_cl font12">
                                                    <ChevronRightSvg />
                                                </span>
                                            </div>
                                        </Button>
                                    )} */}

                                    <Button
                                        type="primary"
                                        ghost={commentsCollapse}
                                        className={
                                            commentsCollapse
                                                ? "marginL12"
                                                : "button_primary--active marginL12"
                                        }
                                        onClick={() => {
                                            setState({
                                                type: "SET_COMMENTS_SIDER_COLLAPSE",
                                            });
                                            if (!aiScoreCollpase) {
                                                setState({
                                                    type: "SET_AI_SIDER_COLLAPSE",
                                                });
                                            }
                                            if (!leadScoreCollpase) {
                                                setState({
                                                    type: "SET_LEAD_SCORE_SIDER_COLLAPSE",
                                                });
                                            }
                                        }}
                                    >
                                        <div className='="flex alignCenter'>
                                            <span className="mine_shaft_cl inline-flex items-center">
                                                <CommentOutlined />
                                            </span>

                                            <span className="mine_shaft_cl bold600 font12 marginLR6">
                                                COMMENTS
                                            </span>
                                            <span className="bolder mine_shaft_cl font12 inline-flex items-center">
                                                <ChevronRightSvg />
                                            </span>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                            {!!filters.length && (
                                <div className="flex alignCenter bold marginR25 marginT10">
                                    <FiltersUI
                                        data={filters}
                                        removeFilter={removeFilter}
                                        clearAll={clearAll}
                                        blockWidth={200}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* <Popover content={content}>
                                    <div className="curPoint bold">3+ more</div>
                                </Popover>
                                <div className="curPoint bold underline marginL10">
                                    Clear All
                                </div> */}
                </>
            )}
        </div>
    );
}

export default DetailsPageHeader;
