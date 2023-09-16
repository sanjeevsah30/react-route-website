export interface Subscription {
    id: number;
    subscription_type: string;
    plan_id: number;
    startdate: string;
    expirydate: string;
    price_per_user: number;
    currency: string;
    billing_cycle: string;
    status: string;
    provider_subscription_id: string;
    remaining_count: number;
}

export interface AvailableSubscription {
    subscription_id: number;
    subscription_type: string;
    is_license_available: boolean;
}
