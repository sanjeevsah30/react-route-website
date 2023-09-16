import {
    Button,
    Checkbox,
    InputNumber,
    Modal,
    Radio,
    Skeleton,
    Tooltip,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CloseSvg from "app/static/svg/CloseSvg";
import { BillingContext } from "./index";
import isEmpty from "lodash/isEmpty";
import {
    getBillingPlans,
    getInvoices,
    getTotalPrice,
    setClosePopUpFlag,
    updateBillingPlan,
} from "@store/billing/billing";
import Spinner from "@presentational/reusables/Spinner";
import InfoSvg from "app/static/svg/InfoSvg";
import ApplyCoupon from "@container/ApplyCoupon/ApplyCoupon";
import { capitalizeFirstLetter, emptyCache } from "@tools/helpers";
import billingConfig from "@constants/Billing/index";
import { clearCoupon } from "@store/coupon/coupon";
import useDebounce from "hooks/useDebounce";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { getAppVersion } from "@apis/common/index";
import { showError, storeVersionData } from "@store/common/actions";
import apiErrors from "@apis/common/errors";
import { getAvailableSubscription } from "@store/settings/actions";
import BillingInfo from "./BillingInfo";

const tabs = {
    BILLING_INFO: "BILLING_INFO",
    MAKE_PAYMENT: "MAKE_PAYMENT",
};

export default function ManageSubscription() {
    const { showManageSubscriptions, handleManageSubscriptionVisible } =
        useContext(BillingContext);
    const dispatch = useDispatch();
    const {
        billing: {
            billingPlans,
            cartData,
            razor_pay_details,
            subscription,
            create_subscription_flag,
            close_popup,
            billing_info,
        },
        coupon: { data: couponData },
        common: { domain, versionData },
    } = useSelector((state) => state);

    const [nol, setNol] = useState(5);
    //Stores id of billingCycle
    const [billingCycle, setBillingCycle] = useState(-1);
    const [billingCycleObj, setBillingCycleObj] = useState({ id: -1 });
    const [enteredCode, setEnteredCode] = useState("");
    const debouncedLicence = useDebounce(nol, 300);

    useEffect(() => {
        if (isEmpty(billingPlans.data)) {
            dispatch(getBillingPlans());
        }
        if (versionData.auto_deduct_enabled) {
            setAutoDeduct(true);
        }
    }, []);

    const [activeTab, setActiveTab] = useState(tabs.BILLING_INFO);

    useEffect(() => {
        if (billingPlans.data) {
            setBillingCycle(
                billingPlans.data.find(({ is_upgradeable }) => is_upgradeable)
                    ?.id || -1
            );
        }
    }, [billingPlans?.data]);

    useEffect(() => {
        setBillingCycleObj(
            billingPlans?.data.find(({ id }) => +id === +billingCycle) || {
                id: -1,
            }
        );
    }, [billingCycle]);

    useEffect(() => {
        if (
            billingCycle === -1 ||
            !subscription?.data?.id ||
            !showManageSubscriptions ||
            nol === null
        ) {
            return;
        }
        const payload = {};
        // if (
        //     +subscription?.data?.id === +billingCycle &&
        //     !create_subscription_flag
        // ) {
        //     payload.licenses = nol - subscription?.data?.total_licenses;
        // } else {
        //     payload.licenses = nol;
        // }
        payload.licenses = nol;
        if (create_subscription_flag) {
            payload.create_subscription = create_subscription_flag;
        }
        if (couponData?.coupon_valid) {
            payload.coupon = couponData.code;
        }

        payload.plan_id = +billingCycle;
        payload.subscription_id = +subscription?.data?.id;

        dispatch(getTotalPrice(payload));
    }, [
        billingCycle,
        couponData?.code,
        debouncedLicence,
        showManageSubscriptions,
    ]);

    const handleNolChange = (val) => {
        setNol(val);
        if (!create_subscription_flag) {
            if (+val < subscription?.data?.total_licenses) {
                return setShowBanner(true);
            }
        } else {
            if (+val < subscription?.data?.active_licenses) {
                return setShowBanner(true);
            }
        }
        setShowBanner(false);
    };

    const [showBanner, setShowBanner] = useState(false);
    const handleLicenseValidation = (e) => {
        // Can use to show warning on screen if user types less than
        // a certain number for licenses
        if (!create_subscription_flag) {
            if (+e.target.value < subscription?.data?.total_licenses) {
                return setShowBanner(true);
            }
        } else {
            if (+e.target.value < subscription?.data?.active_licenses) {
                return setShowBanner(true);
            }
        }
        setShowBanner(false);
    };
    const handleBillingCycle = (e) => {
        setBillingCycle(e.target.value);
        dispatch(clearCoupon());
        setEnteredCode("");
    };
    const handleClickPay = () => {
        const payload = {
            plan_id: +billingCycle,
            licenses: nol,
        };

        payload.prev_plan_id = +subscription?.data?.plan_id;

        if (create_subscription_flag) {
            payload.create_subscription = create_subscription_flag;
        }

        if (couponData.coupon_valid) {
            payload.coupon = couponData.code;
        }
        if (auto_deduct) {
            payload.auto_deduct = auto_deduct;
            payload.provider_plan_id = billingPlans?.data.find(
                (el) => el.id === billingCycle
            )?.provider_plan_id;
        }
        dispatch(
            updateBillingPlan({
                payload,
                id: subscription?.data?.id,
            })
        );
    };

    useEffect(() => {
        if (showManageSubscriptions && close_popup) {
            handleManageSubscriptionVisible(false);
            dispatch(getInvoices());
            dispatch(getAvailableSubscription());
            getAppVersion(domain).then((res) => {
                if (res.status === apiErrors.AXIOSERRORSTATUS) {
                    showError(res);
                } else {
                    dispatch(storeVersionData({ ...res }));
                    let appVersion = localStorage.getItem("av");
                    if (!appVersion || +appVersion !== res.version) {
                        localStorage.setItem("av", res.version);
                        emptyCache();
                    }
                }
            });
            dispatch(setClosePopUpFlag(false));
        }
    }, [subscription?.data, close_popup]);

    const [minVal, setMinVal] = useState(5);

    useEffect(() => {
        if (!create_subscription_flag) {
            setMinVal(subscription?.data?.total_licenses);
            setNol(subscription?.data?.total_licenses);
        } else {
            setMinVal(subscription?.data?.active_licenses);
            setNol(subscription?.data?.active_licenses);
        }
    }, [
        subscription?.data?.total_licenses,
        subscription?.data?.active_licenses,
        create_subscription_flag,
        showManageSubscriptions,
    ]);

    useEffect(() => {
        dispatch(clearCoupon());
        setEnteredCode("");
    }, [showManageSubscriptions]);

    useEffect(() => {
        subscription?.data?.plan_id &&
            setBillingCycle(subscription?.data?.plan_id);
    }, [subscription?.data?.id, billingPlans.data]);

    useEffect(() => {
        !Object.keys(billing_info?.data)?.length
            ? setActiveTab(tabs.BILLING_INFO)
            : setActiveTab(tabs.MAKE_PAYMENT);
    }, [billing_info?.data]);

    // function to handle auto renew checkbox
    const [auto_deduct, setAutoDeduct] = useState(false);
    const handleCheckbox = (e) => {
        setAutoDeduct(e.target.checked);
    };

    return (
        <Modal
            id="manageSub"
            className={"manageSub"}
            width={710}
            title={
                activeTab === tabs.BILLING_INFO
                    ? "Billing Info"
                    : // <div>
                      //     <span
                      //         className={'curPoint marginR16'}
                      //         onClick={() => {
                      //             setActiveTab(tabs.BILLING_INFO);
                      //         }}
                      //     >
                      //         <LeftArrowSvg
                      //             style={{ fontSize: '14px', marginTop: '8px' }}
                      //         />
                      //     </span>
                      //     <span>Manage Subscription</span>
                      // </div>
                      "Manage Subscription"
            }
            visible={showManageSubscriptions}
            onCancel={() => {
                handleManageSubscriptionVisible(false);
            }}
            footer={null}
            closeIcon={
                <CloseSvg
                    style={{
                        color: "#666666",
                    }}
                />
            }
        >
            {activeTab === tabs.BILLING_INFO ? (
                <BillingInfo tabs={tabs} setActiveTab={setActiveTab} />
            ) : (
                <Spinner loading={billingPlans?.loading}>
                    <div className="manageSub__content">
                        <div className="flex alignCenter">
                            <p className="manageSub__label">No. of Licenses</p>
                            <InputNumber
                                className="manageSub__licenseInput"
                                min={minVal}
                                defaultValue={minVal}
                                onChange={handleNolChange}
                                onKeyUp={handleLicenseValidation}
                                disabled={billingCycle === -1}
                                value={nol}
                            />
                        </div>
                        {(nol === null || showBanner) && <Banner />}
                        <div className="manageSub__billingCycle">
                            <div className="flex alignCenter">
                                <span className="manageSub__label">
                                    Billing Cycle
                                </span>
                                <Tooltip
                                    destroyTooltipOnHide
                                    overlayClassName="manageSub__billingCycle--tooltip"
                                    title={
                                        <p className="font14 bold600">
                                            No Downgrade of the billing cycle
                                            allowed.
                                        </p>
                                    }
                                    placement="topLeft"
                                >
                                    <span className="manageSub__billingCycle--info">
                                        <InfoSvg />
                                    </span>
                                </Tooltip>
                            </div>
                            <Radio.Group
                                onChange={handleBillingCycle}
                                value={billingCycle}
                                className="manageSub__billingCycle--cards"
                            >
                                {billingPlans?.data?.map((item) => (
                                    <div
                                        className="manageSub__billingCycle--card"
                                        key={item.id}
                                    >
                                        <Radio
                                            value={item.id}
                                            disabled={
                                                !create_subscription_flag &&
                                                !item.is_upgradeable
                                            }
                                        >
                                            <span
                                                style={{
                                                    color:
                                                        !create_subscription_flag &&
                                                        !item.is_upgradeable
                                                            ? "#66666633"
                                                            : "#666666",
                                                }}
                                            >
                                                {capitalizeFirstLetter(
                                                    item?.type
                                                )}
                                            </span>
                                        </Radio>
                                        {item.promotion &&
                                            item.is_upgradeable && (
                                                <span className="manageSub__billingCycle--promotion">
                                                    {item.promotion}% off
                                                </span>
                                            )}
                                    </div>
                                ))}
                            </Radio.Group>
                        </div>
                        {versionData.auto_deduct_enabled ? (
                            <div className="flex marginT30">
                                <Checkbox defaultChecked disabled>
                                    Auto Renew
                                </Checkbox>
                            </div>
                        ) : (
                            <div className="flex marginT30">
                                <Checkbox onChange={(e) => handleCheckbox(e)}>
                                    Auto Renew
                                </Checkbox>
                            </div>
                        )}

                        <div className="marginT30">
                            <ApplyCoupon
                                billingCycle={billingCycle}
                                nol={nol}
                                enteredCode={enteredCode}
                                setEnteredCode={setEnteredCode}
                            />
                        </div>

                        <p className="manageSub__cartValue">
                            {cartData.loading ? (
                                <Skeleton active paragraph={false} />
                            ) : (
                                <>
                                    <span>You need to pay</span>
                                    <span className="primary font18 bold600">
                                        {` ${
                                            billingConfig[
                                                cartData?.data?.currency?.toUpperCase()
                                            ]
                                        }`}

                                        {cartData?.data?.total_price}
                                    </span>
                                    {cartData?.data?.total_price ? (
                                        <span>
                                            {" "}
                                            for this purchase of{" "}
                                            {cartData.data.licenses} new
                                            licenses for {cartData.data.days}{" "}
                                            days
                                            {cartData?.data?.platform_fee && (
                                                <>
                                                    {" "}
                                                    including platform fee of{" "}
                                                    <span className="primary font18 bold600">
                                                        {` ${
                                                            billingConfig[
                                                                cartData?.data?.currency?.toUpperCase()
                                                            ]
                                                        }`}
                                                        {
                                                            cartData?.data
                                                                ?.platform_fee
                                                        }
                                                    </span>
                                                </>
                                            )}
                                            .
                                            {cartData?.data?.currency?.toUpperCase() ===
                                                "INR" && (
                                                <em>(Exclusive of GST)</em>
                                            )}
                                        </span>
                                    ) : (
                                        <></>
                                    )}
                                </>
                            )}
                        </p>

                        <Button
                            type="primary manageSub__paymentBtn"
                            onClick={handleClickPay}
                            disabled={
                                billingCycle === -1 ||
                                !nol ||
                                !cartData.data.total_price ||
                                showBanner ||
                                cartData.loading
                            }
                            loading={
                                razor_pay_details.loading ||
                                subscription.loading
                            }
                        >
                            Proceed to Payment
                        </Button>
                    </div>
                </Spinner>
            )}
        </Modal>
    );
}

const Banner = () => {
    return (
        <p className={` trial_banner downgrade_banner expired marginT14`}>
            <ExclamationCircleFilled style={{ fontSize: "16px" }} />
            <span className="marginL12">
                No. of licences can’t be decreased if a package is active. You
                can increase the licence.
            </span>
        </p>
    );
};
