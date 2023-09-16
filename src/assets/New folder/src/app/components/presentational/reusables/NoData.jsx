import { Empty } from "antd";
import React from "react";

export default function NoData({ description }) {
    return (
        <Empty
            image={require("../../../static/images/icons/emptyv1.svg").default}
            imageStyle={{
                height: 60,
            }}
            description={<span className="font16 bold600">{description}</span>}
        />
    );
}

NoData.defaultProps = {
    description: "No Data Found",
};
