import React, { useContext, useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import { useDispatch, useSelector } from "react-redux";
import {
    getBillingPlans,
    setCreateSubscriptionFlag,
} from "@store/billing/billing";
import Spinner from "@presentational/reusables/Spinner";
import PhoneIconSvg from "app/static/svg/PhoneIconSvg";
import {
    capitalizeFirstLetter,
    firstLetterInWordCapital,
} from "@tools/helpers";
import billingConfig from "@constants/Billing/index";
import { BillingContext } from "./index";

export default function BillingPlans() {
    const dispatch = useDispatch();
    const {
        billing: { billingPlans, subscription },
        common: { versionData },
    } = useSelector((state) => state);
    const [selectedPlan, setSelectedPlan] = useState(billingPlans?.data?.[0]);
    const { handleManageSubscriptionVisible } = useContext(BillingContext);

    const isActive = (id) => id === subscription?.data?.plan_id;

    useEffect(() => {
        setSelectedPlan(billingPlans?.data?.[0]);
    }, [billingPlans]);
    return (
        <div className="billing__plans">
            <div className="billing__plans--header">
                <p className="billing__plans--headerTitle">
                    Here are the plans curated for you
                </p>
                <div className="billing__plans--plansContainer">
                    {billingPlans.data?.map((item) => (
                        <button
                            key={item.id}
                            className={`billing__plans--headerBtn ${
                                item.id === selectedPlan?.id ? "selected" : ""
                            }`}
                            onClick={() => setSelectedPlan(item)}
                        >
                            {firstLetterInWordCapital(item?.name)}
                        </button>
                    ))}
                </div>
            </div>
            <Spinner loading={billingPlans.loading} tip={"Loading Offers"}>
                <div className="billing__plans--offerCards">
                    {selectedPlan?.offer?.map((item) => (
                        <div
                            className="billing__plans--offerCard"
                            key={item.id}
                        >
                            <div className="billing__plans--pricing">
                                <p className="font20 bold600 capitalize">
                                    {!item.is_custom
                                        ? `${
                                              billingConfig[
                                                  item?.currency?.toUpperCase()
                                              ]
                                          }${item.pricing}`
                                        : item.pricing}
                                </p>
                                {item.currency && (
                                    <p className="font12">Per License</p>
                                )}
                            </div>
                            <p className="billing__plans--offerTitle">
                                {firstLetterInWordCapital(item.offername)}
                            </p>

                            <div className="flex justifySpaceBetween alignCenter">
                                <p className="billing__plans--users">
                                    {typeof item.pricing === "number"
                                        ? `Licenses <  ${item.max_licenses}`
                                        : `Licenses >  ${item.min_licenses}`}
                                </p>
                                <p className="billing__plans--persuasion">
                                    {item.plan_persuation}
                                </p>
                            </div>

                            <div className="billing__plans--bottom">
                                <p
                                    className="billing__plans--desc"
                                    dangerouslySetInnerHTML={{
                                        __html: item.offerdescription,
                                    }}
                                />
                                {item?.is_custom ? (
                                    <a
                                        className="billing__plans--upgradeCta"
                                        href={
                                            versionData?.contact_us_url ||
                                            "https://convin.ai"
                                        }
                                    >
                                        <PhoneIconSvg />
                                        <span className="marginL10">
                                            Contact Us
                                        </span>
                                    </a>
                                ) : (
                                    <button
                                        disabled={!selectedPlan.is_upgradeable}
                                        className="billing__plans--upgradeCta"
                                        onClick={() => {
                                            dispatch(
                                                setCreateSubscriptionFlag(false)
                                            );
                                            handleManageSubscriptionVisible(
                                                true
                                            );
                                        }}
                                    >
                                        Upgrade Now
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Spinner>
        </div>
    );
}
