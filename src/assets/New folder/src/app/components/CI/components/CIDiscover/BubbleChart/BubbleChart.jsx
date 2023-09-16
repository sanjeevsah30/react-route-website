import React from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useEffect } from "react";
import { useRef } from "react";
import { useLayoutEffect } from "react";

import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";

export default function Bubble({ data = [], x_label = "Parameters" }) {
    useLayoutEffect(() => {
        let root = am5.Root.new("chartdiv");

        root.setThemes([am5themes_Animated.new(root)]);

        let container = root.container.children.push(
            am5xy.XYChart.new(root, {
                width: am5.percent(100),
                height: am5.percent(100),
            })
        );

        var series = container.children.push(
            am5hierarchy.ForceDirected.new(root, {
                downDepth: 1,
                initialDepth: 2,
                valueField: "value",
                categoryField: "name",
                idField: "name",
                childDataField: "children",
                linkWithField: "link",
                minRadius: 30,
                maxRadius: 50,
                manyBodyStrength: -1,
                nodePadding: 10,
                centerStrength: 0.5,

                paddingTop: 10,
            })
        );

        series.data.setAll([
            {
                name: "Root",
                value: 1000,
                children: new Array(29).fill(0).map((_, idx) => ({
                    name: "A0",
                    value: (idx + 1) * 200,
                })),
            },
        ]);
        series.set("selectedDataItem", series.dataItems[0]);

        return () => {
            root.dispose();
        };
    }, [data]);

    return <div id="chartdiv" style={{ width: "100%", height: "100%" }}></div>;
}
