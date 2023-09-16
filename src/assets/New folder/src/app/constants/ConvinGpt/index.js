const convinGptConfig = {
    targetAggregates: [
        {
            label: "Max",
            value: "max",
        },
        {
            label: "Exact",
            value: "exact",
        },
    ],
    targetFrequencies: [
        { value: "calls", label: "Calls" },
        { value: "hours", label: "Hours" },
        { value: "percentage", label: "Percentage" },
    ],
    steps: ["Configure", "Filters", "Target"],
    teamTagColors: ["#F4B860", "#9B8816", "#C12BB2"],
    repTagColor: "#1A62F233",
    badResponseOptions: [
        {
            label: "This is harmful / unsafe ",
            value: "This is harmful / unsafe ",
        },
        { label: "This isn’t true", value: "This isn’t true" },
        { label: "This isn’t helpful", value: "This isn’t helpful" },
    ],
};

export default convinGptConfig;
