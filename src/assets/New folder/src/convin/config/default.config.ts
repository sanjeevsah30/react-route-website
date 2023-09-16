import {
    formatDate,
    getCurrentQuater,
    getPreviousQuater,
} from "@convin/utils/helper/date.helper";

const today = new Date();

export const datekeys = {
    all: "all",
    today: "today",
    week: "week",
    last30days: "last30days",
    month: "month",
    custom: "custom",
    last_week: "last_week",
    last_month: "last_month",
    yesterday: "yesterday",
    current_quarter: "current_quarter",
    prevs_quarter: "prevs_quarter",
    before: "before",
    after: "after",
    rd7: "rd7",
    rd14: "rd14",
    rd30: "rd30",
    rd60: "rd60",
};

export const defaultConfig: {
    durationConfig: Record<
        string | number,
        { value: Array<number | null | never>; name: string }
    >;
    dateConfig: Record<
        string,
        {
            dateRange: Array<string | null | never | number>;
            name: string;
            is_roling_date: boolean;
            label: string;
        }
    >;
} = {
    durationConfig: {
        0: {
            value: [null, null],
            name: "Any",
        },
        1: {
            value: [0, 2],
            name: "below 2 min",
        },
        2: {
            value: [2, null],
            name: "above 2 min",
        },
        3: {
            value: [0, 5],
            name: "below 5 min",
        },
        4: {
            value: [5, null],
            name: "above 5 min",
        },
        5: {
            value: [10, null],
            name: "above 10 min",
        },
        6: {
            value: [15, null],
            name: "above 15 min",
        },
        7: {
            value: [null, null],
            name: "Custom",
        },
    },
    dateConfig: {
        [datekeys.all]: {
            name: "All",
            dateRange: [null, null],
            label: "",
            is_roling_date: false,
        },
        [datekeys.last30days]: {
            name: "Last 30 Days",
            dateRange: [
                formatDate(
                    new Date(new Date(today).setMonth(today.getMonth() - 1)),
                    true
                ),
                formatDate(today),
            ],
            label: "The Previous 30 Days Including Today",

            is_roling_date: false,
        },

        [datekeys.today]: {
            name: "Today",
            dateRange: [formatDate(today, true), formatDate(today)],
            label: "Today from midnight until the current time",

            is_roling_date: false,
        },
        [datekeys.yesterday]: {
            name: "Yesterday",
            dateRange: [
                formatDate(
                    new Date(new Date(today).setDate(today.getDate() - 1)),
                    true
                ),
                formatDate(
                    new Date(new Date(today).setDate(today.getDate() - 1))
                ),
            ],
            label: "The previous 24 hour day",

            is_roling_date: false,
        },
        [datekeys.week]: {
            name: "This Week",
            dateRange: [
                formatDate(
                    new Date(
                        new Date(today).setDate(
                            today.getDate() - today.getDay()
                        )
                    ),
                    true
                ),
                formatDate(today),
            ],
            label: "The current calendar week",

            is_roling_date: false,
        },
        [datekeys.last_week]: {
            name: "Last Week",
            dateRange: [
                formatDate(
                    new Date(
                        new Date(today).setDate(
                            today.getDate() - today.getDay() - 7
                        )
                    ),
                    true
                ),
                formatDate(
                    new Date(
                        new Date(today).setDate(
                            today.getDate() - today.getDay() - 1
                        )
                    )
                ),
            ],
            label: "The previous calendar week",

            is_roling_date: false,
        },
        [datekeys.month]: {
            name: "This Month",
            dateRange: [
                formatDate(
                    new Date(today.getFullYear(), today.getMonth(), 1),
                    true
                ),
                formatDate(today),
            ],
            label: "The current calendar month",

            is_roling_date: false,
        },
        [datekeys.last_month]: {
            name: "Last Month",
            dateRange: [
                formatDate(
                    new Date(today.getFullYear(), today.getMonth() - 1, 1),
                    true
                ),
                formatDate(new Date(today.getFullYear(), today.getMonth(), 0)),
            ],
            label: "The previous month",

            is_roling_date: false,
        },
        [datekeys.current_quarter]: {
            name: "Current Quarter",
            dateRange: getCurrentQuater(),
            label: "The current quarter",

            is_roling_date: false,
        },
        [datekeys.prevs_quarter]: {
            name: "Previous Quarter",
            dateRange: getPreviousQuater(),
            label: "The previous full quarter",

            is_roling_date: false,
        },
        [datekeys.custom]: {
            name: "Custom",
            dateRange: [null, null],
            is_roling_date: false,
            label: "",
        },
        [datekeys.rd7]: {
            name: "Last 7 Days (Excluding Today)",
            dateRange: [
                formatDate(
                    new Date(new Date(today).setDate(today.getDate() - 8)),
                    true
                ),
                formatDate(
                    new Date(new Date(today).setDate(today.getDate() - 1))
                ),
            ],
            is_roling_date: true,
            label: "The Previous 07 Days Excluding Today",
        },
        [datekeys.rd14]: {
            name: "Last 14 Days (Excluding Today)",
            dateRange: [
                formatDate(
                    new Date(new Date(today).setDate(today.getDate() - 15)),
                    true
                ),
                formatDate(
                    new Date(new Date(today).setDate(today.getDate() - 1))
                ),
            ],
            is_roling_date: true,
            label: "The Previous 14 Days Excluding Today",
        },
        [datekeys.rd30]: {
            name: "Last 30 Days (Excluding Today)",
            dateRange: [
                formatDate(
                    new Date(new Date(today).setDate(today.getDate() - 31)),
                    true
                ),
                formatDate(
                    new Date(new Date(today).setDate(today.getDate() - 1))
                ),
            ],
            is_roling_date: true,
            label: "The Previous 30 Days Excluding Today",
        },
        [datekeys.rd60]: {
            name: "Last 60 Days (Excluding Today)",
            dateRange: [
                formatDate(
                    new Date(new Date(today).setDate(today.getDate() - 61)),
                    true
                ),
                formatDate(
                    new Date(new Date(today).setDate(today.getDate() - 1))
                ),
            ],
            is_roling_date: true,
            label: "The Previous 60 Days Excluding Today",
        },
    },
};
