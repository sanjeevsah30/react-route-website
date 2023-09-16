import React from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useLayoutEffect } from "react";

export default function AmCharts({ data = [], x_label = "Parameters" }) {
    useLayoutEffect(() => {
        let root = am5.Root.new("chartdiv");

        root.setThemes([am5themes_Animated.new(root)]);

        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                wheelX: "panX",
                wheelY: "zoomX",
                layout: root.verticalLayout,
            })
        );

        // Define data

        let colors = chart.get("colors");

        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        let xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                categoryField: x_label,
                renderer: am5xy.AxisRendererX.new(root, {
                    minGridDistance: 30,
                }),
            })
        );

        xAxis.children.push(
            am5.Label.new(root, {
                text: x_label,
                x: am5.p50,
                centerX: am5.p50,
            })
        );

        xAxis.get("renderer").labels.template.setAll({
            oversizedBehavior: "truncate",
            maxWidth: 75,
            rotation: "-45",
            horizontalCenter: "right",
            verticalCenter: "middle",
        });

        xAxis.data.setAll(data);

        let yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {}),
            })
        );

        yAxis.children.unshift(
            am5.Label.new(root, {
                rotation: -90,
                text: "Error %",
                y: am5.p50,
                centerX: am5.p50,
            })
        );

        let paretoAxisRenderer = am5xy.AxisRendererY.new(root, {
            opposite: true,
        });
        let paretoAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: paretoAxisRenderer,
                min: 0,
                max: 100,
                strictMinMax: true,
            })
        );

        paretoAxis.children.push(
            am5.Label.new(root, {
                rotation: -90,
                text: "Cumulative %",
                y: am5.p50,
                centerX: am5.p50,
            })
        );

        paretoAxisRenderer.grid.template.set("forceHidden", true);
        paretoAxis.set("numberFormat", "#'%");

        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        let series = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "Error %",
                categoryXField: x_label,
            })
        );

        series.columns.template.setAll({
            tooltipText: "{categoryX}",
            tooltipY: 0,
            strokeOpacity: 0,
            cornerRadiusTL: 6,
            cornerRadiusTR: 6,
        });

        series.columns.template.adapters.add("fill", function (fill, target) {
            return "#1a62f2";
        });

        // pareto series
        let paretoSeries = chart.series.push(
            am5xy.LineSeries.new(root, {
                xAxis: xAxis,
                yAxis: paretoAxis,
                valueYField: "Cumulative %",
                categoryXField: x_label,
                stroke: "red",
                maskBullets: true,
            })
        );

        let paretoSeries2 = chart.series.push(
            am5xy.LineSeries.new(root, {
                xAxis: xAxis,
                yAxis: paretoAxis,
                valueYField: "divider",
                categoryXField: x_label,
                stroke: "orange",
                maskBullets: true,
                strokeWidth: 3,
                strokeDasharray: [10, 5, 2, 5],
            })
        );

        paretoSeries.bullets.push(function () {
            return am5.Bullet.new(root, {
                locationY: 1,
                sprite: am5.Circle.new(root, {
                    radius: 5,
                    fill: "red",
                    stroke: "red",
                }),
            });
        });

        series.data.setAll(data);
        paretoSeries.data.setAll(data);
        paretoSeries2.data.setAll(data);

        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear();
        chart.appear(1000, 100);

        return () => {
            root.dispose();
        };
    }, [data]);

    return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>;
}
