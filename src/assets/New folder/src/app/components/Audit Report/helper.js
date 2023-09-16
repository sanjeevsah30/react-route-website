import {
    capitalizeFirstLetter,
    formatFloat,
    getRandomColors,
} from "@tools/helpers";
import { Button, Tooltip, Typography } from "antd";
import React from "react";
import ReportPercentage from "./ReportPercentage";

export const getAuditorColumList = (callback, noAiAudit, meetingType) => {
    if (meetingType === "call")
        return [
            {
                title: "Name",
                dataIndex: "name",
                key: "name",
                // render: ({ text, red_alert }) => (
                //     <div
                //         className={`${
                //             red_alert ? 'red_alert report_red_color bold' : 'bold'
                //         }`}
                //     >
                //         {text}
                //     </div>
                // ),
                render: (name) => (
                    <div className="bold text-left">
                        <Tooltip title={name}>
                            <Typography.Text ellipsis={true}>
                                {name}
                            </Typography.Text>
                        </Tooltip>
                    </div>
                ),
            },
            {
                title: noAiAudit ? "Calls Scored" : "Calls Audited",
                dataIndex: "call_audit_details",
                key: "call_audit_details",
                render: ({ count, change }, record) => (
                    <div className="bold font18">
                        {formatFloat(count, 2)}{" "}
                        <ReportPercentage change={change} className="font12" />
                    </div>
                ),
                sorter: (a, b) =>
                    a["call_audit_details"].count -
                    b["call_audit_details"].count,
            },
            {
                title: noAiAudit ? "Accounts Scored" : "Accounts Audited",
                dataIndex: "account_audit_details",
                key: "account_audit_details",
                render: ({ count, change }) => (
                    <div className="bold font18">
                        {formatFloat(count, 2)}{" "}
                        <ReportPercentage change={change} className="font12" />
                    </div>
                ),
                sorter: (a, b) =>
                    a["account_audit_details"].count -
                    b["account_audit_details"].count,
            },
            {
                title: noAiAudit ? "Minutes Scored" : "Minutes Audited",
                dataIndex: "minute_audit_details",
                key: "minute_audit_details",
                render: (e) =>
                    e ? (
                        <div className="bold font18">
                            {`${formatFloat(e?.count, 2)} mins `}
                            <ReportPercentage
                                change={e?.change}
                                className="font12"
                            />
                        </div>
                    ) : (
                        <></>
                    ),
                sorter: (a, b) =>
                    a["minute_audit_details"].count -
                    b["minute_audit_details"].count,
            },
            {
                title: noAiAudit ? "Agents Scored" : "Agents Audited",
                dataIndex: "agent_audit_details",
                key: "agent_audit_details",
                render: ({ count, change }) => (
                    <div className="bold font18">
                        {formatFloat(count, 2)}{" "}
                        <ReportPercentage change={change} className="font12" />
                    </div>
                ),
                sorter: (a, b) =>
                    a["agent_audit_details"].count -
                    b["agent_audit_details"].count,
            },
            {
                title: "Teams Covered",
                dataIndex: "teams_covered",
                key: "teams_covered",

                render: (teams_covered) => {
                    return (
                        <>
                            {teams_covered.slice(0, 2).map((team, idx) => {
                                return (
                                    <Tooltip
                                        title={capitalizeFirstLetter(team)}
                                    >
                                        <Typography.Text
                                            ellipsis
                                            className="marginR10 padding4 borderRadius4 team_tag"
                                            style={{
                                                backgroundColor:
                                                    getRandomColors(team) +
                                                    "80",
                                                color: "#fff",
                                            }}
                                            key={idx}
                                        >
                                            {capitalizeFirstLetter(team)}
                                        </Typography.Text>
                                    </Tooltip>
                                );
                            })}
                            {teams_covered?.length > 4 ? (
                                <Tooltip
                                    title={teams_covered
                                        .slice(2)
                                        .reduce((str, name) => {
                                            return str + ", " + name;
                                        })}
                                >
                                    <span
                                        className="marginR10 padding4 borderRadius4 dove_gray_cl"
                                        style={{
                                            backgroundColor: "#9999994D",
                                        }}
                                    >
                                        +{teams_covered?.length - 2}
                                    </span>
                                </Tooltip>
                            ) : null}
                        </>
                    );
                },
            },
            {
                title: "",
                dataIndex: "id",
                key: "id",
                render: (id, record) => (
                    <Button
                        type="text primary_cl--important borderRadius5"
                        onClick={(e) => {
                            e.stopPropagation();
                            callback(record.id, record.name);
                        }}
                    >
                        VIEW
                    </Button>
                ),
            },
        ];
    else if (meetingType.toLowerCase() === "email")
        return [
            {
                title: "Name",
                dataIndex: "name",
                key: "name",
                // render: ({ text, red_alert }) => (
                //     <div
                //         className={`${
                //             red_alert ? 'red_alert report_red_color bold' : 'bold'
                //         }`}
                //     >
                //         {text}
                //     </div>
                // ),
                render: (name) => <div className="bold">{name}</div>,
            },
            {
                title: noAiAudit ? "Emails Scored" : "Emails Audited",
                dataIndex: "call_audit_details",
                key: "call_audit_details",
                render: ({ count, change }, record) => (
                    <div className="bold font18 ">
                        {formatFloat(count, 2)}{" "}
                        <ReportPercentage change={change} className="font12" />
                    </div>
                ),
                sorter: (a, b) =>
                    a["call_audit_details"].count -
                    b["call_audit_details"].count,
            },
            {
                title: noAiAudit ? "Accounts Scored" : "Accounts Audited",
                dataIndex: "account_audit_details",
                key: "account_audit_details",
                render: ({ count, change }) => (
                    <div className="bold font18">
                        {formatFloat(count, 2)}{" "}
                        <ReportPercentage change={change} className="font12" />
                    </div>
                ),
                sorter: (a, b) =>
                    a["account_audit_details"].count -
                    b["account_audit_details"].count,
            },
            {
                title: noAiAudit ? "Minutes Scored" : "Minutes Audited",
                dataIndex: "minute_audit_details",
                key: "minute_audit_details",
                render: (e) =>
                    e ? (
                        <div className="bold font18">
                            {`${formatFloat(e?.count, 2)} mins `}
                            <ReportPercentage
                                change={e?.change}
                                className="font12"
                            />
                        </div>
                    ) : (
                        <></>
                    ),
                sorter: (a, b) =>
                    a["minute_audit_details"].count -
                    b["minute_audit_details"].count,
            },
            {
                title: noAiAudit ? "Agents Scored" : "Agents Audited",
                dataIndex: "agent_audit_details",
                key: "agent_audit_details",
                render: ({ count, change }) => (
                    <div className="bold font18">
                        {formatFloat(count, 2)}{" "}
                        <ReportPercentage change={change} className="font12" />
                    </div>
                ),
                sorter: (a, b) =>
                    a["agent_audit_details"].count -
                    b["agent_audit_details"].count,
            },
            {
                title: "Teams Covered",
                dataIndex: "teams_covered",
                key: "teams_covered",

                render: (teams_covered) => {
                    return (
                        <>
                            {teams_covered.slice(0, 2).map((team, idx) => {
                                return (
                                    <Tooltip
                                        title={capitalizeFirstLetter(team)}
                                    >
                                        <Typography.Text
                                            ellipsis
                                            className="marginR10 padding4 borderRadius4 team_tag"
                                            style={{
                                                backgroundColor:
                                                    getRandomColors(team) +
                                                    "80",
                                                color: "#fff",
                                            }}
                                            key={idx}
                                        >
                                            {capitalizeFirstLetter(team)}
                                        </Typography.Text>
                                    </Tooltip>
                                );
                            })}
                            {teams_covered?.length > 4 ? (
                                <Tooltip
                                    title={teams_covered
                                        .slice(2)
                                        .reduce((str, name) => {
                                            return str + ", " + name;
                                        })}
                                >
                                    <span
                                        className="marginR10 padding4 borderRadius4 dove_gray_cl"
                                        style={{
                                            backgroundColor: "#9999994D",
                                        }}
                                    >
                                        +{teams_covered?.length - 2}
                                    </span>
                                </Tooltip>
                            ) : null}
                        </>
                    );
                },
            },
            {
                title: "",
                dataIndex: "id",
                key: "id",
                render: (id, record) => (
                    <Button
                        type="text primary_cl--important borderRadius5"
                        onClick={(e) => {
                            e.stopPropagation();
                            callback(record.id, record.name);
                        }}
                    >
                        VIEW
                    </Button>
                ),
            },
        ];
    else
        return [
            {
                title: "Name",
                dataIndex: "name",
                key: "name",
                // render: ({ text, red_alert }) => (
                //     <div
                //         className={`${
                //             red_alert ? 'red_alert report_red_color bold' : 'bold'
                //         }`}
                //     >
                //         {text}
                //     </div>
                // ),
                render: (name) => (
                    <div className="bold">
                        <Tooltip title={name}>
                            <Typography.Text ellipsis={true}>
                                {name}
                            </Typography.Text>
                        </Tooltip>
                    </div>
                ),
            },
            {
                title: noAiAudit ? "Chats Scored" : "Chats Audited",
                dataIndex: "call_audit_details",
                key: "call_audit_details",
                render: ({ count, change }, record) => (
                    <div className="bold font18 ">
                        {formatFloat(count, 2)}{" "}
                        <ReportPercentage change={change} className="font12" />
                    </div>
                ),
                sorter: (a, b) =>
                    a["call_audit_details"].count -
                    b["call_audit_details"].count,
            },
            {
                title: noAiAudit ? "Accounts Scored" : "Accounts Audited",
                dataIndex: "account_audit_details",
                key: "account_audit_details",
                render: ({ count, change }) => (
                    <div className="bold font18">
                        {formatFloat(count, 2)}{" "}
                        <ReportPercentage change={change} className="font12" />
                    </div>
                ),
                sorter: (a, b) =>
                    a["account_audit_details"].count -
                    b["account_audit_details"].count,
            },
            {
                title: noAiAudit ? "Agents Scored" : "Agents Audited",
                dataIndex: "agent_audit_details",
                key: "agent_audit_details",
                render: ({ count, change }) => (
                    <div className="bold font18">
                        {formatFloat(count, 2)}{" "}
                        <ReportPercentage change={change} className="font12" />
                    </div>
                ),
                sorter: (a, b) =>
                    a["agent_audit_details"].count -
                    b["agent_audit_details"].count,
            },
            {
                title: "Teams Covered",
                dataIndex: "teams_covered",
                key: "teams_covered",

                render: (teams_covered) => (
                    <div className="flex gap-2">
                        {teams_covered.slice(0, 2).map((team, idx) => {
                            return (
                                <Tooltip title={capitalizeFirstLetter(team)}>
                                    <Typography.Text
                                        ellipsis
                                        className="padding4 borderRadius4 team_tag"
                                        style={{
                                            backgroundColor:
                                                getRandomColors(team) + "80",
                                            color: "#fff",
                                        }}
                                        key={idx}
                                    >
                                        {capitalizeFirstLetter(team)}
                                    </Typography.Text>
                                </Tooltip>
                            );
                        })}
                        {teams_covered?.length > 4 ? (
                            <Tooltip
                                title={teams_covered
                                    .slice(2)
                                    .reduce((str, name) => {
                                        return str + ", " + name;
                                    })}
                            >
                                <Typography
                                    className="padding4 borderRadius4 dove_gray_cl"
                                    style={{
                                        backgroundColor: "#9999994D",
                                        width: "fit-content",
                                    }}
                                >
                                    +{teams_covered?.length - 2}
                                </Typography>
                            </Tooltip>
                        ) : null}
                    </div>
                ),
            },
            {
                title: "",
                dataIndex: "id",
                key: "id",
                render: (id, record) => (
                    <Button
                        type="text primary_cl--important borderRadius5"
                        onClick={(e) => {
                            e.stopPropagation();
                            callback(record.id, record.name);
                        }}
                    >
                        VIEW
                    </Button>
                ),
            },
        ];
};

export const getColumnName = (key, noAiAudit) => {
    switch (key) {
        case "manual_audit_score":
            return noAiAudit ? "Score" : "Manual Audited Score";
        case "ai_audit_score":
            return "AI Audited Score";
        case "manual_audited_score":
            return noAiAudit ? "Score" : "Manual Audited Score";
        case "ai_audited_score":
            return "AI Audited Score";
        case "call_audit_details":
            return noAiAudit ? "Calls Scored" : "Calls Audited";
        case "account_audit_details":
            return noAiAudit ? "Accounts Scored" : "Accounts Audited";
        case "minute_audit_details":
            return noAiAudit ? "Minutes Scored" : "Minutes Audited";
        case "agent_audit_details":
            return noAiAudit ? "Agents Scored" : "Agents Audited";
        default:
            return key;
    }
};

const showPercentage = (key) => {
    switch (key) {
        case "manual_audit_score":
            return true;
        case "ai_audit_score":
            return true;
        default:
            return false;
    }
};

export const getSalesTeamColumList = (callBack, columns = [], noAiAudit) => {
    return [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (name) => <div className="bold capitalize">{name}</div>,
            // render: ({ name, show_red }) => (
            //     <div
            //         className={`${
            //             show_red ? 'red_ledger report_red_color bold' : 'bold'
            //         }`}
            //     >
            //         {name}
            //     </div>
            // ),
        },
        ...columns.map((key) => ({
            title: getColumnName(key, noAiAudit),
            dataIndex: key,
            key: key,
            onCell: (record, rowIndex) => ({
                onClick: (event) => {},
            }),
            render: ({ count, change }) => (
                <div className="bold font18">
                    {formatFloat(count, 2)}
                    {showPercentage(key) && "%"}{" "}
                    <ReportPercentage change={change} className="font12" />
                </div>
            ),
            sorter: (a, b) => a[key].count - b[key].count,
        })),
        {
            title: "",
            dataIndex: "id",
            key: "id",
            render: (id) => (
                <Button
                    type="primary borderRadius5"
                    onClick={() => callBack(id)}
                >
                    VIEW
                </Button>
            ),
        },
    ];
};

export const getInsightsColumnList = (noAiAudit) => [
    {
        title: "Parameters",
        dataIndex: "parameter",
        key: "parameter",
        render: (text) => (
            <div
                className="bold"
                style={{
                    width: "500px",
                }}
            >
                {text}
            </div>
        ),
    },
    {
        title: "Categories",
        dataIndex: "category",
        key: "category",
    },
    !noAiAudit
        ? {
              title: "AI Audited Score",
              dataIndex: "ai_audit_score",
              key: "ai_audit_score",
              onCell: (record, rowIndex) => ({
                  onClick: (event) => {},
              }),
              render: ({ score, change }) => (
                  <div className="bold font18">
                      {`${formatFloat(score, 2)}% `}
                      <ReportPercentage change={change} className="font12" />
                  </div>
              ),
              sorter: (a, b) =>
                  a["ai_audit_score"].score - b["ai_audit_score"].score,
          }
        : {},
    {
        title: noAiAudit ? "Score" : "Manual Audited Score",
        dataIndex: "manual_audit_score",
        key: "manual_audit_score",
        onCell: (record, rowIndex) => ({
            onClick: () => {},
        }),
        render: ({ score, change }) => (
            <div className="bold font18">
                {`${formatFloat(score, 2)}% `}
                <ReportPercentage change={change} className="font12" />
            </div>
        ),
        sorter: (a, b) =>
            a["manual_audit_score"].score - b["manual_audit_score"].score,
    },
];

function isQuestion(key) {
    switch (key) {
        case "id":
            return false;
        case "name":
            return false;
        case "ai_audited_score":
            return false;
        case "manual_audited_score":
            return false;
        default:
            return true;
    }
}

export const getCallWiseColumList = (columns = [], noAiAudit) => {
    return [
        {
            title: "Call Name",
            dataIndex: "name",
            key: "name",
            render: (name) => <div className="bold">{name}</div>,
        },
        ...columns.map((key) => {
            const title = getColumnName(key, noAiAudit);
            return {
                title: (
                    <Tooltip destroyTooltipOnHide title={title}>
                        <div
                            style={
                                isQuestion(key)
                                    ? {
                                          width: "150px",
                                          textOverflow: "ellipsis",
                                          overflow: "hidden",
                                          whiteSpace: "nowrap",
                                      }
                                    : {}
                            }
                        >
                            {" "}
                            {title}
                        </div>
                    </Tooltip>
                ),
                dataIndex: key,

                key,
                render: (text) =>
                    isQuestion(key) ? (
                        <Tooltip destroyTooltipOnHide title={title}>
                            <div className="bold font18">
                                {formatFloat(text, 2)}
                            </div>
                        </Tooltip>
                    ) : (
                        <div className="bold font18">
                            {formatFloat(text, 2)}
                            {"%"}
                        </div>
                    ),
                sorter: (a, b) => a[key] - b[key],
                showSorterTooltip: false,
            };
        }),
    ];
};
