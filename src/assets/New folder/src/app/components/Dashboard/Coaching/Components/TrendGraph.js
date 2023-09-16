import React from "react";
import { useState } from "react";
import ReactApexChart from "react-apexcharts";
function TrendGraph({ x = [], y = [] }) {
    const [state, setState] = useState({
        series: [
            {
                name: "series1",
                data: y,
                fillColor: "#3396F7",
            },
        ],
        options: {
            colors: ["#52C41A"],
            chart: {
                height: 40,
                type: "area",
                sparkline: { enabled: true },
                toolbar: { show: false },
            },

            dataLabels: { enabled: false },
            legend: { show: false },
            yaxis: { show: false },
            xaxis: {
                show: false,
                labels: { show: false },
                axisBorder: { show: false },
                tooltip: { enabled: false },
                type: "datetime",
                categories: x,
            },

            stroke: {
                curve: "smooth",
                width: 1.5,
            },

            tooltip: {
                enabled: false,
                x: {
                    format: "dd/MM/yy HH:mm",
                },
            },
        },
    });

    return (
        <div id="chart">
            <ReactApexChart
                options={state.options}
                series={state.series}
                type="area"
                height={40}
            />
        </div>
    );
}

export default TrendGraph;
