import React from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5wc from "@amcharts/amcharts5/wc";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { useEffect } from "react";
import { Modal } from "antd";

function WordCloud({ data = [], setWorldCloudVisible }) {
    useEffect(() => {
        var root = am5.Root.new("chartdiv");

        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([am5themes_Animated.new(root)]);

        // Add series
        // https://www.amcharts.com/docs/v5/charts/word-cloud/
        var series = root.container.children.push(
            am5wc.WordCloud.new(root, {
                categoryField: "tag",
                valueField: "weight",
                calculateAggregates: true,
                maxFontSize: am5.percent(24),
                minFontSize: am5.percent(12),
                angles: [0],
                // excludeWords: ["the", "a", "an"], // words "the", "a", and "an" will not appear in cloud
                maxCount: 100, // the cloud will limited to 100 words
                minValue: 2, // only words that appear twice or more in sourceText will appear in the cloud
                minWordLength: 2, // words must be 2 characters in length or more
            })
        );
        // Configure labels
        series.labels.template.setAll({
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 5,
            paddingRight: 5,
            fontFamily: "ProximaNova",
        });

        series.set("heatRules", [
            {
                target: series.labels.template,
                dataField: "value",
                min: am5.color(0x1a62f2),
                max: am5.color(0x6699ff),
                key: "fill",
            },
        ]);

        // Add click event on words
        // https://www.amcharts.com/docs/v5/charts/word-cloud/#Events
        // series.labels.template.events.on("click", function (ev) {
        //     const category = ev.target.dataItem.get("category");
        //     window.open("https://convin.ai/");
        //     window.open("https://convin.ai/" + encodeURIComponent(category));
        // });

        // This is for the animation after each 5sec
        // setTimeout(function () {
        //     am5.array.each(series.dataItems, function (dataItem) {
        //         var value = Math.random() * 65;
        //         value = value - Math.random() * value;
        //         dataItem.set('value', value);
        //         dataItem.set('valueWorking', value);
        //     });
        // }, 0);

        // Data from:
        // https://insights.stackoverflow.com/survey/2021#section-most-popular-technologies-programming-scripting-and-markup-languages
        setTimeout(() => series.data.setAll(data), 1000);
    }, []);

    return (
        <Modal
            onCancel={() => setWorldCloudVisible(false)}
            visible={true}
            footer={null}
            wrapClassName="word_cloud"
        >
            <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
        </Modal>
    );
}

export default WordCloud;
