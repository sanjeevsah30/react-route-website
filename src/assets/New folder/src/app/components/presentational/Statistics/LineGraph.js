import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const LineGraph = ({ xArr, yArr, yAxisLabel }) => {
    const [chartsData, setChartsData] = useState([]);
    const [isOneMonth, setIsOneMonth] = useState(false);

    useEffect(() => {
        const data = [];
        for (let i = 0; i < xArr.length; i++) {
            data.push({
                x: new Date(xArr[i] * 1000).getTime(),
                y: yArr[i],
            });
        }
        if (data.length) {
            const start_date = new Date(data[0].x * 1000);
            const end_date = new Date(data[data.length - 1].x * 1000);
            if (end_date - start_date < 2678400000) {
                setIsOneMonth(true);
            } else {
                setIsOneMonth(false);
            }
        }

        setChartsData([
            {
                name: yAxisLabel,
                label: yAxisLabel,
                data,
            },
        ]);
    }, [xArr, yArr]);
    const options = {
        chart: {
            width: "100%",
            type: "line",
            zoom: {
                enabled: true,
                type: "x",
                autoScaleYaxis: false,
                zoomedArea: {
                    fill: {
                        color: "#90CAF9",
                        opacity: 0.4,
                    },
                    stroke: {
                        color: "#0D47A1",
                        opacity: 0.4,
                        width: 1,
                    },
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        markers: {
            size: [4],
        },
        stroke: {
            show: true,
            curve: "smooth",
            lineCap: "butt",

            width: 2,
            dashArray: 0,
            colors: ["#1A62F2"],
        },
        title: {},
        grid: {
            strokeDashArray: 5,
            xaxis: {
                lines: {
                    show: true,
                    offsetX: 0.5,
                    offsetY: 0.5,
                },
            },
            padding: {
                top: 0,
                right: 30,
                bottom: 20,
                left: 30,
            },
        },
        xaxis: {
            type: "datetime",
            offsetX: 10,
            // tickAmount: 10,
            title: {
                text: "Date",
                offsetX: 0,
                offsetY: 10,
                style: {
                    color: undefined,
                    fontSize: "14px",

                    fontWeight: 600,
                    cssClass: "apexcharts-xaxis-title",
                },
            },
            axisBorder: {
                show: true,
                color: "#78909C",
                offsetX: -10,
                offsetY: 0,
            },
        },
        yaxis: {
            labels: {
                formatter: function (val) {
                    return val?.toFixed(0);
                },
                offsetX: 20,
                offsetY: 0,
                style: {
                    colors: [],
                    fontSize: "12px",
                    fontFamily: "ProximaNova",
                    fontWeight: 600,
                    cssClass: "apexcharts-yaxis-label",
                },
            },
            min: 0,
            // max: maxY,
            title: {
                text: yAxisLabel,
                rotate: -90,
                offsetX: -10,
                offsetY: 0,
                style: {
                    color: undefined,
                    fontSize: "14px",
                    fontFamily: "ProximaNova",
                    fontWeight: 600,
                    cssClass: "apexcharts-yaxis-title",
                },
            },
            axisBorder: {
                show: true,
                color: "#78909C",
                offsetX: -2,
                offsetY: 0,
            },
        },
        legend: {
            position: "right",
            floating: false,
            offsetX: -20,
            offsetY: 35,
            itemMargin: {
                horizontal: 0,
                vertical: 5,
            },
        },
        tooltip: {
            enabled: true,
            x: {
                show: true,
                format: "dd MMM yyyy",
                formatter: undefined,
            },
            y: {
                formatter: function (value, series) {
                    // use series argument to pull original string from chart data
                    return series.series[0][series.dataPointIndex].toFixed(2);
                },
            },
            fixed: {
                enabled: true,
                position: "topRight",
                offsetX: 0,
                offsetY: 0,
            },
        },
    };

    return (
        <div>
            <ReactApexChart
                options={options}
                series={chartsData}
                type="line"
                height={400}
            />
        </div>
    );
};

export default LineGraph;
