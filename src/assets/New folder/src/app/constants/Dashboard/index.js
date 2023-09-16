const dashboardConfig = {
    colors: {
        good_cl: "#76b95c",
        avg_cl: "#eca51d",
        bad_cl: "#ff6365",
        hot: "#0057ae",
        warm: "#1A86F2",
        cold: "#5fbcff",
    },

    labelsFunc: ({ good, bad }) => {
        return [
            { label: "Good", color: "#76b95c", message: `Above ${good}%` },
            {
                label: "Average",
                color: "#eca51d",
                message: `Between ${good}% and ${bad}%`,
            },
            { label: "Bad", color: "#ff6365", message: `Below ${bad}%` },
            { label: "Overall Average", color: "#5fbcff", message: "overall" },
        ];
    },
    lead_labels: [
        { label: "Hot", color: "#0057ae" },
        { label: "Warm", color: "#1A86F2" },
        { label: "Cold", color: "#5fbcff" },
    ],
    violation_labels: [
        { label: "Red Alert", color: "#ea2f4a" },
        { label: "Critical", color: "#f38922" },
        { label: "Fatal", color: "#01b1d3" },
        { label: "Zero Tolerence", color: "#a431eb" },
        { label: "Compliance", color: "#5748b3" },
    ],
    violation_colors: ["#ea2f4a", "#f38922", "#01b1d3", "#a431eb", "#5748b3"],
    primary_cl: "#1a62f2",
    danger_cl: "#ff6365",
    gray_cl: "#e5e5e5",
};

export default dashboardConfig;
