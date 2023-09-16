import React, { useContext } from "react";
import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Popover, Button, Modal, Input, Form } from "antd";
import CloseSvg from "app/static/svg/CloseSvg";
import ConvinLogoSvg from "app/static/svg/ConvinLogoSvg";
import {
    getSubscriptions,
    setCreateSubscriptionFlag,
} from "@store/billing/billing";
import { getDateTime } from "@tools/helpers";
import ThreeDotSvg from "app/static/svg/ThreeDotSvg";
import { BillingContext } from "./index";
import billingConfig from "@constants/Billing";

const { TextArea } = Input;

const layoutClasses = {
    planType: "col-3",
    currentStatus: "col-5",
    licenses: "col-3",
    startDate: "col-4",
    billingCycle: "col-3",
    planPrice: "col-3",
    payNow: "col-2",
    moreOptions: "col-1",
};
const MAX_DAYS = 15;

export default function Subscriptions() {
    const { handleManageSubscriptionVisible } = useContext(BillingContext);
    const {
        subscription: { data: subscriptionData },
    } = useSelector((state) => state.billing);
    const {
        versionData: { auto_deduct_enabled },
    } = useSelector((state) => state.common);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSubscriptions());
    }, []);

    const [visible, setVisible] = useState(false);

    return (
        <div
            className="billing__subscriptions"
            data-testid="component-subscription"
        >
            <div className="flex justifySpaceBetween alignCenter marginB20">
                <div className="bold600 font20">Your Plans</div>
                <button
                    className="billing__subscriptions--manage app__billing--btn"
                    onClick={() => {
                        dispatch(setCreateSubscriptionFlag(false));
                        handleManageSubscriptionVisible(true);
                    }}
                    disabled={!subscriptionData?.plan_id}
                >
                    Manage Subscription
                </button>
            </div>
            {subscriptionData && (
                <>
                    <div className="app__billing--tableLabels row">
                        <div
                            className={`app__billing--tableLabel ${layoutClasses.planType}`}
                        >
                            Plan Type
                        </div>
                        <div
                            className={`app__billing--tableLabel ${layoutClasses.currentStatus}`}
                        >
                            Current Status
                        </div>
                        <div
                            className={`app__billing--tableLabel ${layoutClasses.licenses}`}
                        >
                            Licenses
                        </div>
                        <div
                            className={`app__billing--tableLabel ${layoutClasses.startDate}`}
                        >
                            Start Date
                        </div>
                        <div
                            className={`app__billing--tableLabel ${layoutClasses.billingCycle}`}
                        >
                            Billing Cycle
                        </div>
                        <div
                            className={`app__billing--tableLabel ${layoutClasses.planPrice}`}
                        >
                            Plan Price
                        </div>
                    </div>
                    <div className="billing__subscriptions--card row">
                        <div
                            className={`font16 bold600 ${layoutClasses.planType}`}
                        >
                            {subscriptionData?.subscription_type}
                        </div>
                        <div className={`${layoutClasses.currentStatus}`}>
                            <StatusTag daysLeft={subscriptionData?.days_left} />
                        </div>
                        <div
                            className={`billing__subscriptions--value ${layoutClasses.licenses}`}
                        >
                            {subscriptionData?.total_licenses}
                        </div>
                        <div
                            className={`billing__subscriptions--value ${layoutClasses.startDate}`}
                        >
                            {getDateTime(
                                subscriptionData?.startdate * 1000,
                                "date"
                            )}
                        </div>
                        <div
                            className={`billing__subscriptions--value capitalize ${layoutClasses.billingCycle}`}
                        >
                            {subscriptionData?.billing_cycle}
                        </div>
                        <div
                            className={`billing__subscriptions--value ${layoutClasses.planPrice}`}
                        >
                            {`${
                                billingConfig[
                                    subscriptionData?.currency?.toUpperCase()
                                ]
                            }${subscriptionData?.price_per_user}/ `}
                            License
                        </div>
                        <div className={`${layoutClasses.payNow}`}>
                            <button
                                className="billing__subscriptions--payNow app__billing--btn "
                                disabled={
                                    subscriptionData?.days_left > 15 ||
                                    auto_deduct_enabled
                                }
                                onClick={() => {
                                    dispatch(setCreateSubscriptionFlag(true));
                                    handleManageSubscriptionVisible(true);
                                }}
                            >
                                Pay now
                            </button>
                        </div>
                        {auto_deduct_enabled ? (
                            <div
                                className={`${layoutClasses.moreOptions} flexImp justifyCenter`}
                            >
                                <Popover
                                    content={
                                        <Button
                                            type="text"
                                            danger
                                            onClick={() => setVisible(true)}
                                        >
                                            Cancel Subscription
                                        </Button>
                                    }
                                    placement="bottomRight"
                                    trigger="click"
                                >
                                    <button className="billing__subscriptions--moreOptionsBtn">
                                        <ThreeDotSvg />
                                    </button>
                                </Popover>
                                <Modal
                                    title={
                                        <div className="flex alignCenter ">
                                            <ConvinLogoSvg />{" "}
                                            <p className="marginL10">
                                                Cancellation
                                            </p>
                                        </div>
                                    }
                                    centered
                                    visible={visible}
                                    onOk={() => setVisible(false)}
                                    onCancel={() => setVisible(false)}
                                    footer={null}
                                    closeIcon={
                                        <CloseSvg
                                            style={{
                                                color: "#666666",
                                            }}
                                        />
                                    }
                                >
                                    <p>
                                        Please write us to <b>Cancel</b> the
                                        subscription.
                                    </p>
                                    <Form>
                                        <Form.Item
                                            name="cancelMessage"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Message cannot be empty",
                                                },
                                                {
                                                    whiteSpace: true,
                                                    message:
                                                        "Please enter a message",
                                                },
                                                {
                                                    min: 75,
                                                    message:
                                                        "Message should be at least 75 characters",
                                                },
                                            ]}
                                        >
                                            <TextArea
                                                rows={4}
                                                style={{ borderRadius: "5px" }}
                                                placeholder="Write a brief description"
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button
                                                type="primary "
                                                className="flex alignCenter "
                                                style={{
                                                    borderRadius: "5px",
                                                    marginLeft: "auto",
                                                    marginRight: "auto",
                                                    padding: "15px 19px",
                                                }}
                                                htmlType="submit"
                                            >
                                                Send Request
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Modal>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

const StatusTag = ({ daysLeft }) => {
    const {
        versionData: { auto_deduct_enabled },
    } = useSelector((state) => state.common);

    if (!daysLeft) {
        return (
            <span className={`billing__subscriptions--expired`}>Expired</span>
        );
    }
    if (daysLeft < MAX_DAYS) {
        if (auto_deduct_enabled)
            return (
                <span className={`billing__subscriptions--expiring`}>
                    Auto Renewing in {daysLeft} days
                </span>
            );
        else {
            return (
                <span className={`billing__subscriptions--expiring`}>
                    Expiring in {daysLeft} days
                </span>
            );
        }
    }
    if (daysLeft < MAX_DAYS && auto_deduct_enabled) {
        return (
            <span className={`billing__subscriptions--expiring`}>
                Auto Renewing in {daysLeft} days
            </span>
        );
    }
    return <span className={`billing__subscriptions--active`}>Active</span>;
};
