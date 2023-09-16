export interface SubscriptionType {
    id: number;
    subscription_type: string;
    plan_id: number;
    total_licenses: number;
    active_licenses: number;
    billing_cycle: string;
    startdate: number;
    expirydate: number;
    days_left: number;
    currency: string;
    price_per_user: number;
}

export interface AvailableSubscriptionType {
    subscription_id: number;
    subscription_type: string;
    is_licenses_available: boolean;
}
