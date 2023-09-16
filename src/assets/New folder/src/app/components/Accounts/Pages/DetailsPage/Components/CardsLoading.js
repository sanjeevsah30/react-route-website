import { Skeleton } from "antd";
import React from "react";

function CardsLoading(props) {
    return (
        <>
            {new Array(4).fill(true)?.map((_, idx) => (
                <Skeleton
                    loading={true}
                    active
                    avatar={{
                        size: "medium",
                    }}
                    title={{
                        width: "100%",
                    }}
                    className="paddingLR16 paddingT16"
                    paragraph={{
                        rows: 0,
                    }}
                    key={idx}
                />
            ))}
        </>
    );
}

export default CardsLoading;
