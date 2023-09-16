import {
    formatFloat,
    formatDateForAccounts,
    getDisplayName,
    getColor,
    getDateTime,
} from "@tools/helpers";
import { Avatar, Col, Row, Tag, Tooltip } from "antd";
import React, { useContext } from "react";
import PhoneSvg from "app/static/svg/PhoneSvg";
import { AccountsContext } from "../../../Accounts";
import MessageSvg from "app/static/svg/MessageSvg";
import ChevronRightSvg from "app/static/svg/ChevronRightSvg";
import ProgressSvg from "@presentational/reusables/ProgressSvg";
import UserAvatar from "@presentational/reusables/UserAvatar";
import Dot from "@presentational/reusables/Dot";
import { useSelector } from "react-redux";

function AccountCard({
    ai_score,
    meeting_count,
    avatar,
    last_connected_date,
    account_size,
    currency,
    stage,
    owner,
    id,
    sales_task,
    lead_classification,
}) {
    const { viewAccount } = useContext(AccountsContext);
    const displayName = getDisplayName({ ...sales_task?.owner });
    const percentage = formatFloat(ai_score);
    const { checkIsPhoneNumber } = useContext(AccountsContext);
    const versionData = useSelector((state) => state.common.versionData);
    const { name, primary_phone, created } = sales_task;

    const { stats_threshold } = useSelector(
        (state) => state.common.versionData
    );

    return (
        <div
            className={`marginB20 acconts_list_card ${lead_classification}`}
            onClick={() => viewAccount(id)}
        >
            <div className="white_bg paddingLR25 paddingT20 paddingB18 borderRadius6 mine_shaft_cl curPoint">
                <Row>
                    <Col
                        className="flex alignCenter paddingR10"
                        span={versionData?.domain_type === "b2c" ? 6 : 8}
                    >
                        <div
                            style={{
                                width: "44px",
                            }}
                        >
                            {checkIsPhoneNumber(name?.[0].toUpperCase()) ? (
                                <UserAvatar size={44} color={getColor(name)} />
                            ) : (
                                <Avatar
                                    style={{
                                        backgroundColor: getColor(name),
                                        verticalAlign: "middle",
                                        fontSize: "18px",
                                    }}
                                    className="bold600"
                                    size={44}
                                >
                                    {name?.[0].toUpperCase()}
                                </Avatar>
                            )}
                        </div>
                        <div
                            className="flex1 paddingL19"
                            style={{
                                width: "90%",
                            }}
                        >
                            <div className="bold600 capitalize font16 text_ellipsis">
                                {name}
                            </div>
                            <div className="bold font14 flex phone_email_count">
                                <div className="marginR10 flex alignCenter width100p">
                                    <PhoneSvg
                                        style={{
                                            color: "#52C41A",
                                            transform: "scale(0.8)",
                                        }}
                                    />
                                    <span className="font14 marginT3 marginL5 marginR15 dove_gray_cl bold600">
                                        {meeting_count}
                                    </span>
                                    <MessageSvg
                                        style={{
                                            color: "#ECA61D",
                                        }}
                                    />
                                    <span className="font14 marginT3 marginL5 marginR15 dove_gray_cl bold600">
                                        0
                                    </span>
                                    {primary_phone && (
                                        <>
                                            <Dot
                                                height="4px"
                                                width="4px"
                                                className="dove_gray_bg marginR4"
                                            />
                                            <span className="font14 bold600 dove_gray_cl marginT3 flex1 text_ellipsis">
                                                {primary_phone}
                                            </span>
                                        </>
                                    )}
                                </div>
                                <div></div>
                            </div>
                        </div>
                    </Col>

                    <Col
                        xl={4}
                        lg={4}
                        md={4}
                        sm={4}
                        xs={4}
                        className="flex alignCenter paddingL16 paddingR30"
                    >
                        {sales_task?.owner ? (
                            checkIsPhoneNumber(
                                displayName?.[0].toUpperCase()
                            ) ? (
                                <>
                                    <UserAvatar
                                        size={29}
                                        color={getColor(displayName)}
                                        scale="0.6"
                                    />
                                    <Tooltip
                                        destroyTooltipOnHide
                                        title={displayName}
                                    >
                                        <span className="font14 bold600 marginL8 flex1 text_ellipsis">
                                            {displayName}
                                        </span>
                                    </Tooltip>
                                </>
                            ) : (
                                <>
                                    <Avatar
                                        style={{
                                            backgroundColor:
                                                getColor(displayName),
                                            verticalAlign: "middle",

                                            fontSize: "18px",
                                        }}
                                        size={29}
                                        className="bold"
                                    >
                                        {displayName[0]}
                                    </Avatar>

                                    <Tooltip
                                        destroyTooltipOnHide
                                        title={displayName}
                                    >
                                        <span className="font14 bold600 marginL8 flex1 text_ellipsis">
                                            {displayName}
                                        </span>
                                    </Tooltip>
                                </>
                            )
                        ) : (
                            <span className="font14 bold600">_</span>
                        )}
                    </Col>
                    <Col
                        xl={3}
                        lg={3}
                        md={3}
                        sm={3}
                        xs={3}
                        className="flex alignCenter"
                    >
                        <span className="font14 bold600 marginL5">
                            {created
                                ? getDateTime(
                                      created,
                                      undefined,
                                      undefined,
                                      "dd MM, YY"
                                  )
                                : "_"}
                        </span>
                    </Col>
                    <Col
                        xl={3}
                        lg={3}
                        md={3}
                        sm={3}
                        xs={3}
                        className="flex alignCenter"
                    >
                        <span className="font14 bold600 marginL5">
                            {last_connected_date
                                ? formatDateForAccounts(
                                      last_connected_date.split(["-"])
                                  )
                                : "_"}
                        </span>
                    </Col>
                    <Col
                        xl={2}
                        lg={2}
                        md={2}
                        sm={2}
                        xs={2}
                        className="flex alignCenter"
                    >
                        {account_size ? (
                            <div className="lima_cl bold600 font16">
                                {account_size
                                    ? `${currency || "$"} ${account_size}`
                                    : "NA"}
                            </div>
                        ) : (
                            <span className="font14 bold600">_</span>
                        )}
                    </Col>
                    <Col
                        xl={3}
                        lg={3}
                        md={3}
                        sm={3}
                        xs={3}
                        className="flex alignCenter"
                    >
                        {stage ? (
                            <Tag
                                style={{
                                    color: "#1A62F2",
                                    fontSize: "14px",
                                }}
                                color="#1A62F233"
                                className="bold600 text_ellipsis"
                            >
                                {stage}
                            </Tag>
                        ) : (
                            <span className="font14 bold600">_</span>
                        )}
                    </Col>

                    {versionData?.domain_type === "b2c" && (
                        <Col
                            xl={2}
                            lg={2}
                            md={2}
                            sm={2}
                            xs={2}
                            className="flex alignCenter"
                        >
                            <span className="font14 bold600 marginL5">
                                <ProgressSvg
                                    percentage={percentage || 0}
                                    color={
                                        percentage >= stats_threshold.good
                                            ? "#52C41A"
                                            : percentage >= stats_threshold.bad
                                            ? "#ECA51D"
                                            : "#FF6365"
                                    }
                                    stroke={
                                        percentage >= stats_threshold.good
                                            ? "#52C41A33"
                                            : percentage >= stats_threshold.bad
                                            ? "#ECA51D33"
                                            : "#FF636533"
                                    }
                                    circleSize={44}
                                    strokeWidth={4}
                                    fontSize={14}
                                    fontWeight={600}
                                />

                                {/* {formatFloat(ai_score)}% */}
                            </span>
                        </Col>
                    )}
                    <Col
                        xl={1}
                        lg={1}
                        md={1}
                        sm={1}
                        xs={1}
                        className="flex alignCenter justifyEnd"
                    >
                        <div className="flex alignCenter justifyCenter chevron">
                            <ChevronRightSvg
                                style={{
                                    color: "rgb(51,51,51)",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="lead_score_type">{lead_classification}</div>
        </div>
    );
}

AccountCard.defaultProps = {
    owner: [],
};

export default AccountCard;

// color={'#52C41A'}
// stroke={'#52C41A33'}

// color={'#ECA51D'}
// stroke={'#ECA51D33'}

// color={'#FF6365'}
// stroke={'#FF636533'}
