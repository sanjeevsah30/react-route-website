import "./styles.scss";
import React, { createContext, useLayoutEffect, useState } from "react";
import BillingTabs from "./BillingTabs";
import Subscriptions from "./Subscriptions";
import BillingAdsCarousel from "./BillingAdsCarousel";
import BillingPlans from "./BillingPlans";
import BillingAdBanner from "./BillingAdBanner";
import ManageSubscription from "./ManageSubscription";
import useSearchParams from "hooks/useSearchParams";
import Invoices from "./Invoices";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "@presentational/reusables/Spinner";
import { setCreateSubscriptionFlag } from "@store/billing/billing";
import BillingInfo from "./BillingInfo";
import { useHistory } from "react-router-dom";
import routes from "@constants/Routes/index";

const tabIds = {
    SUBSCRIPTION: "subscription",
    INVOICES: "invoices",
    BILLING_INFO: "billing_info",
};

const BillingTabsData = [
    {
        id: tabIds.SUBSCRIPTION,
        value: "Subscriptions",
    },
    {
        id: tabIds.BILLING_INFO,
        value: "Billing Info",
    },
    {
        id: tabIds.INVOICES,
        value: "Invoices",
    },
];

export const BillingContext = createContext();
export default function Billing() {
    const [activeTab, setActiveTab] = useState(tabIds.SUBSCRIPTION);
    const [showManageSubscriptions, setShowManageSubscriptions] =
        useState(false);
    const {
        subscription: { data: subscriptionData, loading },
    } = useSelector((state) => state.billing);

    const history = useHistory();
    const handleActiveTab = (tab) => {
        // history.push(`/settings/billing/${tab}`);
        setActiveTab(tab);
    };

    const handleManageSubscriptionVisible = (status) => {
        setShowManageSubscriptions(status);
    };

    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        const { location } = history;

        // location?.pathname?.includes(`${routes.settings.billing}/invoices`) &&
        //     handleActiveTab(tabIds.INVOICES);

        // location?.pathname?.includes(
        //     `${routes.settings.billing}/billing_info`
        // ) && handleActiveTab(tabIds.BILLING_INFO);
    }, []);

    React.useEffect(() => {
        if (searchParams?.get("pay_now")) {
            dispatch(setCreateSubscriptionFlag(true));
            handleManageSubscriptionVisible(
                searchParams?.get("pay_now") === "true"
            );
        }
        if (searchParams?.get("manage")) {
            dispatch(setCreateSubscriptionFlag(false));
            handleManageSubscriptionVisible(
                searchParams?.get("manage") === "true"
            );
        }
    }, [searchParams]);

    return (
        <BillingContext.Provider
            value={{
                showManageSubscriptions,
                handleManageSubscriptionVisible,
            }}
        >
            <div className="app__billing">
                <Spinner loading={loading} alt="subscription_loader">
                    <BillingTabs
                        tabs={BillingTabsData}
                        activeTab={activeTab}
                        handleActiveTab={handleActiveTab}
                    />
                    <div className="app__billing--content">
                        {activeTab === tabIds.SUBSCRIPTION && <Subscriptions />}
                        {activeTab === tabIds.INVOICES && <Invoices />}
                        {activeTab === tabIds.BILLING_INFO && (
                            <BillingInfo isModal={false} />
                        )}
                        {activeTab !== tabIds.BILLING_INFO && (
                            <BillingAdsCarousel />
                        )}

                        {activeTab === tabIds.SUBSCRIPTION && (
                            <div className="app__billing--bottom">
                                <div className="app__billing--bottomLeft">
                                    <BillingPlans />
                                </div>
                                <div className="app__billing--bottomRight">
                                    {subscriptionData?.days_left < 16 && (
                                        <BillingAdBanner />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </Spinner>
            </div>
            <ManageSubscription />
        </BillingContext.Provider>
    );
}
