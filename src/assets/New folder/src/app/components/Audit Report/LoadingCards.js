import { Col, Skeleton } from "antd";
import React from "react";

function LoadingCards({ count }) {
    return (
        <>
            {new Array(count).fill(0).map((_, idx) => (
                <Col xs={24} sm={24} md={12} lg={6} sl={6} key={idx}>
                    <div
                        className={`performance_card paddingLR16 paddingT23 posRel`}
                    >
                        <Skeleton
                            active
                            rows={1}
                            paragraph={true}
                            title={false}
                        />
                    </div>
                </Col>
            ))}
        </>
    );
}

LoadingCards.defaultProps = {
    count: 0,
};

export default LoadingCards;
