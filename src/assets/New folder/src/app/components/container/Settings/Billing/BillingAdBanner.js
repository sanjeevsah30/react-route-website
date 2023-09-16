import React, { useContext, useEffect } from "react";
import isEmpty from "lodash/isEmpty";
import { useDispatch, useSelector } from "react-redux";
import {
    getBillingAds,
    setCreateSubscriptionFlag,
} from "@store/billing/billing";
import bannerImg from "../../../../static/images/banner_billing.svg";
import speakerImg from "../../../../static/images/speaker.png";
import Spinner from "@presentational/reusables/Spinner";
import { Link } from "react-router-dom";
import { BillingContext } from "./index";

export default function BillingAdBanner() {
    const dispatch = useDispatch();

    const { handleManageSubscriptionVisible } = useContext(BillingContext);
    const { loading, data } = useSelector((state) => state.billing.ads);
    const {
        subscription: { data: subscriptionData },
    } = useSelector((state) => state.billing);

    useEffect(() => {
        if (isEmpty(data.banner)) {
            setTimeout(() => {
                dispatch(getBillingAds());
            }, 2000);
        }
    }, []);
    return (
        <Spinner loading={loading}>
            <div className="billing__adBanner">
                <img
                    src={bannerImg}
                    className="billing__adBanner--adimg"
                    alt="ad"
                />
                {!loading && (
                    <div className="billing__adBanner--content">
                        <img
                            src={speakerImg}
                            alt="speaker"
                            className="billing__adBanner--speaker"
                        />
                        {}
                        <p className="billing__adBanner--bannerTitle">
                            {subscriptionData?.days_left
                                ? `${subscriptionData?.days_left} days left`
                                : `Your Subscription has expired`}
                        </p>
                        <p
                            className="billing__adBanner--bannerText"
                            dangerouslySetInnerHTML={{
                                __html: subscriptionData?.days_left
                                    ? `You subscription period will expire in ${subscriptionData?.days_left} days. Upgrade your account now`
                                    : `Your subscription period has Expired. Upgrade your account now.`,
                            }}
                        />

                        <button
                            onClick={() => {
                                dispatch(setCreateSubscriptionFlag(true));
                                handleManageSubscriptionVisible(true);
                            }}
                            className="billing__adBanner--bannerCta curPoint"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span>Pay Now</span>
                        </button>
                    </div>
                )}
            </div>
        </Spinner>
    );
}
