import { uid } from "@tools/helpers";

export const SUBSCRIPTIONS_DATA = {
    subscription_type: "free",
    plan_id: 1,
    id: 1,
    total_licenses: 16,
    active_licenses: 4,
    billing_cycle: "quarterly",
    startdate: 1615852800,
    days_left: 15,
    currency: "INR",
    price_per_user: 180,
    expirydate: "",
};

export const NEW_SUBSCRIPTIONS_DATA = {
    subscription_type: "paid",
    plan_id: 5,
    id: 5,
    total_licenses: 20,
    active_licenses: 0,
    billing_cycle: "quarterly",
    startdate: 1615852800,
    days_left: 120,
    currency: "INR",
    price_per_user: 180,
    expirydate: "",
};

export const BILLING_PLANS_DATA = [
    {
        id: 1,
        type: "monthly",
        is_upgradeable: false,
        promotion: 0,
        pricing_per_user: 50,
        currency: "inr",
        offer: [
            {
                id: 1,
                offername: "small team",
                offerdescription: "this plan is for small teams",
                min_licenses: 1,
                max_licenses: 30,
                plan_persuation: "",
                is_custom: false,
                currency: "inr",
                pricing: 50,
            },
            {
                id: 2,
                offername: "Enterprise",
                offerdescription: "this plan is for enterprise big teams",
                min_licenses: 30,
                max_licenses: 60,
                plan_persuation: "",
                is_custom: true,
                currency: "",
                pricing: "custom",
            },
        ],
    },
    {
        id: 2,
        type: "quarterly",
        is_upgradeable: true,
        promotion: 10,
        pricing_per_user: 50,
        currency: "inr",
        offer: [
            {
                id: 1,
                offername: "small team",
                offerdescription: "this plan is for small teams",
                min_licenses: 1,
                max_licenses: 30,
                plan_persuation: "",
                is_custom: false,
                currency: "inr",
                pricing: 160,
            },
            {
                id: 2,
                offername: "Enterprise",
                offerdescription: "this plan is for enterprise big teams",
                min_licenses: 30,
                max_licenses: 60,
                plan_persuation: "",
                is_custom: true,
                currency: "",
                pricing: "custom",
            },
        ],
    },
];

// export const BILLING_PLANS_DATA = [
//     {
//         id: 1,
//         name: 'Monthly',
//         is_upgradable: false,
//         offers: [
//             {
//                 id: 1,
//                 name: 'Small Team',
//                 users: '< 30',
//                 pricing: '$50',
//                 rate: 'Per User Per Month',
//                 is_custom: false,
//                 desc: 'Access to the complete software including integrations with CRM, dialers, video conferencing, calendar & messengers.<br/> No need to worry about different plans for different features.',
//                 plan_persuasion: '',
//             },
//             {
//                 id: 2,
//                 name: 'Enterprise',
//                 users: '> 30',
//                 pricing: 'Custom',
//                 rate: '',
//                 is_custom: true,
//                 desc: 'Access to the complete software including integrations with CRM, dialers, video conferencing, calendar & messengers.<br/> No need to worry about different plans for different features.',
//                 plan_persuasion: 'A plan that suits your team size',
//             },
//             {
//                 id: 112,
//                 name: 'Small Team',
//                 users: '< 30',
//                 pricing: '$50',
//                 rate: 'Per User Per Month',
//                 is_custom: false,
//                 desc: 'Access to the complete software including integrations with CRM, dialers, video conferencing, calendar & messengers.<br/> No need to worry about different plans for different features.',
//                 plan_persuasion: '',
//             },
//             {
//                 id: 22,
//                 name: 'Enterprise',
//                 users: '> 30',
//                 pricing: 'Custom',
//                 rate: '',
//                 is_custom: true,
//                 desc: 'Access to the complete software including integrations with CRM, dialers, video conferencing, calendar & messengers.<br/> No need to worry about different plans for different features.',
//                 plan_persuasion: 'A plan that suits your team size',
//             },
//         ],
//     },
//     {
//         id: 2,
//         name: 'Quarterly',
//         promotion: '5% off',
//         is_upgradable: false,
//         offers: [
//             {
//                 id: 1,
//                 name: 'Small Team',
//                 users: '< 30',
//                 pricing: '$80',
//                 rate: 'Per User Per Month',
//                 is_custom: false,
//                 desc: 'Access to the complete software including integrations with CRM, dialers, video conferencing, calendar & messengers.<br/> No need to worry about different plans for different features.',
//                 plan_persuasion: '',
//             },
//             {
//                 id: 2,
//                 name: 'Enterprise',
//                 users: '> 30',
//                 pricing: 'Custom',
//                 rate: '',
//                 is_custom: true,
//                 desc: 'Access to the complete software including integrations with CRM, dialers, video conferencing, calendar & messengers.<br/> No need to worry about different plans for different features.',
//                 plan_persuasion: 'A plan that suits your team size',
//             },
//         ],
//     },
//     {
//         id: 3,
//         name: 'Half Yearly',
//         promotion: '15% off',
//         is_upgradable: true,
//         offers: [
//             {
//                 id: 1,
//                 name: 'Small Team',
//                 users: '< 30',
//                 pricing: '$100',
//                 rate: 'Per User Per Month',
//                 is_custom: false,
//                 desc: 'Access to the complete software including integrations with CRM, dialers, video conferencing, calendar & messengers.<br/> No need to worry about different plans for different features.',
//                 plan_persuasion: '',
//             },
//             {
//                 id: 2,
//                 name: 'Enterprise',
//                 users: '> 30',
//                 pricing: 'Custom',
//                 rate: '',
//                 is_custom: true,
//                 desc: 'Access to the complete software including integrations with CRM, dialers, video conferencing, calendar & messengers.<br/> No need to worry about different plans for different features.',
//                 plan_persuasion: 'A plan that suits your team size',
//             },
//         ],
//     },
//     {
//         id: 4,
//         name: 'Yearly',
//         promotion: '25% off',
//         is_upgradable: true,
//         offers: [
//             {
//                 id: 1,
//                 name: 'Small Team',
//                 users: '< 30',
//                 pricing: '$200',
//                 rate: 'Per User Per Month',
//                 is_custom: false,
//                 desc: 'Access to the complete software including integrations with CRM, dialers, video conferencing, calendar & messengers.<br/> No need to worry about different plans for different features.',
//                 plan_persuasion: '',
//             },
//             {
//                 id: 2,
//                 name: 'Enterprise',
//                 users: '> 30',
//                 pricing: 'Custom',
//                 rate: '',
//                 is_custom: true,
//                 desc: 'Access to the complete software including integrations with CRM, dialers, video conferencing, calendar & messengers.<br/> No need to worry about different plans for different features.',
//                 plan_persuasion: 'A plan that suits your team size',
//             },
//         ],
//     },
// ];
export const ADS_DATA = {
    carousel: [
        {
            id: 1,
            text: "Place improves deal size by 74% by adding Convin's conversation intelligence to its sales stack.",
            cta_text: "Learn more",
            cta_link: "/settings/billing?pay_now=true",
            is_external: false,
        },
        {
            id: 2,
            text: "Place improves deal size by 74% by adding Convin's conversation intelligence to its sales stack.",
            cta_text: "Know more",
            cta_link: "https://convin.ai",
            is_external: true,
        },
    ],
    banner: {
        heading: "14 days Left",
        banner_text:
            "You <b>trial period</b> will expire in <b>14 days</b>. Upgrade your account now.",
        cta_text: "Pay Now",
        cta_link: "/settings/billing?pay_now=true",
        is_external: false,
    },
};
export const INVOICES_DATA = [
    {
        id: 2,
        invoice_no: "eiwjkwj323243",
        invoice_status: "paid",
        invoice_download_url:
            "https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf",
        invoice_date: 1615852800,
        price_per_user: 50,
        currency: "inr",
        plan_name: "",
        total_price: "",
    },
];

export const mockRPKeys = {
    id: "rzp_test_8iLskU9ias0CAT",
    key: "LL6DFcL6pa4WuFszkJHWoFZl",
};

export const billing_info = {
    company_name: "convin.ai",
    address: "xyz",
    country: "xyz",
    state: "xyz",
    city: "xyz",
    pincode: "123",
    currency: "INR",
    gst_number: "123",
};
